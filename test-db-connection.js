const { PrismaClient } = require('@prisma/client');

async function testDatabaseConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Testando conexão com o banco...');
    
    // Testar conexão básica
    await prisma.$connect();
    console.log('✅ Conexão com banco estabelecida');
    
    // Contar usuários
    const userCount = await prisma.companyUser.count();
    console.log(`📊 Total de usuários: ${userCount}`);
    
    // Buscar super admin específico
    const superAdmin = await prisma.companyUser.findFirst({
      where: { cpf: '02769256963' }
    });
    
    if (superAdmin) {
      console.log('🎯 Super Admin encontrado:');
      console.log(`   Nome: ${superAdmin.fullName}`);
      console.log(`   Email: ${superAdmin.email}`);
      console.log(`   Role: ${superAdmin.role}`);
      console.log(`   Ativo: ${superAdmin.active}`);
      console.log(`   CPF: ${superAdmin.cpf}`);
      
      // Testar hash da senha
      const bcrypt = require('bcryptjs');
      const testPassword = 'Ale290800-####$2';
      
      console.log('\n🔐 Testando verificação de senha...');
      console.log(`   Senha de teste: ${testPassword}`);
      console.log(`   Hash no banco: ${superAdmin.password.substring(0, 20)}...`);
      
      const isPasswordValid = await bcrypt.compare(testPassword, superAdmin.password);
      console.log(`   Senha válida: ${isPasswordValid ? '✅ SIM' : '❌ NÃO'}`);
      
    } else {
      console.log('❌ Super Admin não encontrado');
    }
    
    // Listar todos os usuários
    console.log('\n📋 Todos os usuários:');
    const allUsers = await prisma.companyUser.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        cpf: true,
        role: true,
        active: true
      }
    });
    
    allUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.fullName} (${user.cpf}) - ${user.role} - ${user.active ? 'Ativo' : 'Inativo'}`);
    });
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection();