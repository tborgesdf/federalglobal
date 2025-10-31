const testData = {
  cpf: '027.692.569-63',
  password: 'Ale290800-####$2'
};

console.log('🔍 Testando login na API de debug...');

fetch('https://federalglobal-lbikkauly-thiago-borges-projects-3ed92125.vercel.app/api/debug', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData)
})
.then(response => response.json())
.then(data => {
  console.log('✅ Resposta da API:');
  console.log(JSON.stringify(data, null, 2));
})
.catch(error => {
  console.error('❌ Erro:', error);
});