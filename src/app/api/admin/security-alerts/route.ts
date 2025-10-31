import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const sessionToken = request.cookies.get('session_token')?.value
    
    if (!sessionToken) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Buscar alertas não reconhecidos
    const alerts = await prisma.securityAlert.findMany({
      where: {
        acknowledged: false
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    })

    return NextResponse.json({
      success: true,
      alerts: alerts.map((alert: any) => ({
        id: alert.id,
        userId: alert.userId,
        alertType: alert.alertType,
        message: alert.message,
        // @ts-ignore - Dynamic alert properties
        details: alert.details ? JSON.parse(alert.details) : null,
        severity: alert.severity,
        createdAt: alert.createdAt.toISOString(),
        user: alert.user
      })),
      totalUnacknowledged: alerts.length
    })

  } catch (error) {
    console.error('Erro ao buscar alertas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { alertId, userId } = await request.json()

    // Verificar autenticação
    const sessionToken = request.cookies.get('session_token')?.value
    
    if (!sessionToken) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Marcar alerta como reconhecido
    await prisma.securityAlert.update({
      where: { id: alertId },
      data: {
        acknowledged: true,
        acknowledgedBy: userId,
        acknowledgedAt: new Date()
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erro ao reconhecer alerta:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}