import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function testLogin() {
  try {
    console.log('🔐 Testando login com credenciais reais...')
    
    const cpf = '02769256963'
    const password = 'Ale290800-####$2'
    
    // Buscar usuário
    const user = await prisma.companyUser.findUnique({
      where: { cpf: cpf }
    })
    
    if (!user) {
      console.log('❌ Usuário não encontrado')
      return
    }
    
    console.log('✅ Usuário encontrado:')
    console.log(`   Nome: ${user.fullName}`)
    console.log(`   CPF: ${user.cpf}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Ativo: ${user.active}`)
    
    // Testar senha
    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    if (isPasswordValid) {
      console.log('✅ Senha CORRETA! Login deve funcionar')
    } else {
      console.log('❌ Senha INCORRETA!')
      console.log('🔍 Hash armazenado:', user.password.substring(0, 20) + '...')
      
      // Testar com hash manual
      const newHash = await bcrypt.hash(password, 12)
      console.log('🔍 Novo hash gerado:', newHash.substring(0, 20) + '...')
      
      // Atualizar senha no banco
      await prisma.companyUser.update({
        where: { id: user.id },
        data: { password: newHash }
      })
      
      console.log('✅ Senha atualizada no banco!')
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testLogin()