#!/usr/bin/env bash

######################################################################################
#
#	MIT License
#
#	Copyright (c) 2021 KillovSky - Lucas R.
#
#	Permission is hereby granted, free of charge, to any person obtaining a copy
#	of this software and associated documentation files (the "Software"), to deal
#	in the Software without restriction, including without limitation the rights
#	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
#	copies of the Software, and to permit persons to whom the Software is
#	furnished to do so, subject to the following conditions:
#
#	The above copyright notice and this permission notice shall be included in all
#	copies or substantial portions of the Software.
#
#	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
#	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
#	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
#	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
#	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
#	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
#	SOFTWARE.
#
######################################################################################

######	######	######	######	######	######	######	######	######	######	#
#	 Construído por KillovSky para utilização no Projeto Íris					#
#	   Página oficial -> https://github.com/KillovSky/Iris						#
#	 Como faz parte do programa Íris, isso utiliza a licença MIT também			#
# 				Não remova os créditos e divirta-se!							#
######	######	######	######	######	######	######	######	######	######	#

# Opções de inicialização
message="[ÍRIS] → Funções suportadas por mim:\n\nParar a Íris = 1\n-> (Apenas se usou o 3)\n\nNormal Start = 2\n-> (Inicia normalmente) \n\nTXT Background Start = 3\n-> (Roda de fundo SEM ANTI CRASH e envia os logs para o 'BG_Start.log', não recomendado [EXPERTS]!)\n\nPM2 Background Start = 4\n-> (PM2 Anti Crash, roda de fundo, auto-reboot a cada 6 horas)\n\nPM2 Start = 5\n-> (PM2 Anti Crash, exibe na tela, auto-reboot a cada 6 horas)\n\nParar o PM2 = 6\n-> (Apenas se usou o 4 ou 5)\n\nAnti-Crash Sem PM2 = 7\n-> (Anti Crash sem PM2)\n\nIncialização customizada = 8\n-> (Digite o comando de inicialização)\n\nAtualizar os módulos = 9\n-> (Faz a atualização da 'node_modules' da Íris)\n\nInstalar os módulos = 10\n-> (Faz a instalação dos módulos, essencial na primeira vez)\n\nLimpar a Íris = 11\n-> (Limpa a Íris - incluso Backups, mantém o mais recente)\n\nDeletar sessão do WhatsApp Web = 12\n-> (Desconecta do WhatsApp Web)\n\nAtualizar/Reinstalar a Íris = 13\n-> (Refaz os passos de instalação)\n\nConfigurar os JSON's = 14\n-> (Configure as API's sem abrir os arquivos)\n\nInstalar PM2 = 15\n-> (Instala o PM2 no PC)\n\nCorrigir Python3 = 16\n-> (Tenta corrigir o erro de Python3)\n\nInstalar programas = 17\n-> (Instala todas as ferramentas necessárias)\n\nSair = 18\n-> (Sai do Toolkit)\n\n"

