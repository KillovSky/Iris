#!/bin/bash

MINIDOCS="Uso: ./plugins.sh [update|install|upgrade|remove|--help|-h]

Descrição: Gerencia plugins para projetos KillovSky, semelhante ao APT.

Opções:
  -h, --help       Exibe esta mensagem de ajuda e sai.
  update           Atualiza o repositório de plugins.
  install [bot@dev@command@version] Instala um plugin específico.
  upgrade          Atualiza todos os plugins instalados.
  remove [bot@dev@command] Remove um plugin específico.

Exemplos:
  ./plugins.sh update
  ./plugins.sh install bot@dev@command@latest
  ./plugins.sh install
  ./plugins.sh upgrade
  ./plugins.sh remove bot@dev@command
"

DOCUMENTATION="
# ----------------------------------------------------------------------------
# Uso: ./plugins.sh [update|install|upgrade|remove|--help|-h]
#
# Descrição: Gerencia plugins para projetos KillovSky, funcionando de forma semelhante ao APT, com opções para instalação, atualização, remoção e sincronização de repositórios de plugins.
#
# Opções:
#   -h, --help, *
#        Exibe esta mensagem de ajuda e sai.
#   
#   update
#        Atualiza o repositório de plugins a partir do caminho especificado.
#
#   install [bot@dev@command@version]
#        Instala um plugin específico. Se 'version' for 'latest', instala a versão mais recente.
#
#   upgrade
#        Atualiza todos os plugins instalados.
#
#   remove [bot@dev@command]
#        Remove um plugin específico.
#
# Exemplos:
#   ./plugins.sh update
#        Atualiza os arquivos do repositório.
#
#   ./plugins.sh install bot@dev@command@latest
#        Instala um plugin específico.
#
#   ./plugins.sh install
#        Inicia instalação interativa.
#
#   ./plugins.sh upgrade
#        Atualiza todos os plugins instalados.
#
#   ./plugins.sh remove bot@dev@command
#        Remove um plugin específico.
#
# Funções Internas:
#   is_root
#        Verifica se o script está sendo executado como root.
#
#   is_admin
#        Verifica se o script está sendo executado como administrador no Git Bash/MinGW.
#
#   select_option
#        Exibe uma lista de opções ao usuário e retorna a escolhida.
#
#   list_bots
#        Lista bots disponíveis no diretório de repositórios.
#
#   list_devs
#        Lista desenvolvedores disponíveis para um bot específico.
#
#   list_commands
#        Lista comandos disponíveis para um bot e desenvolvedor.
#
#   show_readme
#        Exibe o conteúdo do README.md de um comando específico.
#
#   list_versions
#        Lista versões disponíveis para um comando.
#
#   install_via_params
#        Instala um comando a partir de parâmetros fornecidos no formato bot@dev@command@version.
#
#   remove_function
#        Remove um comando instalado.
#
#   install_function
#        Instala um comando interativamente.
#
#   upgrade_function
#        Atualiza todos os plugins instalados.
#
#   main
#        Função principal que gerencia as opções do script.
#
# Requisitos:
#   - Bash (Linux, macOS, ou Git Bash no Windows)
#   - JQ (para manipulação de JSON)
#   - Git (para gerenciamento de repositórios)
#
# Instalação de dependências:
#
#   1. JQ:
#      - Linux: sudo apt install jq
#      - macOS: brew install jq /OU/ sudo port install jq
#      - Windows: Baixe de https://jqlang.github.io/jq/download
#
#   2. Git:
#      - Linux: sudo apt install git
#      - macOS: brew install git
#      - Windows: Baixe de https://git-scm.com/downloads
#
# ----------------------------------------------------------------------------
"

# Configurações gerais
REPO_DIR="Plugins"
REPO_URL="https://github.com/KillovSky/Plugins.git"
LOG_FILE="package_manager.log"
UPDATE_THRESHOLD=86400 # 24 horas
INIT_COMMAND="" # String que contém todos os args usados em outras funções (no inicio)
SILENT=false
INSTALLED_PACKAGES="installed_packages.log"  # Caminho para o arquivo de pacotes instalados

# Limpa o terminal no inicio
clear

# Checa dependencias necessárias
check_dependencies() {
    local dependencies=("jq" "git")
    for dep in "${dependencies[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            log_action "Erro: $dep não está instalado. Por favor, instale $dep antes de continuar." "ERROR"
            exit 1
        fi
    done
}

# Faz o call da função de dependencias
check_dependencies

# ----------------------------------------------------------------------------
# Função: log_action
# Descrição: Registra ações no arquivo de log e exibe no terminal com suporte a cores.
# O log é formatado com timestamp e mensagens coloridas dependendo do tipo de log.
# ----------------------------------------------------------------------------
log_action() {
    local message="$1"            # Mensagem a ser exibida
    local log_type="${2:-INFO}"   # Tipo de log: INFO, ERROR, SUCCESS, etc.
    local log_file="${LOG_FILE:-./default_log.log}"  # Arquivo de log (padrão: default_log.log)

    # Verificar se o parâmetro --silent foi passado em INIT_COMMAND ou nos argumentos
    if [[ "$@" == *"--silent"* || "$INIT_COMMAND" == *"--silent"* ]]; then
        SILENT=true
    fi

    # Cores para diferentes tipos de mensagens
    local color_reset="\033[0m"
    local color_info="\033[1;34m"      # Azul para INFO
    local color_success="\033[1;32m"   # Verde para SUCCESS
    local color_error="\033[1;31m"     # Vermelho para ERROR
    local color_warning="\033[1;33m"   # Amarelo para WARN

    # Escolher cor com base no tipo de log
    local color
    case "$log_type" in
        INFO)
            color="$color_info"
            ;;
        SUCCESS)
            color="$color_success"
            ;;
        ERROR)
            color="$color_error"
            ;;
        WARN)
            color="$color_warning"
            ;;
        *)
            color="$color_reset"  # Sem cor se o tipo for desconhecido
            ;;
    esac

    # Formatar mensagem com timestamp
    local timestamp
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local formatted_message="$timestamp - $log_type: $message"

    # Se o modo silent não estiver ativado, exibe a mensagem no terminal com cor
    if [[ "$SILENT" == false ]]; then
        printf "${color}%s${color_reset}\n" "$formatted_message"
    fi

    # Registrar a mensagem no arquivo de log (sem cores)
    printf "%s\n" "$formatted_message" >> "$log_file"

    # Se for silent, remove tudo após qualquer prompt
    if [[ "$SILENT" == true ]]; then
        clear
    fi
}

