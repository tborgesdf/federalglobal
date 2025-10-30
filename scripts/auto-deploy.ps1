# Script de Deploy Automático - Federal Global by DeltaFox (Windows)
# Este script gerencia deploy dual para:
# - federalglobal.deltafoxconsult.com.br (Cliente)
# - admin.federalglobal.deltafoxconsult.com.br (Dashboard)

Write-Host "🚀 Iniciando deploy automático do Federal Global..." -ForegroundColor Green
Write-Host "📊 Sistema Dual: Cliente + Admin Dashboard" -ForegroundColor Cyan

# Fazer o deploy no Vercel e capturar a URL
Write-Host "📦 Fazendo deploy no Vercel..." -ForegroundColor Yellow
$DeployOutput = vercel --prod 2>&1 | Out-String
$NewUrl = [regex]::Match($DeployOutput, 'https://[^\s]*vercel\.app').Value

if (-not $NewUrl) {
    Write-Host "❌ Erro: Não foi possível obter a URL do deploy" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Deploy realizado com sucesso: $NewUrl" -ForegroundColor Green

# Extrair apenas o hostname (sem https://)
$Hostname = $NewUrl -replace 'https://', ''

Write-Host "🌐 Configurando domínios múltiplos..." -ForegroundColor Yellow

# Configuração para API do Hostgator
# Você precisa configurar essas variáveis com suas credenciais reais
# $HostgatorApiKey = $env:HOSTGATOR_API_KEY
# $HostgatorApiSecret = $env:HOSTGATOR_API_SECRET

# Headers para a requisição
$Headers = @{
    'Authorization' = "Bearer $HostgatorApiKey"
    'Content-Type' = 'application/json'
}

# Função para atualizar DNS
function Update-DNS {
    param (
        [string]$SubDomain,
        [string]$Target,
        [string]$Description
    )
    
    Write-Host "🔄 Atualizando DNS: $SubDomain -> $Target" -ForegroundColor Blue
    
    $DnsData = @{
        domain = "deltafoxconsult.com.br"
        type = "CNAME"
        name = $SubDomain
        content = $Target
        ttl = 300
    } | ConvertTo-Json

    try {
        Invoke-RestMethod -Uri "https://api.hostgator.com.br/dns/update" -Method POST -Headers $Headers -Body $DnsData
        Write-Host "✅ $Description atualizado com sucesso!" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "⚠️ Aviso: Não foi possível atualizar $Description automaticamente" -ForegroundColor Yellow
        Write-Host "   - Nome: $SubDomain" -ForegroundColor White
        Write-Host "   - Tipo: CNAME" -ForegroundColor White
        Write-Host "   - Destino: $Target" -ForegroundColor White
        return $false
    }
}

# Atualizar ambos os domínios
$ClienteOk = Update-DNS -SubDomain "federalglobal" -Target $Hostname -Description "DNS Cliente"
$AdminOk = Update-DNS -SubDomain "admin.federalglobal" -Target $Hostname -Description "DNS Admin"

# Configurar domínios no Vercel
Write-Host "🌐 Configurando domínios no Vercel..." -ForegroundColor Blue
vercel domains add federalglobal.deltafoxconsult.com.br 2>$null
vercel domains add admin.federalglobal.deltafoxconsult.com.br 2>$null

# Atualizar arquivo de documentação DNS
$CurrentDate = Get-Date -Format "dd/MM/yyyy HH:mm"
$DnsConfigContent = @"
# Configuração de Domínio - Federal Global by DeltaFox

## Domínios do Sistema

### Domínio Principal (Cliente):
federalglobal.deltafoxconsult.com.br

### Domínio Administrativo (Dashboard):
admin.federalglobal.deltafoxconsult.com.br

## Configuração DNS no Hostgator

### Registros CNAME Necessários

#### 1. Domínio Principal (Sistema Público):
```
Nome: federalglobal
Tipo: CNAME
TTL: 300 (5 minutos)
Destino: $Hostname
```

#### 2. Domínio Administrativo (Dashboard):
```
Nome: admin.federalglobal
Tipo: CNAME
TTL: 300 (5 minutos)
Destino: $Hostname
```

### URL Atual do Vercel:
$NewUrl

### Status dos Domínios:
- $(if($ClienteOk){"✅"}else{"❌"}) Sistema Cliente: federalglobal.deltafoxconsult.com.br
- $(if($AdminOk){"✅"}else{"❌"}) Sistema Admin: admin.federalglobal.deltafoxconsult.com.br
- ✅ Deploy Automático: Configurado
- $(if($ClienteOk -and $AdminOk){"✅"}else{"⚠️"}) DNS Automático: $(if($ClienteOk -and $AdminOk){"Configurado"}else{"Requer configuração manual"})

### Última Atualização:
$CurrentDate - Deploy automático executado

### Comandos de Verificação:
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

### Instruções Manuais (se necessário):
Se a configuração automática falhou, configure manualmente no cPanel:

1. Acesse o cPanel do Hostgator
2. Vá em "Editor de zona DNS"
3. Selecione "deltafoxconsult.com.br"
4. Adicione os registros CNAME conforme especificado acima
"@

Set-Content "DNS_CONFIG.md" -Value $DnsConfigContent -Encoding UTF8

# Atualizar arquivo de documentação principal
$FederalGlobalMd = Get-Content "FEDERAL_GLOBAL.md" -Raw
$FederalGlobalMd = $FederalGlobalMd -replace 'https://federalglobal-.*?vercel\.app', $NewUrl
Set-Content "FEDERAL_GLOBAL.md" -Value $FederalGlobalMd

# Fazer commit das mudanças
git add .
git commit -m "🔄 Deploy automático dual: Cliente + Admin | $NewUrl"
git push origin master

Write-Host "📝 Documentação atualizada e enviada para o GitHub" -ForegroundColor Green

# Exibir resumo final
Write-Host "`n🎉 Deploy automático concluído!" -ForegroundColor Magenta
Write-Host "`n📋 Resumo do Deploy:" -ForegroundColor Cyan
Write-Host "   • Nova URL Vercel: $NewUrl" -ForegroundColor White
Write-Host "   • Sistema Cliente: federalglobal.deltafoxconsult.com.br" -ForegroundColor Blue
Write-Host "   • Sistema Admin: admin.federalglobal.deltafoxconsult.com.br" -ForegroundColor Red
Write-Host "   • Status DNS Cliente: $(if($ClienteOk){"✅ OK"}else{"❌ Manual"})" -ForegroundColor White
Write-Host "   • Status DNS Admin: $(if($AdminOk){"✅ OK"}else{"❌ Manual"})" -ForegroundColor White

Write-Host "`n🌐 URLs Disponíveis:" -ForegroundColor Yellow
Write-Host "   🔷 Cliente Portal: https://federalglobal.deltafoxconsult.com.br" -ForegroundColor Blue
Write-Host "   🔶 Admin Dashboard: https://admin.federalglobal.deltafoxconsult.com.br" -ForegroundColor Red
Write-Host "   🔸 Vercel URL: $NewUrl" -ForegroundColor Gray

Write-Host "`n⏰ Aguarde alguns minutos para a propagação do DNS" -ForegroundColor Yellow
Write-Host "📖 Consulte DNS_CONFIG.md para instruções detalhadas" -ForegroundColor Cyan