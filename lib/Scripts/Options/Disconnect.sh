#!/usr/bin/env bash

# Define o diretório das sessões do WhatsApp Web
sessions_dir="lib/Sessions"

# Remove o arquivo readme para evitar duplicação
rm -rf "lib/Sessions/readme.txt"

# Verifica se há alguma pasta dentro de lib/Sessions
if [ "$(ls -A "$sessions_dir")" ]; then
    # Exibe mensagem indicando que há sessões conectadas
    printf "[ÍRIS] → Possuo sessões do WhatsApp Web conectadas. Listarei as sessões uma a uma, diga qual quer desconectar.\n"

    # Lista todas as pastas dentro de lib/Sessions
    session_folders=("$sessions_dir"/*)

    # Itera sobre as sessões disponíveis
    for ((i=0; i<${#session_folders[@]}; i++)); do
        printf "Você deseja apagar a sessão %s? (1 ou 2)\n" "$i"

        # Pergunta ao usuário se deseja apagar a sessão
        select opt in "Sim (y)" "Não (n)"; do
            case $opt in
                # Realiza a desconexão da sessão
                "Sim (y)")
                    rm -rf "${session_folders[$i]}"
                    printf "[DONE] - Sessão %s do WhatsApp Web desconectada!\n" "$i"
                    break
                ;;

                # Ignora essa sessão
                "Não (n)")
                    printf "[ÍRIS] → Você optou por não apagar a sessão %s.\n" "$i"
                    break
                ;;

                # Aguarda respostas válidas
                *)
                    printf "Opção inválida, escolha entre 1 e 2.\n"
                ;;
            esac
        done
    done
else
    # Mensagem indicando que não há sessões conectadas
    printf "[ÍRIS | DONE] → Você ainda não possui sessões conectadas.\n"
fi

# Retorna sucesso em qualquer caso
exit 0
