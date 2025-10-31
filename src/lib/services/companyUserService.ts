import { prisma } from '../prisma';
import { SecurityUtils } from '../utils/security';
import { EmailService } from '../utils/email';

export interface CreateCompanyUserData {
  cpf: string;
  fullName: string;
  birthDate: Date;
  email: string;
  phone: string;
  password: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'USER';
  photo?: string;
  createdById?: number;
}

export interface UpdateCompanyUserData {
  fullName?: string;
  birthDate?: Date;
  email?: string;
  phone?: string;
  photo?: string;
  role?: 'SUPER_ADMIN' | 'ADMIN' | 'USER';
  active?: boolean;
}

export interface CompanyUserResponse {
  id: number;
  cpf: string;
  fullName: string;
  birthDate: Date;
  email: string;
  phone: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'USER';
  photo?: string | null;
  protocolNumber: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdById?: number | null;
}

export interface CompanyUserWithPassword extends CompanyUserResponse {
  password: string;
}

export class CompanyUserService {
  // Criar usuário da empresa
  static async createUser(data: CreateCompanyUserData): Promise<CompanyUserResponse> {
    try {
      // Validar CPF
      if (!SecurityUtils.validateCPF(data.cpf)) {
        throw new Error('CPF inválido');
      }

      // Verificar se CPF já existe
      const existingUser = await prisma.companyUser.findUnique({
        where: { cpf: data.cpf.replace(/[^\d]/g, '') }
      });

      if (existingUser) {
        throw new Error('CPF já cadastrado no sistema');
      }

      // Verificar se email já existe
      const existingEmail = await prisma.companyUser.findUnique({
        where: { email: data.email }
      });

      if (existingEmail) {
        throw new Error('Email já cadastrado no sistema');
      }

      // Gerar protocolo único
      const protocolNumber = SecurityUtils.generateProtocol();

      // Criptografar senha
      const hashedPassword = SecurityUtils.hashPassword(data.password);

      // Criar usuário
      const user = await prisma.companyUser.create({
        data: {
          cpf: data.cpf.replace(/[^\d]/g, ''),
          fullName: data.fullName,
          birthDate: data.birthDate,
          email: data.email,
          phone: data.phone,
          password: hashedPassword,
          role: data.role,
          protocolNumber,
          photo: data.photo,
          createdById: data.createdById
        }
      });

      // Enviar email de boas-vindas
      await EmailService.sendWelcomeEmail(
        data.email,
        data.fullName,
        protocolNumber,
        data.role
      );

      // Retornar dados sem senha
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as CompanyUserResponse;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  // Atualizar usuário da empresa
  static async updateUser(
    id: number, 
    data: UpdateCompanyUserData,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updatedById: number
  ): Promise<CompanyUserResponse> {
    try {
      const user = await prisma.companyUser.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date()
        }
      });

      // Retornar dados sem senha
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as CompanyUserResponse;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }

  // Buscar usuário por CPF (para login)
  static async findByCPF(cpf: string): Promise<CompanyUserWithPassword | null> {
    try {
      const cleanCPF = cpf.replace(/[^\d]/g, '');
      
      return await prisma.companyUser.findUnique({
        where: { 
          cpf: cleanCPF,
          active: true
        }
      });
    } catch (error) {
      console.error('Erro ao buscar usuário por CPF:', error);
      return null;
    }
  }

  // Verificar login
  static async verifyLogin(cpf: string, password: string): Promise<CompanyUserResponse | null> {
    try {
      const user = await this.findByCPF(cpf);
      
      if (!user) {
        return null;
      }

      const isPasswordValid = await SecurityUtils.verifyPassword(password, user.password);
      
      if (!isPasswordValid) {
        return null;
      }

      // Retornar dados sem senha
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword as CompanyUserResponse;
    } catch (error) {
      console.error('Erro ao verificar login:', error);
      return null;
    }
  }

