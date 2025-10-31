import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Testar conexão
    await prisma.$connect()
    
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
        active: thiagoUser.active,
        hasPassword: !!thiagoUser.password
      } : null
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      databaseUrl: process.env.DATABASE_URL ? 'CONFIGURED' : 'NOT_CONFIGURED'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}