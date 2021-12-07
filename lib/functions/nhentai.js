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
				await fs.mkdirSync(pasta)
				for (let i = 0; i < dojin.details.pages.length; i++) {
					console.log(dojin.details.pages[i])
					const request = await https.get(dojin.details.pages[i], function(res) {
						res.pipe(fs.createWriteStream(`${pasta}/${i}`))
					})
				}
				await tools('others').sleep(3000)
				await shell.exec(`bash -c 'tar -zcvf "${pasta}/${args[0]}.tgz" ${pasta}'`, {
					silent: true
				})
				await kill.sendFileFromUrl(message.from, dojin.details.pages[0], 'page1.png', mylang(region).nhentai(dojin), message.id)
				await kill.sendFile(message.from, `${pasta}/${args[0]}.tgz`, `${args[0]}.zip`, '', message.id)
				await tools('others').sleep(120000) // 2 Minutos
				await tools('others').clearFile(`${pasta}/${args[0]}.tgz`)
			} else return await kill.reply(message.from, mylang(region).noresult(), message.id)
		} else return await kill.reply(message.from, mylang(region).noargs() + '6 digit/digitos (code/código nhentai) (ex: 215600).', message.id)
	} catch (err) {
		await kill.reply(message.from, mylang(region).fail('NHENTAI', err, (new Date().toString())), message.id)
		await tools('others').reportConsole('NH', err)
	}
}