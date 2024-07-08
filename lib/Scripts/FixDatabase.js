/* Funções */
const Indexer = require('../index');

/* Executa os códigos de correção */
Indexer('sql').fixdb({
    oldDb: 'users.db',
    dbNames: ['groups', 'bank', 'leveling', 'personal'],
    first: false,
    second: false,
    third: false,
    fourth: false,
    fifth: false,
});

/* Retorna resultados e printa na tela */
console.log('Aguarde (WAIT) o encerramento da função...');
