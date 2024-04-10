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
  <summary><code>1.1.3 - 31/03/2024 + 10/04/2024 🍓 <strong>[STRAWBERRY RELEASE]</strong></code></summary>
<!-- Em uma fazendinha cheia de moranguinhos, duas garotas chamadas Amano e Nagisa, recentemente formandas da New Sharon College, cultivam um amor tão doce quanto suas geleias, chamadas de Ichigo's. Elas também gostam de cozinhar e tocar músicas sobre uma sociedade de almas, e sobre campos de morangos para sempre, em sua banda que chamam de Wild Strawberries. A banda inclui Ingmar, seu compositor, Saroyan, sua agente de publicidade, Muriel, a motorista, e Bond, seu fiel guarda-costas. Mas a verdade é que Amano, codinome Fields, secretamente é uma cientista que quer criar seres deliciosos, chamados de 'Monster', a partir dos morangos de sua fazenda, além disso, Nagisa é uma famosa artista do submundo que fez um quadro válioso chamado de 'Strawberry Thief', se baseando no misterioso sumiço dos morangos de sua fazenda. -->

### Mural
- Atualização parcial, ou seja, haverá mais partes.
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

13. **Images [Update 10/04/24]**
    - Novo sistema de buscar imagens no Google, feito exclusivamente por mim!
    - https://www.npmjs.com/package/@killovsky/gimages

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
    - Update 26/02/24: Database SQL, leia a 4 abaixo.

3. **Memes**
    - Corrigido problema com criação de memes especificos (ojjo, jooj, reverse, trash...)

4. **SQL**
    - Removido o sistema Warn antigo da database, agora a sua criação na DB é via JS.
    - Update 26/02/24: Corrigido erro do ranking da database Leveling.

5. **Instalação**
    - Corrigido os erros de instalação devido ao Baileys forçar o uso de uma versão Sharp mais recente.

6. **Convert [Update 26/02/24]**
    - Corrigido falta de especificação que fazia stickers de imagem virarem videos.

7. **Everyone [Update 26/02/24]**
    - Corrigido o espaçamento no inicio da mensagem do everyone.
    - Corrigido a ordem de obtenção das mensagens do everyone.

8. **Messages [Update 26/02/24]**
    - Corrigido falha que fazia com que mensagens não pudessem ser lidas ou que as primeiras fossem ignoradas ou usadas incorretamente.
    - Mais bugs desses ocorrerão devido a falta de documentação do Baileys quanto aos formatos de mensagem, se der erro, favor documentar e me enviar! Obrigado!

9. **Warn [Update 26/02/24]**
    - Não exatamente falha, mas fiz com que o warn, quando marcando a pessoa por mensagem, enviasse a mensagem sem precisar de '|'.

10. **Finder [Update 26/02/24]**
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

<details>
  <summary><code>1.1.0 - 11/12/2023 🍊 <strong>[YUZU RELEASE]</strong></code></summary>
<!-- Quando a vida te der uma Yuzu, chame a 'tia Mei' e faça um suco de Citrus! -->

### Nota Especial de Dezembro 🎄🎉
- **Eventos:** Espalhei um toque natalino, de ano novo e aniversário pelo nosso site. Descubra esses detalhes especiais como easter-eggs escondidos! 🥳
- **Niver:** Dezembro é um mês duplamente especial, celebrando o nono (9º) aniversário da Íris do Legião Z. Sim, NOVE ANOS! Parabéns, Íris e Legião Z! 🎂

### Mural
- Infelizmente, não tenho muitas novidades desta vez, devido a razões explicadas abaixo. Mesmo assim, me empenhei para criar alguns jogos na esperança de que apreciem. Não está perfeito, pois não pude dedicar tanto tempo à programar.

- Estou dando uma pausa temporária no desenvolvimento da Íris devido a problemas de saúde. Marquei exames para este mês, e o tempo restante foi aconselhado para descanso e cuidados físicos e mentais. Pretendo retornar o mais breve possível.

- Não haverá mais uma equipe oficial, devido à falta de apoio da comunidade e da antiga equipe oficial. Assim que eu voltar, assumirei a produção sozinho e elaborarei o código da maneira que EU considerar necessária. Não pedirei mais por ajuda e não darei prioridade a pedidos ou sugestões.

