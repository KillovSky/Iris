/* Parâmetros da descrição */
const envInfo = {
    arguments: {
        type: 'Tipo de conversão a realizar.',
        val: 'Valor para converter.',
    },
    command: 'Metrics',
    description: 'Converte o valor de algo em outro com matemática.',
    example: 'None',
    explain: {
        Response: 'Resultado das contas.',
    },
    exports: {
        Ambient: 'Retorna as variáveis do sistema de conversão.',
        Calculate: 'Faz as contas matemáticas necessárias.',
    },
    files: {
        'index.js': 'Sistema de conversão.',
    },
    functions: {},
    madeBy: 'KillovSky',
    parameters: {
        Response: false,
    },
    requires: {},
    usage: "[USO RESTRITO] - Utilizável somente pelo comando 'EXEC'.",
};

/* Retorna todas as funções desse arquivo, tirando JSON's e funções multilocais */
exports.Ambient = () => envInfo;

exports.Calculate = (type, val) => {
    if (type === 'cf') {
        envInfo.parameters.Response = {
            First: 'C° - Celsius',
            Second: 'F° - Fahrenheit',
            Result: (((val / 5) * 9) + 32).toFixed(3),
            Form: '(C / 5 * 9) + 32',
        };
    } else if (type === 'fc') {
        envInfo.parameters.Response = {
            First: 'F° - Fahrenheit',
            Second: 'C° - Celsius',
            Result: ((5 * (val - 32)) / 9).toFixed(3),
            Form: '5 * (F - 32) / 9',
        };
    } else if (type === 'ck') {
        envInfo.parameters.Response = {
            First: 'C° - Celsius',
            Second: 'K° - Kelvin',
            Result: val + 273.15,
            Form: 'C + 273,15',
        };
    } else if (type === 'kc') {
        envInfo.parameters.Response = {
            First: 'K° - Kelvin',
            Second: 'C° - Celsius',
            Result: val - 273.15,
            Form: 'K - 273,15',
        };
    } else if (type === 'rc') {
        envInfo.parameters.Response = {
            First: 'R° - Rankine',
            Second: 'C° - Celsius',
            Result: (((val - 491.67) * 5) / 9).toFixed(3),
            Form: '(R − 491,67) * 5 / 9',
        };
    } else if (type === 'cr') {
        envInfo.parameters.Response = {
            First: 'C° - Celsius',
            Second: 'R° - Rankine',
            Result: ((val * 9) / 5 + 491.67).toFixed(2),
            Form: 'C * 9 / 5 + 491,67',
        };
    } else if (type === 'rf') {
        envInfo.parameters.Response = {
            First: 'R° - Rankine',
            Second: 'F° - Fahrenheit',
            Result: val - 459.67,
            Form: 'R - 459,67',
        };
    } else if (type === 'fr') {
        envInfo.parameters.Response = {
            First: 'F° - Fahrenheit',
            Second: 'R° - Rankine',
            Result: val + 459.67,
            Form: 'F + 459,67',
        };
    } else if (type === 'fk') {
        envInfo.parameters.Response = {
            First: 'F° - Fahrenheit',
            Second: 'K° - Kelvin',
            Result: (((val - 32) * 5) / 9 + 273.15).toFixed(3),
            Form: '(F − 32) * 5/9 + 273,15',
        };
    } else if (type === 'kf') {
        envInfo.parameters.Response = {
            First: 'K° - Kelvin',
            Second: 'F° - Fahrenheit',
            Result: (((val - 273.15) * 9) / 5 + 32).toFixed(3),
            Form: '(K - 273,15) * 9 / 5 + 32',
        };
    } else if (type === 'km') {
        envInfo.parameters.Response = {
            First: 'KM - Quilômetros',
            Second: 'MI - Milhas',
            Result: val * 0.621379,
            Form: 'KM * 0.621379',
        };
    } else if (type === 'mk') {
        envInfo.parameters.Response = {
            First: 'MI - Milhas',
            Second: 'KM - Quilômetros',
            Result: val / 0.62137,
            Form: 'MI / 0.62137',
        };
    } else if (type === 'tg') {
        envInfo.parameters.Response = {
            First: 'T - Tonelada',
            Second: 'G - Gramas',
            Result: val * 1000000,
            Form: 'T * 1000000',
        };
    } else if (type === 'gk') {
        envInfo.parameters.Response = {
            First: 'G - Gramas',
            Second: 'KG - Quilograma',
            Result: val / 1000,
            Form: 'G / 1000',
        };
    } else if (type === 'kg') {
        envInfo.parameters.Response = {
            First: 'KG - Quilograma',
            Second: 'G - Gramas',
            Result: val * 1000,
            Form: 'KG * 1000',
        };
    } else if (type === 'gt') {
        envInfo.parameters.Response = {
            First: 'G - Gramas',
            Second: 'T - Toneladas',
            Result: val / 1e+6,
            Form: 'G / 1000000',
        };
    } else if (type === 'kgt') {
        envInfo.parameters.Response = {
            First: 'KG - Quilograma',
            Second: 'T - Toneladas',
            Result: val / 1000,
            Form: 'KG / 1000',
        };
    } else if (type === 'gmg') {
        envInfo.parameters.Response = {
            First: 'G - Gramas',
            Second: 'MG - Miligrama',
            Result: val / 1000,
            Form: 'G / 1000',
        };
    } else if (type === 'tmg') {
        envInfo.parameters.Response = {
            First: 'T - Tonelada',
            Second: 'MG - Miligrama',
            Result: val * 1e+9,
            Form: 'T * 1000000000',
        };
    } else if (type === 'tkg') {
        envInfo.parameters.Response = {
            First: 'T - Tonelada',
            Second: 'KG - Quilograma',
            Result: val * 1000,
            Form: 'T * 1000',
        };
    } else if (type === 'mgt') {
        envInfo.parameters.Response = {
            First: 'MG - Miligrama',
            Second: 'T - Tonelada',
            Result: val / 1e9,
            Form: 'MG / 1000000000',
        };
    } else if (type === 'kgmg') {
        envInfo.parameters.Response = {
            First: 'KG - Quilograma',
            Second: 'MG - Miligrama',
            Result: val * 1e6,
            Form: 'KG * 1000000',
        };
    } else if (type === 'mgg') {
        envInfo.parameters.Response = {
            First: 'MG - Miligrama',
            Second: 'G - Grama',
            Result: val / 1000,
            Form: 'MG / 1000',
        };
    } else if (type === 'mgkg') {
        envInfo.parameters.Response = {
            First: 'MG - Miligrama',
            Second: 'KG - Quilograma',
            Result: val / 1000000,
            Form: 'MG / 1000000',
        };
    } else if (type === 'msns') {
        envInfo.parameters.Response = {
            First: 'MS - Milissegundos',
            Second: 'NS - Nanosegundos',
            Result: val * 1000000,
            Form: 'MS * 1000000',
        };
    } else if (type === 'msms') {
        envInfo.parameters.Response = {
            First: 'MS - Milissegundos',
            Second: 'MS - Milissegundos',
            Result: val * 1,
            Form: 'MS * 1',
        };
    } else if (type === 'mss') {
        envInfo.parameters.Response = {
            First: 'MS - Milissegundos',
            Second: 'S - Segundos',
            Result: val * 1000,
            Form: 'MS * 1000',
        };
    } else if (type === 'msm') {
        envInfo.parameters.Response = {
            First: 'MS - Milissegundos',
            Second: 'M - Minutos',
            Result: val * 60000,
            Form: 'MS * 60000',
        };
    } else if (type === 'msh') {
        envInfo.parameters.Response = {
            First: 'MS - Milissegundos',
            Second: 'H - Horas',
            Result: val * 3600000,
            Form: 'MS * 3600000',
        };
    } else if (type === 'msd') {
        envInfo.parameters.Response = {
            First: 'MS - Milissegundos',
            Second: 'D - Dias',
            Result: val * 86400000,
            Form: 'MS * 86400000',
        };
    } else if (type === 'msds') {
        envInfo.parameters.Response = {
            First: 'MS - Milissegundos',
            Second: 'DS - Dias de semana',
            Result: val * 604800000,
            Form: 'MS * 604800000',
        };
    } else if (type === 'msq') {
        envInfo.parameters.Response = {
            First: 'MS - Milissegundos',
            Second: 'Q - Quinzenas',
            Result: val * 1209600000,
            Form: 'MS * 1209600000',
        };
    } else if (type === 'msmo') {
        envInfo.parameters.Response = {
            First: 'MS - Milissegundos',
            Second: 'MO - Mês',
            Result: val * 2628002880,
            Form: 'MS * 2628002880',
        };
    } else if (type === 'msa') {
        envInfo.parameters.Response = {
            First: 'MS - Milissegundos',
            Second: 'A - Anos',
            Result: val * 31536000000,
            Form: 'MS * 31536000000',
        };
    } else if (type === 'msdc') {
        envInfo.parameters.Response = {
            First: 'MS - Milissegundos',
            Second: 'DC - Décadas',
            Result: val * 315360000000,
            Form: 'MS * 315360000000',
        };
    } else if (type === 'mssc') {
        envInfo.parameters.Response = {
            First: 'MS - Milissegundos',
            Second: 'SC - Seculos',
            Result: val * 3153600000000,
            Form: 'MS * 3153600000000',
        };
    } else if (type === 'msml') {
        envInfo.parameters.Response = {
            First: 'MS - Milissegundos',
            Second: 'ML - Milênios',
            Result: val * 31536000000000,
            Form: 'MS * 31536000000000',
        };
    } else if (type === 'mshk') {
        envInfo.parameters.Response = {
            First: 'MS - Milissegundos',
            Second: 'HK - Halakim',
            Result: val * 3333.3333333333,
            Form: 'MS * 3333.3333333333',
        };
    } else if (type === 'mscl') {
        envInfo.parameters.Response = {
            First: 'MS - Milissegundos',
            Second: 'CL - Ciclos Lunares',
            Result: val * 2551442000,
            Form: 'MS * 2551442000',
        };
    } else if (type === 'msqq') {
        envInfo.parameters.Response = {
            First: 'MS - Milissegundos',
            Second: 'QQ - Quinquênios',
            Result: val * 157680000000,
            Form: 'MS * 157680000000',
        };
    } else if (type === 'msdes') {
        envInfo.parameters.Response = {
            First: 'MS - Milissegundos',
            Second: 'DES - Dias de Espaço Sideral',
            Result: val * 86164100,
            Form: 'MS * 86164100',
        };
    } else if (type === 'msaes') {
        envInfo.parameters.Response = {
            First: 'MS - Milissegundos',
            Second: 'AED - Anos de Espaço Sideral',
            Result: val * 31558149500,
            Form: 'MS * 31558149500',
        };
    } else if (type === 'unk') {
        envInfo.parameters.Response = {
            First: 'UN - Unidade',
            Second: 'K - Milhar',
            Result: val * 1000,
            Form: 'UN * 1000',
        };
    } else if (type === 'unm') {
        envInfo.parameters.Response = {
            First: 'UN - Unidade',
            Second: 'M - Milhão',
            Result: val * 1000000,
            Form: 'UN * 1000000',
        };
    } else if (type === 'unb') {
        envInfo.parameters.Response = {
            First: 'UN - Unidade',
            Second: 'B - Bilhão',
            Result: val * 1000000000,
            Form: 'UN * 1000000000',
        };
    } else if (type === 'unst') {
        envInfo.parameters.Response = {
            First: 'UN - Unidade',
            Second: 'T - Trilhão',
            Result: val * 1000000000000,
            Form: 'UN * 1000000000000',
        };
    } else if (type === 'unsq') {
        envInfo.parameters.Response = {
            First: 'UN - Unidade',
            Second: 'Q - Quadrilhão',
            Result: val * 1000000000000000,
            Form: 'UN * 1000000000000000',
        };
    } else {
        envInfo.parameters.Response = {
            First: 'UN - Unidade',
            Second: 'UN - Unidade',
            Result: val * 1,
            Form: 'UN * 1',
        };
    }

    /* Retorna tudo */
    return envInfo.parameters.Response;
};
