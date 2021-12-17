const https = require('https')
const nhentai = require('nhentai-js')
const fs = require('fs')
const shell = require('shelljs')
const {
	mylang
} = require('../lang')
const {
	tools
} = require('./index')

module.exports = hentao = async (args, kill, message) => {
	try {
		let pasta = `./lib/media/hentai/${tools('others').randomString(10)}`
		new nhentai()
		if (!isNaN(args[0])) {
			await kill.reply(message.from, mylang(region).wait(), message.id)
			if (await nhentai.exists(args[0])) {
				const dojin = await nhentai.getDoujin(args[0])
				tools('others').clearFile(pasta, 1, true)
				fs.mkdirSync(pasta)
				for (let i = 0; i < dojin.pages.length; i++) {
					https.get(dojin.pages[i], function(res) {
						res.pipe(fs.createWriteStream(`${pasta}/${i}.png`))
					})
				}
				await tools('others').sleep(3000)
				shell.exec(`bash -c 'zip -r "${pasta}/${args[0]}.zip" ${pasta}'`, {
					silent: true
				})
				await kill.sendFileFromUrl(message.from, dojin.pages[0], 'page1.png', mylang(region).nhentai(dojin), message.id)
				await kill.sendFile(message.from, `${pasta}/${args[0]}.zip`, `${args[0]}.zip`, '', message.id)
				tools('others').clearFile(pasta, 120000, true)
			} else return await kill.reply(message.from, mylang(region).noresult(), message.id)
		} else return await kill.reply(message.from, mylang(region).noargs() + '6 digit/digitos (code/código nhentai) (ex: 215600).', message.id)
	} catch (err) {
		await kill.reply(message.from, mylang(region).fail('NHENTAI', err, (new Date().toString())), message.id)
		tools('others').reportConsole('NH', err)
	}
}