# --------------------------------------------------------------------------
# Função para exibir uma barra de progresso animada enquanto um processo
# em segundo plano está em execução. A barra de progresso pode ser usada
# para indicar que algo está acontecendo em tempo real.
#
# Parâmetros:
#   $1 - PID do processo a ser monitorado.
#   $2 (opcional) - Atraso entre cada atualização da animação. (padrão: 0.1s)
#   $3 (opcional) - Caracteres usados na animação (padrão: "|/-\").
#
# Exemplo de uso:
#   some_long_process &
#   progress_bar $! 0.1 '|/-\'
# --------------------------------------------------------------------------
progress_bar() {
    local pid=$1                 # PID do processo que será monitorado
    local delay=${2:-0.1}        # Intervalo entre atualizações (padrão: 0.1s)
    local spinstr=${3:-'|/-\'}   # Caracteres de animação (padrão: "|/-\")
    local temp_str               # Variável temporária para manipulação da string

    # Validações de parâmetros
    if ! ps -p "$pid" &>/dev/null; then
        echo "Erro: PID $pid não encontrado."
        return 1
    fi

    if [[ ! "$delay" =~ ^[0-9]+(\.[0-9]+)?$ ]]; then
        echo "Erro: O parâmetro 'delay' deve ser um número válido."
        return 1
    fi

    # Função interna para exibir o próximo frame da animação
    __update_spinner() {
        local frame_char="${spinstr:0:1}"  # Pega o primeiro caractere
        temp_str="${spinstr:1}$frame_char" # Rotaciona a string
        spinstr="$temp_str"                # Atualiza a string para o próximo ciclo
        printf " [%c]  " "$frame_char"     # Exibe o frame atual da animação
    }

    # Inicia o loop de exibição enquanto o processo estiver ativo
    while ps -p "$pid" &>/dev/null; do
        __update_spinner               # Exibe o próximo frame
        sleep "$delay"                 # Pausa pelo intervalo especificado
        printf "\b\b\b\b\b\b"          # Remove a animação atual do terminal
    done

    # Limpa os resíduos da animação após a conclusão
    printf "    \b\b\b\b"              # Apaga qualquer resto da barra de progresso
    echo                               # Move para a próxima linha no terminal

    return 0
}

# ----------------------------------------------------------------------------
# Função para garantir que um diretório exista. Se o diretório não existir,
# ele será criado. Usa `mkdir -p` para criar diretórios aninhados, caso seja
# necessário.
#
# Parâmetros:
#   $1 - Caminho do diretório a ser garantido
#
# Exemplo de uso:
#   ensure_directories "/caminho/para/diretorio"
# ----------------------------------------------------------------------------
ensure_directories() {
    local dir_path="$1"  # Caminho do diretório a ser garantido

    # Verifica se o diretório existe, se não existir, ele será criado.
    if [[ ! -d "$dir_path" ]]; then
        mkdir -p "$dir_path"
        if [[ $? -eq 0 ]]; then
            log_action "Diretório criado: $dir_path" "SUCCESS"
        else
            log_action "Erro ao criar o diretório: $dir_path" "ERROR"
            exit 1
        fi
    fi
}

# ----------------------------------------------------------------------------
# Função para verificar se o diretório especificado tem permissões de escrita.
# Se não houver permissão, a função registra o erro e encerra a execução.
#
# Parâmetros:
#   $1 - Caminho do diretório a ser verificado
#
# Exemplo de uso:
#   check_write_permissions "/caminho/para/diretorio"
# ----------------------------------------------------------------------------
check_write_permissions() {
    local dir="$1"  # Caminho do diretório a ser verificado

    # Verifica se o diretório tem permissão de escrita
    if [[ ! -w "$dir" ]]; then
        log_action "Erro: Sem permissões de escrita em $dir." "ERROR"
        exit 1
    else
        log_action "Permissões de escrita positivas para $dir." "SUCCESS"
    fi
}

# ----------------------------------------------------------------------------
# Função para sincronizar um repositório Git. A função verifica se o repositório
# existe localmente e, se sim, faz um pull para atualizá-lo. Se o repositório
# não existir, ele será clonado. Caso tenha sido atualizado recentemente,
# a função evitará pull excessivos, a menos que forçado.
#
# Parâmetros:
#   $1 (opcional) - Flag "-y" para forçar a atualização, mesmo que recente.
#
# Exemplo de uso:
#   sync_repo "-y"
# ----------------------------------------------------------------------------
sync_repo() {
    local force_update="$1"          # Flag para forçar atualização (opcional)
    local last_update                # Armazena a última modificação do repositório
    local current_time=$(date +%s)   # Tempo atual em segundos
    local age                        # Idade do último update do repositório

    # Garante que o diretório do repositório existe
    ensure_directories "$REPO_DIR"

    # Verifica se há permissões de escrita no diretório
    check_write_permissions "$REPO_DIR"

    # Se o repositório já existir localmente, tenta atualizá-lo
    if [[ -d "$REPO_DIR/.git" ]]; then
        last_update=$(stat -c %Y "$REPO_DIR")
        age=$((current_time - last_update))

        # Se o repositório for antigo o suficiente ou se a atualização for forçada
        if [[ $age -ge $UPDATE_THRESHOLD || "$force_update" == "-y" ]]; then
            log_action "Atualizando repositório..." "INFO"
            git -C "$REPO_DIR" pull --quiet &  # Atualiza em segundo plano
            local pid=$!                       # Captura o PID do processo git
            progress_bar "$pid"                # Exibe barra de progresso
            wait "$pid"                        # Espera a conclusão
            log_action "Repositório atualizado com sucesso." "SUCCESS"
        else
            log_action "Repositório atualizado recentemente. Use '-y' para forçar." "INFO"
        fi
    else
        # Se o repositório não existir, realiza o clone
        log_action "Clonando o repositório..." "INFO"
        git clone --quiet "$REPO_URL" "$REPO_DIR" &  # Clona em segundo plano
        local pid=$!                                 # Captura o PID do processo git
        progress_bar "$pid"                          # Exibe barra de progresso
        wait "$pid"                                  # Espera a conclusão
        log_action "Repositório clonado com sucesso." "SUCCESS"
    fi
}

# ----------------------------------------------------------------------------
# Função para encontrar o arquivo .zip com a versão mais alta dentro de um
# diretório. As versões são extraídas dos nomes dos arquivos, ordenadas, e a
# mais recente é retornada.
#
# Parâmetros:
#   $1 - Caminho do diretório onde procurar pelos arquivos .zip
#
# Saída:
#   - O nome do arquivo .zip com a versão mais alta, ou mensagem de erro
#
# Exemplo de uso:
#   find_latest_version "/caminho/para/diretorio"
# ----------------------------------------------------------------------------
find_latest_version() {
    local dir="$1"  # Caminho do diretório onde procurar pelos arquivos .zip

    # Valida se o diretório existe
    if [[ ! -d "$dir" ]]; then
        log_action "Erro: Diretório $dir não encontrado." "WARN"
        return 1
    fi

    # Encontra todos os arquivos .zip e extrai seus nomes sem a extensão
    local versions=($(find "$dir" -type f -iname "*.zip" -exec basename {} .zip \;))

    # Verifica se há arquivos .zip disponíveis
    if [[ ${#versions[@]} -eq 0 ]]; then
        log_action "Nenhuma versão disponível no diretório $dir." "WARN"
        return 1
    fi

    # Ordena as versões de forma case insensitive e captura a mais alta
    local latest_version=$(printf "%s\n" "${versions[@]}" | sort -fV | tail -n 1)

    # Retorna o nome do arquivo .zip com a versão mais alta
    echo "$latest_version.zip"
    return 0
}

# ----------------------------------------------------------------------------
# Função para verificar a existência de um diretório de instalação e perguntar
# ao usuário a ação desejada (sobrescrever, apagar e reinstalar, ou cancelar).
#
# Parâmetros:
#   $1 - Caminho do arquivo JSON contendo informações sobre a instalação.
#   $2 - Caminho do arquivo .zip que será instalado.
#   $3 - Caminho do diretório de destino.
# ----------------------------------------------------------------------------
check_and_handle_installation() {
    local json_file="$1"   # Caminho do arquivo JSON de configuração
    local zip_file="$2"    # Caminho do arquivo .zip a ser instalado
    local final_dir="$3"    # Caminho do arquivo .zip a ser instalado
    local is_hotfix=""     # Se for hotfix
    local auto_install=false
    local overwrite=false

    # Verifica se o parâmetro -y ou --yes foi passado para auto-instalar
    if [[ "$@" =~ "-y" || "$@" =~ "--yes" ]]; then
        auto_install=true
    fi

    # Verifica se o parâmetro -O ou --overwrite foi passado
    if [[ "$@" =~ "-O" || "$@" =~ "--overwrite" ]]; then
        overwrite=true
    fi

    # Verifica se o parâmetro -NO ou --no-overwrite foi passado
    if [[ "$@" =~ "-NO" || "$@" =~ "--no-overwrite" ]]; then
        overwrite=false
    fi

    # Valida se o arquivo JSON existe
    if [[ ! -f "$json_file" ]]; then
        log_action "Erro: Arquivo de configuração $json_file não encontrado." "ERROR"
        exit 1
    fi

    # Se o escolhido for HotFix (case insensitive)
    if [[ "${zip_file,,}" == *"hotfix"* ]]; then
        is_hotfix=" [HOTFIX VERSION, OPÇÃO RECOMENDADA!]"
    fi

    # Extrai informações do arquivo JSON
    local installed_dir=$(jq -r '.installed.value' "$json_file")
    local install_dir=$(jq -r '.location.value' "$json_file")

    # Valida se o diretório de instalação já existe
    if [[ -d "$installed_dir" ]]; then
        printf "\n\n"
        log_action "A pasta $installed_dir já existe." "WARN"

        # Se o modo auto-install estiver ativado, escolhe automaticamente
        if [[ "$auto_install" == true ]]; then
            log_action "Auto-instalação ativada, sobrescrevendo ou apagando conforme a flag -O ou -NO escolhida." "INFO"
            if [[ "$overwrite" == true ]]; then
                log_action "Sobrescrevendo conteúdo em $installed_dir..." "WARN"
            else
                log_action "Apagando o diretório $installed_dir e reinstalando..." "WARN"
                rm -rf "$installed_dir"
            fi
        else
            printf "O que você deseja fazer?\n\n"
            printf "1) Apenas sobrescrever$is_hotfix\n"
            printf "2) Apagar e instalar [Clean Install]\n"
            printf "3) Cancelar\n\n"
            read -rp "Escolha uma opção [1-3]: " choice

            case $choice in
            1)
                log_action "Sobrescrevendo conteúdo em $installed_dir..." "WARN"
                ;;
            2)
                log_action "Apagando o diretório $installed_dir e reinstalando..." "WARN"
                rm -rf "$installed_dir"
                ;;
            3)
                log_action "Operação cancelada pelo usuário." "INFO"
                exit 0
                ;;
            *)
                log_action "Opção inválida. Operação cancelada." "INFO"
                exit 1
                ;;
            esac
        fi
    else
        log_action "Diretório $installed_dir não encontrado. Iniciando instalação..." "INFO"
    fi

    # Valida se o arquivo .zip existe
    if [[ ! -f "$zip_file" ]]; then
        log_action "Erro: Arquivo $zip_file não encontrado." "ERROR"
        exit 1
    fi

    # Chama a função de instalação passando o arquivo .zip e o diretório de destino
    install_zip "$zip_file" "$install_dir" "$final_dir"
}

