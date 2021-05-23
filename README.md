### Projeto Íris
Íris é uma bot em inglês, espanhol e português criada e mantida atualizada pelo Lucas R. - KillovSky para o grupo "Legião Z", ela tem mais de 200 comandos e atualização frequente com correções e novidades.

### Outros idiomas
if you want a English tutorial, open this [English Tutorial](https://github.com/KillovSky/iris/blob/main/.readme/en/README.md), si quieres en español, abre esta [Tutorial Español](https://github.com/KillovSky/iris/blob/main/.readme/es/README.md)
Para deixar sua bot completamente em outro idioma, abra a configuração de [linguagem aqui](https://github.com/KillovSky/iris/blob/main/lib/config/config.json#2) e troque o "pt" para "en" que é inglês ou "es" para espanhol, não há outros idiomas além destes, não agora.

### Nota Pessoal
Esse software funciona sob a licença [MIT](http://escolhaumalicenca.com.br/licencas/mit/), sendo proibido a retirada de créditos, e lembre-se, eu gasto MUITO tempo ajudando todos que tem dúvidas e melhorando a BOT, mas sem ganhar nada nisso, por favor, não remova os créditos.
Se você ver alguém roubando ou que tenha roubado, mostre a verdade, diga a ela que isso é plagio, esse é o único pedido que tenho.

### Erros & Bugs
Se notar erros leia a [Discussions](https://github.com/KillovSky/iris/discussions), se ela não resolver, fale comigo pelos meios no final da pagina ou reporte no [Issues](https://github.com/KillovSky/iris/issues), e claro, se certifique de ter instalado chrome e de ler TUDO que estiver escrito abaixo.
Baixe Chrome no Windows por [aqui](https://www.google.com/chrome), no linux use os comandos abaixo.

```bash
> wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
> sudo apt install ./google-chrome-stable_current_amd64.deb
```

### Funções (+200)

| Função |Contém|
| ------------- | ------------- |
| Rodar WA-Automate/Functions dentro do WhatsApp |✅|
| Administrar Grupos |✅|
| Apostar/Cassino/Outros Jogos |✅|
| Anti Porno & Imagem +18/Link de Chat |✅|
| Ataques SMS/CALL/EMAIL |✅|
| Bem Vindo/Adeus/Anti-Fake/Blacklist |✅|
| Bloquear/Desbloquear/Rastrear pessoas |✅|
| Buscar Anime/Letra de Música/Twitter/Instagram |✅|
| Mandar mensagens a outros grupos |✅|
| Conversar por texto/voz Sim-Simi/Local (ilimitado) |✅|
| Deletar Mensagens do BOT |✅|
| Downloads (Redes-Sociais e YouTube) |✅|
| Falar 51 idiomas/Tradutor |✅|
| Geração de Textos/Diário |✅|
| Google/Google Play/Pinterest |✅|
| Informações de Grupo/Perfil |✅|
| Marcar todos/Remover Todos |✅|
| Memes/Fazer Memes |✅|
| Nasa, Brainly, Wikipédia |✅|
| Pausar/Sair de Tudo/Transmissão/Apagar Tudo |✅|
| Pesquisa Fotos/Dados/Covid |✅|
| Printar Tela/Sites |✅||
| Sticker de GIF/Sem-Fundo/Link/Palavras |✅|
| Uploads de Fotos |✅|
| Usar CMD/Terminal pelo WhatsApp |✅|
| XP/Ranking/Level/Votações |✅|
| Outras |✅|

### Requisitos

- Dois números no WhatsApp, um para o dono e outro para a BOT.
- [NodeJS](https://nodejs.org) - Recomendo a LTS.
- [Git](https://git-scm.com) - Para as Unix-Tools - Cuidado.
- [FFmpeg](https://ffmpeg.org) - Para conversões.
- [Libwebp](https://developers.google.com/speed/webp/download) - Ajuda no de cima e outras coisas.
- Para um tutorial de instalação do FFmpeg no Windows 7/8, veja [WikiHow](https://pt.wikihow.com/Instalar-o-FFmpeg-no-Windows), no caso de Windows 10 veja a [SoundArtifacts](https://soundartifacts.com/pt/how-to/186-how-to-install-ffmpeg-on-windows-10-amp-add-ffmpeg-to-windows-path.html).
- Para instalar o LibWebP siga os mesmos passos, mas mudando o nome da pasta para LibWebP em vez de FFmpeg.

Para a instalação de tudo acima no Linux, você pode usar o comando abaixo:

```bash
> sudo apt install nodejs git ffmpeg -y
```

Caso você obtenha erros com a versão do node no repositório de seu Linux, use o [Node Source](https://github.com/nodesource/distributions), lembre-se de usar a LTS (14).

### Instalação
Você precisa ter esse repositório, é simples, rode os comandos abaixo, em caso de erros, rode como sudo/administrador ou veja os [Tutoriais](https://github.com/KillovSky/iris/discussions/28).

```bash
> git clone https://github.com/KillovSky/iris.git
> cd iris
> npm i
```

### Mudanças OBRIGATÓRIAS
EDITE as API's encontradas em:

- [Linguagem](https://github.com/KillovSky/iris/blob/main/lib/config/Bot/config.json#2)
- [Dono](https://github.com/KillovSky/iris/blob/main/lib/config/Bot/config.json#3)
- [DDI](https://github.com/KillovSky/iris/blob/main/lib/config/Bot/config.json#4)
- [Prefix](https://github.com/KillovSky/iris/blob/main/lib/config/Bot/config.json#5)
- [API 1 - API-Flash](https://github.com/KillovSky/iris/blob/main/lib/config/Bot/config.json#6)
- [API 2 - RemoveBG](https://github.com/KillovSky/iris/blob/main/lib/config/Bot/config.json#7)
- [API 3 - WallHaven](https://github.com/KillovSky/iris/blob/main/lib/config/Bot/config.json#8)
- [API 4 - Deep-AI](https://github.com/KillovSky/iris/blob/main/lib/config/Bot/config.json#9)
- [Limite de Grupos](https://github.com/KillovSky/iris/blob/main/lib/config/Bot/config.json#10)
- [Limite de Membros](https://github.com/KillovSky/iris/blob/main/lib/config/Bot/config.json#11)
- [Sticker-Autor](https://github.com/KillovSky/iris/blob/main/lib/config/Bot/config.json#12)
- [Sticker-Pack](https://github.com/KillovSky/iris/blob/main/lib/config/Bot/config.json#13)
- [User-Agent](https://github.com/KillovSky/iris/blob/main/lib/config/Bot/config.json#14)
- [Tempo de Jogo](https://github.com/KillovSky/iris/blob/main/lib/config/Bot/config.json#15)
- [Anti-Flood](https://github.com/KillovSky/iris/blob/main/lib/config/Bot/config.json#16)
- [Max-Size](https://github.com/KillovSky/iris/blob/main/lib/config/Bot/config.json#17)
- [Win-Time](https://github.com/KillovSky/iris/blob/main/lib/config/Bot/config.json#18)
- Elas são referentes aos sites [RemoveBG](https://www.remove.bg/pt-br), [API-Flash](https://apiflash.com), [WallHaven](https://wallhaven.cc/settings/account) & [Deep-AI](https://deepai.org).
- A DDI e Linguagem são necessárias apenas se você for de fora do Brasil, as linguagens disponiveis são "en" de inglês, "pt" de português e "es" de espanhol e afetam todos os diálogos e o akinator.
- Você pode inserir dois ou mais números de dono, se não quiser apenas deixe o segundo como está, o tempo de jogo deve ser inserido em MINUTOS, ele limitará o tempo para cada jogatina, o Anti-Flood deverá ser em SEGUNDOS e limita os comandos e a User-Agent é opcional, Max-Size é para Downloads, coloque entre 1 a 64 (Sugiro 16) e a Win-Time é o tempo de ganho de XP para cada mensagem.

### Iniciar
Após a edição dos arquivos necessários, rode o comando abaixo e espere iniciar, após isso, escaneie o QR Code.

```bash
> npm start
```

### Ver todos os comandos
Digite no seu chat a mensagem, se você editou sua prefix, troque a '/' para o caractere que você utilizará.

```bash
> /menu
```

### Crie seus comandos
Há uma base simples para suas criações por [aqui](https://github.com/KillovSky/iris/blob/main/config.js#L4026), sem Prefix [aqui](https://github.com/KillovSky/iris/blob/main/config.js#L304), basta que você remova a "/\*" e a "\*/" para utilizá-la, se precisar de outros tipos, você pode ver sobre eles por [aqui](https://docs.openwa.dev/classes/api_client.client.html), se obtiver dificuldades, chame-me por [aqui](https://bit.ly/3owVJoB) ou [aqui](https://wa.me/+5518998044132).

### Alertas no WhatsApp
Para receber também as mensagem de erros da Íris pelo WhatsApp, remova a "//" da linha [Catch](https://github.com/KillovSky/iris/blob/main/config.js#L4038).

### Agradecimentos:
- [Open-WA](https://github.com/open-wa)
- [ArugaZ](https://github.com/ArugaZ)
- [MhankBarBar](https://github.com/MhankBarBar)
- [SlavyanDesu](https://github.com/SlavyanDesu)
- [Contribuidores](https://github.com/KillovSky/iris/graphs/contributors)
- Agradeço de coração a todos vocês!

### Doar e Suporte
- [Doações] - Este projeto é mantido apenas por mim de graça e sem cobrar nada, se puder, doe algo ❤️ - [Doar](https://picpay.me/userlucas123)
- [PIX] - fc270199-2d55-4d91-be5c-bfbd431cfad4
- [Grupo Oficial] - Não somos grupos de travas - [Entrar](https://bit.ly/3owVJoB)
- [Dono] - Se precisar falar comigo (respondo sempre o mais rápido possível) - [Falar](https://wa.me/+5518998044132)