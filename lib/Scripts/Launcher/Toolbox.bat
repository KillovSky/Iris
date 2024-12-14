@echo off
setlocal

rem Verifica se o diretório atual termina com "\lib\Scripts"
set "CURRENT_DIR=%CD%"
set "TARGET_DIR=\lib\Scripts"
if "%CURRENT_DIR:~-12%"=="%TARGET_DIR%" (
    rem Muda o diretório de trabalho para dois níveis acima do diretório atual
    cd ..\..
)

rem Encontrar o caminho do git.exe
for /f "delims=" %%i in ('where git.exe') do set "GIT_PATH=%%i"

rem Se não encontrar o local
if not defined GIT_PATH (
    echo Falha ao encontrar o caminho do git.exe.
    goto :try_alternative
)

rem Convertendo o caminho para apontar para o bash.exe
set "BASH_PATH=%GIT_PATH:cmd\git.exe=bin\bash.exe%"

rem Printa o inicio da tentativa
echo Tentando iniciar de modo normal...

rem Tenta iniciar o script no modo normal
start /b /WAIT "" "%BASH_PATH%" "./lib/Scripts/Toolbox.sh"

rem Verifica se o modo normal foi bem-sucedido
if not errorlevel 1 (
    echo Modo normal concluido com sucesso.
    goto :end
)

:try_alternative
echo Modo normal falhou ou finalizou, usando modo alternativo em 5 segundos...
timeout /T 5

rem Tenta iniciar o script no modo alternativo
bash "./lib/Scripts/Toolbox.sh"

rem Verifica se o modo alternativo foi bem-sucedido
if not errorlevel 1 (
    echo Modo alternativo concluido com sucesso.
    goto :end
)

rem Ambos meios falharam
echo Modo alternativo e normal falharam ou terminaram...
:end
pause
