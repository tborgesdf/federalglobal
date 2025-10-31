console.log('🔍 Testando API hello direta do Vercel...');

fetch('https://federalglobal-mx1grcr2f-thiago-borges-projects-3ed92125.vercel.app/api/hello')
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