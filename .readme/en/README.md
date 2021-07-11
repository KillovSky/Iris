### Project Íris
Íris is a bot in English, Spanish and Portuguese created and maintained up-to-date by KillovSky to WhatsApp Group "Legião Z", she have more that 300 commands and frequent update of fixes and new things.

### Another Language
Si quieres un tutorial en español, abre lo [Tutorial Español](https://github.com/KillovSky/iris/blob/main/.readme/es/README.md), para um português use o [Tutorial PT-BR](https://github.com/KillovSky/iris/blob/main/README.md).

### Personal Note
This software uses the [MIT](https://choosealicense.com/licenses/mit/) license, it's proibited the removal of credits, and i'm expending a LOT of time without gain nothing to make this better, please, do not remove the credits of my bot.
If you see someone stealing or who has stolen, show the truth, tell them it is plagiarism, is the only desire i have.

### Errors & Bugs
If you view a error, view [Discussions](https://github.com/KillovSky/iris/discussions), if doesn't help you, report at [Issues](https://github.com/KillovSky/iris/issues) or talk me on end of page and make sure you have installed chrome and read EVERYTHING i writted below. 
To download chrome on Windows go [here](https://www.google.com/chrome), on linux use the bellow commands.

```bash
> wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
> sudo apt install ./google-chrome-stable_current_amd64.deb
```

### Functions (+300)
| Functions | Have |
| ------------- | ------------- |
| Run Wa-Automate/Functions inside WhatsApp |✅|
| Manage Groups |✅|
| Cassino/TicTacToe/Other Games |✅|
| Anti Porn & Image +18/Chat Link |✅|
| Attacks SMS/CALL/EMAIL |✅|
| Welcome/Goodbye/Anti-Fake/Blacklist |✅|
| Block/Unblock/Track people |✅|
| Search Anime/Music Letter/Instagram |✅|
| Send Messages to another places |✅|
| Speak Audio/Msg - SimSimi/Local |✅|
| Delete Messages |✅|
| Downloads (YouTube, More) |✅|
| Speak 51 languages/Translate |✅|
| Text Gerator/Diary |✅|
| Google/Google Play/Pinterest |✅|
| Group Info/Perfil |✅|
| Mark Everyone/Remove All |✅|
| Memes/Make Memes |✅|
| Nasa, Brainly, Wikipédia |✅|
| Pause/Leave All/Transmissions/Delete All |✅|
| Search Photos/Data/Covid |✅|
| Window screenshot/Site |✅||
| GIF Sticker/No-BG/Link/Words |✅|
| Make Uploads |✅|
| Use Command-Line from WhatsApp |✅|
| XP/Rank/Level/Poll |✅|
| Much more |✅|

### Requiriments
- Two numbers at WhatsApp, one for owner and other for BOT.
- [NodeJS](https://nodejs.org) - LTS recommended.
- [Git](https://git-scm.com) - For the Unix-Tools - Careful.
- [FFmpeg](https://ffmpeg.org) - For conversions.
- [Libwebp](https://developers.google.com/speed/webp/download) - Help the FFmpeg and other things.
- If needs help to install FFmpeg, view the [WikiHow](https://www.wikihow.com/Install-FFmpeg-on-Windows) for Windows 7/8, to Windows 10 see [SoundArtifacts](https://soundartifacts.com/pt/how-to/186-how-to-install-ffmpeg-on-windows-10-amp-add-ffmpeg-to-windows-path.html).
- To install LibWebP follow the same steps, but changing the folder name to LibWebP instead of FFmpeg.

To install all programs above at Linux, use that command:

```bash
> sudo apt install nodejs git ffmpeg -y
```

If have some errors at Node, try using the [Node Source](https://github.com/nodesource/distributions), remember, LTS version.

### Installation
To download Íris use the following commands, if have some error try with administrator or sudo, or view the [Tutorials](https://github.com/KillovSky/iris/discussions/28).

```bash
> git clone https://github.com/KillovSky/iris.git
> cd iris
> npm i
```

### Mandatory Changes
Edit all the info needed [Here](https://github.com/KillovSky/iris/blob/main/.readme/en/config.md) before start.

### Run
After installing and changing all the necessary info, just run the code bellow, wait start, and scan QR.

```bash
> npm start
```

You can use the PM2 start - recommended but use more RAM/CPU - instead of `npm start` with:

```bash
> npm i pm2 -g
> pm2 start index.js
> pm2 monit
```

The `npm i pm2 -g` only needs to be run once.

### All Commands
Send this to your chat, if you changed the prefix settion, change the "/" bellow to your prefix prefference.

```bash
> /menu
```

### Make new commands
I have putted a code to new commands [here](https://github.com/KillovSky/iris/blob/main/config.js#L4384), with no Prefix [here](https://github.com/KillovSky/iris/blob/main/config.js#L331), remove the "/\*" and "\*/" to use the code, if you need more types, you can view all [here](https://docs.openwa.dev/classes/api_client.client.html), if you have some difficuty, get help [Here](https://bit.ly/3owVJoB).

### Report errors on Messages
To receive your errors from commandline at whatsapp, remove the "//" on line [Catch](https://github.com/KillovSky/iris/blob/main/config.js#L4403).

### Disable auto-opening browser on bomb
To make the browser stop opening every time you start Iris, open the folder ```node_modules``` and go to ```bomber-api```, open the file ```index.js``` and remove the lines ```"open(`http://localhost:3000/`)"``` & ```"open(`http://localhost:${arguments.port}/`)"```, if you got problems with port 3000, you can edit the ```"app.listen(3000"``` to a random port that is not in use.

### Thanks:
- [Open-WA](https://github.com/open-wa)
- [ArugaZ](https://github.com/ArugaZ)
- [MhankBarBar](https://github.com/MhankBarBar)
- [SlavyanDesu](https://github.com/SlavyanDesu)
- [Contributors](https://github.com/KillovSky/iris/graphs/contributors)
- Thanks from my hearth!

### Donate and Support
- [Donation] - This project is maintained for free and without earning anything, contribute if you can ❤️
- [PicPay](https://picpay.me/userlucas123)
- [Ko-fi](https://ko-fi.com/killovsky)
- [PIX] - fc270199-2d55-4d91-be5c-bfbd431cfad4 - **Brazil**
- [Official Group] - [Enter](https://bit.ly/3owVJoB)