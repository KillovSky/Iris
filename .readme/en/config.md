### What does the setup do? What will happen if I don't edit?  
  
The configuration is essential because they affect commands, if you don't configure, you won't be able to access the commands that need  API-KEYs, such as `Anti-Porn`, `Music-Recognition`, `NASA` and others.  
  
### How to configure?  
  
To configure these parameters, find the ```Iris Folder``` you downloaded with ```git clone``` - **NOT IN THE BROWSER** - and go to ```Lib/Config/Settings```, open the necessary file with any text editor - I recommend using [NotePad++](https://notepad-plus-plus.org/downloads/) if you're using Windows - and do the magic.  
  
<details>  
	<summary><h3>API SETTINGS - APIS.JSON - [CLICK HERE]</h3></summary>  
	  
------  
> You can get an API-KEY by creating an account on the requested site. And yes, all the API's are free to use and don't need credit cards, except IBM for validate your identity, but your usage is free.  
>  
> DON'T EDIT FILES USING THE BROWSER!  
>  
------  
> - [API 1 Location - API-Flash](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L27) → For screen capturing web pages.  
> - [GET API-Flash KEY](https://apiflash.com/dashboard/access_keys)  
------  
> - [API 2 Location - RemoveBG](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L43) → For creating transparent stickers (Without background).  
> - [Get RemoveBG KEY](https://www.remove.bg/pt-br/dashboard#api-key)  
------  
> - [API 3 Location - WallHaven](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L49) → For Wallpapers.  
> - [Get WallHaven KEY](https://wallhaven.cc/settings/account)  
------  
> - [API 4 Location - Deep-AI](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L15) → For Anti-Porn, Colorfy and others.  
> - [Get Deep-AI KEY](https://deepai.org/dashboard/profile)  
------  
> - [API 5 Location - The-Movie-Database](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L46) → For movie information.  
> - [Get The Movie Database KEY](https://www.themoviedb.org/settings/api)  
------  
> - [API 6 Location - ACR-Cloud](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L5-L7) → For music recognition.  
> - [Get ACR-Cloud KEY](https://console.acrcloud.com/avr#/projects/online)  
------  
> - [API 7 Location - NEWSAPI](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L24) → For NEWS.  
> - [Get NEWSAPI KEY](https://newsapi.org/account)  
------  
> - [API 8 Location - IBM-WATSON](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L10-L12) → For converting speech to text.  
> - [Get IBM-WATSON KEY](https://cloud.ibm.com/catalog/services/speech-to-text)  
------  
> - [API 9 Location - HERE](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L52-L53) → For maps information.  
> - [Get HERE KEY](https://developer.here.com/projects)  
------  
> - [API 10 Location - RAWG](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L30) → For games information.  
> - [Get RAWG KEY](https://rawg.io/@ll0/apikey)  
------  
> - [API 11 Location - BRAINSHOP](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L33-L35) → For AI conversation. - Optional  
> - [Get BRAINSHOP KEY](https://brainshop.ai)  
------  
> - [API 12 Location - GOOGLE-MAPS](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L18) → For Street-View images. - Optional  
> - [Get GOOGLE-MAPS KEY](https://developers.google.com/maps/documentation/maps-static/get-api-key#get-an-api-key)  
------  
> - [API 13 Location - NASA](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L21) → For NASA daily notices. - Optional  
> - [Get NASA KEY](https://api.nasa.gov)  
------  
> - [API 14 Location - SIMSIMI](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/APIS.json#L36-L39) → For advanced conversation. - Optional  
> - [Get SIMSIMI KEY](http://developer.simsimi.com/api)  
------  
  
</details>  
  
<details>  
	<summary><h3>USER SETTINGS - CONFIG.JSON - [CLICK HERE]</h3></summary>  
  
------  
> All settings are optional, except `Owner` and `Owner_SECRET_Password`, if you're not from Brazil, you have to change `DDI` and `Language` too.  
>  
------  
> - [Akinator_Win](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L2) → It is the score that the akinator sends the guess.  
> - Values: number  
> - Default: 90  
------  
> - [Anti_Flood](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L3) → Blocks spamming. setting it to a low value might cause WhatsApp ban.  
> - Values: number (time in seconds)  
> - Default: 10  
------  
> - [Auto_Block](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L4) → Blocks dangerous people automatically (reduces the speed of íris).  
> - Values: true, false  
> - Default: false  
------  
> - [Auto_Update](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L5) → Updates Íris automatically when you edit the programme.  
> - Values: true, false  
> - Default: false  
------  
> - [Backup_Time](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L6) → The time duration between each backup (important files of íris).  
> - Values: number (time in minutes)  
> - Default: 60  
------  
> - [Block_Calls](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L7) → Blocks calls and the caller.  
> - Values: true, false  
> - Default: true  
------  
> - [Bomber_Port](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L8) → The Bomber-API access port. If you have a problem on the startup, put a random number (4 digits is recommended).  
> - Values: number  
> - Default: 3000  
------  
> - [Ban_All_Links](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L9) → Kicks people who send any type of links.  
> - Values: true, false  
> - Default: false  
------  
> - [Bot_Commands](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L10) → Allow Iris to run commands on herself, you can run it on her WhatsApp too.  
> - Values: true, false  
> - Default: false  
------  
> - [Canvas_Audio](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L11) → Sends an audio when someone enters or leaves the group.  
> - Values: true, false  
> - Default: false  
------  
> - [Clear_Cache](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L12) → Clear messages cache after 'x' times.  
> - Values: true, false  
> - Default: true  
------  
> - [Filter_Type](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L13) → Anti-Flood usage mode.  
> - Values: 'user', 'chatId'  
> - Default: 'chatId'  
------  
> - [Daily_Reward](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L13) → The reward value of daily command.  
> - Values: number  
> - Default: 30  
------  
> - [Day_Messages](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L13) → Sends greeting messages onece in 6 hours.  
> - Values: true, false  
> - Default: false  
------  
> - [DDI](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L16-L19) → Kicks people who use fake numbers and other-country numbers.  
> - Values: array of numbers  
> - Default: ["55", "DDI DOIS - Opcional"]  
------  
> - [Enable_EAS](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L20) → Enables KillovSky news transmissions at console, can be useful to get news about updates.  
> - Values: true, false  
> - Default: true  
------  
> - [Enable_Backups](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L21) → Enables backup important files of íris.  
> - Values: true, false  
> - Default: true  
------  
> - [Fig_FPS](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L22) → FPS of GIF/Video to Sticker, setting to a highter values will cause 'errors' with size.  
> - Values: number  
> - Default: 10  
------  
> - [Iris_Coin](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L23) → Amount of í-coins for each play.  
> - Values: number  
> - Default: 10  
------  
> - [Language](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L24) → All texts, dialogues and translation systems of Íris.  
> - Values: "en", "pt", "es"  
> - Default: "pt"  
------  
> - [Max_Backups](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L25) → Controls the maximum backups in 'Backups' folder.  
> - Values: number  
> - Default: 3  
------  
> - [Max_Characters](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L26) → Kicks anyone who sends bug messages or larg texts.  
> - Values: number  
> - Default: 5000  
------  
> - [Max_Commands](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L27) → Blocks the multi command system when someone try to use more than one commands with one message.  
> - Values: number  
> - Default: 2  
------  
> - [Max_Download_Size](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L28) → Controls the maximum size of media uploading. Doesn't aply on owner's commands such as "upload".  
> - Values: number  
> - Default: 16  
------  
> - [Max_Groups](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L29) → The maximum amount of groups íris can join. if it goes beyond the limit, she'll leave.  
> - Values: number  
> - Default: 10  
------  
> - [Max_Msg_Cache](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L30) → Sets the limit of messeges cache.  
> - Values: number  
> - Default: 3000  
------  
> - [Max_Revoked](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L31) → The maximum revoked messages in the list, she will delete the last revoked message after reaching the limit.  
> - Values: number  
> - Default: 20  
------  
> - [Min_Steal](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L32) → The minimum amount of loot a thief can obtain by using the steal command.  
> - Values: number  
> - Default: 10  
------  
> - [Max_Steal](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L33) → The maximum amount of loot a thief can obtain by using the steal command.  
> - Values: number  
> - Default: 1000  
------  
> - [Steal_Reduce_Limit](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L34) → Sets the steal gain reduction percentage. Don't use values less than 1.  
> - Values: number  
> - Default: 3  
------  
> - [Max_Votes](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L35) → The maximum votes for each poll if the creator doesn't specify the vote limit.  
> - Values: number  
> - Default: 10  
------  
> - [Max_XP_Earn](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L36) → The maximum XP you can earn in the RPG leveling system.  
> - Values: number  
> - Default: 50  
------  
> - [Steal_Percent_Sucess](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L37) → Steal success rate.  
> - Values: number  
> - Default: 70  
------  
> - [Min_Membros](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L38) → The minimum amount of members íris wants to work in a group.  
> - Values: number  
> - Default: 1  
------  
> - [Min_XP_Earn](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L39) → The minimum XP you can earn in the RPG leveling system.  
> - Values: number  
> - Default: 15  
------  
> - [Minimal_Similarity_Command](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L40) → The minimum required similarity value for the command correction system.  
> - Values: number  
> - Default: 70  
------  
> - [Moment_Locale](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L41) → Sets the moment location function to get the correct time.  
> - Values: [string](https://github.com/moment/moment/tree/develop/locale)  
> - Default: "pt_BR"  
------  
> - [Moment_Timezone](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L42) → Set the moment timezone to get the correct UTC date.  
> - Values: [string](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)  
> - Default: "America/Sao_Paulo"  
------  
> - [Multitasking](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L43) → By enabling this, Iris can execute one or more different commands with one message.  
> - Values: true, false  
> - Default: false  
------  
> - [Niver_Present](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L44) → The birthday gift for the user in I'coins format.  
> - Values: number  
> - Default: 1000  
------  
> - [Owner](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L45-L49) → The list of owner(s) of the installed Iris, Owner numbers can control all of Iris' actions.  
> - Values: array of numbers with string  
> - Default: ["Insert your number@c.us", "Number 2 - Optional@c.us", "Do not remove the @c.us - 3° owner@c.us"]  
> Example: ["5511987654321@c.us"]  
------  
> - [Hide_Owner_Number](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L50) → Hides the owner number in almost all commands for safety.  
> - Values: true, false  
> - Default: false  
------  
> - [Popup](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L51) → Enables Iris notifications on your PC screen.  
> - Values: true, false  
> - Default: false  
------  
> - [Prefix](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L52-L69) → Íris prefixes, messages starting with that will be detected as commands.  
> - Values: array of everything  
> - Default: ["/", "$", "#", ".", "\\", "@", "=", "?", "+", "!", "&", ":", ";", "^", ">", "<"]  
------  
> - [Max_Divider_Win](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L70) → The loss value of games, do not use values less than 1.  
> - Values: number  
> - Default: 3  
------  
> - [Prize_Value_Max](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L71) → The maximum prize of some games, like mix.  
> - Values: number  
> - Default: 200  
------  
> - [Prize_Value_Min](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L72) → The minimum prize of some games, like mix.  
> - Values: number  
> - Default: 20  
------  
> - [Puppeteer_Wait](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L73) → Max wait time of puppeteer, when it reaches 0, Íris will force the close commands like CPF.  
> - Values: number (time in milliseconds)  
> - Default: 220000  
------  
> - [Search_Results](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L75) → Maximum results to get in 'duck' command.  
> - Values: number  
> - Default: 10  
------  
> - [StartUP_MSGs_Groups](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L76) → If you enable this, Íris will notify groups when she's online.  
> - Values: true, false  
> - Default: false  
------  
> - [Sticker_Author](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L77) → Default sticker author, if you want to set author as the message sender, don't edit.  
> - Values: string  
> - Default: "DONTEDITUSR - DONTEDITGPN"  
------  
> - [Sticker_Pack](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L78) → Default name of sticker packs created by Íris.  
> - Values: string  
> - Default: "🔰 Legião Z [bit.ly/BOT-IRIS] Íris ⚜️"  
------  
> - [User_Agent](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L79) → Default User-Agent for using axios and others modules. It's useful to bypass some U.A blocking.  
> - Values: [string](https://www.whatismybrowser.com/guides/the-latest-user-agent/chrome)  
> - Default: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36"  
------  
> - [Update_CMDS_On_Boot](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L80) → Refresh the command list at startup, useful for those who always create new commands.  
> - Values: true, false  
> - Default: false  
------  
> - [Wait_to_Play](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L81) → Cool down duration of a member after playing a game.  
> - Values: number (time in minutes)  
> - Default: 30  
------  
> - [Wait_to_Win](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L82) → The time of user XP earning of leveling system.  
> - Values: number (time in minutes)  
> - Default: 60  
------  
> - [XP_Difficulty](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L83) → The difficulty of the leveling system, higher values mean higher difficulty to level up.  
> - Values: number  
> - Default: 5  
------  
> - [Your_Name](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L84) → Owner's name/nickname, will be used when the sticker cannot be created with default values, use normal letters only.  
> - Values: string  
> - Default: "KillovSky"  
------  
> - [Owner_SECRET_Password](https://github.com/KillovSky/iris/blob/main/lib/config/Settings/config.json#L85) → Owner's secret password, if you don't set an owner, just put that password in the message to use the owner commands, DO NOT USE THE DEFAULT!  
> - Values: string  
> - Default: "irisBOT@Root"  
------  
  
</details>  