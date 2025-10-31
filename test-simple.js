const testData = {
  cpf: '027.692.569-63',
  password: 'Ale290800-####$2'
};

console.log('🔍 Testando API de teste simples...');

fetch('https://federalglobal-nks7xbgpx-thiago-borges-projects-3ed92125.vercel.app/api/test', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(testData)
})
.then(response => {
  console.log('Status:', response.status);
  return response.json();
})
.then(data => {
  console.log('✅ Resposta da API de teste:');
  console.log(JSON.stringify(data, null, 2));
})
.catch(error => {
  console.error('❌ Erro:', error);
});