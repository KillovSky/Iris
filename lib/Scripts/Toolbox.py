""" Importa os módulos """
# pylint: disable=C0103,C0301
import subprocess
import platform
import os

# Define a função
def start_toolbox():
    """
    Inicia a caixa de ferramentas com base no sistema operacional.
    """
    # Obtém o diretório atual absoluto
    current_dir = os.path.abspath(".")

    # Se o diretório atual contiver "/lib/Scripts", remove essa parte
    if "/lib/Scripts" in current_dir or "\\lib\\Scripts" in current_dir:
        # Define a path do script como dois diretórios acima
        script_dir = os.path.abspath(os.path.join(current_dir, "..", ".."))
    else:
        # Caso contrário, define a path do script como o diretório atual
        script_dir = current_dir

    # Se for Linux ou MacOS
    if platform.system() == "Linux" or platform.system() == "Darwin":
        # Executa o script usando o Bash
        os.system(f"bash {os.path.join(script_dir, 'lib', 'Scripts', 'Toolbox.sh')}")
    # Se for Windows
    elif platform.system() == "Windows":
        # Verifica qual terminal está disponível e executa o script apropriado
        if os.path.exists(os.path.join(os.getenv("SystemRoot"), "System32", "cmd.exe")):
            # Verifica se o CMD está disponível e executa o script usando o CMD
            subprocess.run(["cmd", "/c", os.path.join(script_dir, "lib", "Scripts", "Toolbox.cmd")], cwd=script_dir, shell=True, check=True)
        elif os.path.exists(os.path.join(os.getenv("SystemRoot"), "System32", "WindowsPowerShell", "v1.0", "powershell.exe")):
            # Verifica se o PowerShell está disponível e executa o script usando o PowerShell
            subprocess.run(["powershell", os.path.join(script_dir, "lib", "Scripts", "Toolbox.ps1")], cwd=script_dir, shell=True, check=True)
        elif os.path.exists(os.path.join(os.getenv("SystemRoot"), "System32", "cscript.exe")):
            # Verifica se o CScript está disponível e executa o script usando o CScript (VBScript)
            subprocess.run(["cscript", os.path.join(script_dir, "lib", "Scripts", "Toolbox.vbs")], cwd=script_dir, shell=True, check=True)
        else:
            # Se nenhum terminal estiver disponível, exibe uma mensagem de erro
            print("Nenhum terminal disponível para executar o script.")
    else:
        # Se o sistema operacional não for suportado, exibe uma mensagem de erro
        print("Sistema operacional não suportado.")

# Inicia
if __name__ == "__main__":
    # A função startToolbox se o script for executado como principal
    start_toolbox()
