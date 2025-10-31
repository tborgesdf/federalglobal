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

    // Determinar permissões baseado no domínio
    let requiredRole: string[]

    if (domainContext.isAdmin) {
      requiredRole = ['ADMIN', 'SUPER_ADMIN']
    } else {
      requiredRole = ['USER', 'CLIENT']
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
      // Criar alerta de segurança
      await prisma.securityAlert.create({
        data: {
          userId: user.id,
          alertType: 'CONCURRENT_SESSION',
          message: `Tentativa de login simultâneo detectada para ${user.fullName}`,
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
            }
          }),
          severity: 'HIGH'
        }
      })

      // Invalidar sessão anterior
      await prisma.activeSession.update({
        where: { id: existingSession.id },
        data: { isActive: false }
      })

      console.log(`⚠️ Sessão simultânea detectada para usuário ${user.id}. Sessão anterior invalidada.`)
    }

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
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Função para gerar token de sessão
function generateSessionToken(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${Math.random().toString(36).substr(2, 9)}`
}