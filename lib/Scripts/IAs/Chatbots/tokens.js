/* eslint-disable max-len */

/* Importa os módulos para obter informações sobre o sistema operacional */
const os = require('os');
const si = require('systeminformation');
const { exec } = require('child_process');

/**
 * Verifica se a GPU possui suporte para CUDA.
 *
 * @returns {Promise<boolean>} Retorna uma Promise que resolve para um booleano indicando se a CUDA está disponível.
 */
const hasCUDA = async () => new Promise((resolve) => {
    exec('nvidia-smi', (error, stdout) => {
        resolve(!error && stdout.includes('CUDA Version'));
    });
});

/**
 * Calcula o valor ideal de nCtx com base nas características do sistema.
 *
 * @returns {Promise<number>} Retorna uma Promise que resolve para o valor ideal de nCtx.
 */
const calculateIdealNctx = async () => {
    /* Try para caso dê algum erro */
    try {
        /* Obtém as informações do CPU */
        const cpus = os.cpus();
        const cpuSpeed = cpus[0].speed || 0;
        const cpuCores = cpus.length || 0;
        const totalMemory = os.totalmem() || 0;

        /* Define os dados da GPU padrão */
        let gpuMemory = 0;
        let gpuCount = 0;

        /* Obtém as informações da GPU */
        try {
            /* Obtém as GPUs */
            const graphics = await si.graphics();

            /* Memoria */
            gpuMemory = graphics.controllers.reduce((acc, controller) => acc + (controller.vram || 0), 0);

            /* Quantidade de GPUs */
            gpuCount = graphics.controllers.length;

            /* Se falhar continua com os dados padrões */
        } catch (err) { /* Faz nada */ }

        /* Verifica se CUDA está disponível */
        const cudaAvailable = await hasCUDA();

        /* Define o valor base, mínimo e máximo de tokens */
        const baseNctx = 712;

        /* Inicializa nCtx com o valor base */
        let nCtx = baseNctx;

        /* Ajusta nCtx com base no número de núcleos do CPU */
        if (cpuCores >= 64) nCtx += 12288;
        else if (cpuCores >= 32) nCtx += 8192;
        else if (cpuCores >= 16) nCtx += 4096;
        else if (cpuCores >= 8) nCtx += 2048;
        else if (cpuCores >= 4) nCtx += 1024;
        else nCtx -= 1024;

        /* Ajusta nCtx com base na quantidade de memória total */
        if (totalMemory >= 256 * 1024 * 1024 * 1024) nCtx += 12288;
        else if (totalMemory >= 128 * 1024 * 1024 * 1024) nCtx += 8192;
        else if (totalMemory >= 64 * 1024 * 1024 * 1024) nCtx += 6144;
        else if (totalMemory >= 32 * 1024 * 1024 * 1024) nCtx += 4096;
        else if (totalMemory >= 16 * 1024 * 1024 * 1024) nCtx += 1024;
        else if (totalMemory >= 8 * 1024 * 1024 * 1024) nCtx += 512;
        else nCtx -= 1024;

        /* Ajusta nCtx com base na memória da GPU */
        if (gpuMemory >= 40 * 1024) nCtx += 12288;
        else if (gpuMemory >= 20 * 1024) nCtx += 8192;
        else if (gpuMemory >= 8 * 1024) nCtx += 2048;
        else if (gpuMemory >= 4 * 1024) nCtx += 1024;
        else nCtx -= 512;

        /* Ajusta nCtx se CUDA estiver disponível */
        nCtx += cudaAvailable ? 2048 : -1024;

        /* Ajusta nCtx com base na quantidade de GPUs */
        if (gpuCount >= 8) nCtx += 12288;
        else if (gpuCount >= 4) nCtx += 8192;
        else if (gpuCount >= 2) nCtx += 2048;
        else if (gpuCount >= 1 && gpuMemory >= 8 * 1024) nCtx += 1024;
        else if (gpuCount >= 1 && gpuMemory >= 4 * 1024) nCtx += 512;
        else nCtx -= 512;

        /* Define o valor máximo dinâmico com calculos totalmente aleatorios */
        const maxToken = Math.round((nCtx + ((cpuSpeed * cpuCores * 0.05) + ((gpuMemory / 1024) * gpuCount * 10) + ((totalMemory / (1024 * 1024 * 1024)) * 2))) / 4);

        /* Divide por 3 para tentar alcançar 4000 tokens */
        return Math.round(maxToken);

        /* Em caso de erro */
    } catch (error) {
        /* Retorna um valor padrão */
        return 100;
    }
};

/* Exporta o módulo de cálculo */
exports.setMaxTokens = calculateIdealNctx;
