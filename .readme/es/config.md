### Que hace la configuración? Que pasa si no edito?  
  
La configuración es fundamental porque afectan a los comandos, si no configuras no podrás acceder a los comandos que necesitan de las API-KEYs, como `Anti-Porn`, `Music-Recognition`, `NASA` y otros.  
  
### Como configurar?  
  
Para configurar estos parámetros, busque la ```Iris Folder``` que descargó con ```git clone``` - **NO EN EL NAVEGADOR** - y vaya a ```Lib/Config/Settings```, abra el archivo necesario con cualquier editor de texto (recomiendo usar [NotePad++](https://notepad-plus-plus.org/downloads/) si está usando Windows) y haga la magia.  
  
<details>  
	<summary><h3>AJUSTES DE API - APIS.JSON - [CLIC AQUÍ]</h3></summary>  
	  
------  
> Puede obtener una API-KEY creando una cuenta en el sitio solicitado. Y sí, todas las API son gratuitas y no necesitan tarjetas de crédito, excepto IBM, para validar su identidad, pero su uso es gratuito.  
>  
> NO EDITAR ARCHIVOS POR GITHUB EN EL NAVEGADOR!  
>  
------  
> - [API 1 Localización - API-Flash](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L27) → Para la captura de pantalla de páginas web.  
> - [GET API-Flash KEY](https://apiflash.com/dashboard/access_keys)  
------  
> - [API 2 Localización - RemoveBG](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L43) → Para crear stickers transparentes (sin fondo).  
> - [Get RemoveBG KEY](https://www.remove.bg/pt-br/dashboard#api-key)  
------  
> - [API 3 Localización - WallHaven](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L49) → Para Fondos de Pantalla.  
> - [Get WallHaven KEY](https://wallhaven.cc/settings/account)  
------  
> - [API 4 Localización - Deep-AI](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L15) → Para Anti-Porn, Colorfy y otros.  
> - [Get Deep-AI KEY](https://deepai.org/dashboard/profile)  
------  
> - [API 5 Localización - The-Movie-Database](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L46) → Para información sobre películas.  
> - [Get The Movie Database KEY](https://www.themoviedb.org/settings/api)  
------  
> - [API 6 Localización - ACR-Cloud](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L5-L7) → Para reconocimiento de música.  
> - [Get ACR-Cloud KEY](https://console.acrcloud.com/avr#/projects/online)  
------  
> - [API 7 Localización - NEWSAPI](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L24) → Para noticias.  
> - [Get NEWSAPI KEY](https://newsapi.org/account)  
------  
> - [API 8 Localización - IBM-WATSON](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L10-L12) → Para convertir voz a texto.  
> - [Get IBM-WATSON KEY](https://cloud.ibm.com/catalog/services/speech-to-text)  
------  
> - [API 9 Localización - HERE](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L52-L53) → Para información de mapas.  
> - [Get HERE KEY](https://developer.here.com/projects)  
------  
> - [API 10 Localización - RAWG](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L30) → Para información de juegos.  
> - [Get RAWG KEY](https://rawg.io/@ll0/apikey)  
------  
> - [API 11 Localización - BRAINSHOP](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L33-L35) → Para la conversación de IA. - Opcional  
> - [Get BRAINSHOP KEY](https://brainshop.ai)  
------  
> - [API 12 Localización - GOOGLE-MAPS](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L18) → Para imágenes de Street View. - Opcional  
> - [Get GOOGLE-MAPS KEY](https://developers.google.com/maps/documentation/maps-static/get-api-key#get-an-api-key)  
------  
> - [API 13 Localización - NASA](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L21) → Para avisos diarios de la NASA. - Opcional  
> - [Get NASA KEY](https://api.nasa.gov)  
------  
> - [API 14 Localización - SIMSIMI](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L36-L39) → Para conversación avanzada. - Opcional  
> - [Get SIMSIMI KEY](http://developer.simsimi.com/api)  
------  
  
</details>  
  
<details>  
	<summary><h3>AJUSTES DE USUARIO - CONFIG.JSON - [CLIC AQUÍ]</h3></summary>  
  
------  
> Todas las configuraciones son opcionales, excepto `Owner` y `Owner_SECRET_Password`, si no eres de Brasil, también debes cambiar `DDI` e `Language`.  
>  
------  
> - [Akinator_Win](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L2) → Es la cantidad de puntos para el akinator adivinar.  
> - Valores: número  
> - Predeterminado: 90  
------  
> - [Anti_Flood](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L3) → Bloquea el spam, establecerlo en un valor bajo puede causar un baño de WhatsApp.  
> - Valores: número (tiempo en segundos)  
> - Predeterminado: 10  
------  
> - [Auto_Block](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L4) → Bloquea personas peligrosas automáticamente (reduce la velocidad de la íris).  
> - Valores: true, false  
> - Predeterminado: false  
------  
> - [Auto_Update](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L5) → La Íris se actualiza automáticamente cuando edita el código del programa.  
> - Valores: true, false  
> - Predeterminado: false  
------  
> - [Backup_Time](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L6) → El tiempo entre cada Backup (archivos importantes de la iris).  
> - Valores: número (tiempo en minutos)  
> - Predeterminado: 60  
------  
> - [Block_Calls](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L7) → Bloquear llamadas y quién la hizo.  
> - Valores: true, false  
> - Predeterminado: true  
------  
> - [Bomber_Port](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L8) → El puerto de acceso Bomber-API. Si tiene un problema al iniciar, coloque un número aleatorio (se recomiendan 4 dígitos).  
> - Valores: número   
> - Predeterminado: 3000  
------  
> - [Ban_All_Links](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L9) → Expulsa a las personas que envían cualquier tipo de URL.  
> - Valores: true, false  
> - Predeterminado: false  
------  
> - [Bot_Commands](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L10) → Permita que Iris ejecute comandos en sí misma, también puede ejecutarlo en su WhatsApp.  
> - Valores: true, false  
> - Predeterminado: false  
------  
> - [Canvas_Audio](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L11) → Envía un audio cuando alguien entra o deja el grupo.  
> - Valores: true, false  
> - Predeterminado: false  
------  
> - [Clear_Cache](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L12) → Borra el caché de mensajes después de 'x' veces.  
> - Valores: true, false  
> - Predeterminado: true  
------  
> - [Filter_Type](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L13) → Modo de uso anti-flood.  
> - Valores: 'user', 'chatId'  
> - Predeterminado: 'chatId'  
------  
> - [Daily_Reward](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L13) → Lo valor de la recompensa del comando diario.  
> - Valores: número  
> - Predeterminado: 30  
------  
> - [Day_Messages](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L13) → Envía mensajes de saludo una vez a cada 6 horas.  
> - Valores: true, false  
> - Predeterminado: false  
------  
> - [DDI](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L16-L19) → Expulsa a las personas que usan números falsos o de otros países.  
> - Valores: array of números  
> - Predeterminado: ["55", "DDI DOIS - Opcional"]  
------  
> - [Enable_EAS](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L20) → Habilita las transmisiones de KillovSky in el Terminal, puede ser útil para obtener noticias sobre actualizaciones.  
> - Valores: true, false  
> - Predeterminado: true  
------  
> - [Enable_Backups](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L21) → Habilita el backup de archivos importantes de Íris.  
> - Valores: true, false  
> - Predeterminado: true  
------  
> - [Fig_FPS](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L22) → FPS de GIF/Video del sticker, establecer valores más altos causará 'errores' con el tamaño.  
> - Valores: número  
> - Predeterminado: 10  
------  
> - [Iris_Coin](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L23) → Cantidad de I-Coins para cada jugada.  
> - Valores: número  
> - Predeterminado: 10  
------  
> - [Language](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L24) → Todos los textos, diálogos y sistemas de traducción de Íris.  
> - Valores: "en", "pt", "es"  
> - Predeterminado: "pt"  
------  
> - [Max_Backups](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L25) → Controla los Backups máximos en la carpeta 'Backups'.  
> - Valores: número  
> - Predeterminado: 3  
------  
> - [Max_Characters](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L26) → Expulsa a cualquier un que envíe travas o textos extensos.  
> - Valores: número  
> - Predeterminado: 5000  
------  
> - [Max_Commands](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L27) → Bloquea el sistema de múltiples comandos cuando alguien intenta usar más de un comando en una mensaje.  
> - Valores: número  
> - Predeterminado: 2  
------  
> - [Max_Download_Size](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L28) → Controla el tamaño máximo de media. No se aplica a los comandos del propietario, como "upload".  
> - Valores: número  
> - Predeterminado: 16  
------  
> - [Max_Groups](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L29) → La cantidad máxima de grupos que íris puede unirse. Si va además del límite, ella se irá.  
> - Valores: número  
> - Predeterminado: 10  
------  
> - [Max_Msg_Cache](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L30) → Establece el límite de caché de mensajes.  
> - Valores: número  
> - Predeterminado: 3000  
------  
> - [Max_Revoked](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L31) → El máximo de mensajes revocados en la lista, eliminará la última mensaje revocada después de alcanzar el límite.  
> - Valores: número  
> - Predeterminado: 20  
------  
> - [Min_Steal](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L32) → La cantidad mínima de loot que un ladrón puede obtener usando el comando robar.  
> - Valores: número  
> - Predeterminado: 10  
------  
> - [Max_Steal](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L33) → La cantidad máxima de loot que un ladrón puede obtener usando el comando robar.  
> - Valores: número  
> - Predeterminado: 1000  
------  
> - [Steal_Reduce_Limit](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L34) → Establece la reducción de loot de robo. No utilice valores inferiores a 1.  
> - Valores: número  
> - Predeterminado: 3  
------  
> - [Max_Votes](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L35) → El máximo de votos para cada votacion si el creador no especifica el límite de votos por si mismo.  
> - Valores: número  
> - Predeterminado: 10  
------  
> - [Max_XP_Earn](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L36) → El XP máximo que puedes ganar en el sistema de leveling de RPG.  
> - Valores: número  
> - Predeterminado: 50  
------  
> - [Steal_Percent_Sucess](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L37) → Tasa de éxito de un robo.  
> - Valores: número  
> - Predeterminado: 70  
------  
> - [Min_Membros](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L38) → El número mínimo de miembros que Iris necesita para trabajar en un grupo.  
> - Valores: número  
> - Predeterminado: 1  
------  
> - [Min_XP_Earn](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L39) → El XP mínimo que puedes ganar en el sistema de leveling de RPG.  
> - Valores: número  
> - Predeterminado: 15  
------  
> - [Minimal_Similarity_Command](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L40) → El porcentaje de similitud para la corrección de comandos escritos incorrectamente.  
> - Valores: número  
> - Predeterminado: 70  
------  
> - [Moment_Locale](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L41) → Establece la 'ubicación' del momento para obtener la hora correcta.  
> - Valores: [string](https://github.com/moment/moment/tree/develop/locale)  
> - Predeterminado: "pt_BR"  
------  
> - [Moment_Timezone](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L42) → Configura la zona horaria del momento para obtener lo UTC correcto.  
> - Valores: [string](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)  
> - Predeterminado: "America/Sao_Paulo"  
------  
> - [Multitasking](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L43) → Al habilitar esto, Iris puede ejecutar uno o más comandos diferentes con un solo mensaje.  
> - Valores: true, false  
> - Predeterminado: false  
------  
> - [Niver_Present](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L44) → El regalo de cumpleaños para el usuario, en formato I'coins.  
> - Valores: número  
> - Predeterminado: 1000  
------  
> - [Owner](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L45-L49) → La lista de propietarios del Iris instalado, los números de Owner pueden controlar todas las acciones de Íris.  
> - Valores: array de números con string  
> - Predeterminado: ["Inserte su número@c.us", "Número 2 - Opcional@c.us", "No quite el @c.us - 3° owner@c.us"]  
> Example: ["5511987654321@c.us"]  
------  
> - [Hide_Owner_Number](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L50) → Oculta el número de propietario en casi todos los comandos, por seguridad.  
> - Valores: true, false  
> - Predeterminado: false  
------  
> - [Popup](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L51) → Habilita las notificaciones de Iris en la pantalla de su PC.  
> - Valores: true, false  
> - Predeterminado: false  
------  
> - [Prefix](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L52-L69) → Los prefijos de Íris, los mensajes que comiencen con eso se detectarán como comandos.  
> - Valores: array of everything  
> - Predeterminado: ["/", "$", "#", ".", "\\", "@", "=", "?", "+", "!", "&", ":", ";", "^", ">", "<"]  
------  
> - [Max_Divider_Win](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L70) → El valor de reducción de los juegos, no use valores menores a 1.  
> - Valores: número  
> - Predeterminado: 3  
------  
> - [Prize_Value_Max](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L71) → El premio máximo de algunos juegos, como el mix.  
> - Valores: número  
> - Predeterminado: 200  
------  
> - [Prize_Value_Min](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L72) → El premio mínimo de algunos juegos, como el mix.  
> - Valores: número  
> - Predeterminado: 20  
------  
> - [Puppeteer_Wait](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L73) → Tiempo máximo de espera del puppeteer, cuando llegue a 0, Íris forzará el fin de comandos como CPF.  
> - Valores: número (tiempo en milisegundos)  
> - Predeterminado: 220000  
------  
> - [Search_Results](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L75) → Resultados máximos para obtener el comando 'duck'.  
> - Valores: número  
> - Default: 10  
------  
> - [StartUP_MSGs_Groups](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L76) → Si activa esto, Íris notificará a los grupos cuando estas online.  
> - Valores: true, false  
> - Predeterminado: false  
------  
> - [Sticker_Author](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L77) → Autor predeterminado de lo sticker, si desea configurar el autor como el remitente del mensaje, no lo edite.  
> - Valores: string  
> - Predeterminado: "DONTEDITUSR - DONTEDITGPN"  
------  
> - [Sticker_Pack](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L78) → Nombre predeterminado de los paquetes de stickers creados por Iris.  
> - Valores: string  
> - Predeterminado: "🔰 Legião Z [bit.ly/BOT-IRIS] Íris ⚜️"  
------  
> - [User_Agent](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L79) → User-Agent predeterminado para usar axios y otros módulos. Es útil para evitar bloqueos de U.A.  
> - Valores: [string](https://www.whatismybrowser.com/guides/the-latest-user-agent/chrome)  
> - Predeterminado: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36"  
------  
> - [Update_CMDS_On_Boot](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L80) → Actualiza la lista de comandos al inicio, útil para quienes siempre crean nuevos comandos.  
> - Valores: true, false  
> - Predeterminado: false  
------  
> - [Wait_to_Play](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L81) → Tiempo de espera para volver a jugar un juego después de jugarlo.  
> - Valores: número (tiempo en minutos)  
> - Predeterminado: 30  
------  
> - [Wait_to_Win](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L82) → El tiempo de obtención de XP del usuario en el leveling.  
> - Valores: número (tiempo en minutos)  
> - Predeterminado: 60  
------  
> - [XP_Difficulty](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L83) → La dificultad del sistema de leveling, los valores más altos significan una mayor dificultad para subir de nivel.  
> - Valores: número  
> - Predeterminado: 5  
------  
> - [Your_Name](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L84) → El nombre/apodo del propietario, eso se usará cuando la etiqueta no se puede crear con los valores predeterminados, solo use letras normales.  
> - Valores: string  
> - Predeterminado: "KillovSky"  
------  
> - [Owner_SECRET_Password](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L85) → Contraseña secreta del propietario, si no establece un propietario, simplemente ingrese esa contraseña en el mensaje para usar los comandos del propietario, NO UTILICE LA CONTRASENÃ PREDETERMINADA!  
> - Valores: string  
> - Predeterminado: "irisBOT@Root"  
------  
  
</details>  