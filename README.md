# EM DESENVOLVIMENTO [2023+]
> Essa versão do Projeto Íris é uma versão 'from scratch', ou seja, refeita do zero, ela não apresenta quaisquer comandos ou sistemas relevantes ainda, sendo apenas uma base.
>
> Não utilize essa versão no dia a dia, pois existem pontos não testados que podem causar danos, apesar dessa versão estar sendo revisada o mais rápido possível.
>
> Apesar disso tudo, você pode encontrar problemas ao tentar utilizar por se tratar de uma versão de testes, entre eles, pode haver: Lentidão, travadas aleatórias, erros irrelevantes ou mais.
>
> Ainda não está compatível com o Termux ou demais apps, foi decidido que o uso deles será feito por um Script Shell que programarei, mas somente após a finalização total desse update.
>
> Enfim, apenas estude a arquitetura do código para se acostumar com os futuros updates e tenha em mente que eles podem e vão mudar muito ainda, e se for usar, utilize por sua conta e risco.

### Instalação
- Continua da mesma forma da Íris presente na `branch main`, mas essa versão não possui qualquer suporte, por se tratar de uma versão de pré-lançamento.

### Termux
- Se ainda desejar **TENTAR** utilizar, baixe um Linux pelo APP `Andronix`, baixe `Termux`, siga os passos do `Andronix` e finalize a instalação, recomendo `Debian`.
- Esse tutorial também pode funcionar na última Íris estável, a [Versão 3.3.3](https://github.com/KillovSky/Iris), mas ainda precisa de testes, pois é arriscado e sem dúvidas, terá problemas.
- Esse modo de instalação é provisório, quando finalizar a atualização, você poderá executar tudo em '2' comandos de forma simples.
- O uso no telefone é limitado e sofrerá perdas significativas de comandos, em especial, os de memes que usam `canvas`.
- O envio de vídeos e demais arquivos pode ser afetado pela falta de Chrome, ainda estou estudando uma forma de evitar isso.
- Após instalar, siga os seguintes passos:

```bash
# Opcional, caso não entre automaticamente no Debian
./start-debian.sh

# Apartir de agora todos os comandos são para rodar no debian que você iniciou

# Atualiza os repositórios e programas do Linux
apt update && apt upgrade -y

# Instala cURL e WGET para baixar o Chrome e Node.js LTS
apt install curl wget -y

# Instala o NodeJS 14 | Essa foi a ultima versão compatível que pude usar
curl -fsSL https://deb.nodesource.com/setup_14.x | bash

# Instala os programas para rodar
apt install build-essential make git gcc g++ chromium python3 procps
```
- Após estes passos, tenha em mente que você precisa saber usar os comandos `cp`, `mv`, `nano` ou `vim`, existem duas formas de editar essa Íris.

1. Baixe a Íris pelo `Git Clone` dentro do `Debian` e use `nano` ou `vim` para editar de forma **AVAMÇADA**, mas rápida.
    - Você precisa ter habilidade em Linux para isso, nenhum tutorial irá te salvar neste ponto.
2. Baixe um arquivo `ZIP`, ele pode ser baixado pela opção `Code` na página da Github, extraia e após isso, use algum editor como o `Acode` para mexer.
    - Após as edições, vá no Termux e copie para a pasta do `Debian` os arquivos da Íris no celular, usando `cp` ou `mv` para isso.
    - A memoria interna pode ser facilmente acessada pelo local: `/storage/emulated/0`, `/sdcard` | Em caso de root: `/data/media/0`.
    - Se você possui root, basta copiar a pasta da Íris para a pasta do debian manualmente usando um gerenciador de arquivos root, como `Root Explorer`.
    - Os arquivos devem estar dentro da pasta `Home` do usuário, neste caso, se trata da pasta `Root` na raiz do sistema **DEBIAN**.

> Escolhido o modo, para fazer rodar no telefone, você precisa fazer as seguintes tarefas:

1. Abra e remova da `package.json` as linhas que tenham `canvacord` ou `canvas`, você pode remover o `sharp` se ele também der problemas após tudo.
2. Deletar ou **MOVER** a pasta `Canvas` e remover dos arquivos as linhas que tem: `require('canvas')` ou `require('canvacord')` e `require('sharp')` se você o deletou.
3. Ir no arquivo `utils.json` da pasta `Options` e mudar para `true` os seguintes valores: `enableOptions`, `forcedMode`, `popup`, `ezQR`, `safeMode`.
4. Mude a `useChrome` para `false`, digite um número de 4 dígitos [2163] em `popupPort` e insira o local do executável do `chromium` em `executablePath`.
5. Inicie com `npm start`, um link apareça na tela, entre neste link para poder escanear o QR, se desejar entrar de outro aparelho, troque o `localhost` pelo seu IP local.
    - Exemplo: `http://localhost:2163` -> `http://192.168.0.110:2163`
    - O IP do Debian pode ser diferente do seu IP do telefone, utilize `ifconfig` para obter o IP do debian antes de ligar.
    - Se o `ifconfig` não for um comando usavel, tente `ip addr` ou `hostname -i`.
    - Se caso o IP for `127.0.0.1` ou `localhost` e similares, utilize o IP do seu telefone, você pode obter nas configurações do aparelho, ou baixando um app para isso.
    - Faça isso rápido, pois o tempo de conexão é limitado, de preferencia, obtenha o IP antes de ligar.
    - Não esqueça que você deve inserir a porta que configurou em `popupPort`, ficando quase igual ao exemplo ali.
6. Aproveite sua Íris base no telefone :)