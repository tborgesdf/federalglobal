# 🌐 Configuração Manual de Domínio - Federal Global

## ❌ Problema Identificado

O domínio `admin.federalglobal.deltafoxconsult.com.br` está retornando erro 404 "DEPLOYMENT_NOT_FOUND" porque o Vercel não consegue encontrar o deployment para esse domínio específico.

## 🔧 Solução: Configuração Manual no Vercel Dashboard

### 1️⃣ Acesse o Vercel Dashboard

- Vá para: https://vercel.com/dashboard
- Faça login na conta: thiago-borges-projects-3ed92125
- Selecione o projeto: `federalglobal`

### 2️⃣ Configurar Domínios Personalizados

#### No painel do projeto Federal Global:

1. **Clique em "Settings" (⚙️)**
2. **Clique em "Domains" no menu lateral**
3. **Adicione os seguintes domínios:**

#### 🔹 Domínio Principal (Cliente):

```
federalglobal.deltafoxconsult.com.br
```

#### 🔹 Domínio Admin:

```
admin.federalglobal.deltafoxconsult.com.br
```

### 3️⃣ Configuração DNS no cPanel (Hostgator)

#### Acesse o cPanel da DeltaFox:

- **URL**: https://cpanel.deltafoxconsult.com.br
- **Usuário**: deltafox
- **Senha**: [sua senha]

#### Configure os seguintes CNAME Records:

```dns
Tipo: CNAME
Nome: federalglobal
Valor: cname.vercel-dns.com.
TTL: 3600
```

```dns
Tipo: CNAME
Nome: admin.federalglobal
Valor: cname.vercel-dns.com.
TTL: 3600
```

### 4️⃣ URLs Finais de Acesso

#### 🌐 Sistema Cliente:

```
https://federalglobal.deltafoxconsult.com.br
```

#### 🔐 Dashboard Administrativo:

```
https://admin.federalglobal.deltafoxconsult.com.br
```

### 5️⃣ Verificação

Após a configuração, aguarde até 24 horas para propagação DNS e teste:

1. **Cliente**: https://federalglobal.deltafoxconsult.com.br
2. **Admin**: https://admin.federalglobal.deltafoxconsult.com.br

### 📝 Credenciais de Teste Admin:

- **CPF**: 12345678901
- **Senha**: admin123

---

## 🚨 Status Atual

- ✅ Deploy no Vercel: **Funcionando**
- ✅ Aplicação: **100% Funcional**
- ❌ Domínio Personalizado: **Requer configuração manual**
- ✅ URL Temporária: https://federalglobal-p3w1ruv2r-thiago-borges-projects-3ed92125.vercel.app

## 📞 Próximos Passos

1. Configure os domínios no Vercel Dashboard (manual)
2. Configure DNS no cPanel
3. Aguarde propagação (até 24h)
4. Teste acessos finais
