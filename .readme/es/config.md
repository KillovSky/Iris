### Cambios

Edite toda la información abajo:

- [Idioma](https://github.com/KillovSky/iris/blob/main/lib/config/Gerais/config.json#2)
- [Dueño](https://github.com/KillovSky/iris/blob/main/lib/config/Gerais/config.json#3)
- [DDI](https://github.com/KillovSky/iris/blob/main/lib/config/Gerais/config.json#4)
- [API 1 - API-Flash](https://github.com/KillovSky/iris/blob/main/lib/config/Gerais/config.json#6)
- [API 2 - RemoveBG](https://github.com/KillovSky/iris/blob/main/lib/config/Gerais/config.json#7)
- [API 3 - WallHaven](https://github.com/KillovSky/iris/blob/main/lib/config/Gerais/config.json#8)
- [API 4 - Deep-AI](https://github.com/KillovSky/iris/blob/main/lib/config/Gerais/config.json#9)
- [API 5 - The-Movie-Database](https://github.com/KillovSky/iris/blob/main/lib/config/Gerais/config.json#19)
- [API 6 - ACR-Cloud](https://github.com/KillovSky/iris/blob/main/lib/config/Gerais/config.json#L25-L27)
- [API 7 - NASA](https://github.com/KillovSky/iris/blob/main/lib/config/Gerais/config.json#20) - Opcional
- [Prefix](https://github.com/KillovSky/iris/blob/main/lib/config/Gerais/config.json#5) - Opcional
- [Límite de grupo](https://github.com/KillovSky/iris/blob/main/lib/config/Gerais/config.json#10) - Opcional
- [Requisito de Miembro](https://github.com/KillovSky/iris/blob/main/lib/config/Gerais/config.json#11) - Opcional
- [Sticker-Autor](https://github.com/KillovSky/iris/blob/main/lib/config/Gerais/config.json#12) - Opcional
- [Sticker-Pack](https://github.com/KillovSky/iris/blob/main/lib/config/Gerais/config.json#13) - Opcional
- [User-Agent](https://github.com/KillovSky/iris/blob/main/lib/config/Gerais/config.json#14) - Opcional
- [Wait-to-Play](https://github.com/KillovSky/iris/blob/main/lib/config/Gerais/config.json#15) - Opcional
- [Anti-Flood](https://github.com/KillovSky/iris/blob/main/lib/config/Gerais/config.json#16) - Opcional
- [Max-Download-Size](https://github.com/KillovSky/iris/blob/main/lib/config/Gerais/config.json#17) - Opcional
- [Wait-to-Win](https://github.com/KillovSky/iris/blob/main/lib/config/Gerais/config.json#18) - Opcional
- [Max-XP-Earn](https://github.com/KillovSky/iris/blob/main/lib/config/Gerais/config.json#21) - Opcional
- [Min-XP-Earn](https://github.com/KillovSky/iris/blob/main/lib/config/Gerais/config.json#22) - Opcional
- [Iris-Coin](https://github.com/KillovSky/iris/blob/main/lib/config/Gerais/config.json#23) - Opcional
- [Max-Steal](https://github.com/KillovSky/iris/blob/main/lib/config/Gerais/config.json#24) - Opcional
- [Max_Characters](https://github.com/KillovSky/iris/blob/main/lib/config/Gerais/config.json#25) - Opcional
- [XP_Difficulty](https://github.com/KillovSky/iris/blob/main/lib/config/Gerais/config.json#26) - Opcional


### Cómo obtener una API-KEY

Puede obtener una API-KEY creando una cuenta en los sitios solicitados, en Íris es:

- [RemoveBG](https://www.remove.bg/pt-br)
- [API-Flash](https://apiflash.com)
- [WallHaven](https://wallhaven.cc/settings/account)
- [NASA](https://api.nasa.gov)
- [Deep-AI](https://deepai.org)
- [The Movie Database](https://developers.themoviedb.org/3)
- [ACR-Cloud](https://console.acrcloud.com/avr?#/projects/online)

### Qué hace la configuración?

La configuración es fundamental porque afectan a los comandos, si no configura, pierde el acceso a los comandos que necesitan la API-KEY.

- ```DDI``` & ```Language``` sólo es necesario si se encuentra fuera de Brasil, los idiomas disponibles son "en" en inglés, "pt" en portugués y "es" en español y afectan a todos los diálogos y Akinator, el DDI es para kick de números de fuera del país.

- Puede ingresar dos o más números de ```owner```, si no quieres esto, deja el segundo en blanco, el formato necesario es el número sin +, y conserva el `@c.us`, por ejemplo ```551234509876@c.us```, esto es necesario para usar los comandos del propietario y algunos comandos de información.

- ```API-Flash``` es para ScreenShot de sitios.

- ```RemoveBG``` es para crear stickers sin fondo.

- ```WallHaven``` es para obtener fondos de pantalla.

- ```Deep-AI``` es para el ```Anti-Porn``` funcion.

- ```The Movie Database``` es para buscar información de películas.

- ```Acr_Host``` & ```Acr_Access``` & ```Acr_Secret``` reconoce la música y envía su nombre.

- ```NASA``` es para conseguir una imagen muy bonita del espacio con un reportaje de ella.

- ```Prefix``` es el símbolo de comando, el valor predeterminado es `/`, edición es opcional.

- ```Group Limit``` es el máximo de grupos que Íris puede quedarse, omita esto y ella se irá, edición es opcional.

- ```Member Requirement``` es la cantidad de miembros necesarios para que Íris se quede, si no tienes esto, ella se irá, edición es opcional.

- ```Sticker-Autor``` insertar un autor en sticker creado, edición es opcional.

- ```Sticker-Pack``` insertar un pack en sticker creado, edición es opcional.

- ```User-Agent``` es la identificación de navegador, afecta los comandos que acceden a internet (incluye Íris), edición es opcional.

- ```Wait-to-Play``` es la función que hace que los usuarios esperen para volver a jugar y evitar flood, lo flood puede causar **BAN DE WHATSAPP**, edición es opcional, valor en minutos.

- ```Anti-Flood``` es el tiempo de espera para cada comando, para evitar flood o demasiados comandos al mismo tiempo, lo flood puede causar **BAN DE WHATSAPP**, edición es opcional, valor en segundos.

- ```Max-Download-Size``` controla el tamaño máximo de los comandos de descarga, como el `Video Downloader`, edición es opcional.

- ```Wait-to-Win``` es el tiempo de ganar XP, por ejemplo, el valor predeterminado es `60`, cada mensaje solo valdrá XP después de` 60` segundos, edición opcional, valor en segundos.

- ```Max-XP-Earn``` es el máximo de XP que puede recibir, edición opcional.

- ```Min-XP-Earn``` es la XP más baja que puede recibir, edición opcional.

- ```Iris-Coin``` es la cantidad recibida del `Íris Coin` por nivel, el `Íris-Coin` sigue siendo una sorpresa para todos, en el futuro estará disponible (solo en WhatsApp), edición es opcional.

- ```Max-Steal``` es la XP máxima con la que puedes robar con `steal`, edición es opcional.

- ```Max-Characters``` es el tamaño máximo del mensaje, los mensajes más grandes que este límite harán que Íris expulse al usuario que envía, edición es opcional.

- ```XP-Difficulty``` controla la dificultad de conseguir un nuevo nivel, los valores más altos significan más dificultad para subir de nivel, edición es opcional.

### Como configurar?

Para configurar, abra la ```Carpeta Íris``` que descargó con ```git clone```, **NO HACER EN LÍNEA ATRAVÉS DE GITHUB**, eso no sería una edición sino una pull request, de todos modos, después de acceder a la ```Carpeta Íris```, vaya a ```Lib/Config```, vaya a ```Gerais```, abra ```config.json``` con cualquier editor de texto, recomiendo usar al [NotePad++](https://notepad-plus-plus.org/downloads/), y haz la magia.

### Qué pasará si no edito?

No puedes usar comandos como `Anti-Porn`, `Music-Recognition`, `NASA` y una lista de otras.