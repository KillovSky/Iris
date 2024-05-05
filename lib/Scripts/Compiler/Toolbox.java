
// Importa funções
import java.io.File;
import java.io.IOException;

// Define uma classe
public class Toolbox {
    // Define a execução do script
    public static void main(String[] args) {
        // Executa
        startToolbox();
    }

    // A função que executa
    private static void startToolbox() {
        // Obtém o diretório atual absoluto
        String currentDir = new File(".").getAbsolutePath();

        // Se o diretório atual contiver "/lib/Scripts", remove essa parte
        if (currentDir.contains("/lib/Scripts") || currentDir.contains("\\lib\\Scripts")) {
            // Define a path do script como dois diretórios acima
            currentDir = new File(currentDir).getParentFile().getParent();
        }

        // Obtém o sistema operacional
        String osName = System.getProperty("os.name").toLowerCase();

        // Se for Linux ou MacOS
        if (osName.contains("nix") || osName.contains("nux") || osName.contains("mac")) {
            // Executa o script usando o Bash
            executeCommand("bash", currentDir + "/lib/Scripts/Toolbox.sh");
        }
        // Se for Windows
        else if (osName.contains("win")) {
            // Verifica qual terminal está disponível e executa o script apropriado
            if (new File(System.getenv("SystemRoot") + "\\System32\\cmd.exe").exists()) {
                // Verifica se o CMD está disponível e executa o script usando o CMD
                executeCommand("cmd.exe", "/c", currentDir + "\\lib\\Scripts\\Toolbox.cmd");
            } else if (new File(System.getenv("SystemRoot") + "\\System32\\WindowsPowerShell\\v1.0\\powershell.exe")
                    .exists()) {
                // Verifica se o PowerShell está disponível e executa o script usando o
                // PowerShell
                executeCommand("powershell.exe", currentDir + "\\lib\\Scripts\\Toolbox.ps1");
            } else if (new File(System.getenv("SystemRoot") + "\\System32\\cscript.exe").exists()) {
                // Verifica se o CScript está disponível e executa o script usando o CScript
                // (VBScript)
                executeCommand("cscript.exe", currentDir + "\\lib\\Scripts\\Toolbox.vbs");
            } else {
                // Se nenhum terminal estiver disponível, exibe uma mensagem de erro
                System.out.println("Nenhum terminal disponível para executar o script.");
            }
        } else {
            // Se o sistema operacional não for suportado, exibe uma mensagem de erro
            System.out.println("Sistema operacional não suportado.");
        }
    }

    // A função que inicia
    private static void executeCommand(String... command) {
        try {
            // Cria um novo processo com o comando fornecido
            ProcessBuilder pb = new ProcessBuilder(command);

            // Define o diretório de trabalho para o diretório atual
            pb.directory(new File("."));

            // Redireciona a entrada/saída padrão do processo
            pb.inheritIO();

            // Inicia o processo
            Process process = pb.start();

            // Espera o processo terminar
            process.waitFor();

            // Se der erro
        } catch (IOException | InterruptedException e) {
            // Printa a stack
            e.printStackTrace();
        }
    }
}
