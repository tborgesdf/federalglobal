import { NextRequest, NextResponse } from 'next/server'
import { getDomainContext } from '../../../../lib/utils/domain'
import { logAction } from '../../../../lib/utils/logger'
import { CompanyUserService } from '@/lib/services/companyUserService'

interface LoginRequest {
  cpf: string
  password: string
  gpsData?: {
    latitude: number
    longitude: number
    accuracy: number
  }
}

export async function POST(request: NextRequest) {
  try {
    const domainContext = getDomainContext(request.headers.get('host') || undefined)
    const body: LoginRequest = await request.json()
    const { cpf, password, gpsData } = body

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

    // Validar GPS (obrigatório)
    if (!gpsData || !gpsData.latitude || !gpsData.longitude) {
      await logAction({
        action: 'login_blocked_no_gps',
        details: { 
          cpf: cleanCpf,
          domain: domainContext.hostname,
          type: domainContext.type
        },
        status: 'warning'
      })

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
      
      await logAction({
        action: 'login_failed',
        details: { 
          cpf: cleanCpf,
          domain: domainContext.hostname,
          type: domainContext.type,
          reason: 'database_error'
        },
        status: 'error'
      })

      return NextResponse.json(
        { error: 'Erro de conexão com o banco de dados' },
        { status: 500 }
      )
    }

    if (!user) {
      await logAction({
        action: 'login_failed',
        details: { 
          cpf: cleanCpf,
          domain: domainContext.hostname,
          type: domainContext.type,
          reason: 'invalid_credentials'
        },
        status: 'warning'
      })

      return NextResponse.json(
        { error: 'CPF ou senha inválidos' },
        { status: 401 }
      )
    }

    // Verificar se o usuário tem permissão para acessar este domínio
    if (domainContext.isAdmin && !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      await logAction({
        action: 'login_blocked_insufficient_role',
        details: { 
          cpf: cleanCpf,
          domain: domainContext.hostname,
          type: domainContext.type,
          userRole: user.role,
          requiredRoles: requiredRole
        },
        status: 'warning'
      })

      return NextResponse.json(
        { error: 'Sem permissão para acessar o painel administrativo' },
        { status: 403 }
      )
    }

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
        token: generateSessionToken(),
        expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 horas
        domain: domainContext.hostname,
        type: domainContext.type
      },
      gps: gpsData,
      context: {
        domain: domainContext.hostname,
        type: domainContext.type,
        isAdmin: domainContext.isAdmin,
        isClient: domainContext.isClient,
        redirectTo: domainContext.isAdmin ? '/admin' : '/client/dashboard'
      }
    }

    await logAction({
      action: 'login_success',
      details: { 
        userId: user.id,
        cpf: cleanCpf,
        domain: domainContext.hostname,
        type: domainContext.type,
        role: user.role,
        gps: gpsData
      },
      status: 'success'
    })

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
    await logAction({
      action: 'login_error',
      details: { 
        error: error instanceof Error ? error.message : 'Unknown error',
        hostname: request.headers.get('host')
      },
      status: 'error'
    })

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