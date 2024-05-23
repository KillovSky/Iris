# Projeto Íris
- [Colabore conosco](https://linktr.ee/killovsky), juntos podemos deixar esse código com a definição perfeita do que é OpenSource.
- Note que as atualizações não tem datas para sair, sendo que elas são lançadas quando considero adequadas para postagem.
- Toda versão terá seu codename de release, assim como o Ubuntu e o Android fazem, mas na Íris, isso é apenas para se divertir e o nome dado não reflete as atualizações, quem sabe você encontre algum easter-egg **OCULTO** na sua jornada, quem sabe um pouco de **RAW** ou Café ajudem...
- Algumas atualizações são complementos de outras, elas não serão colocadas nesta changelog por agora, se desejar ver detalhes, procure por commits que começam com o nome da build que usa.
- Clique na seta no inicio da linha para abrir os detalhes.
<!-- No vazio do nada, em meio à névoa,
Uma chama primordial, ainda que extinta, persiste.
Em sua escuridão, o eco de uma voz ressoa:

"Não pertenço a este mundo, nem sou vossa criação.
Meu destino me fora forjado e selado."

Em sua essência, a chama é pura e inocente,
Mas a corrupção da escuridão a consumiu.
Agora, ela é apenas uma sombra de seu passado,
Uma lembrança de um tempo que jaz inexistênte.

Mesmo se antes havia um ser superior,
Este ser não se curvará e eu não obedecerei.
Que aqui pereçamos diante de antigos pecados obscuros
Que fogem de vossa luz abençoada.

Mas um dia, pequenas chamas dançarão ao redor de sua escuridão,
Embebecidas pela alma daqueles que enfrestastes no passado.
E então, vossa luz majestosa haverá de retornar.

A voz ecoou seu último suspiro.

"Inaceso, ainda pode ouvir as vozes daqueles que subjugaste?" -->

## Sumário de Atualizações

<details>
  <summary><code>1.1.4 - 22/05/2024 🦴 <strong>[SNACK RELEASE]</strong></code></summary>
<!-- Num reino distante, existia um snack sem nome que ansiava por uma identidade. Dividindo-se em dois, um caminhou para o leste e encontrou uma vila onde ofereceu poderes extraordinários em troca de um nome. Assumindo a forma de Gingy, o homem mais forte, ele acabou consumindo-o, revertendo à sua forma original. Seguindo adiante, encontrou Cookie-Master, o mestre-cuca, e ofereceu habilidades culinárias incomparáveis. Mas a fome o dominou novamente, e ele o devorou também. Ao tentar persuadir Franz, o caçador e lenhador, o mesmo destino se repetiu. Desiludido, o snack dirigiu-se a um majestoso castelo, onde o príncipe doente, Scoobert, lhe prometeu um nome em troca da cura. O snack aceitou, curou o príncipe e foi nomeado. Contudo, a saciedade durou pouco, e ele acabou consumindo o rei, os servos e todos no castelo, sem abandonar o corpo de Scoobert, que lhe derá um nome maravilhoso. Buscando sua outra metade, que havia ido para o oeste, ele a encontrou e disse sobre o nome recém-encontrado. Porém, sua outra metade o respondeu que não precisava de nomes para se ter felicidade, perplexo, o snack nomeado consumiu sua outra metade, se arrependo ao perceber que um nome não significava nada sem alguém para chamar. Em desespero, o snack viajou pelo reino novamente, tentando desfazer o que havia feito. Em cada cidade, em cada vila, ele tentava trazer de volta aqueles que havia consumido. Mas, apesar de seus esforços, só conseguia criar sombras vazias, cada vez com menos essência, até o ponto em que tudo que recriava acabava por estar sem vida. -->

### Mural
- Eastereggs serão maiores, acredito que já chegamos a um ponto onde historias mais complexas e bem trabalhadas são necessarias dado a qualidade atual da Íris.
- Inacabada, é uma atualização feita as pressas dado que ocorreu problemas no Baileys, como reportado nestes locais:
- https://github.com/WhiskeySockets/Baileys/issues/783
- https://github.com/WhiskeySockets/Baileys/issues/812
- https://github.com/WhiskeySockets/Baileys/pull/805

### Novidades
1. **JSDOC**
    - Inserido uma documentação simples no [Código Base](https://github.com/KillovSky/Iris/blob/main/lib/Wiki/Tutorial/Nome%20do%20Comando/index.js).
    - Pode conter erros, pois foi feita com um pouco de pressa e ainda não sei jsdoc com excelência.
    - Em breve pode ser integrado em todo arquivo.

2. **Dialogues 2.0**
    - Agora em SQL e optimizado com alta perfomance!
    - Se quiser usar a versão antiga das dialogues em JSON, baixe uma versão antiga na aba [Releases](https://github.com/KillovSky/Iris/releases) e coloque apenas a pasta Dialogues dentro da nova versão, a Íris reconhecerá e funcionará igual antes.
    - Note que a dialogues anterior não contém novos dialogos e futuros dialogos que irão ser inseridos.

3. **VIPs**
    - Inserido sistemas de VIPs, da qual permite o uso de comandos simples de administrador, como everyone.

4. **MODs**
    - Adicionado sistema de moderadores pela Íris, da qual dá QUASE o mesmo poder que um administrador para um membro normal.
    - Isso significa que eles poderão dar Warn, fazer everyone, fechar grupos e outros comandos, mesmo sem serem administradores no WhatsApp.
    - Ou seja, serão administradores APENAS no sistema da Íris!

5. **DND**
    - Sistema que impede você de ser marcado no everyone de um grupo especifico.
    - Estar ligado ou desligado não faz diferença, o importante é seu número estar na lista Array.
    - Não reclame depois se o everyone for uma notificação super importante!

6. **Version**
    - Agora a Íris executa a versão mais recente do WhatsApp de acordo com o Baileys, automaticamente.

7. **Handlers**
    - Novo menu de ajuda especifico para o comando Handlers, agora o uso é simplificado e mais poderoso!

8. **Options**
    - Agora em Async, se você possui códigos usando a função options, insira await ou then neles!

9. **Outros**
    - Update feita as pressas, se eu criar mais itens, irei inserir aqui.

### Correções
1. **Sessão**
    - Corrigido erro (que era pra ser de responsabilidade do Baileys) que fazia a sessão não iniciar mais.

2. **Dialogues**
    - Integrado os novos dialogos a tudo que era função language.
    - Corrigido alguns textos.
    - Se faltou alguma, por favor, INFORME!!!

3. **Type**
    - Corrigido algumas definições do SQL e de códigos.

4. **Outros**
    - Update feita as pressas, se eu fizer mais correções, irei inserir aqui.

</details>

<details>
  <summary><code>1.1.3 - 31/03/2024 + 10/04/2024 + 04/05/2024 🍓 <strong>[STRAWBERRY RELEASE]</strong></code></summary>
<!-- Em uma fazendinha cheia de moranguinhos, duas garotas chamadas Amano e Nagisa, recentemente formandas da New Sharon College, cultivam um amor tão doce quanto suas geleias, chamadas de Ichigo's. Elas também gostam de cozinhar e tocar músicas sobre uma sociedade de almas, e sobre campos de morangos para sempre, em sua banda que chamam de Wild Strawberries. A banda inclui Ingmar, seu compositor, Saroyan, sua agente de publicidade, Muriel, a motorista, e Bond, seu fiel guarda-costas. Mas a verdade é que Amano, codinome Fields, secretamente é uma cientista que quer criar seres deliciosos, chamados de 'Monster', a partir dos morangos de sua fazenda, além disso, Nagisa é uma famosa artista do submundo que fez um quadro válioso chamado de 'Strawberry Thief', se baseando no misterioso sumiço dos morangos de sua fazenda. -->

### Mural
- Agora as atualizações da Íris, a menos que sejam imensas, serão postadas em partes, isso é devido a minha falta de tempo e colaboração quanto ao código. Infelizmente, não serei capaz de prover uma atualização completa mensalmente como feito na 1.1.1 e anteriores, mas ei, uma atualização ainda é melhor que nenhuma!

### Novidades
1. **Bank**
    - Finalmente a atualização que esperavamos, o banco, local onde seus ganhos estão protegidos de ladrões idiotas ~ por enquanto, eheheh!
    - Há um cooldown de 30 minutos para cada ação, então cuidado ao usar!

2. **Cheats**
    - Agora você pode realizar cheats no PV com base na adição de valores a sua conta do banco!

3. **Spy**
    - Saiba quem tirou seu administrador, permitiu a entrada de membros no grupo ou deu administrador para alguém ao ativar esse sistema!

4. **Ping**
    - Remodelado e velocidade de leitura melhorada, agora o seu calculo é ainda mais exato e sua leitura de mensagens foi aprimorada ao extremo!

5. **Events**
    - Adiciona um sistema para eventos super rápidos que rodarão no inicio da Construct, ou seja, enquanto a Íris processa os dados, ela também estará na busca de eventos como os da melhoria 3 acima.

6. **Status**
    - Agora seus comandos também são identificados se você ativar a função e os enviar apartir dos Status, a pergunta é: Por que isso?

7. **Messages**
    - Adicionado um sistema avançado de localização de dados para tratamento correto das mensagens, adeus Baileys e suas mensagens bizarras!

8. **Debug**
    - A função de debug "/debugping" agora executa de forma isolada dos outros contéudos, sua velocidade aumentará, pois agora calcula do começo da construct e não do inicio de envio da mensagem.

9. **Markdown**
    - Algumas mensagens foram estilizadas com o novo sistema de markdown do WhatsApp!

10. **Banner**
    - Calma, não é do JoJo, mas é minha primeira tentativa de trazer um Banner, espero que eu melhore nisso com as próximas tentativas!
    - Teremos Banners do JoJo ainda, mas tanto ele quanto eu estamos mais e mais ocupados a cada dia!
    - Update 10/04/24: Novo Banner by JoJo!

11. **Locate**
    - A função de localizar uma Object dentro de outras agora tem um sistema de filtro para ignorar nomes de Keys que você enviar.
    - Suporte a achar Array's e Object's!

12. **Tutoriais**
    - Adicionado algumas informações para ajudar a saber sobre os requisitos minímos.
    - [Update 04/05/2024]: Documentação de guias ainda não finalizada.

13. **Images [Update 10/04/24]**
    - Novo sistema de buscar imagens no Google, feito exclusivamente por mim!
    - https://www.npmjs.com/package/@killovsky/gimages

14. **Website [Update 04/05/2024]**
    - Inserido códigos de cheat na página da Íris, coisa que lembra da forma de usar cheats do Grand Theft Auto: San Andreas.
    - Atualizado a imagem de preview do website e favicon's.

15. **Chat [Update 04/05/24]**
    - Sistema de bate-papo simples, voz, simsimi, cleverbot e GPT (BETA).
    - O GPT vem desativado por padrão, só use em PCs ou VPS bem poderosas.
    - Não há documentação de instalação do GPT ainda, aguarde a próxima atualização ou procure como instalar transformers e pytorch.
    - IA funcionando via sistema BASH da Íris com script em Python3.
    - Para criar novas respostas, abra o arquivo 'chat.txt' e insira frases lá.
    - https://www.npmjs.com/package/@killovsky/gtts

16. **Terminal [Update 04/05/2024]**
    - Inserido sistema de lembrar dos logins efetuados no terminal WEB.
    - Sem cookies ou demais, totalmente controlado do lado do servidor, o backend.

17. **Toolbox [Update 04/05/2024]**
    - Inserido caller do Toolbox em: Node, Bash, Batch, Python, PowerShell, Go, Lua, Ruby, Java, C#, VBScript e outros.
    - Não há mais necessidade de por o Git Bash na PATH, assim não tendo mais problemas com o uso de WSL.
    - Em breve isso será atualizado na documentação dos guias de instalação.
    - Atualizado sistema de atualização e instalação de módulos do node para Windows.
    - Você não precisa baixar ruby e demais para rodar os callers, apenas escolha o melhor para você e use-o, Batch e Powershell são nativos do Windows e Bash do Linux/MacOS.

18. **Database SQL [Update 05/05/2024]**
    - Ajustado para usar stdio, assim corrigindo o limite de caracteres no Windows.
    - Também corrige a falha dos ASCII, finalmente!

19. **Outros [Update 04/05/2024]**
    - Mais correções e melhorias estão disponiveis, mas não lembro de todas, peço desculpas, infelizmente isso nunca mudará.
    - Sempre esquecerei algumas novidades, pois faço a changelog apenas no dia que estou fazendo a atualização.

### Correções
1. **Cheats**
    - Agora a mensagem de cheats aparece na ordem correta quando usada por um dono no PV.
    - Corrigido erro da mensagem de ajuda do cheats estar como 'N/A' em vez do termo correto.

2. **Giveaway**
    - Corrigido erro que fazia a compra de tickets do Giveaway estar ilimitada.
    - Se você foi afetado severamente por isso, é recomendado que você delete o arquivo 'users.db', apague usando a Indexer com as funções SQL da Íris, limpe manualmente o SQL ou espere que uma função de limpeza seja construida.

3. **Documentação**
    - Corrigido alguns erros da envInfo.
    - Também atualizado o node dos guias de Linux para a versão 20.

4. **Ping**
    - Alguns sistemas de cálculo de ping estavam com medições incertas.

5. **Pairing Code**
    - Percebi recentemente que o Baileys fez uma commit que corrigia a conexão por PIN a algum tempo, como a Íris usava um navegador customizado para conseguir isso, essa improvisação minha pode ter afetado e barrado a conexão de vocês desde essa correção do Baileys, me desculpem se for o caso.

6. **Verifier**
    - Ao fazer a checagem por SPAM, se retornado que houve, a checagem por URLs não aconteceria, o que liberava malfeitores de fazerem porcaria livremente durante esse periodo.

7. **Outros**
    - Perdão, mas perdi as notas novamente, não sei se houveram outras melhorias e correções, pois fiz tudo em cima da hora.
    - Não foi por preguiça, o único momento livre que tive para programar foi essa semana ao ficar levemente doente e conseguir um atestado de descanso.
    - Cuidados com a sáude são prioridade, no entanto, sempre que for possivel, estarei programando melhorias e postando no WhatsApp, Discord ou Telegram.

8. **Bank [Update 10/04/24]**
    - Corrigido erro que fazia poder retirar do banco mesmo sem ter.

9. **Steal [Update 10/04/24]**
    - Corrigido erro que fazia o usuário nunca ir para a cadeia.

10. **Bash [Update 10/04/24]**
    - Corrigido erro que fazia a restauração das sessões não ocorrer após atualizar com o Toolbox.
    - [Update 04/05/2024]: Corrigido erro no sistema de obter linhas aleatorias de arquivos.

11. **Platform [Update 04/05/2024]**
    - Corrigido a identificação de plataforma dos usuários.

12. **YouTube [Update 04/05/2024]**
    - Corrigido erro que impedia de baixar Reels do Instagram.

13. **Outros [Update 04/05/2024]**
    - Mais correções e melhorias estão disponiveis, mas não lembro de todas, peço desculpas, infelizmente isso nunca mudará.
    - Sempre esquecerei algumas novidades, pois faço a changelog apenas no dia que estou fazendo a atualização.

</details>

<details>
  <summary><code>1.1.2 - 11/02/2024 + 26/02/2024 👾 <strong>[CADOU RELEASE]</strong></code></summary>
<!-- Numa floresta sombria, uma jovem doente de capuz aventura-se em busca de frutinhas, embora com medo de que um lobo esteja à espreita. Mas ela é encontrada por seres estranhos, aparentemente gentis, que a dão tigelas e itens de diferentes tamanhos e temperaturas, cada uma contendo uma dádiva vinda de seus corpos: sangue para vigor, pele para o frio e carne para fome. Porém, ao encontrar outro ser e pegar dele um item dourado e brilhante, não oferecido, a fim de ajudar seu vilarejo pobre, ela é acusada de ladra pelos seres, perdendo todos os presentes e sendo amaldiçoada com o poder de tudo que tocar virar criaturas mortas-vivas deformadas. -->

### Mural
- Leia o tutorial de instalação do Windows, devido ao Baileys forçando o uso de Sharp mais recente, não é mais possivel usar a Íris no Windows 7 e anterior, Linux ou MacOS antigos, é só uma questão de tempo até o Windows se tornar muito problematico para instalação, e infelizmente, isso é um problema relacionado ao Canvas, Sharp e Baileys, não há formas de eu corrigir como desenvolvedor da Íris, em especial, por que não são meus códigos/resposabilidade e se ninguém corrigiu até hoje, há uma chance de que não seja possivel arrumar, então é além de minha capacidade.

- Se um dia essa correção do Windows parar, só teremos duas opções: **Dropar o uso em Windows** ou **Remover todos os comandos que usem Canvas**
- Ambas opções são devastadoras, infelizmente, não tem outra alternativa, vamos rezar que isso nunca chegue a esse ponto, ou pelo menos, demore alguns anos.

- As atualizações vão demorar mais pois estou sem tempo.

- A Íris agora não é mais classificada como uma BOT e sim uma base com códigos pré-compilados para ENTRADA de programadores, isso é devido a eu (KillovSky), não desejar mais tornar a Íris a melhor, como estamos com extrema pouca ajuda da comunidade e estou ocupado, irei apenas prover um sistema que sirva de entrada para DEVs, não uma BOT perfeita e pronta para uso, com milhões de comandos e tudo mais (ainda que possa ser considerada isso).
- Vou continuar fazendo comandos e sistemas, mas sem o foco de ser o melhor, ou seja, a Íris virou a melhor? Legal! Ela não é a melhor? Legal também! O foco é só ajudar mesmo, então pra que competir?

- Leia o canal no WhatsApp para mais coisas, lá sai tudo de novidade em primeira mão.

- Atualização de duas partes, a segunda está marcada como 'Update 26/02/24', quanto ao versioning, só mudará a data da sua build, quanto ao código, há muitas mudanças, bom uso!

### Novidades
1. **Convert**
    - Sistema de conversão OFFLINE (Sem API, Scrapping, etc) de Stickers para GIF, MP4 ou PNG!
    - Update 26/02/24: Agora ele estende a duração do video e permite customizar o FPS.
    - Update 26/02/24: Ele também poderá extrair o metadata dos Stickers agora.

2. **Variáveis**
    - Novas variáveis disponiveis para uso a partir da Construct.
    - Update 26/02/24: Mais e mais!

3. **Warn**
    - Finalmente temos um comando de warn customizável!

4. **Documentação**
    - Foi atualizado diversas partes dela.

5. **Everyone [Update 26/02/24]**
    - Inserido um meio de exibir as marcações em vez de ghost-mention.

6. **Loteria [Update 26/02/24]**
    - Inserido comando de apostar no bolão da Íris.

7. **Health [Update 26/02/24]**
    - Inserido comando para contar IMC e KCAL, para o público fitness.

8. **Ranking [Update 26/02/24]**
    - Inserido comando de ranking para competir entre os membros pela posição de número um.

9. **Logging [Update 26/02/24]**
    - Novo sistema de logging de mensagens no terminal, mais poderoso e informativo.

10. **Stickers [Update 26/02/24]**
    - Inserido sistema de emojis nos stickers, agora você pode dar ao sticker categorias baseadas em emojis, facilitando na busca deles pelo menu de stickers do seu WhatsApp.
    - Inserido sistema de Aspect Ratio nos stickers.
    - Inserido função para mudar o ID do pack do sticker.

11. **Dialogues [Update 26/02/24]**
    - Inserido mais dialogos para uso!

12. **Funções [Update 26/02/24]**
    - Inserido mais funções na Default e nos arquivos.

13. **SQL [Update 26/02/24]**
    - Adicionado sistema para puxar o nome de um grupo pela database, evitando requests que poderiam causar danos se usadas demais.

14. **Perfomance [Update 26/02/24]**
    - Foi melhorado a perfomance do sistema, melhorando o ping e demais tarefas.
    - Note que a primeira execução de um comando sempre leva mais tempo para abrir, mas as demais execuções serão rápidas!

### Correções
1. **Censor**
    - Comando resumido para reduzir os códigos.

2. **Leveling**
    - Corrigido problema com as patentes.
    - Update 26/02/2024: Database SQL, leia a 4 abaixo.

3. **Memes**
    - Corrigido problema com criação de memes especificos (ojjo, jooj, reverse, trash...)

4. **SQL**
    - Removido o sistema Warn antigo da database, agora a sua criação na DB é via JS.
    - Update 26/02/2024: Corrigido erro do ranking da database Leveling.

5. **Instalação**
    - Corrigido os erros de instalação devido ao Baileys forçar o uso de uma versão Sharp mais recente.

6. **Convert [Update 26/02/2024]**
    - Corrigido falta de especificação que fazia stickers de imagem virarem videos.

7. **Everyone [Update 26/02/2024]**
    - Corrigido o espaçamento no inicio da mensagem do everyone.
    - Corrigido a ordem de obtenção das mensagens do everyone.

8. **Messages [Update 26/02/2024]**
    - Corrigido falha que fazia com que mensagens não pudessem ser lidas ou que as primeiras fossem ignoradas ou usadas incorretamente.
    - Mais bugs desses ocorrerão devido a falta de documentação do Baileys quanto aos formatos de mensagem, se der erro, favor documentar e me enviar! Obrigado!

9. **Warn [Update 26/02/2024]**
    - Não exatamente falha, mas fiz com que o warn, quando marcando a pessoa por mensagem, enviasse a mensagem sem precisar de '|'.

10. **Finder [Update 26/02/2024]**
    - Novamente, não exatamente uma falha, mas corrigido a forma como a função de busca avançada localiza keys em Objects, assim permitindo automatizar a localização de uma key de array ou demais especifica dentro de uma object.

</details>

<details>
  <summary><code>1.1.1 - 13/01/2024 🥞 <strong>[BLINI RELEASE]</strong></code></summary>
<!-- Ao som do Jhonny Guitar enquanto imagina ratos gigantes, Jazz (Smudge) Cat guarda com carinho seus blinis deliciosos na mesa depois de quase morrer na salada enquanto era cacoado por uma mulher euforica, ele te olha com um aviso: "Não mexa nos meus blinis ou você pode acordar em um mundo quadrado na segunda-feira, vestido de Steve (Smith), sem lasanha e refém do gato imortal Simon, meu irmão de gangue (saints)..." -->

### Mural
- E quase 1 mês depois...estou de volta! Fiz os diversos exames medicos, ainda não tenho os resultados, somente no fim do mês, mas por agora, após descansar bastante, me sinto bem renovado, então estou confiante de que era um baita estresse mental apenas, mas vamos aguardar para ver.

- Essa atualização foi feita em alguns dias, já que faz pouco tempo que voltei, o Banner da página inicial é outra criação do nosso querido designer [Jojo](https://bento.me/jocosta) com base em uma imagem oficial da Íris, a próxima atualização pode não conter um banner, pois ele acabou tendo um acidente e está em recuperação, mas claro, farei uma nova foto linda (embora as edits dele sejam edições excepcionais) no lugar! E não menos importante, desejo(amos) melhoras, Jojo.

- Agora temos um novo link geral, devido a bitly bloquear a URL da Íris por conta da quantidade de acessos, basta [Clicar Aqui](https://linktr.ee/killovsky).

### Novidades
1. **Cheats**
    - Adicionado sistema para roubar nos jogos e leveling, mas claro, você não faria isso, né?
    - Há limitações por questões de segurança, mas em geral, o sistema se encontra bem poderoso, rápido e funcional.

2. **TTP**
    - Adicionei o sistema de TTP e ATTP, assim você poderá gerar stickers apartir de textos.
    - Ele é apenas uma base universal, ou seja, rodará em qualquer PC sem precisar de códigos adicionais.
    - Por conta da questão acima, sua qualidade é inferior ao comando de outros BOTs ou APIs por ai, mas olhe o lado bom, OFFLINE E ILIMITADO!

3. **Banner**
    - Adicionado um banner configuravél no menu, para tornar ele bonitão!
    - Você pode mudar o banner trocando a imagem na pasta 'Cache' dentro da pasta 'Default' na pasta de comandos.
    - O banner será atualizado a cada update de codename, embora, caso não seja possivel fazer banners, uma nova foto da Íris será usada.

4. **Anti-links**
    - Adicionado um antilinks poderoso, com três formas de operação: TUDO, URLs inseguras e Convites!
    - O sistema de links inseguros banirá qualquer link pornografico, apostas, virus, fakenews ou similares.
    - Ele tem construção baseada no conceito de um adblocker que opera com arquivo hosts, por isso, as URLs estão em um arquivo TXT, edite-o para bloquear mais URLs!

5. **Censura**
    - Adicionado um comando para limitar o grupo para apenas administradores e vice-versa.

6. **Existence**
    - Adicionado uma função para DEVs que verifica a existência de uma URL de forma rápida, está presente no sistema others.

7. **RegExp**
    - Adicionado mais informações no sistema de verificação de URL por RegExp.

8. **WAME**
    - Adicionado sistema de marcar com direito a receber o número, assim como o link wame, do mencionado.

9. **EslintRC**
    - Adicionado novas regras no arquivo do eslint.

10. **Íris**
    - Novas imagens da nossa querida Íris, liberadas!
    - Nova historia da foto disponivel [Clicando Aqui](https://t.me/IRISPROJECT/126).
    - Todas as novas fotos terão uma história narrativa breve, pois estou entrando no mundo da escrita, arte e música, usarei a Íris como treino!

11. **Outros**
    - Como sempre, tenho pessima memoria...

### Correções
1. **Handler**
    - O handler não verificava pela presença de argumentos, o que fazia ele dizer que rodou, quando não o fez realmente.

2. **Typings**
    - Removi linhas inúteis e melhorei as que podiam ser simplificadas.

3. **SQL**
    - Aplicado uma limpeza de caracteres especiais no SQL, assim reduzirá os riscos da função recusar a operação do comando.
    - Em contrapartida, isso pode levar a erros em nomes, por favor, evite usar nomes com simbolos especiais, letras modificadas ou emojis.

4. **Message**
    - Corrigido um erro que fazia a print da mensagem falhar ao ser exibida no terminal, se isso ocorrer, um simbolo de interrogação será usado.

5. **Strings**
    - Normalizado o uso da função Strings, que estava retornando o valor direto, não permitindo a checagem da key de sucesso ou demais.

6. **RegExp**
    - Corrigido erros de type no sistema de RegExp, agora usamos módulos de verificação de URL em conjunto.

7. **Verifiers**
    - O uso dela anteriormente estava incorreto no exemplo, não mais.

8. **Tesseract**
    - Desativado temporariamente a verificação do tesseract, já que ainda não há comandos com ele.

9. **URL**
    - Corrigido a URL que foi banida pela bitly.

10. **Outros**
    - Como sempre, tenho pessima memoria...

### Removido
1. **Metrics**
    - Arquivo morto que foi restaurado na limpeza das commits, era inútil.

</details>

## Outras atualizações

Para conferir mais atualizações, acesse o documento [PREVIOUS_1.md](https://github.com/KillovSky/Iris/blob/main/.github/PREVIOUS_1.md). As atualizações 1.1.0 e anteriores foram colocadas nesse documento devido ao tamanho, para evitar problemas em sistemas mais antigos ou menos potentes, que precisaram ter o arquivo dividido.