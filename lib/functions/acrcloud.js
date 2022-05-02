const acrcloud = require("acrcloud")
const fs = require("fs")
const APIS = JSON.parse(fs.readFileSync('./lib/config/Settings/APIS.json'))
let acr = new acrcloud({
	host: APIS.Acr_Host,
	access_key: APIS.Acr_Access,
	access_secret: APIS.Acr_Secret
})
const {
	mylang
} = require('../lang')
const {
	tools
} = require('./index')

exports.recognize = async (name, media, kill, message) => {
	try {
		await kill.reply(message.from, mylang(region).wait() + '\n\n' + mylang(region).useLimit(), message.id)
		fs.writeFile(name, media, async (err) => {
			if (err) {
				await kill.reply(message.from, 'Houve um erro de download da música.' + mylang(region).fail('DETECT', err, (new Date().toString())), message.id)
				return tools('others').reportConsole('DETECT', err)
			}
			await acr.identify(fs.readFileSync(name)).then(async (resp) => {
				if (resp.status.code == 1001) return await kill.reply(message.from, mylang(region).noresult(), message.id)
				if (resp.status.code == 3003 || resp.status.code == 3015) return await kill.reply(message.from, mylang(region).invalidKey(), message.id)
				if (resp.status.code == 3000) return await kill.reply(message.from, mylang(region).serverError(), message.id)
				await kill.reply(message.from, mylang(region).detectmsc(resp, resp.metadata.music[0].artists.map(a => a.name)), message.id)
			})
		})
	} catch (error) {
		tools('others').reportConsole('DETECT', error)
		await kill.reply(message.from, mylang(region).fail('DETECT', error, (new Date().toString())), message.id)
	}
}