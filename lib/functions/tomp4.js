let path = require('path')
let fs = require('fs')
const pupeteer = require('puppeteer')
const axios = require('axios')
const {
	mylang
} = require('../lang')
const {
	tools
} = require('./index')

exports.convert = async (file, mediaData, kill, message) => {
	try {
		fs.writeFile(file, mediaData, async (err) => {
			if (err) return console.error(err)
			const browser = await pupeteer.launch({
				headless: true,
				userDataDir: './logs/Chrome/MP4',
				args: [
					'--no-sandbox',
					'--disable-setuid-sandbox'
				]
			})
			let killBrowser = setTimeout(() => {
				browser.close()
			}, 220000) // Caso de algum erro, o processo vai ser morto de qualquer forma
			const page = await browser.newPage()
			await page.setDefaultNavigationTimeout(120000)
			await page.goto('https://ezgif.com/webp-to-mp4', {
				waitUntil: "networkidle2",
				timeout: 0
			})
			await page.waitForSelector('input[type=file]')
			const upHandle = await page.$("input[type=file]")
			await upHandle.uploadFile(path.join(process.cwd(), file))
			await page.click('#tool-submit-button > input')
			await page.waitForSelector('#tool-submit-button > input')
			await page.click('#tool-submit-button > input')
			await page.waitForSelector('#tool-submit-button > input')
			const getMP4 = await page.evaluate(() => document.querySelector("#output > table > tbody > tr > td:nth-child(12) > a").href)
			await browser.close()
			clearTimeout(killBrowser)
			const webptomp4 = await axios.get(getMP4, {
				responseType: 'arraybuffer'
			}).then(res => tools('others').dataURI('video/mp4', Buffer.from(res.data, 'binary')))
			await kill.sendFile(message.from, webptomp4, 'video.mp4', '', message.id)
			tools('others').clearFile('./logs/Chrome/MP4', 0, true)
			return tools('others').clearFile(file, 30000, false)
		})
	} catch (error) {
		tools('others').reportConsole('TOMP4', error)
		await kill.reply(message.from, 'Houve uma falha na conversão, talvez o sticker seja grande demais ou minha conexão esteja lenta.\n\n'+mylang(region).fail('TOMP4', error, (Date().toString())), message.id)
	}
}