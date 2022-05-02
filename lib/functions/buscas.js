const pupeteer = require('puppeteer')
const {
	mylang
} = require('../lang')
const {
	tools
} = require('./index')
const config = JSON.parse(fs.readFileSync('./lib/config/Settings/config.json'))

exports.cpf = async (cpf, kill, message) => {
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
		}, Number(config.Puppeteer_Wait)) // Caso de algum erro, o processo vai ser morto de qualquer forma
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
		tools('others').clearFile('./logs/Chrome/CPF', 0, true)
		return await kill.reply(message.from, `O CPF *"${cpf}"* possui como dono *"${cpfData.nome}"* que está com *"${cpfData.situacao}".*`, message.id)
	} catch (err) {
		tools('others').reportConsole('CPF', err)
		await kill.reply(message.from, 'Não houveram resultados sobre o CPF, talvez seja um erro ou ele é invalido, certifique-se de ser  um documento brasileiro.\n\n'+mylang(region).fail('CPF', err, (Date().toString())), message.id)
	}
}

exports.carros = async (placa, kill, message) => {
	try {
		const browser = await pupeteer.launch({
			headless: false,
			userDataDir: './logs/Chrome/CARROS',
			args: [
				'--no-sandbox',
				'--disable-setuid-sandbox'
			]
		})
		let killBrowser = setTimeout(() => {
			browser.close()
		}, Number(config.Puppeteer_Wait)) // Caso de algum erro, o processo vai ser morto de qualquer forma
		const page = await browser.newPage()
		await page.setDefaultNavigationTimeout(120000)
		await page.goto('https://www.qualveiculo.net/', {
			waitUntil: "networkidle2",
			timeout: 0
		})
		await page.waitForSelector('#placa')
		await page.type('#placa', placa)
		await page.click('#consultar')
		await page.waitForSelector('#resultado')
		const carData = await page.evaluate(() => {
			let color = document.querySelector("#resultado > span.dados.texto").innerText
			return {
				"nome": document.querySelector("#resultado > span:nth-child(1)").innerText,
				"cor": color.slice(5, color.indexOf('-')),
				"ano": color.slice(color.indexOf('-')+7),
				"local": document.querySelector("#resultado > span.dados.localidade > span").innerText
			}
		})
		await browser.close()
		clearTimeout(killBrowser)
		tools('others').clearFile('./logs/Chrome/CARROS', 0, true)
		return await kill.reply(message.from, `O veiculo de placa *"${placa}"* é um *"${carData.nome}"* de cor *"${carData.cor}"* e ano *"${carData.ano}"*, fabricado em *"${carData.local}".*`, message.id)
	} catch (err) {
		tools('others').reportConsole('PLACA', err)
		await kill.reply(message.from, 'Não houveram resultados sobre a placa, talvez seja um erro ou ela é invalida, certifique-se de ser brasileira.\n\n'+mylang(region).fail('PLACA', err, (Date().toString())), message.id)
	}
}