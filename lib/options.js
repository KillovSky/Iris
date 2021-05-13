/*
* Para que você possa baixar videos do youtube e outros, é necessário baixar o chrome mais recente.
* Realize o download no Windows 10/8.1/8/7 usando "https://www.google.com.br/chrome/".
* Caso utilize o Linux, rode ambos os comandos abaixo e obviamente, como sudo/root.
* ---------------------------------------------------------------------------------
* wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
* sudo apt install ./google-chrome-stable_current_amd64.deb
* ---------------------------------------------------------------------------------
* Caso não queira usar chrome, adicione // ao "useChrome" sem as aspas, deve ficar assim, "//useChrome: true," 
* Mas saiba que alguns comandos NÃO FUNCIONARÃO.
* Se você trocar o "true" da headless para "false", poderá controlar e ver a bot fazendo o trabalho.
* ----------------------------------------------------------------------------------
* Você também pode mexer nos parâmetros da ChromiumArgs, remover a linha da cerficate por exemplo deixará seu navegador mais seguro.
* Mas, caso o servidor contenha ADS, sinal de insegurança ou certificado expirado, ele retornara um erro no seu comando.
* Aqui segue uma lista dos parâmetros que podem ser usados/removidos > https://peter.sh/experiments/chromium-command-line-switches
* ----------------------------------------------------------------------------------
*/

module.exports = options = (start) => {
    const options = {
		authTimeout: 0,
		cacheEnabled: false,
		defaultViewport: null,
		disableSpins: true,
		headless: true,
		ignoreHTTPSError: true,
		killClientOnLogout: true,
		killProcessOnBrowserClose: true,
		qrTimeout: 0,
		restartOnCrash: start,
		sessionId: 'Iris',
		throwErrorOnTosBlock: false,
		timeout: 0,
		useChrome: true,
		userDataDir: "./logs",
        chromiumArgs: [
			"--aggressive-cache-discard",
			"--disable-application-cache",
			"--disable-cache",
			"--disable-dev-profile",
			"--disable-dev-shm-usage",
			"--disable-extensions",
			"--disable-gpu",
			"--disable-offline-load-stale-cache",
			"--disable-setuid-sandbox",
			"--disable-web-security",
			"--disk-cache-size=0",
			"--ignore-certificate-errors",
			"--no-sandbox"
        ]
    }
    return options
}