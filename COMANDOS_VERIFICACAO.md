# 🖥️ COMANDOS DE VERIFICAÇÃO MANUAL - Federal Global

## 📋 COPIE E COLE ESTES COMANDOS NO CMD/POWERSHELL

### 🔹 1. Verificar se DNS está configurado (CNAME)

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

### 🔹 2. Verificar se domínios resolvem para IP

```cmd
nslookup federalglobal.deltafoxconsult.com.br
```
**Resultado esperado:** 
```
Nome: federalglobal.deltafoxconsult.com.br
Endereços: 76.76.19.61 (ou IP similar)
```

```cmd
nslookup admin.federalglobal.deltafoxconsult.com.br
```
**Resultado esperado:** 
```
Nome: admin.federalglobal.deltafoxconsult.com.br
Endereços: 76.76.19.61 (ou IP similar)
```

### 🔹 3. Testar conectividade

```cmd
ping federalglobal.deltafoxconsult.com.br
```
**Resultado esperado:** 
```
Fazendo ping federalglobal.deltafoxconsult.com.br [IP] com 32 bytes de dados:
Resposta de [IP]: bytes=32 tempo=XXXms TTL=XX
```

```cmd
ping admin.federalglobal.deltafoxconsult.com.br
```

### 🔹 4. Verificar certificado SSL

```cmd
curl -I https://federalglobal.deltafoxconsult.com.br
```
**Resultado esperado:** 
```
HTTP/2 200
```

```cmd
curl -I https://admin.federalglobal.deltafoxconsult.com.br
```

---

## 🔧 SCRIPT DE VERIFICAÇÃO AUTOMÁTICA

### Para executar o script completo:

1. **Abra PowerShell como Administrador**
   - Pressione `Windows + X`
   - Clique em "Windows PowerShell (Administrador)"

2. **Navegue até a pasta do projeto:**
```powershell
cd "c:\Users\Thiago Borges\Documents\Projetos\produtos\FederalGlobal"
```

3. **Execute o script de verificação:**
```powershell
powershell -ExecutionPolicy Bypass -File scripts\verificar-sistema.ps1
```

### 🎯 O que o script verifica:

- ✅ **DNS CNAME** configurado corretamente
- ✅ **Resolução de IP** funcionando
- ✅ **Sites respondendo** (HTTP 200)
- ✅ **Conteúdo correto** carregando
- ✅ **Certificado SSL** ativo

---

## 🌐 VERIFICAÇÃO ONLINE (ALTERNATIVA)

### Sites para verificar DNS externamente:

#### 1. DNS Checker:
- **Acesse:** https://dnschecker.org
- **Digite:** `federalglobal.deltafoxconsult.com.br`
- **Tipo:** `CNAME`
- **Resultado esperado:** Verde em múltiplos locais

#### 2. What's My DNS:
- **Acesse:** https://whatsmydns.net
- **Digite o domínio**
- **Tipo:** `CNAME`
- **Resultado esperado:** Propagação global verde

#### 3. MX Toolbox:
- **Acesse:** https://mxtoolbox.com/DNSLookup.aspx
- **Digite:** `federalglobal.deltafoxconsult.com.br`
- **Resultado esperado:** Retorna IP do Vercel

---

## ⚡ VERIFICAÇÃO RÁPIDA (1 MINUTO)

### Teste mais simples possível:

1. **Abra CMD** (Windows + R, digite `cmd`, Enter)

2. **Cole este comando:**
```cmd
nslookup federalglobal.deltafoxconsult.com.br && nslookup admin.federalglobal.deltafoxconsult.com.br
```

3. **Se retornar IPs**, o DNS está configurado!

4. **Teste no navegador:**
   - Abra: `https://federalglobal.deltafoxconsult.com.br`
   - Abra: `https://admin.federalglobal.deltafoxconsult.com.br`

### 🔴 Se não funcionar:

1. **Aguarde 30 minutos**
2. **Execute os comandos novamente**
3. **Se ainda não funcionar após 4 horas**, há problema na configuração DNS

---

## 📞 SUPORTE TÉCNICO

### Se precisar de ajuda:

1. **Execute o script de verificação**
2. **Tire screenshot dos resultados**
3. **Copie as mensagens de erro**
4. **Entre em contato com:**
   - **Hostgator:** 0800 582 0192
   - **Vercel:** https://vercel.com/help

### Informações para fornecer ao suporte:

- **Domínio:** deltafoxconsult.com.br
- **Subdomínios:** federalglobal e admin.federalglobal
- **Destino CNAME:** cname.vercel-dns.com
- **Tipo de hospedagem:** Hostgator compartilhada