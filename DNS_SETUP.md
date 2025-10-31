# Configuração de Domínio - Federal Global by DeltaFox

## URGENTE: Configure o DNS no cPanel

**Status:** ❌ DNS não configurado - admin.federalglobal.deltafoxconsult.com.br não está acessível

## URLs Atuais Funcionando:

### 🔷 Portal Cliente (temporário):

https://federalglobal-nhd4t7fgq-thiago-borges-projects-3ed92125.vercel.app

### 🔶 Dashboard Admin (temporário):

https://federalglobal-nhd4t7fgq-thiago-borges-projects-3ed92125.vercel.app?admin=true

## Configuração DNS no Hostgator (NECESSÁRIA)

### Passo a Passo no cPanel:

1. **Acesse o cPanel do Hostgator**

   - Faça login na sua conta Hostgator
   - Procure por "Editor de zona DNS" ou "DNS Zone Editor"

2. **Selecione o domínio deltafoxconsult.com.br**

3. **Adicione os 2 registros CNAME:**

#### Registro 1 - Portal Cliente:

```
Nome: federalglobal
Tipo: CNAME
TTL: 300
Destino: federalglobal-nhd4t7fgq-thiago-borges-projects-3ed92125.vercel.app
```

#### Registro 2 - Dashboard Admin:

```
Nome: admin.federalglobal
Tipo: CNAME
TTL: 300
Destino: federalglobal-nhd4t7fgq-thiago-borges-projects-3ed92125.vercel.app
```

4. **Salve as alterações**

5. **Aguarde propagação (15-60 minutos)**

## URLs Finais (após DNS configurado):

### 🌐 Portal Cliente:

https://federalglobal.deltafoxconsult.com.br

### 🛡️ Dashboard Admin:

https://admin.federalglobal.deltafoxconsult.com.br

## Teste do Sistema Admin:

### 📋 Para testar o redirecionamento para login:

1. Acesse: https://federalglobal-nhd4t7fgq-thiago-borges-projects-3ed92125.vercel.app?admin=true
2. Deve redirecionar automaticamente para a página de login do admin
3. Use as credenciais de teste:
   - **CPF:** 12345678901
   - **Senha:** SuperAdmin2024!

### ✅ Funcionalidades Implementadas:

- ✅ Redirecionamento automático para login admin
- ✅ Página de login específica para admin com GPS obrigatório
- ✅ Verificação de autenticação antes de acessar dashboard
- ✅ Layout dark específico para admin
- ✅ APIs contextuais para admin vs cliente

### 🔄 URL Atual do Vercel:

https://federalglobal-nhd4t7fgq-thiago-borges-projects-3ed92125.vercel.app

### 📅 Última Atualização:

30/10/2025 20:13 - Corrigido redirecionamento para login admin

## Próximos Passos:

1. **URGENTE:** Configure o DNS no cPanel conforme instruções acima
2. Teste o domínio admin.federalglobal.deltafoxconsult.com.br
3. Verifique se redireciona para a página de login
4. Teste o login com as credenciais fornecidas

## Comandos de Verificação (após DNS configurado):

```bash
# Testar DNS Cliente
nslookup federalglobal.deltafoxconsult.com.br

# Testar DNS Admin
nslookup admin.federalglobal.deltafoxconsult.com.br

# Testar HTTPS Cliente
curl -I https://federalglobal.deltafoxconsult.com.br

# Testar HTTPS Admin
curl -I https://admin.federalglobal.deltafoxconsult.com.br
```
