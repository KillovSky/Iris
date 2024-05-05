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
    if npm i; then
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
                    printf "[ÍRIS | DONE] → Ok, obrigado por utilizar este programa, módulos instalados! <3\n"
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
        printf "[ÍRIS | ERRO] → Ocorreram erros durante a instalação. Verifique o console e procure o suporte.\n"
        exit 1
    fi
fi
