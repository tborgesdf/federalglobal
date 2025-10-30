# Deploy Direto - Federal Global
Write-Host "🚀 Executando Deploy Federal Global..." -ForegroundColor Green
Write-Host "⏰ $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')" -ForegroundColor Gray

$scriptPath = Join-Path $PSScriptRoot "auto-deploy.ps1"
& $scriptPath

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deploy concluído com sucesso!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro no deploy" -ForegroundColor Red
}

Write-Host "📋 Deploy finalizado" -ForegroundColor Cyan