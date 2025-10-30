import { CompanyUserService } from '../src/lib/services/companyUserService';

async function initializeSuperAdmin() {
  try {
    console.log('🚀 Inicializando Super Administrador...');
    
    const superAdmin = await CompanyUserService.createInitialSuperAdmin();
    
    console.log('✅ Super Administrador criado com sucesso!');
    console.log('📋 Dados de acesso:');
    console.log(`   CPF: 027.692.569-63`);
    console.log(`   Email: tborges@deltafoxconsult.com.br`);
    console.log(`   Senha: FederalGlobal2024!`);
    console.log(`   Protocolo: ${superAdmin.protocolNumber}`);
    console.log(`   Role: ${superAdmin.role}`);
    console.log('');
    console.log('⚠️  IMPORTANTE: Altere a senha no primeiro login!');
    
  } catch (error) {
    console.error('❌ Erro ao inicializar Super Administrador:', error);
  } finally {
    process.exit(0);
  }
}

initializeSuperAdmin();