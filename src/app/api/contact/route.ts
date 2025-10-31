import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    // Validações
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Capturar informações do dispositivo e rede
    const userAgent = request.headers.get('user-agent') || ''
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1'
    
    const deviceInfo = {
      userAgent,
      ip,
      timestamp: new Date().toISOString(),
      referer: request.headers.get('referer') || '',
      acceptLanguage: request.headers.get('accept-language') || ''
    }

    // Salvar no banco de dados (vamos criar uma tabela ContactForm)
    const contactForm = await prisma.contactForm.create({
      data: {
        name,
        email,
        message,
        deviceInfo: JSON.stringify(deviceInfo),
        status: 'PENDING',
        createdAt: new Date()
      }
    })

    // Aqui você pode implementar o envio de email
    // TODO: Implementar envio de email usando Nodemailer ou serviço similar

    return NextResponse.json({
      success: true,
      message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
      id: contactForm.id
    })

  } catch (error) {
    console.error('Erro ao enviar formulário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}