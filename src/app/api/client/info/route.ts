import { NextRequest, NextResponse } from 'next/server'
import { validateDomainAccess } from '../../../../lib/utils/domain'
import { logAction } from '../../../../lib/utils/logger'

export async function GET(request: NextRequest) {
  try {
    // Validar acesso ao portal do cliente
    if (!validateDomainAccess('client')) {
      await logAction({
        action: 'unauthorized_client_access',
        details: { 
          hostname: request.headers.get('host'),
          userAgent: request.headers.get('user-agent'),
          ip: request.ip || 'unknown'
        },
        status: 'error'
      })
      
      return NextResponse.json(
        { error: 'Acesso negado. Use federalglobal.deltafoxconsult.com.br' },
        { status: 403 }
      )
    }

    // Informações públicas do sistema para clientes
    const systemInfo = {
      status: 'online',
      version: '2.0.0',
      features: [
        {
          name: 'Segurança Avançada',
          description: 'Sistema de autenticação com GPS obrigatório e criptografia de ponta',
          icon: '🛡️',
          available: true
        },
        {
          name: 'Monitoramento Real-time',
          description: 'Acompanhamento em tempo real de atividades e localização',
          icon: '📊',
          available: true
        },
        {
          name: 'Inteligência Global',
          description: 'Análise inteligente de dados com IA e machine learning',
          icon: '🌐',
          available: true
        },
        {
          name: 'GPS Obrigatório',
          description: 'Sistema de localização obrigatório para máxima segurança',
          icon: '🛰️',
          available: true
        }
      ],
      systemHealth: {
        uptime: '99.9%',
        responseTime: '< 200ms',
        security: 'Máxima',
        gpsAccuracy: '±5m'
      },
      services: [
        {
          name: 'Monitoramento Empresarial',
          description: 'Controle total de atividades corporativas',
          category: 'Segurança'
        },
        {
          name: 'Análise de Dados',
          description: 'Relatórios inteligentes e insights corporativos',
          category: 'Inteligência'
        },
        {
          name: 'Controle de Acesso',
          description: 'Sistema hierárquico de permissões',
          category: 'Segurança'
        }
      ],
      contact: {
        company: 'DeltaFox Consultoria',
        email: 'contato@deltafoxconsult.com.br',
        support: 'suporte@deltafoxconsult.com.br'
      }
    }

    await logAction({
      action: 'client_portal_accessed',
      details: { 
        hostname: request.headers.get('host'),
        info_requested: true
      },
      status: 'success'
    })

    return NextResponse.json({
      success: true,
      data: systemInfo,
      context: {
        domain: 'federalglobal.deltafoxconsult.com.br',
        type: 'client',
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    await logAction({
      action: 'client_portal_error',
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