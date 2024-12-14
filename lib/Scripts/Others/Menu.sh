#!/usr/bin/env bash

# Define o que buscar
search="$1";

# Armazena o resultado do find em uma variável
result=$(find ./lib/Commands/* -mindepth 1 -maxdepth 1 -type d \( -name 'Main' -o -name 'Default' \) -prune -o -type f -name "*$search*" -exec dirname {} \; | grep -v -E 'Main|Default' | sort -u | sed 's/.\///g' | awk '{print NR ". " $0}' | sed 's/liCommand//g');

# Verifica se a variável $result está vazia
if [ -z "$result" ]; then
    # Se estiver vazia, execute o comando de busca alternativo
    result=$(find ./lib/Commands/* -mindepth 1 -maxdepth 1 -type d \( -name 'Main' -o -name 'Default' \) -prune -o -type f -name "*.*" -exec dirname {} \; | grep -v -E 'Main|Default' | sort -u | sed 's/.\///g' | awk '{print NR ". " $0}' | sed 's/liCommand//g');

    # Define o search novo
    search="General";
fi

# Cases para diversos tipos de filtragem
case "$1" in
    # Caso queira alguns aleatórios ou todos em formato array
    "array")
        # Adquire os comandos e aleatoriza sua posição
        result=$(echo "$result" | sed 's/[0-9]\. //g' | sed 's/^[0-9]//g' | shuf | shuf -n "$(if [[ "$2" =~ ^[0-9]+$ ]]; then echo "$2"; else echo 99999; fi)");

        # Converte em array
        result=$(echo "$result" | sed 's/[0-9]\. //g' | sed "s/^/\"/g" | sed "s/$/\"/g" | tr '\n' ',' | sed 's/^,//g' | sed 's/,$//g' | tr '[:upper:]' '[:lower:]');

        # Printa os comandos em array
        echo -e "[$result]";
    ;;

    # Padrão, constrói o menu
    *)
        # Faz a base do menu
        menuBase="${2//#search/$search}";

        # Printa o resultado final
        echo -e "$menuBase\n\n🌟 Prefix: *$3*\n\n$result";
    ;;

# Aqui é onde se fecha o script, pode ser fechado usando a palavra ao contrario, "case -> esac", "if" -> "fi".
esac