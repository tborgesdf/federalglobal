import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: 'Debug API funcionando',
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL ? 'CONFIGURED' : 'NOT_CONFIGURED',
        DATABASE_URL_START: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 30) + '...' : 'NOT_FOUND'
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL ? 'CONFIGURED' : 'NOT_CONFIGURED'
      }
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { cpf, password } = await request.json()
    
    console.log(`🔍 Testando login: CPF=${cpf}`)
    
    const cleanCpf = cpf.replace(/\D/g, '')
    console.log(`🔍 CPF limpo: ${cleanCpf}`)
    
    const user = await prisma.companyUser.findUnique({
      where: { cpf: cleanCpf }
    })
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Usuário não encontrado',
        cpf: cleanCpf
      })
    }
    
    // Para teste, vamos usar bcrypt direto
    const bcrypt = require('bcryptjs')
    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        cpf: user.cpf,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        active: user.active
      },
      passwordValid: isPasswordValid,
      passwordHash: user.password.substring(0, 20) + '...'
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}