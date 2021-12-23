const {
	tools
} = require('./index')
const fs = require('fs')
const mine = JSON.parse(fs.readFileSync('./lib/config/Gerais/mine.json'))

module.exports = shop = async (kill, message, args, user, file) => {

	switch (args[0]) {

		case '1':
			let checkGMV = parseInt(tools('gaming').getValue(user, file, 'coin'))
			if (Number(shop.Guild_Rate_Price) < checkGMV) return await kill.reply(message.from, `Você não possui ${shop.Guild_Rate_Price} I'coins para comprar esse recurso.`, message.id)
			if (Object.keys(mine.Win_Rate_Guild).includes(args[1])) {
				mine.Win_Rate_Guild[args[1]] -= 1
			} else {
				mine.Win_Rate_Guild[user] = 10 // EM DESENVOLVIMENTO
				// Anotação para o Lucas do futuro que ia desenvolver isso: Pegue o valor e divirta por 10, depois adicione o valor total pelo valor da divisao, 100 / 10 = 10, 100 + 10 = resultado
			}
			fs.writeFileSync('./lib/config/Gerais/mine.json', JSON.stringify(mine))
			await kill.reply(message.from, `Sua Guilda agora tem mais 10% do valor total adicionado aos ganhos totais.`, message.id)
			tools('gaming').addValue(user, Number(-shop.Guild_Rate_Price), file, 'coin')
			break

		case '2':
			let checkStl = parseInt(tools('gaming').getValue(user, file, 'coin'))
			if (Number(shop.Stop_Loss_Price) < checkStl) return await kill.reply(message.from, `Você não possui ${shop.Stop_Loss_Price} I'coins para comprar esse recurso.`, message.id)
			if (Object.keys(mine.Stop_Loss).includes(user)) {
				mine.Stop_Loss[user] -= 1 // EM DESENVOLVIMENTO
			} else {
				// Anotação para o Lucas do futuro que ia desenvolver isso: Pegue o valor e divirta por 10, depois subtraia o valor total pelo valor da divisao, 100 / 10 = 10, 100 - 10 = resultado | reduz em y XP as percas no cassino
				mine.Stop_Loss[user] = 10
			}
			fs.writeFileSync('./lib/config/Gerais/mine.json', JSON.stringify(mine))
			await kill.reply(message.from, `Sua taxa de percas reduziu em mais 10%, agora você perderá menos XP.`, message.id)
			tools('gaming').addValue(user, Number(-shop.Stop_Loss_Price), file, 'coin')
			break

		case '3':
			let checkLaV = parseInt(tools('gaming').getValue(user, file, 'coin'))
			if (Number(shop.Lose_All_Price) < checkLaV) return await kill.reply(message.from, `Você não possui ${shop.Lose_All_Price} I'coins para comprar esse recurso.`, message.id)
			file[message.from][message.mentionedJidList[0]]['xp'] = 0
			file[message.from][message.mentionedJidList[0]]['level'] = 0
			file[message.from][message.mentionedJidList[0]]['coin'] = 0
			file[message.from][message.mentionedJidList[0]]['dima'] = 0
			file[message.from][message.mentionedJidList[0]]['rubi'] = 0
			fs.writeFileSync('./lib/config/Gerais/level.json', JSON.stringify(file))
			await kill.sendTextWithMentions(message.from, `Que pena @${message.mentionedJidList[0].replace('@c.us', '')}, parece que você perdeu tudo, junte o suficiente para se vingar haha.`, message.id)
			tools('gaming').addValue(user, Number(-shop.Lose_All_Price), file, 'coin')
			break

		case '4':
			let checkILr = parseInt(tools('gaming').getValue(user, file, 'coin'))
			if (Number(shop.Lose_Rate_Price) < checkILr) return await kill.reply(message.from, `Você não possui ${shop.Lose_Rate_Price} I'coins para comprar esse recurso.`, message.id)
			if (Object.keys(mine.Friend_Loss).includes(user)) {
				mine.Friend_Loss[user] -= 1 // EM DESENVOLVIMENTO
			} else {
				// Anotação para o Lucas do futuro que ia desenvolver isso: Pegue o valor e divirta por 10, depois subtraia o valor total pelo valor da divisao, 100 / 10 = 10, 100 - 10 = resultado | Reduz os ganhos de alguem no cassino em 10
				mine.Friend_Loss[user] = 10
			}
			fs.writeFileSync('./lib/config/Gerais/mine.json', JSON.stringify(mine))
			await kill.sendTextWithMentions(message.from, `Parece que você acabou de perder 10% de todos os seus futuros lucros em jogos, caro @${user.replace('@c.us', '')}.\nJunte o suficiente para se vingar haha.`, message.id)
			tools('gaming').addValue(user, Number(-shop.Lose_Rate_Price), file, 'coin')
			break

		case '5':
			let checkICW = parseInt(tools('gaming').getValue(user, file, 'coin'))
			if (Number(shop.Win_Rate_Price) < checkICW) return await kill.reply(message.from, `Você não possui ${shop.Win_Rate_Price} I'coins para comprar esse recurso.`, message.id)
			if (Object.keys(mine.Win_Rate).includes(user)) {
				mine.Win_Rate[user] -= 1 // EM DESENVOLVIMENTO
			} else {
				// Anotação para o Lucas do futuro que ia desenvolver isso: Pegue o valor e divirta por 10, depois adicione o valor total pelo valor da divisao, 100 / 10 = 10, 100 + 10 = resultado | Aumenta os ganhos do user em 10
				mine.Win_Rate[user] = 10
			}
			fs.writeFileSync('./lib/config/Gerais/mine.json', JSON.stringify(mine))
			await kill.reply(message.from, `Excelente, você acaba de ganhar 10% de lucro a mais em todas as suas jogadas.`, message.id)
			tools('gaming').addValue(user, Number(-shop.Win_Rate_Price), file, 'coin')
			break

		case '6':
			let checkICM = parseInt(tools('gaming').getValue(user, file, 'coin'))
			if (Number(shop.Mine_Price) < checkICM) return await kill.reply(message.from, `Você não possui ${shop.Mine_Price} I'coins para comprar a mineração.`, message.id)
			mine.Miner.push(user) // EM DESENVOLVIMENTO
			fs.writeFileSync('./lib/config/Gerais/mine.json', JSON.stringify(mine))
			await kill.reply(message.from, 'Parabéns pela sua compra da capacidade de minerar!', message.id)
			tools('gaming').addValue(user, Number(-shop.Mine_Price), file, 'coin')
			break

		case '7':
			let checkICV = parseInt(tools('gaming').getValue(user, file, 'coin'))
			if (Number(shop.Vip_Price) < checkICV) return await kill.reply(message.from, `Você não possui ${shop.Vip_Price} I'coins para comprar o VIP.`, message.id)
			mine.Vips.push(user) // EM DESENVOLVIMENTO
			fs.writeFileSync('./lib/config/Gerais/mine.json', JSON.stringify(mine))
			await kill.reply(message.from, 'Parabéns por entrar nos VIP"s!', message.id)
			tools('gaming').addValue(user, Number(-shop.Vip_Price), file, 'coin')
			break

		case '8':
			let checkIco = parseInt(tools('gaming').getValue(user, file, 'coin'))
			if (Number(shop.NOBG_Value) < checkIco) return await kill.reply(message.from, `Você não possui ${shop.NOBG_Value} I'coins para comprar uma ficha.`, message.id)
			if (Object.keys(mine.NoBG).includes(user)) {
				mine.NoBG[user] += 1
			} else {
				mine.NoBG[user] = 1
			} // EM DESENVOLVIMENTO
			fs.writeFileSync('./lib/config/Gerais/mine.json', JSON.stringify(mine))
			await kill.reply(message.from, `Você comprou uma ficha para usar no comando "NoBg".`, message.id)
			tools('gaming').addValue(user, Number(-shop.NOBG_Value), file, 'coin')
			break

		case '9':
			let checkIcN = parseInt(tools('gaming').getValue(user, file, 'coin'))
			if (Number(shop.Surprise_Price) < checkIcN) return await kill.reply(message.from, `Você não possui ${shop.Surprise_Price} I'coins para comprar a surpresa.`, message.id)
			let sorted = tools('others').randVal(['xp', 'coin', 'vip', 'nobg', 'mine', 'rubi', 'dima', 'nada'])
			if (sorted == 'xp' || sorted == 'coin' || sorted == 'rubi' || sorted == 'dima') {
				tools('gaming').addValue(user, Number(shop.Surprise_Win), file, sorted)
				await kill.reply(message.from, `Parabéns, você ganhou ${shop.Surprise_Win} ${sorted}!`, message.id)
			} else if (sorted == 'vip') {
				if (mine.Vips.includes(user)) {
					tools('gaming').addValue(user, Number(shop.Vip_Price), file, 'coin')
					await kill.reply(message.from, `Você ganhou VIP, mas como você já tinha, você adquiriu ${shop.Vip_Price} I'coins!`, message.id)
				} else {
					mine.Vips.push(user)
					fs.writeFileSync('./lib/config/Gerais/mine.json', JSON.stringify(mine))
					await kill.reply(message.from, `Parabéns, você ganhou acesso VIP!`, message.id)
				}
			} else if (sorted == 'nobg') {
				if (Object.keys(mine.NoBG).includes(user)) {
					mine.NoBG[user] += 1
				} else {
					mine.NoBG[user] = 1
				}
				fs.writeFileSync('./lib/config/Gerais/mine.json', JSON.stringify(mine))
				await kill.reply(message.from, `Parabéns, você ganhou uma ficha para usar no comando "NOBG"!`, message.id)
			} else await kill.reply(message.from, `Looserr! Você não ganhou nada dessa vez!`, message.id)
			tools('gaming').addValue(user, Number(-shop.Surprise_Price), file, 'coin')
			break

		case '10':
			let checkIcoin = parseInt(tools('gaming').getValue(user, file, 'coin'))
			if (Number(shop.XP_Pack_Price) < checkIcoin) return await kill.reply(message.from, mess.noMoney(checkIcoin, shop.XP_Pack1_Price), message.id)
			tools('gaming').addValue(sender.id, Number(shop.XP_Pack), file, 'xp')
			tools('gaming').addValue(user, Number(-shop.XP_Pack_Price), file, 'coin')
			await kill.reply(message.from, `Prontinho, você comprou ${shop.XP_Pack} XP por ${shop.XP_Pack_Price} I'Coins!`, message.id)
			break

		case '11':
			let checkDiam = parseInt(tools('gaming').getValue(user, file, 'coin'))
			if (Number(shop.Diamonds_Pack_Price) < checkDiam) return await kill.reply(message.from, mess.noMoney(checkDiam, shop.Diamonds_Pack_Price), message.id)
			tools('gaming').addValue(sender.id, Number(shop.Diamonds_Pack), file, 'dima')
			tools('gaming').addValue(user, Number(-shop.Diamonds_Pack_Price), file, 'coin')
			await kill.reply(message.from, `Prontinho, você comprou ${shop.Diamonds_Pack} Diamantes por ${shop.Diamonds_Pack_Price} I'Coins!`, message.id)
			break

		case '12':
			let checkRubi = parseInt(tools('gaming').getValue(user, file, 'coin'))
			if (Number(shop.Rubi_Pack_Price) < checkRubi) return await kill.reply(message.from, mess.noMoney(checkDiam, shop.Rubi_Pack_Price), message.id)
			tools('gaming').addValue(sender.id, Number(shop.Rubi_Pack), file, 'rubi')
			tools('gaming').addValue(user, Number(-shop.Rubi_Pack_Price), file, 'coin')
			await kill.reply(message.from, `Prontinho, você comprou ${shop.Rubi_Pack} Rubis por ${shop.Rubi_Pack_Price} I'Coins!`, message.id)
			break

		case '13':
			let trocaRubi = parseInt(tools('gaming').getValue(user, file, 'rubi'))
			if (Number(shop.Rubi_Change) < trocaRubi) return await kill.reply(message.from, mess.noCambio(trocaRubi, shop.Rubi_Change), message.id)
			tools('gaming').addValue(sender.id, Number(-shop.Rubi_Change), file, 'rubi')
			tools('gaming').addValue(user, Number(shop.Rubi_Change_Win), file, 'coin')
			await kill.reply(message.from, `Prontinho, você trocou ${shop.Rubi_Change} Rubis por ${shop.Rubi_Change_Win} I'Coins!`, message.id)
			break

		case '14':
			let trocaDia = parseInt(tools('gaming').getValue(user, file, 'rubi'))
			if (Number(shop.Diamond_Change_Win) < trocaDia) return await kill.reply(message.from, mess.noCambio(checkDiam, shop.Diamond_Change_Win), message.id)
			tools('gaming').addValue(sender.id, Number(-shop.Diamond_Change), file, 'dima')
			tools('gaming').addValue(user, Number(shop.Diamond_Change_Win), file, 'coin')
			await kill.reply(message.from, `Prontinho, você trocou ${shop.Diamond_Change} Diamantes por ${shop.Diamond_Change_Win} I'Coins!`, message.id)
			break
		// Disable ghost f* line
	}

}