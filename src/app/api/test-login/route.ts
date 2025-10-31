import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { cpf, password } = await request.json()
    
    const cleanCpf = cpf.replace(/\D/g, '')
    console.log(`🔍 Testando login: CPF=${cleanCpf}, Password=${password}`)
    
    // Buscar usuário
    const user = await prisma.companyUser.findUnique({
      where: { cpf: cleanCpf }
    })
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Usuário não encontrado',
        debug: { cpf: cleanCpf }
      })
    }
    
    console.log(`🔍 Usuário encontrado: ${user.fullName}`)
    console.log(`🔍 Hash da senha no banco: ${user.password}`)
    
    // Testar senha
    const isPasswordValid = await bcrypt.compare(password, user.password)
    console.log(`🔍 Senha válida: ${isPasswordValid}`)
    
    return NextResponse.json({
      success: isPasswordValid,
      user: {
        id: user.id,
        cpf: user.cpf,
        fullName: user.fullName,
        role: user.role
      },
      debug: {
        passwordProvided: password,
        passwordHash: user.password.substring(0, 20) + '...',
        passwordValid: isPasswordValid
      }
    })
    
  } catch (error) {
    console.error('❌ Erro:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}