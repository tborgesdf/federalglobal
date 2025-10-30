import { NextRequest, NextResponse } from 'next/server'
import { validateDomainAccess } from '../../../../lib/utils/domain'
import { logAction } from '../../../../lib/utils/logger'

export async function GET(request: NextRequest) {
  try {
    // Validar acesso ao painel administrativo
    if (!validateDomainAccess('admin')) {
      await logAction({
        action: 'unauthorized_admin_access',
        details: { 
          hostname: request.headers.get('host'),
          userAgent: request.headers.get('user-agent'),
          ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
        },
        status: 'error'
      })
      
      return NextResponse.json(
        { error: 'Acesso negado. Use admin.federalglobal.deltafoxconsult.com.br' },
        { status: 403 }
      )
    }

    // Estatísticas do dashboard administrativo
    const stats = {
      totalUsers: 156,
      totalCompanies: 23,
      totalLogs: 8432,
      onlineUsers: 12,
      systemHealth: {
        database: 'online',
        gps: 'active',
        security: 'maximum',
        performance: 'optimal'
      },
      recentActivity: [
        {
          id: 1,
          timestamp: new Date().toISOString(),
          action: 'Login realizado',
          user: 'João Silva',
          type: 'success',
          location: 'São Paulo, SP'
        },
        {
          id: 2,
          timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
          action: 'Erro de GPS detectado',
          user: 'Maria Santos',
          type: 'warning',
          location: 'Rio de Janeiro, RJ'
        },
        {
          id: 3,
          timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
          action: 'Nova empresa cadastrada',
          user: 'Sistema',
          type: 'info',
          location: 'Brasília, DF'
        }
      ],
      gpsMetrics: {
        activeUsers: 148,
        averageAccuracy: 5.2,
        blockedAttempts: 12,
        successRate: 98.7
      },
      securityMetrics: {
        successfulLogins: 234,
        failedLogins: 18,
        blockedIPs: 5,
        encryptionStatus: 'AES-256'
      }
    }

    await logAction({
      action: 'admin_dashboard_accessed',
      details: { 
        hostname: request.headers.get('host'),
        stats_requested: true
      },
      status: 'success'
    })

    return NextResponse.json({
      success: true,
      data: stats,
      context: {
        domain: 'admin.federalglobal.deltafoxconsult.com.br',
        type: 'admin',
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    await logAction({
      action: 'admin_dashboard_error',
      details: { 
        error: error instanceof Error ? error.message : 'Unknown error',
        hostname: request.headers.get('host')
      },
      status: 'error'
    })

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}