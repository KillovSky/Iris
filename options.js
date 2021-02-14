const fs = require('fs-extra') // Modulo de operações em disco

module.exports = options = (headless, start) => {
    const chromePath = {
        win32: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Windows 32 bit
        win64: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', //Windows 64 bit
        linuxChrome: '/usr/bin/google-chrome-stable', // Linux - Chrome
        linuxChromium: '/usr/bin/chromium-browser', // Linux - Chromium
        darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' // MacOS
    } // Define o local do Chrome em todos os sistemas operacionais acima

    if (fs.existsSync(chromePath.win32)) {
        execPath = chromePath.win32
    } else if (fs.existsSync(chromePath.win64)) {
        execPath = chromePath.win64
    } else if (fs.existsSync(chromePath.linuxChrome)) {
        execPath = chromePath.linuxChrome
    } else if (fs.existsSync(chromePath.linuxChromium)) {
        execPath = chromePath.linuxChromium
    } else if (process.platform === 'darwin') {
        execPath = chromePath.darwin
    } else {
        console.error(new Error('Chrome não localizado!'))
        process.exit(1)
    } // Checa se o navegador existe, se não existir instale Google Chrome
	
	// Se quiser parar de usar chrome coloque a * / antes da chromepath e a / * apos o fim da else acima, e entao bote o // no executablePath e useChrome abaixo
	
    const options = {
        headless: headless,
        autoRefresh: true,
        restartOnCrash: start,
        cacheEnabled: false,
        executablePath: execPath,
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
            '--disk-cache-size=0',
			'--log-level=3',
			'--no-default-browser-check',
			'--disable-site-isolation-trials',
			'--no-experiments',
			'--ignore-gpu-blacklist',
			'--ignore-certificate-errors',
			'--ignore-certificate-errors-spki-list',
			'--disable-gpu',
			'--disable-extensions',
			'--disable-default-apps',
			'--enable-features=NetworkService',
			'--disable-setuid-sandbox',
			'--no-sandbox',
			'--disable-webgl',
			'--disable-infobars',
			'--window-position=0,0',
			'--ignore-certifcate-errors',
			'--ignore-certifcate-errors-spki-list',
			'--disable-threaded-animation',
			'--disable-threaded-scrolling',
			'--disable-in-process-stack-traces',
			'--disable-histogram-customizer',
			'--disable-gl-extensions',
			'--disable-composited-antialiasing',
			'--disable-canvas-aa',
			'--disable-3d-apis',
			'--disable-accelerated-2d-canvas',
			'--disable-accelerated-jpeg-decoding',
			'--disable-accelerated-mjpeg-decode',
			'--disable-app-list-dismiss-on-blur',
			'--disable-accelerated-video-decode',
			'--disable-dev-shm-usage',
			'--incognito'
        ]
    } // São as opções de inicialização do Chromium

    return options
}