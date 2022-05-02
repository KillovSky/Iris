### Project Íris  
Íris is a BOT in English, Spanish and Portuguese for WhatsApp.  
It has hundreds of different commands and receives 'frequent' updates with many new features, corrections and improvements.  
  
### Another Language  
Si quieres un tutorial en español [Clic Aquí](https://github.com/KillovSky/iris/blob/main/.readme/es/README.md).  
Para um tutorial em Português [Clique Aqui](https://github.com/KillovSky/iris/blob/main/README.md).  
  
### Íris "Page"  
I created a 'different' page to host some information from Iris, you can access the GitHub version [From Here](http://htmlpreview.github.io/?https://github.com/KillovSky/iris/blob/main/.readme/donates/page.html), it will only update when I release a new Íris update.  
You can also access the local page ('the same' as GitHub), by downloading Iris and opening the ".readme" folder, then "donates" and opening the "page.html" file, this is much better to display.  
If you want to get the updated page, check [JS Fiddle Version](https://jsfiddle.net/KillovSky/mgp6ed3x/show).  
  
### Personal Note  
This software uses the [MIT](https://choosealicense.com/licenses/mit/) license.  
It's prohibited the removal of credits, and I expend a LOT of time to make this better for all users.  
Please, do not remove the credits from my BOT.  
If you see someone stealing or who has stolen, show the truth, tell them it is plagiarism.  
  
### Errors, Bugs, Solutions, Improvements and Suggestions  
If you get an error, bug, have solutions, improvements or suggestions, post them [here](https://github.com/KillovSky/iris/issues/q=), I'll be supporting this page, but remember, this is just for Project Iris, I don't support other programs.  
Do not create any pull-requests, they will be rejected, but your idea will be analyzed and manually inserted in future updates, with credits to you.  
If possible, create a TXT file with the code and post it in the issues.  
  
### Functions  
Íris has hundreds of commands, I can't describe them all on this page right now, but you can check [This File](https://raw.githubusercontent.com/KillovSky/iris/lib/config/Utilidades/Comandos_Automate.txt) with the command names to get an idea.  
  
### Windows Requirements [Downloads]  
- [NodeJS](https://nodejs.org) - Íris programming environment, use LTS.  
  
- [Chrome](https://www.google.com/chrome/) - To send videos, photos and others files - Optional, but highly recommended.  
  
- [Gow](https://github.com/bmatzelle/gow/releases) - For Linux GNU/BASH commands.  
  
- [Git](https://git-scm.com) - To get another GNU/BASH tools and Shell Console.  
  
- [Tesseract OCR](https://tesseract-ocr.github.io/tessdoc/Downloads) - To read images.  
  
If you have any problem with Íris Shell commands on Windows, just use `Git Bash`, it will work, if you want to use CMD, PowerShell or other console, you need to enter `bash.exe` in your Windows PATH, you can [Follow This](https://github.com/KillovSky/iris/issues/456#issuecomment-1001087525) to insert, **but be very careful.**  
  
### Linux Requirements [Install from Terminal]  
  
To install all the requirements by the standard terminal, open it and use these commands (you can copy and paste):  
  
```bash  
# Update Linux Repository and Programmes  
sudo apt update && sudo apt upgrade -y  
  
# Install cURL and WGET to get Chrome and Node Source  
sudo apt install curl wget -y  
  
# Download Lastest Chrome Stable (Only 64x)  
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb  
  
# Install Node.js LTS repository in APT Sources  
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo bash  
  
# Install all the needed programs  
sudo apt install nodejs python python3 python3-pip git build-essential tesseract-ocr ./google-chrome-stable_current_amd64.deb -y  
```  
  
If you get `sudo command not found`, remove `sudo` from the command and try.  
  
If you get `apt: command not found`, try to use `apt-get`.  
  
If `apt-get` doesn't work either, you have to compile `apt` on your system, just [Check This - 'Advanced Users Only'](https://askubuntu.com/questions/860375/installing-apt-get), or change your distro, I use and recommend `Anti-X` and `Xubuntu Minimal`, they are the best distros for **Low-end PC** in my opinion, but `Windows 8.1` or higher is also good, recently I only use `Windows 8.1`.  
  
### Installation  
To download Iris - [After installing the requirements] - see the [Tutorials Here](http://htmlpreview.github.io/?https://github.com/KillovSky/iris/blob/main/.readme/donates/page.html) or [Here](https://github.com/KillovSky/iris/discussions/28), you can also use the following commands:  
  
```bash  
# Download the files  
git clone https://github.com/KillovSky/iris.git  
  
# Enter on Íris folder  
cd iris  
  
# Install Modules  
npm i  
  
# If you want to use 'tools.sh' to update Íris, run:  
pip install unidecode  
```  
  
### Mandatory Changes  
Before starting, you need to edit all non-optional information described [Here](https://github.com/KillovSky/iris/blob/main/.readme/en/config.md), otherwise you may not be able to use some commands.  
  
### Run  
There are three ways to open Iris, you can look and choose below, remember to have the terminal open in the folder:  
  
```bash  
# Method 1 - The A.I.O Toolbox - Best (Portuguese only)  
# This includes several methods to start, includes the Method 1 and 2 too  
bash tools.sh  
# Or use:  
./tools.sh  
  
# Method 2 - The Standart - Simple but good  
npm start  
# Or use:  
node start.js  
  
# Method 3 - The PM2 Method - Reboot in every stuck "error"  
# This requires PM2, you can install it from Method 1 or type: 'npm i -g pm2'  
pm2 start start.js --name iris  
  
# To reboot PM2 in every 6 hours to improve perfomance, use Method 1 or type:  
pm2 start start.js --name iris --cron-restart="0 */6 * * *"  
```  
  
### Check all the commands  
Keep in mind that the menus are still outdated, so you can check [This File](https://raw.githubusercontent.com/KillovSky/iris/lib/config/Utilidades/Comandos_Automate.txt) for the updated commands.  
  
If you want to see the outdated but beautiful menu, send `/menu` to Íris.  
  
To get the most 'up-to-date' menu, send `/menut` to Iris.  
  
### Make new commands  
To create **prefix** commands, use [This Prebuild](https://github.com/KillovSky/iris/blob/main/lib/functions/config.js#L6289) base, just remove the "/\*" and "\*/" and edit the code, you can check the [PT-BR Tutorial](https://github.com/KillovSky/iris/blob/main/Tutorial%20de%20Edi%C3%A7%C3%A3o%20PT-BR.txt) for better instructions on creating `cases`.  
  
To create **non-prefix** commands, use [This Prebuild](https://github.com/KillovSky/iris/blob/main/lib/functions/config.js#L683) base, you can use by removing the "/\*" and "\*/" and editing the code, it is recommended to create a `case` instead.  
  
Check the [WA-Automate Page](https://docs.openwa.dev/classes/api_Client.Client.html) for all the functions that Iris can use.  
  
### Disable auto-opening browser on bomb  
You can do this in two ways:  
  
1. Open the `Git Bash` at Íris folder and type `bash tools.sh`, select the `Opção 14 - Desativar navegador Bomber-API` by typing `14`, wait the `done` confirmation and everything is ok.  
  
2. Open the ```node_modules``` folder and go to ```bomber-api```, open the file ```index.js``` and remove the lines ```"open(`http://localhost:3000/`)"``` & ```"open(`http://localhost:${arguments.port}/`)"```.  
  
You have to edit this every time you run `npm update`, `npm i` or `npm install`.  
  
### Error in Port 3000  
You can do it in two ways:  
  
1. Edit the number `3000` in the line ```"app.listen(3000"```, located in `node_modules/Bomber-API/index.js` - same place to disable browser autostart - but remember to edit `Bomber_Port` in `config.json` after.  
  
2. Open `Git Bash` in the Iris folder and type `bash tools.sh`, select the `Move Bomber-API port`, type the number, wait for `done` and okay - Recommended.  
  
### Update Íris, Modules or More  
You can do **EVERYTHING** by using method 1, but if you want to do manually, here's the way, remember to open terminal at Íris folder.  
  
```bash  
# Using 'Tools.sh' - The Best - All in One  
bash tools.sh  
  
# Update Modules  
npm update  
  
# You should update Íris only when she says "[UPDATE]" at boot.  
# Update Íris and 'save settings' is only available in the 'Tools.sh'.  
# if you want to update without saving, do the installation again.  
```  
  
### Thanks, Donates and Support  
- [Donations] - This project is maintained for free and with no focus on money, contribute if you can ❤️  
- You can check all information by [Clicking Here](http://htmlpreview.github.io/?https://github.com/KillovSky/iris/blob/main/.readme/donates/page.html).  
- Thanks from my heart for everyone!  