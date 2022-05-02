### O que a configuração faz? O que acontece se não a fizer?  
  
A configuração é essencial, pois afeta comandos, se você não os configurar, você perderá acesso aos comandos que precisam de uma API-KEY, como `Anti-Porn`, `Reconhecimento de Música` `Nasa` e entre outros.  
  
### Como configurar?  
  
Para configurar estes parâmetros, ache a pasta da Íris que você baixou com o `Git Clone` - **Não é online na Github!** - e vá para a pasta `Lib/Config/Settings`, abra o arquivo necessário com qualquer editor de texto - recomendo o uso de [NotePad++](https://notepad-plus-plus.org/downloads/) se estiver no Windows - e agora basta editar.  
  
<details>  
	<summary><h3>CONFIGURAÇÕES DE API - APIS.JSON - [CLIQUE AQUI]</h3></summary>  
	  
------  
> Você pode obter uma API-KEY após criar uma conta no site requisitado, todos as APIS são gratuitas e não precisam de cartão de crédito ou similares, com exceção da IBM, que pede para verificação de Identidade, mas seu uso segue gratuito após isso.  
>  
> NÃO EDITE OS ARQUIVOS PELO NAVEGADOR!  
>  
------  
> - [Localização da API 1 - API-Flash](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L27) → Para tirar prints de sites.  
> - [Adquira a KEY API-Flash](https://apiflash.com/dashboard/access_keys)  
------  
> - [Localização da API 2 - RemoveBG](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L43) → Para criação de stickers sem fundo.  
> - [Adquira a KEY RemoveBG](https://www.remove.bg/pt-br/dashboard#api-key)  
------  
> - [Localização da API 3 - WallHaven](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L49) → Para Wallpapers.  
> - [Adquira a KEY WallHaven](https://wallhaven.cc/settings/account)  
------  
> - [Localização da API 4 - Deep-AI](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L15) → Para Anti-Porn, Colorfy e outros.  
> - [Adquira a KEY Deep-AI](https://deepai.org/dashboard/profile)  
------  
> - [Localização da API 5 - The-Movie-Database](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L46) → Para informações de filmes.  
> - [Adquira a KEY The Movie Database](https://www.themoviedb.org/settings/api)  
------  
> - [Localização da API 6 - ACR-Cloud](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L5-L7) → Para identificação de música.  
> - [Adquira a KEY ACR-Cloud](https://console.acrcloud.com/avr#/projects/online)  
------  
> - [Localização da API 7 - NEWSAPI](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L24) → Para Noticias.  
> - [Adquira a KEY NEWSAPI](https://newsapi.org/account)  
------  
> - [Localização da API 8 - IBM-WATSON](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L10-L12) → Para converter áudio em texto.  
> - [Adquira a KEY IBM-WATSON](https://cloud.ibm.com/catalog/services/speech-to-text)  
------  
> - [Localização da API 9 - HERE](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L52-L53) → Para informações de mapas.  
> - [Adquira a KEY HERE](https://developer.here.com/projects)  
------  
> - [Localização da API 10 - RAWG](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L30) → Para informações de jogos.  
> - [Adquira a KEY RAWG](https://rawg.io/@ll0/apikey)  
------  
> - [Localização da API 11 - BRAINSHOP](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L33-L35) → Para uma I.A de conversa - Opcional.  
> - [Adquira a KEY BRAINSHOP](https://brainshop.ai)  
------  
> - [Localização da API 12 - GOOGLE-MAPS](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L18) → Para fotos Street-View - Opcional.  
> - [Adquira a KEY GOOGLE-MAPS](https://developers.google.com/maps/documentation/maps-static/get-api-key#get-an-api-key)  
------  
> - [Localização da API 13 - NASA](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L21) → Para noticias diárias da NASA - Opcional.  
> - [Adquira a KEY NASA](https://api.nasa.gov)  
------  
> - [Localização da API 14 - SIMSIMI](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L36-L39) → Para ter uma Chat-BOT mais avançada - Opcional.  
> - [Adquira a KEY SIMSIMI](http://developer.simsimi.com/api)  
------  
  
</details>  
  
<details>  
	<summary><h3>CONFIGURAÇÕES DE USUÁRIO - CONFIG.JSON - [CLIQUE AQUI]</h3></summary>  
  
------  
> Todas as configurações são opcionais, exceto `Owner` e `Owner_SECRET_Password`, se você estiver fora do Brasil, `DDI` e `Language` também são importantes.  
>  
------  
> - [Akinator_Win](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L2) → É a porcentagem de advinha para que o Akinator chute quem é.  
> - Valores: número  
> - Padrão: 90  
------  
> - [Anti_Flood](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L3) → Bloqueia o Spam de comandos, valores muito baixos podem causar ban do WhatsApp.  
> - Valores: número (tempo em segundos)  
> - Padrão: 10  
------  
> - [Auto_Block](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L4) → Bloqueia pessoas automaticamente, isso reduz um pouco a velocidade da Íris.  
> - Valores: true, false  
> - Padrão: false  
------  
> - [Auto_Update](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L5) → Atualiza a Íris em tempo real sempre que você editar um código.  
> - Valores: true, false  
> - Padrão: false  
------  
> - [Backup_Time](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L6) → O tempo entre cada Backup de arquivos importantes.  
> - Valores: número (tempo em minutos)  
> - Padrão: 60  
------  
> - [Block_Calls](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L7) → Bloqueia chamadas e quem as efetuar.  
> - Valores: true, false  
> - Padrão: true  
------  
> - [Bomber_Port](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L8) → A porta de acesso do Bomber-API, se você tiver problemas ao ligar, mude para uma aleatória, recomendo que seja 4 dígitos.  
> - Valores: número  
> - Padrão: 3000  
------  
> - [Ban_All_Links](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L9) → Bane quem mandar quaisquer tipo de link.  
> - Valores: true, false  
> - Padrão: false  
------  
> - [Bot_Commands](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L10) → Permite que a Íris rode comandos em si mesma, você também pode fazer isso acessando o WhatsApp dela.  
> - Valores: true, false  
> - Padrão: false  
------  
> - [Canvas_Audio](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L11) → Envia um áudio predeterminado sempre que alguém sair ou entrar no grupo.  
> - Valores: true, false  
> - Padrão: false  
------  
> - [Clear_Cache](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L12) → Limpa o cache das mensagens após 'x' tempo.  
> - Valores: true, false  
> - Padrão: true  
------  
> - [Filter_Type](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L13) → Modos de uso do Anti-Flood.  
> - Valores: 'user', 'chatId'  
> - Padrão: 'chatId'  
------  
> - [Daily_Reward](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L13) → A recompensa dos resgates diários de recompensa.  
> - Valores: número  
> - Padrão: 30  
------  
> - [Day_Messages](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L13) → Envia mensagens de cumprimento a cada 6 horas.  
> - Valores: true, false  
> - Padrão: false  
------  
> - [DDI](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L16-L19) → Bane pessoas com números falsos ou números internacionais.  
> - Valores: array de números  
> - Padrão: ["55", "DDI DOIS - Opcional"]  
------  
> - [Enable_EAS](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L20) → Ativa as transmissões de KillovSky no terminal, é útil para receber noticias sobre updates.  
> - Valores: true, false  
> - Padrão: true  
------  
> - [Enable_Backups](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L21) → Ativa o Backup de arquivos importantes.  
> - Valores: true, false  
> - Padrão: true  
------  
> - [Fig_FPS](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L22) → O FPS dos stickers animados, valores muito altos podem causar erros com o peso.  
> - Valores: número  
> - Padrão: 10  
------  
> - [Iris_Coin](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L23) → Quantidade de I'coins ganhas por level e adicional em jogos.  
> - Valores: número  
> - Padrão: 10  
------  
> - [Language](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L24) → Linguagem de todos os diálogos, textos e traduções.  
> - Valores: "en", "pt", "es"  
> - Padrão: "pt"  
------  
> - [Max_Backups](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L25) → Controla a quantidade de Backups na pasta de Backups.  
> - Valores: número  
> - Padrão: 3  
------  
> - [Max_Characters](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L26) → Expulsa quem mandar travas ou textos muito longos.  
> - Valores: número  
> - Padrão: 5000  
------  
> - [Max_Commands](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L27) → Define o limite do uso de múltiplos comandos após alguém tentar usar vários em uma mensagem.  
> - Valores: número  
> - Padrão: 2  
------  
> - [Max_Download_Size](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L28) → Controla o peso máximo de upload de mídia, não afeta comandos de dono como 'upload'.  
> - Valores: número  
> - Padrão: 16  
------  
> - [Max_Groups](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L29) → A quantidade máxima de grupos na Íris, ao passar deste valor, ela saíra até que chegue no valor especificado.  
> - Valores: número  
> - Padrão: 10  
------  
> - [Max_Msg_Cache](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L30) → Configura o número de mensagens necessário para a limpeza de cache.  
> - Valores: número  
> - Padrão: 3000  
------  
> - [Max_Revoked](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L31) → Quantidade máxima de mensagens revogadas, ao passar o limite, as ultimas da lista serão apagadas.  
> - Valores: número  
> - Padrão: 20  
------  
> - [Min_Steal](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L32) → Quantidade mínima de LOOT que os ladrões obtêm no comando 'steal'.  
> - Valores: número  
> - Padrão: 10  
------  
> - [Max_Steal](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L33) → Quantidade máxima de LOOT que os ladrões podem obter no 'steal'.  
> - Valores: número  
> - Padrão: 1000  
------  
> - [Steal_Reduce_Limit](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L34) → Configura a redução de valores do 'Steal', não use valores abaixo de 1.  
> - Valores: número  
> - Padrão: 3  
------  
> - [Max_Votes](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L35) → Quantidade padrão de votos necessários, caso o criador não especifique manualmente.  
> - Valores: número  
> - Padrão: 10  
------  
> - [Max_XP_Earn](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L36) → Quantidade máxima de XP que os usuários podem obter no sistema de level.  
> - Valores: número  
> - Padrão: 50  
------  
> - [Steal_Percent_Sucess](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L37) → Taxa de sucesso dos comandos de steal.  
> - Valores: número  
> - Padrão: 70  
------  
> - [Min_Membros](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L38) → Quantidade mínima de membros que um grupo deve obter para que a Íris permaneça nele.  
> - Valores: número  
> - Padrão: 1  
------  
> - [Min_XP_Earn](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L39) → Quantidade mínima de XP que os usuários podem obter no sistema de level.  
> - Valores: número  
> - Padrão: 15  
------  
> - [Minimal_Similarity_Command](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L40) → A quantidade mínima de similaridade para a correção de comandos escritos incorretamente.  
> - Valores: número  
> - Padrão: 70  
------  
> - [Moment_Locale](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L41) → Configura o local para obter um horário correto.  
> - Valores: [string](https://github.com/moment/moment/tree/develop/locale)  
> - Padrão: "pt_BR"  
------  
> - [Moment_Timezone](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L42) → Configura a timezone para obter o horário UTC correto.  
> - Valores: [string](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)  
> - Padrão: "America/Sao_Paulo"  
------  
> - [Multitasking](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L43) → Ao ativar isso, a Íris pode executar múltiplos comandos enviados em apenas uma mensagem.  
> - Valores: true, false  
> - Padrão: false  
------  
> - [Niver_Present](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L44) → O valor do presente de aniversario dos usuários em I'coin.  
> - Valores: número  
> - Padrão: 1000  
------  
> - [Owner](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L45-L49) → A lista de donos da Íris, pessoas inseridas aqui possuem total controle dos sistemas da Íris.  
> - Valores: array de números com string  
> - Padrão: ["Insira seu número@c.us", "Número 2 - Opcional@c.us", "Não remova o @c.us - 3° Número@c.us"]  
> Example: ["5511987654321@c.us"]  
------  
> - [Hide_Owner_Number](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L50) → Oculta o número do dono na maioria dos comandos por segurança.  
> - Valores: true, false  
> - Padrão: false  
------  
> - [Popup](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L51) → Ativa as notificações da Íris na sua tela do PC.  
> - Valores: true, false  
> - Padrão: false  
------  
> - [Prefix](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L52-L69) → Prefixos da Íris, mensagens que comecem com eles serão detectadas como comandos.  
> - Valores: array de qualquer coisa  
> - Padrão: ["/", "$", "#", ".", "\\", "@", "=", "?", "+", "!", "&", ":", ";", "^", ">", "<"]  
------  
> - [Max_Divider_Win](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L70) → Quantidade de redução das perdas e ganhos nos jogos, não configure como abaixo de 1.  
> - Valores: número  
> - Padrão: 3  
------  
> - [Prize_Value_Max](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L71) → O premio máximo de alguns jogos como 'Mix'.  
> - Valores: número  
> - Padrão: 200  
------  
> - [Prize_Value_Min](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L72) → O premio mínimo de alguns jogos como 'Mix'.  
> - Valores: número  
> - Padrão: 20  
------  
> - [Puppeteer_Wait](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L73) → Tempo máximo de espera do puppeteer, após esgotar, a Íris fechará os comandos como CPF forçadamente.  
> - Valores: número (time in milissegundos)  
> - Padrão: 220000  
------  
> - [Search_Results](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L75) → Quantidade máxima de resultados no comando 'duck'.  
> - Valores: número  
> - Default: 10  
------  
> - [StartUP_MSGs_Groups](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L76) → Se você ativar isto, a Íris avisará que ficou online em todos os grupos.  
> - Valores: true, false  
> - Padrão: false  
------  
> - [Sticker_Author](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L77) → Autor padrão dos stickers, se você quiser definir como quem enviar a mensagem, basta não editar.  
> - Valores: string  
> - Padrão: "DONTEDITUSR - DONTEDITGPN"  
------  
> - [Sticker_Pack](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L78) → Nome padrão dos packs de sticker.  
> - Valores: string  
> - Padrão: "🔰 Legião Z [bit.ly/BOT-IRIS] Íris ⚜️"  
------  
> - [User_Agent](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L79) → User-Agent padrão para módulos como 'axios' e outros, útil para evitar bloqueios de U.A na Íris.  
> - Valores: [string](https://www.whatismybrowser.com/guides/the-latest-user-agent/chrome)  
> - Padrão: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36"  
------  
> - [Update_CMDS_On_Boot](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L80) → Atualiza a lista de comandos na inicialização, útil para quem sempre cria novos comandos.  
> - Valores: true, false  
> - Padrão: false  
------  
> - [Wait_to_Play](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L81) → Tempo de espera para jogar novamente jogos após jogar.  
> - Valores: número (tempo em minutos)  
> - Padrão: 30  
------  
> - [Wait_to_Win](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L82) → Tempo de espera de cada ganho de XP.  
> - Valores: número (tempo em minutos)  
> - Padrão: 60  
------  
> - [XP_Difficulty](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L83) → Dificuldade do sistema de XP, quanto maior o número, maior é a dificuldade para subir de nivel.  
> - Valores: número  
> - Padrão: 5  
------  
> - [Your_Name](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L84) → Nome ou apelido do dono, será usado quando o sticker não puder ser criado com valores padrão, use somente letras normais.  
> - Valores: string  
> - Padrão: "KillovSky"  
------  
> - [Owner_SECRET_Password](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L85) → A senha secreta do dono, se você não definir um 'Owner', basta colocar essa senha na mensagem para usar os comandos de dono, NÃO DEIXE A SENHA PADRÃO!  
> - Valores: string  
> - Padrão: "irisBOT@Root"  
------  
  
</details>  