# Checa se o local já é a pasta da Íris e faz uma variável para impedir adicionar o bash muitas vezes
BashPATHexist=false
isCorrect=$(find .. -path ../node_modules -prune -o -name 'package.json' -o -name 'lib' | grep -Ew "lib|package.json")
if [[ "$isCorrect" == *"lib"* && "$isCorrect" == *"package.json"* ]]; then

	# Script que faz a execução/outros da Íris
	array=("1" "2" "3" "4" "5" "6" "7" "8" "9" "10" "11" "12" "13" "14" "15" "16" "17" "18")
	while : ; do
		if [ "$#" -eq 0 ] ; then
			printf "%s\n" "${message}"
			break
		else
			for cmd in "${array[@]}" ; do
				if [[ "${cmd}" == "$1" ]] ; then
					case "$cmd" in

						# Cancela a execução do script caso a pessoa rode o modo hide.
						"1")
							printf "\n[ÍRIS | DONE] → Função executada, output (se existir) -> "
							case "$(uname -s)" in
								Linux*|Darwin*)
									killall node
									exit
								;;
								*)
									taskkill /f /im node.exe
									exit
								;;
							esac
						;;

						# Executa normalmente, mostrando os reinícios, logs e mensagens.
						"2")
							if [ -d "node_modules" ]; then
								printf "\n[ÍRIS] → Função iniciada, output do NPM -> \n"
								npm start
								exit
							else
								printf "[ÍRIS] → Você não fez a instalação, deseja instalar os módulos?\n\n"
								select opt in "Instalar" "Cancelar"; do
									case $opt in
										"Instalar")
											bash tools.sh 15
											sleep 60
											npm start
											exit
										;;
										"Cancelar")
											printf "[ÍRIS] → Foi um prazer, volte sempre!\n"
											exit
										;;
									esac
								done
							fi
							exit
						;;

						# Modo Hide, inicia mas envia os logs para o arquivo BG_Start.log.
						"3")
							if [ -d "node_modules" ]; then
								printf "\n[ÍRIS] → Função iniciada, output (se existir, deve cair no 'BG_Start.log') -> "
								npm start &>BG_Start.log &
								exit
							else
								printf "[ÍRIS] → Você não fez a instalação, deseja instalar os módulos?\n\n"
								select opt in "Instalar" "Cancelar"; do
									case $opt in
										"Instalar")
											bash tools.sh 15
											sleep 60
											npm start &>BG_Start.log &
											exit
										;;
										"Cancelar")
											printf "[ÍRIS] → Foi um prazer, volte sempre!\n"
											exit
										;;
									esac
								done
							fi
							exit
						;;

						# Executa em pm2 de fundo.
						"4")
							if ! [ -x "$(command -v pm2)" ]; then
								select opt in "Instalar PM2" "Sair"; do
									case $opt in
										"Instalar PM2")
											bash tools.sh 15
											sleep 60
											exit
										;;
										"Sair")
											printf "[ÍRIS] → Foi um prazer, volte sempre!\n"
											exit
										;;
									esac
								done
							fi
							printf "\n[ÍRIS] → Função executada, output (se existir) -> "
							pm2 start start.js --name iris --cron-restart="0 */6 * * *"
							exit
						;;

						# Executa em pm2, mostrando os reinícios, logs e mensagens.
						"5")
							if ! [ -x "$(command -v pm2)" ]; then
								select opt in "Instalar PM2" "Sair"; do
									case $opt in
										"Instalar PM2")
											bash tools.sh 15
											sleep 60
											exit
										;;
										"Sair")
											printf "[ÍRIS] → Foi um prazer, volte sempre!\n"
											exit
										;;
									esac
								done
							fi
							printf "\n[ÍRIS] → Função executada, output (se existir) -> "
							pm2 start start.js --name iris --cron-restart="0 */6 * * *"
							sleep 10
							pm2 monit
							exit
						;;

						# Desliga a Íris desligando o PM2.
						"6")
							if ! [ -x "$(command -v pm2)" ]; then
								select opt in "Instalar PM2" "Sair"; do
									case $opt in
										"Instalar PM2")
											bash tools.sh 15
											sleep 60
											exit
										;;
										"Sair")
											printf "[ÍRIS] → Foi um prazer, volte sempre!\n"
											exit
										;;
									esac
								done
							fi
							printf "\n[ÍRIS] → Função executada, output (se existir) -> "
							pm2 kill
							exit
						;;

						# Executa o método de execução feito por Gabriel Dias, a diferença é que não se usa PM2.
						# Todos os créditos disso a ele -> https://github.com/gabrieldiaspereira | https://github.com/KillovSky/iris/pull/531
						"7")
							printf "\n[ÍRIS] → Função executada, output (se existir) -> "
							while : ; do
								printf "[ÍRIS] → Iniciando Íris, caso o processo sofra falhas, um reinicio automático será feito.\n"
								npm start
								sleep 1
							done
							exit
						;;

						# Executa um método customizado ou qualquer coisa jogada aqui
						"8")
							read -r customMode
							printf "\n[ÍRIS] → Função iniciada, output (se existir) -> "
							$customMode
							exit
						;;

						# Atualiza os módulos
						"9")
							if [ -d "node_modules" ]; then
								printf "\n[ÍRIS] → Função iniciada, output do NPM -> \n"
								npm update
							else
								printf "[ÍRIS] → Você não fez a instalação, deseja instalar os módulos?\n\n"
								select npi in "Sim" "Não"; do
									case $npi in
										"Sim")
											bash tools.sh 10
											exit
										;;
										"Não")
											printf "[ÍRIS | DONE] → Ok, obrigado por utilizar este programa! <3"
											exit
										;;
									esac
								done
							fi
							exit
						;;

						# Faz a instalação dos módulos
						"10")
							if [ -d "node_modules" ]; then
								printf "[ÍRIS] → Os módulos já existem, deseja tentar atualizar?\n\n"
								select upx in "Sim" "Não"; do
									case $upx in
										"Sim")
											bash tools.sh 9
											sleep 60
											exit
										;;
										"Sair")
											printf "[ÍRIS | DONE] → Foi um prazer, volte sempre!\n"
											exit
										;;
									esac
								done
							fi
							if ! [ -x "$(command -v pm2)" ]; then
								select opt in "Instalar PM2" "Sair"; do
									case $opt in
										"Instalar PM2")
											bash tools.sh 15
											sleep 60
											exit
										;;
										"Sair")
											printf "[ÍRIS | DONE] → Foi um prazer, volte sempre!\n"
											exit
										;;
									esac
								done
							fi
							printf "\n[DONE] - Todas as funções requisitadas foram executadas!"
							exit
						;;

						# Limpa a Íris, não apaga a sessão se não for MD
						"11")
							isMultiple=$(grep 'Multi_Devices' ./lib/config/Settings/session.json | sed 's/.*\": //g' | sed 's/,$//g')
							lastBackup=$(find ./lib/config/Backups -type f -printf "%f\n" | sort -r | head -n 1)
							backupsLength=$(find ./lib/config/Backups -type f | wc -l)
							if [[ -n "$lastBackup" && $backupsLength -gt 1 ]]; then
								echo "Limpando a pasta de backups..."
								mv "./lib/config/Backups/${lastBackup}" "./lib/config/Backups/Latest_Backup.zip"
								rm ./lib/config/Backups/[0-9]*
								mv "./lib/config/Backups/Latest_Backup.zip" "./lib/config/Backups/${lastBackup}"
							fi
							if [ "$isMultiple" == "false" ]; then
								rm -r lib/session/*/
							else
								echo "Usando Multi_Devices, ignorando limpeza do Chrome..."
							fi
							rm -rf package-lock.json
							printf "\n[DONE] - Limpeza concluída!"
							exit
						;;

						# Apaga a sessão da Íris
						"12")
							if [[ -d "lib/session" ]]; then
								rm -rf lib/session
								printf "\n[DONE] - Sessão do WhatsApp Web desconectada!"
							else
								printf "\n[ÍRIS | DONE] → Você ainda não possui uma sessão conectada."
							fi
							exit
						;;

						# Atualiza/Reinstala a Íris - Não use se tiver feito edições
						"13")
							latestVersion=$(curl https://raw.githubusercontent.com/KillovSky/iris/main/package.json | grep "version" | sed 's/.*": "//g' | sed 's/\",//g')
							hisVersion=$(grep "version" package.json | sed 's/.*": "//g' | sed 's/\",//g')
							if [[ "$latestVersion" == "$hisVersion" ]]; then
								printf "\n[ÍRIS] → Esta versão já é a mesma versão que você está usando, deseja continuar?\n\n"
							else
								printf "\n[ÍRIS] → Existe uma atualização disponível para você, deseja continuar?\n\n"
							fi
							select for in "Sim" "Não"; do
								case $for in
									"Sim")
										randName=$(echo $RANDOM | base64 | head -c 20; echo)
										dateNow=$(date -I)
										folderName="Backup-#-${randName}-#-${dateNow}"
										files=$(find .. -mindepth 1 -maxdepth 1 -printf '%f\n' | grep -Ev "tools|${randName}|Tutorial")
										printf "\n[ÍRIS] → 1 - Essa função criará um backup das pastas (Oficiais) da Íris antes de atualizar.\n\n2 - Se caso uma das pastas (Oficiais) não seja inserida no Backup, seu conteúdo será substituído automaticamente.\n\n3 - A atualização NÃO SALVARÁ as edições feitas no programa.\n\n4 - Você poderá inserir as edições manualmente acessando os arquivos do Backup.\n\nArquivos que serão movidos para a pasta de Backup =\n\n"
										echo "${files}"
										printf "\n\nDeseja continuar?\n\n"
										select opt in "Fazer a atualização" "Cancelar atualização" "Apenas baixar o ZIP"; do
											case $opt in
												"Fazer a atualização")
													curl -LO -# https://github.com/KillovSky/iris/archive/refs/heads/main.zip
													if [[ -f "main.zip" ]]; then
														unzip -qo main.zip
														if [ -d "$folderName" ] ; then
															folderName="${folderName}"/"${folderName}"
														fi
														mkdir "${folderName}"
														find .. -mindepth 1 -maxdepth 1 -printf '%f\n' -exec mv -t "${folderName}" {} +
														sleep 5
														rm iris-main/tools.sh iris-main/tools.py
														mv iris-main/* .
														mv iris-main main.zip "${folderName}"
														mv "${folderName}/node_modules" .
														printf "\n[ÍRIS] → Extração e Backup executados, indo para próxima etapa...\n"
														#sleep 10 # , limpando o terminal em 10 segundos...
														#clear
														printf "\n[ÍRIS] → Deseja fazer a auto-configuração dos arquivos da pasta 'Settings' usando os antigos arquivos?\n\nValores que não existem na versão baixada da Íris serão ignorados.\n\nEsta opção vai configurar as API's e demais configurações automaticamente para você, desde que você tenha configurado anteriormente, antes da atualização.\n\n"
														select md in "Aplicar valores antigos" "Não aplicar valores"; do
															case $md in
																"Aplicar valores antigos")
																	printf "\n[ÍRIS] → Essa função será executada pelo NodeJS, avisarei quando terminar.\n\n"
																	node lib/functions/shell_extra.js "./${folderName}/lib/config/Settings/config.json" "./lib/config/Settings/config.json"
																	node lib/functions/shell_extra.js "./${folderName}/lib/config/Settings/APIS.json" "./lib/config/Settings/APIS.json"
																	node lib/functions/shell_extra.js "./${folderName}/lib/config/Gerais/functions.json" "./lib/config/Gerais/functions.json"
																	node lib/functions/shell_extra.js "./${folderName}/lib/config/Settings/session.json" "./lib/config/Settings/session.json"
																	node lib/functions/shell_extra.js "./${folderName}/lib/config/Settings/commands.json" "./lib/config/Settings/commands.json"
																	node lib/functions/shell_extra.js "./${folderName}/lib/config/Settings/chrome.json" "./lib/config/Settings/chrome.json"
																	printf "\n[ÍRIS] → \nTerminado, suas configurações foram importadas.\n"
																	break
																;;
																"Não aplicar valores")
																	printf "\n[ÍRIS] → Okay, irei pular a configuração dos arquivos.\n"
																	break
																;;
															esac
														done
														printf "\n[ÍRIS] → Deseja instalar/atualizar os módulos e iniciar a Íris?\n\n"
														select up in "Sim" "Não" "Apenas atualizar/instalar" "Apenas iniciar"; do
															case $up in
																"Sim")
																	printf "%s\n" "${message}"
																	printf "[ÍRIS] → Qual opção acima (número) você deseja usar para inciar a Íris após atualizar?\n"
																	read -r whatOption
																	if [ -d "node_modules" ] ; then
																		npm update
																	else
																		npm i
																	fi
																	printf "\n[ÍRIS] → A atualização/instalação terminou, irei ligar em 10 segundos.\n"
																	sleep 10
																	bash tools.sh "$whatOption"
																	exit
																;;
																"Não")
																	printf "\n[ÍRIS] → Entendido, obrigado por utilizar o menu de opções!\n"
																	exit
																;;
																"Apenas atualizar/instalar")
																	if [ -d "node_modules" ] ; then
																		npm update
																	else
																		npm i
																	fi
																	printf "\n[ÍRIS] → A atualização/instalação terminou, obrigado por utilizar o sistema de opções!\n"
																	exit
																;;
																"Apenas iniciar")
																	if [ -d "node_modules" ] ; then
																		printf "%s\n" "${message}"
																		printf "[ÍRIS] → Qual opção acima (número) você deseja usar para inciar a Íris após atualizar?\nEscolha -> "
																		read -r whatOption
																		bash tools.sh "$whatOption"
																		exit
																	else
																		printf "\nVocê não possui os módulos, deseja instalar?"
																		select dims in "Sim" "Não"; do
																			case $dims in
																				"Sim")
																					bash tools.sh 10
																					exit
																				;;
																				"Não")
																					printf "[ÍRIS] → Ok, obrigado por utilizar este programa! <3"
																					exit
																				;;
																			esac
																		done
																	fi
																;;
															esac
														done
														exit
													else
														printf "\n[ÍRIS] → Algum erro aconteceu durante o download da atualização.\n"
														exit
													fi
												;;
												"Cancelar atualização")
													printf "[ÍRIS] → Você cancelou a atualização da Íris.\n"
													exit
												;;
												"Apenas baixar o ZIP")
													curl -LO -# https://github.com/KillovSky/iris/archive/refs/heads/main.zip
													if test -f "main.zip"; then
														printf "[ÍRIS] → A atualização foi baixada com sucesso, você pode abrir clicando no arquivo 'main.zip'.\n"
														exit
													else
														printf "[ÍRIS] → Houve algum erro durante o download da atualização.\n"
														exit
													fi
											esac
										done
									;;
									"Não")
										printf "[ÍRIS] → Você decidiu cancelar a atualização, se quiser algo mais, basta rodar novamente."
										exit
									;;
								esac
							done
						;;

						# Configura um dos JSON's
						"14")
							if [ -d "lib" ] ; then
								printf "[ÍRIS] → Essa função será executada pela 'Python', portanto, evite acentos e emojis, pois, isso pode causar erros de 'unicode'.\nQual arquivo JSON deseja editar?\n\n"
								select npu in "APIS" "Config" "Outro"; do
									case $npu in
										"APIS")
											if [[ -f "lib/config/Settings/APIS.json" ]]; then
												python tools.py 1
												exit
											else
												printf "[ÍRIS] → O arquivo 'APIS.json' não existe, faça uma reinstalação."
											fi
										;;
										"Config")
											if [[ -f "lib/config/Settings/config.json" ]]; then
												python tools.py 2
												exit
											else
												printf "[ÍRIS] → O arquivo 'config.json' não existe, faça uma reinstalação."
											fi
										;;
										"Outro")
											printf "[ÍRIS] → Escreva o local do arquivo, junto com o '.json' no fim, sem espaços.\n\nPor exemplo -> './lib/config/Settings/session.json'\n\nO local que desejo usar é: "
											read -r CustomFile
											if [[ -f "${CustomFile}" ]]; then
												python tools.py 3 "${CustomFile}"
												exit
											else
												printf "[ÍRIS] → O arquivo "
												echo "${CustomFile}"
												printf "não existe, faça uma reinstalação."
											fi
										;;
									esac
								done
							else
								printf "[ÍRIS] → Como diabos você chegou nessa resposta?\nIsso normalmente é super raro!\nDe toda forma, você não possui a Íris instalada, faça o 'Git Clone'."
								exit
							fi
						;;

						# Instala o PM2
						"15")
							printf "\n[ÍRIS] → Função iniciada, output (se existir) -> "
							npm i pm2 -g
							exit
						;;

						# Tenta corrigir o python3
						"16")
							case "$(uname -s)" in
								Linux*|Darwin*)
									printf "\n[ÍRIS] → Esse sistema é dedicado a apenas computadores com Windows."
									exit
								;;
							esac
							printf "\n[ÍRIS] → Função iniciada, output (se existir) -> "
							sed -i 's/youtube-dl-exec\": \"2/youtube-dl-exec\": \"^2/g' package.json
							PythonFolder=$(where python | sed "s/\\\python.exe//g")
							if [ -d "$PythonFolder" ] ; then
								printf "\n[ÍRIS] → A primeira etapa foi concluída, deseja tentar utilizar a correção avançada? Ela criará um atalho do python3 automaticamente no seu sistema, é altamente recomendável usar isso.\n\n"
								select pyx in "SIM" "NÃO"; do
									case $pyx in
										"SIM")
											if [[ $(sfc 2>&1 | tr -d '\0') =~ SCANNOW ]]; then
												cp "$PythonFolder"\\python.exe "$PythonFolder"\\python3.exe
											else
												printf "\n[ÍRIS] → Você precisa de permissão de administrador, irei pedir a permissão para você.\n"
												powershell.exe -Command "Start-Process cmd '/C cd \"$PythonFolder\" & cp python.exe python3.exe' -Verb RunAs"
											fi
											if ! [ -x "$(command -v python3)" ]; then
												printf "\n[DONE] → Alguma coisa não está certa, fiz a copia mas o Python3 ainda não parece estar executando, talvez você precise abrir e fechar o terminal.\n"
												break
											else
												printf "\n[DONE] → Prontinho, a correção avançada está funcionando, Python3 não deve mais ser um problema.\n"
												break
											fi
										;;
										"NÃO")
											printf "\n[ÍRIS] → Okay, se obtiver erros ainda, tente essa correção."
											break
										;;
									esac
								done
								printf "\n[ÍRIS] → A correção finalizou, deseja tentar instalar agora?\n\n"
								select ipx in "SIM" "NÃO"; do
									case $ipx in
										"SIM")
											bash tools.sh 10
											exit
										;;
										"NÃO")
											printf "[ÍRIS] → Foi um prazer, volte sempre!\n"
											exit
										;;
									esac
								done
								exit
							else
								printf "[ÍRIS] → Você não possui Python instalado, certifique-se de utilizar a versão 3.10 do Python."
								exit
							fi
						;;
						
						# Tenta corrigir a PATH e inserir o BASH nela
						"17")
							case "$(uname -s)" in
								Linux*|Darwin*)
									printf "\n[ÍRIS] → Esse sistema é dedicado a apenas computadores com Windows."
									exit
								;;
							esac
							if [ "$BashPATHexist" = true ] ; then
								printf "\n[ÍRIS] → Você já editou sua PATH antes, continuar seria arriscado, então estou cancelando essa função."
								exit
							fi
							GOWFolder=$(where gow | grep vbs | sed "s/\\\gow.vbs//g")
							if [ -d "$GOWFolder" ] ; then
								printf "\n[ÍRIS] → Você precisa de permissão de administrador, renomearei o bash do GOW primeiro, irei pedir a permissão para você.\n"
								powershell.exe -Command "Start-Process cmd '/C cd \"$GOWFolder\" & mv bash.exe bashgow.exe' -Verb RunAs"
								BashGOW=$(where bashgow | sed "s/\\\bashgow.exe//g")
								if [ -d "$BashGOW" ] ; then
									printf "\n[ÍRIS] → O bash de GOW foi renomeado, ele ainda pode ser acessado digitando 'bashgow', continuarei a correção...\n"
								else
									printf "\n[ÍRIS] → Alguma coisa errada ocorreu ao mover o bash do GOW, continuarei a correção, mas é melhor você verificar isso depois...\n"
								fi
								BashFolder=$(where git | grep cmd | sed "s/\\\cmd\\\git.exe/\\\bin/g")
								if [ -d "$BashFolder" ] ; then
									printf "\n[ÍRIS] → Você precisa de permissão de administrador, farei a adição do bash ao PATH, irei pedir a permissão para você.\n"
									powershell.exe -Command "Start-Process cmd '/C setx /M PATH \"%PATH%;$BashFolder\"' -Verb RunAs"
									sed -i "s/BashPATHexist=false/BashPATHexist=true/g" tools.sh
									if ! [ -x "$(command -v bash)" ]; then
										printf "\n[DONE] → Alguma coisa não está certa, fiz a correção mas ainda não parece estar executando, talvez você precise abrir e fechar o terminal.\n"
									else
										printf "\n[DONE] → o Bash foi inserido na sua PATH, agora você deve conseguir usar comandos de Linux."
									fi
									exit
								else
									printf "\n[ÍRIS] → Não consegui encontrar o local correto, algo estranho ocorreu, tente instalar o Git Bash novamente.\n"
									exit
								fi
							else
								printf "\n[ÍRIS] → Você precisa fazer a instalação do GOW para obter o funcionamento total do meu sistema, instale e volte aqui.\n"
								exit
							fi
							exit
						;;

						# Roda a instalação dos programas [Linux - Não finalizado]
						"18")
							printf "\n[ÍRIS] → Não sou capaz de detectar erros de instalação dos programas, então fique atento também! ->\n"
							case "$(uname -s)" in
								Linux*)
									if ! [ -x "$(command -v sudo)" ]; then
										sudo () {
											"$@";
										}
									fi
									# Atualiza os repositórios e programas do Linux
									sudo apt update && sudo apt upgrade -y
									# Instala cURL e WGET para baixar o Chrome e Node.js LTS
									sudo apt install curl wget -y
									# Baixa o chrome 'Stable' mais recente (apenas x64)
									wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
									# Instala o repositório do Node.js LTS no APT Sources - Opcional
									curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo bash
									# Instala todos os programas de uma vez só
									sudo apt install nodejs python python3 python3-pip git build-essential tesseract-ocr ./google-chrome-stable_current_amd64.deb -y
								;;
							esac
							printf "\n\n[ÍRIS] → Pronto, os programas foram automaticamente instalados no seu sistema."
						;;

						# Sai da Toolbox
						"19")
							printf "[ÍRIS] → Foi um prazer, volte sempre!\n"
							exit
						;;

						# Caso não seja digitado uma opção válida
						*)
							echo "${message}"
							printf "[ÍRIS] → Execute corretamente digitando uma opção da lista acima!\n"
							exit
						;;

					# Finalização
					esac
				fi
			done
		fi
	done

	# Caso a pessoa abra direto, não usando um terminal
	printf "[ÍRIS] → Na próxima, abra o terminal e execute o comando: 'bash tools.sh <opção>'\nExemplo: 'bash tools.sh 1'\n\n[ÍRIS] → Digite o número da opção que deseja utilizar, acima estão as descrições.\n\n"
	# COLUMNS=10 # Ative se ficar muito estranho o menu de opções
	functions=("Opção 1 - Stop BG" "Opção 2 - Normal Start" "Opção 3 - BG Start" "Opção 4 - PM2 Start | Sem Monitor" "Opção 5 - PM2 Start | Com Monitor" "Opção 6 - Stop PM2" "Opção 7 - Anti-Crash | Sem PM2" "Opção 8 - Custom Start" "Opção 9 - Atualizar módulos" "Opção 10 - Instalar módulos" "Opção 11 - Limpar a Íris" "Opção 12 - Sair do WhatsApp Web" "Opção 13 - Atualizar/Reinstalar" "Opção 14 - Configurar os JSON's" "Opção 15 - Instalar PM2" "Opção 16 - Corrigir Python3" "Opção 17 - Corrigir Bash" "Opção 18 - Instalar ferramentas" "Opção 19 - Sair")
	select op in "${functions[@]}"; do
		printf "\n[ÍRIS] → O script será fechado em 60 segundos após a execução, caso queira fechar antes, aperte 'CTRL + C', mas NÃO FECHE DURANTE A EXECUÇÃO DE OPÇÕES!\n\n[ÍRIS] → Lembre-se, na próxima, use o comando: 'bash tools.sh <opção>'\n"
		printf "\n[ÍRIS] → Aguarde, carregando script em 5 segundos...\n"
		sleep 5
		case $op in
			"Opção 1 - Stop BG")
				bash tools.sh 1
				sleep 60
				exit
			;;
			"Opção 2 - Normal Start")
				bash tools.sh 2
				sleep 60
				exit
			;;
			"Opção 3 - BG Start")
				bash tools.sh 3
				sleep 60
				exit
			;;
			"Opção 4 - PM2 Start | Sem Monitor")
				bash tools.sh 4
				sleep 60
				exit
			;;
			"Opção 5 - PM2 Start | Com Monitor")
				bash tools.sh 5
				sleep 60
				exit
			;;
			"Opção 6 - Stop PM2")
				bash tools.sh 6
				sleep 60
				exit
			;;
			"Opção 7 - Anti-Crash | Sem PM2")
				bash tools.sh 7
				sleep 60
				exit
			;;
			"Opção 8 - Custom Start")
				bash tools.sh 8
				sleep 60
				exit
			;;
			"Opção 9 - Atualizar módulos")
				bash tools.sh 9
				sleep 60
				exit
			;;
			"Opção 10 - Instalar módulos")
				bash tools.sh 10
				sleep 60
				exit
			;;
			"Opção 11 - Limpar a Íris")
				bash tools.sh 11
				sleep 60
				exit
			;;
			"Opção 12 - Sair do WhatsApp Web")
				bash tools.sh 12
				sleep 60
				exit
			;;
			"Opção 13 - Atualizar/Reinstalar")
				bash tools.sh 13
				sleep 60
				exit
			;;
			"Opção 14 - Configurar os JSON's")
				bash tools.sh 14
				sleep 60
				exit
			;;
			"Opção 15 - Instalar PM2")
				bash tools.sh 15
				sleep 60
				exit
			;;
			"Opção 16 - Corrigir Python3")
				bash tools.sh 16
				sleep 60
				exit
			;;
			"Opção 17 - Corrigir Bash")
				bash tools.sh 17
				sleep 60
				exit
			;;
			"Opção 18 - Instalar ferramentas")
				bash tools.sh 18
				sleep 60
				exit
			;;
			"Opção 19 - Sair")
				printf "[ÍRIS] → Foi um prazer, volte sempre!\n"
				exit
			;;
		esac
	done
else
	if [ -d "iris" ]; then
		isEmpty=$(find .. -path ../node_modules -prune -o -name 'package.json' -o -name 'lib' | wc -l)
		if [[ $isEmpty -lt 3 ]]; then
			mv iris irisCorrupt
			bash tools.sh
		else
			cp tools.sh iris
			cd iris || ! echo "The Íris folder was not found."
			bash tools.sh
		fi
	fi
	printf "[ÍRIS] → Este script apenas pode ser executado em uma pasta de instalação da Íris, faça o git clone e utilize corretamente.\n\nDeseja fazer o git clone ou cancelar o uso?\n\n"
	select cl in "Fazer o Git Clone" "Sair"; do
		case $cl in
			"Fazer o Git Clone")
				printf "[ÍRIS] → Verificando se você possui os programas necessários para isso...\n\n"
				if ! [ -x "$(command -v git)" ]; then
					printf '[ÍRIS] → Você não possui GIT instalado, deseja instalar GIT agora?\n\n'
					case "$(uname -s)" in
						Linux*)
							select ist in "Sim" "Não/Sair"; do
								case $ist in
									"Sim")
										printf "[ÍRIS] → Pode ser que você precise fornecer a senha para instalar, não se preocupe, isso é um procedimento seguro, não irei armazenar ou fazer quaisquer coisas com sua senha, eu respeito a segurança.\n\n"
										if ! [ -x "$(command -v sudo)" ]; then
											if ! [ -x "$(command -v apt)" ]; then
												printf "[ÍRIS] → Você não possui o APT no sistema, isso pode ser muito complicado para este script, peço que procure tutoriais para compilação do APT, ou, instale os programas que a Íris precisa, manualmente."
												exit
											else
												apt install git -y 
											fi
										else
											sudo apt install git -y
										fi
										if ! [ -x "$(command -v git)" ]; then
											printf "[ÍRIS] → Alguma coisa deu errada ao instalar o GIT, faça uma verificação manual e tente rodar o script depois."
											exit
										else
											printf "[ÍRIS] → Prontinho, instalação do GIT foi um sucesso!\n\n"
											break
										fi
									;;
									"Não/Sair")
										printf "[ÍRIS] → Entendido, até a próxima! <3"
										exit
									;;
								esac
							done
						;;
						Darwin*)
							if ! [ -x "$(command -v brew)" ]; then
								if ! [ -x "$(command -v port)" ]; then
									printf "[ÍRIS] → Você não possui 'brew' ou 'port' no sistema, isso pode ser muito complicado para este script, peço que procure tutoriais para compilação deles, ou, instale os programas que a Íris precisa, manualmente."
									exit
								else
									printf "[ÍRIS] → Pode ser que você precise fornecer a senha para instalar, não se preocupe, isso é um procedimento seguro, não irei armazenar ou fazer quaisquer coisas com sua senha, eu respeito a segurança.\n\n"
									if ! [ -x "$(command -v sudo)" ]; then
										port selfupdate
										port install git +svn +doc +bash_completion +gitweb 
									else
										sudo port selfupdate
										sudo port install git +svn +doc +bash_completion +gitweb
									fi
								fi
							else
								brew install git 
							fi
							if ! [ -x "$(command -v git)" ]; then
								printf "[ÍRIS] → Alguma coisa deu errada ao instalar o GIT, faça uma verificação manual e tente rodar o script depois."
								exit
							else
								printf "[ÍRIS] → Prontinho, instalação do APT foi um sucesso!\n\n"
								break
							fi
						;;
						*)
							printf "[ÍRIS] → Você não possui GIT instalado, instale acessando 'https://git-scm.com/downloads'.\nVocê deve fazer o download da versão "
							echo "$(uname -m)."
							exit
						;;
					esac
				fi
				case "$(uname -s)" in
					Linux*)
						needUpdate=0
						if [[ -x "$(command -v node)" && -x "$(command -v npm)" ]]; then
							isLTS=$(node -v | sed 's/v//g' | sed 's/\.//g')
							isNLTS=$(npm -v | sed 's/v//g' | sed 's/\.//g')
							if [[ $isLTS -lt 16140 || $isNLTS -lt 814 ]]; then
								printf "[ÍRIS] → Sua versão do NodeJS/NPM é considerada muito antiga, deseja utilizar o node-source para atualizar para a versão LTS?\n\n"
								needUpdate=1
							else
								printf "[ÍRIS] → Você possui a versão mais atualizada do NodeJS e NPM, parabéns!\n\n"
							fi
						elif ! [[ -x "$(command -v node)" && -x "$(command -v npm)" ]]; then
							printf "[ÍRIS] → Você não possui NodeJS e NPM, deseja instalar?\n\n"
							needUpdate=1
						else
							printf "[ÍRIS] → Eu não sei o que aconteceu, mas, por via das dúvidas, irei parar por aqui, seu sistema diz que tem e também diz que não tem o nodejs e npm...como isso é possível...?\n\n"
							exit
						fi
						if [[ "$needUpdate" == 1 ]]; then
							select nd in "Sim" "Não/Sair"; do
								case $nd in
									"Não/Sair")
										printf "[ÍRIS] → Okay, espero que você volte um dia, até a próxima!"
										exit
									;;
									"Sim")
										if ! [[ -x "$(command -v sudo)" && -x "$(command -v apt)" ]]; then
											printf "[ÍRIS] → Você não possui o APT no sistema, isso pode ser muito complicado para este script, peço que procure tutoriais para compilação do APT, ou, instale os programas que a Íris precisa, manualmente."
											exit
										fi
										printf "[ÍRIS] → Pode ser que você precise fornecer a senha para instalar, não se preocupe, isso é um procedimento seguro, não irei armazenar ou fazer quaisquer coisas com sua senha, eu respeito a segurança.\n\n"
										if ! [ -x "$(command -v sudo)" ]; then
											curl -fsSL https://deb.nodesource.com/setup_lts.x | bash
										else
											curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo bash
										fi
										isLTS=$(apt show nodejs | grep Version | sed 's/.*: //g' | sed 's/\.//g')
										if (( isLTS < 16140 )); then
											printf "[ÍRIS] → Sua versão do NodeJS no APT continua inferior a versão necessária, faça uma verificação manualmente.\n\n"
											exit
										else
											if ! [ -x "$(command -v sudo)" ]; then
												apt-get install -y nodejs
											else
												sudo apt-get install -y nodejs
											fi
										fi
										if ! [[ -x "$(command -v node)" && -x "$(command -v npm)" ]]; then
											printf "[ÍRIS] → Você ainda não possui NodeJS e NPM, alguma coisa ocorreu na instalação, verifique manualmente.\n\n"
											exit
										else
											printf "[ÍRIS] → A instalação do NodeJS e NPM foi um sucesso, passarei para a próxima etapa.\n\n"
											break
										fi
									;;
								esac
							done
						fi
					;;
					Darwin*)
						if ! [[ -x "$(command -v node)" && -x "$(command -v npm)" ]]; then
							printf "\n[ÍRIS] → Você não possui NodeJS e NPM, deseja instalar?\n\n"
							select nd in "Sim" "Não/Sair"; do
								case $nd in
									"Não/Sair")
										printf "[ÍRIS] → Okay, espero que você volte um dia, até a próxima!"
										exit
									;;
									"Sim")
										if ! [ -x "$(command -v brew)" ]; then
											if ! [ -x "$(command -v port)" ]; then
												printf "[ÍRIS] → Você não possui 'brew' ou 'port' no sistema, isso pode ser muito complicado para este script, peço que procure tutoriais para compilação deles, ou, instale os programas que a Íris precisa, manualmente."
												exit
											else
												printf "[ÍRIS] → Pode ser que você precise fornecer a senha para instalar, não se preocupe, isso é um procedimento seguro, não irei armazenar ou fazer quaisquer coisas com sua senha, eu respeito a segurança.\n\n"
												if ! [ -x "$(command -v sudo)" ]; then
													port selfupdate
													port install nodejs npm
												else
													sudo port selfupdate
													sudo port install nodejs npm
												fi
											fi
										else
											brew install node
										fi
										if ! [[ -x "$(command -v node)" && -x "$(command -v npm)" ]]; then
											printf "[ÍRIS] → Você ainda não possui NodeJS e NPM, alguma coisa ocorreu na instalação, verifique manualmente."
											exit
										else
											printf "[ÍRIS] → A instalação do NodeJS e NPM foi um sucesso, passarei para a próxima etapa.\n\n"
											break
										fi
									;;
								esac
							done
						fi
					;;
					*)
						if [[ -x "$(command -v node)" && -x "$(command -v npm)" ]]; then
							isLTS=$(node -v | sed 's/v//g' | sed 's/\.//g')
							isNLTS=$(npm -v | sed 's/v//g' | sed 's/\.//g')
							if [[ $isLTS -lt 16140 || $isNLTS -lt 814 ]]; then
								printf "[ÍRIS] → Sua versão do NodeJS/NPM é considerada muito antiga, faça a instalação do NodeJS e NPM [LTS] -> https://nodejs.org/en"
								exit
							else
								printf "[ÍRIS] → Você possui a versão mais atualizada do NodeJS e NPM, parabéns!\n\n"
							fi
						elif ! [[ -x "$(command -v node)" && -x "$(command -v npm)" ]]; then
							printf "[ÍRIS] → Instale NodeJS e NPM [LTS] para prosseguir, você pode obter eles pela página -> https://nodejs.org/en"
							exit
						else
							printf "[ÍRIS] → Eu não sei o que aconteceu, mas, por via das dúvidas, irei parar por aqui, seu sistema diz que tem e também diz que não tem o nodejs e npm...como isso é possível...?"
							exit
						fi
					;;
				esac
				printf "[ÍRIS] → Deseja utilizar a versão DEV ou a versão MAIN?\n\n[ÍRIS] → A versão DEV possui mais comandos, estabilidade e velocidade de execução, todavia, seus idiomas não estão completos, é preciso utilizar apenas o PORTUGUÊS para evitar uma serie de erros.\n\n[ÍRIS] → A única vantagem da MAIN são os idiomas funcionais.\nTodavia, a versão 3.2.7 igualou ambas as versões.\n"
				select vr in "Dev" "Main"; do
					case $vr in
						"Dev")
							git clone -b dev https://github.com/KillovSky/iris.git
							break
						;;
						"Main")
							git clone https://github.com/KillovSky/iris.git
							break
						;;
					esac
				done
				if ! [ -d "iris" ]; then
					printf "[ÍRIS] → Alguma coisa deu errado ao fazer o clone da Íris, verifique manualmente."
					exit
				else
					printf "[ÍRIS] → Pronto, o Git Clone foi finalizado com sucesso, irei limpar o terminal em 10 segundos...\n\n"
					sleep 10
					clear
					cd iris || ! echo "The Íris folder was not found."
					printf "[ÍRIS] → Quer fazer a instalação da Íris agora?\n\n"
					select is in "Sim" "Não"; do
						case $is in
							"Sim")
								printf "[ÍRIS] → Aguarde...fazendo instalação...\n\n"
								npm i
								printf "[ÍRIS] → A instalação terminou, deseja tentar iniciar?\n\n"
								select str in "Sim" "Não"; do
									case $str in
										"Sim")
											echo "${message}"
											printf "[ÍRIS] → Qual opção acima (número) você deseja usar para inciar a Íris após atualizar?\nVocê escolhe utilizar a -> "
											read -r selectOpt
											bash tools.sh "$selectOpt"
											exit
										;;
										"Não")
											printf "[ÍRIS] → Até a próxima, obrigado por instalar!"
											exit
										;;
									esac
								done
							;;
							"Não")
								printf "[ÍRIS] → Que pena, espero que você volte depois e faça a instalação..."
								exit
							;;
						esac
					done
				fi
			;;
			"Sair")
				printf "[ÍRIS] → Foi um prazer, volte sempre!\n"
				exit
			;;
		esac
	done
fi