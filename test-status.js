console.log('🔍 Testando API status...');

fetch('https://federalglobal-67zliq9lb-thiago-borges-projects-3ed92125.vercel.app/api/status')
.then(response => {
  console.log('Status:', response.status);
  return response.json();
})
.then(data => {
  console.log('✅ API Status funcionando!');
  console.log(data);
  
  // Se essa funcionar, vamos testar a API hello
  return fetch('https://federalglobal-67zliq9lb-thiago-borges-projects-3ed92125.vercel.app/api/hello');
})
.then(response => {
  console.log('Hello API Status:', response.status);
  if (response.ok) {
    return response.json();
  } else {
    return response.text();
  }
})
.then(data => {
  console.log('API Hello resposta:', data);
})
.catch(error => {
  console.error('❌ Erro:', error);
});