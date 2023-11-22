/*
    Essa função é um serviço de fallback
    Isso significa que qualquer função inexistente cairá aqui
    Fique a vontade para criar suas funções de fallback aqui
    Estarei inserindo funções pequenas ou básicas aqui
*/

/* Define o valor padrão da module.exports desse arquivo */
module.exports = {
    fallback: {},
};

/* Alternativa segura ao exports/module.exports pois evita sobrepor a global do arquivo */
const make = module.exports.fallback;

/* Função padrão de fallback */
make.fallback = () => 'Não foi encontrado nenhuma função com o nome especificado, olhe o arquivo "symlinks.json" para referências.';

/* Cria uma função que calcula fisica, matematíca, etc */
make.calculate = function calculate(value, type) {
    /* Define o que calcular e nome */
    const nameCalc = typeof type === 'string' ? type : 'defaults';
    const valueCalc = typeof value === 'string' || typeof value === 'number' ? value : 0;

    /* valueCalcor padrão */
    let finalResponse = valueCalc;

    /* Define as formulas de cálculo */
    const calcs = {
        cf: {
            first: 'C° - Celsius',
            second: 'F° - Fahrenheit',
            response: ((valueCalc / 5) * 9) + 32,
            method: '(C / 5 * 9) + 32',
        },
        fc: {
            first: 'F° - Fahrenheit',
            second: 'C° - Celsius',
            response: (5 * (valueCalc - 32)) / 9,
            method: '5 * (F - 32) / 9',
        },
        ck: {
            first: 'C° - Celsius',
            second: 'K° - Kelvin',
            response: valueCalc + 273.15,
            method: 'C + 273.15',
        },
        kc: {
            first: 'K° - Kelvin',
            second: 'C° - Celsius',
            response: valueCalc - 273.15,
            method: 'K - 273.15',
        },
        rc: {
            first: 'R° - Rankine',
            second: 'C° - Celsius',
            response: ((valueCalc - 491.67) * 5) / 9,
            method: '(R − 491.67) * 5 / 9',
        },
        cr: {
            first: 'C° - Celsius',
            second: 'R° - Rankine',
            response: (valueCalc * 9) / 5 + 491.67,
            method: 'C * 9 / 5 + 491.67',
        },
        rf: {
            first: 'R° - Rankine',
            second: 'F° - Fahrenheit',
            response: valueCalc - 459.67,
            method: 'R - 459.67',
        },
        fr: {
            first: 'F° - Fahrenheit',
            second: 'R° - Rankine',
            response: valueCalc + 459.67,
            method: 'F + 459.67',
        },
        fk: {
            first: 'F° - Fahrenheit',
            second: 'K° - Kelvin',
            response: ((valueCalc - 32) * 5) / 9 + 273.15,
            method: '(F − 32) * 5/9 + 273.15',
        },
        kf: {
            first: 'K° - Kelvin',
            second: 'F° - Fahrenheit',
            response: ((valueCalc - 273.15) * 9) / 5 + 32,
            method: '(K - 273.15) * 9 / 5 + 32',
        },
        km: {
            first: 'KM - Quilômetros',
            second: 'MI - Milhas',
            response: valueCalc * 0.621371,
            method: 'KM * 0.621371',
        },
        mk: {
            first: 'MI - Milhas',
            second: 'KM - Quilômetros',
            response: valueCalc / 0.621371,
            method: 'MI / 0.621371',
        },
        tg: {
            first: 'T - Tonelada',
            second: 'G - Gramas',
            response: valueCalc * 1e6,
            method: 'T * 1000000',
        },
        gk: {
            first: 'G - Gramas',
            second: 'KG - Quilograma',
            response: valueCalc / 1000,
            method: 'G / 1000',
        },
        kg: {
            first: 'KG - Quilograma',
            second: 'G - Gramas',
            response: valueCalc * 1000,
            method: 'KG * 1000',
        },
        kgg: {
            first: 'KG - Quilograma',
            second: 'G - Gramas',
            response: valueCalc * 1000,
            method: 'KG * 1000',
        },
        tnm: {
            first: 'TN - Tonelada',
            second: 'NM - Microgramas',
            response: valueCalc * 1e12,
            method: 'TN * 1e12',
        },
        lbskg: {
            first: 'LBS - Libras',
            second: 'KG - Quilograma',
            response: valueCalc / 2.20462,
            method: 'LBS / 2.20462',
        },
        kjcal: {
            first: 'KJ - Quilojoules',
            second: 'CAL - Calorias',
            response: valueCalc / 0.239006,
            method: 'KJ / 0.239006',
        },
        calj: {
            first: 'CAL - Calorias',
            second: 'KJ - Quilojoules',
            response: valueCalc * 0.239006,
            method: 'CAL * 0.239006',
        },
        msµs: {
            first: 'MS - Milissegundos',
            second: 'µS - Microssegundos',
            response: valueCalc * 1000,
            method: 'MS * 1000',
        },
        µsms: {
            first: 'µS - Microssegundos',
            second: 'MS - Milissegundos',
            response: valueCalc / 1000,
            method: 'µS / 1000',
        },
        kmhms: {
            first: 'KM/H - Quilômetros por hora',
            second: 'MS - Milissegundos',
            response: valueCalc / 0.000277778,
            method: 'KM/H / 0.000277778',
        },
        mskmh: {
            first: 'MS - Milissegundos',
            second: 'KM/H - Quilômetros por hora',
            response: valueCalc * 0.000277778,
            method: 'MS * 0.000277778',
        },
        gt: {
            first: 'G - Gramas',
            second: 'T - Toneladas',
            response: valueCalc / 1e6,
            method: 'G / 1000000',
        },
        kgt: {
            first: 'KG - Quilograma',
            second: 'T - Toneladas',
            response: valueCalc / 1e3,
            method: 'KG / 1000',
        },
        gmg: {
            first: 'G - Gramas',
            second: 'MG - Miligrama',
            response: valueCalc * 1e3,
            method: 'G / 1000',
        },
        tmg: {
            first: 'T - Tonelada',
            second: 'MG - Miligrama',
            response: valueCalc * 1e9,
            method: 'T * 1000000000',
        },
        tkg: {
            first: 'T - Tonelada',
            second: 'KG - Quilograma',
            response: valueCalc * 1e3,
            method: 'T * 1000',
        },
        mgt: {
            first: 'MG - Miligrama',
            second: 'T - Tonelada',
            response: valueCalc / 1e9,
            method: 'MG / 1000000000',
        },
        kgmg: {
            first: 'KG - Quilograma',
            second: 'MG - Miligrama',
            response: valueCalc * 1e6,
            method: 'KG * 1000000',
        },
        mgg: {
            first: 'MG - Miligrama',
            second: 'G - Grama',
            response: valueCalc / 1000,
            method: 'MG / 1000',
        },
        mgkg: {
            first: 'MG - Miligrama',
            second: 'KG - Quilograma',
            response: valueCalc / 1e6,
            method: 'MG / 1000000',
        },
        msns: {
            first: 'MS - Milissegundos',
            second: 'NS - Nanosegundos',
            response: valueCalc * 1e6,
            method: 'MS * 1000000',
        },
        msms: {
            first: 'MS - Milissegundos',
            second: 'MS - Milissegundos',
            response: valueCalc * 1,
            method: 'MS * 1',
        },
        mss: {
            first: 'MS - Milissegundos',
            second: 'S - Segundos',
            response: valueCalc * 1000,
            method: 'MS * 1000',
        },
        msm: {
            first: 'MS - Milissegundos',
            second: 'M - Minutos',
            response: valueCalc * 60000,
            method: 'MS * 60000',
        },
        msh: {
            first: 'MS - Milissegundos',
            second: 'H - Horas',
            response: valueCalc * 3600000,
            method: 'MS * 3600000',
        },
        msd: {
            first: 'MS - Milissegundos',
            second: 'D - Dias',
            response: valueCalc * 86400000,
            method: 'MS * 86400000',
        },
        msds: {
            first: 'MS - Milissegundos',
            second: 'DS - Dias de semana',
            response: valueCalc * 604800000,
            method: 'MS * 604800000',
        },
        msq: {
            first: 'MS - Milissegundos',
            second: 'Q - Quinzenas',
            response: valueCalc * 1209600000,
            method: 'MS * 1209600000',
        },
        msmo: {
            first: 'MS - Milissegundos',
            second: 'MO - Mês',
            response: valueCalc * 2628002880,
            method: 'MS * 2628002880',
        },
        msa: {
            first: 'MS - Milissegundos',
            second: 'A - Anos',
            response: valueCalc * 31536000000,
            method: 'MS * 31536000000',
        },
        msdc: {
            first: 'MS - Milissegundos',
            second: 'DC - Décadas',
            response: valueCalc * 315360000000,
            method: 'MS * 315360000000',
        },
        mssc: {
            first: 'MS - Milissegundos',
            second: 'SC - Seculos',
            response: valueCalc * 3153600000000,
            method: 'MS * 3153600000000',
        },
        msml: {
            first: 'MS - Milissegundos',
            second: 'ML - Milênios',
            response: valueCalc * 31536000000000,
            method: 'MS * 31536000000000',
        },
        mshk: {
            first: 'MS - Milissegundos',
            second: 'HK - Halakim',
            response: valueCalc * 3333.3333333333,
            method: 'MS * 3333.3333333333',
        },
        kml: {
            first: 'KM - Quilômetros',
            second: 'ML - Milhas',
            response: valueCalc / 1.609344,
            method: 'KM / 1.609344',
        },
        mlk: {
            first: 'ML - Milhas',
            second: 'KM - Quilômetros',
            response: valueCalc * 1.609344,
            method: 'ML * 1.609344',
        },
        mshms: {
            first: 'MS - Milissegundos',
            second: 'HS - Centésimos de segundo',
            response: valueCalc * 100,
            method: 'MS * 100',
        },
        hsm: {
            first: 'HS - Centésimos de segundo',
            second: 'MS - Milissegundos',
            response: valueCalc / 100,
            method: 'HS / 100',
        },
        cms: {
            first: 'CM - Centímetros',
            second: 'S - Segundos',
            response: valueCalc / 100,
            method: 'CM / 100',
        },
        scm: {
            first: 'S - Segundos',
            second: 'CM - Centímetros',
            response: valueCalc * 100,
            method: 'S * 100',
        },
        mscl: {
            first: 'MS - Milissegundos',
            second: 'CL - Ciclos Lunares',
            response: valueCalc * 2551442000,
            method: 'MS * 2551442000',
        },
        msqq: {
            first: 'MS - Milissegundos',
            second: 'QQ - Quinquênios',
            response: valueCalc * 157680000000,
            method: 'MS * 157680000000',
        },
        msdes: {
            first: 'MS - Milissegundos',
            second: 'DES - Dias de Espaço Sideral',
            response: valueCalc * 86164100,
            method: 'MS * 86164100',
        },
        msaes: {
            first: 'MS - Milissegundos',
            second: 'AED - Anos de Espaço Sideral',
            response: valueCalc * 31558149500,
            method: 'MS * 31558149500',
        },
        unk: {
            first: 'UN - Unidade',
            second: 'K - Milhar',
            response: valueCalc * 1000,
            method: 'UN * 1000',
        },
        unm: {
            first: 'UN - Unidade',
            second: 'M - Milhão',
            response: valueCalc * 1000000,
            method: 'UN * 1000000',
        },
        unb: {
            first: 'UN - Unidade',
            second: 'B - Bilhão',
            response: valueCalc * 1000000000,
            method: 'UN * 1000000000',
        },
        unst: {
            first: 'UN - Unidade',
            second: 'T - Trilhão',
            response: valueCalc * 1000000000000,
            method: 'UN * 1000000000000',
        },
        unsq: {
            first: 'UN - Unidade',
            second: 'Q - Quadrilhão',
            response: valueCalc * 1000000000000000,
            method: 'UN * 1000000000000000',
        },
        defaults: {
            first: 'UN - Unidade',
            second: 'UN - Unidade',
            response: valueCalc * 1,
            method: 'UN * 1',
        },
    };

    /* Formata os números para não virar uma trava */
    Object.keys(calcs).forEach((f) => {
        /* Limite de 10 números decimais */
        calcs[f].response = Number(calcs[f].response).toFixed(10);
    });

    /* Define qual deve retornar com no máximo 8 de limite */
    finalResponse = nameCalc === 'all' ? calcs : (calcs[nameCalc] || calcs.defaults);

    /* Retorna tudo */
    return finalResponse;
};
