console.log('🔍 Verificando variáveis de ambiente...');

fetch('https://federalglobal-lp61q3e3t-thiago-borges-projects-3ed92125.vercel.app/api/env-check')
.then(response => response.json())
.then(data => {
  console.log('📊 Informações do ambiente:');
  console.log(`Protocol: ${data.protocol}`);
  console.log(`Is MySQL: ${data.isMySQL}`);
  console.log(`Environment: ${data.environment}`);
  console.log(`Database URL preview: ${data.databaseUrl}`);
  
  if (!data.isMySQL) {
    console.log('❌ PROBLEMA: DATABASE_URL não está usando protocol mysql://');
  } else {
    console.log('✅ DATABASE_URL está usando protocolo correto');
  }
})
.catch(error => {
  console.error('❌ Erro:', error);
});