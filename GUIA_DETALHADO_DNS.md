# 🔧 GUIA DETALHADO - Configuração DNS e Verificação Federal Global

## 📋 PARTE 1: CONFIGURAÇÃO DNS NO CPANEL (PASSO A PASSO)

### 🌐 1.1 Acessando o cPanel da DeltaFox

1. **Abra seu navegador** (Chrome, Firefox, Edge)
2. **Digite na barra de endereços**: `https://cpanel.deltafoxconsult.com.br`
3. **Pressione Enter**
4. **Faça login com suas credenciais:**
   - **Usuário**: `deltafox`
   - **Senha**: `[sua senha do cPanel]`
5. **Clique em "Entrar" ou "Login"**

### 🎯 1.2 Localizando a Zona DNS

1. **No painel principal do cPanel**, procure a seção **"Domínios"**
2. **Clique em "Editor de Zona DNS"** ou **"Zone Editor"**
   - Se não encontrar, procure por **"DNS"** ou **"Advanced DNS Zone Editor"**
3. **Selecione o domínio**: `deltafoxconsult.com.br`
4. **Clique em "Gerenciar"** ou **"Manage"**

### ⚙️ 1.3 Adicionando Registros CNAME (DETALHADO)

#### 🔹 REGISTRO 1: federalglobal

1. **Clique em "Adicionar Registro"** ou **"Add Record"**
2. **Selecione o tipo**: `CNAME`
3. **Preencha os campos:**
   ```
   Nome/Name: federalglobal
   Tipo/Type: CNAME
   TTL: 3600 (ou deixe padrão)
   Destino/Value/Target: cname.vercel-dns.com.
   ```
   **⚠️ IMPORTANTE**: Note o ponto (.) no final de `cname.vercel-dns.com.`
4. **Clique em "Adicionar Registro"** ou **"Save"**

#### 🔹 REGISTRO 2: admin.federalglobal

1. **Clique em "Adicionar Registro"** novamente
2. **Selecione o tipo**: `CNAME`
3. **Preencha os campos:**
   ```
   Nome/Name: admin.federalglobal
   Tipo/Type: CNAME
   TTL: 3600 (ou deixe padrão)
   Destino/Value/Target: cname.vercel-dns.com.
   ```
4. **Clique em "Adicionar Registro"** ou **"Save"**

### ✅ 1.4 Verificando se os Registros foram Criados

1. **Na lista de registros DNS**, procure por:

   - `federalglobal.deltafoxconsult.com.br` → `CNAME` → `cname.vercel-dns.com.`
   - `admin.federalglobal.deltafoxconsult.com.br` → `CNAME` → `cname.vercel-dns.com.`

2. **Se aparecerem na lista**, os registros foram criados com sucesso!

---

## 🔍 PARTE 2: VERIFICAÇÃO COMPLETA (PASSO A PASSO)

### 🕐 2.1 Aguardando Propagação DNS (IMPORTANTE!)

**⏰ Tempo de espera**: 15 minutos a 24 horas

- **Mínimo recomendado**: 30 minutos
- **Máximo normal**: 4-6 horas
- **Em casos raros**: até 24 horas

### 🛠️ 2.2 Verificação via Linha de Comando (Windows)

#### 📝 Método 1: Usando nslookup

1. **Pressione `Windows + R`**
2. **Digite**: `cmd`
3. **Pressione Enter**
4. **No prompt de comando, digite cada comando e pressione Enter:**

```cmd
nslookup federalglobal.deltafoxconsult.com.br
```

**Resultado esperado:**

```
Nome: federalglobal.deltafoxconsult.com.br
Endereços: 76.76.19.61 (ou similar)
```

```cmd
nslookup admin.federalglobal.deltafoxconsult.com.br
```

**Resultado esperado:**

```
Nome: admin.federalglobal.deltafoxconsult.com.br
Endereços: 76.76.19.61 (ou similar)
```

#### 📝 Método 2: Verificando CNAME

```cmd
nslookup -type=CNAME federalglobal.deltafoxconsult.com.br
```

**Resultado esperado:**

```
federalglobal.deltafoxconsult.com.br canonical name = cname.vercel-dns.com
```

```cmd
nslookup -type=CNAME admin.federalglobal.deltafoxconsult.com.br
```

