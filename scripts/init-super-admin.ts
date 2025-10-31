import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function generateProtocolNumber(): Promise<string> {
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `FG${timestamp.slice(-6)}${random}`
}

async function initializeSuperAdmin() {
  try {
    console.log('🚀 Criando Super Administrador Real - Thiago Borges...');
    
    // Hash da senha real
    const hashedPassword = await bcrypt.hash('Ale290800-####$2', 12)
    const protocolNumber = await generateProtocolNumber()
    
    // Criar super usuário real
    const superAdmin = await prisma.companyUser.upsert({
      where: { cpf: '02769256963' },
      update: {
        fullName: 'Thiago Ferreira Alves e Borges',
        email: 'tborges@deltafoxconsult.com.br',
        password: hashedPassword,
        phone: '(61) 998980312',
        birthDate: new Date('1981-02-08'),
        role: 'SUPER_ADMIN',
        active: true,
        protocolNumber: protocolNumber
      },
      create: {
        cpf: '02769256963',
        fullName: 'Thiago Ferreira Alves e Borges',
        email: 'tborges@deltafoxconsult.com.br',
        password: hashedPassword,
        phone: '(61) 998980312',
        birthDate: new Date('1981-02-08'),
        role: 'SUPER_ADMIN',
        active: true,
        protocolNumber: protocolNumber
      }
    })
    
    console.log('✅ Super Administrador criado com sucesso!')
    console.log('📋 Dados do usuário:')
    console.log(`   Nome: ${superAdmin.fullName}`)
    console.log(`   CPF: 027.692.569-63`)
    console.log(`   Email: ${superAdmin.email}`)
    console.log(`   Telefone: ${superAdmin.phone}`)
    console.log(`   Data Nascimento: 08/02/1981`)
    console.log(`   Protocolo: ${superAdmin.protocolNumber}`)
    console.log(`   Role: ${superAdmin.role}`)
    
    // Criar log de acesso inicial
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const accessLog = await prisma.accessLog.create({
      data: {
        userId: superAdmin.id,
        accessType: 'SUPER_ADMIN_DASHBOARD',
        sessionId: sessionId,
        ipAddress: '127.0.0.1',
        successful: true
      }
    })
    
    // Criar log de ação
    await prisma.actionLog.create({
      data: {
        accessLogId: accessLog.id,
        userId: superAdmin.id,
        action: 'SUPER_ADMIN_REAL_CREATED',
        targetTable: 'company_users',
        targetId: superAdmin.id,
        newData: JSON.stringify({
          name: superAdmin.fullName,
          cpf: superAdmin.cpf,
          email: superAdmin.email,
          role: superAdmin.role,
          realUser: true
        }),
        ipAddress: '127.0.0.1'
      }
    })
    
    console.log('✅ Logs de auditoria criados')
    
    console.log('')
    console.log('🎉 SUPER ADMINISTRADOR REAL CRIADO COM SUCESSO!')
    console.log('')
    console.log('🔐 Credenciais de Acesso:')
    console.log(`   CPF: 027.692.569-63`)
    console.log(`   Senha: Ale290800-####$2`)
    console.log('')
    console.log('🌐 URLs de Acesso:')
    console.log(`   Admin: https://admin.federalglobal.deltafoxconsult.com.br`)
    console.log(`   Cliente: https://federalglobal.deltafoxconsult.com.br`)
    console.log('')
    console.log('👤 OBSERVAÇÃO: Foto TB_Azul.png deve ser adicionada via interface administrativa')
    console.log('📋 Use o protocolo ${superAdmin.protocolNumber} para referência')
    
  } catch (error) {
    console.error('❌ Erro ao criar super administrador:', error)
  } finally {
    await prisma.$disconnect()
    process.exit(0)
  }
}

initializeSuperAdmin()