  // Listar usuários (com permissões)
  static async listUsers(
    requestingUserId: number,
    requestingUserRole: string,
    filters?: {
      active?: boolean;
      role?: string;
      search?: string;
    }
  ): Promise<CompanyUserResponse[]> {
    try {
      // Verificar permissões
      if (!['SUPER_ADMIN', 'ADMIN'].includes(requestingUserRole)) {
        throw new Error('Acesso negado: Você não tem permissão para listar usuários');
      }

      const where: Record<string, unknown> = {};

      if (filters?.active !== undefined) {
        where.active = filters.active;
      }

      if (filters?.role) {
        where.role = filters.role;
      }

      if (filters?.search) {
        where.OR = [
          { fullName: { contains: filters.search } },
          { email: { contains: filters.search } },
          { cpf: { contains: filters.search } }
        ];
      }

      // Se for ADMIN, não pode ver SUPER_ADMIN
      if (requestingUserRole === 'ADMIN') {
        where.role = { not: 'SUPER_ADMIN' };
      }

      const users = await prisma.companyUser.findMany({
        where,
        select: {
          id: true,
          cpf: true,
          fullName: true,
          birthDate: true,
          email: true,
          phone: true,
          role: true,
          active: true,
          protocolNumber: true,
          photo: true,
          createdAt: true,
          updatedAt: true,
          createdBy: {
            select: {
              fullName: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return users;
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      throw error;
    }
  }

  // Desativar usuário
  static async deactivateUser(
    id: number,
    requestingUserId: number,
    requestingUserRole: string
  ): Promise<void> {
    try {
      // Verificar permissões
      if (!['SUPER_ADMIN', 'ADMIN'].includes(requestingUserRole)) {
        throw new Error('Acesso negado: Você não tem permissão para desativar usuários');
      }

      // Buscar usuário a ser desativado
      const targetUser = await prisma.companyUser.findUnique({
        where: { id }
      });

      if (!targetUser) {
        throw new Error('Usuário não encontrado');
      }

      // ADMIN não pode desativar SUPER_ADMIN
      if (requestingUserRole === 'ADMIN' && targetUser.role === 'SUPER_ADMIN') {
        throw new Error('Acesso negado: Administradores não podem desativar Super Administradores');
      }

      // Não pode desativar a si mesmo
      if (id === requestingUserId) {
        throw new Error('Você não pode desativar sua própria conta');
      }

      await prisma.companyUser.update({
        where: { id },
        data: { 
          active: false,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      console.error('Erro ao desativar usuário:', error);
      throw error;
    }
  }

  // Deletar usuário (apenas SUPER_ADMIN)
  static async deleteUser(
    id: number,
    requestingUserId: number,
    requestingUserRole: string
  ): Promise<void> {
    try {
      // Apenas SUPER_ADMIN pode deletar
      if (requestingUserRole !== 'SUPER_ADMIN') {
        throw new Error('Acesso negado: Apenas Super Administradores podem deletar usuários');
      }

      // Não pode deletar a si mesmo
      if (id === requestingUserId) {
        throw new Error('Você não pode deletar sua própria conta');
      }

      await prisma.companyUser.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  }

  // Criar usuário Super Admin inicial
  static async createInitialSuperAdmin(): Promise<CompanyUserResponse> {
    try {
      // Verificar se já existe um Super Admin
      const existingSuperAdmin = await prisma.companyUser.findFirst({
        where: { role: 'SUPER_ADMIN' }
      });

      if (existingSuperAdmin) {
        console.log('Super Admin já existe no sistema');
        return existingSuperAdmin;
      }

      // Dados do Super Admin inicial (Thiago)
      const superAdminData: CreateCompanyUserData = {
        cpf: '027.692.569-63',
        fullName: 'Thiago Ferreira Alves e Borges',
        birthDate: new Date('1981-02-08'),
        email: 'tborges@deltafoxconsult.com.br',
        phone: '(61) 998980312',
        password: 'FederalGlobal2024!', // Senha inicial que deve ser alterada
        role: 'SUPER_ADMIN'
      };

      const superAdmin = await this.createUser(superAdminData);
      console.log('Super Admin criado com sucesso:', superAdmin.protocolNumber);
      
      return superAdmin;
    } catch (error) {
      console.error('Erro ao criar Super Admin inicial:', error);
      throw error;
    }
  }
}