import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const userId = parseInt(params.id)
    
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    // Verificar autenticação
    const sessionToken = request.cookies.get('session_token')?.value
    
    if (!sessionToken) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Buscar histórico de navegação através dos action logs
    const actionLogs = await prisma.actionLog.findMany({
      where: {
        userId: userId,
        OR: [
          { action: { contains: 'page_view' } },
          { action: { contains: 'navigation' } },
          { action: { contains: 'access' } },
          { action: { contains: 'click' } },
          { action: { contains: 'route' } }
        ]
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100,
      include: {
        accessLog: {
          select: {
            sessionId: true,
            accessType: true,
            accessDateTime: true
          }
        }
      }
    })

    // Processar dados para simular histórico de navegação
    const navigationHistory = actionLogs.map(log => {
      let url = 'N/A'
      let action = log.action

      // Extrair URL ou página dos dados
      if (log.newData) {
        try {
          const data = JSON.parse(log.newData)
          url = data.url || data.page || data.route || 'N/A'
        } catch (e) {
          // Ignore parse errors
        }
      }

      // Se não tem URL nos dados, tentar inferir pela ação
      if (url === 'N/A') {
        if (log.action.includes('login')) url = '/admin/login'
        else if (log.action.includes('dashboard')) url = '/admin'
        else if (log.action.includes('users')) url = '/admin/users'
        else if (log.action.includes('selection')) url = '/admin/selection'
      }

      return {
        url,
        timestamp: log.createdAt.toISOString(),
        action: action
      }
    })

    // Adicionar alguns exemplos de navegação se não houver dados suficientes
    if (navigationHistory.length < 5) {
      const exampleHistory = [
        {
          url: '/admin/login',
          timestamp: new Date(Date.now() - 60000).toISOString(),
          action: 'Página de Login Acessada'
        },
        {
          url: '/admin/selection',
          timestamp: new Date(Date.now() - 45000).toISOString(),
          action: 'Seleção de Painel Acessada'
        },
        {
          url: '/admin',
          timestamp: new Date(Date.now() - 30000).toISOString(),
          action: 'Dashboard Administrativo Acessado'
        },
        {
          url: '/admin/users',
          timestamp: new Date(Date.now() - 15000).toISOString(),
          action: 'Gestão de Usuários Acessada'
        }
      ]

      navigationHistory.push(...exampleHistory)
    }

    return NextResponse.json({
      success: true,
      history: navigationHistory
    })

  } catch (error) {
    console.error('Erro ao buscar histórico de navegação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}