# ----------------------------------------------------------------------------
# Função para descompactar um arquivo .zip em um diretório de destino.
# Exibe uma barra de progresso durante o processo de extração.
#
# Parâmetros:
#   $1 - Caminho completo para o arquivo .zip
#   $2 - Diretório de destino onde o arquivo será descompactado
#
# Exemplo de uso:
#   install_zip "arquivo.zip" "/caminho/destino"
# ----------------------------------------------------------------------------
install_zip() {
    local zip_file="$1"      # Caminho do arquivo .zip
    local dest_dir="$2"      # Diretório de destino
    local final_dir="$3"     # Diretorio pós-instalação

    # Valida se o arquivo .zip existe
    if [[ ! -f "$zip_file" ]]; then
        log_action "Erro: Arquivo $zip_file não encontrado." "ERROR"
        return 1
    fi

    # Valida se o diretório de destino existe ou cria-o
    ensure_directories "$dest_dir"

    printf "\n" # Breakline

    # Descompacta o arquivo e mostra a barra de progresso
    log_action "Iniciando descompactação de $zip_file para $final_dir..." "INFO"
    unzip -o "$zip_file" -d "$dest_dir" >/dev/null &  # Redireciona a saída
    local pid=$!  # Pega o PID do processo de descompactação

    # Exibe a barra de progresso enquanto o processo está em execução
    progress_bar "$pid"
    wait "$pid"  # Aguarda o término da descompactação

    if [[ $? -eq 0 ]]; then
        log_action "Arquivo $zip_file descompactado com sucesso." "SUCCESS"
    else
        log_action "Erro ao descompactar $zip_file." "ERROR"
        return 1
    fi

    printf "\n" # Breakline
}

