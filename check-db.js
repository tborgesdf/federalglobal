const axios = require('axios');

async function checkDatabase() {
  console.log('🔍 === VERIFICANDO BANCO DE DADOS ===\n');
  
  const baseUrl = 'https://federalglobal-9gq9xy1dt-thiago-borges-projects-3ed92125.vercel.app';
  
  try {
    console.log('📋 Verificando usuários no banco...');
    const dbResponse = await axios.get(`${baseUrl}/api/db-test`);
    console.log('✅ Resposta do banco:', dbResponse.data);
    
    if (dbResponse.data.users && dbResponse.data.users.length > 0) {
      console.log('\n👥 USUÁRIOS ENCONTRADOS:');
      dbResponse.data.users.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.fullName}`);
        console.log(`   CPF: ${user.cpf}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Empresa: ${user.company}`);
        console.log(`   Status: ${user.isActive ? 'Ativo' : 'Inativo'}`);
      });
      
      // Encontrar super admin
      const superAdmin = dbResponse.data.users.find(user => user.role === 'SUPER_ADMIN');
      if (superAdmin) {
        console.log(`\n🔑 SUPER ADMIN ENCONTRADO:`);
        console.log(`   Nome: ${superAdmin.fullName}`);
        console.log(`   CPF: ${superAdmin.cpf}`);
        console.log(`   Email: ${superAdmin.email}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar banco:', error.response?.data || error.message);
  }
}

checkDatabase();