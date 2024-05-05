// Define como execução principal
package main

// Importa pacotes para usar
import (
    "fmt"
    "os"
    "os/exec"
    "path/filepath"
    "runtime"
)

// Define a função de execução
func main() {
    startToolbox()
}

// Define como determina qual execução fazer
func startToolbox() {
    // Obtém o diretório atual absoluto
    currentDir, err := filepath.Abs(".")
    if err != nil {
        fmt.Println("Erro ao obter o diretório atual:", err)
        return
    }

    // Se o diretório atual contiver "/lib/Scripts", remove essa parte
    if filepath.Base(currentDir) == "Scripts" {
        currentDir = filepath.Dir(filepath.Dir(currentDir))
    }

    // Obtém o sistema operacional
    osName := runtime.GOOS

    // Define a variável cmdArgs para armazenar os argumentos do comando
    var cmdArgs []string

    // Define a variável cmdExecutable para armazenar o executável a ser usado
    var cmdExecutable string

    // Determina o comando e os argumentos com base no sistema operacional
    if osName == "linux" || osName == "darwin" {
        // Executa em Bash direto, se Linux
        cmdExecutable = "bash"
        cmdArgs = []string{"-c", filepath.Join(currentDir, "lib", "Scripts", "Toolbox.sh")}

        // Apenas Windows daqui pra baixo
    } else if osName == "windows" {
        if _, err := os.Stat(filepath.Join(os.Getenv("SystemRoot"), "System32", "cmd.exe")); err == nil {
            // Executa em CMD
            cmdExecutable = "cmd.exe"
            cmdArgs = []string{"/c", filepath.Join(currentDir, "lib\\Scripts\\Toolbox.cmd")}
        } else if _, err := os.Stat(filepath.Join(os.Getenv("SystemRoot"), "System32", "WindowsPowerShell", "v1.0", "powershell.exe")); err == nil {
            // Executa em PowerShell
            cmdExecutable = "powershell"
            cmdArgs = []string{filepath.Join(currentDir, "lib", "Scripts", "Toolbox.ps1")}
        } else if _, err := os.Stat(filepath.Join(os.Getenv("SystemRoot"), "System32", "cscript.exe")); err == nil {
            // Executa em CScript
            cmdExecutable = "cscript.exe"
            cmdArgs = []string{filepath.Join(currentDir, "lib", "Scripts", "Toolbox.vbs")}
        } else {
            // Se não tiver terminal compativel
            fmt.Println("Nenhum terminal disponível para executar o script.")
            return
        }

    // Se não suportar esse sistema envia uma mensagem de erro
    } else {
        fmt.Println("Sistema operacional não suportado.")
        return
    }

    // Obtém o diretório pai do diretório atual
    parentDir := filepath.Join(filepath.Dir(currentDir), "Iris")

    // Constrói o caminho completo para o script
    scriptPath := filepath.Join(parentDir, "lib", "Scripts", "Toolbox.cmd")

    // Verifica se o script existe
    if _, err := os.Stat(scriptPath); err != nil {
        fmt.Println("Erro ao encontrar o script:", err)
        return
    }

    // Executa o comando com os argumentos correspondentes
    // Substitui a execução do golang pela do Toolbox
    cmd := exec.Command(cmdExecutable, cmdArgs...)
    cmd.Dir = currentDir
    cmd.Stdin = os.Stdin
    cmd.Stdout = os.Stdout
    cmd.Stderr = os.Stderr
    if err := cmd.Run(); err != nil {
        fmt.Println("Erro ao executar o script:", err)
    }
}
