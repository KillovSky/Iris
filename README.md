### Projeto Íris
O projeto Íris é um BOT para WhatsApp feita atualmente por [Lucas R. - KillovSky](https://github.com/KillovSky) e [Pedro Batistop](https://github.com/PedroBatistop), foi inicialmente construída para o grupo [Legião Z](https://bit.ly/BOT-IRIS), mas com o passar do tempo foi sendo aprimorada para ser utilizada por qualquer um, seu código é totalmente aberto, possuindo mais de 400 funções e atualizações 'frequentes' com novidades e correções.

### Outros idiomas
Íris Dev is not usable in English or Spanish yet, because is not finished, you need to use only `Portuguese`.
Íris Dev aún no se puede usar en inglés o español, porque no está terminado, solo puedes usar en `Portugués`.

Íris 3.1.1 -> If you want an English tutorial, open this [English Tutorial](https://github.com/KillovSky/iris/blob/main/.readme/en/README.md), si quieres en español, abre esta [Tutorial Español](https://github.com/KillovSky/iris/blob/main/.readme/es/README.md).

### Nota Pessoal
Esse software funciona sob a licença [MIT](http://escolhaumalicenca.com.br/licencas/mit/), sendo proibido a retirada de créditos.
Eu e os colaboradores quebramos a cabeça par construir novos comandos e correções sem cobrar pelas mesmas, por isso, não deixe nosso esforço ser em vão, adicione os créditos.

### Erros & Bugs
Você está vendo a versão em desenvolvimento, esta versão não possui um suporte especifico para correções até que seja considerada estável, todavia, você pode informar bugs e esperar uma atualização, leia a [esclarecimentos](https://github.com/KillovSky/iris/discussions/416).

### Funções (+400)
Existem inúmeras funções na Íris para serem detalhadas adequadamente, você pode acessar o arquivo com os nomes de comandos [Aqui](https://raw.githubusercontent.com/KillovSky/iris/dev/lib/config/Utilidades/comandos.txt), isso pode ajudar a ter uma ideia melhor.

### Requisitos para Windows

- [NodeJS](https://nodejs.org) - Ambiente de programação da Íris, use LTS.
- [Chrome](https://www.google.com/chrome/) - Para enviar vídeos, fotos e outros.
- [Gow](https://github.com/bmatzelle/gow/releases) - Para os comandos de Linux.
- [Git](https://git-scm.com) - Para os comandos de Linux (2) / Terminal Bash.
Pode ser necessário inserir o `bash.exe` ao `PATH` do Windows, para isso, faça o [Tutorial](https://github.com/KillovSky/iris/issues/456#issuecomment-1001087525) com muito cuidado.

### Instalação via APT - Apenas Linux

```bash
> sudo apt update && sudo apt upgrade -y
> sudo apt install curl wget -y
> wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
> curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo bash
> sudo apt install nodejs python python3 python3-pip git build-essential ./google-chrome-stable_current_amd64.deb -y
```

Se obter erros na instalação do Node no Linux, tente usar a [Source](https://github.com/nodesource/distributions).

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

Você pode usar a inicialização do PM2 em vez do `npm start` com:

```bash
> npm i pm2 -g
> pm2 start index.js
> pm2 monit
```

O `npm i pm2 -g` somente precisa ser executado uma única vez.

### Por que usar PM2?
PM2 faz com que o código seja automaticamente reiniciado em casos de erro, além disso, ele é essencial para o comando `Reboot`.

### Ver todos os comandos
Digite no seu chat a mensagem, se você editou sua prefix, troque a '/' para o caractere que você utilizará.

```bash
> /menu
```

### Desativar a auto-abertura de navegador do bomb
Para fazer com que o navegador pare de abrir toda vez que iniciar a Íris, abra a pasta ```node_modules``` e vá em ```bomber-api```, abra o arquivo ```index.js``` e remova as linhas ```"open(`http://localhost:3000/`)"``` e ```"open(`http://localhost:${arguments.port}/`)"```, se você obteve problemas com a porta 3000, você pode editar a ```"app.listen(3000"``` para uma porta aleatória que não esteja em uso.
Se quiser fazer isso com o terminal, basta rodar o seguinte comando após instalar o `Gow` ou `Git Bash`, no Linux não é necessário instalar nada.

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
- [Cripto-moedas](https://pastebin.com/raw/zvgvycJA)
- [Grupo Oficial](https://bit.ly/BOT-IRIS)