**Resultado esperado:**

```
admin.federalglobal.deltafoxconsult.com.br canonical name = cname.vercel-dns.com
```

### 🌐 2.3 Verificação via Ferramentas Online

#### 🔗 Opção 1: DNS Checker

1. **Acesse**: https://dnschecker.org
2. **Digite**: `federalglobal.deltafoxconsult.com.br`
3. **Selecione tipo**: `CNAME`
4. **Clique em "Search"**
5. **Repita para**: `admin.federalglobal.deltafoxconsult.com.br`

#### 🔗 Opção 2: What's My DNS

1. **Acesse**: https://whatsmydns.net
2. **Digite o domínio e selecione CNAME**
3. **Verifique se aparece verde em vários locais**

### 🚀 2.4 Teste Final nos Navegadores

#### 🔹 Teste 1: Domínio Cliente

1. **Abra uma nova aba no navegador**
2. **Digite**: `https://federalglobal.deltafoxconsult.com.br`
3. **Pressione Enter**
4. **Resultado esperado**: Página do sistema cliente Federal Global

#### 🔹 Teste 2: Domínio Admin

1. **Abra uma nova aba no navegador**
2. **Digite**: `https://admin.federalglobal.deltafoxconsult.com.br`
3. **Pressione Enter**
4. **Resultado esperado**: Página de login administrativa

### 🔐 2.5 Teste de Login Administrativo

1. **No domínio admin**, você deve ver a tela de login
2. **Digite as credenciais:**
   - **CPF**: `12345678901`
   - **Senha**: `admin123`
3. **Clique em "Entrar"**
4. **Resultado esperado**: Dashboard administrativo completo

---

## 🚨 DIAGNÓSTICO DE PROBLEMAS

### ❌ Se não funcionar após 1 hora:

#### 🔍 Verificação 1: Registros DNS

```cmd
nslookup -type=CNAME federalglobal.deltafoxconsult.com.br 8.8.8.8
```

Se não retornar `cname.vercel-dns.com`, o registro não foi criado corretamente.

#### 🔍 Verificação 2: Propagação

```cmd
ping federalglobal.deltafoxconsult.com.br
```

Se der "não foi possível localizar", ainda está propagando.

#### 🔍 Verificação 3: Vercel Status

1. **Acesse**: https://vercel.com/dashboard
2. **Projeto**: federalglobal
3. **Settings** → **Domains**
4. **Verifique se aparecem**: ✅ Valid Configuration

### 🆘 Se continuar com problemas:

#### 📞 Contato Hostgator:

- **Telefone**: 0800 582 0192
- **Chat**: Site da Hostgator
- **Informe**: "Preciso configurar registros CNAME para federalglobal e admin.federalglobal"

---

## ✅ CHECKLIST FINAL

### 📋 DNS Configurado:

- [ ] Registro CNAME `federalglobal` → `cname.vercel-dns.com.`
- [ ] Registro CNAME `admin.federalglobal` → `cname.vercel-dns.com.`
- [ ] Aguardado tempo de propagação (mín. 30 min)

### 📋 Verificações Realizadas:

- [ ] `nslookup federalglobal.deltafoxconsult.com.br` retorna IP
- [ ] `nslookup admin.federalglobal.deltafoxconsult.com.br` retorna IP
- [ ] Teste online em dnschecker.org mostra verde
- [ ] URLs abrem no navegador

### 📋 Sistema Funcionando:

- [ ] `https://federalglobal.deltafoxconsult.com.br` abre página cliente
- [ ] `https://admin.federalglobal.deltafoxconsult.com.br` abre login admin
- [ ] Login funciona com CPF: 12345678901 / Senha: admin123
- [ ] Dashboard administrativo carrega completamente

---

## 🎯 URLS FINAIS DE ACESSO

### 🌐 Sistema Cliente:

```
https://federalglobal.deltafoxconsult.com.br
```

### 🔐 Dashboard Administrativo:

```
https://admin.federalglobal.deltafoxconsult.com.br
```

### 🔑 Credenciais Admin:

```
CPF: 12345678901
Senha: admin123
```

**⏰ Tempo total estimado**: 30 minutos a 4 horas (dependendo da propagação DNS)