# ----------------------------------------------------------------------------
# Função para baixar e descompactar a versão mais recente de um BOT, com suporte
# a instruções de pré-instalação e pós-configuração a partir de um arquivo JSON.
#
# Parâmetros:
#   $1 - Nome do BOT
#   $2 - Nome do desenvolvedor do BOT
#   $3 - Nome do comando a ser instalado
#   $4 - Versão a ser instalada (ou "latest" para a versão mais recente)
#
# Exemplo de uso:
#   download_function "MeuBOT" "Desenvolvedor" "comando" "latest"
# ----------------------------------------------------------------------------
download_function() {
    local bot_name="$1"         # Nome do BOT
    local dev_name="$2"         # Nome do desenvolvedor
    local command_name="$3"     # Nome do comando
    local version="$4"          # Versão a ser instalada

    # Define o diretório onde os arquivos .zip e JSON estão localizados
    local zip_dir="$REPO_DIR/$bot_name/$dev_name/$command_name"
    local json_file="$zip_dir/instruct.json"

    # Verifica se o arquivo JSON existe
    if [[ ! -f "$json_file" ]]; then
        log_action "Erro: Arquivo de instruções $json_file não encontrado." "ERROR"
        return 1
    fi

    # Lê comandos de pré-instalação e pós-configuração do JSON
    local install_path=$(jq -r '.location.value' "$json_file")
    local final_dir=$(jq -r '.installed.value' "$json_file")
    local pre_install_cmd=$(jq -r ".install.value.$(get_os).command" "$json_file")
    local post_config_cmd=$(jq -r ".configuration.value.$(get_os).command" "$json_file")

    # Determina a versão mais recente se necessário
    if [[ "$version" == "latest" ]]; then
        version=$(find_latest_version "$zip_dir") || {
            log_action "Erro: Não foi possível determinar a versão mais recente." "ERROR"
            return 1
        }
    fi

    # Formata o nome do arquivo
    local zip_file="$zip_dir/$version"

    # Verifica se o arquivo ZIP existe
    if [[ ! -f "$zip_file" ]]; then
        log_action "Arquivo $version não encontrado." "ERROR"
        return 1
    fi

    # Verifica se o diretório de instalação já existe e trata conforme o usuário
    check_and_handle_installation "$json_file" "$zip_file" "$final_dir"

    # Executa o comando de pré-instalação, se houver
    if [[ -n "$pre_install_cmd" ]]; then
        log_action "Executando sistemas de de pré-instalação..." "WARN"
        run_pre_install "$pre_install_cmd"
    fi

    # Garante que o diretório de instalação existe
    ensure_directories "$install_path"

    # Baixa e descompacta a versão
    log_action "Baixando e descompactando $version para $install_path" "INFO"
    install_zip "$zip_file" "$install_path" "$final_dir"

    # Executa o comando de pós-configuração, se houver
    if [[ -n "$post_config_cmd" ]]; then
        log_action "Executando sistemas de pós-configuração..." "WARN"
        run_post_install "$post_config_cmd" "$install_path"
    fi

    # Registro de sucesso
    log_action "Função $command_name codename $version instalada com sucesso." "SUCCESS"
}

# ----------------------------------------------------------------------------
# Função para detectar o sistema operacional e retornar a chave correta
# que pode ser usada para executar comandos específicos do SO.
#
# Retorna:
#   "linux"   - para sistemas Linux
#   "macos"   - para sistemas macOS
#   "windows" - para sistemas Windows (Cygwin, Mingw, MSYS)
#   "other"   - para qualquer outro sistema não identificado
#
# Exemplo de uso:
#   os=$(get_os)
#   if [[ "$os" == "linux" ]]; then
#       echo "Este é um sistema Linux."
#   fi
# ----------------------------------------------------------------------------
get_os() {
    local os_name="$(uname -s)"  # Captura o nome do SO

    case "$os_name" in
        Linux*)   echo "linux" ;;
        Darwin*)  echo "macos" ;;
        CYGWIN* | MINGW* | MSYS*) echo "windows" ;;
        *)        echo "other" ;;  # Caso o SO não seja reconhecido
    esac
}

