console.log('🔍 Testando nova API de debug...');

fetch('https://federalglobal-abvkgsmfl-thiago-borges-projects-3ed92125.vercel.app/api/debug')
.then(response => response.json())
.then(data => {
  console.log('✅ Resposta da API de debug:');
  console.log(JSON.stringify(data, null, 2));
})
.catch(error => {
  console.error('❌ Erro:', error);
});