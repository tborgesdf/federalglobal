const testData = {
  cpf: '027.692.569-63',
  password: 'Ale290800-####$2',
  gpsData: {
    latitude: -23.5505,
    longitude: -46.6333,
    accuracy: 50
  }
};

console.log('🔍 Testando login completo...');

fetch('https://federalglobal-abvkgsmfl-thiago-borges-projects-3ed92125.vercel.app/api/auth/domain-login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Host': 'admin.federalglobal.deltafoxconsult.com.br'
  },
  body: JSON.stringify(testData)
})
.then(response => {
  console.log('Status:', response.status);
  return response.json();
})
.then(data => {
  console.log('✅ Resposta da API de login:');
  console.log(JSON.stringify(data, null, 2));
})
.catch(error => {
  console.error('❌ Erro:', error);
});