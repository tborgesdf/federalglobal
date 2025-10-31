import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cpf, password } = body

    console.log('🔍 Test API chamada')
    console.log(`   CPF: ${cpf}`)
    console.log(`   Password: ${password}`)

    // Simular credenciais de teste
    const cleanCpf = cpf.replace(/\D/g, '')
    
    if (cleanCpf === '02769256963' && password === 'Ale290800-####$2') {
      return NextResponse.json({
        success: true,
        message: 'Credenciais corretas!',
        user: {
          cpf: cleanCpf,
          name: 'Thiago Ferreira Alves e Borges',
          role: 'SUPER_ADMIN'
        }
      })
    }

    return NextResponse.json({
      success: false,
      message: 'Credenciais incorretas',
      received: {
        cpf: cleanCpf,
        password: password
      }
    }, { status: 401 })

  } catch (error) {
    console.error('❌ Erro na API test:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}