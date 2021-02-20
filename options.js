const fs = require('fs-extra') // Modulo de operações em disco
// SE VOCE OBTIVER PROBLEMAS, REMOVA A // DO USE CHROME

module.exports = options = (headless, start) => {
    const options = {
        sessionId: 'Iris',
        headless: headless,
        qrTimeout: 0,
        authTimeout: 0,
        restartOnCrash: start,
        cacheEnabled: false,
        //useChrome: true,
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