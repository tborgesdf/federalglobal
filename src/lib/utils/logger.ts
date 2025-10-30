import { prisma } from '../prisma';
import { CaptureUtils, NetworkData, DeviceData } from './capture';
import { SecurityUtils } from './security';

export interface LogData {
  userId?: number;
  clientId?: number;
  accessType: 'SUPER_ADMIN_DASHBOARD' | 'ADMIN_DASHBOARD' | 'USER_DASHBOARD' | 'CLIENT_PORTAL';
  ipAddress: string;
  successful: boolean;
  networkData?: NetworkData;
  deviceData?: DeviceData;
}

export interface ActionLogData {
  accessLogId: number;
  userId: number;
  action: string;
  targetTable?: string;
  targetId?: number;
  oldData?: Record<string, unknown>;
  newData?: Record<string, unknown>;
  ipAddress: string;
}

// Função simplificada para logging rápido
export async function logAction(data: {
  action: string;
  details?: Record<string, unknown>;
  status: 'success' | 'error' | 'warning' | 'info';
  userId?: number;
}): Promise<void> {
  try {
    console.log(`[${data.status.toUpperCase()}] ${data.action}`, data.details || {});
    
    // TODO: Implementar persistência real no banco quando necessário
    // Por enquanto, apenas log no console para debug
  } catch (error) {
    console.error('Erro ao registrar log:', error);
  }
}

export class LogService {
  // Criar log de acesso
  static async createAccessLog(data: LogData): Promise<number> {
    try {
      const sessionId = SecurityUtils.generateProtocol();
      
      const accessLog = await prisma.accessLog.create({
        data: {
          userId: data.userId,
          clientId: data.clientId,
          accessType: data.accessType,
          sessionId,
          ipAddress: data.ipAddress,
          successful: data.successful
        }
      });

      // Salvar dados de rede se fornecidos
      if (data.networkData) {
        await prisma.networkCapture.create({
          data: {
            accessLogId: accessLog.id,
            ipAddress: data.networkData.ipAddress,
            ipMapLink: data.networkData.ipMapLink,
            country: data.networkData.country,
            city: data.networkData.city,
            state: data.networkData.state,
            timezone: data.networkData.timezone,
            protocol: data.networkData.protocol,
            ports: JSON.stringify(data.networkData.ports),
            packetsData: JSON.stringify(data.networkData.packetsData),
            internetProvider: data.networkData.internetProvider,
            proxyVpn: data.networkData.proxyVpn,
            connectionType: data.networkData.connectionType
          }
        });
      }

      // Salvar dados do dispositivo se fornecidos
      if (data.deviceData) {
        await prisma.deviceCapture.create({
          data: {
            accessLogId: accessLog.id,
            operatingSystem: data.deviceData.operatingSystem,
            browser: data.deviceData.browser,
            userAgent: data.deviceData.userAgent,
            navigationData: data.deviceData.navigationData ? JSON.stringify(data.deviceData.navigationData) : null,
            gpsLatitude: data.deviceData.gpsLatitude,
            gpsLongitude: data.deviceData.gpsLongitude,
            gpsMapLink: data.deviceData.gpsMapLink,
            deviceCountry: data.deviceData.deviceCountry,
            deviceCity: data.deviceData.deviceCity,
            deviceState: data.deviceData.deviceState,
            weatherData: data.deviceData.weatherData ? JSON.stringify(data.deviceData.weatherData) : null
          }
        });
      }

      return accessLog.id;
    } catch (error) {
      console.error('Erro ao criar log de acesso:', error);
      throw error;
    }
  }

  // Criar log de ação
  static async createActionLog(data: ActionLogData): Promise<void> {
    try {
      await prisma.actionLog.create({
        data: {
          accessLogId: data.accessLogId,
          userId: data.userId,
          action: data.action,
          targetTable: data.targetTable,
          targetId: data.targetId,
          oldData: data.oldData ? JSON.stringify(SecurityUtils.sanitizeForLog(data.oldData)) : null,
          newData: data.newData ? JSON.stringify(SecurityUtils.sanitizeForLog(data.newData)) : null,
          ipAddress: data.ipAddress
        }
      });
    } catch (error) {
      console.error('Erro ao criar log de ação:', error);
      throw error;
    }
  }

  // Capturar dados completos do acesso
  static async captureFullAccessData(
    request: Request, 
    gpsCoords?: { lat: number; lng: number }
  ): Promise<{ networkData: NetworkData; deviceData: DeviceData }> {
    try {
      const [networkData, deviceData] = await Promise.all([
        CaptureUtils.captureNetworkData(request),
        CaptureUtils.captureDeviceData(request, gpsCoords)
      ]);

      return { networkData, deviceData };
    } catch (error) {
      console.error('Erro ao capturar dados de acesso:', error);
      throw error;
    }
  }

  // Buscar logs de acesso (apenas para SUPER_ADMIN)
  static async getAccessLogs(
    userId: number, 
    userRole: string, 
    filters?: {
      startDate?: Date;
      endDate?: Date;
      accessType?: string;
      targetUserId?: number;
    }
  ) {
    // Verificar se o usuário tem permissão (apenas SUPER_ADMIN)
    if (userRole !== 'SUPER_ADMIN') {
      throw new Error('Acesso negado: Apenas Super Administradores podem acessar os logs');
    }

    try {
      const where: Record<string, unknown> = {};

      if (filters?.startDate && filters?.endDate) {
        where.accessDateTime = {
          gte: filters.startDate,
          lte: filters.endDate
        };
      }

      if (filters?.accessType) {
        where.accessType = filters.accessType;
      }

      if (filters?.targetUserId) {
        where.userId = filters.targetUserId;
      }

      return await prisma.accessLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              cpf: true,
              role: true
            }
          },
          client: {
            select: {
              id: true,
              fullName: true,
              cpf: true
            }
          },
          networkCapture: true,
          deviceCapture: true,
          actionLogs: true
        },
        orderBy: {
          accessDateTime: 'desc'
        }
      });
    } catch (error) {
      console.error('Erro ao buscar logs de acesso:', error);
      throw error;
    }
  }

  // Buscar logs de ação (apenas para SUPER_ADMIN)
  static async getActionLogs(
    userId: number,
    userRole: string,
    filters?: {
      startDate?: Date;
      endDate?: Date;
      targetUserId?: number;
      action?: string;
    }
  ) {
    // Verificar se o usuário tem permissão (apenas SUPER_ADMIN)
    if (userRole !== 'SUPER_ADMIN') {
      throw new Error('Acesso negado: Apenas Super Administradores podem acessar os logs');
    }

    try {
      const where: Record<string, unknown> = {};

      if (filters?.startDate && filters?.endDate) {
        where.createdAt = {
          gte: filters.startDate,
          lte: filters.endDate
        };
      }

      if (filters?.targetUserId) {
        where.userId = filters.targetUserId;
      }

      if (filters?.action) {
        where.action = {
          contains: filters.action
        };
      }

      return await prisma.actionLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              cpf: true,
              role: true
            }
          },
          accessLog: {
            select: {
              sessionId: true,
              accessType: true,
              accessDateTime: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Erro ao buscar logs de ação:', error);
      throw error;
    }
  }
}