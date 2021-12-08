### Projeto Íris
Íris é uma bot em inglês, espanhol e português criada e mantida atualizada pelo Lucas R. - KillovSky para o grupo "Legião Z", ela tem mais de +300 comandos e atualização "frequente" com correções e novidades.

### Outros idiomas
if you want a English tutorial, open this [English Tutorial](https://github.com/KillovSky/iris/blob/main/.readme/en/README.md), si quieres en español, abre esta [Tutorial Español](https://github.com/KillovSky/iris/blob/main/.readme/es/README.md).

### Nota Pessoal
Esse software funciona sob a licença [MIT](http://escolhaumalicenca.com.br/licencas/mit/), sendo proibido a retirada de créditos, e lembre-se, eu gasto MUITO tempo ajudando todos que tem dúvidas e melhorando a BOT, mas sem ganhar nada nisso, por favor, não remova os créditos.
Se você ver alguém roubando ou que tenha roubado, mostre a verdade, diga a ela que isso é plagio, esse é o único pedido que tenho.

### Erros & Bugs
Você está vendo a versão em desenvolvimento, esta versão não possui um suporte especifico até que seja considerada estável, leia a [esclarecimentos](https://github.com/KillovSky/iris/discussions/416).

### Funções (+300)

| Função | Contém |
| ------------- | ------------- |
| Rodar WA-Automate/Functions dentro do WhatsApp |✅|
| Administrar Grupos |✅|
| Cassino/Jogo da Velha/Outros Jogos |✅|
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

- [NodeJS](https://nodejs.org) - Ambiente de programação da Íris.
- [Chrome](https://www.google.com/chrome/) - Para vídeos e fotos.
- [Gow](https://github.com/bmatzelle/gow/releases) - Para as Unix-Tools.
- [Git](https://git-scm.com) - Para outras Unix-Tools | Terminal - Cuidado.

Para a instalação de tudo acima no Linux, você pode usar os comandos abaixo:

```bash
> sudo apt update -y
> sudo apt upgrade -y
> sudo apt install curl wget -y
> wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
> curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo bash
> sudo apt install nodejs python python3 python3-pip git build-essential ./google-chrome-stable_current_amd64.deb -y
```

Em caso de erros, leia o tutorial [aqui](https://github.com/nodesource/distributions).

### Instalação
Você precisa ter esse repositório, é simples, rode os comandos abaixo, em caso de erros, rode como sudo/administrador ou veja os [Tutoriais](https://github.com/KillovSky/iris/discussions/28).

```bash
> git clone -b dev https://github.com/KillovSky/iris.git
> cd iris
> npm i
```

### Mudanças OBRIGATÓRIAS
Edite TODAS as informações necessárias descritas [aqui](https://github.com/KillovSky/iris/blob/main/.readme/pt/config.md) antes de iniciar a Íris.

### Iniciar
Após a edição dos arquivos necessários, rode o comando abaixo e espere iniciar, após isso, escaneie o QR Code.

```bash
> npm start
```

Você pode usar a inicialização do PM2 - recomendada mas usa CPU/RAM+ - em vez do `npm start` com:

```bash
> npm i pm2 -g
> pm2 start index.js
> pm2 monit
```

O `npm i pm2 -g` somente precisa ser executado uma única vez.

### Ver todos os comandos
Digite no seu chat a mensagem, se você editou sua prefix, troque a '/' para o caractere que você utilizará.

```bash
> /menu
```

### Desativar a auto-abertura de navegador do bomb
Para fazer com que o navegador pare de abrir toda vez que iniciar a Íris, abra a pasta ```node_modules``` e vá em ```bomber-api```, abra o arquivo ```index.js``` e remova as linhas ```"open(`http://localhost:3000/`)"``` e ```"open(`http://localhost:${arguments.port}/`)"```, se você obteve problemas com a porta 3000, você pode editar a ```"app.listen(3000"``` para uma porta aleatória que não esteja em uso.
Se quiser fazer isso com o terminal, basta rodar o seguinte comando após instalar o `Gow` ou `Git Bash`.

```bash
> cd node_modules/bomber-api && grep -v "http://localhost:" index.js > index2.js && rm -rf index.js && mv index2.js index.js && cd ../.. # Esse ultimo 'cd' faz voltar na pasta inicial da Íris
```

### Agradecimentos:
- [Open-WA](https://github.com/open-wa)
- [ArugaZ](https://github.com/ArugaZ)
- [MhankBarBar](https://github.com/MhankBarBar)
- [SlavyanDesu](https://github.com/SlavyanDesu)
- [Contribuidores](https://github.com/KillovSky/iris/graphs/contributors)
- Agradeço de coração a todos vocês!

### Doar e Suporte
- [Doações] - Este projeto é mantido por mim de graça e sem cobrar nada, se puder, doe algo ❤️
- [PicPay](https://picpay.me/userlucas123)
- [Ko-fi](https://ko-fi.com/killovsky)
- [PIX] - fc270199-2d55-4d91-be5c-bfbd431cfad4 - **Brasil**
- [Grupo Oficial](https://bit.ly/BOT-IRIS)