/* Requires */
const Indexer = require('../index');

/* Função que seleciona o idioma */
function dialoguePicker(
    regionPicker = 'pt',
    folderPicker = 'Backups',
    dialogPicker = 'Default',
    randomize = true,
    extractOnlyOne = true,
    objectReplacer = {},
) {
    /* Executa o uso direto da função correspondente */
    const dialogueGet = Indexer('sql').languages(regionPicker, folderPicker, dialogPicker, randomize, extractOnlyOne, objectReplacer);

    /* Retorna os resultados */
    return dialogueGet;
}

/* Exporta o módulo */
module.exports = dialoguePicker;
