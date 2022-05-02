#!/usr/bin/env python

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

# Importa os módulos
import json
from unidecode import unidecode
import sys

# Abre o JSON
def apis():
    with open('./lib/config/Settings/APIS.json', encoding='utf-8') as json_file:
        data = json.load(json_file)
        for item in data:
            data[item] = unidecode(str(data[item])) # Remove os acentos
            if "Comment" not in item and "JumpLine" not in item and "HelpLine" not in item:
                print("\nValor padrão:", data[item])
                newValue = input("\nInsira o valor para a configuração de "+item+": ")
                data[item] = newValue # Muda para o valor digitado
            elif "Comment" in item and "JumpLine" not in item and "HelpLine" not in item:
                print("\nAdquira uma API aqui ->", data[item])
            else:
                print("\n"+data[item])
        print("A configuração foi concluída, estou salvando os arquivos...")
        newJson = open('./lib/config/Settings/APIS.json', "w") # Salva o JSON
        json.dump(data, newJson, indent=4)
        newJson.close()
    # Fim da função para API's
def config():
    with open('./lib/config/Settings/config.json', encoding='utf-8') as json_file:
        data = json.load(json_file)
        for item in data:
            print("\nValor padrão:", data[item],"\nPara inserir múltiplos valores, use '|' para separar eles, mas, não insira espaços ao separar.")
            newValue = input("\nInsira o valor para a configuração de "+item+": ").split('|')
            data[item] = newValue # Muda para o valor digitado
        print("A configuração foi concluída, estou salvando os arquivos...")
        newJson = open('./lib/config/Settings/config.json', "w") # Salva o JSON
        json.dump(data, newJson, indent=4)
        newJson.close()
    # Fim da função para Config
def outros(file):
    try:
        with open(file, encoding='utf-8') as json_file:
            data = json.load(json_file)
            for item in data:
                print("\nPara inserir múltiplos valores, use '|' para separar eles, mas, não insira espaços ao separar.\n\nValor padrão:", data[item])
                newValue = input("\nInsira o valor para a configuração de "+item+": ").split('|')
                data[item] = newValue # Muda para o valor digitado
            print("A configuração foi concluída, estou salvando os arquivos...")
            newJson = open(file, "w") # Salva o JSON
            json.dump(data, newJson, indent=4)
            newJson.close()
    except:
        print("Isso não é um valor/arquivo válido, tente com algo que seja.")
    # Fim da função para Config
if len(sys.argv) > 1:
    if sys.argv[1] == '1':
        apis()
    elif sys.argv[1] == '2':
        config()
    else:
        if len(sys.argv) > 2:
            outros(sys.argv[2])
        else:
            print("Você não passou um arquivo correto.")
else:
    print("Você não passou nenhum arquivo para a edição.")