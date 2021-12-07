const {
	color
} = require('./others')
const fs = require('fs')

/* Função que recarrega os arquivos em casos de mudanças em tempo real, não é recomendado para longos usos, apenas para quando você quer programar e testar em tempo real. */

exports.watchFile = (file, place) => {
	fs.watchFile(file, () => {
		try {
			console.log(color('[EDIÇÃO]', 'crimson'), color(`Detectei que você fez edições, irei reiniciar!`, 'yellow'))
			delete require.cache[require.resolve(place)]
			console.log(color('[EDIÇÃO]', 'lime'), color(`Prontinho! Testa, Testa!`, 'yellow'))
		} catch (error) {
			console.log(color('[WATCH]', 'red'), color(`Um erro foi detectado no update! -> ${error}`, 'yellow'))
		}
	})
}