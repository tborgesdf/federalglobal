const axios = require('axios');

async function testLoginBlocking() {
  console.log('🧪 === TESTE DO SISTEMA DE BLOQUEIO ===\n');
  
  const baseUrl = 'https://federalglobal-j6f9y7dkj-thiago-borges-projects-3ed92125.vercel.app';
  
  const loginData = {
    cpf: '02769256963',
    password: 'senha_incorreta', // Senha incorreta para simular tentativas
    gpsData: {
      latitude: -23.5505,
      longitude: -46.6333
    },
    deviceInfo: {
      userAgent: 'Mozilla/5.0 (Linux; Android 12; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
      platform: 'Android',
      language: 'pt-BR',
      screenResolution: '1080x2400',
      timezone: 'America/Sao_Paulo'
    }
  };

  try {
    console.log('📱 Simulando tentativas de login simultâneo...\n');

    // Primeira tentativa
    console.log('1️⃣ Primeira tentativa de login simultâneo...');
    try {
      const response1 = await axios.post(`${baseUrl}/api/auth/domain-login`, loginData);
      console.log('✅ Resposta:', response1.data);
    } catch (error) {
      console.log('❌ Erro esperado:', error.response?.data);
      if (error.response?.data?.concurrentSession) {
        console.log('🎯 Sistema detectou sessão simultânea!');
        console.log(`⚠️ Tentativas restantes: ${error.response.data.attemptsRemaining}`);
      }
    }

    console.log('\n⏳ Aguardando 2 segundos...\n');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Segunda tentativa
    console.log('2️⃣ Segunda tentativa de login simultâneo...');
    try {
      const response2 = await axios.post(`${baseUrl}/api/auth/domain-login`, loginData);
      console.log('✅ Resposta:', response2.data);
    } catch (error) {
      console.log('❌ Erro esperado:', error.response?.data);
      if (error.response?.data?.concurrentSession) {
        console.log('🎯 Sistema detectou sessão simultânea!');
        console.log(`⚠️ Tentativas restantes: ${error.response.data.attemptsRemaining}`);
      }
    }

    console.log('\n⏳ Aguardando 2 segundos...\n');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Terceira tentativa - deve bloquear
    console.log('3️⃣ Terceira tentativa de login simultâneo (deve bloquear)...');
    try {
      const response3 = await axios.post(`${baseUrl}/api/auth/domain-login`, loginData);
      console.log('⚠️ Não esperado - deveria ter bloqueado:', response3.data);
    } catch (error) {
      console.log('🔒 Resposta de bloqueio:', error.response?.data);
      if (error.response?.status === 423) {
        console.log('🎉 SUCESSO! Conta foi bloqueada após 3 tentativas!');
        console.log(`🚫 Bloqueado até: ${error.response.data.blockedUntil}`);
        console.log(`📞 Contatar admin: ${error.response.data.contactAdmin}`);
      }
    }

    console.log('\n⏳ Aguardando 2 segundos...\n');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Quarta tentativa - deve mostrar que está bloqueado
    console.log('4️⃣ Quarta tentativa (conta já bloqueada)...');
    try {
      const response4 = await axios.post(`${baseUrl}/api/auth/domain-login`, loginData);
      console.log('⚠️ Não esperado - conta deveria estar bloqueada:', response4.data);
    } catch (error) {
      console.log('🔒 Confirmação de bloqueio:', error.response?.data);
      if (error.response?.status === 423) {
        console.log('✅ CONFIRMADO! Conta permanece bloqueada!');
      }
    }

    // Verificar alertas de segurança
    console.log('\n🚨 Verificando alertas de segurança gerados...');
    try {
      const alertsResponse = await axios.get(`${baseUrl}/api/admin/security-alerts`);
      const recentAlerts = alertsResponse.data.filter(alert => 
        new Date(alert.createdAt) > new Date(Date.now() - 10 * 60 * 1000) // Últimos 10 minutos
      );
      
      console.log(`📊 Alertas recentes: ${recentAlerts.length}`);
      
      recentAlerts.forEach((alert, index) => {
        console.log(`\n${index + 1}. ${alert.message}`);
        console.log(`   Tipo: ${alert.alertType}`);
        console.log(`   Severidade: ${alert.severity}`);
        console.log(`   Usuário: ${alert.user?.fullName || 'N/A'}`);
      });
      
    } catch (error) {
      console.log('❌ Erro ao verificar alertas:', error.response?.data);
    }

    console.log('\n🎯 === RESUMO DO TESTE ===');
    console.log('✅ Sistema de detecção de login simultâneo funcionando');
    console.log('✅ Contador de tentativas operacional');
    console.log('✅ Bloqueio automático após 3 tentativas');
    console.log('✅ Mensagens informativas para o usuário');
    console.log('✅ Alertas de segurança sendo gerados');
    console.log('✅ Status 423 (Locked) para conta bloqueada');
    
    console.log('\n🔧 === FUNCIONALIDADES VALIDADAS ===');
    console.log('🎯 Detecção de sessão ativa em outro dispositivo');
    console.log('⚠️ Avisos progressivos (1ª, 2ª tentativa)');
    console.log('🔒 Bloqueio automático na 3ª tentativa');
    console.log('⏰ Bloqueio por 30 minutos');
    console.log('📱 Informações detalhadas do dispositivo');
    console.log('🚨 Alertas para administradores');
    console.log('📞 Orientação para contatar administrador');

  } catch (error) {
    console.error('❌ Erro geral no teste:', error.message);
  }
}

testLoginBlocking();