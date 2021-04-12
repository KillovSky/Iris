/*
* Para que você possa baixar videos do youtube e outros, é necessario baixar o chrome mais recente, para isso acesse https://www.google.com.br/chrome/ para o download no Windows 10/8.1/8/7
* Para o download no linux, rode ambos os comandos abaixo e obviamente, como sudo/root.
* ---------------------------------------------------------------------------------
* wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
* sudo apt install ./google-chrome-stable_current_amd64.deb
* ---------------------------------------------------------------------------------
* Caso não queira usar chrome, adicione // ao "useChrome" sem as aspas, deve ficar assim, "//useChrome: true," 
* Mas saiba que alguns comandos NÃO FUNCIONARÃO.
* Se você trocar o "true" da headless para "false", poderá controlar e ver a bot fazendo o trabalho.
*/

module.exports = options = (start) => {
    const options = {
        sessionId: 'Iris',
        headless: true,
        qrTimeout: 0,
        authTimeout: 0,
        restartOnCrash: start,
        cacheEnabled: false,
        useChrome: true,
        killProcessOnBrowserClose: true,
        throwErrorOnTosBlock: false,
        chromiumArgs: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--aggressive-cache-discard',
            '--disable-cache',
            '--disable-application-cache',
            '--disable-offline-load-stale-cache',
            '--disk-cache-size=0'
        ]
    }
    return options
}