import { NextRequest, NextResponse } from 'next/server'
import { getDomainContext } from '../../../../lib/utils/domain'
import { LogService } from '../../../../lib/utils/logger'
import { CompanyUserService } from '@/lib/services/companyUserService'
import { prisma } from '@/lib/prisma'

interface LoginRequest {
  cpf: string
  password: string
  gpsData?: {
    latitude: number
    longitude: number
    accuracy: number
  }
  deviceInfo?: {
    userAgent: string
    platform: string
    language: string
    screenResolution: string
    timezone: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const domainContext = getDomainContext(request.headers.get('host') || undefined)
    const body: LoginRequest = await request.json()
    const { cpf, password, gpsData, deviceInfo } = body

    // Validação básica
    if (!cpf || !password) {
      return NextResponse.json(
        { error: 'CPF e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Limpar formatação do CPF
    const cleanCpf = cpf.replace(/\D/g, '')
    
    console.log('🔍 Debug Login:')
    console.log(`   CPF original: ${cpf}`)
    console.log(`   CPF limpo: ${cleanCpf}`)
    console.log(`   Senha: ${password}`)
    console.log(`   Domain: ${domainContext.hostname}`)
    console.log(`   IsAdmin: ${domainContext.isAdmin}`)
    console.log(`   GPS Data:`, gpsData)
    console.log(`   Device Info:`, deviceInfo)

    // Validar GPS (obrigatório)
    if (!gpsData || !gpsData.latitude || !gpsData.longitude) {
      return NextResponse.json(
        { error: 'GPS obrigatório para acesso ao sistema' },
        { status: 403 }
      )
    }

    // Verificar credenciais no banco de dados
    let user = null
    
    try {
      console.log(`🔍 Tentando login no banco com CPF: ${cleanCpf}`)
      user = await CompanyUserService.verifyLogin(cleanCpf, password)
      console.log(`🔍 Resultado da verificação: ${user ? 'USUÁRIO ENCONTRADO' : 'USUÁRIO NÃO ENCONTRADO'}`)
      if (user) {
        console.log(`   Nome: ${user.fullName}`)
        console.log(`   Role: ${user.role}`)
        console.log(`   Email: ${user.email}`)
      }
    } catch (error) {
      console.error('❌ Erro ao verificar login:', error)
      
      return NextResponse.json(
        { error: 'Erro de conexão com o banco de dados' },
        { status: 500 }
      )
    }

    if (!user) {
      return NextResponse.json(
        { error: 'CPF ou senha inválidos' },
        { status: 401 }
      )
    }

    // Verificar se o usuário tem permissão para acessar este domínio
    if (domainContext.isAdmin && !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Sem permissão para acessar o painel administrativo' },
        { status: 403 }
      )
    }

    // Capturar dados de rede e dispositivo para uso nas verificações
    const { networkData, deviceData } = await LogService.captureFullAccessData(
      request, 
      { lat: gpsData.latitude, lng: gpsData.longitude }
    )

    // Verificar tentativas de login recentes para este usuário
    const recentAttempts = await prisma.loginAttempt.findFirst({
      where: {
        userId: user.id,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Últimas 24 horas
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Verificar se a conta está bloqueada
    if (recentAttempts?.blockedUntil && recentAttempts.blockedUntil > new Date()) {
      const timeLeft = Math.ceil((recentAttempts.blockedUntil.getTime() - Date.now()) / (60 * 60 * 1000)) // Horas
      
      // Registrar tentativa em conta bloqueada
      await prisma.loginAttempt.create({
        data: {
          userId: user.id,
          ipAddress: networkData.ipAddress,
          userAgent: request.headers.get('user-agent') || '',
          attemptType: 'BLOCKED_ACCOUNT_ATTEMPT',
          successful: false
        }
      })

      return NextResponse.json(
        { 
          error: 'Conta temporariamente bloqueada',
          message: `Sua conta foi bloqueada devido a múltiplas tentativas de login simultâneo. Tente novamente em ${timeLeft} horas ou procure o administrador do sistema.`,
          blockedUntil: recentAttempts.blockedUntil,
          contactAdmin: true
        },
        { status: 423 } // 423 Locked
      )
    }

    // Verificar se já existe uma sessão ativa para este usuário
    const existingSession = await prisma.activeSession.findFirst({
      where: {
        userId: user.id,
        isActive: true,
        lastActivity: {
          gte: new Date(Date.now() - 15 * 60 * 1000) // Últimos 15 minutos
        }
      }
    })

    // Se existe sessão ativa em outro dispositivo
    if (existingSession) {
      // Atualizar contador de tentativas consecutivas
      const consecutiveFails = (recentAttempts?.consecutiveFails || 0) + 1
      
      // Criar registro de tentativa de login simultâneo
      await prisma.loginAttempt.create({
        data: {
          userId: user.id,
          ipAddress: networkData.ipAddress,
          userAgent: request.headers.get('user-agent') || '',
          attemptType: 'CONCURRENT_SESSION_ATTEMPT',
          successful: false,
          consecutiveFails: consecutiveFails,
          lastFailedAt: new Date()
        }
      })

      // Se já são 3 ou mais tentativas, bloquear a conta
      if (consecutiveFails >= 3) {
        const blockDuration = 24 * 60 * 60 * 1000 // 24 horas
        const blockedUntil = new Date(Date.now() + blockDuration)
        
        // Atualizar o registro de tentativas com o bloqueio
        await prisma.loginAttempt.updateMany({
          where: {
            userId: user.id,
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
          },
          data: {
            blockedUntil: blockedUntil
          }
        })

        // Criar alerta de bloqueio de conta
        await prisma.securityAlert.create({
          data: {
            userId: user.id,
            alertType: 'FAILED_LOGIN_ATTEMPTS',
            message: `Conta de ${user.fullName} foi bloqueada após 3 tentativas de login simultâneo`,
            details: JSON.stringify({
              consecutiveAttempts: consecutiveFails,
              blockedUntil: blockedUntil,
              lastAttempt: {
                ip: networkData.ipAddress,
                userAgent: request.headers.get('user-agent'),
                location: `${deviceData.deviceCity}, ${deviceData.deviceCountry}`
              }
            }),
            severity: 'CRITICAL'
          }
        })

        return NextResponse.json(
          { 
            error: 'Conta bloqueada por segurança',
            message: 'Sua conta foi bloqueada após 3 tentativas de login simultâneo. Entre em contato com o administrador do sistema para desbloqueio.',
            blocked: true,
            contactAdmin: true,
            blockedUntil: blockedUntil
          },
          { status: 423 }
        )
      }

      // Primeira ou segunda tentativa - apenas avisar
      const remainingAttempts = 3 - consecutiveFails
      
      // Criar alerta de segurança
      await prisma.securityAlert.create({
        data: {
          userId: user.id,
          alertType: 'CONCURRENT_SESSION',
          message: `Tentativa de login simultâneo detectada para ${user.fullName} (${consecutiveFails}ª tentativa)`,
          details: JSON.stringify({
            currentDevice: {
              ip: networkData.ipAddress,
              userAgent: deviceInfo?.userAgent || request.headers.get('user-agent'),
              location: `${deviceData.deviceCity}, ${deviceData.deviceCountry}`
            },
            existingSession: {
              ip: existingSession.ipAddress,
              lastActivity: existingSession.lastActivity,
              sessionToken: existingSession.sessionToken.substring(0, 10) + '...'
            },
            attemptsRemaining: remainingAttempts
          }),
          severity: consecutiveFails >= 2 ? 'HIGH' : 'MEDIUM'
        }
      })

      return NextResponse.json(
        { 
          error: 'Sessão ativa detectada',
          message: `Você já está logado em outro dispositivo. Tentativa ${consecutiveFails} de 3. ${remainingAttempts} tentativas restantes antes do bloqueio.`,
          concurrentSession: true,
          attemptsRemaining: remainingAttempts,
          existingDevice: {
            ip: existingSession.ipAddress,
            lastActivity: existingSession.lastActivity
          }
        },
        { status: 409 } // 409 Conflict
      )
    }

    // Se chegou até aqui, resetar contador de tentativas falhadas
    await prisma.loginAttempt.updateMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      },
      data: {
        consecutiveFails: 0,
        blockedUntil: null
      }
    })

    // Capturar dados completos do acesso
    let accessLogId: number | null = null
    
    try {
      console.log('🔍 Capturando dados completos do acesso...')
      
      // Determinar tipo de acesso
      let accessType: 'SUPER_ADMIN_DASHBOARD' | 'ADMIN_DASHBOARD' | 'USER_DASHBOARD' | 'CLIENT_PORTAL'
      
      if (user.role === 'SUPER_ADMIN') {
        accessType = 'SUPER_ADMIN_DASHBOARD'
      } else if (user.role === 'ADMIN') {
        accessType = 'ADMIN_DASHBOARD' 
      } else if (domainContext.isAdmin) {
        accessType = 'USER_DASHBOARD'
      } else {
        accessType = 'CLIENT_PORTAL'
      }

      // Adicionar informações extras do dispositivo se fornecidas
      if (deviceInfo) {
        deviceData.navigationData = {
          platform: deviceInfo.platform,
          language: deviceInfo.language,
          screenResolution: deviceInfo.screenResolution,
          timezone: deviceInfo.timezone,
          timestamp: new Date().toISOString()
        }
      }

      // Criar log de acesso com dados completos
      accessLogId = await LogService.createAccessLog({
        userId: user.id,
        accessType,
        ipAddress: networkData.ipAddress,
        successful: true,
        networkData,
        deviceData
      })

      console.log(`✅ Dados capturados e salvos no AccessLog ID: ${accessLogId}`)
    } catch (captureError) {
      console.error('⚠️ Erro ao capturar dados do acesso:', captureError)
      // Continuar com o login mesmo se a captura falhar
    }

    // Gerar token de sessão
    const sessionToken = generateSessionToken()

    // Criar nova sessão ativa
    await prisma.activeSession.create({
      data: {
        userId: user.id,
        sessionToken,
        ipAddress: networkData.ipAddress,
        userAgent: deviceInfo?.userAgent || request.headers.get('user-agent') || '',
        deviceInfo: JSON.stringify({
          operatingSystem: deviceData.operatingSystem,
          browser: deviceData.browser,
          deviceType: deviceData.deviceType,
          deviceModel: deviceData.deviceModel,
          deviceBrand: deviceData.deviceBrand,
          connectionType: deviceData.connectionType,
          networkType: deviceData.networkType
        }),
        lastActivity: new Date(),
        isActive: true
      }
    })

    // Login bem-sucedido
    const loginData = {
      user: {
        id: user.id,
        name: user.fullName,
        email: user.email,
        role: user.role,
        cpf: cleanCpf
      },
      session: {
        token: sessionToken,
        expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 horas
        domain: domainContext.hostname,
        type: domainContext.type,
        accessLogId
      },
      gps: gpsData,
      context: {
        domain: domainContext.hostname,
        type: domainContext.type,
        isAdmin: domainContext.isAdmin,
        isClient: domainContext.isClient,
        redirectTo: user.role === 'SUPER_ADMIN' ? '/admin/selection' : 
                   domainContext.isAdmin ? '/admin' : '/client/dashboard'
      }
    }

    // Configurar cookie de sessão
    const response = NextResponse.json({
      success: true,
      data: loginData
    })

    response.cookies.set('session_token', loginData.session.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 // 8 horas
    })

    response.cookies.set('user_type', domainContext.type, {
      httpOnly: false,
      secure: true,
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 // 8 horas
    })

    return response

  } catch (error) {
    console.error('❌ Erro interno no login:', error)
    
    // Log detalhado do erro para debug
    console.error('Stack trace:', error instanceof Error ? error.stack : error)
    console.error('Error message:', error instanceof Error ? error.message : String(error))
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        debug: process.env.NODE_ENV === 'development' ? {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        } : undefined
      },
      { status: 500 }
    )
  }
}

// Função para gerar token de sessão
function generateSessionToken(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${Math.random().toString(36).substr(2, 9)}`
}