#!/usr/bin/env bash

# Função para verificar se o comando pm2 está instalado

# Verifica se o comando pm2 está instalado
if command -v pm2 &> /dev/null; then
    printf "[ÍRIS] → O comando pm2 já está instalado.\n"
    exit 0
else
    # Se o comando pm2 não está instalado, oferece a opção de instalar
    printf "[ÍRIS] → O comando pm2 não está instalado. Deseja instalá-lo (1 ou 2)?\n\n"
    select opt in "Sim (1)" "Não (2)"; do
        case $opt in
            # Chama o script de instalação do pm2
            "Sim (1)")
                npm i -g pm2 && printf "[ÍRIS] → pm2 instalado com sucesso.\n"
                exit 0
            ;;

            # Se o usuário escolher cancelar, exibe uma mensagem e sai
            "Não (2)")
                printf "[ÍRIS] → Foi um prazer, volte sempre!\n"
                exit 1
            ;;

            # Se a opção não for válida, mostra mensagem de erro e repete o menu
            *)
                printf "Opção inválida, escolha entre 1 ou 2.\n"
            ;;
        esac
    done
fi
