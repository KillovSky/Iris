const fs = require('fs-extra')
const request = require('request')
const config = require('./config/Bot/config.json')
const chalk = require('chalk')
const fetch = require('node-fetch')
const FormData = require('form-data')
const fromBuffer = require('file-type')
const trans = require('@vitalets/google-translate-api')

// Da a cor as mensagens do terminal
const color = (text, color) => { return !color ? chalk.green(text) : chalk.keyword(color)(text) }

// Verifica se é uma URL
const isUrl = (url) => { return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi)) }

// Função parecida com a de shell usada pra esperar certo tempo antes de rodar algo, usa sistema de milisegundos
const sleep = async (ms) => { return new Promise(resolve => setTimeout(resolve, ms)) }

// Upa imagens no telegra pra usar em comandos
const upload = async (buffData, type) => {
	return new Promise(async (resolve, reject) => {
		const { ext } = await fromBuffer(buffData)
		const filePath = './lib/media/tmp.' + ext
		await fs.writeFile(filePath, buffData, { encoding: 'base64' }, async (err) => {
			if (err) return reject(err)
			const fileData = fs.readFileSync(filePath)
			const form = new FormData()
			form.append('file', fileData, 'tmp.' + ext)
			await fetch('https://telegra.ph/upload', {
				method: 'POST',
				body: form
			}).then(res => res.json()).then(res => {
				if (res.error) return reject(res.error)
				resolve('https://telegra.ph' + res[0].src)
			}).then(() => fs.unlinkSync(filePath)).catch(err => reject(err))
		})
	})
}

// Verifica se ja usou comando
const usedCommandRecently = new Set()

// Caso tenha sido usado muitas vezes
const isFiltered = (from) => !!usedCommandRecently.has(from)

// Anti Flood
const addFilter = (from) => {
	usedCommandRecently.add(from)
	setTimeout(() => usedCommandRecently.delete(from), Number(config.antiFlood * 1000)) // * 1000 - Transforma o valor do tempo de aposta em segundos
}

// Tradutor
const translate = (text, lang) => { return new Promise(async (resolve, reject) => { trans(text, { client: 'gtx', to: lang }).then((res) => resolve(res.text)).catch((err) => reject(err)) }) }

// Verifica se é um número inteiro
const isInt = (number) => { return !isNaN(number) && (function(x) { return (x | 0) === x; })(parseFloat(number)) }

module.exports = {
	color,
	sleep,
	isUrl,
	upload,
	isFiltered,
	addFilter,
	translate,
	isInt
}