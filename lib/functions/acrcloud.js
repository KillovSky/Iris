const acrcloud = require("acrcloud")
const fs = require("fs")
const config = require('../config/Gerais/config.json')
let acr = new acrcloud({
	host: config.Acr_Host,
	access_key: config.Acr_Access,
	access_secret: config.Acr_Secret
})
const {
	mylang
} = require('../lang')
var mess = mylang(region)
const {
	tools
} = require('./index')

exports.recognize = async (name, media, kill, message) => {
	try {
		await kill.reply(message.from, mess.wait() + '\n\n' + mess.useLimit(), message.id)
		fs.writeFile(name, media, async (err) => {
			if (err) {
				await kill.reply(message.from, 'Houve um erro de download da música.' + mess.fail('DETECT', err, (new Date().toString())), message.id)
				return tools('others').reportConsole('DETECT', err)
			}
			await acr.identify(fs.readFileSync(name)).then(async (resp) => {
				if (resp.status.code == 1001) return await kill.reply(message.from, mess.noresult(), message.id)
				if (resp.status.code == 3003 || resp.status.code == 3015) return await kill.reply(message.from, mess.invalidKey(), message.id)
				if (resp.status.code == 3000) return await kill.reply(message.from, mess.serverError(), message.id)
				await kill.reply(message.from, mess.detectmsc(resp, resp.metadata.music[0].artists.map(a => a.name)), message.id)
			})
		})
	} catch (error) {
		tools('others').reportConsole('DETECT', error)
		await kill.reply(message.from, mess.fail('DETECT', error, (new Date().toString())), message.id)
	}
}