# ----------------------------------------------------------------------------
# Função para confirmar com o usuário antes de executar um comando via eval.
# O comando é exibido na tela para que o usuário possa revisar antes de decidir.
#
# Parâmetros:
#   $1 - Comando que será executado via eval
#
# Exemplo de uso:
#   confirm_and_run_eval "echo 'Hello, World!'"
# ----------------------------------------------------------------------------
confirm_and_run_eval() {
    local script="$1"  # Comando que será avaliado
    local prompt_message  # Mensagem de confirmação

    # Constroi a mensagem de confirmação com o comando
    prompt_message="Deseja executar o seguinte comando de instalação?\n"
    prompt_message+="$script\n\n[s] Sim | [n] Não\n~# Caution: "

    # Loop até que o usuário insira uma resposta válida
    while true; do
        # Exibe a mensagem e aguarda a resposta do usuário
        read -rp "$(echo -e "$prompt_message")" confirm

        # Trata as respostas válidas
        case "$confirm" in
            [yY] | [sS])  # Sim
                clear
                # Tenta executar o comando
                eval "$script" || {
                    log_action "Erro ao executar o comando: $script" "ERROR"
                    return 1
                }
                log_action "Comando executado com sucesso: $script" "SUCCESS"
                break
                ;;
            [nN])  # Não
                clear
                log_action "Execução do comando pulada. Continuando..." "WARN"
                return 0
                ;;
            *)  # Opção inválida
                echo "Opção inválida. Escolha [s] para sim ou [n] para não." "WARN"
                ;;
        esac
    done
}

# ----------------------------------------------------------------------------
# Função para executar comandos pré-instalação (dependências).
# Verifica se existe um comando de pré-instalação válido e o executa, se aplicável.
#
# Parâmetros:
#   $1 - Comando de pré-instalação a ser executado
#
# Exemplo de uso:
#   run_pre_install "sudo apt-get install -y package"
# ----------------------------------------------------------------------------
run_pre_install() {
    local pre_cmd="$1"  # Comando pré-instalação

    # Executa o comando se for diferente de "none" ou vazio
    if [[ "$pre_cmd" != "none" && -n "$pre_cmd" ]]; then
        confirm_and_run_eval "$pre_cmd" || {
            log_action "Falha ao executar comando pré-instalação." "ERROR"
            return 1
        }
    else
        log_action "Nenhum comando pré-instalação fornecido." "INFO"
    fi
}

# ----------------------------------------------------------------------------
# Função para executar comandos pós-instalação (configuração).
# Verifica se existe um comando de pós-instalação válido e o executa, se aplicável.
#
# Parâmetros:
#   $1 - Comando de pós-instalação a ser executado
#   $2 - Caminho da instalação, utilizado se necessário pelo comando
#
# Exemplo de uso:
#   run_post_install "sudo systemctl restart service" "/path/to/install"
# ----------------------------------------------------------------------------
run_post_install() {
    local post_cmd="$1"  # Comando pós-instalação
    local install_path="$2"  # Caminho da instalação

    # Executa o comando se for diferente de "none" ou vazio
    if [[ "$post_cmd" != "none" && -n "$post_cmd" ]]; then
        confirm_and_run_eval "$post_cmd" || {
            log_action "Falha ao executar comando pós-instalação." "ERROR"
            return 1
        }
    else
        log_action "Nenhum comando pós-instalação fornecido." "INFO"
    fi
}

