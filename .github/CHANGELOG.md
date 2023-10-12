# Projeto Íris

- [Colabore conosco](https://bit.ly/BOT-IRIS), juntos podemos deixar esse código com a definição perfeita do que é OpenSource.
- Note que as atualizações não tem datas para sair, sendo que elas são lançadas quando considero adequadas para postagem.

## 1.0.1 - 11/10/2023

### Novidades

1. **Menu de construção automática**
    - Implementado um novo menu de construção automática, feito em Bash Scripting, que permite aos usuários criar seus menus de forma mais rápida e fácil, categorizando os comandos por pasta.
2. **Sistema de ativações de funções parcial**
    - Implementado um sistema de ativações de funções parcial, que permite aos usuários ativar sistemas específicos, como o welcome, vips e outros, no entanto, não há uso ainda.
3. **Sistema de welcome, goodbye, antifake, vip, mod, whitelist, blacklist e outros parcialmente implementado**
    - Não é recomendado o uso, pois não foram feitos testes, podem ocorrer diversos erros, a recomendação é nem tentar ativa-los se não for um desenvolvedor.
4. **Tutorial atualizado**
    - O tutorial foi atualizado para explicar como usar o novo menu de construção automática.
5. **Gitignore atualizada**
    - A Gitignore foi atualizada para evitar upload acidental de arquivos importantes, como sessão, backups ou configurações.
6. **Security atualizado**
    - Leia [esse arquivo](https://github.com/KillovSky/Iris/blob/main/.github/SECURITY.md) se estiver em dúvida sobre a segurança do seus dados no Projeto Íris.

### Correções

1. **Play funcionando sem argumentos**
    - Corrigido um problema que fazia com que o comando `play` funcionasse mesmo sem especificar o nome da mídia.
2. **Sistema de criação de databases em SQLite3**
    - Corrigido um problema que fazia com que o sistema de criação de databases em SQLite3 gerasse arquivos incorretos ou não fosse chamado.
3. **Sistema de backups**
    - Corrigido um problema que fazia com que o sistema de backups criasse arquivos em desordem e sem limitação.
4. **Comandos do 'Default' que ainda usavam OpenWA ou estavam incorretos**
    - Corrigido alguns comandos da 'Default' que ainda usam `kill.reply`, `kill.sendText` ou outros tipos, além de má definição da marcação.
5. **Dezenas de linhas do sistema 'construct'**
    - Corrigido (parcialmente) o sistema coletor de dados para utilização local nos comandos, ele possuia falhas em relação a databases.

### Bugs ainda não corrigidos

1. **Baileys disparando as funções da Íris sem esperar o escaneamento do QR Code**
    - Um bug ainda não corrigido faz com que o baileys dispare as funções da Íris sem esperar o escaneamento do QR Code.
	- Esse bug não acontece em sessões já escaneadas, sendo só na primeira vez.
2. **Necessidade de reinicio manual após a primeira vez escaneando o QR Code**
    - Um bug ainda não corrigido faz com que seja necessário reiniciar o bot manualmente após a primeira vez escaneando o QR Code.
	- Quando você tiver escaneado a primeira vez, não haverá necessidade de escanear novamente, nunca mais ocorrendo esse bug.
3. **Sistemas parciais não testados**
    - Os sistemas de implementação parcial ainda não foram testados completamente, portanto, vão conter bugs.
4. **Raro: Problema na atualização da sessão**
	- Em casos de receber mensagens fora do padrão do WhatsApp, pode ocorrer um erro de atualização da sessão em database.
	- Um exemplo de mensagens assim são as de BOTs que aproveitam o código para gerar mensagens que não são oficialmente suportadas.
	- Esse erro não apresenta risco, uma vez que é relativo a inserção de atualização na database local.
	- Não testado, mas reiniciar/desligar após o erro pode causar uma desconexão em casos raros, mas note, estou especulando sobre isso.