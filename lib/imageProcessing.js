const sharp = require('sharp')
const { fromBuffer } = require('file-type') // Isso torna as imagens aceitaveis a comandos como /meme

module.exports = resizeImage = (buff, encode) => new Promise(async (resolve, reject) => {
    console.log('Resizeing image...')
    const { mime } = await fromBuffer(buff)
    sharp(buff, { failOnError: false })
        .resize(512, 512)
        .toBuffer()
        .then(resizedImageBuffer => {
            if (!encode) return resolve(resizedImageBuffer)
            console.log('Create base64 from resizedImageBuffer...')
            const resizedImageData = resizedImageBuffer.toString('base64')
            const resizedBase64 = `data:${mime};base64,${resizedImageData}`
            resolve(resizedBase64)
        })
        .catch(error => reject(error))
})
