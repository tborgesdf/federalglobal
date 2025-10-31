import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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