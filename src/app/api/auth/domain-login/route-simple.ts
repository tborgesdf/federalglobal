import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Login endpoint chamado')
    
    // Testar se consegue fazer parse do body
    let body;
    try {
      body = await request.json()
      console.log('✅ Body parseado com sucesso')
    } catch (parseError) {
      console.error('❌ Erro ao fazer parse do body:', parseError)
      return NextResponse.json(
        { error: 'Erro ao processar dados da requisição', debug: String(parseError) },
        { status: 400 }
      )
    }
    
    const { cpf, password, gpsData } = body
    
    console.log(`🔍 Dados recebidos - CPF: ${cpf}, GPS: ${gpsData ? 'Presente' : 'Ausente'}`)
    
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
    
    console.log('✅ Validações básicas passaram')
    
    // Importar dependências dentro do try/catch
    let CompanyUserService, getDomainContext;
    try {
      const domainModule = await import('../../../../lib/utils/domain')
      const serviceModule = await import('@/lib/services/companyUserService')
      
      getDomainContext = domainModule.getDomainContext
      CompanyUserService = serviceModule.CompanyUserService
      
      console.log('✅ Módulos importados com sucesso')
    } catch (importError) {
      console.error('❌ Erro ao importar módulos:', importError)
      return NextResponse.json(
        { error: 'Erro interno - módulos', debug: String(importError) },
        { status: 500 }
      )
    }
    
    // Testar domain context
    let domainContext;
    try {
      domainContext = getDomainContext(request.headers.get('host') || undefined)
      console.log(`✅ Domain context: ${domainContext.hostname} (${domainContext.type})`)
    } catch (domainError) {
      console.error('❌ Erro no domain context:', domainError)
      return NextResponse.json(
        { error: 'Erro interno - domain', debug: String(domainError) },
        { status: 500 }
      )
    }
    
    // Testar verificação de usuário
    const cleanCpf = cpf.replace(/\D/g, '')
    console.log(`🔍 Tentando verificar usuário com CPF: ${cleanCpf}`)
    
    let user;
    try {
      user = await CompanyUserService.verifyLogin(cleanCpf, password)
      console.log(`✅ Verificação de login: ${user ? 'SUCESSO' : 'FALHOU'}`)
    } catch (loginError) {
      console.error('❌ Erro na verificação de login:', loginError)
      return NextResponse.json(
        { error: 'Erro na verificação de credenciais', debug: String(loginError) },
        { status: 500 }
      )
    }
    
    if (!user) {
      return NextResponse.json(
        { error: 'CPF ou senha inválidos' },
        { status: 401 }
      )
    }
    
    // Se chegou até aqui, é sucesso básico
    return NextResponse.json({
      success: true,
      message: 'Login simplificado funcionando',
      user: {
        name: user.fullName,
        role: user.role
      }
    })
    
  } catch (error) {
    console.error('❌ Erro geral:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        debug: String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}