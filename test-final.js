console.log('🔍 Testando após mudanças de segurança...');

// Teste 1: API Status
console.log('1. Testando API Status...');
fetch('https://federalglobal-23xbrpxf8-thiago-borges-projects-3ed92125.vercel.app/api/status')
.then(response => {
  console.log('   Status API:', response.status);
  return response.json();
})
.then(data => {
  console.log('   ✅ API Status funcionando!', data);
  console.log('');
  
  // Teste 2: API Hello
  console.log('2. Testando API Hello...');
  return fetch('https://federalglobal-23xbrpxf8-thiago-borges-projects-3ed92125.vercel.app/api/hello');
})
.then(response => {
  console.log('   Hello API:', response.status);
  return response.json();
})
.then(data => {
  console.log('   ✅ API Hello funcionando!', data);
  console.log('');
  
  // Teste 3: API de Login (principal)
  console.log('3. Testando API de Login...');
  const loginData = {
    cpf: '027.692.569-63',
    password: 'Ale290800-####$2',
    gpsData: {
      latitude: -23.5505,
      longitude: -46.6333,
      accuracy: 50
    }
  };
  
  return fetch('https://federalglobal-23xbrpxf8-thiago-borges-projects-3ed92125.vercel.app/api/auth/domain-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Host': 'admin.federalglobal.deltafoxconsult.com.br'
    },
    body: JSON.stringify(loginData)
  });
})
.then(response => {
  console.log('   Login API:', response.status);
  return response.json();
})
.then(data => {
  if (data.success) {
    console.log('   🎉 LOGIN FUNCIONOU!');
    console.log('   Usuário:', data.data.user.name);
    console.log('   Role:', data.data.user.role);
  } else {
    console.log('   ❌ Login falhou:', data.error);
  }
})
.catch(error => {
  console.error('❌ Erro geral:', error);
});