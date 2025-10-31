console.log('🔍 Testando API via domínio personalizado...');

// Teste 1: API Hello via domínio personalizado
fetch('https://admin.federalglobal.deltafoxconsult.com.br/api/hello')
.then(response => {
  console.log('✅ API Hello Status:', response.status);
  if (response.ok) {
    return response.json();
  } else {
    return response.text();
  }
})
.then(data => {
  console.log('Resposta API Hello:', data);
  console.log('');
  
  // Teste 2: API de login
  const testData = {
    cpf: '027.692.569-63',
    password: 'Ale290800-####$2',
    gpsData: {
      latitude: -23.5505,
      longitude: -46.6333,
      accuracy: 50
    }
  };

  console.log('🔐 Testando API de login...');
  return fetch('https://admin.federalglobal.deltafoxconsult.com.br/api/auth/domain-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Host': 'admin.federalglobal.deltafoxconsult.com.br'
    },
    body: JSON.stringify(testData)
  });
})
.then(response => {
  console.log('✅ API Login Status:', response.status);
  if (response.ok) {
    return response.json();
  } else {
    return response.text();
  }
})
.then(data => {
  console.log('Resposta API Login:', data);
})
.catch(error => {
  console.error('❌ Erro:', error);
});