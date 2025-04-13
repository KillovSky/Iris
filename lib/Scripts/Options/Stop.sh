#!/usr/bin/env bash

# Este script encerra todos os processos Node.js ou somente a Íris

if [ "$1" == "pm2" ]; then
    # Verifica se o processo foi encerrado com sucesso
    if pm2 stop iris; then
        printf "\n[ÍRIS] → Encerrei minha execução usando PM2.\n"
        exit 0
    else
        exit 1
    fi
else
    case "$(uname -s)" in
        # Linux e MacOS
        Linux*|Darwin*)
            # Encerra o processo Íris no Linux e MacOS
            killall node
            pkill -f 'node'
        ;;

        # Windows
        CYGWIN*|MINGW32*|MSYS*|MINGW*)
            # Encerra o processo Íris no Windows
            taskkill //F //IM node.exe
        ;;

        # Outros
        *)
            printf "[ÍRIS] → Seu sistema operacional não é suportado nessa função.\n"
            exit 1
        ;;
    esac

    # Verifica se o processo foi encerrado com sucesso
    # shellcheck disable=SC2181
    if [ $? -eq 0 ]; then
        printf "\n[ÍRIS] → Encerrei minha execução.\n"
        exit 0
    else
        exit 1
    fi
fi
