/*
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
* Certifique-se de ativar a defaultViewport caso faça isso.
* ----------------------------------------------------------------------------------
* Caso deseje mexer nos parâmetros de inicialização da Wa-Automate, veja isso > https://docs.openwa.dev/interfaces/api_model_config.configobject.html
* Aqui segue uma lista dos parâmetros que podem ser usados/apagados da chromiumArgs > https://peter.sh/experiments/chromium-command-line-switches
* Mexer nos parâmetros de inicialização do chromium pode gerar muito mais performance, desde que você não use incorretamente.
* ----------------------------------------------------------------------------------
*/

module.exports = options = (start) => {
    const options = {
		authTimeout: 0,
		cacheEnabled: false,
		//defaultViewport: null,
		disableSpins: true,
		headless: true,
		killProcessOnBrowserClose: true,
		qrTimeout: 0,
		restartOnCrash: start,
		sessionId: 'Iris',
		throwErrorOnTosBlock: false,
		useChrome: true,
		userDataDir: "./logs/Chrome",
        chromiumArgs: [
			'--aggressive-cache-discard',
			'--disable-application-cache',
			'--disable-cache',
			'--disable-offline-load-stale-cache',
			'--disable-setuid-sandbox',
			'--disk-cache-size=0',
			'--ignore-certificate-errors',
			'--no-sandbox'
        ]
    }
    return options
}