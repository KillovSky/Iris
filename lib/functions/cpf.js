const pupeteer = require('puppeteer')
const {
	mylang
} = require('../lang')

exports.consulta = async (cpf, kill, message) => {
	try {
		const browser = await pupeteer.launch({
			headless: false,
			userDataDir: './logs/Chrome/CPF',
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
		await page.goto('https://www.situacao-cadastral.com/', {
			waitUntil: "networkidle2",
			timeout: 0
		})
		await page.waitForSelector('#doc')
		await page.type('#doc', cpf)
		await page.click('#consultar')
		await page.waitForSelector('#resultado')
		const cpfData = await page.evaluate(() => {
			return {
				"nome": document.querySelector("#resultado > span.dados.nome").innerText,
				"situacao": document.querySelector("#resultado > span.dados.situacao > span").innerText
			}
		})
		await browser.close()
		clearTimeout(killBrowser)
		return await kill.reply(message.from, `O CPF *"${cpf}"* possui como dono *"${cpfData.nome}"* que está com *"${cpfData.situacao}".*`, message.id)
	} catch (err) {
		await kill.reply(message.from, 'Não consegui encontrar nada, talvez o CPF seja invalido ou obtive algum erro.', message.id)
		await kill.reply(message.from, mylang(region).fail('CPF', err, (Date().toString())), message.id)
	}
}