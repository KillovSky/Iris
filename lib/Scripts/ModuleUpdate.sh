#!/usr/bin/env bash

# Este script verifica se os módulos estão instalados, 
# Atualiza se estão, ou oferece a opção de instalar

# Se os módulos estão instalados, inicia a função do NPM
if [ -d "node_modules" ]; then
    printf "\n[ÍRIS] → Função iniciada, output do NPM -> \n"

    # Executa a atualização e verifica se ocorreram erros
    if npm update; then
        printf "[ÍRIS | DONE] → Atualização dos módulos concluída com sucesso! <3\n"
        exit 0
    else
        printf "[ÍRIS | ERRO] → Ocorreram erros durante a atualização. Verifique o console e procure o suporte.\n"
        exit 1
    fi
else
    # Se os módulos não estão instalados, oferece a opção de instalar
    printf "[ÍRIS] → Você não fez a instalação, deseja instalar os módulos (1 ou 2)?\n\n"
    select opt in "Sim (y)" "Não (n)"; do
        case $opt in
            # Chama o script de instalação
            "Sim (y)")
                bash ./lib/Scripts/Toolbox.sh 10
                exit 0
            ;;

            # Se o usuário escolher cancelar, exibe uma mensagem e sai do script
            "Não (n)")
                printf "[ÍRIS | DONE] → Ok, obrigado por utilizar este programa! <3\n"
                exit 0
            ;;

            # Se a opção não for válida, mostra mensagem de erro e repete o menu
            *)
                printf "Opção inválida, escolha entre 1 ou 2.\n"
            ;;
        esac
    done
fi