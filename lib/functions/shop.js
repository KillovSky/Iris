const {
	tools
} = require('./index')
const {
	mylang
} = require('../lang')
const fs = require('fs')
const mine = JSON.parse(fs.readFileSync('./lib/config/Gerais/mine.json'))
const values = JSON.parse(fs.readFileSync('./lib/config/Gerais/shop.json'))

module.exports = shop = async (kill, message, args, user, file, chatId, mention) => {

	switch (args[0]) {

		case '1':
			let checkGMV = parseInt(tools('gaming').getValue(user, file, chatId, 'coin'))
			if (Number(values.Guild_Rate_Price) > checkGMV) return await kill.reply(chatId, `Você não possui ${values.Guild_Rate_Price} I'coins para comprar esse recurso.`, message.id)
			if (Object.keys(mine.Win_Rate_Guild).includes(args[1])) {
				mine.Win_Rate_Guild[args[1]] -= 1
			} else {
				mine.Win_Rate_Guild[user] = 10 // EM DESENVOLVIMENTO
				// Anotação para o Lucas do futuro que ia desenvolver isso: Pegue o valor e divirta por 10, depois adicione o valor total pelo valor da divisão, 100 / 10 = 10, 100 + 10 = resultado
			}
			fs.writeFileSync('./lib/config/Gerais/mine.json', JSON.stringify(mine))
			await kill.reply(chatId, `Sua Guilda agora tem mais 10% do valor total adicionado aos ganhos totais.`, message.id)
			tools('gaming').addValue(user, Number(-values.Guild_Rate_Price), file, chatId, 'coin')
			break

		case '2':
			let checkStl = parseInt(tools('gaming').getValue(user, file, chatId, 'coin'))
			if (Number(values.Stop_Loss_Price) > checkStl) return await kill.reply(chatId, `Você não possui ${values.Stop_Loss_Price} I'coins para comprar esse recurso.`, message.id)
			if (Object.keys(mine.Stop_Loss).includes(user)) {
				mine.Stop_Loss[user] -= 1 // EM DESENVOLVIMENTO
			} else {
				// Anotação para o Lucas do futuro que ia desenvolver isso: Pegue o valor e divirta por 10, depois subtraia o valor total pelo valor da divisão, 100 / 10 = 10, 100 - 10 = resultado | reduz em y XP as percas no cassino
				mine.Stop_Loss[user] = 10
			}
			fs.writeFileSync('./lib/config/Gerais/mine.json', JSON.stringify(mine))
			await kill.reply(chatId, `Sua taxa de percas reduziu em mais 10%, agora você perderá menos XP.`, message.id)
			tools('gaming').addValue(user, Number(-values.Stop_Loss_Price), file, chatId, 'coin')
			break

		case '3':
			let checkLaV = parseInt(tools('gaming').getValue(user, file, chatId, 'coin'))
			if (Number(values.Lose_All_Price) > checkLaV) return await kill.reply(chatId, `Você não possui ${values.Lose_All_Price} I'coins para comprar esse recurso.`, message.id)
			file[chatId][mention]['xp'] = 0
			file[chatId][mention]['level'] = 0
			file[chatId][mention]['coin'] = 100 // Padrão
			file[chatId][mention]['dima'] = 100 // Padrão
			file[chatId][mention]['rubi'] = 100 // Padrão
			fs.writeFileSync('./lib/config/Gerais/level.json', JSON.stringify(file))
			await kill.sendTextWithMentions(chatId, `Que pena @${message.mentionedJidList[0].replace('@c.us', '')}, parece que você perdeu tudo, junte o suficiente para se vingar haha.`, message.id)
			tools('gaming').addValue(user, Number(-values.Lose_All_Price), file, chatId, 'coin')
			break

		case '4':
			let checkILr = parseInt(tools('gaming').getValue(user, file, chatId, 'coin'))
			if (Number(values.Lose_Rate_Price) > checkILr) return await kill.reply(chatId, `Você não possui ${values.Lose_Rate_Price} I'coins para comprar esse recurso.`, message.id)
			if (Object.keys(mine.Friend_Loss).includes(mention)) {
				mine.Friend_Loss[mention] -= 1 // EM DESENVOLVIMENTO
			} else {
				// Anotação para o Lucas do futuro que ia desenvolver isso: Pegue o valor e divirta por 10, depois subtraia o valor total pelo valor da divisão, 100 / 10 = 10, 100 - 10 = resultado | Reduz os ganhos de alguém no cassino em 10
				mine.Friend_Loss[mention] = 10
			}
			fs.writeFileSync('./lib/config/Gerais/mine.json', JSON.stringify(mine))
			await kill.sendTextWithMentions(chatId, `Parece que você acabou de perder 10% de todos os seus futuros lucros em jogos, caro @${mention.replace('@c.us', '')}.\nJunte o suficiente para se vingar haha.`, message.id)
			tools('gaming').addValue(user, Number(-values.Lose_Rate_Price), file, chatId, 'coin')
			break

		case '5':
			let checkICW = parseInt(tools('gaming').getValue(user, file, chatId, 'coin'))
			if (Number(values.Win_Rate_Price) > checkICW) return await kill.reply(chatId, `Você não possui ${values.Win_Rate_Price} I'coins para comprar esse recurso.`, message.id)
			if (Object.keys(mine.Win_Rate).includes(mention)) {
				mine.Win_Rate[mention] -= 1 // EM DESENVOLVIMENTO
			} else {
				// Anotação para o Lucas do futuro que ia desenvolver isso: Pegue o valor e divirta por 10, depois adicione o valor total pelo valor da divisão, 100 / 10 = 10, 100 + 10 = resultado | Aumenta os ganhos do user em 10
				mine.Win_Rate[mention] = 10
			}
			fs.writeFileSync('./lib/config/Gerais/mine.json', JSON.stringify(mine))
			await kill.reply(chatId, `Excelente, você acaba de ganhar 10% de lucro a mais em todas as suas jogadas.`, message.id)
			tools('gaming').addValue(user, Number(-values.Win_Rate_Price), file, chatId, 'coin')
			break

		case '6':
			let checkICM = parseInt(tools('gaming').getValue(user, file, chatId, 'coin'))
			if (Number(values.Mine_Price) > checkICM) return await kill.reply(chatId, `Você não possui ${values.Mine_Price} I'coins para comprar a mineração.`, message.id)
			mine.Miner.push(user) // EM DESENVOLVIMENTO
			fs.writeFileSync('./lib/config/Gerais/mine.json', JSON.stringify(mine))
			await kill.reply(chatId, 'Parabéns pela sua compra da capacidade de minerar!', message.id)
			tools('gaming').addValue(user, Number(-values.Mine_Price), file, chatId, 'coin')
			break

		case '7':
			let checkICV = parseInt(tools('gaming').getValue(user, file, chatId, 'coin'))
			if (Number(values.Vip_Price) > checkICV) return await kill.reply(chatId, `Você não possui ${values.Vip_Price} I'coins para comprar o VIP.`, message.id)
			mine.Vips.push(user) // EM DESENVOLVIMENTO
			fs.writeFileSync('./lib/config/Gerais/mine.json', JSON.stringify(mine))
			await kill.reply(chatId, 'Parabéns por entrar nos VIP"s!', message.id)
			tools('gaming').addValue(user, Number(-values.Vip_Price), file, chatId, 'coin')
			break

		case '8':
			let checkIco = parseInt(tools('gaming').getValue(user, file, chatId, 'coin'))
			if (Number(values.NOBG_Value) > checkIco) return await kill.reply(chatId, `Você não possui ${values.NOBG_Value} I'coins para comprar uma ficha.`, message.id)
			if (Object.keys(mine.NoBG).includes(user)) {
				mine.NoBG[user] += 1
			} else {
				mine.NoBG[user] = 1
			} // EM DESENVOLVIMENTO
			fs.writeFileSync('./lib/config/Gerais/mine.json', JSON.stringify(mine))
			await kill.reply(chatId, `Você comprou uma ficha para usar no comando "NoBg".`, message.id)
			tools('gaming').addValue(user, Number(-values.NOBG_Value), file, chatId, 'coin')
			break

		case '9':
			let checkIcN = parseInt(tools('gaming').getValue(user, file, chatId, 'coin'))
			if (Number(values.Surprise_Price) > checkIcN) return await kill.reply(chatId, `Você não possui ${values.Surprise_Price} I'coins para comprar a surpresa.`, message.id)
			let sorted = tools('others').randVal(['xp', 'coin', 'vip', 'nobg', 'mine', 'rubi', 'dima', 'nada'])
			if (sorted == 'xp' || sorted == 'coin' || sorted == 'rubi' || sorted == 'dima') {
				tools('gaming').addValue(user, Number(values.Surprise_Win), file, sorted)
				await kill.reply(chatId, `Parabéns, você ganhou ${values.Surprise_Win} ${sorted}!`, message.id)
			} else if (sorted == 'vip') {
				if (mine.Vips.includes(user)) {
					tools('gaming').addValue(user, Number(values.Vip_Price), file, chatId, 'coin')
					await kill.reply(chatId, `Você ganhou VIP, mas como você já tinha, você adquiriu ${values.Vip_Price} I'coins!`, message.id)
				} else {
					mine.Vips.push(user)
					fs.writeFileSync('./lib/config/Gerais/mine.json', JSON.stringify(mine))
					await kill.reply(chatId, `Parabéns, você ganhou acesso VIP!`, message.id)
				}
			} else if (sorted == 'nobg') {
				if (Object.keys(mine.NoBG).includes(user)) {
					mine.NoBG[user] += 1
				} else {
					mine.NoBG[user] = 1
				}
				fs.writeFileSync('./lib/config/Gerais/mine.json', JSON.stringify(mine))
				await kill.reply(chatId, `Parabéns, você ganhou uma ficha para usar no comando "NOBG"!`, message.id)
			} else await kill.reply(chatId, `Looserr! Você não ganhou nada dessa vez!`, message.id)
			tools('gaming').addValue(user, Number(-values.Surprise_Price), file, chatId, 'coin')
			break

		case '10':
			let checkIcoin = parseInt(tools('gaming').getValue(user, file, chatId, 'coin'))
			if (Number(values.XP_Pack_Price) > checkIcoin) return await kill.reply(chatId, mylang(region).noMoney(checkIcoin, values.XP_Pack1_Price), message.id)
			tools('gaming').addValue(user, Number(values.XP_Pack), file, 'xp')
			tools('gaming').addValue(user, Number(-values.XP_Pack_Price), file, chatId, 'coin')
			await kill.reply(chatId, `Prontinho, você comprou ${values.XP_Pack} XP por ${values.XP_Pack_Price} I'Coins!`, message.id)
			break

		case '11':
			let checkDiam = parseInt(tools('gaming').getValue(user, file, chatId, 'coin'))
			if (Number(values.Diamonds_Pack_Price) > checkDiam) return await kill.reply(chatId, mylang(region).noMoney(checkDiam, values.Diamonds_Pack_Price), message.id)
			tools('gaming').addValue(user, Number(values.Diamonds_Pack), file, 'dima')
			tools('gaming').addValue(user, Number(-values.Diamonds_Pack_Price), file, chatId, 'coin')
			await kill.reply(chatId, `Prontinho, você comprou ${values.Diamonds_Pack} Diamantes por ${values.Diamonds_Pack_Price} I'Coins!`, message.id)
			break

		case '12':
			let checkRubi = parseInt(tools('gaming').getValue(user, file, chatId, 'coin'))
			if (Number(values.Rubi_Pack_Price) > checkRubi) return await kill.reply(chatId, mylang(region).noMoney(checkRubi, values.Rubi_Pack_Price), message.id)
			tools('gaming').addValue(user, Number(values.Rubi_Pack), file, 'rubi')
			tools('gaming').addValue(user, Number(-values.Rubi_Pack_Price), file, chatId, 'coin')
			await kill.reply(chatId, `Prontinho, você comprou ${values.Rubi_Pack} Rubis por ${values.Rubi_Pack_Price} I'Coins!`, message.id)
			break

		case '13':
			let trocaRubi = parseInt(tools('gaming').getValue(user, file, 'rubi'))
			if (Number(values.Rubi_Change) > trocaRubi) return await kill.reply(chatId, mylang(region).noCambio(trocaRubi, values.Rubi_Change), message.id)
			tools('gaming').addValue(user, Number(-values.Rubi_Change), file, 'rubi')
			tools('gaming').addValue(user, Number(values.Rubi_Change_Win), file, chatId, 'coin')
			await kill.reply(chatId, `Prontinho, você trocou ${values.Rubi_Change} Rubis por ${values.Rubi_Change_Win} I'Coins!`, message.id)
			break

		case '14':
			let trocaDia = parseInt(tools('gaming').getValue(user, file, 'dima'))
			if (Number(values.Diamond_Change_Win) > trocaDia) return await kill.reply(chatId, mylang(region).noCambio(trocaDia, values.Diamond_Change_Win), message.id)
			tools('gaming').addValue(user, Number(-values.Diamond_Change), file, 'dima')
			tools('gaming').addValue(user, Number(values.Diamond_Change_Win), file, chatId, 'coin')
			await kill.reply(chatId, `Prontinho, você trocou ${values.Diamond_Change} Diamantes por ${values.Diamond_Change_Win} I'Coins!`, message.id)
			break
		// Disable ghost f* line
	}

}