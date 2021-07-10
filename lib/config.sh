#!/bin/sh

# ------------------------------------------------------------------
# Sobre o Dados-Fake
# Gera dados falsos usando o site invertexto, o uso dos dados gerados é de total responsabilidade do utilizador
# ------------------------------------------------------------------
# Sobre o News
# Adquire as noticias do RSS da Google News
# ------------------------------------------------------------------
# Ambos consistem em um Shell-Script usando Cat, Grep, Curl, Sed para fazer scraper (formatar) a página HTML/XML
# Feito por Lucas R. - KillovSky
# ------------------------------------------------------------------

CMD=$1

case "$CMD" in
   "dados")
		dadosfake=$(curl -s https://www.invertexto.com/gerador-de-pessoas | egrep -v "<option" | egrep "label|value" | sed 's/<input type="text" class="form-control" value=//g' | sed 's/<label>//g' | sed 's/<\/label>//g' | sed 's/$/\n/g' | sed 's/						//g' | sed 's/>$//g' | egrep -v "class")
		echo "$dadosfake"
   ;;

   "news")
		noticias=$(cat news.xml | sed 's/>/\n/g' | egrep 'pubDate|/description|/source|/title' | sed 's/<\/title//g' | sed 's/<\/pubDate//g' | sed 's/target\=\"/\ndontuseline/g' | sed 's/<\/source/dontuseline\n/g' | egrep -v 'dontuseline|</description|<pubDate' | sed 's/&lt;a//g' | sed 's/href\=\"//g' | sed 's/\"//g')
		echo "$noticias"
   ;;
esac