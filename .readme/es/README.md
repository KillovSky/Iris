### Proyecto Íris  
Íris es un BOT en Inglés, Español y Portugués para WhatsApp.  
Tiene una gran cantidad de comandos diferentes y recibe actualizaciones 'frecuentes' con muchas funciones nuevas, correcciones y mejoras.  
  
### Otro idioma  
If you want a tutorial in English [Click Here](https://github.com/KillovSky/iris/blob/main/.readme/en/README.md).  
Para um tutorial em Português [Clique Aqui](https://github.com/KillovSky/iris/blob/main/README.md).  
  
### 'Página' de Íris  
Creé una página 'diferente' para alojar información de Iris, puedes acceder a la versión de Github [Desde Aquí](http://htmlpreview.github.io/?https://github.com/KillovSky/iris/blob/main/.readme/donates/page.html), solo se actualizará cuando publique una nueva actualización de Íris.  
También puede acceder a la página local ('igual' que Github), descargando Iris y abriendo la carpeta ".readme", luego "donates" y abriendo el archivo "page.html", esto es mucho mejor para mostrar.  
Si desea obtener la página actualizada, consulte la [Versión JS Fiddle](https://jsfiddle.net/KillovSky/mgp6ed3x/show).  
  
### Nota personal  
Este software utiliza la [MIT](https://choosealicense.com/licenses/mit/) licencia.  
Está prohibida la eliminación de créditos, dedico MUCHO tiempo a mejorar esto para todos los usuarios.  
Por favor, no quite los créditos de mi BOT.  
Si ves a alguien robando o que ha robado, muéstrale la verdad, dile que es plagio.  
  
### Errores, Bugs, Soluciones, Mejoras y Sugerencias  
Si obtiene un error, falla, tiene soluciones, mejoras o sugerencias, publíquelas [Aquí](https://github.com/KillovSky/iris/issues/q=), estaré apoyando en esta página, pero recuerda, esto es solo para Project Íris, no apoyo otros programas.  
No cree ninguna pull-request, serás rechazado, pero su idea será analizada y se insertará manualmente en futuras actualizaciones, con créditos para usted.  
Si es posible, crea un archivo TXT con el código y publícalo en los problemas.  
  
### Funciones  
Iris tiene muchos comandos, no puedo describirlos todos en esta página en este momento, pero puede consultar [Este archivo](https://raw.githubusercontent.com/KillovSky/iris/lib/config/Utilidades/Comandos_Automate.txt) con los nombres de los comandos para tener una idea.  
  
### Requisitos de Windows [Descargas]  
- [NodeJS](https://nodejs.org) - La programación de Iris, utilice LTS.  
  
- [Chrome](https://www.google.com/chrome/) - Para enviar videos, fotos y otros archivos - Opcional, pero muy recomendable.  
  
- [Gow](https://github.com/bmatzelle/gow/releases) - Para comandos de Linux y GNU/BASH.  
  
- [Git](https://git-scm.com) - Para obtener otras herramientas de GNU/BASH y el Shell Console.  
  
- [Tesseract OCR](https://tesseract-ocr.github.io/tessdoc/Downloads) - Para leer imágenes.  
  
Si tiene algún problema con los comandos de Íris Shell en Windows, use `Git Bash`, funcionará, si desea usar CMD, PowerShell u otra consola, debe ingresar el `bash.exe` en su PATH de Windows, puedes [Seguir Esto](https://github.com/KillovSky/iris/issues/456#issuecomment-1001087525) para insertar, **pero tenga mucho cuidado.**  
  
### Requisitos de Linux [Instalar del terminal]  
  
Para instalar todos los requisitos por el terminal estándar, ábrelo y usa estos comandos (puedes copiar todo y pegar):  
  
```bash  
# Actualizar el repositorio y los programas de Linux  
sudo apt update && sudo apt upgrade -y  
  
# Instale cURL y WGET para obtener Chrome y Node Source  
sudo apt install curl wget -y  
  
# Descarga la última versión stable de Chrome (solo 64x)  
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb  
  
# Instale el repositorio Node.js LTS en APT Sources  
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo bash  
  
# Instala todos los programas necesarios  
sudo apt install nodejs python python3 python3-pip git build-essential tesseract-ocr ./google-chrome-stable_current_amd64.deb -y  
```  
  
Si obtiene `sudo: command not found`, elimine `sudo` del comando e intente.  
  
Si obtiene `apt: command not found`, intenta usar `apt-get`.  
  
Si `apt-get` también no funciona, tienes que compilar `apt` en su sistema, simplemente [Vea esto - 'Usuarios Avanzados'](https://askubuntu.com/questions/860375/installing-apt-get), o cambia tu distro, yo utilice y recomiendo `Anti-X` o `Xubuntu Minimal`, son las mejores distribuciones para **Low-end PC** en mi opinión, pero `Windows 8.1` o superior también es bueno, recientemente solo utilizo `Windows 8.1`.  
  
### Instalación  
Para descargar Iris - [Después de instalar los requisitos] - vea los [Tutoriales Aquí](https://github.com/KillovSky/iris/discussions/28) o [Aquí](http://htmlpreview.github.io/?https://github.com/KillovSky/iris/blob/main/.readme/donates/page.html), también puede utilizar los siguientes comandos:  
  
```bash  
# Descarga los archivos  
git clone https://github.com/KillovSky/iris.git  
  
# Entrar en la carpeta Íris  
cd iris  
  
# Instala módulos  
npm i  
  
# Si desea utilizar la 'tools.sh' para actualizar Íris, ejecute:  
pip install unidecode  
```  
  
### Cambios Obligatorios  
Antes de comenzar, debe editar toda la información no opcional descrita [aquí](https://github.com/KillovSky/iris/blob/main/.readme/en/config.md), de lo contrario, no podrá utilizar algunos comandos.  
  
### Ejecutarse  
Hay tres formas de abrir Iris, puedes mirar y elegir a mejor, recuerda de tener el terminal abierto en la carpeta:  
  
```bash  
# Método 1 - The A.I.O Toolbox - El mejor (In portugués)  
# Esto incluye varios métodos para comenzar, incluye el Método 1 y 2 también  
bash tools.sh  
# Or use:  
./tools.sh  
  
# Método 2 - El estándar - Simple pero bueno  
npm start  
# Or use:  
node start.js  
  
# Método 3 - El método PM2 - Reinicia en cada "error" atascado - Pesa  
# Esto requiere PM2, puede instalarlo desde el Método 1 o escriba: 'npm i -g pm2'  
pm2 start start.js --name iris  
  
# Para reiniciar PM2 cada 6 horas para mejorar el rendimiento, use el Método 1 o escriba:  
pm2 start start.js --name iris --cron-restart="0 */6 * * *"  
```  
  
### Revisa todos los comandos  
Tenga en cuenta que los menús aún están desactualizados, puedes consultar [Este Archivo](https://raw.githubusercontent.com/KillovSky/iris/lib/config/Utilidades/Comandos_Automate.txt) para los comandos actualizados.  
  
Si desea ver el menú obsoleto, pero hermoso, envíe `/menu` a Íris.  
  
Para obtener el menú más "actualizado", envíe `/menut` a Íris.  
  
### Hacer nuevos comandos  
Para crear comandos **con prefijo**, usa [Esta Base](https://github.com/KillovSky/iris/blob/main/lib/functions/config.js#L6289), simplemente elimine "/\*" y "\*/" y edite el código, puede consultar el [Tutorial PT-BR](https://github.com/KillovSky/iris/blob/main/Tutorial%20de%20Edi%C3%A7%C3%A3o%20PT-BR.txt) para obtener mejores instrucciones sobre cómo crear `cases`.  
  
Para crear comandos **sin prefijo**, utiliza [Esta Base](https://github.com/KillovSky/iris/blob/main/lib/functions/config.js#L683), puede utilizar quitando "/\*" y "\*/" y editando el código, pero si recomienda crear un `case`.  
  
Consulte la página de [WA-Automate](https://docs.openwa.dev/classes/api_Client.Client.html) para todas las funciones que Íris puede usar.  
  
### Deshabilitar el auto abrir navegador en Bomber-API  
Puede hacer esto de dos maneras:  
  
1. Abra el `Git Bash` en la carpeta Íris y escriba `bash tools.sh`, selecciona el `Desativar navegador Bomber-API`, espera el `done` y pronto - Recomendado.  
  
2. Abra la carpeta ```node_modules```, va a ```bomber-api```, abre el archivo ```index.js``` y elimina las lineas ```"open(`http://localhost:3000/`)"``` & ```"open(`http://localhost:${arguments.port}/`)"```.  
  
Tienes que editar esto cada vez que ejecutes `npm update`, `npm i` or `npm install`.  
  
### Error en el puerto 3000  
Puedes hacerlo de dos formas:  
  
1. Edita el número `3000` en la línea ```"app.listen(3000"```, situada en `node_modules/Bomber-API/index.js` - mismo lugar para deshabilitar el inicio automático del navegador - pero recuerda de editar `Bomber_Port` en `config.json`.  
  
2. Abra el `Git Bash` en la carpeta Íris y escriba `bash tools.sh`, selecciona el `Mudar porta do Bomber-API`, escriba el número, espera el `done` y pronto - Recomendado.  
  
### Actualizar Íris, Módulos o Más  
Puedes hacer **TODO** usando el Método 1, pero si quieres hacerlo manualmente, esta es la manera, recuerda abrir la terminal en la carpeta Íris.  
  
```bash  
# Uso de 'Tools.sh' - La mejor - Todo en uno  
bash tools.sh  
  
# Actualizar Módulos  
npm update  
  
# Debes actualizar a Íris solo cuando diga "[UPDATE]" al arrancar.  
# Actualizar Íris y 'Guardar Configuración' solo está disponible en 'Tools.sh'.  
# Si desea actualizar sin guardar, hace la instalación nuevamente..  
```  
  
### Gracias, Donates y Ayuda  
- [Donates] - Este proyecto siempre será gratuito, si puedes, dona algo ❤️  
- Puedes consultar toda la información al [Tocar Aquí](http://htmlpreview.github.io/?https://github.com/KillovSky/iris/blob/main/.readme/donates/page.html).  
- Gracias de corazón para todos!  