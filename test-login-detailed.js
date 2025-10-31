const axios = require('axios');

async function testLoginSteps() {
  console.log('🔍 Testando login passo a passo...\n');
  
  const baseUrl = 'https://admin.federalglobal.deltafoxconsult.com.br';
  
  const loginData = {
    cpf: '027.692.569-63',
    password: 'Ale290800-####$2',
    gpsData: {
      latitude: -15.7939,
      longitude: -47.8828,
      accuracy: 10
    },
    deviceInfo: {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      platform: 'Win32',
      language: 'pt-BR',
      screenResolution: '1920x1080',
      timezone: 'America/Sao_Paulo'
    }
  };

  try {
    console.log('📋 Dados da requisição:');
    console.log('   URL:', `${baseUrl}/api/auth/domain-login`);
    console.log('   CPF:', loginData.cpf);
    console.log('   GPS:', loginData.gpsData);
    console.log('');

    console.log('📡 Enviando requisição...');
    const response = await axios.post(`${baseUrl}/api/auth/domain-login`, loginData, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': loginData.deviceInfo.userAgent,
        'Accept': 'application/json'
      },
      timeout: 30000,
      validateStatus: function (status) {
        // Aceitar todos os status codes para debugar
        return true;
      }
    });

    console.log('📥 Resposta recebida:');
    console.log('   Status:', response.status);
    console.log('   Headers:', response.headers);
    console.log('   Data:', JSON.stringify(response.data, null, 2));

    if (response.status === 200) {
      console.log('\n✅ LOGIN REALIZADO COM SUCESSO!');
      if (response.data.data?.context?.redirectTo) {
        console.log('   Redirect para:', response.data.data.context.redirectTo);
      }
    } else {
      console.log('\n❌ LOGIN FALHOU!');
      if (response.data.error) {
        console.log('   Erro:', response.data.error);
      }
      if (response.data.message) {
        console.log('   Mensagem:', response.data.message);
      }
    }

  } catch (error) {
    console.error('\n💥 ERRO NA REQUISIÇÃO:');
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Headers:', error.response.headers);
      console.log('   Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log('   Erro de rede:', error.message);
    } else {
      console.log('   Erro:', error.message);
    }
  }
}

testLoginSteps();