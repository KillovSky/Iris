/* Requires */
const process = require('process');
const fs = require('fs').promises;

/* Função de espera */
const sleep = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

/* Função de formatação */
const formatJSON = async () => {
    /* Argumentos da linha de comando */
    const args = process.argv.slice(2);

    /* Try-catch para tratamento de erro */
    try {
        /* JSON's atuais e antigos */
        const firstJSON = JSON.parse(await fs.readFile(args[0], 'utf8'));
        const secJSON = JSON.parse(await fs.readFile(args[1], 'utf8'));
        const newJSON = {};
        const keys = Object.keys(firstJSON);
        let timeCount = 0;
        let downCount = keys.length;

        /* Função recursiva assíncrona para formatação do JSON */
        const formatKeys = async (index) => {
            /* Se o índice ainda estiver dentro do limite de keys */
            if (index < keys.length) {
                /* Define os parâmetros */
                const vars = keys[index];
                timeCount += 1;
                downCount -= 1;

                /* Se a key existir no novo arquivo JSON */
                if (Object.keys(secJSON).includes(vars)) {
                    /* Atualiza a key */
                    newJSON[vars] = firstJSON[vars] || secJSON[vars];
                }

                /* Define o count da barra de progresso */
                const valueCem = ((timeCount / keys.length) * 100).toFixed(0);

                /* Atualiza a barra de progresso sem quebrar a linha usando console.log */
                process.stdout.write(`\r[${'#'.repeat(timeCount / 3)}${'@'.repeat(downCount / 3)}] | ${valueCem}% de 100% | [${timeCount} / ${keys.length}] | "${vars}"`);

                /* Aguarda 300ms e limpa o console */
                await sleep(300);
                console.clear();

                /* Chamada recursiva para o próximo índice */
                await formatKeys(index + 1);
            }
        };

        /* Inicia a formatação a partir do índice 0 */
        await formatKeys(0);

        /* Escreve na tela a barra de progresso final e mensagens */
        console.log(`\r[${args[1]}] | 100% de 100% | [${keys.length} / ${keys.length}]`);

        /* Aplica o JSON */
        await fs.writeFile(args[1], JSON.stringify(newJSON, null, '\t'));
    } catch (error) {
        /* Printa o erro, caso ocorra */
        console.error(`Ocorreu um erro: ${error.message}`);
    }
};

/* Inicia */
formatJSON();
