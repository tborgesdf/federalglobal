import { NextRequest, NextResponse } from 'next/server'
import { getDomainContext } from '../../../../lib/utils/domain'
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
    console.log('🔍 Login endpoint chamado - versão simplificada')
    
    const domainContext = getDomainContext(request.headers.get('host') || undefined)
    const body: LoginRequest = await request.json()
    const { cpf, password, gpsData } = body

    console.log(`📍 Domain: ${domainContext.hostname}, CPF: ${cpf}`)

    // Validação básica
    if (!cpf || !password) {
      return NextResponse.json(
        { error: 'CPF e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar GPS (obrigatório)
    if (!gpsData || !gpsData.latitude || !gpsData.longitude) {
      return NextResponse.json(
        { error: 'GPS obrigatório para acesso ao sistema' },
        { status: 403 }
      )
    }

    // Limpar formatação do CPF
    const cleanCpf = cpf.replace(/\D/g, '')

    // Verificar credenciais no banco de dados
    const user = await CompanyUserService.verifyLogin(cleanCpf, password)

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

    console.log(`✅ Login bem-sucedido: ${user.fullName} (${user.role})`)

    // Gerar token de sessão simples
    const sessionToken = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Login bem-sucedido - versão simplificada
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
        type: domainContext.type
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
      { 
        error: 'Erro interno do servidor',
        debug: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}