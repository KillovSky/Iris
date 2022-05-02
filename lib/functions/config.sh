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

# Pode ser feito em JavaScript, mas resolvi dar utilidade ao meu conhecimento de Shell-Script e claro, ao Git Bash|GOW
# Sistema de cases, semelhante ao da Íris em JavaScript
case "$1" in

# Gerador de dados falsos, ele acessa a página e formata ela removendo todo o HTML e deixando apenas as informações uteis
	"dados")
		data=$(curl -s https://www.invertexto.com/gerador-de-pessoas | egrep -v "<option" | egrep "label|value" | sed 's/<input type="text" class="form-control" value=//g' | sed 's/<label>//g' | sed 's/<\/label>//g' | sed 's/$/\n/g' | sed 's/						//g' | sed 's/>$//g' | egrep -v "class")
		echo "$data"
	;;

# Sistema que aleatoriza e adquire apenas uma linha do texto, feito em Shell-Script para evitar sobrecarga em JavaScript
	"line")
		line=$(shuf -n $2 $3)
		echo "$line"
	;;

# Sistema de horoscopo, ele acessa a página do portal terra e remove o HTML não usado, separando apenas o texto de signo da página
	"signo")
		signo=$(curl -s https://www.terra.com.br/vida-e-estilo/horoscopo/signos/$2 | egrep 'article_embed_subtitle|<p class="text"' | sed 's/<p class="text">/\n/g' | sed 's/<\/p><h2 class="text">/\n\n/g' | sed 's/<\/h2>/\n/g' | sed 's/<\/p>/\n/g' | sed 's/        <h3 class="article_embed_subtitle">//g' | sed 's/<\/h3>//g' | sed 's/        <p class="text" style="text-align: justify;">//g' | sed 's/        //g' | sed 's/<\/strong>//g' | sed 's/<strong>//g' | sed 's/<h2>//g')
		echo "$signo"
	;;

# Sistema de scrapping na página fandom do LOL
	"lol")
		lol=$(curl -s https://leagueoflegends.fandom.com/wiki/$2?action=raw | egrep '\=|\*' | egrep -v '^\{|^\==|^\||^!|kae̯.ɫũ' | sed 's/<ref>/ Ref -> /g' | sed 's/<\/ref>//g' | sed 's/<ref.*\/>$//g' | sed 's/\[/ /g' | sed 's/\]/ /g' | sed 's/   / /g' | sed 's/{{.*=true//g' | sed 's/{{fi|//g' | sed 's/{{dead//g' | sed 's/{{ci|//g' | sed 's/{{cis|//g' | sed 's/{{cbi|//g' | sed 's/{{ai|//g' | sed 's/{{fi|//g' | sed 's/{{w|//g' | sed 's/}}//g' | sed 's/|//g' | sed 's/<.*>//g' | sed 's/^/\n/g' | sed "s/''//g" | sed 's/[;|*]//g' | sed 's/^ //g' | sed 's/ˈkae̯.ɫi.a//g' | sed 's/[    |  |    ]/ /g' | sed 's/-> /->/g' | sed 's/->/-> /g' | sed '/^$/d' | sed 's/$/\n/g' | sed 's/ Ref -> /\nRef ->/g' | sed 's/[{|}]//g' | sed 's/  ,/,/g')
		echo "$lol"
	;;

# Scrapper para o "ahmia.fi", um buscador de links "onion"
	"onion")
		onion=$(curl -s https://ahmia.fi/search/?q=$2 | egrep "<cite|<p>|data-timestamp" | sed 's/              <p>//g' | sed 's/">/\n/g' | sed 's/ <\/p>//g' | sed 's/            <cite>/http:\/\//g' | sed 's/<\/cite>//g' | sed 's/        <p>//g' | sed 's/      <p>//g' | sed 's/<\/p>//g' | sed 's/            <span class="lastSeen" data-timestamp="//g' | sed '1,2d')
		echo "$onion"
	;;

# Adquire os comandos criados
	"cmds")
		grep "case '" config.js | sed "s/.*case '//g" | sed "s/'://g" | grep -v " " > ../config/Utilidades/Comandos_Automate.txt
	;;

# Aqui é onde se fecha o script, pode ser fechado usando a palavra ao contrario, "case -> esac", "if" -> "fi".
esac