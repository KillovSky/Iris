// Importa os módulos
using System;
using System.Diagnostics;
using System.IO;

// Cria uma classe
class Program
{
    // Define a função
    static void Main()
    {
        // Obtém o diretório atual absoluto
        string currentDir = Directory.GetCurrentDirectory();

        // Define a scriptDir
        string scriptDir;

        // Se o diretório atual contiver "/lib/Scripts", remove essa parte
        if (currentDir.Contains("/lib/Scripts") || currentDir.Contains("\\lib\\Scripts"))
        {
            // Define a path do script como dois diretórios acima
            scriptDir = Path.GetFullPath(Path.Combine(currentDir, "..", ".."));
        }
        else
        {
            // Caso contrário, define a path do script como o diretório atual
            scriptDir = currentDir;
        }

        // Define o processo de inicialização com o diretório de trabalho
        ProcessStartInfo startInfo = new ProcessStartInfo
        {
            WorkingDirectory = scriptDir
        };

        // Executa o script com base no sistema operacional, talvez futuramente eu faça noutros, então o fiz em switch
        switch (Environment.OSVersion.Platform)
        {
            case PlatformID.Win32NT:
                // Se for Windows, executa o script apropriado
                if (File.Exists(Path.Combine(Environment.SystemDirectory, "cmd.exe")))
                {
                    // Verifica se o CMD está disponível e executa o script usando o CMD
                    startInfo.FileName = "cmd.exe";
                    startInfo.Arguments = string.Format("/c {0}", Path.Combine(scriptDir, "lib", "Scripts", "Toolbox.cmd"));
                }
                else if (File.Exists(Path.Combine(Environment.SystemDirectory, "WindowsPowerShell", "v1.0", "powershell.exe")))
                {
                    // Verifica se o PowerShell está disponível e executa o script usando o PowerShell
                    startInfo.FileName = "powershell.exe";
                    startInfo.Arguments = Path.Combine(scriptDir, "lib", "Scripts", "Toolbox.ps1");
                }
                else if (File.Exists(Path.Combine(Environment.SystemDirectory, "cscript.exe")))
                {
                    // Verifica se o CScript está disponível e executa o script usando o CScript (VBScript)
                    startInfo.FileName = "cscript.exe";
                    startInfo.Arguments = Path.Combine(scriptDir, "lib", "Scripts", "Toolbox.vbs");
                }
                else
                {
                    // Se nenhum terminal estiver disponível, exibe uma mensagem de erro
                    Console.WriteLine("Nenhum terminal disponível para executar o script.");
                    return;
                }
                break;
            default:
                // Se o sistema operacional não for suportado, exibe uma mensagem de erro
                Console.WriteLine("Sistema operacional não suportado.");
                return;
        }

        // Inicia o processo com as configurações definidas
        Process.Start(startInfo);
    }
}
