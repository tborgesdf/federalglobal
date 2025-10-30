# Script de Deploy Automático - Federal Global by DeltaFox (Windows)
# Este script atualiza automaticamente o subdomínio federalglobal.deltafoxconsult.com.br
# para apontar para o último deploy do Vercel

Write-Host "🚀 Iniciando deploy automático do Federal Global..." -ForegroundColor Green

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

Write-Host "🌐 Atualizando DNS para $Hostname..." -ForegroundColor Yellow

# Configuração para API do Hostgator
# Você precisa configurar essas variáveis com suas credenciais reais
# $HostgatorApiKey = "sua_api_key_aqui"
# $HostgatorApiSecret = "seu_api_secret_aqui"

# Headers para a requisição
$Headers = @{
    'Authorization' = "Bearer $HostgatorApiKey"
    'Content-Type' = 'application/json'
}

# Dados para atualizar o DNS
$DnsData = @{
    domain = "deltafoxconsult.com.br"
    type = "CNAME"
    name = "federalglobal"
    content = $Hostname
    ttl = 300
} | ConvertTo-Json

# Fazer a requisição para atualizar o DNS
try {
    Invoke-RestMethod -Uri "https://api.hostgator.com.br/dns/update" -Method POST -Headers $Headers -Body $DnsData
    Write-Host "✅ DNS atualizado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Aviso: Não foi possível atualizar o DNS automaticamente. Atualize manualmente no painel do Hostgator:" -ForegroundColor Yellow
    Write-Host "   - Nome: federalglobal" -ForegroundColor White
    Write-Host "   - Tipo: CNAME" -ForegroundColor White
    Write-Host "   - Destino: $Hostname" -ForegroundColor White
}

Write-Host "🌐 O site estará disponível em: https://federalglobal.deltafoxconsult.com.br" -ForegroundColor Cyan
Write-Host "⏰ Aguarde alguns minutos para a propagação do DNS" -ForegroundColor Yellow

# Atualizar arquivo de documentação com a nova URL
$FederalGlobalMd = Get-Content "FEDERAL_GLOBAL.md" -Raw
$FederalGlobalMd = $FederalGlobalMd -replace 'https://federalglobal-.*?vercel\.app', $NewUrl
Set-Content "FEDERAL_GLOBAL.md" -Value $FederalGlobalMd

# Fazer commit das mudanças
git add FEDERAL_GLOBAL.md
git commit -m "🔄 Atualização automática de deploy: $NewUrl"
git push origin master

Write-Host "📝 Documentação atualizada e enviada para o GitHub" -ForegroundColor Green
Write-Host "🎉 Deploy automático concluído!" -ForegroundColor Magenta

# Exibir resumo
Write-Host "`n📋 Resumo do Deploy:" -ForegroundColor Cyan
Write-Host "   • Nova URL Vercel: $NewUrl" -ForegroundColor White
Write-Host "   • Subdomínio: federalglobal.deltafoxconsult.com.br" -ForegroundColor White
Write-Host "   • Status: Deploy concluído com sucesso" -ForegroundColor White