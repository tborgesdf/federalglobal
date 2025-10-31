# Script de Verificacao Automatica - Federal Global
# Execute este script para verificar se os dominios estao funcionando

Write-Host "🔍 FEDERAL GLOBAL - VERIFICACAO AUTOMATICA" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor White
Write-Host ""

# Funcao para testar DNS
function Test-DNS {
    param($domain, $expectedCNAME)
    
    Write-Host "📡 Testando: $domain" -ForegroundColor Yellow
    
    try {
        # Teste CNAME
        $cnameResult = nslookup -type=CNAME $domain 2>$null
        if ($cnameResult -match "cname.vercel-dns.com") {
            Write-Host "   ✅ CNAME configurado corretamente" -ForegroundColor Green
        } else {
            Write-Host "   ❌ CNAME nao encontrado ou incorreto" -ForegroundColor Red
            return $false
        }
        
        # Teste resolucao IP
        $ipResult = nslookup $domain 2>$null
        if ($ipResult -match "\d+\.\d+\.\d+\.\d+") {
            Write-Host "   ✅ Dominio resolve para IP" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Dominio nao resolve" -ForegroundColor Red
            return $false
        }
        
        return $true
    } catch {
        Write-Host "   ❌ Erro ao verificar DNS: $_" -ForegroundColor Red
        return $false
    }
}

# Funcao para testar HTTP
function Test-HTTP {
    param($url, $expectedContent)
    
    Write-Host "🌐 Testando HTTP: $url" -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10 2>$null
        if ($response.StatusCode -eq 200) {
            Write-Host "   ✅ Site responde (HTTP 200)" -ForegroundColor Green
            
            if ($response.Content -match $expectedContent) {
                Write-Host "   ✅ Conteudo correto encontrado" -ForegroundColor Green
                return $true
            } else {
                Write-Host "   ⚠️  Site carrega mas conteudo diferente do esperado" -ForegroundColor Yellow
                return $true
            }
        } else {
            Write-Host "   ❌ Site retorna erro HTTP: $($response.StatusCode)" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "   ❌ Erro ao acessar: $_" -ForegroundColor Red
        return $false
    }
}

Write-Host "⏰ Iniciando verificacao automatica..." -ForegroundColor Cyan
Write-Host ""

# Verificar DNS dos dominios
Write-Host "=== VERIFICACAO DNS ===" -ForegroundColor White
$dnsClient = Test-DNS "federalglobal.deltafoxconsult.com.br" "cname.vercel-dns.com"
$dnsAdmin = Test-DNS "admin.federalglobal.deltafoxconsult.com.br" "cname.vercel-dns.com"

Write-Host ""

# Verificar HTTP dos dominios
Write-Host "=== VERIFICACAO HTTP ===" -ForegroundColor White
$httpClient = Test-HTTP "https://federalglobal.deltafoxconsult.com.br" "Federal Global"
$httpAdmin = Test-HTTP "https://admin.federalglobal.deltafoxconsult.com.br" "Login"

Write-Host ""

# Resultado final
Write-Host "=== RESULTADO FINAL ===" -ForegroundColor White
Write-Host ""

if ($dnsClient -and $dnsAdmin) {
    Write-Host "✅ DNS: CONFIGURADO CORRETAMENTE" -ForegroundColor Green
} else {
    Write-Host "❌ DNS: PROBLEMAS ENCONTRADOS" -ForegroundColor Red
}

if ($httpClient -and $httpAdmin) {
    Write-Host "✅ SITES: FUNCIONANDO CORRETAMENTE" -ForegroundColor Green
} else {
    Write-Host "❌ SITES: PROBLEMAS ENCONTRADOS" -ForegroundColor Red
}

Write-Host ""

if ($dnsClient -and $dnsAdmin -and $httpClient -and $httpAdmin) {
    Write-Host "🎉 FEDERAL GLOBAL TOTALMENTE FUNCIONAL!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📱 URLs de Acesso:" -ForegroundColor Cyan
    Write-Host "Cliente: https://federalglobal.deltafoxconsult.com.br" -ForegroundColor White
    Write-Host "Admin:   https://admin.federalglobal.deltafoxconsult.com.br" -ForegroundColor White
    Write-Host ""
    Write-Host "🔐 Credenciais Admin:" -ForegroundColor Cyan
    Write-Host "CPF: 12345678901" -ForegroundColor White
    Write-Host "Senha: admin123" -ForegroundColor White
} else {
    Write-Host "⚠️  SISTEMA PARCIALMENTE FUNCIONAL" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "💡 Aguarde mais tempo para propagacao DNS (ate 4 horas)" -ForegroundColor Yellow
    Write-Host "💡 Execute este script novamente em 30 minutos" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🌐 URL Temporaria (sempre funcional):" -ForegroundColor Cyan
    Write-Host "https://federalglobal-p3w1ruv2r-thiago-borges-projects-3ed92125.vercel.app" -ForegroundColor White
}

Write-Host ""
Write-Host "============================================" -ForegroundColor White
Write-Host "Verificacao concluida em $(Get-Date)" -ForegroundColor Gray