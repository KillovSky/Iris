@echo off

rem Verifica se o diretório atual termina com "\lib\Scripts"
set "CURRENT_DIR=%CD%"
set "TARGET_DIR=\lib\Scripts"
if "%CURRENT_DIR:~-12%"=="%TARGET_DIR%" (
    rem Muda o diretório de trabalho para dois níveis acima do diretório atual
    cd ..\..
)

rem Chama o script Toolbox.bat
call lib\Scripts\Toolbox.bat