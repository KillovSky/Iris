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
message="[ÍRIS] → Funções suportadas por mim:\n\nParar a Íris = 1\n-> (Apenas se usou o 3)\n\nNormal Start = 2\n-> (Inicia normalmente) \n\nTXT Background Start = 3\n-> (Roda de fundo SEM ANTI CRASH e envia os logs para o 'BG_Start.log', não recomendado [EXPERTS]!)\n\nPM2 Background Start = 4\n-> (PM2 Anti Crash, roda de fundo, auto-reboot a cada 6 horas)\n\nPM2 Start = 5\n-> (PM2 Anti Crash, exibe na tela, auto-reboot a cada 6 horas)\n\nParar o PM2 = 6\n-> (Apenas se usou o 4 ou 5)\n\nAnti-Crash Sem PM2 = 7\n-> (Anti Crash sem PM2)\n\nIncialização customizada = 8\n-> (Digite o comando de inicialização)\n\nAtualizar os módulos = 9\n-> (Faz a atualização da 'node_modules' da Íris)\n\nInstalar os módulos = 10\n-> (Faz a instalação dos módulos, essencial na primeira vez)\n\nLimpar a Íris = 11\n-> (Limpa a Íris - incluso Backups, mantém o mais recente)\n\nDeletar sessão do WhatsApp Web = 12\n-> (Desconecta do WhatsApp Web)\n\nAtualizar/Reinstalar a Íris = 13\n-> (Refaz os passos de instalação)\n\nDesativar abertura do Bomber-API = 14\n-> (Faz o navegador parar de abrir sozinho)\n\nMudar a porta do Bomber-API = 15\n-> (Mude a porta padrão do Bomber-API)\n\nConfigurar os JSON's = 16\n-> (Configure as API's sem abrir os arquivos)\n\nInstalar PM2 = 17\n-> (Instala o PM2 no PC)\n\nSair = 18\n-> (Sai do Toolkit)\n\n"

