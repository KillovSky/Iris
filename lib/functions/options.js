/* ---------------------------------------------------------------------------------- *
 * Para que você possa baixar videos do youtube e outros, é necessário baixar o chrome mais recente.
 * Realize o download no Windows 10/8.1/8/7 usando "https://www.google.com.br/chrome/".
 * Caso utilize o Linux, rode ambos os comandos abaixo e obviamente, como sudo/root.
 * ---------------------------------------------------------------------------------
 * wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
 * sudo apt install ./google-chrome-stable_current_amd64.deb
 * ---------------------------------------------------------------------------------
 * Caso deseje mexer nos parâmetros de inicialização da Wa-Automate, veja isso > https://docs.openwa.dev/interfaces/api_model_config.ConfigObject.html
 * Aqui segue uma lista dos parâmetros que podem ser usados/apagados da chromiumArgs > https://peter.sh/experiments/chromium-command-line-switches
 * Mexer nos parâmetros de inicialização do chromium pode gerar muito mais performance, desde que você não use incorretamente.
 * ---------------------------------------------------------------------------------- */
const fs = require('fs')
const sess = JSON.parse(fs.readFileSync('./lib/config/Settings/session.json'))
const chromium = JSON.parse(fs.readFileSync('./lib/config/Settings/chrome.json'))

