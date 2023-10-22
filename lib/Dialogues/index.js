/* Requires */
const fs = require('fs');
const path = require('path');
const Indexer = require('../index');

/* Função que seleciona o idioma, no momento, bloqueado em PT-BR */
function dialoguePicker(
    regionPicker = 'pt',
    folderPicker = 'Backups',
    dialogPicker = 'Default',
    randomize = true,
    extractOnlyOne = true,
    objectReplacer = {},
) {
    /* Try-Catch para casos de erro */
    try {
        /* Define se é pra retornar todos os idiomas */
        if (regionPicker === 'G.A.L') {
            /* Define o dialogo raiz */
            const tempLanguages = JSON.parse(fs.readFileSync(`${__dirname}/Errors/index.json`));

            /* Retorna todos os idiomas */
            return Object.keys(tempLanguages);
        }

        /* Define o idioma, mas antes verifica se é string */
        let userLang = (typeof regionPicker === 'string' ? regionPicker.toLowerCase() : 'pt');

        /* Redefine a object */
        const objRepl = objectReplacer;

        /* Redefine a type */
        let dnamer = dialogPicker;

        /* Redefine o arquivo */
        let dtype = folderPicker;

        /* Se for o report de erros especial [Special Error Report] */
        if (dialogPicker instanceof Error && dtype === 'S.E.R') {
            /* Define o dialogo raiz */
            const tempDataE = JSON.parse(fs.readFileSync(`${__dirname}/Errors/index.json`));

            /* Formata o local e demais informações */
            const stderr = dnamer.stack ? dnamer.stack.match(/\(.*\)/gi)[0].replace(/\(|\)/gi, '').split(/:/gi) : ['Disk', './', 'Unknown', 'Unknown'];
            stderr[0] = stderr[0] || 'Disk';
            stderr[1] = stderr[1] || './';
            stderr[2] = stderr[2] || 'Unknown';
            stderr[3] = stderr[3] || 'Unknown';

            /* Local */
            objRepl.path = path.dirname(path.resolve(stderr[1] || './')).replace(irisPath, '').replace('\\', '');

            /* Arquivo */
            objRepl.file = path.basename(stderr[1]);

            /* Se é na Íris */
            objRepl.isMe = (stderr[0].includes('node') ? '❌' : '✔️');

            /* Linha do arquivo */
            [objRepl.line] = [stderr[2]];

            /* Caractere */
            [objRepl.character] = [stderr[3]];

            /* Mensagem de erro */
            objRepl.fullbo = dnamer.message;

            /* Nome do erro */
            objRepl.typeerror = dnamer.name;

            /* Determina o tipo | RangeError */
            if (dnamer.name === 'RangeError') {
                /* RangeError | Númerico */
                objRepl.suggestion = (Indexer('array').extract(tempDataE[userLang].RangeFix).value);

                /* ReferenceError */
            } else if (dnamer.name === 'ReferenceError') {
                /* Falta código */
                objRepl.suggestion = (Indexer('array').extract(tempDataE[userLang].ReferenceFix).value).replace('{lostvar}', dnamer.message.slice(0, -15));

                /* SyntaxError */
            } else if (dnamer.name === 'SyntaxError') {
                /* Código mal feito */
                objRepl.suggestion = (Indexer('array').extract(tempDataE[userLang].SyntaxFix).value);

                /* Qualquer outro [Existe?] */
            } else {
                /* Diz desconhecido */
                objRepl.suggestion = (Indexer('array').extract(tempDataE[userLang].OtherFix).value);
            }

            /* Ajusta os valores pra pegar a mensagem correta */
            dnamer = 'Fail';
            dtype = 'Errors';
        }

        /* Determina os diálogos da pasta */
        const dialFolder = fs.readdirSync(__dirname);

        /* Define o arquivo, mas antes verifica se é string */
        let dialType = (typeof dtype === 'string'

            /* Ajusta a primeira letra */
            ? Indexer('string').upperland(dtype.toLowerCase(), false)

            /* Senão, padrão */
            : 'Backups'
        );

        /* Define o diálogo final */
        let dialName = (typeof dnamer === 'string'

            /* Ajusta a primeira letra */
            ? Indexer('string').upperland(dnamer.toLowerCase(), false)

            /* Senão, padrão */
            : 'Default'
        );

        /* Define o arquivo de idiomas */
        if (!dialFolder.includes(dialType)) {
            /* Ajusta um padrão */
            dialType = 'Backups';

            /* Verifica se a pasta direta existe */
            if (dialFolder.includes(dtype)) {
                /* Ajusta o nome original */
                dialType = dtype;
            }
        }

        /* Define temporariamente os diálogos padrões */
        let allDial = JSON.parse(fs.readFileSync(`${__dirname}/${dialType}/index.json`));

        /* Define os idiomas */
        let allKeys = Object.keys(allDial);

        /* Define se deve ajustar os diálogos de novo */
        if (!allKeys.includes(userLang)) {
            /* Define o padrão */
            userLang = 'pt';
        }

        /* Reajusta os diálogos padrões */
        allDial = allDial[userLang];

        /* Define as keys */
        allKeys = Object.keys(allDial);

        /* Define se deve ajustar os diálogos de novo */
        if (!allKeys.includes(dialName)) {
            /* Verifica se a key direta existe */
            if (allKeys.includes(dnamer)) {
                /* Ajusta o nome original */
                dialName = dnamer;

                /* Se não */
            } else {
                /* Define o padrão */
                allDial = (JSON.parse(fs.readFileSync(`${__dirname}/Default/index.json`)));

                /* Reajusta com o idioma padrão novamente */
                allDial = allDial[userLang];

                /* Define o dialogo padrão */
                dialName = 'Default';
            }
        }

        /* Ajusta os diálogos padrões finais */
        allDial = allDial[dialName];

        /* Define se deve aleatorizar */
        if (randomize === true) {
            /* Define eles aleatoriamente */
            allDial = Indexer('array').sort(allDial).value;
        }

        /* Define se deve retornar somente um */
        if (extractOnlyOne === true) {
            /* Retorna o primeiro, use aleatorização para dinamismo */
            return allDial[0].replace(/\{([^}]*)\}/gi, (match, key) => Indexer('others').repl(objRepl, match, key));
        }

        /* Se não retorna apenas um, retorna todos */
        return allDial;

        /* Caso der erro */
    } catch (error) {
        /* Avisa que deu erro e usa a PTBR que é estável */
        console.log('Algum erro ocorreu nos idiomas →', error);

        /* Retorna o padrão */
        return JSON.parse(fs.readFileSync(`${__dirname}/Backups/index.json`)).pt.Default;
    }
}

/* Exporta o módulo */
module.exports = dialoguePicker;
