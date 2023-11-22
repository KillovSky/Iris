# 🚀 Tutorial de Desenvolvimento de Comandos 🛠️

<details>
  <summary><code><strong>[✨ DICAS PARA COMEÇAR]</strong></code></summary>

- **Não mexa nas areas sem edição:** Evite modificar partes não editadas. Adicione e edite apenas as seções relevantes, como a `object results`.

- **Pasta:** A pasta do tutorial é o seu melhor amigo, apenas copie e cole onde for desenvolver e comece por lá.

- **Diálogos:** Coloque os diálogos na pasta `Dialogues` em um arquivo apropriado ou crie uma pasta e um arquivo novo. Lembre-se dos 12 idiomas e, se necessário, utilize tradutores, mas revise as frases que está inserindo antes de terminar.

- **Dúvidas:** Se houver dúvidas, pergunte para os DEVs! A clareza é essencial para evitar erros.

- **Aprenda com Exemplos:** Utilize os exemplos fornecidos para entender o formato esperado, ou seja, abra um arquivo qualquer que use envInfo e analise.

- **Object, Array, Null e outros:** Seja preciso ao descrever se é um Object, Array, Null ou outros.

- **Comentários no Código:** Comente todas as linhas, se possível. Caso contrário, programe e eu adicionarei os comentários eu mesmo, não exagere neles, faça igual estou fazendo.

- **Nome da Pasta:** A pasta deve ter o mesmo nome do comando, pois será usada como alias.

- **Symlinks.json:** Para adicionar aliases a functions, modifique o arquivo `symlinks.json` em `lib\Databases\Configurations`.

</details>

<details>
  <summary><code><strong>[🖊️ CONFIGURAÇÃO DO ARQUIVO INDEX.JS]</strong></code></summary>

- **Comece a Programar:** O código JavaScript já possui instruções a cada linha. Comece onde está indicado e configure a `utils.json` após programar seu comando.

- **Sistema Pronto:** Cada comando tem sistemas isolados. Mantenha o código limpo. Pode usar o mesmo nome e descrição em todos, mas evite sempre que puder.

- **Nome da Função:** Escolha um nome relevante para a função em vez de deixar `myFunction` como padrão.

- **ResetAmbient:** Ao final, na função `resetAmbient`, configure `envInfo.functions` com os dados das etapas 1.07 e 1.12. Um código pré-pronto está lá, basta trocar o nome com o nome da function que você criou acima.

- **Funções Adicionais:** Se criar funções extras, inclua-as em `envInfo` para acessá-las em outros arquivos, basta definir seu nome, inserir na `exports` da `utils.json` e também na `functions` do mesmo, na dúvida, siga o exemplo da `myFunction`.

</details>

<details>
  <summary><code><strong>[➕ CONFIGURAÇÃO DO ARQUIVO .OTHER]</strong></code></summary>

- **Categoria do Menu:** O arquivo '.other' define a categoria ao consultar o menu. Personalize conforme necessário, por exemplo, renomear para '.other games anime' adicionará o comando ao menu de 'other', 'games' e 'anime'.

- **Formato do Menu:** O menu é construído automaticamente com base no sistema Bash. Adicione um novo comando inserindo um arquivo com o nome da categoria desejada na pasta, se quiser manter o comando oculto, apague o arquivo '.other'.

- **Filtros de Comando:** Você pode obter menus específicos como 'utils' e 'index' ao filtrar comandos. Por exemplo, '/menu utils' buscará comandos que utilizem o sistema de envInfo, por conta do arquivo `utils.json` na pasta.

</details>

<details>
  <summary><code><strong>[📁 CONFIGURAÇÃO DO ARQUIVO UTILS.JSON]</strong></code></summary>

## 1. Nome do Comando

### 1.01 (Name)

Ao abrir o arquivo "utils.json", atente-se ao campo "name" na primeira linha. Escolha um nome relevante, pois será utilizado na geração automática do `module.exports`. Por exemplo, se definir "Ping", a função no Node será automaticamente: `functions.Ping.execute(...)`. Não é necessário modificar isso após a configuração inicial, a menos que seja desejado.
- **Uso:** String
- **Exemplo:** "Ping"
- **Pode ser Modificado:** Sim, com cuidado.

## 2. Descrição do Comando

### 1.02 (Description)

A descrição é autoexplicativa e será exibida no '--help' do comando. Elabore uma descrição clara e inicie com algo que combine com 'por', pois na ajuda, a frase será precedida por essa palavra.
- **Uso:** String
- **Exemplo:** "Ajudar a calcular o tempo de resposta e execução"
- **Pode ser Modificado:** Sim.

## 3. Forma Geral de Uso

### 1.03 (Usage > General)

Esta é a forma geral de uso, um resumo que deve incluir o '[Prefix][Comando]'. Modifique apenas os argumentos e valores na frente dele.
- **Uso:** String
- **Exemplo:** "[Prefix][Comando] [--help|--help-dev|--show|--show --secret|None]"
- **Pode ser Modificado:** Somente adicionar informações novas ou substituir as não relacionadas.