# ----------------------------------------------------------------------------
# Função para listar os desenvolvedores (devs) disponíveis para um bot específico.
# Procura por diretórios dentro do caminho do bot e lista os nomes dos devs.
#
# Parâmetros:
#   $1 - Nome do bot
#
# Exemplo de uso:
#   list_devs "my_bot"
# ----------------------------------------------------------------------------
list_devs() {
    local bot_name="$1"  # Nome do bot
    local devs  # Array para armazenar os devs encontrados

    # Busca por diretórios dentro da pasta do bot, que representam os devs
    devs=($(find "$REPO_DIR/$bot_name" -mindepth 1 -maxdepth 1 -type d -exec basename {} \;))

    # Verifica se encontrou algum dev
    if [[ ${#devs[@]} -eq 0 ]]; then
        log_action "Nenhum desenvolvedor encontrado para o bot $bot_name." "WARN"
        return 1
    fi

    # Exibe as opções de devs e permite que o usuário selecione
    select_option "Escolha um desenvolvedor disponível:" "${devs[@]}" || {
        log_action "Seleção de desenvolvedor cancelada." "INFO"
        return 1
    }
    printf "\n"
}

# ----------------------------------------------------------------------------
# Função para listar os comandos disponíveis para um bot e desenvolvedor específicos.
# Procura por diretórios dentro do caminho do dev e lista os comandos.
#
# Parâmetros:
#   $1 - Nome do bot
#   $2 - Nome do desenvolvedor
#
# Exemplo de uso:
#   list_commands "my_bot" "dev_name"
# ----------------------------------------------------------------------------
list_commands() {
    local bot_name="$1"  # Nome do bot
    local dev_name="$2"  # Nome do desenvolvedor
    local commands=()     # Array para armazenar os comandos encontrados
    local modified_times=()  # Array para armazenar os tempos de modificação

    # Busca por diretórios dentro da pasta do dev, que representam os comandos
    while IFS= read -r -d '' dir; do
        commands+=("$(basename "$dir")")
        modified_times+=("$(stat -c %Y "$dir")")  # Armazena o timestamp de modificação
    done < <(find "$REPO_DIR/$bot_name/$dev_name" -mindepth 1 -maxdepth 1 -type d -print0)

    # Verifica se encontrou algum comando
    if [[ ${#commands[@]} -eq 0 ]]; then
        log_action "Nenhum comando encontrado para o desenvolvedor $dev_name." "WARN"
        return 1
    fi

    # Ordena os comandos com base no tempo de modificação (mais recente primeiro)
    IFS=$'\n' sorted_commands=($(for i in "${!modified_times[@]}"; do
        echo "${modified_times[i]} ${commands[i]}"
    done | sort -nr | cut -d' ' -f2-))
    unset IFS

    # Exibe as opções de comandos e permite que o usuário selecione
    select_option "Escolha um comando disponível:" "${sorted_commands[@]}" || {
        log_action "Seleção de comando cancelada." "WARN"
        return 1
    }
    printf "\n"
}

# ----------------------------------------------------------------------------
# Função para exibir o conteúdo de um arquivo README.md com formatação básica.
# Faz uso de cores e formatações simples para melhorar a legibilidade dos cabeçalhos,
# listas e blocos de código.
#
# Parâmetros:
#   $1 - Nome do bot
#   $2 - Nome do desenvolvedor
#   $3 - Nome do comando
#
# Exemplo de uso:
#   show_readme "my_bot" "dev_name" "command_name"
# ----------------------------------------------------------------------------
show_readme() {
    local bot_name="$1"           # Nome do bot
    local dev_name="$2"           # Nome do desenvolvedor
    local command_name="$3"       # Nome do comando
    local readme_path="$REPO_DIR/$bot_name/$dev_name/$command_name/README.md"  # Caminho do README.md

    # Verifica se o arquivo README.md existe
    if [[ -f "$readme_path" ]]; then
        clear  # Limpa o terminal

        log_action "Exibindo README.md de $command_name..." "INFO"

        # Exibe o README.md com formatação básica usando awk
        awk '
            BEGIN { printf "\n" }
            # Cabeçalhos de nível 1 (H1) -> Azul
            /^# / { printf "\033[1;34m%s\033[0m\n", substr($0, 3); next }
            # Cabeçalhos de nível 2 (H2) -> Verde
            /^## / { printf "\033[1;32m%s\033[0m\n", substr($0, 4); next }
            # Cabeçalhos de nível 3 (H3) -> Amarelo
            /^### / { printf "\033[1;33m%s\033[0m\n", substr($0, 5); next }
            # Listas com marcadores -> Converte o "-" para "•" e mantém o conteúdo
            /^- / { printf "• %s\n", substr($0, 3); next }
            # Blocos de código cercados por "```" -> Alterna entre início e fim do código
            /^```/ { in_code = !in_code; next }
            # Exibe o conteúdo do bloco de código em branco
            { if (in_code) { print "\033[1;37m" $0 "\033[0m" } else { print $0 } }
        ' "$readme_path"

        printf "\n\n"  # Adiciona uma quebra de linha no final
    else
        # Exibe uma mensagem de erro caso o README.md não seja encontrado
        log_action "README.md não encontrado para o comando $command_name." "WARN"
        return 1
    fi
}

# Função para verificar se é root (Linux/WSL/macOS)
is_root() {
  [ "$(id -u)" -eq 0 ]
}

# Função para verificar se é admin (Git Bash/MinGW)
is_admin() {
  if command -v net &> /dev/null; then
    net session &> /dev/null
    return $?
  else
    return 1
  fi
}

# ----------------------------------------------------------------------------
# Função auxiliar para exibir e selecionar opções de um array.
# Exibe as opções com paginação se houver mais de 10 itens.
#
# Parâmetros:
#   $1  - Mensagem do prompt
#   $@  - Lista de opções disponíveis
#
# Exemplo de uso:
#   select_option "Escolha uma opção:" "${opcoes[@]}"
# ----------------------------------------------------------------------------
select_option() {
    local prompt="$1"
    shift
    local options=("$@")  # Armazena as opções passadas como argumentos
    local page=0          # Inicializa a página atual
    local page_size=10    # Define o número máximo de opções por página
    local choice          # Variável para armazenar a opção escolhida
    local total_options=${#options[@]}  # Total de opções disponíveis
    local total_pages=$(( (total_options + page_size - 1) / page_size ))  # Total de páginas
    
    # Printa o local
    printf "Process Working Directory (PWD): $(pwd)\n\n"

    # Verifica se há opções disponíveis
    if (( total_options == 0 )); then
        echo "Nenhuma opção disponível."
        return 1
    fi

    while true; do
        local start=$((page * page_size))  # Calcula o índice inicial para a página atual
        local current_options=("${options[@]:$start:$page_size}")  # Opções da página atual

        # Exibe o prompt e as opções atuais
        echo "$prompt"
        for i in "${!current_options[@]}"; do
            printf "%s) %s\n" "$((i + 1))" "${current_options[i]}"
        done
        
        # Exibe opções de navegação
        echo "d) Próxima Página"
        echo "a) Página Anterior"
        printf "c) Cancelar\n\n"

        # Obtém o nome do usuário
        USER=$(whoami)

        # Obtém o nome do computador
        HOST=$(hostname)

        # Verifica se o usuário é root ou admin
        if is_root || is_admin; then
            PS3="${ADMIN} ~ ${USER}@${HOST}:~$"
        else
            PS3="${USER}@${HOST}:~$ "
        fi

        # Exibe o prompt personalizado
        read -rp "$PS3" REPLY

        case "$REPLY" in
            "c" | "Cancelar")
                echo "Operação cancelada."
                exit 0
                ;;
            "d" | "Próxima Página")
                if (( page + 1 < total_pages )); then
                    page=$((page + 1))  # Avança para a próxima página
                    clear
                else
                    printf "\nVocê já está na última página.\n"
                fi
                ;;
            "a" | "Página Anterior")
                if (( page > 0 )); then
                    page=$((page - 1))  # Volta para a página anterior
                    clear
                else
                    printf "\nVocê já está na primeira página.\n"
                fi
                ;;
            *)
                # Verifica se a entrada é um número válido
                if [[ "$REPLY" =~ ^[1-9][0-9]*$ ]] && (( REPLY >= 1 && REPLY <= ${#current_options[@]} )); then
                    choice="${current_options[$((REPLY - 1))]}"  # Armazena a opção escolhida
                    clear
                    printf "\nVocê escolheu: %s" "$choice"
                    REPLY="$choice"
                    return 0  # Retorna sucesso
                else
                    printf "\nSeleção inválida. Tente novamente."
                fi
                ;;
        esac
    done
}


# ----------------------------------------------------------------------------
# Função para listar bots disponíveis no diretório de repositórios.
# Utiliza find para localizar diretórios (exceto ocultos) e permite selecionar um bot.
# ----------------------------------------------------------------------------
list_bots() {
    local bots
    bots=($(find "$REPO_DIR" -mindepth 1 -maxdepth 1 -type d ! -name '.*' -exec basename {} \;))

    # Verifica se há bots disponíveis
    if [[ ${#bots[@]} -eq 0 ]]; then
        log_action "Nenhum bot encontrado, execute a função update." "ERROR"
        return 1
    fi

    # Chama a função para selecionar uma opção
    select_option "Escolha um bot disponível:" "${bots[@]}"
    printf "\n"
}

# ----------------------------------------------------------------------------
# Função para listar versões disponíveis (arquivos .zip) de um comando específico.
# Exibe as versões disponíveis para instalação.
# ----------------------------------------------------------------------------
list_versions() {
    local bot_name="$1"
    local dev_name="$2"
    local command_name="$3"
    local versions
    versions=($(find "$REPO_DIR/$bot_name/$dev_name/$command_name" -type f -name "*.zip"))

    # Verifica se há versões disponíveis
    if [[ ${#versions[@]} -eq 0 ]]; then
        log_action "Nenhuma versão disponível para a função $command_name." "WARN"
        return 1
    fi

    # Cria um array para armazenar as opções formatadas
    local formatted_versions=()

    for file in "${versions[@]}"; do
        local filename=$(basename "$file")
        local filesize_kb=$(stat -c%s "$file") # Tamanho do arquivo em bytes
        filesize_kb=$((filesize_kb / 1024))    # Converte para KB
        local mod_time=$(stat -c%y "$file")     # Data de modificação

        # Formata a data de modificação
        mod_time=$(date -d "$mod_time" +"%Y-%m-%d %H:%M:%S")

        # Adiciona a informação formatada ao array com o nome do arquivo em amarelo
        formatted_versions+=("\"$filename\" | $mod_time | ${filesize_kb}KB")
    done

    # Ordena as versões pela data de modificação (mais recente primeiro)
    IFS=$'\n' sorted_versions=($(sort -r <<<"${formatted_versions[*]}"))
    unset IFS

    # Chama a função para selecionar uma versão
    select_option "Escolha uma versão disponível:" "${sorted_versions[@]}"
    printf "\n"
}



# ----------------------------------------------------------------------------
# Função para instalar um comando via parâmetros formatados como bot@dev@command@version.
# Se "latest" for especificado para a versão, baixa a versão mais recente.
# ----------------------------------------------------------------------------
install_via_params() {
    IFS='@' read -ra args <<< "$1"
    local bot_name="${args[0],,}"     
    local dev_name="${args[1],,}"     
    local command_name="${args[2],,}" 
    local version="${args[3],,}"

    # Verifica se os parâmetros necessários foram fornecidos
    if [[ -z "$bot_name" || -z "$dev_name" || -z "$command_name" ]]; then
        log_action "Parâmetros inválidos. Uso: bot@dev@command@version | bot@dev@command@latest" "INFO"
        exit 1
    fi

    # Verifica se a versão é "latest" ou não
    if [[ -z "$version" || "$version" == "latest" ]]; then
        log_action "Instalando a versão mais recente de $command_name..." "INFO"
        download_function "$bot_name" "$dev_name" "$command_name" "latest"
    else
        log_action "Instalando a versão $version de $command_name..." "INFO"
        download_function "$bot_name" "$dev_name" "$command_name" "v$version.zip"
    fi

    # Adiciona o comando à lista de pacotes instalados, removendo duplicatas
    package_line="$bot_name@$dev_name@$command_name"

    # Verifica se o pacote já está presente no arquivo, se não, adiciona
    grep -qxFi "$package_line" "$INSTALLED_PACKAGES" || echo "$package_line" >> "$INSTALLED_PACKAGES"
}

# ----------------------------------------------------------------------------
# Função para remover pacotes instalados com base nos parâmetros fornecidos.
# Formato esperado: bot@dev@command.
# ----------------------------------------------------------------------------
remove_function() {
    IFS='@' read -ra args <<< "$1"
    local bot_name="${args[0],,}"
    local dev_name="${args[1],,}"
    local command_name="${args[2],,}"

    # Verifica se os parâmetros necessários foram fornecidos
    if [[ -z "$bot_name" || -z "$dev_name" || -z "$command_name" ]]; then
        log_action "Parâmetros inválidos. Uso: bot@dev@command" "WARN"
        exit 1
    fi

    # Define o caminho do JSON e do diretório instalado
    local zip_dir="$REPO_DIR/$bot_name/$dev_name/$command_name"
    local json_file="$zip_dir/instruct.json"
    local installed_dir=$(jq -r '.installed.value' "$json_file")

    # Verifica se o diretório instalado existe
    if [[ -d "$installed_dir" ]]; then
        # Localiza e remove o diretório de forma insensível a maiúsculas e minúsculas
        find "$REPO_DIR/$bot_name/$dev_name" -iname "$command_name" -exec rm -rf {} +
        log_action "Função $command_name removida com sucesso." "SUCCESS"
    else
        log_action "Função $command_name não encontrada." "WARN"
    fi
}


# ----------------------------------------------------------------------------
# Função principal de instalação interativa. Lista bots, devs e comandos para o usuário escolher.
# Exibe o README antes de solicitar confirmação para instalação.
# ----------------------------------------------------------------------------
install_function() {
    # Declaração de variáveis locais
    local bot_name dev_name command_name version

    # Exibe a lista de bots disponíveis. Se falhar, retorna erro.
    list_bots || return 1
    bot_name="${REPLY,,}"  # Armazena o nome do bot em minúsculas

    # Exibe a lista de desenvolvedores do bot escolhido. Se falhar, retorna erro.
    list_devs "$bot_name" || return 1
    dev_name="${REPLY,,}"  # Armazena o nome do desenvolvedor em minúsculas

    # Exibe a lista de comandos disponíveis para o bot e desenvolvedor escolhidos. Se falhar, retorna erro.
    list_commands "$bot_name" "$dev_name" || return 1
    command_name="${REPLY,,}"  # Armazena o nome do comando em minúsculas

    # Exibe o conteúdo do README do comando selecionado
    show_readme "$bot_name" "$dev_name" "$command_name"

    # Solicita confirmação do usuário para baixar o comando
    read -rp "Deseja baixar esta função? (s/n): " confirm
    printf "\n"
    case "${confirm,,}" in  
        # Se o usuário confirmar com 'sim' (y/s), prossegue com a instalação
        [y] | [s])  
            clear  # Limpa a tela

            # Exibe a lista de versões disponíveis para o comando selecionado
            list_versions "$bot_name" "$dev_name" "$command_name" || return 1
            version="$REPLY"  # Armazena a versão escolhida pelo usuário
            download_function "$bot_name" "$dev_name" "$command_name" "$version"  # Baixa o comando

            # Adiciona o comando à lista de pacotes instalados, removendo duplicatas
            package_line="$bot_name@$dev_name@$command_name"

            # Verifica se o pacote já está presente no arquivo, se não, adiciona
            grep -qxFi "$package_line" "$INSTALLED_PACKAGES" || echo "$package_line" >> "$INSTALLED_PACKAGES"

            # Log de sucesso na instalação
            log_action "$bot_name@$dev_name@$command_name instalado com sucesso." "SUCCESS"
            return 0
            ;;
        # Se o usuário cancelar a instalação com 'não' (n), exibe uma mensagem e encerra
        [n])  
            log_action "Instalação cancelada." "WARN"
            exit 0
            ;;
        # Caso o usuário insira uma opção inválida
        *)  
            echo "Opção inválida. Escolha [s] para sim ou [n] para não."
            ;;
    esac
}

# Função para realizar a atualização dos pacotes instalados
upgrade_function() {
    # Verifica se o arquivo de pacotes instalados existe. Caso contrário, registra um erro e retorna.
    if [[ ! -f "$INSTALLED_PACKAGES" ]]; then
        log_action "Nenhum pacote encontrado para atualização. Execute 'install' primeiro." "ERROR"
        return 1
    fi

    # Cria uma variável para armazenar pacotes processados
    declare -A processed_packages

    # Lê a lista de pacotes instalados e tenta reinstalar cada um
    while IFS= read -r package; do
        # Ignora pacotes vazios ou linhas com apenas espaços
        if [[ -z "$package" || "$package" =~ ^[[:space:]]*$ ]]; then
            continue
        fi

        # Se o pacote já foi processado, pula para a próxima iteração
        if [[ -n "${processed_packages[$package]}" ]]; then
            continue
        fi

        # Marca o pacote como processado
        processed_packages["$package"]=1

        # Divide o nome do pacote em partes (bot, dev, comando)
        IFS='@' read -ra args <<< "$package"
        
        # Verifica se a linha tem o formato correto
        if [[ ${#args[@]} -ne 3 ]]; then
            log_action "Formato inválido para o pacote: $package. Ignorando..." "WARNING"
            continue
        fi

        local bot_name="${args[0],,}"  # Armazena o nome do bot em minúsculas
        local dev_name="${args[1],,}"  # Armazena o nome do desenvolvedor em minúsculas
        local command_name="${args[2],,}"  # Armazena o nome do comando em minúsculas

        # Registra que o pacote está sendo reinstalado
        log_action "Reinstalando o pacote $package..." "INFO"

        # Baixa a versão mais recente do comando
        download_function "$bot_name" "$dev_name" "$command_name" "latest"

        # Registra o sucesso na atualização do pacote
        log_action "$package atualizado com sucesso." "SUCCESS"

    done < "$INSTALLED_PACKAGES"
}


# ----------------------------------------------------------------------------
# Função principal que gerencia as opções "update", "install", "upgrade" e "remove".
# "install" e "upgrade" aceitam formato de parâmetros ou instalação interativa.
# ----------------------------------------------------------------------------
main() {
    INIT_COMMAND="$@" # Define as args usadas

    # Verifica o primeiro parâmetro para determinar qual ação executar
    case "${1,,}" in
        "update")
            # Se o comando for 'update', sincroniza o repositório com o segundo parâmetro
            sync_repo "$2"
            ;;
        "install" | "upgrade")
            # Se o comando for 'install' ou 'upgrade', verifica se o segundo parâmetro contém '@', indicando um pacote específico
            if [[ "$2" == *"@"* ]]; then
                install_via_params "$2"  # Instala ou atualiza via parâmetros passados
            else
                # Se o comando for 'install', chama a função de instalação
                if [[ "$1" == "install" ]]; then
                    install_function
                # Se o comando for 'upgrade', chama a função de atualização
                elif [[ "$1" == "upgrade" ]]; then
                    upgrade_function
                fi
            fi
            ;;
        "remove")
            # Se o comando for 'remove', chama a função de remoção com o segundo parâmetro (pacote a ser removido)
            remove_function "$2"
            ;;
        "-h"|"-H")
            clear && printf "$MINIDOCS\nDocumentação COMPLETA: ./$0 --help"
            ;;
        # Caso o comando não seja válido, exibe uma mensagem de uso completa
        *)
            clear && printf "$DOCUMENTATION"
            exit 1
            ;;
    esac
}

# Executa
main "$@"