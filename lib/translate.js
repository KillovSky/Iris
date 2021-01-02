const translate = require('@vitalets/google-translate-api') // Nada a se mecher aqui amigo

module.exports = doing = (text, lang) => new Promise((resolve, reject) => {
    console.log(`Traduzindo para ${lang}...`)
    translate(text, { client: 'gtx', to: lang })
        .then((res) => resolve(res.text))
        .catch((err) => reject(err))
})
