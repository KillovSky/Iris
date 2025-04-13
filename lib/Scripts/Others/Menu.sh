#!/usr/bin/env bash

# =============================================================
# Script de Busca em Documentação YAML com Cache Diferenciado
# Este script busca e formata resultados em arquivos YAML.
# =============================================================

# -----------------------------
# Configurações de script
# -----------------------------
# Sair em caso de erro
set -o errexit

# Tratar variáveis indefinidas como erro
set -o nounset

# Propagar erros em pipelines
set -o pipefail

# Melhorar o tratamento de espaços em branco
IFS=$'\n\t'

# -----------------------------
# Funções auxiliares
# -----------------------------

# Exibir ajuda
# Mostra as instruções de uso do script
show_help() {
    cat <<EOF
Uso: ${0##*/} [OPÇÕES] TERMO_BUSCA [TEMPLATE_SAIDA] [PREFIXO]

Argumentos:
  TERMO_BUSCA    Termo para busca na documentação (case-insensitive)
                 (use 'array' para obter comandos em formato de array)

  TEMPLATE_SAIDA Template para formatação de saída (opcional)
  PREFIXO        Prefixo para comandos na saída (opcional)

Opções:
  --help         Exibe esta ajuda
  --refresh      Limpa o caching antes de executar a busca

Exemplos:
  ${0##*/} bank
  ${0##*/} array
  ${0##*/} Games "Bem vindo!" "/"
  ${0##*/} --refresh Games  # Limpa o cache e faz uma nova busca por "Games"
EOF
}

# Função para processar um arquivo YAML e extrair informações
# @param {string} file - Caminho para o arquivo YAML
# @param {string} prefix - Prefixo para os resultados
# @param {int} counter - Contador para a numeração
process_yaml() {
    local file="$1"
    local prefix="$2"
    local counter="$3"

    # Extrai informações do YAML usando awk
    awk -v prefix="$prefix" -v counter="$counter" '
    /^name:/ {
        name = $2
        uppercase_name = toupper(name)  # Converte o nome para maiúsculas
    }
    /type:/ {
        flag = "type"
        next
    }
    /subcommands:/ {
        flag = "subcommands"
        next
    }
    /^[^ ]/ {
        flag = ""
    }
    flag == "type" && /- / {
        gsub(/- /, "", $0)  # Remove o marcador de lista
        gsub(/^ +| +$/, "", $0)  # Remove espaços no início e no final
        types = types ? types ", " $0 : $0  # Concatena os tipos
    }
    flag == "subcommands" && /- / {
        gsub(/- /, "", $0)  # Remove o marcador de lista
        gsub(/^ +| +$/, "", $0)  # Remove espaços no início e no final
        subcommands = subcommands ? subcommands ", " $0 : $0  # Concatena os subcomandos
    }
    END {
        # Formata a saída
        printf "%d. *%s*\n- _Tipo:_ *%s*\n- _Subcomandos:_\n> ", counter, uppercase_name, types
        split(subcommands, arr, ", ")
        for (i in arr) {
            gsub(/^ +| +$/, "", arr[i])  # Remove espaços extras de cada subcomando
            printf "`%s%s`, ", prefix, arr[i]
        }
        printf "\n\n"
    }' "$file" | sed 's/,\s*$//'  # Remove a vírgula final
}

# Função principal para buscar e processar arquivos YAML
# @param {string} pattern - Padrão de busca
# @param {string} prefix - Prefixo para os resultados
perform_search_and_process() {
    local pattern="$1"
    local prefix="$2"
    local counter=1  # Inicializa o contador

    # Busca arquivos YAML ignorando diretórios específicos
    while IFS= read -r -d '' file; do
        # Verifica se o arquivo não está oculto e contém o padrão de busca
        if ! grep -q "^hide: true" "$file" && grep -qi "$pattern" "$file"; then
            # Processa o arquivo YAML
            process_yaml "$file" "$prefix" "$counter"
            # Incrementa o contador
            counter=$((counter + 1))
        fi
    done < <(find ./lib/Commands/* -mindepth 1 -maxdepth 1 \
        -type d \( -name 'Main' -o -name 'Default' \) -prune -o \
        -type f -name "details.yaml" -print0)
}

# Exportar a função para o shell
export -f perform_search_and_process

# Extrair e formatar comandos em array JSON
# @param {string} text - Texto contendo os comandos
# @returns {string} Array JSON formatado com os comandos
extract_and_format_cmds() {
    local text="$1"

    # Extrair todas as linhas que contêm "- _Subcomandos:_"
    local cmds_lines
    cmds_lines=$(echo "$text" | awk '/- _Subcomandos:_/{getline; print}' | sed 's/^> //' | sed 's/`/"/g')

    # Formatar os comandos como array JSON
    if [ -n "$cmds_lines" ]; then
        local cmds_array
        cmds_array=$(echo "$cmds_lines" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//g' | tr '\n' ',' | sed 's/,$//')
        echo "[$cmds_array]"
    else
        echo "[]"
    fi
}



# Verificar se o cache é válido
# @param {string} cache_file - Caminho para o arquivo de cache
# @returns {bool} 0 se o cache é válido, 1 caso contrário
is_cache_valid() {
    local cache_file="$1"
    local cache_age=300  # 5 minutos em segundos

    if [[ -f "$cache_file" ]]; then
        local file_age
        file_age=$(($(date +%s) - $(stat -c %Y "$cache_file")))
        if [[ $file_age -lt $cache_age ]]; then
            return 0
        fi
    fi
    return 1
}

# Limpar o cache
clear_cache() {
    local cache_dir="./lib/Scripts/Others/Cache"
    if [[ -d "$cache_dir" ]]; then
        find "$cache_dir" -name "*.txt" -exec rm -f {} \;
    fi
}

# -----------------------------
# Variáveis de entrada
# -----------------------------

# Termo de busca principal
search="${1:-}"

# Template do menu base
menu_template="${2:-}"

# Prefixo para os resultados
prefix="${3:-}"

# Exibir ajuda se --help for fornecido
if [[ "${1:-}" == "--help" ]]; then
    show_help
    exit 0
fi

# Limpar o cache se --refresh for fornecido
if [[ "${1:-}" == "--refresh" ]]; then
    clear_cache
    # Remover o --refresh dos argumentos para continuar a execução normal
    shift
    search="${1:-}"
    menu_template="${2:-}"
    prefix="${3:-}"
fi

# -----------------------------
# Lógica principal
# -----------------------------

# Caminhos para os arquivos de cache
cache_dir="./lib/Scripts/Others/Cache"
mkdir -p "$cache_dir"
cache_specific_file="$cache_dir/_${search}.txt"
cache_general_file="$cache_dir/_.txt"
cache_array_file="$cache_dir/array.txt"

# Caso especial: array
if [[ "$search" == "array" ]]; then
    if is_cache_valid "$cache_array_file"; then
        # Usar o cache do array
        cmds_array_json=$(cat "$cache_array_file")
    else
        # Realizar busca geral para obter todos os comandos
        result=$(perform_search_and_process ".*" "$prefix") || true
        cmds_array_json=$(extract_and_format_cmds "$result")
        # Salvar o array no cache
        echo -e "$cmds_array_json" > "$cache_array_file"
    fi
    echo -e "$cmds_array_json"
    exit 0
fi

# Verificar se o cache específico é válido
if is_cache_valid "$cache_specific_file"; then
    # Usar o cache específico
    result=$(cat "$cache_specific_file")
    cmds_array_json=$(extract_and_format_cmds "$result")
else
    # Realizar busca inicial com base no termo fornecido
    result=$(perform_search_and_process "$search" "$prefix") || true

    if [ -z "$result" ]; then
        # Se não houver resultados, usar o cache geral
        if is_cache_valid "$cache_general_file"; then
            result=$(cat "$cache_general_file")
        else
            # Se o cache geral não for válido, realizar busca geral e salvar no cache
            result=$(perform_search_and_process ".*" "$prefix") || true
            echo -e "$result" > "$cache_general_file"
        fi
        search="General"
    else
        # Se houver resultados, salvar no cache específico
        echo -e "$result" > "$cache_specific_file"
    fi

    # Extrair e formatar comandos em array JSON
    cmds_array_json=$(extract_and_format_cmds "$result")
fi

# -----------------------------
# Saída com base no tipo de filtro
# -----------------------------
case "${1:-}" in
    "array")
        # Exibir o array JSON
        echo -e "$cmds_array_json"
    ;;

    *)
        # Substituir termo de busca no template do menu e exibir resultado
        menu_output="${menu_template//#search/$search}"
        echo -e "$menu_output\n\n🌟 Prefix: *$prefix*\n📚 E.g: \`${prefix}Menu --help\`\n\n$(echo "$result" | sed 's/lib\/Commands\///g')"
    ;;
esac