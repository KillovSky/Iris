# Importa os módulos necessários
require 'rbconfig'
require 'pathname'

# Inicia a ferramenta Toolbox
def start_toolbox
  # Obtém o diretório atual absoluto
  current_dir = Dir.pwd
  script_dir = determine_script_directory(current_dir)

  # Verifica o sistema operacional e executa o script apropriado
  case RbConfig::CONFIG['host_os']
  when /mswin|msys|mingw|cygwin|bccwin|wince|emc/
    run_windows_script(script_dir)
  when /darwin|mac os|linux/
    run_unix_script(script_dir)
  else
    puts "Sistema operacional não suportado."
  end
end

# Determina o diretório do script com base no diretório atual
def determine_script_directory(current_dir)
  if current_dir.include?("/lib/Scripts/Launcher") || current_dir.include?("\\lib\\Scripts\\Launcher")
    # Define o caminho do script como dois diretórios acima
    File.expand_path(File.join(current_dir, "..", "..", ".."))
  else
    # Caso contrário, usa o diretório atual
    current_dir
  end
end

# Executa o script apropriado no Windows
def run_windows_script(script_dir)
  if File.exist?(File.join(ENV['SystemRoot'], "System32", "cmd.exe"))
    # Executa o script usando o CMD
    system("cmd /c #{File.join(script_dir, 'lib', 'Scripts', 'Launcher', 'Toolbox.cmd')}")
  elsif File.exist?(File.join(ENV['SystemRoot'], "System32", "WindowsPowerShell", "v1.0", "powershell.exe"))
    # Executa o script usando o PowerShell
    system("powershell #{File.join(script_dir, 'lib', 'Scripts', 'Launcher', 'Toolbox.ps1')}")
  elsif File.exist?(File.join(ENV['SystemRoot'], "System32", "cscript.exe"))
    # Executa o script usando o CScript (VBScript)
    system("cscript #{File.join(script_dir, 'lib', 'Scripts', 'Launcher', 'Toolbox.vbs')}")
  else
    puts "Nenhum terminal disponível para executar o script."
  end
end

# Executa o script apropriado no MacOS e Linux
def run_unix_script(script_dir)
  system("bash #{File.join(script_dir, 'lib', 'Scripts', 'Launcher', 'Toolbox.sh')}")
end

# Ponto de entrada do script
if __FILE__ == $PROGRAM_NAME
  start_toolbox
end
