// Script para criar usuários de teste
const testUsers = [
  {
    name: "Ana Costa Silva",
    email: "ana.costa@email.com",
    cpf: "11122233344",
    phone: "11987654321",
    birthDate: "1992-03-15",
    password: "senha123456",
    acceptedTerms: true,
    termsAcceptedAt: new Date().toISOString(),
    gpsData: { latitude: -23.5505, longitude: -46.6333 },
    deviceInfo: {
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      platform: "Win32",
      language: "pt-BR",
      screenResolution: "1920x1080",
      timezone: "America/Sao_Paulo",
      timestamp: new Date().toISOString()
    }
  },
  {
    name: "Carlos Eduardo Santos",
    email: "carlos.santos@email.com",
    cpf: "22233344455",
    phone: "11876543210",
    birthDate: "1988-07-22",
    password: "senha123456",
    acceptedTerms: true,
    termsAcceptedAt: new Date().toISOString(),
    gpsData: { latitude: -22.9068, longitude: -43.1729 },
    deviceInfo: {
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      platform: "MacIntel",
      language: "pt-BR",
      screenResolution: "1440x900",
      timezone: "America/Sao_Paulo",
      timestamp: new Date().toISOString()
    }
  },
  {
    name: "Mariana Oliveira Lima",
    email: "mariana.lima@email.com",
    cpf: "33344455566",
    phone: "11765432109",
    birthDate: "1995-11-10",
    password: "senha123456",
    acceptedTerms: true,
    termsAcceptedAt: new Date().toISOString(),
    gpsData: { latitude: -15.7942, longitude: -47.8825 },
    deviceInfo: {
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15",
      platform: "iPhone",
      language: "pt-BR",
      screenResolution: "375x812",
      timezone: "America/Sao_Paulo",
      timestamp: new Date().toISOString()
    }
  }
]

console.log('🧪 Criando usuários de teste...')
console.log('\nPara criar os usuários, execute os seguintes comandos curl:\n')

testUsers.forEach((user, index) => {
  const jsonData = JSON.stringify(user)
  console.log(`# Usuário ${index + 1}: ${user.name}`)
  console.log(`curl -X POST http://localhost:3000/api/auth/register \\`)
  console.log(`  -H "Content-Type: application/json" \\`)
  console.log(`  -d '${jsonData}'\n`)
})

console.log('📋 Ou use este comando para criar todos de uma vez:')
console.log('\nnode create-test-users.js\n')