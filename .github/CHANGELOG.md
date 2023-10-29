# Projeto Íris

- [Colabore conosco](https://bit.ly/BOT-IRIS), juntos podemos deixar esse código com a definição perfeita do que é OpenSource.
- Note que as atualizações não tem datas para sair, sendo que elas são lançadas quando considero adequadas para postagem.

## 1.0.5 - 29/10/2023

Importante: Leia a descrição da commit 'Release 1.0.5' antes de prosseguir

### Novidades
1. **Memes**
	- Adicionado alguns comandos de memes usando nada menos que Canvas! Em breve muito, muitooo mais!
2. **Language**
	- Novo sistema seletor de idiomas, agora gringos podem usar outros idiomas isoladamente sem afetar o idioma geral da Íris.
3. **Personal Data**
	- Adicionado algumas databases de uso pessoal e premodelação para futuros usos dela.
4. **SQL Collector**
	- Mais informações disponiveis no nosso sistema de SQL, em breve terá uso.
5. **ViewOnce**
	- Implementado o sistema de visualização única no Construct, ainda não há comandos usando, mas ele pode ser identificado e usado agora.
6. **Contadores**
	- Implementei o sistema de leveling parcialmente, por hora só aumenta o contador de mensagens e o XP da pessoa.
7. **Mentions**
	- Atualizei os comandos para funcionarem com marcação na mensagem, marcando a mensagem e outros.
8. **Pushname**
	- Sistema de database para obter os nomes usados anteriormente, caso a pessoa retire o atual ou ele se encontre ilegivel pela Íris.
9. **Configs**
    - Adicionado novas configurações que possibilitam maior customização do collector nas mensagens.
10. **Welcome/Goodbye - Canvas**
    - Adicionado cartão de entrada e saída usando canvas com mensagens customizadas!
11. **Leveling - Canvas**
    - Implementação parcial do nosso sistema de leveling no card de canvas.
12. **Profiling**
    - Implementado sistema de obter a foto avançadamente, não dropa erros, ao contrario do sistema do Baileys.
13. **SQL Private**
    - Implementado uso de comandos SQL no PV, atualmente o foco é apenas criar a database e usar o language para customizar seu idioma.
14. **Help Menu**
    - Implementei o menu de ajuda onde faltava.

### Correções
1. **Sessão**
    - Havia uma falha desconhecida que fazia a sessão nunca funcionar novamente após ela.
2. **Stickers ViewOnce**
    - Os stickers em marcação ou mensagem de visualização única falhavam.
3. **Alias**
    - Apesar de não detectado oficial em nenhum sistema e nenhum report a mais, fiz uma correção extra que adiciona alias automaticamente, corrigindo a falha (?) presente na [PR #611](https://github.com/KillovSky/Iris/pull/611).
4. **Documentação**
    - Aprimorado a documentação do Termux afim de se rodar Canvas.
    - Se seu Linux tiver problemas para instalar, tente os comandos apt do Termux.

### Removido
1. **Arquivos Inutéis**
    - Removi ALGUNS arquivos inutéis sem uso atualmente, futuramente podem ser usados, claro.
2. **Sistema REM**
    - Removido o sistema REM do handler para strings, uma vez que só vamos trocar ou resetar as strings, não retirar parcialmente valores.

## 1.0.4 - 22/10/2023

### Novidades
1. **Issue Template**
	- Agora os desenvolvedores terão todas as informações que precisam.
2. **Readme.md**
	- Apresentando aqui nossa nova interface do Projeto Íris!
3. **Instalação**
	- Adicionado tutoriais super completos de como fazer a instalação no Termux, Windows e Linux.
4. **NASA**
	- Implementado o comando de obter a APOD da NASA.
5. **Whitelist**
	- Implementado o sistema de whitelist para não banir mesmo na blacklist e demais.
6. **APIs**
	- Implementei o sistema de APIs de volta, embora por hora só usemos o da NASA.
	
### Correções
1. **Custom Prefix**
	- Ativar o prefix customizado antes de inserir um causava erros.
2. **Arquivos HTML e MD**
	- Corrigi algumas falhas nos arquivos MD e mudei a localização dos arquivos HTML.
3. **Dialogue Picker**
	- Dei um nome mais chamativo aos sistemas de dialogo, pra ajudar no Visual Code Studio.
4. **Prefix**
	- O prefix '^' estava duplicado na configuração.
5. **Fundings**
	- Corrigi os links presentes no arquivo de doações.
6. **Blacklist e AntiFake**
	- Agora o Blacklist e o AntiFake funcionam adequadamente.
7. **Linhas**
	- Corrigido a formatação incorreta presente em alguns arquivos, mudando de CRLF para LF.

### Removido
1. **Termux.txt**
	- Por que esse arquivo se temos um baita guia bem explicado agora?

## 1.0.3 - 21/10/2023

### Novidades
1. **Verificação de requisitos mínimos**
    - Não se preocupe com PCs ruins, isso é para saber se você instalou os programas, tendo eles, roda.
2. **Obtenção de array de comandos**
    - Nosso bom e incrivel menu em Bash agora vai retornar os comandos em formato array ou menu completo.
3. **Filtragem de mensagens e comandos da Íris**
    - Íris não executará mais as próprias mensagens, visto que isso é uma falha de segurança.
4. **Implementação parcial do leveling e banking**
    - Os dados dos dois já estão disponiveis para construção de sistemas de jogo na database SQL.
5. **Menu atualizado**
    - O sistema do menu agora exibe o prefix para tornar mais fácil de saber como usar.
6. **Guia de contribuição**
    - Adicionei um pequeno guia de como contribuir com o Projeto Íris, leia [aqui](https://github.com/KillovSky/Iris/blob/main/.github/CONTRIBUTING.md).

### Correções
1. **Formatação**
    - Alguns arquivos estavam com tabs em vez de espaço, o que é uma quebra do nosso linter (pode haver mais ainda).
2. **Porta HTTPS do Terminal-WEB**
    - Não importava o que inserisse, o terminal-web utilizava a mesma porta que http.
3. **Inserção de valores na database**
    - Alguns dados de formato array não se inseriam na database, ainda pode haver dados que darão erros, pois a database está em produção parcial e bugs são esperados.
    - Alguns comandos não se desativavam, além disso, comandos como mudar prefix foram corrigidos.
4. **TODOS os arquivos SQL desatualizados**
    - Alguns sistemas SQL estavam usando códigos da OpenWA, foram migrados para funcionar em baileys agora.
5. **Localização de pastas**
    - Alguns sistemas estavam indo no literal e tentando acessar pastas de comandos em modo case sensitive, dando erros.
6. **Symlinks**
    - Corrigi algumas chamadas que davam erros ao usar o Indexer com proposito de eventos de entrada e saida de users.
7. **Download de mídias no IOS**
    - Corrigido o problema de não conseguir abrir os documentos enviados no Play estando em um IPhone (IOS).
8. **Uso do comando Handlers**
    - O comando handlers pedia por ADM, dono, vip ou moderador para usar.
9. **Impressão dos erros**
    - A maioria dos sistemas não tinha permisssão de printar erros.
10. **Sistema de update**
    - O sistema de update estava redirecionado a um projeto paralelo que não existe mais.

### Removido
1. **Alguns prefixos**
    - Removi o prefix '?', '.' e '#' por serem usados bastante sem intuito com comandos.

## 1.0.2 - 13/10/2023

### Novidades
1. **Gitignore atualizado**
	- Atualizado o gitignore para refletir nas mudanças realizadas com a sessão.
2. **Novo Backup**
	- O sistema de backup antigo fazia copias de todos os arquivos que encontrasse seguindo a RegExp do bash, agora ela faz um backup somente das configurações e databases de comandos, não inserindo os arquivos JSON opcionais, como os da envInfo.
3. **Mudança de instalação**
	- Estavamos usando a GitHub do módulo Baileys em vez de usar o módulo NPM do mesmo, essa dica foi dada pelo @lucassaud na [Issue #608 -> Utilizar o Baileys da NPM em vez do repositório GitHub](https://github.com/KillovSky/Iris/issues/608).
4. **Dialogos de espera**
	- Foi adicionado mais dialogos nos casos de comandos de espera, como YouTube, cortesia de @hypegg em sua [PR #607 -> Added new messages on hold](https://github.com/KillovSky/Iris/pull/607).
5. **Atualizado a lista de dependencias**
	- Algumas dependencias como `python 3.7>` não estavam apontadas como necessarias.

### Correções

1. **Sistemas parciais revisados**
	- Welcome e Goodbye estão funcionando perfeitamente com suporte a mensagens customizadas, no entanto, os sistemas de moderador, promote, vips e demote podem não estar totalmente corretos ainda, evite-os.
2. **Status da conexão**
	- Por algum milagre, a sessão continuava online mesmo precisando de um reinicio, agora ela reinicia adequadamente conforme as mudanças, corrigindo também o erro de precisar reiniciar manualmente no primeiro escaneamento.
3. **Obtenção de alguns dados**
	- Alguns dados, mais especificadamente o log de inicio e o número da BOT, estavam sendo obtidos antes da inicialização completa, agora eles são obtidos antes de detectar a primeira mensagem.
4. **Sessão**
	- O salvamento da sessão era realizado usando `baileysBottle` que está, aparentemente, arquivado, então foi migrado para o uso das funções padrões do Baileys, o que aumenta consideravelmente a quantidade de arquivos, mas reduz a quantidade de módulos externos necessarios, corrigindo também erros de instalação relacionados a incompatibilidade do NodeJS e a versão antiga do Baileys.
5. **Dependencias inuteis**
	- Foi removido alguns modulos que não eram mais necessarios devido a já estarem inclusos em outros ou não serem mais usados.
6. **Database SQL**
	- Corrigido um erro que fazia as databases serem criados com valor de ID `false` em vez da ID de um chat.

### Bugs ainda não corrigidos

1. **Códigos sem utilização**
	- Existem diversos códigos ainda sem uma implementação, estarei focando em construir os mesmos.

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