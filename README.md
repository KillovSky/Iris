### Íris, a BOT
Uma bot em português feita originalmente para o grupo Legião Z no WhatsApp, possui mais de 100 comandos e continua em crescimento (Somente PC).

### Pedido Pessoal
Por favor NÃO REMOVA os creditos, levei muito tempo e precisei ter muita dedicação pra se criar uma BOT Brasileira assim, agradeço pela cooperação.

### Para os donos
Você pode rodar comandos de Windows como "ipconfig", comandos de linux como "apt", ou comandos de programações como python -c tudo pelo WhatsApp, ninguém além de você pode usar isso, se você deseja que usem, remova a linha if (!isOnwer) [aqui](https://github.com/KillovSky/iris/blob/master/config.js#L3537), mas saiba que remove-la pode ser perigoso a você.

### Funções (Não são todas, +130)

| Função |Contém|
| ------------- | ------------- |
| Pausar BOT |✅|
| Puxar alguns dados |✅|
| Usar CMD/Terminal pelo WhatsAPP |✅|
| Anti-Fake/Blacklist |✅|
| Downloads (Redes-Sociais e YouTube) |✅|
| Conversar por texto/voz Sim-Simi/Local (ilimitado) |✅|
| Busca/fotos de animes |✅|
| Wikipedia |✅|
| Brainly |✅|
| Nasa |✅|
| Buscar anime por foto |✅|
| Stickers em imagem |✅|
| Ataques SMS |✅|
| Mandar mensagens a outro PV (por comando) |✅|
| Comandos de zoeira |✅|
| Prints de tela e sites |✅|
| Geração de textos |✅|
| Mensagem para Todos |✅|
| Sair de tudo |✅|
| Deletar todas as mensagens |✅|
| Revogar links de grupo|✅|
| Adicionar/remover pessoas |✅|
| Tirar ADM |✅|
| Anti porno/links de grupos |✅|
| Sticker/Sticker GIF |✅|
| Stickers sem fundo/Por palavra/Link |✅|
| Fabrica de meme/Pegar memes |✅|
| Busca de pinterest |✅|
| Construção de "diario" em foto |✅|
| Silenciar grupo para administradores |✅|
| Falar frases em 51 idiomas |✅|
| Mudar foto do grupo |✅|
| Marcar todos |✅|
| Stalkear instagram/twitter |✅|
| Google/Google Play |✅|
| Pesquisa por foto |✅|
| Upload de fotos em nuvem |✅|
| Tradutor |✅|
| Boas Vindas e Adeus |✅|
| Deletar mensagens do bot |✅|
| Remover todos |✅|
| Votações (Urna) |✅|
| Foto de garotas, macacos, etc |✅|
| Informações de Grupo/Perfil |✅|
| Outros (Lista tem mais de 130) |✅|

### Instalação
Você precisa ter esse repositorio, é simples, rode os comandos abaixo, em caso de erros, rode como sudo/administrador.

```bash
> git clone https://github.com/KillovSky/iris.git
> cd iris
> npm i
> npm install gify-cli gify -g
```

### Iniciar
Para iniciar digite o comando abaixo e espere, após isso, escaneie o QR Code.

```bash
> npm start
```

### Ver todos os comandos
Digite no seu chat a mensagem:

```bash
> /menu
```

### Crie seus comandos
Abra sua config.js e ache um lugarzinho em branco bonito, darei um exemplo de resposta simples, va testando como quiser, a outros tipos, você pode ver quais por [aqui](https://docs.openwa.dev/classes/client.html) e na duvida, chame-me por [aqui](https://chat.whatsapp.com/H53MdwhtnRf7TGX1VJ2Jje) ou [aqui](https://wa.me/+5518998044132).

```bash
case 'Nome do comando sem espaços':
    await kill.reply(from, 'Sua mensagem', id)
    break
 ```
 
### Erros
Se notar erros, me encontre no grupo abaixo, mande mensagem no WhatsApp, ou reporte no Issues, e claro, se certifique de ter chrome instalado.
No windows baixe por [aqui](https://www.google.com/chrome), no linux use os comandos abaixo.

```bash
> wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
> sudo apt install ./google-chrome-stable_current_amd64.deb
```

### Mudanças
Edite as API's encontradas em: (Se estiver incorreta avise ou procure)

- [API 1](https://github.com/KillovSky/iris/blob/master/lib/functions.js#L12)
- [API 2](https://github.com/KillovSky/iris/blob/master/lib/functions.js#L33)
- [API 3](https://github.com/KillovSky/iris/blob/master/config.js#L303)
- [API 4](https://github.com/KillovSky/iris/blob/master/config.js#L319)
- [Número 1](https://github.com/KillovSky/iris/blob/master/config.js#L1387)
- [Número 2](https://github.com/KillovSky/iris/blob/master/config.js#L73)
- [DDI](https://github.com/KillovSky/iris/blob/main/lib/welcome.js#L8)
- [Bomber](https://github.com/KillovSky/iris/blob/master/config.js#L3523)
- Elas são referentes aos sites [RemoveBG](https://www.remove.bg/pt-br), [ImgBB](https://api.imgbb.com/) e [AlphaCoders](https://wall.alphacoders.com/api.php)
- A DDI é obrigatoria apenas caso você for de fora do Brasil, o Bomb apenas se você usar Linux.
- Sempre leia a aba de discussões do github para saber mais.

### Brainly
Depois de terminar a instalação siga esses passos para deixar seu brainly em português:

```
Abra a brainly.js na pasta iris\node_modules\brainly-scraper\src
Mude a graphql/id para graphql/pt
```

### Computer-Freaker/Axios
Para fixar o funcionamento da API da Computer-Freaker, que é responsavel por diversos comandos (hug, hentai, dva, baguette...), siga os passos desse [Mini-Tutorial](https://github.com/KillovSky/iris/discussions/10).

## Agradecimentos ao:
- [Open-WA](https://github.com/open-wa)
- [ArugaZ](https://github.com/ArugaZ)
- [MhankBarBar](https://github.com/MhankBarBar)
- [Tio das Trevas](https://github.com/TioDasTrevas)
- [Jon](https://github.com/Jonn001)
- Agradeço de coração a todos vocês!

## Doar e Suporte
- [Doações] - Ajude-me a criar comandos, doe algo pelo PicPay ❤️ - [Doar](https://picpay.me/userlucas123)
- [PIX] - fc270199-2d55-4d91-be5c-bfbd431cfad4
- [Grupo Oficial] - Não somos grupos de travas - [Entrar](https://chat.whatsapp.com/H53MdwhtnRf7TGX1VJ2Jje)
- [Dono] - Se precisar falar comigo - [Falar](https://wa.me/+5518998044132)
