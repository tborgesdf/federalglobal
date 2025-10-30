# Configuração de Domínio - Federal Global by DeltaFox

## Domínio Principal

federalglobal.deltafoxconsult.com.br

## Configuração DNS no Hostgator

### Registro CNAME

```
Nome: federalglobal
Tipo: CNAME
TTL: 300 (5 minutos)
Destino: [URL_ATUAL_DO_VERCEL] (sem https://)
```

### Como Configurar Manualmente:

1. **Acesse o painel do Hostgator**

   - Entre na sua conta do Hostgator
   - Vá para "Gerenciador de DNS" ou "DNS Zone Editor"

2. **Encontre o domínio deltafoxconsult.com.br**

   - Clique em "Gerenciar" ou "Editar"

3. **Adicionar/Editar registro CNAME**

   - Tipo: CNAME
   - Nome: federalglobal
   - Destino: federalglobal-[codigo].vercel.app (URL atual sem https://)
   - TTL: 300

4. **Salvar alterações**

### Verificação:

```bash
# Testar DNS
nslookup federalglobal.deltafoxconsult.com.br

# Testar HTTPS
curl -I https://federalglobal.deltafoxconsult.com.br
```

### URL Atual do Vercel:

https://federalglobal-fo2kgz1a5-thiago-borges-projects-3ed92125.vercel.app

### Última Atualização:

30/10/2025 - Configuração inicial
