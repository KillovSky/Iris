#!/usr/bin/env bash

# =============================================================
# Este script realiza buscas em arquivos e diretórios dentro de
# uma estrutura definida, retornando resultados formatados com
# base no tipo de filtragem especificada pelo usuário.
# =============================================================

# -----------------------------
# Funções auxiliares
# -----------------------------
# Função para realizar busca em diretórios e formatar resultados
# @param $1 - Padrão de busca para arquivos
# shellcheck disable=SC2156
perform_search() {
  local pattern="$1"
  find ./lib/Commands/* -mindepth 1 -maxdepth 1 \
    -type d \( -name 'Main' -o -name 'Default' \) -prune -o \
    -type f -name "$pattern" \
    -exec sh -c '[ ! -e "$(dirname \"{}\")/.hide" ] && dirname "{}"' \; \
    | grep -v -E 'Main|Default' \
    | sort -u \
    | sed 's|\./||g' \
    | awk '{print NR ". " $0}' \
    | sed 's/lib\/Commands\///g'
}

# -----------------------------
# Variáveis de entrada
# -----------------------------
search="${1:-}"   # Termo de busca principal (obrigatório)
menu_template="${2:-}"  # Template do menu base (opcional)
prefix="${3:-}"   # Prefixo para os resultados (opcional)

# -----------------------------
# Lógica principal
# -----------------------------
# Realiza busca inicial com base no termo fornecido
result=$(perform_search "*$search*")

# Se nenhum resultado for encontrado, realiza uma busca genérica
if [ -z "$result" ]; then
  result=$(perform_search "*.*")
  search="General"
fi

# -----------------------------
# Saída com base no tipo de filtro
# -----------------------------
case "$1" in
  "array")
    # Retorna os resultados formatados como um array JSON
    result=$(echo "$result" \
      | sed 's/^[0-9]*\. //g' \
      | shuf \
      | head -n "${2:-99999}" \
      | sed 's/^/"/' \
      | sed 's/$/"/' \
      | tr '\n' ',' \
      | sed 's/,$//')

    echo -e "[$result]"
    ;;

  *)
    # Retorna os resultados formatados como um menu
    menu_output="${menu_template//#search/$search}"
    echo -e "$menu_output\n\n🌟 Prefix: *$prefix*\n📚 E.g: \`${prefix}Games --help\`\n\n$result"
    ;;
esac