# Checa se o local já é a pasta da Íris
isCorrect=$(ls | egrep -w "lib|package.json|start.js")
if [[ "$isCorrect" == *"start.js"* && "$isCorrect" == *"lib"* && "$isCorrect" == *"package.json"* ]]; then

	# Script que faz a execução/outros da Íris
	array=("1" "2" "3" "4" "5" "6" "7" "8" "9" "10" "11" "12" "13" "14" "15" "16" "17" "18")
	while : ; do
		if [ "$#" -eq 0 ] ; then
			printf "\n${message}"
			break
		else
			if [[ "${array[@]}" =~ "$1" ]] ; then
				case "$1" in

					# Cancela a execução do script caso a pessoa rode o modo hide.
					"1")
						printf "\n[ÍRIS] → Função executada, output (se existir) -> "
						kill $(ps | grep node | awk '{print $1}')
						exit
					;;

					# Executa normalmente, mostrando os reinícios, logs e mensagens.
					"2")
						printf "\n[ÍRIS] → Função iniciada, output do NPM -> "
						npm start
						exit
					;;

					# Modo Hide, inicia mas envia os logs para o arquivo BG_Start.log.
					"3")
						printf "\n[ÍRIS] → Função iniciada, output (se existir, deve cair no 'BG_Start.log') -> "
						npm start &>BG_Start.log &
						exit
					;;

					# Executa em pm2 de fundo.
					"4")
						if ! [ -x "$(command -v pm2)" ]; then
							select opt in "Instalar PM2" "Sair"; do
								case $opt in
									"Instalar PM2")
										bash tools.sh 17
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
										bash tools.sh 17
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
										bash tools.sh 17
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
							printf "[ÍRIS] → $('\033[0;32m') Iniciando Íris, caso o processo sofra falhas, um reinicio automático será feito.\n"
							npm start
							sleep 1
						done
						exit
					;;

					# Executa um método customizado
					"8")
						read customMode
						printf "\n[ÍRIS] → Função executada, output (se existir) -> "
						$customMode
						exit
					;;

					# Atualiza os módulos
					"9")
						if [ -d "node_modules" ]; then
							printf "\n[ÍRIS] → Função iniciada, output do NPM -> "
							npm update
							printf "\n[ÍRIS] → Função executada, output (se existir) -> "
						else
							printf "[ÍRIS] → Você não fez a instalação, deseja instalar os módulos?\n\n"
							select npi in "Sim" "Não"; do
								case $npi in
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
						exit
					;;

					# Faz a instalação dos módulos
					"10")
						printf "\n[ÍRIS] → Função iniciada, output do NPM -> "
						npm i
						printf "\n[ÍRIS] → Função executada, output (se existir) -> "
						if ! [ -x "$(command -v pm2)" ]; then
							select opt in "Instalar PM2" "Sair"; do
								case $opt in
									"Instalar PM2")
										bash tools.sh 17
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
						exit
					;;

					# Limpa a Íris, não apaga a sessão se não for MD
					"11")
						isMultiple=$(grep 'Multi_Devices' ./lib/config/Settings/session.json | sed 's/.*\": //g' | sed 's/,$//g')
						lastBackup=$(ls -t ./lib/config/Backup | head -n 1)
						mv "./lib/config/Backup/${lastBackup}" "./lib/config/Backup/Latest_Backup.tgz"
						rm ./lib/config/Backup/[0-9]*
						if [ "$isMultiple" == "false" ]; then
							rm -r lib/session/*/
						else
							echo "Usando Multi_Devices, ignorando limpeza do Chrome."
						fi
						rm -rf package-lock.json
						exit
					;;

					# Apaga a sessão da Íris
					"12")
						if [[ -d "lib/session" ]]; then
							rm -rf lib/session
						else
							printf "[ÍRIS] → Você ainda não possui uma sessão conectada."
						fi
						exit
					;;

					# Atualiza/Reinstala a Íris - Não use se tiver feito edições
					"13")
						latestVersion=$(curl https://raw.githubusercontent.com/KillovSky/iris/dev/package.json | grep "version" | sed 's/.*": "//g' | sed 's/\",//g')
						hisVersion=$(cat package.json | grep "version" | sed 's/.*": "//g' | sed 's/\",//g')
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
									files=$(ls -t | egrep -v 'start.sh|${randName}|Logs|Iris_Login|Tutorial')
									printf "\n[ÍRIS] → 1 - Essa função criará um backup das pastas (Oficiais) da Íris antes de atualizar.\n\n2 - Se caso uma das pastas (Oficiais) não seja inserida no Backup, seu conteúdo será substituído automaticamente.\n\n3 - A atualização NÃO SALVARÁ as edições feitas no programa.\n\n4 - Você poderá inserir as edições manualmente acessando os arquivos do Backup.\n\nArquivos que serão movidos para a pasta de Backup =\n\n${files}\n\nDeseja continuar?\n\n"
									select opt in "Fazer a atualização" "Cancelar atualização" "Apenas baixar o ZIP"; do
										case $opt in
											"Fazer a atualização")
												curl -LO -# https://github.com/KillovSky/iris/archive/refs/heads/dev.zip
												if [[ -f "dev.zip" ]]; then
													unzip -qo dev.zip
													MDEnabled=$(grep 'Multi_Devices' './lib/config/Settings/session.json' | sed 's/.*\": //g' | sed 's/,$//g')
													if [ -d "$folderName" ] ; then
														folderName="${folderName}"/"${folderName}"
													fi
													rm -rf Tutorial\ de\ Edição\ PT-BR.txt
													mkdir "${folderName}"
													mv $files "${folderName}"
													if [ "$MDEnabled" == "false" ]; then
														if [ -d "logs" ]; then
															mv logs "${folderName}"
														fi
													fi
													mv iris-dev/* .
													mv iris-dev dev.zip "${folderName}"
													printf "\n[ÍRIS] → Extração e Backup executados, limpando o terminal em 10 segundos...\n"
													sleep 10
													clear
													printf "\n[ÍRIS] → Deseja fazer a auto-configuração dos arquivos 'config.json', 'functions.json' e 'APIS.json' usando os antigos arquivos?\n\nValores que não existem na versão baixada da Íris serão ignorados.\n\nEsta opção vai configurar as API's e demais configurações automaticamente para você, desde que você tenha configurado anteriormente, antes da atualização.\n\n"
													select md in "Aplicar valores antigos" "Não aplicar valores"; do
														case $md in
															"Aplicar valores antigos")
																printf "\n[ÍRIS] → Essa função será executada pelo NodeJS, avisarei quando terminar.\n\n"
																node lib/functions/shell_extra.js "./${folderName}/lib/config/Settings/config.json" "./lib/config/Settings/config.json"
																node lib/functions/shell_extra.js "./${folderName}/lib/config/Settings/APIS.json" "./lib/config/Settings/APIS.json"
																node lib/functions/shell_extra.js "./${folderName}/lib/config/Settings/functions.json" "./lib/config/Settings/functions.json"
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
																printf "\n${message}[ÍRIS] → Qual opção acima (número) você deseja usar para inciar a Íris após atualizar?\n"
																read whatOption
																if [ -d "node_modules" ] ; then
																	npm update
																else
																	npm i
																fi
																printf "\n[ÍRIS] → A atualização/instalação terminou, irei ligar em 10 segundos.\n"
																sleep 10
																bash tools.sh $whatOption
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
																printf "\n${message}[ÍRIS] → Qual opção acima (número) você deseja usar para inciar a Íris após atualizar?\nEscolha -> "
																read whatOption
																bash tools.sh $whatOption
																exit
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
												curl -LO -# https://github.com/KillovSky/iris/archive/refs/heads/dev.zip
												if test -f "dev.zip"; then
													printf "[ÍRIS] → A atualização foi baixada com sucesso, você pode abrir clicando no arquivo 'dev.zip'.\n"
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
					
					"14")
						if [ -d "node_modules" ] ; then
							cd node_modules/bomber-api && grep -v "http://localhost:" index.js > index2.js && rm -rf index.js && mv index2.js index.js && cd ../..
							printf "[ÍRIS] → Prontinho, o Bomber-API não vai mais abrir o navegador automaticamente."
							exit
						else
							printf "[ÍRIS] → Você não fez a instalação ainda, deseja instalar?\n\n"
							select npu in "Sim" "Não"; do
								case $npu in
									"Sim")
										bash tools.sh 10
										bash tools.sh 14
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
					
					"15")
						if [ -d "node_modules" ] ; then
							printf "[ÍRIS] → Digite a porta que deseja utilizar no Bomber-API: "
							read portBomb
							cd node_modules/bomber-api && sed -i "s/app.listen([0-9]\+\,/app.listen(${portBomb}\,/g" index.js && sed -i "s/started on [0-9]\+/started on ${portBomb}/g" index.js && cd ../..
							cd lib/config/Settings && sed -i "s/\"Bomber_Port\": \"[0-9]\+\"/\"Bomber_Port\": \"${portBomb}\"/g" config.json
							printf "\n[ÍRIS] → Pronto, o Bomber-API mudou para a porta ${portBomb}, agora você deve acessar por -> localhost:${portBomb}"
							exit
						else
							printf "[ÍRIS] → Você não fez a instalação ainda, deseja instalar?"
							select npu in "Sim" "Não"; do
								case $npu in
									"Sim")
										bash tools.sh 10
										bash tools.sh 15
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
					
					"16")
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
										read CustomFile
										if [[ -f "${CustomFile}" ]]; then
											python tools.py 3 "${CustomFile}"
											exit
										else
											printf "[ÍRIS] → O arquivo ${customFile} não existe, faça uma reinstalação."
										fi
									;;
								esac
							done
						else
							printf "[ÍRIS] → Como diabos você chegou nessa opção?\nIsso normalmente é super raro!\nDe toda forma, você não possui a Íris instalada, faça o 'Git Clone'."
							exit
						fi
					;;
					
					"17")
						printf "\n[ÍRIS] → Função executada, output (se existir) -> "
						npm i pm2 -g
						exit
					;;

					"18")
						printf "[ÍRIS] → Foi um prazer, volte sempre!\n"
						exit
					;;

					# Caso não seja digitado uma opção válida
					*)
						printf "${message}[ÍRIS] → Execute corretamente digitando uma opção da lista acima!\n"
						exit
					;;

				# Finalização
				esac
			else
				printf "${message}[ÍRIS] → Execute corretamente digitando uma opção da lista acima!\n"
				exit
			fi
		fi
	done

	# Caso a pessoa abra direto, não usando um terminal
	printf "[ÍRIS] → Na próxima, abra o terminal e execute o comando: 'bash tools.sh <opção>'\nExemplo: 'bash tools.sh 1'\n\n[ÍRIS] → Digite o número da opção que deseja utilizar, acima estão as descrições.\n\n"
	# COLUMNS=10 # Ative se ficar muito estranho o menu de opções
	functions=("Opção 1 - Stop BG" "Opção 2 - Normal Start" "Opção 3 - BG Start" "Opção 4 - PM2 Start | Sem Monitor" "Opção 5 - PM2 Start | Com Monitor" "Opção 6 - Stop PM2" "Opção 7 - Anti-Crash | Sem PM2" "Opção 8 - Custom Start" "Opção 9 - Atualizar módulos" "Opção 10 - Instalar módulos" "Opção 11 - Limpar a Íris" "Opção 12 - Sair do WhatsApp Web" "Opção 13 - Atualizar/Reinstalar" "Opção 14 - Desativar navegador Bomber-API" "Opção 15 - Mudar porta do Bomber-API" "Opção 16 - Configurar os JSON's" "Opção 17 - Instalar PM2" "Opção 18 - Sair")
	select op in "${functions[@]}"; do
		printf "\n[ÍRIS] → O script será fechado em 60 segundos após a execução, caso queira fechar antes, aperte 'CTRL + C', mas, NÃO FECHE DURANTE A EXECUÇÃO DE OPÇÕES!\n\n[ÍRIS] → Lembre-se, na próxima, use o comando: 'bash tools.sh <opção>'\n"
		printf "\n[ÍRIS] → Aguarde, carregando script em 5 segundos...\n\n"
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
			"Opção 14 - Desativar navegador Bomber-API")
				bash tools.sh 14
				sleep 60
				exit
			;;
			"Opção 15 - Mudar porta do Bomber-API")
				bash tools.sh 15
				sleep 60
				exit
			;;
			"Opção 16 - Configurar os JSON's")
				bash tools.sh 16
				sleep 60
				exit
			;;
			"Opção 16 - Configurar os JSON's")
				bash tools.sh 16
				sleep 60
				exit
			;;
			"Opção 17 - Instalar PM2")
				bash tools.sh 17
				sleep 60
				exit
			;;
			"Opção 18 - Sair")
				printf "[ÍRIS] → Foi um prazer, volte sempre!\n"
				exit
			;;
		esac
	done
else
	if [ -d "iris" ]; then
		isEmpty=$(ls -a iris | egrep -w "lib|package.json|start.js" | wc -l)
		if [[ $isEmpty < 3 ]]; then
			mv iris irisCorrupt
			bash tools.sh
		else
			cp tools.sh iris
			cd iris
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
							printf '[ÍRIS] → Você não possui GIT instalado, instale acessando "https://git-scm.com/downloads".\nVocê deve fazer o download da versão $(uname -m).'
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
							if [[ $isLTS < 16140 || $isNLTS < 814 ]]; then
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
										if (( $isLTS < 16140 )); then
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
							if [[ $isLTS < 16140 || $isNLTS < 814 ]]; then
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
				printf "[ÍRIS] → Deseja utilizar a versão DEV ou a versão MAIN?\n\n[ÍRIS] → A versão DEV possui mais comandos, estabilidade e velocidade de execução, todavia, seus idiomas não estão completos, é preciso utilizar apenas o PORTUGUÊS para evitar uma serie de erros.\n\n[ÍRIS] → A única vantagem da MAIN são os idiomas funcionais.\n\n"
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
					cd iris
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
											printf "${message}[ÍRIS] → Qual opção acima (número) você deseja usar para inciar a Íris após atualizar?\nVocê escolhe utilizar a -> "
											read selectOpt
											bash tools.sh $selectOpt
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