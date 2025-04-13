#!/usr/bin/env bash

# Continua enquanto ele não digitar um comando
while true; do
    read -rp "[ÍRIS] - Digite um comando customizado (ou 'cancel' para encerrar): " customCommand

    # Verifica se o comando é 'cancel' para encerrar o loop
    if [ "$customCommand" == "cancel" ]; then
        printf "[ÍRIS] - Encerrando... Até mais!"
        exit 0
    fi

    # Verifica se o comando não está vazio
    if [ -z "$customCommand" ]; then
        printf "\n[ÍRIS] - Você não forneceu nenhum comando, tente novamente.\n"
    else
        # Executa o comando usando eval
        eval "$customCommand"

        # Sai
        exit 0
    fi
done
