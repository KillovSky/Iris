#!/usr/bin/env bash

# Este script permite a edição de JSONs, sejam da Íris ou não

# Verifica se os módulos estão instalados
if [ ! -d "lib" ]; then
    read -rp "[ÍRIS] → Parece que você não possui uma cópia da Íris. Deseja realizar a instalação? 1 (y), 2 (n): " opt
    case $opt in
        1)
            bash ./lib/Scripts/Toolbox.sh 15
            ;;
        2)
            printf "[ÍRIS] → Ok, obrigado por utilizar este programa! <3\n"
            exit 0
            ;;
        *)
            printf "Opção inválida, escolha entre 1 e 2.\n"
            ;;
    esac
fi

# Printa o aviso
printf "[ÍRIS] → Esta função será executada pelo Python.\nQual arquivo JSON deseja editar (1, 2 ou 3)?\n\n"

# Pede para escolher qual arquivo editar
select jsonFile in "APIS" "Config" "Outros" "Nenhum"; do
    case $jsonFile in
        # APIs
        "APIS")
            fileToEdit="lib/Databases/Configurations/APIS.json"
        ;;

        # Configuração
        "Config")
            fileToEdit="lib/Databases/Configurations/config.json"
        ;;

        # Outros arquivos
        "Outros")
            read -rp "[ÍRIS] → Digite o caminho completo do arquivo, incluindo '.json': " fileToEdit
        ;;

        # Cancelar operação
        "Nenhum")
            printf "[ÍRIS] → Okay, chega de editar JSONs!\n"
            break
        ;;

        # Continua até dar uma opção válida
        *)
            printf "\nOpção inválida, escolha entre 1, 2, 3 ou 4.\n"
            continue
        ;;
    esac

    # Verifica se o arquivo escolhido existe
    if [ -f "$fileToEdit" ]; then
        # Executa o script Python para edição do JSON
        python lib/Scripts/jsoneditor.py "$fileToEdit"
        break
    else
        printf "[ÍRIS] → O arquivo '$fileToEdit' não existe. Faça uma reinstalação manual.\n"
        exit 1
    fi
done

# Pergunta ao usuário se deseja iniciar a Íris
printf "\n[ÍRIS] → Deseja iniciar a Íris agora (1 ou 2)?\n\n"
select startOption in "Sim (y)" "Não (n)"; do
    case $startOption in
        # Executa a inicialização
        "Sim (y)")
            bash ./lib/Scripts/Start.sh normal
            break
        ;;

        # Ignora
        "Não (n)")
            printf "\n[ÍRIS] → Entendido, obrigada por utilizar meu menu de opções!\n"
            break
        ;;
    esac
done
