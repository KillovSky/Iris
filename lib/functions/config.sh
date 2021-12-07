#!/bin/sh

######	######	######	######	######	######	######	######	######	######	#
#	 Construido por KillovSky para utilização no Projeto Íris					#
#	   Página oficial -> https://github.com/KillovSky/Iris						#
#	 Como faz parte do programa Íris, isso utiliza a licença MIT também			#
# 				Não remova os créditos e divirta-se!							#
######	######	######	######	######	######	######	######	######	######	#

# Sistema de cases, semelhante ao da Íris em JavaScript
case "$1" in

# Gerador de dados falsos, ele "baixa" a página e usa ferramentas de shell para formatar
# Pode ser feito em JavaScript, mas resolvi dar utilidade ao meu conhecimento de shell e claro, ao Git Bash
   "dados")
		data=$(curl -s https://www.invertexto.com/gerador-de-pessoas | egrep -v "<option" | egrep "label|value" | sed 's/<input type="text" class="form-control" value=//g' | sed 's/<label>//g' | sed 's/<\/label>//g' | sed 's/$/\n/g' | sed 's/						//g' | sed 's/>$//g' | egrep -v "class")
		echo "$data"
   ;;

# Sistema de noticias, ele baixa a página de Noticias do Google pelo JavaScript, e então as formata usando ferramentas de Shell-Script daqui
   "news")
		news=$(cat news.xml | sed 's/>/\n/g' | egrep 'pubDate|/description|/source|/title' | sed 's/<\/title//g' | sed 's/<\/pubDate//g' | sed 's/target\=\"/\ndontuseline/g' | sed 's/<\/source/dontuseline\n/g' | egrep -v 'dontuseline|</description|<pubDate' | sed 's/&lt;a//g' | sed 's/href\=\"//g' | sed 's/\"//g')
		echo "$news"
   ;;

# Sistema que aleatoriza e adquire apenas uma linha do texto, feito em Shell-Script para evitar sobrecarga em JavaScript
   "line")
		line=$(shuf -n $2 $3)
		echo "$line"
   ;;

# Aqui é onde se fecha o script, pode ser fechado usando a palavra ao contrario, "case -> esac", "if" -> "fi".
esac