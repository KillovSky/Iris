#!/usr/bin/env bash

# Este script inicia a Íris se os módulos estiverem instalados
# Caso contrário, oferece a opção de instalar

# Verifica se os módulos estão instalados
if [ -d "node_modules" ]; then
    # Verifica se o argumento é "hide" e executa em segundo plano
    if [ "$1" == "hide" ]; then
        printf "\n[ÍRIS] → Função iniciada em modo oculto.\n"
        npm start > /dev/null 2>&1 &
        exit 0
    fi

    # Se o argumento for "pm2hide", executa com pm2 sem monit
    if [ "$1" == "pm2hide" ]; then
        # Chama o script PM2Install.sh
        bash ./lib/Scripts/PM2Install.sh

        # Verifica o código de retorno do PM2Install.sh
        if [ $? -eq 0 ]; then
            pm2 start ./lib/Initialize/index.js --name iris --cron-restart="0 */6 * * *" > /dev/null 2>&1 &
            printf "\n[ÍRIS] → Função iniciada com PM2 em modo oculto.\n"
            exit 0
        else
            exit 1
        fi
    fi

    # Se o argumento for "pm2show", executa com pm2 com monit
    if [ "$1" == "pm2show" ]; then
        # Chama o script PM2Install.sh
        bash ./lib/Scripts/PM2Install.sh

        # Verifica o código de retorno do PM2Install.sh
        if [ $? -eq 0 ]; then
            pm2 start ./lib/Initialize/index.js --name iris --cron-restart="0 */6 * * *" && pm2 monit
            printf "\n[ÍRIS] → Função iniciada com PM2 e monitoramento.\n"
            exit 0
        else
            exit 1
        fi
    fi

    # Se o argumento for "autoreboot", executa em um loop com reinicialização automática
    if [ "$1" == "autoreboot" ]; then
        while : ; do
            printf "[ÍRIS] → Iniciando Íris, caso o processo sofra falhas, um reinicio automático será feito.\n"
            npm start
            sleep 1
        done
    fi

    # Se o argumento for "normal", inicia a função do NPM normalmente
    if [ "$1" == "normal" ]; then
        printf "\n[ÍRIS] → Função iniciada, output do NPM -> \n"
        npm start
        exit 0
    fi
else
    # Se os módulos não estão instalados, oferece a opção de instalar
    printf "[ÍRIS] → Você não fez a instalação, deseja instalar os módulos (1 ou 2)?\n\n"
    select opt in "Sim (y)" "Não (n)"; do
        case $opt in
            # Chama o script de instalação e, depois que terminar, inicia a Íris
            "Sim (y)")
                bash ./lib/Scripts/Toolbox.sh 10
                exit 0
            ;;

            # Se o usuário escolher cancelar, exibe uma mensagem e sai do script
            "Não (n)")
                printf "[ÍRIS] → Foi um prazer, volte sempre!\n"
                exit 0
            ;;
            
            # Se a opção não for válida, mostra mensagem de erro e repete o menu
            *)
                printf "Opção inválida, escolha entre 1 ou 2.\n"
            ;;
        esac
    done
fi
