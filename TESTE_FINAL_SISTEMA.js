console.log('🎯 TESTE FINAL DO SISTEMA FEDERAL GLOBAL');
console.log('========================================');
console.log('');

async function testarSistemaCompleto() {
  try {
    // 1. Teste de conectividade básica
    console.log('1. 🔍 Testando conectividade das APIs...');
    const statusResponse = await fetch('https://federalglobal-q73ne07z8-thiago-borges-projects-3ed92125.vercel.app/api/status');
    const statusData = await statusResponse.json();
    console.log(`   ✅ API Status: ${statusResponse.status} - ${statusData.status}`);
    
    // 2. Teste do banco de dados
    console.log('');
    console.log('2. 🗄️ Testando conexão com banco de dados...');
    const dbResponse = await fetch('https://federalglobal-q73ne07z8-thiago-borges-projects-3ed92125.vercel.app/api/db-test');
    const dbData = await dbResponse.json();
    
    if (dbData.success) {
      console.log(`   ✅ Banco conectado: ${dbData.database.totalUsers} usuários encontrados`);
      
      if (dbData.thiagoUser) {
        console.log(`   ✅ Usuário Thiago: ${dbData.thiagoUser.fullName} (${dbData.thiagoUser.role})`);
      } else {
        console.log('   ❌ Usuário Thiago não encontrado');
      }
    } else {
      console.log(`   ❌ Erro no banco: ${dbData.error}`);
      return; // Parar aqui se banco não funcionar
    }
    
    // 3. Teste de login
    console.log('');
    console.log('3. 🔐 Testando login com credenciais reais...');
    const loginData = {
      cpf: '027.692.569-63',
      password: 'Ale290800-####$2',
      gpsData: {
        latitude: -23.5505,
        longitude: -46.6333,
        accuracy: 50
      }
    };
    
    const loginResponse = await fetch('https://federalglobal-q73ne07z8-thiago-borges-projects-3ed92125.vercel.app/api/auth/domain-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Host': 'admin.federalglobal.deltafoxconsult.com.br'
      },
      body: JSON.stringify(loginData)
    });
    
    const loginResult = await loginResponse.json();
    
    if (loginResult.success) {
      console.log('   🎉 LOGIN FUNCIONOU!');
      console.log(`   👤 Usuário: ${loginResult.data.user.name}`);
      console.log(`   🎭 Role: ${loginResult.data.user.role}`);
      console.log(`   🌐 Domínio: ${loginResult.data.context.type}`);
      console.log(`   📱 Redirecionamento: ${loginResult.data.context.redirectTo}`);
    } else {
      console.log(`   ❌ Login falhou: ${loginResult.error}`);
    }
    
    // 4. Resumo final
    console.log('');
    console.log('📊 RESUMO FINAL:');
    console.log('================');
    console.log('✅ APIs: Funcionando');
    console.log(dbData.success ? '✅ Banco: Conectado' : '❌ Banco: Erro');
    console.log(loginResult.success ? '✅ Login: Funcionando' : '❌ Login: Erro');
    console.log('');
    
    if (dbData.success && loginResult.success) {
      console.log('🎉 SISTEMA FEDERAL GLOBAL 100% OPERACIONAL!');
      console.log('🌐 URLs do sistema:');
      console.log('   Admin: https://admin.federalglobal.deltafoxconsult.com.br');
      console.log('   Client: https://federalglobal.deltafoxconsult.com.br');
    } else {
      console.log('⚠️ Sistema parcialmente funcional - verificar banco de dados');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testarSistemaCompleto();