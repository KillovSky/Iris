#!/usr/bin/env bash

# Obtém a versão mais recente do repositório remoto
latestVersion=$(curl https://raw.githubusercontent.com/KillovSky/iris/main/package.json | grep "version" | sed 's/.*": "//g' | sed 's/\",//g')

# Obtém a versão atual do sistema
hisVersion=$(grep "version" package.json | sed 's/.*": "//g' | sed 's/\",//g')

# Verifica se a versão local é a mesma que a versão remota
if [[ "$latestVersion" == "$hisVersion" ]]; then
    printf "\n[ÍRIS] → A versão da GitHub já é a mesma versão que você está usando, deseja continuar?\n\n"
else
    printf "\n[ÍRIS] → Existe uma atualização disponível para você, deseja continuar?\n\n"
fi

# Pergunta ao usuário se deseja continuar
select choice in "Sim" "Não"; do
    case $choice in
        "Sim")
            # Gera um nome aleatório para a pasta de backup
            folderName="Backup-#-$(echo $RANDOM | base64 | head -c 20; echo)-#-$(date -I)"

            # Mostra informações sobre o backup
            printf "\n[ÍRIS] → Esta função criará um backup das pastas oficiais da Íris antes de atualizar. Suas edições não serão perdidas, mas observe que não posso incluir códigos JavaScript de volta, apenas configurações em JSON. Portanto, será necessário reinserir esses códigos manualmente.\n\nCertifique-se de não estar executando a Íris ou ter algum terminal aberto na pasta durante este processo ou poderá haver erros catastróficos!\n\nNota:\n1. Se uma das pastas oficiais não estiver incluída no backup, o conteúdo dela será SOBREPOSTO.\n2. Seus arquivos de código customizados estarão na pasta de backup.\n\nPor favor, esteja ciente:\n3. Não serão restauradas as configurações dos arquivos 'utils.json'; apenas os arquivos da pasta 'lib/Databases/Configurations' serão restaurados. Se você fez edições em arquivos JSON na pasta de funções, será necessário editar manualmente novamente.\n\nDeseja continuar (1, 2 ou 3)?\n"

            # Pergunta ao usuário sobre o backup
            select backupOption in "Sim (y)" "Não (n)" "Download ZIP (z)"; do
                case $backupOption in
                    "Sim (y)")
                        # Se o não arquivo existe
                        if ! [ -f "main.zip" ]; then
                            # Baixa a atualização do repositório remoto
                            curl -LO -# https://github.com/KillovSky/iris/archive/refs/heads/main.zip
                        else
                            # Avisa que vai atualizar
                            printf "\n[ÍRIS] → O arquivo 'main.zip' já existe, estou utilizando ele...\n"
                        fi

                        # Verifica se o download foi concluído com sucesso
                        if [[ -f "main.zip" ]]; then
                            # Cria a pasta de backup
                            mkdir "${folderName}"

                            # Move a pasta lib
                            find lib -mindepth 1 -maxdepth 1 ! -name "Scripts" -type d -exec mv {} "${folderName}"/lib/ \;

                            # Move os arquivos dentro de lib/Scripts, excluindo Reinstall.sh e Toolbox.sh
                            find lib/Scripts -mindepth 1 -maxdepth 1 ! -name "Reinstall.sh" ! -name "Toolbox.sh" -exec mkdir -p "${folderName}/lib/Scripts/" \; -exec mv {} "${folderName}/lib/Scripts/" \;

                            # Move os arquivos para a pasta de backup
                            find . -mindepth 1 -maxdepth 1 ! -name "${folderName}" ! -name 'lib' ! -name 'node_modules' ! -name 'main.zip' -exec mv {} "${folderName}"/ \;

                            # Extrai o conteúdo do arquivo ZIP
                            unzip -o main.zip > /dev/null

                            # Avisa que vai atualizar
                            printf "\n[ÍRIS] → Movendo códigos atualizados...\n"

                            # Move os arquivos e pastas, excluindo Toolbox.sh e Reinstall.sh
                            find Iris-main/lib/Scripts -mindepth 1 -maxdepth 1 ! -name "Reinstall.sh" ! -name "Toolbox.sh" -exec mkdir -p "./lib/Scripts/" \; -exec mv {} ./lib/Scripts/ \;

                            # Move o resto da pasta lib, exceto scripts
                            find Iris-main/lib -mindepth 1 -maxdepth 1 ! -name 'Scripts' -exec mv {} ./lib/ \;

                            # Move tudo de Iris-main para o diretório atual, excluindo a pasta lib
                            find Iris-main -mindepth 1 -maxdepth 1 ! -name "lib" -exec mv {} . \;

                            # Move o cache dos zip para o backup
                            mv main.zip "${folderName}"
                            mv Iris-main "${folderName}"

                            # Move as sessões e database de volta
                            find "${folderName}/lib/Sessions" -mindepth 1 -maxdepth 1 -type d -exec mv -t ./lib/Sessions {} +
                            mv "${folderName}/lib/Databases/Informations/users.db" ./lib/Databases/Informations

                            # Avisa que atualizou
                            printf "\n[ÍRIS] → Fui atualizada com sucesso, prosseguindo para etapas de configuração JSON...\n"

                            # Pergunta ao usuário se deseja fazer a auto-configuração dos arquivos da pasta 'Settings'
                            printf "\n[ÍRIS] → Deseja fazer a auto-configuração dos arquivos da pasta 'Configurations' usando os antigos arquivos?\n\nValores que não existem na versão baixada da Íris serão ignorados.\n\nEsta opção vai configurar as API's e demais configurações automaticamente para você, desde que você tenha configurado anteriormente, antes da atualização.\n\n"

                            # Pergunta se quer
                            select autoConfigOption in "Sim (y)" "Não (n)"; do
                                case $autoConfigOption in
                                    # Executa a auto-configuração dos arquivos usando os antigos valores
                                    "Sim (y)")
                                        printf "\n[ÍRIS] → Essa função será executada pelo NodeJS, avisarei quando terminar!\n\n"

                                        # Roda o shell_extra para cada arquivo na pasta de Configurações
                                        for configFile in "${folderName}/lib/Databases/Configurations"/*; do
                                            # Obtém o nome do arquivo (sem caminho)
                                            fileName=$(basename "$configFile")

                                            # Verifica se o arquivo não é symlinks.json, pois esse é sensivel
                                            if [ "$fileName" != "symlinks.json" ]; then
                                                # Executa o comando apenas para arquivos diferentes de symlinks.json
                                                node lib/Scripts/jsonFixer.js "$configFile" "./lib/Databases/Configurations/$fileName"
                                            fi
                                        done

                                        # Avisa terminar
                                        printf "\n[ÍRIS] → Terminado, suas configurações foram importadas.\n"
                                        break
                                    ;;

                                    # Não configura automatico
                                    "Não (n)")
                                        printf "\n[ÍRIS] → Okay, irei pular a configuração dos arquivos.\n"
                                        break
                                    ;;
                                esac
                            done

                            # Pergunta ao usuário se deseja instalar/atualizar os módulos
                            printf "\n[ÍRIS] → Deseja atualizar os módulos e instalar (1 ou 2)?\n\n"
                            select startOption in "Sim (y)" "Não (n)"; do
                                case $startOption in
                                    # Executa o programa de atualização
                                    "Sim (y)")
                                        bash ./lib/Scripts/ModuleUpdate.sh
                                        break
                                    ;;

                                    # Ignora
                                    "Não (n)")
                                        printf "\n[ÍRIS] → Entendido, vamos para a próxima pergunta!\n"
                                        break
                                    ;;
                                esac
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

                            # Sai sem erros
                            exit 0
                        else
                            # Exibe mensagem de erro se houver problemas durante o download e sai com erro code 1
                            printf "\n[ÍRIS] → Algum erro aconteceu durante o download da atualização.\n"
                            exit 1
                        fi
                    ;;

                    # Cancela
                    "Não (n)")
                        printf "[ÍRIS] → Ok, não irei ter minha querida atualização...\n"
                        exit 0
                    ;;

                    # Baixa apenas o ZIP
                    "Download ZIP (z)")
                        # Baixa apenas o arquivo ZIP
                        curl -LO -# https://github.com/KillovSky/iris/archive/refs/heads/main.zip

                        # Verifica se o download foi concluído com sucesso
                        if [[ -f "main.zip" ]]; then
                            printf "[ÍRIS] → Minha atualização foi baixada com sucesso! Você pode abrir clicando no arquivo 'main.zip'.\n"
                            exit 0
                        else
                            # Se falhou avisa e sai com erro 1
                            printf "[ÍRIS] → Houve algum erro durante o download da atualização.\n"
                            exit 1
                        fi
                    ;;
                esac
            done
        ;;

        # Sai do atualizador
        "Não")
            printf "[ÍRIS] → Você decidiu cancelar a atualização, se quiser algo mais, basta rodar novamente."
            exit 0
        ;;
    esac
done
