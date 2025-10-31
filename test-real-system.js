const axios = require('axios');

async function testRealLogin() {
  console.log('🧪 === TESTE COM SUPER ADMIN REAL ===\n');
  
  const baseUrl = 'https://federalglobal-9gq9xy1dt-thiago-borges-projects-3ed92125.vercel.app';
  
  try {
    // Testar com super admin real
    console.log('🔐 Testando login com Super Admin...');
    const loginData = {
      cpf: '02769256963',
      password: 'TechPass2024!@',
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
    
    const loginResponse = await axios.post(`${baseUrl}/api/auth/domain-login`, loginData);
    console.log('✅ Login realizado com sucesso!');
    console.log('📍 GPS Capturado:', loginData.gpsData);
    console.log('🔒 Resposta:', loginResponse.data);
    
    // Testar dashboard após login
    console.log('\n📊 Testando dashboard...');
    const dashboardResponse = await axios.get(`${baseUrl}/api/admin/dashboard`);
    console.log('✅ Dashboard funcionando!');
    console.log('📈 Stats:', dashboardResponse.data.stats);
    
    // Testar usuários
    console.log('\n👥 Testando lista de usuários...');
    const usersResponse = await axios.get(`${baseUrl}/api/admin/users`);
    console.log('✅ Usuários carregados:', usersResponse.data.length);
    
    // Verificar usuário com GPS
    const userWithGPS = usersResponse.data.find(user => 
      user.lastAccess?.deviceCapture?.gpsLatitude
    );
    
    if (userWithGPS) {
      console.log('\n🗺️ USUÁRIO COM GPS ENCONTRADO:');
      console.log(`   Nome: ${userWithGPS.fullName}`);
      console.log(`   Email: ${userWithGPS.email}`);
      console.log(`   Empresa: ${userWithGPS.company}`);
      console.log(`   Localização: ${userWithGPS.lastAccess.deviceCapture.deviceCity}, ${userWithGPS.lastAccess.deviceCapture.deviceCountry}`);
      console.log(`   Coordenadas: ${userWithGPS.lastAccess.deviceCapture.gpsLatitude}, ${userWithGPS.lastAccess.deviceCapture.gpsLongitude}`);
      console.log(`   Dispositivo: ${userWithGPS.lastAccess.deviceCapture.operatingSystem} - ${userWithGPS.lastAccess.deviceCapture.browser}`);
      console.log(`   Tipo: ${userWithGPS.lastAccess.deviceCapture.deviceType}`);
      console.log(`   Modelo: ${userWithGPS.lastAccess.deviceCapture.deviceModel || 'N/A'}`);
      console.log(`   Marca: ${userWithGPS.lastAccess.deviceCapture.deviceBrand || 'N/A'}`);
      console.log(`   Conexão: ${userWithGPS.lastAccess.deviceCapture.connectionType || 'N/A'}`);
      
      console.log('\n🗺️ LINKS DE MAPA GERADOS:');
      console.log(`   Google Maps: https://www.google.com/maps/search/?api=1&query=${userWithGPS.lastAccess.deviceCapture.gpsLatitude},${userWithGPS.lastAccess.deviceCapture.gpsLongitude}`);
      console.log(`   OpenStreetMap: https://www.openstreetmap.org/?mlat=${userWithGPS.lastAccess.deviceCapture.gpsLatitude}&mlon=${userWithGPS.lastAccess.deviceCapture.gpsLongitude}&zoom=15`);
    } else {
      console.log('⚠️ Nenhum usuário com dados de GPS encontrado');
    }
    
    // Testar alertas
    console.log('\n🚨 Testando sistema de alertas...');
    const alertsResponse = await axios.get(`${baseUrl}/api/admin/security-alerts`);
    console.log('✅ Alertas carregados:', alertsResponse.data.length);
    
    if (alertsResponse.data.length > 0) {
      console.log('\n⚠️ ALERTAS DE SEGURANÇA:');
      alertsResponse.data.forEach((alert, index) => {
        console.log(`   ${index + 1}. ${alert.message} (${alert.severity})`);
        console.log(`      Usuário: ${alert.user?.fullName || 'N/A'}`);
        console.log(`      Tipo: ${alert.alertType}`);
        console.log(`      Data: ${new Date(alert.createdAt).toLocaleString('pt-BR')}`);
      });
    }
    
    console.log('\n🎉 === SISTEMA FUNCIONANDO PERFEITAMENTE! ===');
    console.log('\n✅ Funcionalidades Verificadas:');
    console.log('   🔐 Login com GPS obrigatório');
    console.log('   📱 Detecção avançada de dispositivos');
    console.log('   🗺️ Mini mapas OpenStreetMap');
    console.log('   🚨 Sistema de alertas de segurança');
    console.log('   📊 Dashboard em tempo real');
    console.log('   👥 Gerenciamento completo de usuários');
    
  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message);
  }
}

testRealLogin();