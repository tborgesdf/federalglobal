// Teste local do endpoint domain-login
const testLocalDomainLogin = async () => {
  try {
    console.log('🔐 Testando endpoint domain-login LOCAL com credenciais reais...')
    console.log('')
    
    const credentials = {
      cpf: '027.692.569-63',
      password: 'Ale290800-####$2',
      gpsData: {
        latitude: -15.7939,
        longitude: -47.8828,
        accuracy: 10
      }
    }
    
    console.log('📋 Enviando requisição para:')
    console.log('   URL: http://localhost:3000/api/auth/domain-login')
    console.log(`   CPF: ${credentials.cpf}`)
    console.log(`   Senha: ${credentials.password}`)
    console.log('   GPS: Brasília, DF')
    console.log('')
    
    const response = await fetch('http://localhost:3000/api/auth/domain-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Host': 'admin.federalglobal.deltafoxconsult.com.br'
      },
      body: JSON.stringify(credentials)
    })
    
    const result = await response.json()
    
    console.log('📥 Resposta recebida:')
    console.log(`   Status: ${response.status}`)
    console.log(`   Success: ${result.success}`)
    
    if (result.success) {
      console.log('✅ LOGIN LOCAL FUNCIONOU!')
      console.log('   Dados do usuário:')
      console.log(`   - ID: ${result.data.user.id}`)
      console.log(`   - Nome: ${result.data.user.name}`)
      console.log(`   - Email: ${result.data.user.email}`)
      console.log(`   - Role: ${result.data.user.role}`)
    } else {
      console.log('❌ LOGIN LOCAL FALHOU!')
      console.log(`   Erro: ${result.error}`)
      console.log('   Resposta completa:', JSON.stringify(result, null, 2))
    }
    
  } catch (error) {
    console.error('❌ Erro na requisição:', error)
  }
}

// Executar teste
testLocalDomainLogin()