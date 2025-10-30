# Hook de Deploy Automático - Federal Global
# Este script configura execução automática do deploy em diferentes cenários

Write-Host "🔧 Configurando Deploy Automático Federal Global..." -ForegroundColor Cyan

# 1. Função para deploy automático
function Start-AutoDeploy {
    param(
        [string]$Reason = "Deploy manual"
    )
    
    Write-Host "🚀 Iniciando deploy automático: $Reason" -ForegroundColor Green
    
    try {
        # Executar o script principal
        & ".\scripts\auto-deploy.ps1"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Deploy automático concluído com sucesso!" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ Erro no deploy automático" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "❌ Erro crítico no deploy: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# 2. Configurar Git Hook para deploy automático após push
$GitHookPath = ".git/hooks/post-commit"
$GitHookContent = @"
#!/bin/sh
# Git Hook - Deploy automático após commit
echo "🔄 Executando deploy automático após commit..."
powershell.exe -ExecutionPolicy Bypass -File "./scripts/auto-deploy-hook.ps1" "post-commit"
"@

try {
    if (Test-Path ".git") {
        if (!(Test-Path ".git/hooks")) {
            New-Item -ItemType Directory -Path ".git/hooks" -Force
        }
        
        Set-Content -Path $GitHookPath -Value $GitHookContent -Encoding UTF8
        Write-Host "✅ Git hook configurado: $GitHookPath" -ForegroundColor Green
    }
}
catch {
    Write-Host "⚠️ Não foi possível configurar Git hook: $($_.Exception.Message)" -ForegroundColor Yellow
}

# 3. Configurar task do Windows para deploy automático (opcional)
function Set-WindowsTask {
    param(
        [string]$TaskName = "FederalGlobal-AutoDeploy",
        [string]$Schedule = "DAILY",
        [string]$Time = "02:00"
    )
    
    try {
        $TaskAction = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -File `"$PWD\scripts\auto-deploy-hook.ps1`" `"scheduled`""
        $TaskTrigger = New-ScheduledTaskTrigger -Daily -At $Time
        $TaskSettings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
        
        Register-ScheduledTask -TaskName $TaskName -Action $TaskAction -Trigger $TaskTrigger -Settings $TaskSettings -Force
        Write-Host "✅ Task do Windows configurada: $TaskName" -ForegroundColor Green
        Write-Host "   Execução diária às $Time" -ForegroundColor Blue
    }
    catch {
        Write-Host "⚠️ Não foi possível configurar task do Windows: $($_.Exception.Message)" -ForegroundColor Yellow
        Write-Host "💡 Execute como Administrador para configurar tasks automáticas" -ForegroundColor Blue
    }
}

# 4. Verificar se é uma execução com motivo específico
$DeployReason = $args[0]
if ($DeployReason) {
    Write-Host "🎯 Motivo do deploy: $DeployReason" -ForegroundColor Blue
    Start-AutoDeploy -Reason $DeployReason
    exit
}

# 5. Menu interativo
Write-Host "`n📋 Opções de Deploy Automático:" -ForegroundColor Yellow
Write-Host "1. ▶️  Executar deploy agora" -ForegroundColor White
Write-Host "2. ⚙️  Configurar task automática diária" -ForegroundColor White
Write-Host "3. 🔄 Executar deploy e configurar automação" -ForegroundColor White
Write-Host "4. ❌ Sair" -ForegroundColor Gray

$Choice = Read-Host "`nEscolha uma opção (1-4)"

switch ($Choice) {
    "1" {
        Start-AutoDeploy -Reason "Execução manual"
    }
    "2" {
        Set-WindowsTask
        Write-Host "✅ Automação configurada!" -ForegroundColor Green
    }
    "3" {
        $DeploySuccess = Start-AutoDeploy -Reason "Execução manual com configuração"
        if ($DeploySuccess) {
            Set-WindowsTask
            Write-Host "✅ Deploy realizado e automação configurada!" -ForegroundColor Green
        }
    }
    "4" {
        Write-Host "👋 Saindo..." -ForegroundColor Gray
        exit
    }
    default {
        Write-Host "❌ Opção inválida" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n🎉 Configuração concluída!" -ForegroundColor Magenta
Write-Host "📖 Para deploy manual, execute: .\scripts\auto-deploy.ps1" -ForegroundColor Cyan
Write-Host "🔄 Para gerenciar automação, execute: .\scripts\auto-deploy-hook.ps1" -ForegroundColor Cyan