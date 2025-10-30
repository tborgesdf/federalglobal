# ConfiguraÃ§Ã£o de DomÃ­nio - Federal Global by DeltaFox

## DomÃ­nios do Sistema

### DomÃ­nio Principal (Cliente):
federalglobal.deltafoxconsult.com.br

### DomÃ­nio Administrativo (Dashboard):
admin.federalglobal.deltafoxconsult.com.br

## ConfiguraÃ§Ã£o DNS no Hostgator

### Registros CNAME NecessÃ¡rios

#### 1. DomÃ­nio Principal (Sistema PÃºblico):
`
Nome: federalglobal
Tipo: CNAME
TTL: 300 (5 minutos)
Destino: federalglobal-j5wn4zibk-thiago-borges-projects-3ed92125.vercel.app
`

#### 2. DomÃ­nio Administrativo (Dashboard):
`
Nome: admin.federalglobal
Tipo: CNAME
TTL: 300 (5 minutos)
Destino: federalglobal-j5wn4zibk-thiago-borges-projects-3ed92125.vercel.app
`

### URL Atual do Vercel:
https://federalglobal-j5wn4zibk-thiago-borges-projects-3ed92125.vercel.app

### Status dos DomÃ­nios:
- âœ… Sistema Cliente: federalglobal.deltafoxconsult.com.br
- âœ… Sistema Admin: admin.federalglobal.deltafoxconsult.com.br
- âœ… Deploy AutomÃ¡tico: Configurado
- âœ… DNS AutomÃ¡tico: Configurado

### Ãšltima AtualizaÃ§Ã£o:
30/10/2025 19:53 - Deploy automÃ¡tico executado

### Comandos de VerificaÃ§Ã£o:
`ash
# Testar DNS Cliente
nslookup federalglobal.deltafoxconsult.com.br

# Testar DNS Admin
nslookup admin.federalglobal.deltafoxconsult.com.br

# Testar HTTPS Cliente
curl -I https://federalglobal.deltafoxconsult.com.br

# Testar HTTPS Admin
curl -I https://admin.federalglobal.deltafoxconsult.com.br
`

### InstruÃ§Ãµes Manuais (se necessÃ¡rio):
Se a configuraÃ§Ã£o automÃ¡tica falhou, configure manualmente no cPanel:

1. Acesse o cPanel do Hostgator
2. VÃ¡ em "Editor de zona DNS"
3. Selecione "deltafoxconsult.com.br"
4. Adicione os registros CNAME conforme especificado acima
