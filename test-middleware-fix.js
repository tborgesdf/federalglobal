console.log('🔍 Testando com middleware simplificado...');

fetch('https://federalglobal-cg5k4mx1u-thiago-borges-projects-3ed92125.vercel.app/api/hello')
.then(response => {
  console.log('Status:', response.status);
  if (response.ok) {
    return response.json();
  } else {
    return response.text();
  }
})
.then(data => {
  console.log('✅ Resposta:');
  console.log(data);
})
.catch(error => {
  console.error('❌ Erro:', error);
});