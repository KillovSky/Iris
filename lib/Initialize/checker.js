/*
    Este local é restrito em nível máximo, o uso desta função por meio da exec causará danos.
    Por isso não existem funções exports ou Ambient, não use.
*/

/* Módulo para verificar a existência de comandos */
const commandExists = require('command-exists').sync;

/* Sistema operacional do PC */
const currentPlatform = process.platform;

/**
 * Verifica a existência de programas essenciais.
 * @type {Object}
 */
const programExists = {
    bash: commandExists('bash'),
    zip: commandExists('zip'),
    node: commandExists('node'),
    sqlite3: commandExists('sqlite3') || commandExists('sqlite'),
    python3: commandExists('python3') || commandExists('python'),
    /* tesseract: commandExists('tesseract'), */
    git: commandExists('git'),
};

/**
 * URLs de download ou comandos de instalação para programas ausentes, organizados por plataforma.
 * @type {Object}
 */
const programDownloads = {
    win32: {
        bash: 'https://gitforwindows.org/',
        git: 'https://gitforwindows.org/',
        zip: 'https://github.com/bmatzelle/gow/releases/tag/v0.8.0',
        node: 'https://nodejs.org/en/download/',
        sqlite3: 'https://www.sqlite.org/download.html',
        python3: 'https://www.python.org/downloads/windows/',
        tesseract: 'https://github.com/UB-Mannheim/tesseract/wiki',
    },
    linux: {
        bash: 'sudo apt install bash',
        zip: 'sudo apt install zip unzip',
        git: 'sudo apt install git',
        node: 'sudo apt install nodejs build-essential',
        sqlite3: 'sudo apt install sqlite3',
        python3: 'sudo apt install python3',
        tesseract: 'sudo apt install tesseract-ocr',
    },
    darwin: {
        bash: 'brew install bash',
        zip: 'brew install zip unzip',
        git: 'brew install git',
        node: 'brew install node',
        sqlite3: 'brew install sqlite',
        python3: 'brew install python@3',
        tesseract: 'brew install tesseract',
    },
    freebsd: {
        bash: 'pkg install bash',
        zip: 'pkg install zip unzip',
        git: 'pkg install git',
        node: 'pkg install node',
        sqlite3: 'pkg install sqlite3',
        python3: 'pkg install python3',
        tesseract: 'pkg install tesseract',
    },
    openbsd: {
        bash: 'pkg_add bash',
        zip: 'pkg_add zip unzip',
        git: 'pkg_add git',
        node: 'pkg_add node',
        sqlite3: 'pkg_add sqlite3',
        python3: 'pkg_add python3',
        tesseract: 'pkg_add tesseract',
    },
    sunos: {
        bash: 'pkg install bash',
        zip: 'pkg install zip unzip',
        git: 'pkg install git',
        node: 'pkg install nodejs',
        sqlite3: 'pkg install sqlite3',
        python3: 'pkg install python37',
        tesseract: 'https://tesseract-ocr.github.io/tessdoc/Compiling.html',
    },
    aix: {
        bash: 'https://www.perzl.org/aix/index.php?n=Main.Bash',
        zip: 'https://www.perzl.org/aix/index.php?n=Main.Zip | http://v14700.1blu.de/aix/index.php?n=Main.Unzip',
        git: 'https://www.perzl.org/aix/index.php?n=Main.Git',
        node: 'https://www.perzl.org/aix/index.php?n=Main.NodeJS',
        sqlite3: 'https://www.perzl.org/aix/index.php?n=Main.Sqlite',
        python3: 'https://www.perzl.org/aix/index.php?n=Main.Python',
        tesseract: 'https://tesseract-ocr.github.io/tessdoc/Compiling.html',
    },
};

/**
 * Lista de programas ausentes.
 * @type {Array<string>}
 */
const missing = Object.keys(programExists).filter((prerequisite) => !programExists[prerequisite]);

/* Verifica se todos os pré-requisitos estão instalados */
if (missing.length === 0) {
    /* Inicia o programa principal */
    /* eslint-disable-next-line global-require */
    require('./index');

    /* Se tiver algum faltando */
} else {
    /* Exibe a plataforma do usuário para fins de suporte */
    console.log(`Your System/Platform: ${currentPlatform}`);

    /* Mensagem informativa sobre os pré-requisitos ausentes */
    console.log('You do not meet the necessary requirements.\n\nIf I show commands, they are just suggestions and predictions, they may not work on your system.\n\nPlease install the following programs:');

    /* Verifica se há informações de download para a plataforma atual */
    if (programDownloads[currentPlatform]) {
        /* Checa as URLs ou códigos pela plataforma */
        const downloads = programDownloads[currentPlatform];

        /* Lista os programas ausentes com as instruções de instalação */
        missing.forEach((missingProgram, index) => console.log(`${index + 1}. ${missingProgram.toUpperCase()} -> ${downloads[missingProgram]}`));

        /* Exibe os programas ausentes sem instruções específicas */
    } else console.log(missing.join(', '));

    /* Link para o tutorial de instalação */
    console.log('\nHow to Install: https://github.com/KillovSky/Iris/wiki');

    /* Encerra o programa com código de erro 1 */
    process.exit(1);
}
