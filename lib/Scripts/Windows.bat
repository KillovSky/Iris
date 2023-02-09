@echo off
echo "Tentando iniciar de modo padr∆o..."
timeout /T 5
start /b /WAIT "" "C:\Program Files\Git\bin\bash.exe" tools.sh
cls
echo "Modo padr∆o falhou ou finalizou, usando modo alternativo..."
timeout /T 5
bash tools.sh
cls
echo "Modo alternativo e padr∆o falharam ou terminaram, pressione um bot∆o para fechar..."
pause