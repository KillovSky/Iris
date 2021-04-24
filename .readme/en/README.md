### Project Íris
Íris is a bot in English, Spanish and Portuguese created and maintained up-to-date by KillovSky to WhatsApp Group "Legião Z", she have more that 200 commands and frequent update of fixes and new things.

### Another Language
Si quieres un tutorial en español, abre lo [Tutorial Español](https://github.com/KillovSky/iris/blob/main/.readme/es/README.md), para um português use o [Tutorial PT-BR](https://github.com/KillovSky/iris/blob/main/README.md).
To make your bot completely in another language, open [language](https://github.com/KillovSky/iris/blob/main/lib/config/config.json#2) and change from "pt" for "en" which is English or "es" for Spanish, there are no languages other than these - not yet.

### Only Phone
On cellphone it's impossible you can use, incluse on Termux, but you can use the site [Goorm](https://ide.goorm.io) or the app [Google Cloud-Shell](https://cloud.google.com/shell) to make a Íris, but will disconnect frequent, is much better a use from a computer.

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

### Functions (+200)

| Functions | Have |
| ------------- | ------------- |
| Run Wa-Automate/Functions inside WhatsApp |✅|
| Manage Groups |✅|
| Betting/Casino/Other Games |✅|
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
- [FFmpeg](https://ffmpeg.org) - For gif command.
- [Libwebp](https://developers.google.com/speed/webp/download) - Help the FFmpeg and other things.
- If needs help to install FFmpeg, view the [WikiHow](https://www.wikihow.com/Install-FFmpeg-on-Windows), to install Libwebp follow the same steps, but changing the folder name to libwebp, doing the same in the "setx" command.

To install all programs above at Linux, use that command:

```bash
> sudo apt install nodejs git ffmpeg libwebp -y
```

If have some errors at Node, try using the [Node Source](https://github.com/nodesource/distributions), remember, LTS version.

### Installation
To download Íris use the following commands, if have some error try with administrator or sudo.

```bash
> git clone https://github.com/KillovSky/iris.git
> cd iris
> npm i
```

### Mandatory Changes
Edit all the info bellow:

- [Language](https://github.com/KillovSky/iris/blob/main/lib/config/Bot/config.json#2)
- [Owner](https://github.com/KillovSky/iris/blob/main/lib/config/Bot/config.json#3)
- [DDI](https://github.com/KillovSky/iris/blob/main/lib/config/Bot/config.json#4)
- [Prefix](https://github.com/KillovSky/iris/blob/main/lib/config/Bot/config.json#5)
- [API 1 - API-Flash](https://github.com/KillovSky/iris/blob/main/lib/config/Bot/config.json#6)
- [API 2 - RemoveBG](https://github.com/KillovSky/iris/blob/main/lib/config/Bot/config.json#7)
- [API 3 - WallHaven](https://github.com/KillovSky/iris/blob/main/lib/config/Bot/config.json#8)
- [API 4 - Deep-AI](https://github.com/KillovSky/iris/blob/main/lib/config/Bot/config.json#9)
- [Group Limit](https://github.com/KillovSky/iris/blob/main/lib/config/Bot/config.json#10)
- [Member Requiriment](https://github.com/KillovSky/iris/blob/main/lib/config/Bot/config.json#11)
- [Sticker-Author](https://github.com/KillovSky/iris/blob/main/lib/config/Bot/config.json#12)
- [Sticker-Pack](https://github.com/KillovSky/iris/blob/main/lib/config/Bot/config.json#13)
- They refer to the sites [RemoveBG](https://www.remove.bg/pt-br), [API-Flash](https://apiflash.com), [WallHaven](https://wallhaven.cc/settings/account) & [Deep-AI](https://deepai.org).
- The DDI and Language is only necessary if you are outside Brazil, the available languages are "en" in english, "pt" in portuguese and "es" in spanish and affect all dialogues and akinator.

### Run
After installing and changing all the necessary info, just run the code bellow, wait start, and scan QR.

```bash
> npm start
```

### All Commands
Send this to your chat, if you changed the prefix settion, change the "/" bellow to your prefix prefference.

```bash
> /menu
```

### Make new commands
I have putted a code to new commands [here](https://github.com/KillovSky/iris/blob/main/config.js#L3843), with no Prefix [here](https://github.com/KillovSky/iris/blob/main/config.js#L336), remove the "/\*" and "\*/" to use the code, if you need more types, you can view all [here](https://docs.openwa.dev/classes/api_client.client.html), if you have some difficuty talk me on [KillovSky Number](https://wa.me/+5518998044132).

### Computer-Freaker/Axios
To fix Computer-Freaker API(Logos, Baguette, Yuri, Hug...) and some axios website compatibility, open this [Mini-Tutorial](https://github.com/KillovSky/iris/discussions/10).

### Report errors on Messages
To receive your errors from commandline at whatsapp, remove the "//" on line [Catch](https://github.com/KillovSky/iris/blob/main/config.js#L3855).

### Thanks:
- [Open-WA](https://github.com/open-wa)
- [ArugaZ](https://github.com/ArugaZ)
- [MhankBarBar](https://github.com/MhankBarBar)
- [SlavyanDesu](https://github.com/SlavyanDesu)
- [Contributors](https://github.com/KillovSky/iris/graphs/contributors)
- Thanks from my hearth!

### Donate and Support
- [Donation] - This project is maintained for free and without earning anything, contribute if you can ❤️ - [Donate](https://picpay.me/userlucas123)
- [PIX] - fc270199-2d55-4d91-be5c-bfbd431cfad4
- [Official Group] - [Enter](https://chat.whatsapp.com/H53MdwhtnRf7TGX1VJ2Jje)
- [Creator] - Talk me from here (i answer as quickly as possible) - [Speak](https://wa.me/+5518998044132)