const chalk = require('chalk')
const crypto = require('crypto')
const shell = require('shelljs')
const notifier = require('node-notifier')
const moment = require('moment-timezone')
const fs = require('fs')
const wordwrap = require('word-wrapper')
const config = JSON.parse(fs.readFileSync('./lib/config/Gerais/config.json'))
const {
	tools
} = require('./index')

// Informa erros no console de forma humanizada
exports.reportConsole = (command, error) => {
	console.log(chalk.keyword('crimson')(`[${command.toUpperCase()}]`), chalk.keyword('gold')(`→ Obtive erros no comando "${config.Prefix}${command}" → "${error.message}" - Você pode ignorar.`))
}

// Conta quantas vezes uma string/palavra aparece | Por Pedro B.
exports.countHave = (string, word) => {
	return string.split(word).length - 1
}

// Faz uma tabela como o /menu || Pedro B.
exports.tablefy = (imput, titulo) => {
	if (titulo) {
		var tabelinha = '```╭───── 「 ' + titulo + '」 ──────```\n│'
	} else var tabelinha = '```╭───────────────────────```\n│'
	var mapimput = wordwrap(imput, {
		width: 36
	}).trim().split(/\n+/)
	for (let i = 0; i < mapimput.length; i++) {
		if (tools('others').countHave(mapimput[i], '*') % 2 !== 0) {
			mapimput[i] += '*'
			if (mapimput[i + 1]) {
				mapimput[i + 1] = '*' + mapimput[i + 1]
			}
		}
		if (tools('others').countHave(mapimput[i], '_') % 2 !== 0) {
			mapimput[i] += '_'
			if (mapimput[i + 1]) {
				mapimput[i + 1] = '_' + mapimput[i + 1]
			}
		}
		if (tools('others').countHave(mapimput[i], '~') % 2 !== 0) {
			mapimput[i] += '~'
			if (mapimput[i + 1]) {
				mapimput[i + 1] = '~' + mapimput[i + 1]
			}
		}
		if (tools('others').countHave(mapimput[i], '```') % 2 !== 0) {
			mapimput[i] += '```'
			if (mapimput[i + 1]) {
				mapimput[i + 1] = '```' + mapimput[i + 1]
			}
		}
		tabelinha += '\n\`\`\`│\`\`\` ' + mapimput[i]
	}
	return tabelinha += '\n\`\`\`│\`\`\`\n\`\`\`╰───────────────────────\`\`\`'
}

// Transforma uma Buffer em Base64
exports.dataURI = (type, image) => {
	return `data:${type};base64,${image.toString('base64')}`
}

// Cria uma string aleatoria
exports.randomString = (length) => {
	return crypto.randomBytes(length).toString('hex')
}

// Verifica se é um número inteiro
exports.isInt = (val) => {
	return Number.isInteger(Number(val))
}

// Aleatoriza arrays
exports.randomArr = (arr) => {
	return arr.sort(() => Math.random() - 0.5);
}

exports.newArray = (min, max, lenmin, lenmax) => {
	let array = Array(max - min + 1).fill().map((_, idx) => min + idx)
	return lenmin !== null ? array.slice(lenmin, lenmax) : array
}

// Da a cor as mensagens do terminal
exports.color = (text, color) => {
	return !color ? chalk.green(text) : chalk.keyword(color)(text)
}

// Verifica se é uma URL
exports.isUrl = (url) => {
	return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi))
}

// Faz a função esperar 'x' tempo antes de avançar
exports.sleep = async (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms))
}

// Envia notificações
exports.notify = (title, message, icon) => {
	notifier.notify({
		title: title,
		message: message,
		icon: icon
	})
}

// Escolhe um número aleatorio
exports.randomNumber = (min, max) => {
	return Math.floor(Math.random() * Number(max)) + Number(min)
}

// Adquire o tempo de processamento
exports.processTime = (timestamp, now) => {
	return moment.duration(now - moment(timestamp * 1000)).asSeconds()
}

// Formata uma array com object de forma crescente
exports.sort = (obj, value) => {
	const order = []
	var res = {}
	Object.keys(obj).forEach(key => {
		return order[obj[key][value] - 1] = key
	})
	order.forEach(key => {
		res[key] = obj[key];
	})
	return res
}

// Randomiza uma array
exports.randVal = (value) => {
	return value[Math.floor(Math.random() * value.length)]
}

// Função que separa o "Sim" de cada língua da Íris
exports.yesAwnsers = () => {
	return config.Language == 'pt' ? 'Sim' : config.Language == 'en' ? 'Yes' : 'Si'
}

// Função que separa o "Não" de cada língua na Íris [eu sei, ambas são 'inúteis' :)]
exports.noAwnsers = () => {
	return config.Language == 'pt' ? 'Não' : 'No'
}

// Função que pega uma linha aleatoria do texto usando shell script
exports.getRandLine = (qtd, file) => {
	return shell.exec(`bash ./lib/functions/config.sh line ${qtd} "${file}"`, {
		silent: true
	}).stdout.split('\n')
}

// Função que verifica se algo existe e então o apaga em "x" tempo
exports.clearFile = (p, t = 10000, isDir = false) => {
	try {
		if (fs.existsSync(p)) {
			setTimeout(() => {
				if (isDir) {
					fs.rmdirSync(p, {
						recursive: true
					})
				} else {
					fs.unlinkSync(p)
				}
			}, t)
		}
	} catch (error) {
		console.log(error)
		console.log('Talvez você não tenha permissão de edição, tente mudar o local da pasta da Íris ou rodar como administrador.')
	}
}