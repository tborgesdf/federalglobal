import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createTestPublicUsers() {
  try {
    console.log('🧪 Criando usuários públicos de teste...')

    // Usuário 1
    const user1 = await prisma.user.upsert({
      where: { email: 'ana.costa@email.com' },
      update: {},
      create: {
        name: 'Ana Costa Silva',
        email: 'ana.costa@email.com',
        cpf: '11122233344',
        phone: '11987654321',
        birthDate: new Date('1992-03-15'),
        password: '$2a$12$hashedpassword123', // Hash fictício
        role: 'USER',
        isActive: true,
        emailVerified: true,
        acceptedTerms: true,
        termsAcceptedAt: new Date(),
        gpsLatitude: -23.5505,
        gpsLongitude: -46.6333,
        deviceInfo: JSON.stringify({
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          platform: 'Win32',
          language: 'pt-BR',
          screenResolution: '1920x1080',
          timezone: 'America/Sao_Paulo',
          timestamp: new Date().toISOString()
        })
      }
    })

    // Usuário 2
    const user2 = await prisma.user.upsert({
      where: { email: 'carlos.santos@email.com' },
      update: {},
      create: {
        name: 'Carlos Eduardo Santos',
        email: 'carlos.santos@email.com',
        cpf: '22233344455',
        phone: '11876543210',
        birthDate: new Date('1988-07-22'),
        password: '$2a$12$hashedpassword123',
        role: 'USER',
        isActive: true,
        emailVerified: false,
        acceptedTerms: true,
        termsAcceptedAt: new Date(),
        gpsLatitude: -22.9068,
        gpsLongitude: -43.1729,
        deviceInfo: JSON.stringify({
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          platform: 'MacIntel',
          language: 'pt-BR',
          screenResolution: '1440x900',
          timezone: 'America/Sao_Paulo',
          timestamp: new Date().toISOString()
        })
      }
    })

    // Usuário 3
    const user3 = await prisma.user.upsert({
      where: { email: 'mariana.lima@email.com' },
      update: {},
      create: {
        name: 'Mariana Oliveira Lima',
        email: 'mariana.lima@email.com',
        cpf: '33344455566',
        phone: '11765432109',
        birthDate: new Date('1995-11-10'),
        password: '$2a$12$hashedpassword123',
        role: 'USER',
        isActive: true,
        emailVerified: true,
        acceptedTerms: true,
        termsAcceptedAt: new Date(),
        gpsLatitude: -15.7942,
        gpsLongitude: -47.8825,
        deviceInfo: JSON.stringify({
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15',
          platform: 'iPhone',
          language: 'pt-BR',
          screenResolution: '375x812',
          timezone: 'America/Sao_Paulo',
          timestamp: new Date().toISOString()
        })
      }
    })

    // Usuário 4 - Sem GPS para teste
    const user4 = await prisma.user.upsert({
      where: { email: 'pedro.oliveira@email.com' },
      update: {},
      create: {
        name: 'Pedro Oliveira Costa',
        email: 'pedro.oliveira@email.com',
        cpf: '44455566677',
        phone: '11654321098',
        birthDate: new Date('1990-08-05'),
        password: '$2a$12$hashedpassword123',
        role: 'USER',
        isActive: false,
        emailVerified: false,
        acceptedTerms: false,
        termsAcceptedAt: null,
        gpsLatitude: null,
        gpsLongitude: null,
        deviceInfo: JSON.stringify({
          userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
          platform: 'Linux x86_64',
          language: 'pt-BR',
          screenResolution: '1366x768',
          timezone: 'America/Sao_Paulo',
          timestamp: new Date().toISOString()
        })
      }
    })

    console.log('✅ Usuários de teste criados:')
    console.log(`1. ${user1.name} (ID: ${user1.id}) - GPS: ✅`)
    console.log(`2. ${user2.name} (ID: ${user2.id}) - GPS: ✅`)
    console.log(`3. ${user3.name} (ID: ${user3.id}) - GPS: ✅`)
    console.log(`4. ${user4.name} (ID: ${user4.id}) - GPS: ❌`)
    
    console.log('\n🎯 Agora você pode:')
    console.log('1. Fazer login como Super Admin:')
    console.log('   CPF: 027.692.569-63')
    console.log('   Senha: Ale290800-####$2')
    console.log('2. Acessar: http://localhost:3000/admin')
    console.log('3. Clicar em "Painel de Clientes"')
    console.log('4. Ver os usuários cadastrados!')

  } catch (error) {
    console.error('❌ Erro ao criar usuários:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestPublicUsers()