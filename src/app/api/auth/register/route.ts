import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { SecurityUtils } from '@/lib/utils/security'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { 
      name, 
      email, 
      cpf, 
      phone, 
      birthDate,
      password: userPassword, 
      acceptedTerms,
      termsAcceptedAt,
      gpsData,
      deviceInfo 
    } = await request.json()

    // Validações básicas
    if (!name || !email || !cpf || !phone || !birthDate || !userPassword) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    if (userPassword.length < 8) {
      return NextResponse.json(
        { error: 'A senha deve ter pelo menos 8 caracteres' },
        { status: 400 }
      )
    }

    if (!acceptedTerms) {
      return NextResponse.json(
        { error: 'Você deve aceitar os termos de uso' },
        { status: 400 }
      )
    }

    if (!gpsData || !gpsData.latitude || !gpsData.longitude) {
      return NextResponse.json(
        { error: 'Localização GPS é obrigatória para o cadastro' },
        { status: 400 }
      )
    }

    // Validar se usuário é maior de 18 anos
    const birthDateObj = new Date(birthDate)
    const today = new Date()
    const age = today.getFullYear() - birthDateObj.getFullYear()
    const monthDiff = today.getMonth() - birthDateObj.getMonth()
    
    if (age < 18 || (age === 18 && monthDiff < 0) || 
        (age === 18 && monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      return NextResponse.json(
        { error: 'Você deve ter pelo menos 18 anos para se cadastrar' },
        { status: 400 }
      )
    }

    // Verificar se já existe usuário com esse CPF ou email
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { cpf: cpf.replace(/\D/g, '') },
          { email: email }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Usuário já existe com este CPF ou email' },
        { status: 409 }
      )
    }

    // Hash da senha
    const hashedPassword = await SecurityUtils.hashPassword(userPassword)

    // Criar usuário
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        cpf: cpf.replace(/\D/g, ''),
        phone: phone.replace(/\D/g, ''),
        birthDate: new Date(birthDate),
        password: hashedPassword,
        role: 'USER',
        isActive: true,
        emailVerified: false,
        acceptedTerms: acceptedTerms,
        termsAcceptedAt: termsAcceptedAt ? new Date(termsAcceptedAt) : new Date(),
        gpsLatitude: gpsData.latitude,
        gpsLongitude: gpsData.longitude,
        deviceInfo: JSON.stringify(deviceInfo),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    // Log de segurança
    console.log(`🛡️ Novo usuário registrado: ${email} | GPS: ${gpsData.latitude}, ${gpsData.longitude} | Device: ${deviceInfo?.userAgent || 'unknown'}`)

    // Remover senha da resposta
    const { password: _, ...userResponse } = newUser

    return NextResponse.json({
      success: true,
      message: 'Usuário criado com sucesso',
      user: userResponse
    })

  } catch (error) {
    console.error('Erro no cadastro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}