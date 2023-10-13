/* eslint-disable max-len */

/* Requires: Importa módulos necessários para o script */
const fs = require('fs'); // Módulo para manipulação de arquivos
const os = require('os'); // Módulo para interação com o sistema operacional
const path = require('path'); // Módulo para manipulação de caminhos de arquivos
const Indexer = require('../../index'); // Importa um módulo personalizado chamado 'Indexer'
const language = require('../../Dialogues/index'); // Importa um módulo de linguagem
const youtubedl = require('youtube-dl-exec'); // Módulo para download de vídeos do YouTube
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path; // Caminho para o executável do FFmpeg

/* JSON's | Utilidades: Carrega e manipula dados em formato JSON */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`)); // Lê e parseia um arquivo JSON
const canAdvise = global.config.waitMessage.value; // Verifica se é possível enviar mensagens de espera

/* Realiza funções de pós finalização: Lida com ações após a conclusão de uma operação */
function postResults(response) {
    if (
        envInfo.settings.finish.value === true ||
        (envInfo.settings.ender.value === true && envInfo.results.success === false)
    ) {
        setTimeout(() => {
            envInfo.functions.revert.value();
        }, envInfo.settings.wait.value);
    }
    return response; // Retorna a resposta
}

/* Insere o erro na envInfo: Lida com erros e os armazena para referência futura */
function echoError(error) {
    const myError = error instanceof Error ? error : new Error(`Received an instance of "${typeof error}" in function 'messedup', expected an instance of "Error".`);

    envInfo.results.success = false;
    envInfo.parameters.code.value = myError.code || '0';
    envInfo.parameters.message.value = myError.message || 'The operation cannot be completed because an unexpected error occurred.';

    if (envInfo.settings.error.value === true) {
        console.log('\x1b[31m', `[${path.basename(__dirname)} #${envInfo.parameters.code.value || 0}] →`, `\x1b[33m${envInfo.parameters.message.value}`);
    }

    return envInfo.results; // Retorna os resultados com informações de erro
}

/* Função que retorna todo o arquivo: Retorna os dados do ambiente */
function ambientDetails() {
    return envInfo; // Retorna os dados do ambiente (envInfo)
}

// REGION: Funções

// Gera strings aleatórias com base no tamanho especificado.
// Parâmetro: length - O comprimento da string aleatória a ser gerada.
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {                  // Itera pelo comprimento desejado para criar a string aleatória.
        const randomIndex = Math.floor(Math.random() * characters.length); // Gera um índice aleatório dentro do alcance dos caracteres disponíveis.
        result += characters.charAt(randomIndex);       // Adiciona o caractere correspondente ao índice aleatório à string resultante.
    }
    return result; // Retorna a string gerada aleatoriamente
}

// Exclui o arquivo ou diretório no caminho especificado. Pode ser usado para excluir arquivos ou pastas.
// Parâmetro: filePath - O caminho do arquivo ou diretório a ser excluído.
// Parâmetro opcional: timeout - O tempo de espera (em milissegundos) antes de excluir o arquivo. Padrão é 10000ms (10 segundos).
// Parâmetro opcional: isDirectory - Um indicador booleano para especificar se o caminho se refere a um diretório. Padrão é falso.
function deleteFile(filePath, timeout = 10000, isDirectory = false) {
    try {
        if (fs.existsSync(filePath)) {  // Verifica se o arquivo ou diretório no caminho especificado existe.
            setTimeout(() => {  // Aguarda o tempo de espera antes de excluir o arquivo ou diretório.

                if (isDirectory) {
                    fs.rmSync(filePath, { recursive: true });   // Se isDirectory for verdadeiro, exclui o diretório e todo o seu conteúdo de forma recursiva.
                } else {
                    fs.unlinkSync(filePath);    // Se isDirectory for falso, exclui o arquivo especificado.
                }
            }, timeout);
        }
    } catch (error) {
        // Se ocorrer um erro durante a exclusão, imprime uma mensagem de erro.
        if (config.Show_Error == true) {
            console.log(error, '\nTalvez você não tenha permissão de edição, tente mudar o local da pasta da Íris ou rodar como administrador.');
        }
    }
}

// Extrai URLs de um texto fornecido.
// Parâmetro: text - O texto do qual extrair a URL.
function extractURL(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/;   // Expressão regular para encontrar URLs em um texto.
    var matches = text.match(urlRegex); // Tenta encontrar uma correspondência da URL usando a expressão regular.
    if (matches) {  // Se uma URL for encontrada, retorna a primeira correspondência, caso contrário, retorna null.
        var url = matches[0];
        return url; // Retorna a URL extraída
    } else {
        return null;    // Retorna null se não houver URL
    }
}