## 4. Exemplos de Uso

### 1.04 (Usage > Examples)

Os exemplos de uso do comando podem ser adicionados conforme necessário. Lembre-se de resumir, pois todos os exemplos serão incluídos no '--help'.
- **Uso:** Array de Strings
- **Exemplo:** `["/Ping"]`
- **Pode ser Modificado:** Somente adicionar novos exemplos.

## 5. Licença

### 1.05 (License)

Você pode sublicenciar seu comando, mas mantenha o arquivo de licença seu dentro da pasta. Se desejar manter a licença da Íris, deixe como 'MIT'.
- **Uso:** String
- **Exemplo:** "MIT"
- **Pode ser Modificado:** Sim.

## 6. Dicas do Comando

### 1.06 (Helps)

As dicas do comando são importantes. Mantenha as 5 primeiras, se desejar. Adicione outras dicas relevantes.
- **Uso:** Array de Strings
- **Exemplo:** `["Dica ou conselho sobre como usar, efeitos ou demais"]`
- **Pode ser Modificado:** Somente adicionar novas dicas.

## 7. Nome das Funções na module.exports

### 1.07 (Exports)

Os nomes das funções que estarão na `module.exports` são definidos aqui. Se estiver adicionando uma função extra, adicione-a seguindo o formato abaixo. Mantenha os padrões para os mesmos valores já existentes.
- **Uso:** Object de keys e valores que controlam a `module.exports`
- **Exemplo:** `{ "nomeBase": "nomeReal" }`
- **Pode ser Modificado:** Somente adicionar novas funções.

## 8. Desenvolvedor do Comando

### 1.08 (Developer)

Insira seu nome, indicando quem criou o comando.
- **Uso:** String
- **Exemplo:** "KillovSky"
- **Pode ser Modificado:** Sim.

## 9. Arquivos na Pasta do Comando

### 1.09 (Files)

Defina quais arquivos estão dentro da pasta do comando. Isso é utilizado no '--help-dev'. Adicione novos arquivos, se necessário.
- **Uso:** Object de keys e valores que definem os arquivos da pasta
- **Exemplo:** `{"NomeDoArquivo": "Descrição do que ele faz"}`
- **Pode ser Modificado:** Somente adicionar novas informações.

## 10. Módulos Utilizados

### 1.11 (Modules)

Aqui você define quais módulos está utilizando, inclusive os da Íris com identificação local. Documente os módulos utilizados.
- **Uso:** Object de keys e valores que definem os requires ou JSON's utilizados
- **Exemplo:** `{"NomeOuLocalDoArquivoOuModulo": "Descrição do que ele faz"}`
- **Pode ser Modificado:** Somente adicionar novas informações.

## 11. Detalhes das Funções

### 1.12 (Functions)

Esta seção é essencial para tornar a função à prova de falhas. Os parâmetros aqui são utilizados como valores padrão, caso o enviado não seja válido. Mantenha a mesma arquitetura e adicione novos detalhes, se necessário. Abaixo estão os elementos padrão:
- **Uso:** Object com detalhes em formato de Object
- **Exemplo:**
  ```json
  {
    "nomeBase": {
      "arguments": {
        "argumentoSeHouverOuInsiraFalse": {
          "description": "Descrição do que é esse argumento",
          "type": "O tipo dele",
          "value": "Um valor padrão, caso o usuário não envie"
        }
      },
      "description": "Descrição do que a função faz",
      "type": "O tipo de valor que vai estar nela futuramente",
      "value": "Um valor padrão"
    }
  }
  ```
  - **Exemplo2:**
  ```json
  {
    "nomeBase": {
      "arguments": false,
      "description": "Descrição do que a função faz",
      "type": "O tipo de valor que vai estar nela futuramente",
      "value": "Um valor padrão"
    }
  }
  ```
- **Pode ser Modificado:** Somente adicionar novas informações.

## 12. Detalhes da Função Específica

### 1.12.1 (Functions > Key)

A key da object inicial deve ser igual ao exemplo do tópico 1.07, ou seja, o mesmo nomeBase da função na `module.exports`. Por exemplo, se você usou "exec", coloque "exec" aqui.
- **Uso:** String com mesmo nomeBase da função na `module.exports`
- **Exemplo:** "parser"

### 1.12.2 (Functions > Key > Arguments > Key Name)

Defina uma Object com os detalhes de cada argumento que sua função carrega, descrevendo-os da mesma forma que a função. O nome da key dessa Object deve ser o nome do argumento que você importou/exportou. Por exemplo, se você está importando "kill", então aqui também deve ser "kill".
- **Uso:** String com mesmo nome da função importada/exportada
- **Exemplo:** "kill"

### 1.12.3 (Functions > Key > Arguments > Type)

O tipo de argumento que você está recebendo. Por exemplo, se o "kill" é uma Object de funções, digite "Object". Se você definiu um valor padrão diferente do que espera receber, insira também isso (por exemplo, "Boolean / Object").
- **Uso:** String
- **Exemplo:** "Typeof"

### 1.12.4 (Functions > Key > Arguments > Value)

