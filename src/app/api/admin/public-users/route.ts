import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar usuários públicos (que se cadastraram pelo site)
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação (implementação básica)
    const sessionToken = request.cookies.get('session_token')?.value
    
    if (!sessionToken) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Buscar todos os usuários públicos
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        phone: true,
        birthDate: true,
        role: true,
        isActive: true,
        emailVerified: true,
        acceptedTerms: true,
        termsAcceptedAt: true,
        gpsLatitude: true,
        gpsLongitude: true,
        deviceInfo: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Processar dados para incluir informações formatadas
    // @ts-ignore - Dynamic user properties
    const processedUsers = users.map((user: any) => {
      let deviceData = null
      if (user.deviceInfo) {
        try {
          deviceData = JSON.parse(user.deviceInfo)
        } catch (e) {
          console.error('Erro ao parsear deviceInfo:', e)
        }
      }

      // Formato de protocolo para usuários públicos
      const protocolNumber = `PUB${String(user.id).padStart(6, '0')}`

      return {
        id: user.id,
        cpf: user.cpf,
        fullName: user.name,
        email: user.email,
        phone: user.phone,
        birthDate: user.birthDate ? user.birthDate.toISOString() : null,
        role: user.role,
        protocolNumber: protocolNumber,
        active: user.isActive,
        emailVerified: user.emailVerified,
        acceptedTerms: user.acceptedTerms,
        termsAcceptedAt: user.termsAcceptedAt ? user.termsAcceptedAt.toISOString() : null,
        gpsLocation: user.gpsLatitude && user.gpsLongitude ? {
          latitude: parseFloat(user.gpsLatitude.toString()),
          longitude: parseFloat(user.gpsLongitude.toString())
        } : null,
        deviceInfo: deviceData,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        isOnline: false, // Usuários públicos não têm sistema de sessão
        userType: 'PUBLIC' // Identificador para diferenciar
      }
    })

    return NextResponse.json({
      success: true,
      users: processedUsers,
      total: processedUsers.length
    })

  } catch (error) {
    console.error('Erro ao buscar usuários públicos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}