import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('🔍 Testando conexão com banco...')
    
    // Testar conexão
    await prisma.$connect()
    console.log('✅ Conexão estabelecida')
    
    // Buscar usuários
    const users = await prisma.companyUser.findMany({
      select: {
        id: true,
        cpf: true,
        fullName: true,
        email: true,
        role: true,
        active: true
      }
    })
    
    console.log(`✅ Encontrados ${users.length} usuários`)
    
    // Buscar usuário específico
    const thiagoUser = await prisma.companyUser.findUnique({
      where: { cpf: '02769256963' }
    })
    
    return NextResponse.json({
      success: true,
      database: {
        connected: true,
        totalUsers: users.length,
        users: users
      },
      thiagoUser: thiagoUser ? {
        id: thiagoUser.id,
        cpf: thiagoUser.cpf,
        fullName: thiagoUser.fullName,
        email: thiagoUser.email,
        role: thiagoUser.role,
        active: thiagoUser.active
      } : null,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL ? 'CONFIGURED' : 'NOT_CONFIGURED'
      }
    })
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL ? 'CONFIGURED' : 'NOT_CONFIGURED'
      }
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
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