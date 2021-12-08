const chalk = require('chalk')
const crypto = require('crypto')
const shell = require('shelljs')
const notifier = require('node-notifier')
const moment = require('moment-timezone')
const fs = require('fs')
const config = require('../config/Gerais/config.json')

exports.reportConsole = (command, error) => {
	console.log(chalk.keyword('crimson')(`[${command.toUpperCase()}]`), chalk.keyword('gold')(`→ Obtive erros no comando "${config.Prefix}${command}" → "${error.message}" - Você pode ignorar.`))
}

// Tranforma uma Buffer em Base64
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
exports.notify = async (title, message, icon) => {
	await notifier.notify({
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

// Função que separa o "Sim" de cada lingua da Íris
exports.yesAwnsers = () => {
	return config.Language == 'pt' ? 'Sim' : config.Language == 'en' ? 'Yes' : 'Si'
}

// Função que separa o "Não" de cada lingua na Íris [eu sei, ambas são 'inuteis' :)]
exports.noAwnsers = () => {
	return config.Language == 'pt' ? 'Não' : 'No'
}

// Função que pega uma linha aleatoria do texto usando shell script
exports.getRandLine = (qtd, file) => {
	return shell.exec(`bash ./lib/functions/config.sh line ${qtd} "${file}"`, {
		silent: true
	}).stdout.split('\n')[0]
}

// Função que verifica se algo existe e então o apaga em "x" tempo
exports.clearFile = (p, t = 10000, isDir = false) => {
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
}