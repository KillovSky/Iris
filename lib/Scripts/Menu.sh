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

# Faz a base do menu
menuBase=$(echo "$2" | sed "s/#search/$search/g");

# Exibe o resultado
echo -e "$menuBase\n\n$result";