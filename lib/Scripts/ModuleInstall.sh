#!/usr/bin/env bash

# Este script verifica se os módulos estão instalados,
# Atualiza se estão, ou oferece a opção de instalar

# Verifica se os módulos estão instalados
if [ -d "node_modules" ]; then
    printf "[ÍRIS] → Você já instalou, deseja atualizar os módulos? (1 ou 2)?\n\n"
    select opt in "Sim (y)" "Não (n)"; do
        case $opt in
            # Executa o script de atualização
            "Sim (y)")
                bash ./lib/Scripts/Toolbox.sh 9
                exit 0
            ;;

            # Sai sem erros
            "Não (n)")
                printf "[ÍRIS | DONE] → Ok, obrigado por utilizar este programa! <3\n"
                exit 0
            ;;

            # Continua até dar uma opção válida
            *)
                printf "Opção inválida, escolha entre 1 e 2.\n"
            ;;
        esac
    done
else
    # Se os módulos não estão instalados, realiza a instalação inicial
    printf "[ÍRIS] → Instalando, abaixo está a output do NPM:\n"

    # Executa a instalação e verifica se ocorreram erros
    npm i
    if [ $? -eq 0 ]; then
        printf "[ÍRIS | DONE] → Instalação concluída com sucesso! <3\n"
        exit 0
    else
        printf "[ÍRIS | ERRO] → Ocorreram erros durante a instalação. Verifique o console e procure o suporte.\n"
        exit 1
    fi
fi
