import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SecurityUtils } from '@/lib/utils/security'

// GET - Listar usuários
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação (implementação básica)
    const sessionToken = request.cookies.get('session_token')?.value
    
    if (!sessionToken) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Buscar todos os usuários com dados de último acesso
    const users = await prisma.companyUser.findMany({
      select: {
        id: true,
        cpf: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        photo: true,
        protocolNumber: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        accessLogs: {
          orderBy: {
            accessDateTime: 'desc'
          },
          take: 1,
          include: {
            networkCapture: true,
            deviceCapture: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Processar dados para incluir status online e última conexão
    // @ts-ignore - Prisma dynamic types
    const processedUsers = users.map((user: any) => {
      const lastAccess = user.accessLogs[0]
      const isOnline = lastAccess ? 
        (new Date().getTime() - new Date(lastAccess.accessDateTime).getTime()) < 15 * 60 * 1000 : // 15 minutos
        false

      return {
        id: user.id,
        cpf: user.cpf,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        photo: user.photo,
        protocolNumber: user.protocolNumber,
        active: user.active,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        lastAccess: lastAccess ? {
          accessDateTime: lastAccess.accessDateTime.toISOString(),
          ipAddress: lastAccess.ipAddress,
          networkCapture: lastAccess.networkCapture,
          deviceCapture: lastAccess.deviceCapture
        } : null,
        isOnline
      }
    })

    return NextResponse.json({
      success: true,
      users: processedUsers
    })

  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar novo usuário
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // @ts-ignore - Dynamic body properties
    const { cpf, fullName, birthDate, email, phone, role, password: userPassword, active = true } = body

    // Validações básicas
    if (!cpf || !fullName || !birthDate || !email || !phone || !role || !userPassword) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar CPF
    if (cpf.length !== 11 || !/^\d+$/.test(cpf)) {
      return NextResponse.json(
        { error: 'CPF deve conter exatamente 11 dígitos' },
        { status: 400 }
      )
    }

    // Validar role
    if (!['USER', 'ADMIN'].includes(role)) {
      return NextResponse.json(
        { error: 'Função deve ser USER ou ADMIN' },
        { status: 400 }
      )
    }

    // Verificar se CPF já existe
    const existingUserByCPF = await prisma.companyUser.findUnique({
      where: { cpf }
    })

    if (existingUserByCPF) {
      return NextResponse.json(
        { error: 'CPF já cadastrado no sistema' },
        { status: 409 }
      )
    }

    // Verificar se email já existe
    const existingUserByEmail = await prisma.companyUser.findUnique({
      where: { email }
    })

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: 'Email já cadastrado no sistema' },
        { status: 409 }
      )
    }

    // Gerar número de protocolo único
    const protocolNumber = `FG${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100)}`

    // Criptografar senha
    const hashedPassword = await SecurityUtils.hashPassword(userPassword)

    // Criar usuário
    const newUser = await prisma.companyUser.create({
      data: {
        cpf,
        fullName,
        birthDate: new Date(birthDate),
        email,
        phone,
        role: role as 'USER' | 'ADMIN',
        password: hashedPassword,
        protocolNumber,
        active
      }
    })

    // Retornar dados do usuário (sem senha)
    // @ts-ignore - Password exclusion
    const { password: _, ...userResponse } = newUser

    return NextResponse.json({
      success: true,
      message: 'Usuário criado com sucesso',
      user: {
        ...userResponse,
        id: userResponse.id,
        createdAt: userResponse.createdAt.toISOString()
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}