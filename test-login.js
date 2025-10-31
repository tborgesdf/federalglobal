console.log('🔍 Testando validação de senha...');

const testData = {
  cpf: '027.692.569-63',
  password: 'Ale290800-####$2'
};

fetch('https://federalglobal-jj1lwfm4o-thiago-borges-projects-3ed92125.vercel.app/api/test-login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(testData)
})
.then(response => response.json())
.then(data => {
  console.log('📊 Resultado do teste de login:');
  console.log(`   Sucesso: ${data.success}`);
  
  if (data.user) {
    console.log(`   Usuário: ${data.user.fullName}`);
    console.log(`   CPF: ${data.user.cpf}`);
    console.log(`   Role: ${data.user.role}`);
  }
  
  if (data.debug) {
    console.log('🔍 Debug info:');
    console.log(`   Senha fornecida: ${data.debug.passwordProvided}`);
    console.log(`   Hash no banco: ${data.debug.passwordHash}`);
    console.log(`   Senha válida: ${data.debug.passwordValid}`);
  }
  
  if (data.error) {
    console.log(`❌ Erro: ${data.error}`);
  }
})
.catch(error => {
  console.error('❌ Erro na requisição:', error);
});