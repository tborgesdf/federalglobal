console.log('🔍 Testando com curl...');

// Simulando uma requisição cURL
const url = 'https://federalglobal-9aol6zr86-thiago-borges-projects-3ed92125.vercel.app/api/hello';

fetch(url, {
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('Status:', response.status);
  console.log('Headers:', Object.fromEntries(response.headers.entries()));
  return response.text(); // Usar text() em vez de json() para ver o conteúdo real
})
.then(data => {
  console.log('✅ Resposta raw:');
  console.log(data);
})
.catch(error => {
  console.error('❌ Erro:', error);
});