"""Define o executor de Python na Bash a partir da env"""
#!/usr/bin/env python

import json
import sys
import os


def clear_screen():
    """Função que limpa o terminal ao inserir um valor"""
    print("\033c")


def update_json(jsonfile, parent_key=None, parent_obj=None):
    """Edita JSONs pela CLI"""
    try:
        # Abre o arquivo JSON especificado
        with open(jsonfile, encoding="utf-8") as json_file:
            try:
                # Tenta carregar o conteúdo do arquivo JSON em uma variável
                data = json.load(json_file)
            except json.JSONDecodeError:
                # Se houver um erro ao carregar, informa que não é um JSON válido
                print(f"Erro: O conteúdo do arquivo {jsonfile} não é um JSON válido.")
                return

            # Itera sobre cada chave no dicionário
            for key, value in data.items():
                clear_screen()

                # Exibe a chave inicial se for um subobjeto
                if isinstance(value, dict):
                    print(
                        f"\nObject INTEIRA [{key}]:\n\n{json.dumps(value, indent=2)}\n"
                    )

                    # Trata subobjetos diretamente, sem chamar recursivamente
                    value = handle_subobject(value)
                else:
                    # Exibe a key e valor se não for um subobjeto
                    print(f"\nValor original de {key}: {value}")

                    # Se o valor original for uma lista (array)
                    # Cria uma nova lista com os valores
                    # Inseridos pelo usuário separados por |
                    if isinstance(value, list):
                        print(
                            "Insira os novos valores separados por '|' ou deixe em branco."
                        )
                        new_values = input(f"Novos valores para {key}: ")

                        # Armazena a lista original temporariamente
                        original_list = value.copy()

                        # Atualiza a lista apenas se o usuário inseriu valores
                        if new_values.strip() != "":
                            value = [
                                new_val.strip() for new_val in new_values.split("|")
                            ]
                        else:
                            # Restaura a lista original se o usuário não inseriu nada
                            value = original_list
                    else:
                        new_value = input(f"Novo valor para {key}: ")
                        # Atualiza o valor apenas se o usuário inseriu algo
                        if new_value.strip() != "":
                            value = new_value

                # Atualiza o valor no dicionário principal ou no subobjeto pai
                if parent_key is not None and parent_obj is not None:
                    parent_obj[parent_key][key] = value
                else:
                    data[key] = value

            # Informa que a configuração foi concluída e retorna o dicionário atualizado
            print("A configuração foi concluída, estou salvando os arquivos...")
            with open(jsonfile, "w", encoding="utf-8") as new_json:
                json.dump(data, new_json, indent=4, ensure_ascii=False)

            # Retorna o dicionário atualizado
            return data

    # Exibe os erros
    except ImportError:
        print(f"Ocorreu um erro: {ImportError}")


def handle_subobject(subobject):
    """Itera sobre subobjetos"""
    for sub_key, sub_value in subobject.items():
        # Printa o valor e key
        print(f"\nValor original de {sub_key}: {sub_value}")

        # Se for uma instância de Array
        if isinstance(sub_value, list):
            print("Insira os novos valores separados por '|'.")
            new_values = input(f"Novos valores para {sub_key}: ")

            # Armazena a lista original temporariamente
            original_list = sub_value.copy()

            # Atualiza a lista apenas se o usuário inseriu valores
            if new_values.strip() != "":
                subobject[sub_key] = [
                    new_val.strip() for new_val in new_values.split("|")
                ]
            else:
                # Restaura a lista original se o usuário não inseriu nada
                subobject[sub_key] = original_list
        else:
            # Se for outro tipo
            new_value = input(f"Novo valor para {sub_key}: ")

            # Atualiza o valor apenas se o usuário inseriu algo
            if new_value.strip() != "":
                subobject[sub_key] = new_value

    # Retorna a subobject
    clear_screen()
    return subobject


# Verifica se o script foi chamado com o caminho do arquivo JSON como argumento
if len(sys.argv) == 2:
    # Verifica a extensão do arquivo
    _, file_extension = os.path.splitext(sys.argv[1])
    if file_extension.lower() == ".json":
        update_json(sys.argv[1])
    else:
        print("Erro: O arquivo não parece ser um arquivo '.json'.")
else:
    # Informa ao usuário que faltou enviar o local do JSON
    print("Você não passou o caminho do arquivo JSON como argumento.")
