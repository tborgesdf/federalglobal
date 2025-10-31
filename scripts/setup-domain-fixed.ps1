# Script para configurar dominio no Vercel
# Federal Global by DeltaFox

Write-Host "Federal Global - Configuracao de Dominio" -ForegroundColor Cyan

# Verificar se o Vercel CLI esta instalado
try {
    $vercelVersion = vercel --version
    Write-Host "Vercel CLI encontrado: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "Vercel CLI nao encontrado. Instale com: npm i -g vercel" -ForegroundColor Red
    exit 1
}

# Configurar dominios
Write-Host "Configurando dominios..." -ForegroundColor Yellow

# Dominio principal para cliente
Write-Host "Configurando: federalglobal.deltafoxconsult.com.br" -ForegroundColor Blue
vercel domains add federalglobal.deltafoxconsult.com.br

# Dominio admin
Write-Host "Configurando: admin.federalglobal.deltafoxconsult.com.br" -ForegroundColor Blue
vercel domains add admin.federalglobal.deltafoxconsult.com.br

# Vincular dominios ao projeto
Write-Host "Vinculando dominios ao projeto..." -ForegroundColor Yellow
vercel domains ls

Write-Host "Configuracao de dominio concluida!" -ForegroundColor Green
Write-Host "Configure os seguintes registros DNS no cPanel:" -ForegroundColor Cyan
Write-Host ""
Write-Host "CNAME Records:" -ForegroundColor White
Write-Host "federalglobal -> cname.vercel-dns.com" -ForegroundColor Yellow
Write-Host "admin.federalglobal -> cname.vercel-dns.com" -ForegroundColor Yellow
Write-Host ""
Write-Host "URLs de acesso:" -ForegroundColor Cyan
Write-Host "Cliente: https://federalglobal.deltafoxconsult.com.br" -ForegroundColor Green
Write-Host "Admin: https://admin.federalglobal.deltafoxconsult.com.br" -ForegroundColor Green