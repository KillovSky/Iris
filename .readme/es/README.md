### Proyecto Íris
Íris es un bot en inglés, español y portugués creado y actualizado por Lucas R. - KillovSky para el grupo "Legião Z", tiene +300 comandos y actualizaciones frecuentes con correcciones y novedades.

### Otros idiomas
if you want a English tutorial, open this [English Tutorial](https://github.com/KillovSky/iris/blob/main/.readme/en/README.md), para um português use o [Tutorial PT-BR](https://github.com/KillovSky/iris/blob/main/README.md).

### Nota personal 
Este software funciona bajo la licencia [MIT](https://eligelicencia.github.io/eligeUnaLicencia/licenses/mit/), teniendo prohibido retirar créditos, y recuerda, paso MUCHO tiempo ayudando a todos los que tienen dudas y mejorando el BOT, pero sin ganar nada en esto, por favor no quites los créditos.
Si ves a alguien robando o que ha robado, muéstrales la verdad, diles que es plagio, es el único deseo que tengo.

### Errores
Si observa errores, lea el [Discussions](https://github.com/KillovSky/iris/discussions), si no resuelve, háblame por los medios que se encuentran en la parte inferior de la página o infórmalo en [Issues](https://github.com/KillovSky/iris/issues), y por supuesto, asegúrese de haber instalado Chrome y leer TODO lo escrito abajo.
Descarga Chrome en Windows por [aqui](https://www.google.com/chrome), en linux use los siguientes comandos. 

```bash
> wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
> sudo apt install ./google-chrome-stable_current_amd64.deb
```

### Funciones (+300)
| Función | Contiene|
| ------------- | ------------- |
| Ejecute Wa-Automate/Functions dentro de WhatsApp |✅|
| Administrar Grupos |✅|
| Tic-Tac-Toe/Casino/Otros juegos |✅|
| Anti Porno - Imagen +18/Enlaces de Chat |✅|
| Ataques SMS/CALL/EMAIL |✅|
| Bienvenido/Adiós/Anti-Fake/Blacklist |✅|
| Bloquear/Desbloquear/Rastrear personas |✅|
| Buscar Anime/Letra de Música/Twitter/Instagram |✅|
| Mandar mensagens a otros grupos |✅|
| Conversa por texto/voz Sim-Simi/Local (ilimitado) |✅|
| Eliminar mensajes del BOT |✅|
| Descargas (Redes-Sociales y YouTube) |✅|
| Hablar 51 idiomas/Tradutor |✅|
| Generación de Textos/Diário |✅|
| Google/Google Play/Pinterest |✅|
| Información de Grupo/Perfil |✅|
| Marcar todo/Prohibir todo |✅|
| Memes/Hacer Memes |✅|
| Nasa, Brainly, Wikipédia |✅|
| Pausar/Salir de Tudo/Transmitir/Eliminar Tudo |✅|
| Pesquisa Fotos/Datos/Covid |✅|
| Printar Pantalla/Sitios WEB |✅||
| Sticker GIF/Sin-Fondo/URLS/Palabras |✅|
| Uploads de Fotos |✅|
| Use CMD/Terminal en WhatsApp |✅|
| XP/Ranking/Level/Votaciónes |✅|
| Outros |✅|

### Requisitos
- Dos números en WhatsApp, uno para propietario y otro para BOT.
- [NodeJS](https://nodejs.org) - Recomiendo la LTS.
- [Git](https://git-scm.com) - Para las Unix-Tools - Cuidado.
- [FFmpeg](https://ffmpeg.org) - Para conversiones.
- [Libwebp](https://developers.google.com/speed/webp/download) - Ayuda en FFmpeg y otras cosas.
- Para um tutorial de instalação do FFmpeg no Windows 7/8, veja [WikiHow](https://pt.wikihow.com/Instalar-o-FFmpeg-no-Windows), en el caso de Windows 10 vea al [SoundArtifacts](https://soundartifacts.com/pt/how-to/186-how-to-install-ffmpeg-on-windows-10-amp-add-ffmpeg-to-windows-path.html).
- Para instalar LibWebP sigue los mismos pasos, pero cambiando el nombre de la carpeta a LibWebP en lugar de FFmpeg.

Para la instalación de todo en Linux, puede usar el siguiente comando:

```bash
> sudo apt install nodejs git ffmpeg libwebp -y
```

Si obtiene errores con la versión del node en su repositorio de Linux, use el [Node Source](https://github.com/nodesource/distributions), recuerde, LTS (14).

### Instalación 
Necesita tener este repositorio, es simple, ejecute los comandos abajo, en caso de errores, intente como sudo/administrador o vea los [Tutoriales](https://github.com/KillovSky/iris/discussions/28).

```bash
> git clone https://github.com/KillovSky/iris.git
> cd iris
> npm i
```

### Cambios OBLIGATORIOS
Edite toda la información necesaria [Aqui](https://github.com/KillovSky/iris/blob/main/.readme/es/config.md) antes de comenzar.

### Comenzar
Después de editar los archivos necesarios, ejecute el siguiente comando y espere para comenzar, luego escane el código QR.

```bash
> npm start
```

Puedes usar al PM2 - recomendado, pero usa +RAM/CPU - en lugar de `npm start` con:

```bash
> npm i pm2 -g
> pm2 start index.js
> pm2 monit
```

El `npm i pm2 -g` solo necesita ejecutarse una vez.

### Ver todos los comandos
Escriba en su chat el mensaje, si editó su prefijo, cambie la '/' al carácter que usará.

```bash
> /menu
```

### Crea tus comandos
Hay una base simple para sus creaciones por [aqui](https://github.com/KillovSky/iris/blob/main/config.js#L4384), sin Prefix [here](https://github.com/KillovSky/iris/blob/main/config.js#L331), solo tienes que quitar el "/\*" e la "\*/" para usarlo, si necesita otros tipos, puede ver sobre ellos para [aqui](https://docs.openwa.dev/classes/api_client.client.html), si tienes dificultades vea [aqui](https://bit.ly/3owVJoB).

### Alertas en WhatsApp
Para recibir también mensajes de error de Iris a través de WhatsApp, elimine el "//" de la línea [Catch](https://github.com/KillovSky/iris/blob/main/config.js#L4403).

### Deshabilitar la auto-apertura de el navegador en bomb
Para que el navegador deje de abrirse cada vez que inicie Iris, abra la carpeta ```node_modules```, va a ```bomber-api```, abre el archivo ```index.js``` y elimina las líneas ```"open(`http://localhost:3000/`)"``` & ```"open(`http://localhost:${arguments.port}/`)"```, Si tiene problemas con la puerta 3000, puede editar el ```"app.listen(3000"``` a una puerta aleatoria que no está en uso.

### Agradecimientos:
- [Open-WA](https://github.com/open-wa)
- [ArugaZ](https://github.com/ArugaZ)
- [MhankBarBar](https://github.com/MhankBarBar)
- [SlavyanDesu](https://github.com/SlavyanDesu)
- [Contribuidores](https://github.com/KillovSky/iris/graphs/contributors)
- Les agradezco calurosamente a todos!

### Donar y Apoyo
- [Doações] - Este proyecto se mantiene sólo por mí de forma gratuita y sin cobrar nada, si es posible, dona algo ❤️
- [PicPay](https://picpay.me/userlucas123)
- [Ko-fi](https://ko-fi.com/killovsky)
- [PIX] - fc270199-2d55-4d91-be5c-bfbd431cfad4 - **Brazil**
- [Grupo Oficial](https://bit.ly/3owVJoB)