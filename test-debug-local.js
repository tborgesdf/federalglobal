console.log('🔍 Testando API de debug local...');

fetch('http://localhost:3000/api/debug')
.then(response => response.json())
.then(data => {
  console.log('✅ Resposta da API de debug:');
  console.log(JSON.stringify(data, null, 2));
})
.catch(error => {
  console.error('❌ Erro:', error);
});