// Função assíncrona para baixar mídia (áudio ou vídeo) de uma URL especificada.
// Parâmetros:
// - url: A URL da mídia a ser baixada.
// - format: O formato da mídia a ser baixada ('audio' para mp3, 'video' para mp4).
async function downloadMedia(url, format) {
    const isAudio = format === 'audio';
    const fileType = isAudio ? 'mp3' : 'mp4';
    const options = {
        maxFilesize: `16M`, // Tamanho máximo do arquivo a ser baixado (16 MB neste caso).
        noCallHome: true,   // Impede a comunicação com o servidor para fins de estatísticas.
        noCheckCertificate: true,   // Não verifica os certificados SSL ao fazer download de arquivos HTTPS.
        noWarnings: true,   // Suprime mensagens de aviso durante o processo de download.
        o: `${__dirname}\\mediaCache\\${generateRandomString(10)}.${fileType}`, // Caminho de saída para o arquivo baixado.
        youtubeSkipDashManifest: true   // Ignora a manifestação Dash para vídeos do YouTube.
    };

    // Configurações específicas para áudio.
    if (isAudio) {
        options.audioFormat = 'mp3';    // Formato de saída para arquivos de áudio (mp3 neste caso).
        options.ffmpegLocation = ffmpegPath;    // Caminho para o executável FFmpeg para conversão de áudio.
        options.x = true;   // Sinalizador para extrair apenas o áudio ao fazer o download.
    } else {
        options.format = 'mp4'; // Formato de saída para arquivos de vídeo (mp4 neste caso).
    }

    try {
        await youtubedl(url, options);  // Tenta fazer o download da mídia usando a biblioteca 'youtube-dl-exec' com as opções configuradas.
        return options.o;   // Retorna o caminho do arquivo de mídia baixado.
    } catch (error) {   // Em caso de erro, exclui o arquivo baixado e retorna o erro ocorrido durante o processo de download.
        deleteFile(options.o);
        return error;
    }
}


// ENDREGION

// Função assíncrona para download e envio de vídeos ou áudios com base nos argumentos fornecidos.
// Parâmetros:
// - kill: Objeto de controle de mensagens para enviar respostas ao usuário.
// - env: Objeto contendo informações do ambiente de execução, como chatId, texto da mensagem, citação e argumentos do comando.
async function videoDownload(
    kill = envInfo.functions.exec.arguments.kill.value,
    env = envInfo.functions.exec.arguments.env.value,
) {
    // Inicializa os resultados como falsos e não-sucedidos.
    envInfo.results.value = false;
    envInfo.results.success = false;

    try {
        if (typeof kill === 'object' && typeof env === 'object') {
            const { chatId, quoteThis, body, arks } = env.value;

            if (arks.includes('--help') || arks.length === 0) { // Verifica se os argumentos contêm comandos de ajuda ou estão vazios.
                // Envia uma mensagem de ajuda ao usuário se solicitado ou se não houver argumentos.
                envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Helper', 'User', true, true, envInfo) }, { quoted: quoteThis });
                return envInfo.results; // Retorna os resultados após enviar a mensagem de ajuda.
            }

            const downFormat = arks.includes('-audio') ? 'audio' : 'video'; // Determina o formato do download com base nos argumentos fornecidos.
            const extractedURL = extractURL(body);  // Extrai a URL do texto da mensagem.

            if (extractedURL === null) {    // Verifica se a URL extraída é válida.
                envInfo.results.value = await kill.sendMessage(chatId, { text: language(region, 'Errors', 'InvalidURL', true, true) }, { quoted: quoteThis });
                return envInfo.results; // Retorna os resultados após enviar uma mensagem de erro por URL inválida.
            }

            if (canAdvise === true) { 
                // Envia uma mensagem de espera se configurado para fazer isso.
                kill.sendMessage(chatId, { text: language(region, 'Extras', 'Wait', true, true, {}) }, { quoted: quoteThis });
            }

            // Baixa a mídia da URL fornecida no formato especificado (vídeo ou áudio).
            const mediaFilePath = await downloadMedia(extractedURL, downFormat);
            // Prepara os dados do arquivo para envio com base no formato (áudio ou vídeo).
            const fileData = downFormat === 'audio' ? { audio: fs.readFileSync(mediaFilePath), mimetype: 'audio/mp4' } : { video: fs.readFileSync(mediaFilePath), mimetype: 'video/mp4' };
            // Envia o arquivo para o usuário.
            envInfo.results.value = await kill.sendMessage(chatId, fileData, { quoted: quoteThis });
            // Exclui o arquivo de mídia após o envio.
            deleteFile(mediaFilePath);
        }

        // Define o download como bem-sucedido.
        envInfo.results.success = true;
    } catch (error) {   // Lida com erros e envia uma mensagem de erro ao usuário.
        echoError(error);
        await kill.sendMessage(env.value.chatId, {
            text: language(region, 'S.E.R', error, true, true, {
                command: 'Insira o mesmo que na envInfo.name',
                time: (new Date()).toLocaleString(),
            }),
        }, { quoted: env.value.quoteThis });
    }

    return postResults(envInfo.results);    // Executa a função de pós-finalização, e retorna os resultados finais.
}

/* Função que reseta tudo: Restaura o ambiente para o estado inicial */
function resetEnvironment(changeKey = {}) {
    envInfo.results.success = false;
    let exporting = {
        reset: resetEnvironment,
    };

    try {
        envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

        if (Object.keys(changeKey).length !== 0) {
            Object.keys(changeKey).forEach((key) => {
                if (Object.keys(envInfo).includes(key) && key !== 'developer') {
                    envInfo[key] = changeKey[key];
                }
            });
        }

        envInfo.functions.poswork.value = postResults;
        envInfo.functions.ambient.value = ambientDetails;
        envInfo.functions.messedup.value = echoError;
        envInfo.functions.revert.value = resetEnvironment;
        envInfo.functions.exec.value = videoDownload;

        envInfo.parameters.location.value = __filename;

        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.exec]: envInfo.functions.exec.value,
            },
            Developer: 'KillovSky',
            Projects: 'https://github.com/KillovSky',
        };

        envInfo.results.success = true;
        exporting = module.exports;
    } catch (error) {
        echoError(error);
    }

    return exporting;
}

/* Constrói a envInfo: Configuração inicial do ambiente */
resetEnvironment(); // Chama a função para inicializar o ambiente