- Para mais detalhes sobre tudo acima, [confira aqui](https://t.me/s/irisproject).

### Novidades
1. **Idiomas**
    - Novo idioma, agora a Íris também funcionará aos usuários que falam Árabe, totalizando 13 idiomas operantes!
    - Revisão do idioma árabe feita pelo [@majdgh6](https://github.com/majdgh6).
2. **Jogos**
    - Novos jogos, em especial, os de cassino e mais simples, como `Spin`, `Roubar`, `Roleta Russa`, `Jokenpo` e `Flip a Coin`.
    - Existe um modo de cadeia, caso você não possa pagar a multa por roubar, se pego.
3. **Privado**
    - Inserido uma mensagem de alerta para certas execuções de comandos no PV.
4. **Sticker Customizado**
    - Agora é possivel renomear seus stickers para o que quiser usando o comando `rename` ou inserindo `-custom` no comando de Sticker.
5. **Leveling**
    - Agora os usuários começam com valores para poderem começar a jogar de imediato.
6. **Banner**
    - Imagem natalina para a página inicial feita pelo artista [Jojo](https://bento.me/jocosta).
7. **Eslint**
    - A configuração dele agora é feita por arquivos YML.

### Correções
1. **Body**
    - A body estava removendo letras devido a uma má formatação da RegExp que ela utiliza.
2. **YouTube**
    - Corrigido a mensagem de erro do YouTube em casos de não encontrar ou não poder baixar uma mídia.
3. **Profile**
    - Resolvido o problema de obter a foto de perfil correta.
4. **Formatação**
    - Corrigi todos os erros que pude encontrar relacionados a formatação e badcode.

### Removido
1. **Dialogos**
    - Alguns dialogos inúteis que não irei usar.
2. **Eslint JSON**
    - Efetuado a troca para a versão YML.

</details>

<details>
  <summary><code>1.0.9 - 28/11/2023 🍵 <strong>[TEACUP RELEASE]</strong></code></summary>
<!-- Enquanto todos lutam pela sobrevivência e comida, e para terem mais um dia sem virar o almoço de um titã, Levi se senta em casa e pensa mais uma vez em como seria bom abrir uma loja de chá em um mundo lindo, limpo e sem violência. -->

### Mural
- Versão feita as pressas por motivos de mudanças na equipe de desenvolvimento da Íris, ainda não é tudo que a versão anterior almejava ter e não houve muito tempo para checagem, mas deve funcionar adequadamente ainda assim.

### Novidades
1. **Toolbox**
    - Uma ferramenta linda, mas experimental, que permite automatizar tarefas como atualizações, instalação de programas e demais.
2. **Revisão**
    - Feito mais uma parte da revisão da versão anterior, ainda não completo no entanto.
3. **Comando**
    - Inserido um comando para mostrar todos os aliases de comandos (/allcmd).
4. **Ping**
    - Inserido nome da release no comando ping.
5. **Velocidade**
    - Aprimorado ainda mais a velocidade.
6. **Certificado**
    - Novo certificado para o site localhost da Íris, se ainda não estiver usando HTTPS, instale o arquivo 'RootCA.crt' no seu sistema.
7. **Template**
    - O template de como criar comandos foi atualizado.
8. **Funções**
    - Algumas funções foram refeitas como parte da revisão geral.
9. **Git Ignore**
    - Atualizei o gitignore para não upar ou deixar de upar arquivos importantes.

### Correções
1. **Sticker**
    - Corrigido erro que fazia o sticker não ser executado por falta de mídia.
2. **WhatsApp Web**
    - Corrigido erro que fazia stickers não renderizarem no WhatsApp Web.
3. **Construct**
    - Corrigido erro de não retornar a mensagem base no caso de falhas.
4. **NASA**
    - Inserido imagem padrão, caso a NASA não envie uma.
5. **YouTube**
    - Corrigido o download de Shorts no YouTube, note que alguns videos ainda não podem ser baixados por questões do YouTube.
    
### Removido
1. **Códigos**
    - Diversos comentarios e códigos sem uso.

</details>

<details>
  <summary><code>1.0.8 - 22/11/2023 🍛 <strong>[OMURICE RELEASE]</strong></code></summary>
<!-- Enquanto as gotas de chuva caem nos jardins de The Garden of Words, a omurice da Yukino recebe uma atualização secreta. Descubra o sabor poético que se desdobra a cada garfada. Será que você consegue decifrar os versos escondidos nas camadas de arroz, omelete e linhas de código? -->

### Mural
- Esta versão é parcial, ela não foi postada com tudo que deveria ter segundo meus cronogramas (que não existem), então apesar de ser considerada uma release completa, ela não é, pois seu contéudo era tão absurdamente grande, que resolvi deixar o resto dos sistemas para uma próxima release, e como sempre, bugs são esperados.

- Essa versão tem tanta, **TANTA COISA**, que não sei nem descrever adequadamente o quão imensa e númerosa ela é, diversas coisas podem ter sido esquecidas de ser inseridas nessa changelog, e se houver novos erros devido a alguma coisa que mexi, informe para que eu possa realizar a correção de forma urgente.

### Novidades
1. **Documentação**
    - Atualizei as documentações de guia, contribuição, segurança, código de condulta e tudo mais.
2. **Website**
    - Finalmente temos um website para a Íris, e ele não só contém eastereggs, como também diversos links úteis, incluindo até sistema de tradução automatica dos textos.
3. **Leveling**
    - Implementação parcial do leveling, com direito a levelup, card e ganhos em jogos.
4. **Database**
    - Atualizei algumas formas de uso da database para que os comandos estejam em ordem com a mesma.
5. **Comandos**
    - Programei comandos de busca de imagens, mais memes, criações de cards, banners e muito mais.
6. **Construct**
    - Agora temos uma propriedade que lista até as alias de comandos, não sendo mais somente as pastas.
7. **NSFW**
    - Inserido um sistema de permissão para mandar contéudo NSFW para os grupos nos comandos de imagem.
8. **Config**
    - Foi feito um reajuste das configurações no arquivo JSON.
9. **Leveling**
    - As configurações de leveling agora se encontram presentes no arquivo 'leveling.json'.
10. **Default**
    - Implementei uma função no sistema de fallback das functions, a metrics. Ela foi movida para lá.
11. **Terminal**
    - Inserido um sistema de segurança simples contra bruteforces.
12. **Páginas**
    - As páginas foram separadas em arquivos '.html', '.css' e '.js' para torná-las mais rápidas.
13. **Tutorial**
    - O tutorial foi atualizado para uma página de arquivo '.md', ficando mais simples de entender.
14. **Outros**
    - Essa release trouxe MUITAS coisas, é impossivel lembrar e descrever todas, peço que analise manualmente os arquivos editados.

### Correções
1. **Sticker**
    - Os stickers de gif, video e mídias as vezes se tornavam muito pesados.
2. **Profile**
    - Em erros, a Íris não estava enviando fotos padrões para comandos.
3. **Comentarios**
    - Revisei e atualizei alguns comentarios nos arquivos que cheguei a olhar, mais deles serão corrigidos na próxima.
4. **Reajuste**
    - Agora boa parte dos comandos tem uma config para printar o erro inteiro, no entanto, **ISSO É UMA IMPLEMENTAÇÃO PARCIAL** e mais sistemas serão inseridos nisso, por favor, não abra pull requests para corrigir isso, farei eu mesmo por estar revisando as funções, uma a uma.
5. **Outros**
    - Essa release trouxe MUITAS coisas, é impossivel lembrar e descrever todas, peço que analise manualmente os arquivos editados.

### Removido
1. **Arquivos**
    - Foi removido boa parte dos arquivos e códigos sem utilidade atual.
2. **Códigos**
    - Removido uma baita quantidade de códigos ínuteis que podiam ser simplificados, mais disso ocorrerá em breve.
5. **Outros**
    - Essa release trouxe MUITAS coisas, é impossivel lembrar e descrever todas, peço que analise manualmente os arquivos editados.

</details>

<details>
  <summary><code>1.0.7 - 15/11/2023 🥤 <strong>[PEPPERMINT RELEASE]</strong></code></summary>
<!-- Dr. Pepper! Isso só pode ser a escolha de Steins Gate! -->

### Mural
- Esta versão é experimental, e embora eu acredite que todos os 60+ novos comandos estejam funcionando conforme o esperado, eu ainda não tive a oportunidade de testar cada um individualmente. Caso você encontre algum erro ou tenha alguma dificuldade, por favor, informe-me nas [redes sociais](https://bit.ly/BOT-IRIS) para que eu possa realizar correções.

- Estou me sentindo um pouco sobrecarregado e cansado, pois adicionei tantas novidades que acabei esquecendo de manter a changelog atualizada. Estou meio perdido em meio a tantas funcionalidades. Dê uma explorada para descobrir todas as novidades, correções e remoções que não estão aqui.

### Novidades
1. **Jogos**
    - Finalmente temos jogos e são nada mais, nem menos, que TicTacToe e Xadrez!
2. **Avisos**
    - Inseri avisos de apenas pessoal autorizado em alguns comandos.
3. **Propriedades**
    - Inseri uma nova propriedade para consulta na Construct, o `groupCreator`.
4. **Manager**
    - Inseri comandos para gerenciamento de grupos, como `promote`, `demote`, `kick`, `add`, `softban` e outros, é aconselhavél evitar o uso dos dois últimos ditos.
5. **Dialogos**
    - Mais dialogos relacionados a novos comandos.
6. **Memes**
    - Inserido **55+** novos comandos de meme!
7. **Config**
    - Inserido uma configuração de dono para qualidade para o stickers outra para controle das funções de adicionar pessoas.
8. **Changelog**
    - Novo sistema para a changelog, está usando elementos de HTML para fazer colapse e reduzir a quantidade de textos presentes na tela.

### Correções
1. **Tutorial**
    - Corrigido algumas linhas que estavam sem uso no arquivo de tutorial.
2. **Memes/Cards**
    - O sistema de canvas não estava configurado para exibir os erros e a imagem para erros não era um Buffer.
3. **Cores**
    - Ajustei algumas cores dos cards para ficarem mais fluídas, todas baseadas em cores de empresas de videogame.
4. **Comandos**
    - O comando de memes foi atualizado, conforme dito acima, mas diversas propriedades inúteis foram removidas para tornar melhor e mais rápido.

### Removido
1. **DrawScale**
    - Removido a função drawScale por ser uma das que trabalhei antes do hiato, agora fui olhar e não entendi bem o ponto dela, portanto, apagada.

</details>

<details>
  <summary><code>1.0.6 - 09/11/2023 🧁 <strong>[CUPCAKE RELEASE]</strong></code></summary>
<!-- Se você veio apenas se deliciar com cupcakes, é melhor fugir, Natsuki está logo atrás de você! -->

### Novidades
1. **Everyone**
    - Adicionei o comando everyone para quem tiver permissão de usar.
2. **Edited Messages**
    - Adicionado suporte a mensagens editadas.
3. **Antispam**
    - Adicionado sistema de antispam de comandos e mídias.
4. **Logging**
    - Adicionado novo sistema de logging de mensagens e comandos.
5. **Meme Sticker**
    - Agora você pode converter memes diretamente em stickers.
6. **Funções**
    - Inseri novas funções para uso na Indexer.
7. **Configs**
    - Novas configurações disponiveis.
8. **Wait**
    - Inserido mensagens de espera em alguns comandos.
9. **Menu de ajuda**
    - Atualizei o menu de ajuda para conter as dicas de uso também.
10. **Build Name**
    - Adicionei o uso de nomes de release para tornar mais divertido as versões.
11. **Guia**
    - Inserido o guia na falta de programas para instalar.
12. **Outros**
    - Demorei demais na atualização e esqueci de tudo que fiz, há mais coisas, mas são pequenas e irrelevantes em comparação as acima.

### Correções
1. **Cases**
    - Algumas cases rodavam sem o prefix quando deveriam ser com ele apenas.
2. **Decrypt**
    - As mídias estavam sendo baixadas mesmo sem ser um comando, o que ocasiona em erros de acesso por spam.
3. **Type**
    - Algumas linhas que deveriam ter ? não estavam com ele, podendo causar erros na substituição de strings.
4. **Default photo**
    - Inseri a foto da Íris como imagem padrão dos erros de mídia.
5. **Database**
    - Ajustei alguns valores da database para uso melhor.
6. **Usos de comando**
    - Alguns comandos exibiam alias que não eram funcionais.
7. **Informação**
    - Ajustei algumas informações que estavam fora de ordem, como na ajuda e comentários.
8. **Outros**
    - Mesma coisa da "novidades 11".

</details>

<details>
  <summary><code>1.0.5 - 29/10/2023 🍩 <strong>[DONUT'S RELEASE]</strong></code></summary>
<!-- Homer Simpson aprovou esta atualização repleta de donuts! -->

### Mural
- Importante: Leia a descrição da commit 'Release 1.0.5' antes de prosseguir

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

</details>

<details>
  <summary><code>1.0.4 - 22/10/2023 🍄 <strong>[MUSHROOM RELEASE]</strong></code></summary>
<!-- Bowser invadiu o Reino dos Cogumelos digitais, mas Mario está pronto para a batalha! -->

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
    
</details>

<details>
  <summary><code>1.0.3 - 21/10/2023 🍏 <strong>[APPLE RELEASE]</strong></code></summary>
<!-- Ryuk está à solta e com uma fome insaciável por maçãs. Alguém o alimente antes que ele comece a escrever nomes em seu Death Note! -->

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

</details>

<details>
  <summary><code>1.0.2 - 13/10/2023 🍜 <strong>[RAMEN RELEASE]</strong></code></summary>
<!-- O Naruto pode ser um pouco duro às vezes, talvez você não saiba, mas o Naruto também cresceu sem PCs.... -->

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

</details>

<details>
  <summary><code>1.0.1 - 11/10/2023 🍕 <strong>[PIZZA RELEASE]</strong></code></summary>
<!-- Lelouch Vi Britannia Te Ordena: Não deixe a C² chegar até aqui! -->

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

</details>

<details>
  <summary><code>1.0.0 - 22-09-2023 🍋 <strong>[LEMON RELEASE]</strong></code></summary>
<!-- Michiru Matsushima passou por aqui com sua bebida super amarga de vitaminas de limão! -->

1. Initial Release.
    - Código novinho em folha!

</details>