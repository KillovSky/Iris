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

# Aqui é onde se fecha o script, pode ser fechado usando a palavra ao contrario, "case -> esac", "if" -> "fi".
esac