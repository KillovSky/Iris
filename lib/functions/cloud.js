const fetch = require('node-fetch')
const FormData = require('form-data')
const fs = require('fs')
const fromBuffer = require('file-type')

/* Essa função é usada para fazer o upload de uma imagem para o servidor, lhe dando a URL final, caso obtenha erros ela retorna uma imagem comum para o comando não falhar. */
exports.upload = async (buffData, type) => {
	return new Promise(async (resolve, reject) => {
		const {
			ext
		} = await fromBuffer(buffData)
		const filePath = './lib/media/tmp.' + ext
		await fs.writeFile(filePath, buffData, {
			encoding: 'base64'
		}, async (err) => {
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