// Funções que a Wa-Automate usa para gerar uma sessão, embora seja opcional configurar isso, é totalmente melhor
exports.options = (restart, sesname, folderSes) => {

	// Criação de Object com os valores padrões
	const startOptions = {}

	// Abaixo são scripts que requerem ou não verificação para não obter incompatibilidade entre opções (não é 100% garantido, por isso, leia a página do session.json

	// Reinicia ao crashar por meio de função
	if (sess.Restart_On_Crash !== "Opcional | True | False") {
		startOptions.restartOnCrash = restart
	}

	// Sessão que ativa um limitador de tempo nas funções
	if (sess.Call_Timeout !== "Opcional | Number" && !isNaN(sess.Call_Timeout)) {
		startOptions.callTimeout = Number(sess.Call_Timeout)
	}
	
	// Sessão que espera pela timeout de login da sessão
	if (sess.Auth_Timeout !== "Opcional | Number" && !isNaN(sess.Auth_Timeout)) {
		startOptions.authTimeout = Number(sess.Auth_Timeout)
	}

	// A função abaixo faz screenshot do erro, pode enviar mensagens de JS_Handle se ativado
	if (sess.Screenshot_Error !== "Opcional | True | False") {
		startOptions.screenshotOnInitializationBrowserError = sess.Screenshot_Error
	}
	
	// Verifica se a sessão é 100% usável na primeira inicialização
	if (sess.Ensure_Headful_Integrity !== "Opcional | True | False") {
		startOptions.ensureHeadfulIntegrity = sess.Ensure_Headful_Integrity
	}

	// Bloqueia o envio de logs de crash para o whatsapp
	if (sess.Block_Crash_Logs !== "Opcional | True | False") {
		startOptions.blockCrashLogs = sess.Block_Crash_Logs
	}

	// Passa a perna no CSP
	if (sess.Bypass_CSP !== "Opcional | True | False") {
		startOptions.bypassCSP = sess.Bypass_CSP
	}

	// Usa patches locais em vez dos atualizados online
	if (sess.Cached_Patch !== "Opcional | True | False") {
		startOptions.cachedPatch = sess.Cached_Patch
	}

	// Ativa o cache do chrome
	if (sess.Cache_Enabled !== "Opcional | True | False") {
		startOptions.cacheEnabled = sess.Cache_Enabled
	}

	// Ativa a pasta de sessão da Íris no local desejado
	if (sess.Use_Custom_Data_Dir !== "Opcional | True | False") {
		startOptions.userDataDir = folderSes
	}

	// Usa nomes customizados de sessão
	if (sess.Use_Custom_Session_ID !== "Opcional | True | False") {
		startOptions.sessionId = sesname
	}

	// Usa nomes customizados de sessão
	if (sess.Use_Custom_Session_Path !== "Opcional | True | False") {
		startOptions.sessionDataPath = sess.Session_Data_Path
	}

	// Usa um servidor de sticker customizado
	if (sess.Use_Custom_Sticker_Server !== "Opcional | True | False") {
		startOptions.stickerServerEndpoint = sess.Sticker_Server_Endpoint
	}

	// Especifica o tipo de QR
	if (sess.QR_Format !== "Opcional | String") {
		startOptions.qrFormat = sess.QR_Format
	}

	// Faz um fix no cors desde que esteja obtendo erros no mesmo
	if (sess.Cors_Fix !== "Opcional | True | False") {
		startOptions.corsFix = sess.Cors_Fix
	}

	// Deleta a sessão no Logout
	if (sess.Delete_Session_Data_On_Logout !== "Opcional | True | False") {
		startOptions.deleteSessionDataOnLogout = sess.Delete_Session_Data_On_Logout
	}

	// Ativa a DEV_Tools
	if (sess.Dev_Tools !== "Opcional | True | False") {
		startOptions.devtools = sess.Dev_Tools
	}

	// Ativa a interface ASCII
	if (sess.Disable_Spins !== "Opcional | True | False") {
		startOptions.disableSpins = sess.Disable_Spins
	}

	// Ativa os loggins de eventos, ex: participantes mudando
	if (sess.Event_Mode !== "Opcional | True | False") {
		startOptions.eventMode = sess.Event_Mode
	}

	// Envia uma URL pra voce escanear o QR fora do PC
	if (sess.EZQR !== "Opcional | True | False") {
		startOptions.ezqr = sess.EZQR
	}

	// Usa os patches da github em vez dos locais e atualizados da open-wa
	if (sess.GH_Patch !== "Opcional | True | False") {
		startOptions.ghPatch = sess.GH_Patch
	}

	// Usa a Íris de fundo
	if (sess.Headless !== "Opcional | True | False") {
		startOptions.headless = sess.Headless
	}

	// Pelo que entendi, tira o @g.us e @c.us dos ID's
	if (sess.ID_Correction !== "Opcional | True | False") {
		startOptions.idCorrection = sess.ID_Correction
	}

	// Não avisa/ignora se o user for desconectado
	if (sess.Ignore_Nuke !== "Opcional | True | False") {
		startOptions.ignoreNuke = sess.Ignore_Nuke
	}

	// Força a wa-automate a estar sempre atualizada
	if (sess.Keep_Updated !== "Opcional | True | False") {
		startOptions.keepUpdated = sess.Keep_Updated
	}

	// Desliga a Íris em casos de Logout
	if (sess.Kill_Client_On_Logout !== "Opcional | True | False") {
		startOptions.killClientOnLogout = sess.Kill_Client_On_Logout
	}

	// Desliga a Íris em casos de navegador fechar
	if (sess.Kill_Client_On_Browser_Close !== "Opcional | True | False") {
		startOptions.killProcessOnBrowserClose = sess.Kill_Client_On_Browser_Close
	}

	// Desliga a Íris em casos de timeout
	if (sess.Kill_Client_On_Timeout !== "Opcional | True | False") {
		startOptions.killProcessOnTimeout = sess.Kill_Client_On_Timeout
	}

	// Usa o modo legacy (antiga) wa automate
	if (sess.Legacy !== "Opcional | True | False") {
		startOptions.legacy = sess.Legacy
	}

	// Printa as mensagens do console do navegador
	if (sess.Log_Console !== "Opcional | True | False") {
		startOptions.logConsole = sess.Log_Console
	}

	// Printa as mensagens de erro do console do navegador
	if (sess.Log_Console_Errors !== "Opcional | True | False") {
		startOptions.logConsoleErrors = sess.Log_Console_Errors
	}

	// Função que loga os erros em formato de Object no console
	if (sess.Log_Debug_Info_As_Object !== "Opcional | True | False") {
		startOptions.logDebugInfoAsObject = sess.Log_Debug_Info_As_Object
		delete startOptions.disableSpins
	}

	// Manda as mensagens de erro do console do navegador pra um arquivo | dir/ID/TimeStamp.log
	if (sess.Log_File !== "Opcional | True | False") {
		startOptions.logFile = sess.Log_File
	}

	// Ativa o Multiple_Devices na sessão
	if (sess.Multi_Devices == true) {
		startOptions.multiDevice = sess.Multi_Devices
		delete startOptions.chromiumArgs // Caso exista anteriormente
	} else if (chromium.Enable_Chrome_Args == true) {
		startOptions.chromiumArgs = chromium.Standart_Chromium_Args
	}

	// Função que abre uma página com os Logs e QR's
	if (sess.Popup && sess.Popup_Port !== "Opcional | Number" && !isNaN(sess.Popup_Port)) {
		startOptions.popup = sess.Popup | sess.Popup_Port
	}
	
	// Função que faz a qualidade do QR aumentar ou cair
	if (sess.QR_Quality !== "Opcional | Number" && !isNaN(sess.QR_Quality)) {
		startOptions.qrQuality = Number(sess.QR_Quality)
	}

	// Função que mexe com a timeout do QR
	if (sess.QR_Timeout !== "Opcional | Number" && !isNaN(sess.QR_Timeout)) {
		startOptions.qrTimeout = Number(sess.QR_Timeout)
	}

	// Função que abre uma página com apenas o QR
	if (sess.QR_PopUp_Only !== "Opcional | True | False") {
		startOptions.qrPopUpOnly = sess.QR_PopUp_Only
	}

	// Pula o QR no terminal
	if (sess.QR_Log_Skip !== "Opcional | True | False") {
		startOptions.qrLogSkip = sess.QR_Log_Skip
	}

	// Modo Raspberry PI
	if (sess.Raspi !== "Opcional | True | False") {
		startOptions.raspi = sess.Raspi
	}

	// Resiza a janela
	if (sess.Headless == false) {
		startOptions.headless = sess.Headless
		startOptions.resizable = sess.Resizable
	}

	// Safe-Mode Usage da wa-automate
	if (sess.Safe_Mode !== "Opcional | True | False") {
		startOptions.safeMode = sess.Safe_Mode
	}

	// Printa um erro se não der pra pegar o QR
	if (sess.Throw_Error_On_Tos_Block !== "Opcional | True | False") {
		startOptions.throwErrorOnTosBlock = sess.Throw_Error_On_Tos_Block
	}

	// Faz a função não carregar outro QR em caso de sessão expirada
	if (sess.Throw_On_Expired_Session_Data !== "Opcional | True | False") {
		startOptions.throwOnExpiredSessionData = sess.Throw_On_Expired_Session_Data
	}

	// Ativa uso do chrome
	if (sess.Use_Chrome !== "RECOMENDADO TRUE | True | False") {
		startOptions.useChrome = sess.Use_Chrome
	}

	// Pula o check de segurança
	if (sess.Skip_Broken_Methods_Check !== "Opcional | True | False") {
		startOptions.skipBrokenMethodsCheck = sess.Skip_Broken_Methods_Check
	}

	// Não salva a sessão
	if (sess.Skip_Session_Save !== "Opcional | True | False") {
		startOptions.skipSessionSave = sess.Skip_Session_Save
	}

	// Não verifica updates da wa-automate
	if (sess.Skip_Update_Check !== "Opcional | True | False") {
		startOptions.skipUpdateCheck = sess.Skip_Update_Check
	}

	// Ativa o modo Stealth
	if (sess.Use_Stealth !== "Opcional | True | False") {
		startOptions.useStealth = sess.Use_Stealth
	}

	// Bloqueia o uso dos assets
	if (sess.Block_Assets !== "Opcional | True | False") {
		startOptions.blockAssets = sess.Block_Assets
	}

	// Verifica se a sessão é 100% usável na primeira inicialização
	if (sess.Wait_For_Ripe_Session !== "Opcional | True | False") {
		startOptions.waitForRipeSession = sess.Wait_For_Ripe_Session
	}

	// Auto detecta emojis feitos em ASCII
	if (sess.Auto_Emoji !== "Opcional") {
		startOptions.autoEmoji = sess.Auto_Emoji
	}

	// Função que baixa uma versão especifica do Chromium
	if (sess.Browser_Revision !== "Opcional | Number") {
		startOptions.browserRevision = sess.Browser_Revision
		delete startOptions.Use_Chrome
		delete startOptions.executablePath
	}

	// Insere o local correto do chrome, se não feito pelo user, caso não tenha é deletado a key
	if (sess.Use_Chrome == true && sess.Executable_Path == "INSIRA O LOCAL DO EXECUTAVEL DO CHROME" || sess.Use_Chrome == true && !fs.existsSync(sess.Executable_Path)) {
		// Define o local do Chrome em todos os sistemas operacionais acima
		const chromePath = {
			"win32": 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
			"win64": 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
			"linuxChromeStable": '/usr/bin/google-chrome-stable',
			"linuxChrome": '/usr/bin/google-chrome',
			"darwin": '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
		}

		// Insere o local na Object
		if (fs.existsSync(chromePath.win32)) {
			startOptions.executablePath = chromePath.win32
			sess.Executable_Path = chromePath.win32
		} else if (fs.existsSync(chromePath.win64)) {
			startOptions.executablePath = chromePath.win64
			sess.Executable_Path = chromePath.win64
		} else if (fs.existsSync(chromePath.linuxChromeStable)) {
			startOptions.executablePath = chromePath.linuxChromeStable
			sess.Executable_Path = chromePath.linuxChromeStable
		} else if (fs.existsSync(chromePath.linuxChrome)) {
			startOptions.executablePath = chromePath.linuxChrome
			sess.Executable_Path = chromePath.linuxChrome
		} else if (fs.existsSync(chromePath.darwin)) {
			startOptions.executablePath = chromePath.darwin
			sess.Executable_Path = chromePath.darwin
		} else {
			delete startOptions.executablePath // Deleta a key se não encontrar o chrome (se é que a key é inserida em algum momento)
		}
		if (Object.keys(startOptions).includes('executablePath')) {
			fs.writeFileSync('./lib/config/Settings/session.json', JSON.stringify(sess, null, "\t"))
			console.log('Local do chrome não configurado, escolhendo local: ', startOptions.executablePath)
			delete startOptions.useChrome
		}
	}

	// Função que adiciona a ID do discord no Sticker (Ler mais)
	if (sess.Discord_ID !== "Opcional") {
		startOptions.discord = sess.Discord_ID
	}

	// User-Agent customizada
	if (sess.Custom_User_Agent !== "Opcional") {
		startOptions.customUserAgent = sess.Custom_User_Agent
	}

	// Função que limita os QR's gerados
	if (sess.QR_Max !== "Opcional | Number" && !isNaN(sess.QR_Max)) {
		startOptions.qrMax = Number(sess.QR_Max)
	}

	// Função que resiza a página para um valor customizado
	if (sess.Custom_Page_Height !== 0 && sess.View_Port_Width !== 0) {
		startOptions.viewport = {
			height: sess.View_Port_Height,
			width: sess.View_Port_Width
		}
		delete startOptions.resizable
	}

	// Caso esteja usando proxy
	if (sess.Use_Native_Proxy !== "Opcional | True | False") {
		startOptions.useNativeProxy = sess.Use_Native_Proxy
	}

	// Função que limita o uso até x chats atingirem
	if (sess.Max_Chats !== "Opcional | Number" && !isNaN(sess.Max_Chats)) {
		startOptions.maxChats = Number(sess.Max_Chats)
	}

	// Função que limita o uso até x mensagens serem recebidas
	if (sess.Max_Messages !== "Opcional | Number" && !isNaN(sess.Max_Messages)) {
		startOptions.maxMessages = Number(sess.Max_Messages)
	}

	// Seta o local do Chrome ou qualquer navegador que o puppeteer seja compatível, como o MS-EDGE
	if (sess.Executable_Path !== "INSIRA O LOCAL DO EXECUTAVEL DO CHROME") {
		startOptions.executablePath = sess.Executable_Path
	}

	// Função que adiciona a licença da Wa-Automate
	if (sess.License_Key !== "Opcional") {
		startOptions.licenseKey = sess.License_Key
	}

	// Ativa o modo de segurança removendo parâmetros perigosos e mudando outros
	if (sess.Safe_Mode == true) {
		['blockAssets', 'skipBrokenMethodsCheck', 'useStealth', 'chromiumArgs', 'ensureHeadfulIntegrity', 'idCorrection', 'ignoreNuke', 'keepUpdated', 'legacy', 'skipBrokenMethodsCheck'].forEach(o => delete startOptions[o])
		if (!sess.Multi_Devices == false && puppeteer.Enable_Chrome_Args == true) {
			startOptions.chromiumArgs = chromium.Safest_Chromium_Args
		}
	}

	// Manda os valores finais para a config.js e cria uma sessão da Íris
	return startOptions

}