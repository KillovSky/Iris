# ✏️ Guia de Instalação no Termux

Este guia irá ajudá-lo a instalar a Íris no Termux usando um script e executando comandos específicos.

## 📝 Sumário

1. [🔎 O que é Termux?](#-o-que-é-termux)
2. [✓ Pré-Requisitos](#-pré-requisitos)
3. [🐧 Instalando o Ubuntu 22.04](#-instalando-o-ubuntu-2204)
4. [⚙️ Instalando a Íris](#%EF%B8%8F-instalando-a-íris)
5. [📜 Configuração](#-configuração)
    - [👨‍💻 Método Nº1 - Usando CLI](#-método-nº1---usando-cli)
    - [💌 Método Nº2 - Usando nano](#-método-nº2---usando-nano)
    - [🌐 Método Nº3 - Usando o Terminal WEB da Íris](#-método-nº3---usando-o-terminal-web-da-íris)
6. [🏁 Etapas Finais](#-etapas-finais)
	- [📞 Usando outro telefone](#-usando-outro-telefone)
	- [🤳 Usando dois espelhos e um pouco de mágica (habilidade)](#-usando-dois-espelhos-e-um-pouco-de-mágica-habilidade)
7. [🙏 Finalizando](#-finalizando)
8. [❗ Dicas](#-dicas)

## 🔎 O que é Termux?

Termux é um emulador de terminal para dispositivos Android que funciona como um ambiente de linha de comando semelhante ao Linux. Ele oferece a capacidade de executar programas Linux e até mesmo transformar seu dispositivo em um servidor Linux completo ao instalar uma interface.

## ✓ Pré-Requisitos

Antes de iniciar a instalação da Íris no Termux, certifique-se de atender aos seguintes Pré-Requisitos:

1. [Termux](https://f-droid.org/pt_BR/packages/com.termux/)
2. [Andronix](https://andronix.app/)
3. Pelo menos 600MB a 1GB de RAM livre
4. Processador quad-core ou superior
5. 3GB de espaço livre (Recomendado: 5GB+)
6. Outro telefone, um espelho (modo hardcore) ou similar

## 🐧 Instalando o Ubuntu 22.04

Siga as etapas abaixo para instalar o Ubuntu 22.04 no Termux:

1. Após instalar o Termux e o Andronix, abra o aplicativo Andronix.

2. Selecione a opção `Linux Distribution` no Andronix.

3. Escolha `Ubuntu 22.04` como a distribuição Linux a ser instalada (outros sistemas podem funcionar, mas este guia se aplica ao Ubuntu 22.04).

4. Selecione `CLI Only` para obter uma instalação somente de linha de comando. As outras opções instalarão interfaces, aumentando o consumo de recursos e a complexidade de uso, o que pode não ser adequado para iniciantes.

5. Avance até a opção `Open Termux` aparecer.

6. Selecione essa opção, e o comando será copiado automaticamente.

7. Cole o comando no terminal do Termux e pressione a tecla Enter do seu teclado para executá-lo. Aguarde até que a instalação do Ubuntu 22.04 seja concluída. Você pode ser solicitado a responder a algumas perguntas durante a instalação, neste caso, digite a letra correspondente a `default=` e pressione Enter ou apenas pressione Enter para aceitar as opções padrão.

8. Uma vez que a instalação esteja concluída, você estará no ambiente do Ubuntu 22.04, se não tiver certeza, você estará se estiver vendo `root@localhost`.

9. Quando você sair do Termux, você deve digitar `./start-ubuntu22.sh` para entrar novamente no sistema que você instará a Íris.

## ⚙️ Instalando a Íris

Uma vez que você tenha instalado todos os requisitos e Ubuntu 22.04, copie e cole os seguintes comandos para instalar os requisitos do ambiente da Íris, você pode copiar e colar o texto inteiro abaixo se preferir.

```bash
# Atualiza os repositórios e programas do Ubuntu 22.04  
apt update && apt upgrade -y

# Instala os requisitos para inserção da repo do NodeJS 18 | https://github.com/nodesource/distributions
apt install ca-certificates curl gnupg -y

# Cria a pasta keyrings para inserir as do NodeJS
mkdir -p /etc/apt/keyrings

# Obtém a keyring do NodeJS e insere na pasta criada
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

# Instala o repositório do NodeJS no sistema do Ubuntu 22.04
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_18.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list

# Atualiza os repositórios
apt update && apt upgrade -y

# Instala os programas necessarios de uma só vez
apt install nodejs sqlite build-essential zip unzip python2 python3 git tesseract-ocr nano libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev -y

# Baixa o Projeto Íris
git clone https://github.com/KillovSky/Iris.git

# Entra na pasta da Íris
cd Iris

# Inicia o download dos arquivos adicionais dela
npm i

# Inicia (leia o resto do tutorial primeiro)
npm start
```

## 📜 Configuração

Uma vez que você tenha instalado tudo, feito todos os procedimentos acima, siga os passos abaixo para configurar seu número como dono da Íris.

### 👨‍💻 Método Nº1 - Usando CLI

1. Digite `cd && cd Iris && sed -i 's/MyNumber/SeuNúmero/g' lib/Databases/Configurations/config.json`.
	- Você deve trocar 'SeuNúmero' pelo seu número no formato: DDI+DDD+Número.
	- O número deve ser igual ao mostrado no WhatsApp, por exemplo: 's/MyNumber/55119987654321/g'
	- Se você quiser inserir outro número manualmente, deve usar o método 2 u 3 a partir de agora.

### 💌 Método Nº2 - Usando nano

1. Digite `cd && cd Iris && nano lib/Databases/Configurations/config.json`.

2. Navegue até onde possui `@s.whatsapp.net` usando as setas do Termux, arrastar o dedo na tela também funciona.
	- Se tiver inserido um número antes, você verá ele ali.

3. Vá até `MyNumber` e apague-o, digite seu número no lugar.
	- O número deve ser igual ao mostrado no WhatsApp, por exemplo: '55119987654321'

4. Se já tiver editado antes, e quiser adicionar outro, vá até o final da linha, onde está `]` e apague-o, então adicione `, "outroNúmero@s.whatsapp.net"]`.
	- Troque 'outroNúmero' pelo número em questão, no mesmo jeito da dica Nº3.

5. Quando tiver terminado, aperte `Control + O` e então aperte `Enter`, você terá inserido com sucesso seu número, então aperte `Control + X` para sair.

### 🌐 Método Nº3 - Usando o Terminal WEB da Íris

1. Inicie a Íris, você receberá na tela um endereço de IP e porta que é acessivel somente pela sua rede.
	- Se o IP mostrado for interno, você deve usar o IP do seu telefone, ele pode ser encontrado acessando as configurações de WiFi do aparelho ou indo em 'Sobre o Telefone'.

2. Abra um navegador e digite o endereço de IP e a porta, ficando como `192.168.0.123:45678`.
	- Pode aparecer um erro dizendo que a página não é segura, mas não se preocupe, isso é por conta da Íris rastrear quem ousar acessar essa página, apenas clique em 'Aceite o risco' e prossiga.
	- O rastreamento será mostrado no terminal, de forma que, se algum invasor tentar acessar caso você modifique para IP externo, você possa rastrea-lo.

3. Insira o nome de usuario e senha mostrados no terminal, isso pode ser configurado apartir do arquivo `utils.json` da pasta `Terminal`, mas não é esse o foco desse guia.

4. Uma vez conectado, você estará em uma página com um terminal linux diretamente no navegador, não se confunda, ele é extremamente poderoso e você NÃO DEVE brincar aqui.

5. Digite `config.owner.value.push('seuNumero@s.whatsapp.net');`, se o terminal exibir um 2, você estará pronto para seguir, se quiser ter certeza, digite `config.owner.value`, então seu número deve aparecer.

6. Para salvar eternamente digite `fs.writeFileSync(path.normalize(irisPath+'/lib/Databases/Configurations/config.json'), JSON.stringify(config, null, 4));`, isso não deve printar nada na tela, mas se algo aparecer e não for um erro, você pode continuar.

7. Para ter certeza de que deu certo, você pode digitar `JSON.parse(fs.readFileSync(path.normalize(irisPath+'/lib/Databases/Configurations/config.json')))?.owner?.value;` e se o número estiver lá, tudo ocorreu bem e seu número já está salvo.

8. Feche o navegador, volte ao Termux e continue o guia.
	- Se quiser executar Python, Bash, Node ou outras tarefas pelo Terminal WEB, você pode! Siga esse exemplo: `Indexer('bash').bash('seu comando').value;`.
	- Exemplo: `Indexer('bash').bash('python -c "print("123")"').value;`
	- Tenha em mente que processos demorados, como `APT`, podem causar problemas ou levar uma eternidade para funcionar, só use o que você entender.
	- Você também pode abrir jogos com isso, por exemplo, para abrir `GTA V` pela Steam: `Indexer('bash').bash('start steam://rungameid/271590').value;`
	- Basicamente, tudo pode ser feito neste terminal, desde coisinhas simples de JavaScript a coisas avançadas, como instalações e demais, tanto na rede local, como em outro país.

## 🏁 Etapas finais

Parabéns por chegar até aqui! Agora só resta iniciar e aproveitar, para isso, siga os próximos passsos:

1. Digite `cd && cd Iris` para voltar até a pasta da Íris e então digite `npm start` para iniciar.

2. Você receberá um QR code na tela, para escanear você tem duas alternativas, abaixo você verá as formas.

### 📞 Usando outro telefone

1. Com outro telefone, tire uma foto da tela onde o QR code está.

2. Rápidamente abra o WhatsApp no telefone que você deseja usar, abra o escaneamento de QR code e escaneie a foto.

3. Aguarde a Íris dizer que a sessão iniciou, tenha em mente de estar atento a possiveis erros.

### 🤳 Usando dois espelhos e um pouco de mágica (habilidade)

1. Reduza o tamanho da fonte do termux fazendo um gesto de pinça na tela.

2. Vá até um lugar com um espelho na sua frente e um atrás.

3. Abra o Termux no modo de tela dividida com o WhatsApp, ou se puder, use o WhatsApp em modo de balão flutuante, desde que o mesmo não ofusque o QR.

4. Posicione o telefone de frente ao primeiro espelho de forma que você consiga fazer a camera visualizar o Termux pelo segundo espelho, dê zoom ou deixe-os bem próximos.

5. Rapidamente escaneie o QR code na tela do Termux.

## 🙏 Finalizando

Parabéns por conseguir a instalação, agora você pode aproveitar a Íris em seu total controle!

## ❗ Dicas

- Se você possui ROOT, pode editar a Íris por um aplicativo de sua escolha e então colar seu arquivos dentro da pasta `data/data/com.termux/files/home/Ubuntu22-fs/root/Iris`.
- Tome cuidado pois Íris tem a capacidade de rodar comandos de terminal linux no WhatsApp, não dê permissão de dono a qualquer um, eles podem causar danos a você.