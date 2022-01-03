const {
	tools
} = require('./index')
const fs = require('fs')
const mine = JSON.parse(fs.readFileSync('./lib/config/Gerais/mine.json'))
const config = JSON.parse(fs.readFileSync('./lib/config/Gerais/shop.json'))

module.exports = shop = async (kill, message, args, user, file, chatId) => {

	switch (args[0]) {

		case '1':
			let checkGMV = parseInt(tools('gaming').getValue(user, file, chatId, 'coin'))
			if (Number(config.Guild_Rate_Price) > checkGMV) return await kill.reply(chatId, `Você não possui ${config.Guild_Rate_Price} I'coins para comprar esse recurso.`, message.id)
			if (Object.keys(mine.Win_Rate_Guild).includes(args[1])) {
				mine.Win_Rate_Guild[args[1]] -= 1
			} else {
				mine.Win_Rate_Guild[user] = 10 // EM DESENVOLVIMENTO
				// Anotação para o Lucas do futuro que ia desenvolver isso: Pegue o valor e divirta por 10, depois adicione o valor total pelo valor da divisao, 100 / 10 = 10, 100 + 10 = resultado
			}
			fs.writeFileSync('./lib/config/Gerais/mine.json', JSON.stringify(mine))
			await kill.reply(chatId, `Sua Guilda agora tem mais 10% do valor total adicionado aos ganhos totais.`, message.id)
			tools('gaming').addValue(user, Number(-config.Guild_Rate_Price), file, chatId, 'coin')
			break

		case '2':
			let checkStl = parseInt(tools('gaming').getValue(user, file, chatId, 'coin'))
			if (Number(config.Stop_Loss_Price) > checkStl) return await kill.reply(chatId, `Você não possui ${config.Stop_Loss_Price} I'coins para comprar esse recurso.`, message.id)
			if (Object.keys(mine.Stop_Loss).includes(user)) {
				mine.Stop_Loss[user] -= 1 // EM DESENVOLVIMENTO
			} else {
				// Anotação para o Lucas do futuro que ia desenvolver isso: Pegue o valor e divirta por 10, depois subtraia o valor total pelo valor da divisao, 100 / 10 = 10, 100 - 10 = resultado | reduz em y XP as percas no cassino
				mine.Stop_Loss[user] = 10
			}
			fs.writeFileSync('./lib/config/Gerais/mine.json', JSON.stringify(mine))
			await kill.reply(chatId, `Sua taxa de percas reduziu em mais 10%, agora você perderá menos XP.`, message.id)
			tools('gaming').addValue(user, Number(-config.Stop_Loss_Price), file, chatId, 'coin')
			break

		case '3':
			let checkLaV = parseInt(tools('gaming').getValue(user, file, chatId, 'coin'))
			if (Number(config.Lose_All_Price) > checkLaV) return await kill.reply(chatId, `Você não possui ${config.Lose_All_Price} I'coins para comprar esse recurso.`, message.id)
			file[chatId][user]['xp'] = 0
			file[chatId][user]['level'] = 0
			file[chatId][user]['coin'] = 0
			file[chatId][user]['dima'] = 0
			file[chatId][user]['rubi'] = 0
			fs.writeFileSync('./lib/config/Gerais/level.json', JSON.stringify(file))
			await kill.sendTextWithMentions(chatId, `Que pena @${message.mentionedJidList[0].replace('@c.us', '')}, parece que você perdeu tudo, junte o suficiente para se vingar haha.`, message.id)
			tools('gaming').addValue(user, Number(-config.Lose_All_Price), file, chatId, 'coin')
			break

		case '4':
			let checkILr = parseInt(tools('gaming').getValue(user, file, chatId, 'coin'))
			if (Number(config.Lose_Rate_Price) > checkILr) return await kill.reply(chatId, `Você não possui ${config.Lose_Rate_Price} I'coins para comprar esse recurso.`, message.id)
			if (Object.keys(mine.Friend_Loss).includes(user)) {
				mine.Friend_Loss[user] -= 1 // EM DESENVOLVIMENTO
			} else {
				// Anotação para o Lucas do futuro que ia desenvolver isso: Pegue o valor e divirta por 10, depois subtraia o valor total pelo valor da divisao, 100 / 10 = 10, 100 - 10 = resultado | Reduz os ganhos de alguem no cassino em 10
				mine.Friend_Loss[user] = 10
			}
			fs.writeFileSync('./lib/config/Gerais/mine.json', JSON.stringify(mine))
			await kill.sendTextWithMentions(chatId, `Parece que você acabou de perder 10% de todos os seus futuros lucros em jogos, caro @${user.replace('@c.us', '')}.\nJunte o suficiente para se vingar haha.`, message.id)
			tools('gaming').addValue(user, Number(-config.Lose_Rate_Price), file, chatId, 'coin')
			break

		case '5':
			let checkICW = parseInt(tools('gaming').getValue(user, file, chatId, 'coin'))
			if (Number(config.Win_Rate_Price) > checkICW) return await kill.reply(chatId, `Você não possui ${config.Win_Rate_Price} I'coins para comprar esse recurso.`, message.id)
			if (Object.keys(mine.Win_Rate).includes(user)) {
				mine.Win_Rate[user] -= 1 // EM DESENVOLVIMENTO
			} else {
				// Anotação para o Lucas do futuro que ia desenvolver isso: Pegue o valor e divirta por 10, depois adicione o valor total pelo valor da divisao, 100 / 10 = 10, 100 + 10 = resultado | Aumenta os ganhos do user em 10
				mine.Win_Rate[user] = 10
			}
			fs.writeFileSync('./lib/config/Gerais/mine.json', JSON.stringify(mine))
			await kill.reply(chatId, `Excelente, você acaba de ganhar 10% de lucro a mais em todas as suas jogadas.`, message.id)
			tools('gaming').addValue(user, Number(-config.Win_Rate_Price), file, chatId, 'coin')
			break

		case '6':
			let checkICM = parseInt(tools('gaming').getValue(user, file, chatId, 'coin'))
			if (Number(config.Mine_Price) > checkICM) return await kill.reply(chatId, `Você não possui ${config.Mine_Price} I'coins para comprar a mineração.`, message.id)
			mine.Miner.push(user) // EM DESENVOLVIMENTO
			fs.writeFileSync('./lib/config/Gerais/mine.json', JSON.stringify(mine))
			await kill.reply(chatId, 'Parabéns pela sua compra da capacidade de minerar!', message.id)
			tools('gaming').addValue(user, Number(-config.Mine_Price), file, chatId, 'coin')
			break

		case '7':
			let checkICV = parseInt(tools('gaming').getValue(user, file, chatId, 'coin'))
			if (Number(config.Vip_Price) > checkICV) return await kill.reply(chatId, `Você não possui ${config.Vip_Price} I'coins para comprar o VIP.`, message.id)
			mine.Vips.push(user) // EM DESENVOLVIMENTO
			fs.writeFileSync('./lib/config/Gerais/mine.json', JSON.stringify(mine))
			await kill.reply(chatId, 'Parabéns por entrar nos VIP"s!', message.id)
			tools('gaming').addValue(user, Number(-config.Vip_Price), file, chatId, 'coin')
			break

		case '8':
			let checkIco = parseInt(tools('gaming').getValue(user, file, chatId, 'coin'))
			if (Number(config.NOBG_Value) > checkIco) return await kill.reply(chatId, `Você não possui ${config.NOBG_Value} I'coins para comprar uma ficha.`, message.id)
			if (Object.keys(mine.NoBG).includes(user)) {
				mine.NoBG[user] += 1
			} else {
				mine.NoBG[user] = 1
			} // EM DESENVOLVIMENTO
			fs.writeFileSync('./lib/config/Gerais/mine.json', JSON.stringify(mine))
			await kill.reply(chatId, `Você comprou uma ficha para usar no comando "NoBg".`, message.id)
			tools('gaming').addValue(user, Number(-config.NOBG_Value), file, chatId, 'coin')
			break

		case '9':
			let checkIcN = parseInt(tools('gaming').getValue(user, file, chatId, 'coin'))
			if (Number(config.Surprise_Price) > checkIcN) return await kill.reply(chatId, `Você não possui ${config.Surprise_Price} I'coins para comprar a surpresa.`, message.id)
			let sorted = tools('others').randVal(['xp', 'coin', 'vip', 'nobg', 'mine', 'rubi', 'dima', 'nada'])
			if (sorted == 'xp' || sorted == 'coin' || sorted == 'rubi' || sorted == 'dima') {
				tools('gaming').addValue(user, Number(config.Surprise_Win), file, sorted)
				await kill.reply(chatId, `Parabéns, você ganhou ${config.Surprise_Win} ${sorted}!`, message.id)
			} else if (sorted == 'vip') {
				if (mine.Vips.includes(user)) {
					tools('gaming').addValue(user, Number(config.Vip_Price), file, chatId, 'coin')
					await kill.reply(chatId, `Você ganhou VIP, mas como você já tinha, você adquiriu ${config.Vip_Price} I'coins!`, message.id)
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
			tools('gaming').addValue(user, Number(-config.Surprise_Price), file, chatId, 'coin')
			break

		case '10':
			let checkIcoin = parseInt(tools('gaming').getValue(user, file, chatId, 'coin'))
			if (Number(config.XP_Pack_Price) > checkIcoin) return await kill.reply(chatId, mess.noMoney(checkIcoin, config.XP_Pack1_Price), message.id)
			tools('gaming').addValue(user, Number(config.XP_Pack), file, 'xp')
			tools('gaming').addValue(user, Number(-config.XP_Pack_Price), file, chatId, 'coin')
			await kill.reply(chatId, `Prontinho, você comprou ${config.XP_Pack} XP por ${config.XP_Pack_Price} I'Coins!`, message.id)
			break

		case '11':
			let checkDiam = parseInt(tools('gaming').getValue(user, file, chatId, 'coin'))
			if (Number(config.Diamonds_Pack_Price) > checkDiam) return await kill.reply(chatId, mess.noMoney(checkDiam, config.Diamonds_Pack_Price), message.id)
			tools('gaming').addValue(user, Number(config.Diamonds_Pack), file, 'dima')
			tools('gaming').addValue(user, Number(-config.Diamonds_Pack_Price), file, chatId, 'coin')
			await kill.reply(chatId, `Prontinho, você comprou ${config.Diamonds_Pack} Diamantes por ${config.Diamonds_Pack_Price} I'Coins!`, message.id)
			break

		case '12':
			let checkRubi = parseInt(tools('gaming').getValue(user, file, chatId, 'coin'))
			if (Number(config.Rubi_Pack_Price) > checkRubi) return await kill.reply(chatId, mess.noMoney(checkDiam, config.Rubi_Pack_Price), message.id)
			tools('gaming').addValue(user, Number(config.Rubi_Pack), file, 'rubi')
			tools('gaming').addValue(user, Number(-config.Rubi_Pack_Price), file, chatId, 'coin')
			await kill.reply(chatId, `Prontinho, você comprou ${config.Rubi_Pack} Rubis por ${config.Rubi_Pack_Price} I'Coins!`, message.id)
			break

		case '13':
			let trocaRubi = parseInt(tools('gaming').getValue(user, file, 'rubi'))
			if (Number(config.Rubi_Change) > trocaRubi) return await kill.reply(chatId, mess.noCambio(trocaRubi, config.Rubi_Change), message.id)
			tools('gaming').addValue(user, Number(-config.Rubi_Change), file, 'rubi')
			tools('gaming').addValue(user, Number(config.Rubi_Change_Win), file, chatId, 'coin')
			await kill.reply(chatId, `Prontinho, você trocou ${config.Rubi_Change} Rubis por ${config.Rubi_Change_Win} I'Coins!`, message.id)
			break

		case '14':
			let trocaDia = parseInt(tools('gaming').getValue(user, file, 'rubi'))
			if (Number(config.Diamond_Change_Win) > trocaDia) return await kill.reply(chatId, mess.noCambio(checkDiam, config.Diamond_Change_Win), message.id)
			tools('gaming').addValue(user, Number(-config.Diamond_Change), file, 'dima')
			tools('gaming').addValue(user, Number(config.Diamond_Change_Win), file, chatId, 'coin')
			await kill.reply(chatId, `Prontinho, você trocou ${config.Diamond_Change} Diamantes por ${config.Diamond_Change_Win} I'Coins!`, message.id)
			break
		// Disable ghost f* line
	}

}