# Monitor de Mudanças e Deploy Automático - Federal Global
# Este script monitora mudanças no código e executa deploy automaticamente

param(
    [switch]$Watch,
    [int]$IntervalSeconds = 30,
    [switch]$Continuous
)

Write-Host "🔍 Monitor de Deploy Automático - Federal Global" -ForegroundColor Cyan

# Função para executar deploy
function Invoke-AutoDeploy {
    param([string]$Reason)
    
    Write-Host "`n🚀 Executando deploy automático: $Reason" -ForegroundColor Green
    Write-Host "⏰ $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')" -ForegroundColor Gray
    
    try {
        & ".\scripts\auto-deploy.ps1"
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Deploy concluído com sucesso!" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ Falha no deploy" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "❌ Erro crítico: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Função para verificar mudanças no Git
function Test-GitChanges {
    try {
        $GitStatus = git status --porcelain 2>$null
        return ($GitStatus.Length -gt 0)
    }
    catch {
        return $false
    }
}

# Função para obter hash do último commit
function Get-LastCommitHash {
    try {
        return (git rev-parse HEAD 2>$null)
    }
    catch {
        return $null
    }
}

# Função para monitoramento contínuo
function Start-ContinuousMonitoring {
    param([int]$Interval)
    
    Write-Host "🔄 Iniciando monitoramento contínuo (intervalo: ${Interval}s)" -ForegroundColor Blue
    Write-Host "Pressione Ctrl+C para parar" -ForegroundColor Yellow
    
    $LastCommitHash = Get-LastCommitHash
    $DeployCount = 0
    
    while ($true) {
        try {
            Start-Sleep -Seconds $Interval
            
            # Verificar se houve novo commit
            $CurrentCommitHash = Get-LastCommitHash
            if ($CurrentCommitHash -and $CurrentCommitHash -ne $LastCommitHash) {
                Write-Host "`n📍 Novo commit detectado: $CurrentCommitHash" -ForegroundColor Yellow
                
                $Success = Invoke-AutoDeploy -Reason "Novo commit detectado"
                if ($Success) {
                    $DeployCount++
                    $LastCommitHash = $CurrentCommitHash
                    Write-Host "📊 Deploys realizados: $DeployCount" -ForegroundColor Cyan
                }
            }
            
            # Verificar mudanças pendentes (a cada 5 ciclos)
            if ((Get-Date).Second % (5 * $Interval) -eq 0) {
                if (Test-GitChanges) {
                    Write-Host "⚠️ Mudanças não commitadas detectadas" -ForegroundColor Yellow
                }
            }
            
            Write-Host "." -NoNewline -ForegroundColor Green
            
        }
        catch {
            Write-Host "`n❌ Erro no monitoramento: $($_.Exception.Message)" -ForegroundColor Red
            Start-Sleep -Seconds ($Interval * 2)
        }
    }
}

# Executar baseado nos parâmetros
if ($Watch -or $Continuous) {
    # Executar deploy inicial
    Write-Host "🎯 Executando deploy inicial..." -ForegroundColor Blue
    Invoke-AutoDeploy -Reason "Deploy inicial do monitor"
    
    # Iniciar monitoramento
    Start-ContinuousMonitoring -Interval $IntervalSeconds
}
elseif ($args.Length -gt 0) {
    # Executar deploy com motivo específico
    $Reason = $args -join " "
    Invoke-AutoDeploy -Reason $Reason
}
else {
    # Menu interativo
    Write-Host "`n📋 Opções do Monitor de Deploy:" -ForegroundColor Yellow
    Write-Host "1. ▶️  Deploy único agora" -ForegroundColor White
    Write-Host "2. 🔄 Monitoramento contínuo (30s)" -ForegroundColor White
    Write-Host "3. ⚡ Monitoramento rápido (10s)" -ForegroundColor White
    Write-Host "4. 🐌 Monitoramento lento (60s)" -ForegroundColor White
    Write-Host "5. ⚙️  Configuração personalizada" -ForegroundColor White
    Write-Host "6. ❌ Sair" -ForegroundColor Gray
    
    $Choice = Read-Host "`nEscolha uma opção (1-6)"
    
    switch ($Choice) {
        "1" {
            Invoke-AutoDeploy -Reason "Deploy manual via monitor"
        }
        "2" {
            Start-ContinuousMonitoring -Interval 30
        }
        "3" {
            Start-ContinuousMonitoring -Interval 10
        }
        "4" {
            Start-ContinuousMonitoring -Interval 60
        }
        "5" {
            $CustomInterval = Read-Host "Intervalo em segundos (padrão 30)"
            if (-not $CustomInterval -or $CustomInterval -eq "") { $CustomInterval = 30 }
            Start-ContinuousMonitoring -Interval [int]$CustomInterval
        }
        "6" {
            Write-Host "👋 Saindo..." -ForegroundColor Gray
            exit
        }
        default {
            Write-Host "❌ Opção inválida" -ForegroundColor Red
            exit 1
        }
    }
}

Write-Host "`n🎉 Monitor de deploy finalizado!" -ForegroundColor Magenta