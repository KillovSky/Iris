/* ---------------------------------------------------------------------------------- *
 * Para que você possa baixar videos do youtube e outros, é necessário baixar o chrome mais recente.
 * Realize o download no Windows 10/8.1/8/7 usando "https://www.google.com.br/chrome/".
 * Caso utilize o Linux, rode ambos os comandos abaixo e obviamente, como sudo/root.
 * ---------------------------------------------------------------------------------
 * wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
 * sudo apt install ./google-chrome-stable_current_amd64.deb
 * ---------------------------------------------------------------------------------
 * Caso não queira usar chrome, adicione // ao "useChrome" sem as aspas, deve ficar assim, "//useChrome: true," 
 * Mas saiba que alguns comandos NÃO FUNCIONARÃO se você fizer isso, geralmente os de vídeos.
 * Se você trocar o "true" da headless para "false", poderá controlar e ver a Íris fazendo o trabalho.
 * ----------------------------------------------------------------------------------
 * Caso deseje mexer nos parâmetros de inicialização da Wa-Automate, veja isso > https://docs.openwa.dev/interfaces/api_model_config.ConfigObject.html
 * Aqui segue uma lista dos parâmetros que podem ser usados/apagados da chromiumArgs > https://peter.sh/experiments/chromium-command-line-switches
 * Mexer nos parâmetros de inicialização do chromium pode gerar muito mais performance, desde que você não use incorretamente.
 * ---------------------------------------------------------------------------------- */
const config = require('../config/Gerais/config.json')

exports.options = (restart) => {
	const startOptions = {
		authTimeout: 0,
		blockAssets: true,
		chromiumArgs: [
			'--aggressive-cache-discard',
			'--aggressive-tab-discard',
			'--disable-accelerated-2d-canvas',
			'--disable-application-cache',
			'--disable-cache',
			'--disable-dev-shm-usage',
			'--disable-gpu',
			'--disable-offline-load-stale-cache',
			'--disable-setuid-sandbox',
			'--disable-setuid-sandbox',
			'--disk-cache-size=0',
			'--ignore-certificate-errors',
			'--no-first-run',
			'--no-sandbox',
			'--no-zygote',
			'--single-process'
		],
		deleteSessionDataOnLogout: true,
		disableSpins: true,
		headless: true,
		killClientOnLogout: true,
		killProcessOnBrowserClose: true,
		killProcessOnTimeout: true,
		logFile: true,
		qrTimeout: 0,
		restartOnCrash: restart,
		sessionId: 'Iris_Login_QR',
		skipBrokenMethodsCheck: true,
		throwErrorOnTosBlock: false,
		useChrome: true,
		userDataDir: "./logs/Chrome",
		useStealth: true,
		hostNotificationLang: config.Notification_Lang
	}
	if (config.Use_Chrome == false) {
		startOptions.useChrome = false
	}
	if (config.Show_Zap == true) {
		startOptions.headless = false
		startOptions.resizable = true
	}
	if (config.Multiple_Devices == true && config.Safe_Mode == false) {
		startOptions.multiDevice = true
		delete startOptions.chromiumArgs
	}
	if (config.Chrome_Path !== null) {
		delete startOptions.useChrome
		startOptions.executablePath = config.Chrome_Path
	}
	if (config.Safe_Mode == true) {
		['blockAssets', 'skipBrokenMethodsCheck', 'useStealth'].forEach(o => delete startOptions[o])
		startOptions.safeMode = true
	}
	if (config.Using_Proxy == true) {
		startOptions.useNativeProxy = true
	}
	return startOptions
}