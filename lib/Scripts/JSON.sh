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

# $1 = Arquivo a olhar
# $2 = Idioma do dialogo
# $3 = Key inicial
# $4 = Função a usar
# $5 = Opção extra
file=$(echo "$1" | tr '[:upper:]' '[:lower:]')
language=$(echo "$2" | tr '[:upper:]' '[:lower:]')
objkey=$(echo "$3")
funcUse=$(echo "$4" | tr '[:upper:]' '[:lower:]')
options=$(echo "$5" | tr '[:upper:]' '[:lower:]')

# Array do arquivo
ObjectBase=$(cat "$(realpath "$(pwd)/lib/Dialogues/$file/index.json")")

# Resultado base em RAW + 'Try-Catch' para cair na Default
BaseRAW=$(echo "$ObjectBase" | jq -c --arg keyj $(($RANDOM % 2)) "(.$language.$objkey[$keyj]? // .pt.Default[$keyj])")

# Case para separar funções
case "$funcUse" in

    # Adquire a Array base
    "base")
    
        # Define a Array inteira
        BaseArr=$(echo "$ObjectBase" | jq -c "(.$language.$objkey? // .pt.Default)")
    
        # Se deve extrair um valor único */
        if [[ "$options" =~ ^[0-9]+$ ]] ; then
            # Define um valor único
            BaseArr=$(echo "$ObjectBase" | jq -c "(.$language.$objkey[$options]? // .pt.Default[$options])")

            # Verifica se é null
            if [ "$BaseArr" = "null" ] ; then
                # Envia o primeiro se for
                BaseArr=$(echo "$BaseRAW" | head -n 1)
            fi
        fi

        # Retorna o resultado
        echo "$BaseArr"
    ;;

    # Adquire um valor ou a Array toda aleatorizada */
    "randomize")
        
        # Se deve extrair um valor único */
        if [ "$options" = true ] ; then
            # Define um valor random único
            Randomizer=$(echo "$BaseRAW" | shuf | head -n 1)

            # Senão...
        else
            # Define a Array inteira
            Randomizer=$(echo "$BaseRAW" | shuf | jq -n "[inputs]")
        fi
        
        # Retorna o resultado
        echo "$Randomizer"
    ;;
    
    # Adquire apenas as Arrays RAW
    "raw")
        
        # Retorna o resultado
        echo "$BaseRAW"
    ;;
    
    # Adquire a Object filtrada por idioma
    "lang")
        # Define o valor
        Filtered=$(echo "$ObjectBase" | jq -c "(.$language? // .pt)")

        # Retorna o resultado
        echo "$Filtered"
    ;;

    # Adquire o arquivo todo */
    *)

        # Retorna o resultado
        echo "$ObjectBase"
    ;;
esac