@echo off
echo 🚀 Federal Global - Deploy Automatico
echo ⏰ %date% %time%

powershell -ExecutionPolicy Bypass -Command "& './scripts/auto-deploy.ps1'"

if %errorlevel% equ 0 (
    echo ✅ Deploy concluido com sucesso!
) else (
    echo ❌ Erro no deploy
)

echo.
echo 📋 Para executar automaticamente:
echo - Execute: deploy-auto.bat
echo - Configure task no Windows
echo.
pause