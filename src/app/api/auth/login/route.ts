import { NextRequest, NextResponse } from 'next/server';
import { CompanyUserService } from '@/lib/services/companyUserService';
import { LogService } from '@/lib/utils/logger';

export async function POST(request: NextRequest) {
  try {
    const { cpf, password, gpsCoords } = await request.json();

    // Verificar se CPF e senha foram fornecidos
    if (!cpf || !password) {
      return NextResponse.json(
        { error: 'CPF e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar login
    const user = await CompanyUserService.verifyLogin(cpf, password);

    if (!user) {
      // Log de tentativa de login falhada
      const ipAddress = request.headers.get('x-forwarded-for') || 
                       request.headers.get('x-real-ip') || 
                       '127.0.0.1';

      try {
        await LogService.createAccessLog({
          accessType: 'SUPER_ADMIN_DASHBOARD', // Tipo genérico para falhas
          ipAddress,
          successful: false
        });
      } catch (logError) {
        console.error('Erro ao criar log de falha:', logError);
      }

      return NextResponse.json(
        { error: 'CPF ou senha inválidos' },
        { status: 401 }
      );
    }

    // Capturar dados de rede e dispositivo
    let networkData, deviceData;
    try {
      const captureData = await LogService.captureFullAccessData(request, gpsCoords);
      networkData = captureData.networkData;
      deviceData = captureData.deviceData;
    } catch (captureError) {
      console.error('Erro ao capturar dados:', captureError);
    }

    // Determinar tipo de acesso baseado no role
    let accessType: 'SUPER_ADMIN_DASHBOARD' | 'ADMIN_DASHBOARD' | 'USER_DASHBOARD';
    switch (user.role) {
      case 'SUPER_ADMIN':
        accessType = 'SUPER_ADMIN_DASHBOARD';
        break;
      case 'ADMIN':
        accessType = 'ADMIN_DASHBOARD';
        break;
      case 'USER':
        accessType = 'USER_DASHBOARD';
        break;
      default:
        accessType = 'USER_DASHBOARD';
    }

    // Criar log de acesso bem-sucedido
    let accessLogId;
    try {
      accessLogId = await LogService.createAccessLog({
        userId: user.id,
        accessType,
        ipAddress: networkData?.ipAddress || '127.0.0.1',
        successful: true,
        networkData,
        deviceData
      });
    } catch (logError) {
      console.error('Erro ao criar log de acesso:', logError);
    }

    // Log da ação de login
    if (accessLogId) {
      try {
        await LogService.createActionLog({
          accessLogId,
          userId: user.id,
          action: 'LOGIN_SUCCESS',
          ipAddress: networkData?.ipAddress || '127.0.0.1'
        });
      } catch (actionLogError) {
        console.error('Erro ao criar log de ação:', actionLogError);
      }
    }

    // Retornar dados do usuário (sem senha)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        cpf: user.cpf,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        protocolNumber: user.protocolNumber,
        photo: user.photo
      },
      accessLogId,
      message: 'Login realizado com sucesso'
    });

  } catch (error) {
    console.error('Erro na API de login:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}