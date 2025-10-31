console.log('🔍 Testando API hello...');

fetch('https://federalglobal-9aol6zr86-thiago-borges-projects-3ed92125.vercel.app/api/hello')
.then(response => {
  console.log('Status:', response.status);
  return response.json();
})
.then(data => {
  console.log('✅ Resposta da API hello:');
  console.log(JSON.stringify(data, null, 2));
})
.catch(error => {
  console.error('❌ Erro:', error);
});