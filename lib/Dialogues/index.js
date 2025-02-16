/* Requires */
const fs = require('fs');
const Indexer = require('../index');

/**
 * Função que seleciona o idioma e o diálogo a ser retornado.
 *
 * PARA RETRO-COMPATIBILIDADE APENAS, USE A FUNÇÃO DE SQL PARA NOVOS COMANDOS E FUNÇÕES!!!
 * @param {string} [regionPicker='pt'] - Idioma a ser selecionado.
 * @param {string} [folderPicker='Default'] - Pasta de diálogos.
 * @param {string} [dialogPicker='Default'] - Nome do diálogo a ser selecionado.
 * @param {boolean} [randomize=true] - Se os diálogos devem ser aleatorizados.
 * @param {boolean} [extractOnlyOne=true] - Se deve retornar apenas um diálogo.
 * @param {Object} [objectReplacer={}] - Substituições de chaves nos diálogos.
 * @returns {Array|string} - Um ou todos os diálogos do idioma selecionado.
 */
function dialoguePicker(
    regionPicker = 'pt',
    folderPicker = 'Default',
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
            const tempLanguages = JSON.parse(fs.readFileSync(`${__dirname}/Default/index.json`));

            /* Retorna todos os idiomas */
            return Object.keys(tempLanguages);
        }

        /* Define o idioma, mas antes verifica se é string */
        let userLang = (typeof regionPicker === 'string' ? regionPicker.toLowerCase() : 'pt');

        /* Redefine a object */
        const objRepl = objectReplacer;

        /* Redefine a type */
        const dnamer = dialogPicker;

        /* Redefine o arquivo */
        const dtype = folderPicker;

        /* Determina os diálogos da pasta */
        const dialFolder = fs.readdirSync(__dirname);

        /* Define o arquivo, mas antes verifica se é string */
        let dialType = (typeof dtype === 'string'

            /* Ajusta a primeira letra */
            ? Indexer('string').upperland(dtype.toLowerCase(), false).value

            /* Senão, padrão */
            : 'Default'
        );

        /* Define o diálogo final */
        let dialName = (typeof dnamer === 'string'

            /* Ajusta a primeira letra */
            ? Indexer('string').upperland(dnamer.toLowerCase(), false).value

            /* Senão, padrão */
            : 'Default'
        );

        /* Define o arquivo de idiomas */
        if (!dialFolder.includes(dialType)) {
            /* Ajusta um padrão */
            dialType = 'Default';

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
        return JSON.parse(fs.readFileSync(`${__dirname}/Default/index.json`)).pt.Default;
    }
}

/* Exporta o módulo */
module.exports = dialoguePicker;
