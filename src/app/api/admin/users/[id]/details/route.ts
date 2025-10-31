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

    // Buscar dados completos do usuário
    const user = await prisma.companyUser.findUnique({
      where: { id: userId },
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
            deviceCapture: true,
            actionLogs: {
              orderBy: {
                createdAt: 'desc'
              },
              take: 20,
              include: {
                accessLog: {
                  select: {
                    sessionId: true,
                    accessType: true,
                    deviceCapture: {
                      select: {
                        operatingSystem: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    // Processar dados
    const lastAccess = user.accessLogs[0]
    const isOnline = lastAccess ? 
      (new Date().getTime() - new Date(lastAccess.accessDateTime).getTime()) < 15 * 60 * 1000 :
      false

    const userDetails = {
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
      isOnline,
      actionLogs: lastAccess ? lastAccess.actionLogs.map(log => ({
        id: log.id,
        action: log.action,
        targetTable: log.targetTable,
        targetId: log.targetId,
        ipAddress: log.ipAddress,
        createdAt: log.createdAt.toISOString(),
        accessLog: log.accessLog
      })) : []
    }

    return NextResponse.json(userDetails)

  } catch (error) {
    console.error('Erro ao buscar detalhes do usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}