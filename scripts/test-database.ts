import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testDatabaseConnection() {
  try {
    console.log('🔍 Testando conexão com banco de dados...')
    
    // Verificar conexão
    await prisma.$connect()
    console.log('✅ Conexão com banco estabelecida')
    
    // Buscar usuários
    const users = await prisma.companyUser.findMany({
      select: {
        id: true,
        cpf: true,
        fullName: true,
        email: true,
        role: true,
        active: true,
        protocolNumber: true
      }
    })
    
    console.log('📋 Usuários encontrados:')
    users.forEach(user => {
      console.log(`   ID: ${user.id}`)
      console.log(`   Nome: ${user.fullName}`)
      console.log(`   CPF: ${user.cpf}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Role: ${user.role}`)
      console.log(`   Protocolo: ${user.protocolNumber}`)
      console.log(`   Ativo: ${user.active}`)
      console.log('   ---')
    })
    
    // Buscar especificamente seu usuário
    const thiagoUser = await prisma.companyUser.findUnique({
      where: { cpf: '02769256963' }
    })
    
    if (thiagoUser) {
      console.log('✅ Usuário Thiago encontrado:')
      console.log(`   Nome: ${thiagoUser.fullName}`)
      console.log(`   CPF: ${thiagoUser.cpf}`)
      console.log(`   Email: ${thiagoUser.email}`)
      console.log(`   Role: ${thiagoUser.role}`)
      console.log(`   Ativo: ${thiagoUser.active}`)
      console.log(`   Protocolo: ${thiagoUser.protocolNumber}`)
    } else {
      console.log('❌ Usuário Thiago NÃO encontrado')
    }
    
  } catch (error) {
    console.error('❌ Erro na conexão com banco:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabaseConnection()