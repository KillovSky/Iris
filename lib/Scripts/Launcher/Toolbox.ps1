<#
.SYNOPSIS
    Script para iniciar um script shell (Toolbox.sh) usando Git Bash com modos de fallback.

.DESCRIPTION
    Este script tenta executar um script em modo normal, alternativo ou absoluto,
    garantindo que os logs sejam gerados adequadamente para monitoramento e solução de problemas.

.PARAMETER ScriptToExecute
    Caminho do script a ser executado.
#>

# Constantes de exit code
$SuccessExitCode = 0

# Função para exibir mensagens de log
function Write-Log {
    param (
        [string]$Message,  
        [string]$Level = "INFO"  
    )
    
    # Criação de um timestamp para a mensagem de log
    $Timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")  
    $LogMessage = "[$Timestamp] [$Level] $Message"  
    $LogFilePath = "Toolbox.log"
    
    # Adiciona a mensagem ao arquivo de log
    Add-Content -Path $LogFilePath -Value $LogMessage
}

# Função para verificar e ajustar o diretório atual
function Test-CurrentDirectory {
    $CurrentDir = Get-Location  
    $TargetDir = "\lib\Scripts\Launcher"  
    
    # Verifica se o diretório atual é o esperado
    if ($CurrentDir.Path.EndsWith($TargetDir)) {
        Set-Location -Path (Resolve-Path ..\..\..)  # Volta três diretórios
        Write-Log "Diretório alterado para: $(Get-Location)"  
    } else {
        Write-Log "Diretório atual está correto: $CurrentDir"  
    }
}

# Função para encontrar o caminho do git.exe
function Get-GitPath {
    # Obtém o caminho do git.exe
    $GitPath = (Get-Command git.exe -ErrorAction SilentlyContinue).Source  
    
    if (-not $GitPath) {
        Write-Log "Falha ao encontrar git.exe." "ERROR"
        return $null
    }
    
    # Retorna o caminho do bash.exe
    return $GitPath.Replace("\cmd\git.exe", "\bin\bash.exe")  
}

# Função para iniciar o script e verificar seu sucesso
function Invoke-Script { 
    param (
        [string]$ScriptPath,  
        [string]$GitPath  
    )

    Write-Log "Iniciando script: $ScriptPath"  
    
    try {
        # Inicia o processo do script
        $process = Start-Process -FilePath $GitPath -ArgumentList $ScriptPath -Wait -PassThru
        $ExitCode = $process.ExitCode

        # Verifica o código de saída do script
        if ($ExitCode -ne $SuccessExitCode) {
            Write-Log "Script executado com falha. Código de saída: $ExitCode" "ERROR"
        } else {
            Write-Log "Script executado com sucesso."  
        }
        
        return $ExitCode  
    } catch {
        Write-Log "Erro ao executar o script: $_" "ERROR"
        return 1  
    }
}

# Função para tentar o modo alternativo
function Start-Alternative {
    Write-Log "Modo normal falhou, tentando modo alternativo em 5 segundos..."  
    Start-Sleep -Seconds 5
    
    # Executa o script no modo alternativo
    $ExitCode = Invoke-Script -ScriptPath $ScriptToExecute -GitPath "bash.exe"

    if ($ExitCode -eq $SuccessExitCode) {
        Write-Log "Execução bem-sucedida no modo alternativo."  
        exit
    } else {
        Start-Absolute  
    }
}

# Função para tentar executar o script a partir do caminho absoluto
function Start-Absolute {
    $AbsoluteScriptPath = (Get-Item $ScriptToExecute).FullName
    Write-Log "Tentando executar o script a partir do caminho absoluto: $AbsoluteScriptPath"  
    Start-Sleep -Seconds 5

    # Executa o script no modo absoluto
    $ExitCode = Invoke-Script -ScriptPath $AbsoluteScriptPath -GitPath "bash.exe"

    if ($ExitCode -eq $SuccessExitCode) {
        Write-Log "Execução bem-sucedida no modo absoluto."  
        exit
    } else {
        Write-Log "Todos os modos falharam ou finalizaram. Contate o suporte se precisar." "ERROR"
        pause
    }

    Write-Host 'Leia o arquivo Toolbox.log se sua execução teve erros, envie o arquivo para o suporte para ajudar a corrigir eventuais falhas.'
}

# Execução principal do script
Test-CurrentDirectory

# Caminho do script a ser executado
$ScriptToExecute = "./lib/Scripts/Launcher/Toolbox.sh"  

# Obtém o caminho do Git Bash
$GitPath = Get-GitPath  

if ($GitPath) {
    $RunCode = Invoke-Script -ScriptPath $ScriptToExecute -GitPath $GitPath

    if ($RunCode -eq $SuccessExitCode) {
        Write-Log "Execução bem-sucedida no modo normal."  
        exit
    } else {
        Start-Alternative  
    }
} else {
    Write-Log "Caminho do git.exe não encontrado, tentando abrir o bash diretamente..." "ERROR"
    Start-Alternative
}
