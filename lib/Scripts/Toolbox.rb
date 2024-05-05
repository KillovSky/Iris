# Importa os módulos
require 'rbconfig'
require 'pathname'

# Define a função
def start_toolbox
  # Obtém o diretório atual absoluto
  current_dir = Dir.pwd

  # Se o diretório atual contiver "/lib/Scripts", remove essa parte
  if current_dir.include?("/lib/Scripts") || current_dir.include?("\\lib\\Scripts")
    # Define a path do script como dois diretórios acima
    script_dir = File.expand_path(File.join(current_dir, "..", ".."))
  else
    # Caso contrário, define a path do script como o diretório atual
    script_dir = current_dir
  end

  # Verifica o sistema operacional
  case RbConfig::CONFIG['host_os']
  when /mswin|msys|mingw|cygwin|bccwin|wince|emc/
    # Verifica qual terminal está disponível e executa o script apropriado
    if File.exist?(File.join(ENV['SystemRoot'], "System32", "cmd.exe"))
      # Verifica se o CMD está disponível e executa o script usando o CMD
      system("cmd /c #{File.join(script_dir, 'lib', 'Scripts', 'Toolbox.cmd')}")
    elsif File.exist?(File.join(ENV['SystemRoot'], "System32", "WindowsPowerShell", "v1.0", "powershell.exe"))
      # Verifica se o PowerShell está disponível e executa o script usando o PowerShell
      system("powershell #{File.join(script_dir, 'lib', 'Scripts', 'Toolbox.ps1')}")
    elsif File.exist?(File.join(ENV['SystemRoot'], "System32", "cscript.exe"))
      # Verifica se o CScript está disponível e executa o script usando o CScript (VBScript)
      system("cscript #{File.join(script_dir, 'lib', 'Scripts', 'Toolbox.vbs')}")
    else
      # Se nenhum terminal estiver disponível, exibe uma mensagem de erro
      puts "Nenhum terminal disponível para executar o script."
    end
  when /darwin|mac os/
    # Se for MacOS, executa o script usando o Bash
    system("bash #{File.join(script_dir, 'lib', 'Scripts', 'Toolbox.sh')}")
  when /linux/
    # Se for Linux, executa o script usando o Bash
    system("bash #{File.join(script_dir, 'lib', 'Scripts', 'Toolbox.sh')}")
  else
    # Se o sistema operacional não for suportado, exibe uma mensagem de erro
    puts "Sistema operacional não suportado."
  end
end

# Inicia
if __FILE__ == $PROGRAM_NAME
  # Chama a função start_toolbox se o script for executado como principal
  start_toolbox
end