O valor padrão do argumento que você quer receber. Se o usuário não enviar um ou se você não receber um, este valor será usado como argumento da função.
- **Uso:** Tudo que for válido em JSON's
- **Exemplo:** 123

### 1.12.5 (Functions > Key > Description)

A descrição do que sua função faz. Seja breve ou detalhado, conforme necessário.
- **Uso:** String
- **Exemplo:** "Ajusta os valores de erro."

### 1.12.6 (Functions > Key > Type)

O tipo de valor que será definido nessa função. Pode ser "Boolean / Function" ou qualquer tipo que você espera.
- **Uso:** String
- **Exemplo:** "Boolean / Function"

### 1.12.7 (Functions > Key > Value)

O valor padrão. Como estamos falando de functions, insira "false" ou o valor que preferir. Lembre-se de definir o tipo na seção "Type" acima.
- **Uso:** Tudo que for válido em JSON's
- **Exemplo:** false

## 13. Configurações da Função

### 1.13 (Settings)

Uma object com configurações do que cada função tem permissão ou não de fazer, como imprimir erros, resetar, tempo para isso, etc. Mantenha as configurações padrão e adicione novas conforme necessário.
- **Uso:** Object com detalhes em formato de Object
- **Exemplo:**
  ```json
    {
        "nomeDaConfig": {
            "description": "Descrição do que ela faz",
            "type": "O tipo dela",
            "value": "O valor padrão dessa configuração"
        }
    }
  ```
- **Pode ser Modificado:** Somente adicionar novas configurações.

### 1.13.1 (Settings > Key)

O nome da configuração. Não importa para o resto do sistema, mas será usado por você, então dê um nome coerente.
- **Uso:** String
- **Exemplo:** "reconnect"

### 1.13.2 (Settings > Key > Description)

A descrição dessa configuração, ou seja, o que ela define no seu código.
- **Uso:** String
- **Exemplo:** "Define se deve reconectar a cada finalização."

## 14. Detalhes Adicionais

### 1.13.3 (Settings > Key > Type)

O tipo de configuração que ele é, ou seja, o tipo de valor que vai hospedar nisso.
- **Uso:** String
- **Exemplo:** "Number"

### 1.13.4 (Settings > Key > Value)

O valor padrão dessa configuração. Lembre-se de inserir o tipo correto no "Type" acima.
- **Uso:** Tudo que for válido em JSON's
- **Exemplo:** 8000

## 15. Parâmetros Adicionais

### 1.14 (Parameters)

Alguns parâmetros adicionais em forma de Object, utilizados no código como valores padrões de alguma coisa.
- **Uso:** Object com detalhes em formato de Object
- **Exemplo:**
   ```json
    {
        "nomeDoParametro": {
            "description": "Descrição do que ele é",
            "type": "O tipo dele",
            "value": "O valor de fábrica dele"
        }
    }
   ```
- **Pode ser Modificado:** Somente adicionar novos parâmetros.

### 1.14.1 (Parameters > Key)

O nome da key deve ser o mesmo usado na variável que você utiliza no código. Por exemplo, se sua constante se chama "leveling", então aqui também deve ser "leveling".
- **Uso:** String
- **Exemplo:** "details"

### 1.14.2 (Parameters > Key > Description)

A descrição desse parâmetro, ou seja, o que ele faz no seu código.
- **Uso:** String
- **Exemplo:** "Armazena a mensagem do último erro recebido."

### 1.14.3 (Parameters > Key > Type)

O tipo de valor que você está armazenando no parâmetro.
- **Uso:** String
- **Exemplo:** "Array"

### 1.14.4 (Parameters > Key > Value)

O valor padrão do seu parâmetro. Ele pode ser editado em tempo real usando a `envInfo`.
- **Uso:** Tudo que for válido em JSON's
- **Exemplo:** `{ "mickeyMouse": true }`

## 16. Resultados

### 1.15 (Results)

O lugar onde o resultado final é inserido. Os comandos e funções sempre retornam esta Object para quem executa, sendo assim, um `await Funcao()` nunca retorna um vazio, mas sim a `envInfo` do sistema executado.
- **Uso:** Object com detalhes em formato de Object
- **Exemplo:**
   ```json
    {
        "description": "Descrição do que é isso",
        "success": "Define se foi um sucesso",
        "type": "Define o tipo de valor recebido",
        "value": "O valor retornado na execução"
    }
   ```
- **Não Pode ser Modificado:** Não.

### 1.15.1 (Results > Description)

A descrição do que é esta object, já configurado com melhor valor.
- **Uso:** String
- **Exemplo:** "Armazena a mensagem do último erro recebido."

### 1.15.2 (Results > success)

Define se a função executou com sucesso, por padrão retorna que sim para evitar erros.
- **Uso:** String
- **Exemplo:** "details"

### 1.15.3 (Results > Type)

O tipo de valor retornado pela execução.
- **Uso:** String
- **Exemplo:** "Boolean"

### 1.15.4 (Results > Value)

O valor retornado pela execução.
- **Uso:** Tudo que for válido em NodeJS
- **Exemplo:** 666

</details>