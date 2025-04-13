#!/usr/bin/env bash

# Este script verifica se os módulos estão instalados, 
# Atualiza se estão, ou oferece a opção de instalar

# Se os módulos estão instalados, inicia a função do NPM
if [ -d "node_modules" ]; then
    printf "\n[ÍRIS] → Função iniciada, output do NPM -> \n"

    # Executa a atualização e verifica se ocorreram erros
    if npm update; then
        # Desatualiza o Sharp se quiser
        printf "[ÍRIS] → Deseja fazer downgrade do módulo sharp (Windows é obrigatório!)?\n\n"
        select dsp in "Sim (y)" "Não (n)"; do
            case $dsp in
                # Executa o script de downgrade
                "Sim (y)")
                    # Avisa para ignorar os WARNs
                    printf "[ÍRIS] → Avisos de 'WARN' NÃO SÃO ERROS neste caso, não se preocupe com eles, se tudo correr bem avisarei.\n\n"

                    # Se foi um sucesso vai dizer, se não, deu erro
                    if npm i sharp@0.30.7; then
                        # Desfaz o downgrade do sharp apenas no arquivo package.json, para evitar erros na próxima update
                        sed -i 's/"sharp": "\^0\.30\.7",/"sharp": "\^0\.32\.2",/' package.json
                        printf "[ÍRIS | DONE] → Instalação concluída com sucesso! <3\n"
                        exit 0
                    else
                        printf "[ÍRIS | ERRO] → Ocorreram erros durante a instalação. Verifique o console e procure o suporte.\n"
                        exit 1
                    fi
                ;;

                # Sai sem erros
                "Não (n)")
                    printf "[ÍRIS | DONE] → Ok, obrigado por utilizar este programa, módulos atualizados! <3\n"
                    exit 0
                ;;

                # Continua até dar uma opção válida
                *)
                    printf "Opção inválida, escolha entre 1 e 2.\n"
                ;;
            esac
        done
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