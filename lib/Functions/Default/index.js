/*
    Essa função é um serviço de fallback
    Isso significa que qualquer função inexistente cairá aqui
    Fique a vontade para criar suas funções de fallback aqui
*/

/* Define o valor padrão da module.exports desse arquivo */
module.exports = {
    fallback: {},
};

/* Alternativa segura ao exports/module.exports pois evita sobrepor a global do arquivo */
const make = module.exports.fallback;

/* Função padrão de fallback */
make.fallback = () => 'Não foi encontrado nenhuma função com o nome especificado, olhe o arquivo "Locale.json" para referência.';
