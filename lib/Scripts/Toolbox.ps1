# Verifica se o diretório atual termina com "\lib\Scripts"
$currentDir = Get-Location
$targetDir = "\lib\Scripts"
if ($currentDir.Path.EndsWith($targetDir)) {
    # Muda o diretório de trabalho para dois níveis acima do diretório atual
    Set-Location ..
    Set-Location ..
}

# Avisa do inicio
Write-Host "Tentando iniciar de modo normal..."

# Encontrar o caminho do git.exe
$gitPath = (Get-Command git.exe).Source.Replace("\cmd\git.exe", "\bin\bash.exe")

# Cria um novo processo para iniciar o script
& $gitPath "./lib/Scripts/Toolbox.sh"

# Se você precisa verificar se o processo foi bem-sucedido, pode usar algo assim
if ($LastExitCode -eq 0) {
    Write-Host "Modo normal concluído com sucesso."
    exit
}

# Se falhou, tenta o modo alternativo
Write-Host "Modo normal falhou ou finalizou, usando modo alternativo em 5 segundos..."
Start-Sleep -Seconds 5

# Tenta iniciar o script no modo alternativo
& $gitPath "./lib/Scripts/Toolbox.sh"

# Se deu certo
if ($LastExitCode -eq 0) {
    Write-Host "Modo alternativo concluído com sucesso."
    exit
}

# Se ambos falharam
Write-Host "Modo alternativo e normal falharam ou terminaram..."
pause
