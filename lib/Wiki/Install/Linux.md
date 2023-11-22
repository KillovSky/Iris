# ✏️ Guia de Instalação no Linux

Este guia irá ajudá-lo a instalar a Íris no Linux usando um script e executando comandos específicos.

O linux usado aqui será o PeppermintOS Debian, meu Linux atual, mas isso pode funcionar em quase todos os linux por ai, se o seu Linux for o Arch, um baseado nele ou um Linux que não use APT, esse guia não é para você, mas você pode simplesmente procurar por comandos substitutos ao APT desse guia para sua distro, e então seguir suas etapas finais.

## 📝 Sumário

1. [🔎 O que é Linux?](#-o-que-é-linux)
2. [✓ Pré-Requisitos](#-pré-requisitos)
3. [⚙️ Instalando a Íris](#%EF%B8%8F-instalando-a-íris)
4. [📜 Configuração](#-configuração)
    - [👨‍💻 Método Nº1 - Usando CLI](#-método-nº1---usando-cli)
    - [💌 Método Nº2 - Usando nano](#-método-nº2---usando-nano)
    - [🌐 Método Nº3 - Usando o Terminal WEB da Íris](#-método-nº3---usando-o-terminal-web-da-íris)
    - [🐔 Método Nº4 - Usando um Editor GUI](#-método-nº4---usando-um-editor-gui)
5. [🏁 Etapas Finais](#-etapas-finais)
6. [🙏 Finalizando](#-finalizando)
7. [❗ Dicas](#-dicas)

## 🔎 O que é Linux?

Linux é um sistema operacional de código aberto utilizado em servidores, dispositivos embarcados e é a base de distribuições populares, como Ubuntu, Debian e Fedora. O Linux oferece estabilidade, segurança e flexibilidade, permitindo que os usuários personalizem seu ambiente de computação de acordo com suas necessidades. Sua natureza de código aberto promove colaboração global e inovação contínua. É uma alternativa bem popular e mais leve que Windows, ainda que não seja muito avançada no quesito de jogos.

## ✓ Pré-Requisitos

Antes de iniciar a instalação da Íris no Linux, certifique-se de atender aos seguintes Pré-Requisitos:

1. [Linux](https://distrochooser.de)
2. Pelo menos 600MB a 1GB de RAM livre
3. Processador single-core 3.2GHZ ou qualquer dual-core acima de 1.2GHz ou superior
4. 3GB de espaço livre (Recomendado: 5GB+)

## ⚙️ Instalando a Íris

Uma vez que você tenha instalado todos os requisitos, abra um terminal e digite `cd`, depois copie e cole os seguintes comandos para instalar os requisitos do ambiente da Íris, você pode copiar e colar o texto inteiro abaixo se preferir.

```bash
# Atualiza os repositórios e programas
sudo apt update && sudo apt upgrade -y

# Instala os requisitos para inserção da repo do NodeJS 18 | https://github.com/nodesource/distributions
sudo apt install ca-certificates curl gnupg -y

# Cria a pasta keyrings para inserir as do NodeJS
sudo mkdir -p /etc/apt/keyrings

# Obtém a keyring do NodeJS e insere na pasta criada
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

# Instala o repositório do NodeJS no sistema
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_18.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list

# Atualiza os repositórios
sudo apt update && sudo apt upgrade -y

# Instala os programas necessarios de uma só vez
sudo apt install nodejs sqlite build-essential zip unzip python2 python3 git tesseract-ocr nano -y

# Se o comando acima der erros no pacote python2, remova-o do comando e tente, depois copie e use este abaixo, se falhar de novo, ignore
# Se mais algum pacote falhar, contate o suporte
# sudo apt install python-is-python3

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

Uma vez que você tenha instalado tudo, feito todos os procedimentos acima, siga os passos abaixo para configurar seu número como dono da Íris e mudar a senha.

### 👨‍💻 Método Nº1 - Usando CLI

1. Digite `cd && cd Iris && sed -i 's/MyNumber/SeuNúmero/g' lib/Databases/Configurations/config.json`.
	- Você deve trocar 'SeuNúmero' pelo seu número no formato: DDI+DDD+Número.
	- O número deve ser igual ao mostrado no WhatsApp, por exemplo: 's/MyNumber/55119987654321/g'
	- Se você quiser inserir outro número manualmente, deve usar o método 2, 3 ou 4 a partir de agora.

2. Para mudar a senha padrão, digite: `cd && cd Iris && sed -i 's/IrisBOT@Root#123/NovaPassword/g' lib/Databases/Configurations/config.json`.

### 💌 Método Nº2 - Usando nano

1. Digite `cd && cd Iris && nano lib/Databases/Configurations/config.json`.

2. Navegue até onde possui `@s.whatsapp.net` usando as setas do teclado, clicar com o mouse também funciona.
	- Se tiver inserido um número antes, você verá ele ali.

3. Vá até `MyNumber` e apague-o, digite seu número no lugar.
	- O número deve ser igual ao mostrado no WhatsApp, por exemplo: '55119987654321'

4. Se já tiver editado antes, e quiser adicionar outro, vá até o final da linha, onde está `]` e apague-o, então adicione `, "outroNúmero@s.whatsapp.net"]`.
	- Troque 'outroNúmero' pelo número em questão, no mesmo jeito da dica Nº3.

5. Vá até `IrisBOT@Root#123` e apague-o, digite uma nova senha no lugar.

6. Quando tiver terminado, aperte `Control + O` e então aperte `Enter`, você terá inserido com sucesso seu número, então aperte `Control + X` para sair.

### 🌐 Método Nº3 - Usando o Terminal WEB da Íris

1. Inicie a Íris, você receberá na tela um endereço de IP e porta que é acessivel somente pela sua rede.
	- Se o IP mostrado for interno, você deve usar o IP do seu PC, ele pode ser encontrado acessando as configurações de WiFi do aparelho ou pelo comando `ifconfig`.

2. Abra um navegador e digite o endereço de IP e a porta, ficando como `192.168.0.123:45678`.
	- Pode aparecer um erro dizendo que a página não é segura, mas não se preocupe, isso é por conta da Íris rastrear quem ousar acessar essa página, apenas clique em 'Aceite o risco' e prossiga.
	- O rastreamento será mostrado no terminal, de forma que, se algum invasor tentar acessar caso você modifique para IP externo, você possa rastrea-lo.

3. Insira o nome de usuario e senha mostrados no terminal, isso pode ser configurado apartir do arquivo `utils.json` da pasta `Terminal`, mas não é esse o foco desse guia.

4. Uma vez conectado, você estará em uma página com um terminal linux diretamente no navegador, não se confunda, ele é extremamente poderoso e você NÃO DEVE brincar aqui.

5. Digite `config.owner.value.push('seuNumero@s.whatsapp.net');`, se o terminal exibir um 2, você estará pronto para seguir, se quiser ter certeza, digite `config.owner.value`, então seu número deve aparecer.

6. Digite `config.secretKey.value = 'NovaSenha'`, se o terminal retornar a mesma, você estará pronto, se quiser ter certeza, digite `config.secretKey.value`, sua nova senha deve aparecer.

7. Para salvar eternamente digite `fs.writeFileSync(path.normalize(irisPath+'/lib/Databases/Configurations/config.json'), JSON.stringify(config, null, 4));`, isso não deve printar nada na tela, mas se algo aparecer e não for um erro, você pode continuar.

8. Para ter certeza de que deu certo, você pode digitar `JSON.parse(fs.readFileSync(path.normalize(irisPath+'/lib/Databases/Configurations/config.json')))?.owner?.value;` e se o número estiver lá, tudo ocorreu bem e seu número já está salvo.

9. Feche o navegador, volte ao Termux e continue o guia.
	- Se quiser executar Python, Bash, Node ou outras tarefas pelo Terminal WEB, você pode! Siga esse exemplo: `Indexer('bash').bash('seu comando').value;`.
	- Exemplo: `Indexer('bash').bash('python -c "print("123")"').value;`
	- Tenha em mente que processos demorados, como `APT`, podem causar problemas ou levar uma eternidade para funcionar, só use o que você entender.
	- Você também pode abrir jogos com isso, por exemplo, para abrir `GTA V` pela Steam: `Indexer('bash').bash('start steam://rungameid/271590').value;`
	- Basicamente, tudo pode ser feito neste terminal, desde coisinhas simples de JavaScript a coisas avançadas, como instalações e demais, tanto na rede local, como em outro país.
	
### 🐔 Método Nº4 - Usando um Editor GUI

1. Vá até a pasta da Íris e acesse as pastas lib, Databases, Configurations.

2. Abra o arquivo config.json em um editor de sua preferência.

3. Vá até onde possui `@s.whatsapp.net`, se tiver inserido um número antes, você verá ele ali.

3. Vá até `MyNumber` e apague-o, digite seu número no lugar.
	- O número deve ser igual ao mostrado no WhatsApp, por exemplo: '55119987654321'

4. Se já tiver editado antes, e quiser adicionar outro, vá até o final da linha, onde está `]` e apague-o, então adicione `, "outroNúmero@s.whatsapp.net"]`.
	- Troque 'outroNúmero' pelo número em questão, no mesmo jeito da dica Nº3.

5. Vá até `IrisBOT@Root#123` e apague-o, digite uma nova senha no lugar.

6. Quando tiver terminado, salve e saia.

## 🏁 Etapas finais

Parabéns por chegar até aqui! Agora só resta iniciar e aproveitar, para isso, siga os próximos passsos:

1. Digite `cd && cd Iris` para voltar até a pasta da Íris e então digite `npm start` para iniciar.

2. Você receberá um QR code na tela, abra seu WhatsApp rapidamente e escaneie.

## 🙏 Finalizando

Parabéns por conseguir a instalação, agora você pode aproveitar a Íris em seu total controle!

## ❗ Dicas

- Tome cuidado pois Íris tem a capacidade de rodar comandos de terminal linux no WhatsApp, não dê permissão de dono a qualquer um, eles podem causar danos a você.
