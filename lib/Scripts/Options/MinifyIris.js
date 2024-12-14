/* eslint-disable max-len */
/* Requires */
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

/**
 * Minifica ou remove comentários de arquivos JS substituindo o arquivo original pela versão modificada.
 * @param {string} filePath - Caminho do arquivo
 */
function minifyFile(filePath) {
    if (!filePath.includes('MinifyIris') && !filePath.includes('Tutorial')) {
        exec(`uglifyjs ${filePath} -o ${filePath} --compress --mangle`, (error) => {
            if (error) {
                console.error(`Erro ao processar o arquivo ${filePath}: ${error}`);
            } else {
                console.log(`Arquivo processado com sucesso: ${filePath}`);
            }
        });
    }
}

/**
 * Recursivamente processa todos os arquivos JS de uma pasta
 * @param {string} folderPath - Caminho da pasta
 */
function minifyFolder(folderPath) {
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error(`Erro ao ler a pasta ${folderPath}: ${err}`);
        } else {
            files.forEach((file) => {
                const filePath = path.join(folderPath, file);
                fs.stat(filePath, (error, stats) => {
                    if (error) {
                        console.error(`Erro ao checar o arquivo ${filePath}: ${error}`);
                    } else if (stats.isDirectory()) {
                        minifyFolder(filePath);
                    } else if (path.extname(filePath) === '.js') {
                        minifyFile(filePath);
                    }
                });
            });
        }
    });
}

/* Inicia o processo de minificação */
minifyFolder('./lib');
