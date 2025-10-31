console.log('🔍 Testando login real após correção...');

const testData = {
  cpf: '027.692.569-63',
  password: 'Ale290800-####$2',
  gpsData: {
    latitude: -23.5505,
    longitude: -46.6333,
    accuracy: 50
  }
};

fetch('https://federalglobal-mx1grcr2f-thiago-borges-projects-3ed92125.vercel.app/api/auth/domain-login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Host': 'admin.federalglobal.deltafoxconsult.com.br'
  },
  body: JSON.stringify(testData)
})
.then(response => {
  console.log('Status:', response.status);
  if (response.ok) {
    return response.json();
  } else {
    return response.text().then(text => {
      console.log('Resposta texto:', text);
      throw new Error(`HTTP ${response.status}: ${text}`);
    });
  }
})
.then(data => {
  console.log('✅ Login funcionou!');
  console.log(JSON.stringify(data, null, 2));
})
.catch(error => {
  console.error('❌ Erro:', error.message);
});