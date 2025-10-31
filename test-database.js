console.log('🔍 Testando conexão com banco de dados...');

fetch('https://federalglobal-kksxwc6fz-thiago-borges-projects-3ed92125.vercel.app/api/db-test')
.then(response => {
  console.log('Status:', response.status);
  return response.json();
})
.then(data => {
  if (data.success) {
    console.log('✅ Banco de dados conectado!');
    console.log(`Total de usuários: ${data.database.totalUsers}`);
    console.log('Usuários encontrados:');
    data.database.users.forEach(user => {
      console.log(`  - ${user.fullName} (${user.cpf}) - ${user.role}`);
    });
    
    if (data.thiagoUser) {
      console.log('');
      console.log('🔍 Usuário Thiago encontrado:');
      console.log(`  Nome: ${data.thiagoUser.fullName}`);
      console.log(`  CPF: ${data.thiagoUser.cpf}`);
      console.log(`  Email: ${data.thiagoUser.email}`);
      console.log(`  Role: ${data.thiagoUser.role}`);
      console.log(`  Ativo: ${data.thiagoUser.active}`);
      console.log(`  Tem senha: ${data.thiagoUser.hasPassword}`);
    } else {
      console.log('❌ Usuário Thiago não encontrado no banco');
    }
  } else {
    console.log('❌ Erro no banco:', data.error);
    console.log('DATABASE_URL:', data.databaseUrl);
  }
})
.catch(error => {
  console.error('❌ Erro:', error);
});