# pylint: disable=C0103 # Snake-Case Filename Disable (Execução não é afetada por isso!)
"""
Módulo para iniciar a caixa de ferramentas com base no sistema operacional.

Este script verifica o sistema operacional e executa o script apropriado
localizado no diretório 'lib/Scripts/Launcher'.
"""

import subprocess
import platform
import os
import logging

# Configuração básica do logging
logging.basicConfig(level=logging.INFO, format='\n%(asctime)s - %(levelname)s - %(message)s')

def get_script_directory() -> str:
    """
    Obtém o diretório do script com base no diretório atual.

    Retorna:
        str: Caminho absoluto do diretório onde o script está localizado.
    """
    current_dir = os.path.abspath(".")

    # Verifica se o diretório atual contém "lib/Scripts/Launcher"
    if any(os.path.join(current_dir, f) == os.path.join(current_dir, "lib", "Scripts", "Launcher")
           for f in ["", "lib", "Scripts", "Launcher"]):
        # Define o diretório do script como três níveis acima
        return os.path.abspath(os.path.join(current_dir, "..", "..", ".."))

    logging.warning("Diretório 'lib/Scripts/Launcher' não encontrado, usando o diretório atual.")
    return current_dir

def execute_script(script_path: str):
    """
    Executa o script apropriado baseado no sistema operacional.

    Args:
        script_path (str): Caminho absoluto do script a ser executado.
    """
    try:
        logging.info("Executando o script: %s no sistema %s.", script_path, platform.system())

        if platform.system() in ["Linux", "Darwin"]:  # Linux e macOS
            subprocess.run(["bash", script_path], check=True)

        elif platform.system() == "Windows":
            # Executa o script apropriado para Windows
            execute_windows_script(script_path)
        else:
            logging.error("Sistema operacional não suportado.")

    except subprocess.CalledProcessError as e:
        logging.error("Erro ao executar o script: %s", e)

def execute_windows_script(script_path: str):
    """
    Executa scripts no Windows usando diferentes terminais.

    Args:
        script_path (str): Caminho absoluto do script a ser executado.
    """
    cmd_executables = [
        ("cmd", ["/c", script_path]),
        ("powershell", [script_path]),
        ("cscript", [script_path])
    ]

    for cmd, args in cmd_executables:
        if os.path.exists(os.path.join(os.getenv("SystemRoot"), "System32", f"{cmd}.exe")):
            subprocess.run([cmd] + args, shell=True, check=True)
            return  # Sai após executar um script com sucesso

    logging.error("Nenhum terminal disponível para executar o script.")

def start_toolbox():
    """
    Inicia a caixa de ferramentas com base no sistema operacional.
    """
    script_dir = get_script_directory()

    # Determina o nome do script com base no sistema operacional
    script_name = {
        "Linux": "Toolbox.sh",
        "Darwin": "Toolbox.sh",  # macOS é identificado como Darwin
        "Windows": "Toolbox.cmd"
    }.get(platform.system())

    if script_name:
        script_path = os.path.join(script_dir, script_name)
        execute_script(script_path)
    else:
        logging.error("Nome de script inválido ou sistema operacional não suportado nesse script.")

if __name__ == "__main__":
    start_toolbox()
