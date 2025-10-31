# Script para configurar domínio no Vercel
# Federal Global by DeltaFox

Write-Host "🚀 Federal Global - Configuração de Domínio" -ForegroundColor Cyan

# Verificar se o Vercel CLI está instalado
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI não encontrado. Instale com: npm i -g vercel" -ForegroundColor Red
    exit 1
}

# Configurar domínios
Write-Host "📍 Configurando domínios..." -ForegroundColor Yellow

# Domínio principal para cliente
Write-Host "Configurando: federalglobal.deltafoxconsult.com.br" -ForegroundColor Blue
vercel domains add federalglobal.deltafoxconsult.com.br

# Domínio admin
Write-Host "Configurando: admin.federalglobal.deltafoxconsult.com.br" -ForegroundColor Blue
vercel domains add admin.federalglobal.deltafoxconsult.com.br

# Vincular domínios ao projeto
Write-Host "🔗 Vinculando domínios ao projeto..." -ForegroundColor Yellow
vercel domains ls

Write-Host "✅ Configuração de domínio concluída!" -ForegroundColor Green
Write-Host "📝 Agora configure os seguintes registros DNS no cPanel:" -ForegroundColor Cyan
Write-Host ""
Write-Host "CNAME Records:" -ForegroundColor White
Write-Host "federalglobal                -> cname.vercel-dns.com" -ForegroundColor Yellow
Write-Host "admin.federalglobal          -> cname.vercel-dns.com" -ForegroundColor Yellow
Write-Host ""
Write-Host "🌐 URLs de acesso:" -ForegroundColor Cyan
Write-Host "Cliente: https://federalglobal.deltafoxconsult.com.br" -ForegroundColor Green
Write-Host "Admin: https://admin.federalglobal.deltafoxconsult.com.br" -ForegroundColor Green