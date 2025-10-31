import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Respostas da IA (versão simples - pode ser expandida)
const aiResponses = {
  greeting: [
    "Olá! 👋 Bem-vindo ao Federal Global! Como posso ajudá-lo hoje?",
    "Oi! Sou sua assistente virtual. Em que posso ser útil?",
    "Olá! Estou aqui para ajudar com suas dúvidas sobre nossos serviços."
  ],
  services: [
    "Oferecemos análise documental, monitoramento humanizado e relatórios inteligentes. Sobre qual serviço gostaria de saber mais?",
    "Nossos principais serviços são: 🛡️ Análise Documental, 💎 Monitoramento Humanizado e 🌐 Assessoria Inteligente. Qual te interessa?",
    "Somos especializados em soluções de inteligência e monitoramento. Posso explicar melhor algum serviço específico?"
  ],
  contact: [
    "Para mais informações, você pode nos contatar pelo email contato@deltafoxconsult.com.br ou seguir nosso Instagram @federalexpresstrad",
    "Nossa equipe está disponível! Entre em contato pelo email ou redes sociais. Quer que eu transfira para um atendente humano?",
    "Posso ajudar com informações básicas, mas para detalhes específicos, recomendo falar com nossa equipe comercial."
  ],
  default: [
    "Entendo sua dúvida. Nossa equipe analisará sua solicitação e retornará em breve. Mais alguma coisa em que posso ajudar?",
    "Obrigada pela sua mensagem! Vou encaminhar para nossa equipe especializada. Há mais alguma informação que gostaria de saber?",
    "Anotei sua solicitação. Um especialista entrará em contato em breve. Posso esclarecer mais alguma dúvida?"
  ]
}

function generateAIResponse(message: string): string {
  const msg = message.toLowerCase()
  
  if (msg.includes('olá') || msg.includes('oi') || msg.includes('bom dia') || msg.includes('boa tarde') || msg.includes('boa noite')) {
    return aiResponses.greeting[Math.floor(Math.random() * aiResponses.greeting.length)]
  }
  
  if (msg.includes('serviço') || msg.includes('produto') || msg.includes('análise') || msg.includes('monitoramento') || msg.includes('relatório')) {
    return aiResponses.services[Math.floor(Math.random() * aiResponses.services.length)]
  }
  
  if (msg.includes('contato') || msg.includes('telefone') || msg.includes('email') || msg.includes('falar') || msg.includes('atendente')) {
    return aiResponses.contact[Math.floor(Math.random() * aiResponses.contact.length)]
  }
  
  return aiResponses.default[Math.floor(Math.random() * aiResponses.default.length)]
}

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
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
      acceptLanguage: request.headers.get('accept-language') || '',
      sessionId: sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    // Gerar resposta da IA
    const aiResponse = generateAIResponse(message)

    // Salvar a conversa no banco (vamos criar uma tabela ChatSession)
    const chatSession = await prisma.chatSession.create({
      data: {
        sessionId: deviceInfo.sessionId,
        userMessage: message,
        aiResponse: aiResponse,
        deviceInfo: JSON.stringify(deviceInfo),
        timestamp: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      response: aiResponse,
      sessionId: deviceInfo.sessionId,
      chatId: chatSession.id
    })

  } catch (error) {
    console.error('Erro no chatbot:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}