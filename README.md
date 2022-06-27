
<p align="center">
<img src="https://i.imgur.com/nwCL7zU.png" width="512" height="512"/>
</p>
</p>
<p align="center">
<a href="https://github.com/KillovSky/iris/stargazers/"><img title="Stars" src="https://img.shields.io/github/stars/KillovSky/iris?color=red&style=flat-square"></a>
<a href="https://github.com/KillovSky/iris/network/members"><img title="Forks" src="https://img.shields.io/github/forks/KillovSky/iris?color=red&style=flat-square"></a>
<a href="https://github.com/KillovSky/iris/watchers"><img title="Watching" src="https://img.shields.io/github/watchers/KillovSky/iris?label=Watchers&color=blue&style=flat-square"></a>
</p>
  
# Projeto Íris  
  
## Selecione outro idioma:
  
 * [Español](https://github.com/KillovSky/iris/blob/main/.readme/es/README.md).  
 * [English](https://github.com/KillovSky/iris/blob/main/.readme/en/README.md).  
  
Íris é uma robô inteligente para WhatsApp.  
  
Possuindo diversos comandos comandos diferentes e recebendo algumas atualizações relativamente frequentes com novos recursos, correções e melhorias.  
  
# Página da Íris  
  
A Íris possui um site para caso queria saber algumas informações adicionais sobre ela. [Clicando Aqui](https://www.irisbot.com.br/) você será redirecionado para o site da Íris.  
Tambem existe uma pequena documentacão aqui no Github mesmo, [clique aqui](http://htmlpreview.github.io/?https://github.com/KillovSky/iris/blob/main/.readme/donates/page.html) para ver. Essa versão somente será atualizada quando novos updates da Íris forem feitos. Se você quiser ver a versão mais atualizada dessa pagina, basta acessar a [Versão JS Fiddle](https://jsfiddle.net/KillovSky/mgp6ed3x/show).  
  
# Erros, Bugs, Soluções, Melhorias e Sugestões  
  
Se quiser reportar um bug, tiver soluções, melhorias ou sugestões, poste elas [aqui](https://github.com/KillovSky/iris/issues/), estou de olho a todo momento e fornecendo suporte nesta página. Mas lembre-se, esta página é apenas para o Projeto Íris, eu NÃO ofereço suporte a outros programas.  
> Não crie pull-requests, elas serão RECUSADAS, entretanto sua ideia será analisada e adicionada manualmente em futuros updates, com créditos a você claro. Se ela for uma boa adição ao sistema, se possível, insira seu código em um arquivo 'TXT' e crie uma issue anexando este arquivo.  
  
# Funcionalidades 
  
A Íris possui centenas de comandos diferentes, não posso descrever todos, mas você pode checar esse [arquivo](https://raw.githubusercontent.com/KillovSky/iris/lib/config/Utilidades/Comandos_Automate.txt) para obter a lista e ter uma ideia melhor.  
  
# Requisitos para a instalação da Íris  
  
## Windows - Instalação via Executáveis  
  
> Se você tiver algum problema com a Íris Shell no windows, apenas inicie pelo `Git Bash` e funcionará, se você quiser usar CMD, PowerShell ou outro terminal, você vai precisar inserir o `bash.exe` na sua PATH do windows, basta [Seguir Isto](https://github.com/KillovSky/iris/issues/456#issuecomment-1001087525) para adicionar, mas **tenha muito cuidado.**  
  
- [NodeJS](https://nodejs.org) - Interface de programação da Íris, use a LTS.  
  
- [Chrome](https://www.google.com/chrome/) - Para enviar vídeos, fotos e outros documentos - Opcional, mas muito recomendado.  
  
- [Gow](https://github.com/bmatzelle/gow/releases) - Para comandos Linux e GNU/Bash.  
  
- [Git](https://git-scm.com) - Para outros comandos de Linux, GNU/Bash e terminal Shell.  
  
- [Tesseract OCR](https://tesseract-ocr.github.io/tessdoc/Downloads) - Para a leitura de imagens.  
  
## Linux - Instalação via Terminal  
  
Para instalar todos os requisitos basta rodar estes comandos (você pode copiar tudo e colar no terminal):  
  
```bash  
# Atualiza os repositórios e programas do Linux  
sudo apt update && sudo apt upgrade -y  
  
# Instala cURL e WGET para baixar o Chrome e Node.js LTS  
sudo apt install curl wget -y  
  
# Baixa o chrome 'Stable' mais recente (apenas x64)  
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb  
  
# Instala o repositório do Node.js LTS no APT Sources  
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo bash  
  
# Instala todos os programas de uma vez só  
sudo apt install nodejs python python3 python3-pip git build-essential tesseract-ocr ./google-chrome-stable_current_amd64.deb -y  
```  
  
>Se você receber o erro `sudo command not found`, remova `sudo` do comando e tente.  
  
> Se você receber o erro `apt: command not found`, tente usar `apt-get`.  
  
>Se `apt-get` também não funcionar, você pode precisar compilar `apt` no seu sistema, apenas [Verifique Isto - 'Usuários Avançados'](https://askubuntu.com/questions/860375/installing-apt-get), ou mude a sua Distro, utilizei e recomendo `Anti-X` e `Xubuntu Minimal`, são os mais leves para computadores ruins, em minha opinião, mas o `Windows 8.1` ou superior pode funcionar também.  
  
# Instalação  
> Para baixar a Íris - [Após ter os [requisitos](./README.md#requisitos-para-a-instalação-da-íris).] - dê uma olhada [Neste Tutorial](https://github.com/KillovSky/iris/discussions/28) ou [Aqui](http://htmlpreview.github.io/?https://github.com/KillovSky/iris/blob/main/.readme/donates/page.html), você também pode instalar digitando os seguintes comandos:  
  
```bash  
# Baixa os arquivos  
git clone https://github.com/KillovSky/iris.git  
  
# Entra na pasta da Íris  
cd iris  
  
# Instala os módulos  
npm i  
  
# Se você quiser atualizar a Íris um dia pelo 'tools.sh', rode apenas uma vez:  
pip install unidecode  
```  
  
## Mudanças obrigatórias  
Antes de fazer a inicialização, você precisa configurar todos os parâmetros não opcionais descritos [aqui](https://github.com/KillovSky/iris/blob/main/.readme/en/config.md), caso contrario, muitos comandos não vão funcionar.  
  
## Iniciar  
Existem três meios de abrir a Íris, você pode olhar e decidir abaixo, lembre-se de abrir um terminal na pasta da Íris:  
  
```bash  
# Método 1 - A Toolbox A.I.O - Melhor (Português apenas)  
# Esse método inclui diversas formas de ligar, assim como o método 1 e 2  
bash tools.sh  
# Ou use:  
./tools.sh  
  
  
# Método 2 - O padrão - Simples, mas direto  
npm start  
# Ou use:  
node start.js  
  
  
# Método 3 - PM2 - Reinicializa após um "erro" grave - Pesa bem mais  
# Isso requer PM2, você pode instalá-lo a partir do Método 1 ou digitando: 'npm i -g pm2'  
pm2 start start.js --name iris  
  
# Para reiniciar o PM2 a cada 6 horas para melhorar o desempenho, use o Método 1 ou digite:  
pm2 start start.js --name iris --cron-restart="0 */6 * * *"  
```  
  
## Todos os comandos  
> Tenha em mente que os menus ainda estão desatualizados, então você pode verificar [Este Arquivo](https://raw.githubusercontent.com/KillovSky/iris/lib/config/Utilidades/Comandos_Automate.txt) para obter todos os comandos e ter uma ideia.  
  
Se você deseja receber o menu desatualizado, entretanto bonito, envie `/menu` para a Íris.  
  
Para obter o menu mais atualizado possível, envie `/menut` para a Íris.  
  
# Construir novos comandos  
Para criar comandos **com prefixo**, olhe [Essa Base](https://github.com/KillovSky/iris/blob/main/lib/functions/config.js#L6289), apenas remova a "/\*" e "\*/", insira os detalhes no código e salve, você pode checar o [Tutorial PT-BR](https://github.com/KillovSky/iris/blob/main/Tutorial%20de%20Edi%C3%A7%C3%A3o%20PT-BR.txt) para uma instrução de como fazer `cases`.  
  
Para criar comandos **sem prefixo**, use [Esta Base](https://github.com/KillovSky/iris/blob/main/lib/functions/config.js#L683), basta remover a "/\*" e "\*/", editar o código com os detalhes e salvar, é muito mais recomendável usar uma `case`.  
  
Para obter todas as funções que a Íris pode rodar, acesse a [Página da WA-Automate](https://docs.openwa.dev/classes/api_Client.Client.html).  
  
## Desativar o auto abrir navegador do Bomber-API  
Você pode abrir de duas formas:  
  
1. Abra o `Git Bash` na pasta da Íris e digite `bash tools.sh`, selecione a `Opção 14 - Desativar navegador Bomber-API`, basta inserir `14`, espere a mensagem de `done` e pronto.  
  
2. Abra a pasta ```node_modules``` e vá para a ```bomber-api```, abra o arquivo ```index.js``` e remove as linhas ```"open(`http://localhost:3000/`)"``` & ```"open(`http://localhost:${arguments.port}/`)"```.  
  
Você precisa executar essa desativação sempre que rodar `npm update`, `npm i` ou `npm install`.  
  
## Erro da porta 3000  
Para corrigir, use uma das formas a seguir:  
  
1. Edite o número `3000` na linha ```"app.listen(3000"```, localizada em `node_modules/Bomber-API/index.js` - mesmo lugar do auto-abrir navegador - mas lembre-se de editar a `Bomber_Port` na `config.json` depois.  
  
2. Abra o `Git Bash` na pasta da Íris e digite `bash tools.sh`, selecione `Mudar porta da Bomber-API`, digite um número, espere pelo `done` e pronto - Recomendado.  
   
# Atualizar Íris, Módulos e Mais  
Você pode fazer **TUDO** usando o método 1,mas se você preferir fazer isso de forma manual, aqui está o meio, lembre-se de abrir um terminal na pasta da Íris.  
  
```bash  
# Usando 'Tools.sh' - O melhor - Tudo em Um  
bash tools.sh  
  
# Manualmente - Atualizar módulos  
npm update  
  
# Você só precisa atualizar a Íris quando aparecer "[UPDATE]" ao ligar.  
# A atualização salvando as configurações, só está disponível na 'Tools.sh'.  
# Se você quer atualizar sem salvar, faça a instalação novamente.  
```  
# Licença
Esse software usa a licença [MIT](https://choosealicense.com/licenses/mit/).  
<img src="https://i.imgur.com/v3VtA1P.png" width="719" height="301"/><br>
É proibido a remoção dos créditos, lembre-se que gastei uma quantidade de tempo enorme para manter isto atualizado gratuitamente para todos.  
Peço que não remova os créditos, por gentileza.  
Se você ver alguém plagiando, mostre a verdade, diga ser um plágio.  
  
# Agradecimentos, Doações e Suporte  
> [Doações] - Esse projeto não possui foco lucrativo, doe se você puder ❤️<br>  
<details><summary> Pix </summary><img src="https://i.imgur.com/UrRdL5g.png" width="256" height="256"/><br>  
  
**Copia e cola**  
  
>fc270199-2d55-4d91-be5c-bfbd431cfad4  
</details>  
<details><summary>Paypal</summary>  
  
https://bit.ly/33QDaGa  
  
</details>  
<details><summary>Picpay</summary>  
  
https://picpay.me/userlucas123  
  
</details><br>  
  
## Agradeço do meu coração a todos que apoiam a Íris  
  
* Qualquer outra informação está disponível [aqui](http://htmlpreview.github.io/?https://github.com/KillovSky/iris/blob/main/.readme/donates/page.html).  
  