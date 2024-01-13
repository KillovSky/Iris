#!/bin/bash
#
# Script para verificar se uma palavra/URL existe exatamente em um arquivo.
#
# Utilização: ./Hosts.sh <palavra/URL> <arquivo>
#   - <palavra/URL>: A palavra/URL a ser procurada no arquivo.
#   - <arquivo>: O caminho para o arquivo onde a palavra/URL será procurada.
#
# Saída:
#   - Se a palavra/URL existe exatamente no arquivo, imprime "1" (verdadeiro).
#   - Se a palavra/URL não existe ou existe de forma parcial, imprime "0" (falso).
#

# Verifica se o número de argumentos é correto
if [ "$#" -ne 2 ]; then
    # Printa a forma de uso
    echo "Uso: $0 <palavra/URL> <arquivo>"

    # Sai com erro
    exit 1
fi

# Verifica se a palavra existe exatamente no arquivo
if grep -qix "$1" "$2"; then
    # Se existe, imprime 1 (true)
    echo "1"
else
    # Se não existe, imprime 0 (false)
    echo "0"
fi
