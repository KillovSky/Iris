function mylang(lang) {
	try {
		return exports[lang] = require(`./${lang}`)
	} catch (error) {
		console.log('Linguagem não encontrada ou erros, usarei a padrão "PT-BR", detalhes abaixo!\n\n', error)
		return exports.pt = require('./pt')
	}
}

module.exports = {
	mylang
}