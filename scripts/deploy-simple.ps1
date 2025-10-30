# Monitor de Deploy Simples - Federal Global
param([string]$Action = "menu")

Write-Host "🔍 Monitor de Deploy Federal Global" -ForegroundColor Cyan

function Start-Deploy {
    param([string]$Reason = "Deploy manual")
    
    Write-Host "🚀 $Reason - $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Green
    
    try {
        powershell.exe -ExecutionPolicy Bypass -File "scripts/auto-deploy.ps1"
        return $LASTEXITCODE -eq 0
    }
    catch {
        Write-Host "❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

switch ($Action) {
    "1" { 
        Start-Deploy "Deploy único" 
    }
    "now" { 
        Start-Deploy "Deploy imediato" 
    }
    "test" { 
        Write-Host "🧪 Testando deploy..." -ForegroundColor Yellow
        Start-Deploy "Deploy de teste"
    }
    default {
        Write-Host "📋 Opções:" -ForegroundColor Yellow
        Write-Host "1. Deploy agora" -ForegroundColor White
        Write-Host "2. Sair" -ForegroundColor Gray
        
        $choice = Read-Host "Escolha (1-2)"
        if ($choice -eq "1") {
            Start-Deploy "Deploy interativo"
        }
    }
}

Write-Host "✅ Monitor finalizado" -ForegroundColor Green