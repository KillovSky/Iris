const fs = require('fs')
const config = require('../config/Gerais/config.json')
const patents = require('../config/Gerais/patentes.json')

exports.getValue = async (user, place, chatId, what) => {
	if (Object.keys(place).includes([chatId])) {
		if (Object.keys(place[chatId]).includes(user)) {
			if (what !== null) {
				return place[chatId][user][what]
			} else return place[chatId][user]
		}
	} else {
		place[chatId] = {
			[user]: {
				xp: 0,
				level: 0,
				msg: 0,
				coin: 100,
				guild: 'NO_GUILD',
				dima: 0,
				rubi: 0
			}
		}
		await fs.writeFileSync('./lib/config/Gerais/level.json', JSON.stringify(place))
		return "0"
	}
}

// ADICIONA VALORES
exports.addValue = async (user, amount, place, chatId, what) => {
	if (Object.keys(place).includes([chatId])) {
		if (Object.keys(place[chatId]).includes(user)) {
			place[chatId][user][what] += Number(amount)
		} else {
			place[chatId] = {
				[user]: {
					xp: Number(what == 'xp' ? amount : 0),
					level: Number(what == 'level' ? amount : 0),
					msg: 0,
					coin: Number(what == 'coin' ? amount : 100),
					guild: 'NO_GUILD',
					dima: Number(what == 'dima' ? amount : 0),
					rubi: Number(what == 'rubi' ? amount : 0)
				}
			}
		}
	} else {
		place[chatId] = {
			[user]: {
				xp: Number(what == 'xp' ? amount : 0),
				level: Number(what == 'level' ? amount : 0),
				msg: 0,
				coin: Number(what == 'coin' ? amount : 100),
				guild: 'NO_GUILD',
				dima: Number(what == 'dima' ? amount : 0),
				rubi: Number(what == 'rubi' ? amount : 0)
			}
		}
	}
	await fs.writeFileSync('./lib/config/Gerais/level.json', JSON.stringify(place))
}

// Isso cria uma object que salva quem já ganhou XP em 'x' segundos
xpGain = new Set()

// Verifica se o usuario já recebeu XP em 'x' segundos
exports.isWin = (userId) => {
	return xpGain.has(userId)
}

// Função que espera certo tempo para dar XP
exports.wait = (userId) => {
	xpGain.add(userId)
	setTimeout(() => {
		return xpGain.delete(userId)
	}, Number(config.Wait_to_Win) * 1000)
}

// Adiciona limite ao usuário
exports.addLimit = async (user, place, what) => {
	place[what][user] = {
		time: Date.now()
	}
	await fs.writeFileSync('./lib/config/Gerais/limit.json', JSON.stringify(place))
}

// Adquire o limite do usuário
exports.isLimit = (user, place, what) => {
	if (Object.keys(place[what]).includes(user)) {
		let stealTime = place[what][user].time
		if (stealTime !== undefined && Number(config.Wait_to_Play * 60000) - (Date.now() - stealTime) > 0) {
			return true
		} else return false
	} else return false
}

// As patentes
exports.getPatent = (nivel) => {
	var role = patents.a0
	if (nivel <= 3) {
		role = role
	} else if (nivel <= 5) {
		role = patents.a1
	} else if (nivel <= 10) {
		role = patents.a2
	} else if (nivel <= 15) {
		role = patents.a3
	} else if (nivel <= 20) {
		role = patents.a4
	} else if (nivel <= 25) {
		role = patents.a5
	} else if (nivel <= 30) {
		role = patents.a6
	} else if (nivel <= 35) {
		role = patents.a7
	} else if (nivel <= 40) {
		role = patents.a8
	} else if (nivel <= 45) {
		role = patents.a9
	} else if (nivel <= 50) {
		role = patents.a10
	} else if (nivel <= 55) {
		role = patents.a11
	} else if (nivel <= 60) {
		role = patents.a12
	} else if (nivel <= 65) {
		role = patents.a13
	} else if (nivel <= 70) {
		role = patents.a14
	} else if (nivel <= 75) {
		role = patents.a15
	} else if (nivel <= 80) {
		role = patents.a16
	} else if (nivel <= 85) {
		role = patents.a17
	} else if (nivel <= 90) {
		role = patents.a18
	} else if (nivel <= 95) {
		role = patents.a19
	} else if (nivel <= 100) {
		role = patents.a20
	} else if (nivel <= 200) {
		role = patents.a21
	} else if (nivel <= 300) {
		role = patents.a22
	} else if (nivel <= 400) {
		role = patents.a23
	} else if (nivel <= 500) {
		role = patents.a24
	} else if (nivel <= 550) {
		role = patents.a25
	} else if (nivel <= 600) {
		role = patents.a26
	} else if (nivel <= 700) {
		role = patents.a27
	} else if (nivel <= 800) {
		role = patents.a28
	} else if (nivel <= 900) {
		role = patents.a29
	} else if (nivel <= 1000 || nivel >= 1000) {
		role = patents.a30
	}
	return role
}

// Adquire o XP necessario para upar
exports.LevelEXP = (level) => {
	return Number(config.XP_Difficulty) * Math.pow(level, 2) * Number(config.XP_Difficulty) + 1000
}

// Faz a mudança de Guilda
exports.changeGuild = async (user, place, guild) => {
	place[user]['guild'] = guild
	await fs.writeFileSync('./lib/config/Gerais/level.json', JSON.stringify(place))
}