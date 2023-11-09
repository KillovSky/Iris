/*
    Este local é restrito em nível máximo, o uso desta função por meio da exec causará danos.
    Por isso não existem funções exports ou Ambient, não use.
*/

/* Módulo para verificar a existência de comandos */
const commandExists = require('command-exists').sync;

/* Canvas deve ser chamado antes que sharp */
// eslint-disable-next-line no-unused-vars, import/no-extraneous-dependencies
const canvas = require('canvas');

/* Sistema operacional do PC */
const currentPlatform = process.platform;

/* Condições para iniciar */
const programExists = {
    bash: commandExists('bash'),
    zip: commandExists('zip'),
    node: commandExists('node'),
    sqlite3: commandExists('sqlite3') || commandExists('sqlite'),
    python3: commandExists('python3') || commandExists('python'),
    tesseract: commandExists('tesseract'),
    git: commandExists('git'),
};

/* URLs de download para programas ausentes */
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

/* Verifica se algum pré-requisito está ausente */
const missing = Object.keys(programExists).filter((prerequisite) => !programExists[prerequisite]);

/* Se todos os pré-requisitos estiverem disponíveis */
if (missing.length === 0) {
    /* Inicia o programa principal */
    /* eslint-disable-next-line global-require */
    require('./index');

    /* Se tiver algum faltando */
} else {
    /* Printa a plataforma do user caso ele venha pedir ajuda no suporte */
    console.log(`Your System/Platform: ${currentPlatform}`);

    /* Imprime uma mensagem informando sobre os pré-requisitos ausentes */
    console.log('You do not meet the necessary requirements.\n\nIf I show commands, they are just suggestions and predictions, they may not work on your system.\n\nPlease install the following programs:');

    /* Se a plataforma atual tiver informações de download disponíveis */
    if (programDownloads[currentPlatform]) {
        /* Obtém as informações de download para a plataforma atual */
        const downloads = programDownloads[currentPlatform];

        /* Lista os programas ausentes e as URLs de download correspondentes */
        missing.forEach((missingProgram, index) => console.log(`${index + 1}. ${missingProgram.toUpperCase()} -> ${downloads[missingProgram]}`));

        /* Se a plataforma não for existente aqui */
    } else {
        /* Printa ela e os programas que faltam */
        console.log(missing.join(', '));
    }

    /* Printa a página de tutorial */
    console.log('\nHow to Install: https://github.com/KillovSky/Iris#-guias-de-instalação');

    /* Sai do programa com um código de erro 1 */
    process.exit(1);
}
