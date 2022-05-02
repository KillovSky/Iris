const fs = require('fs')
const config = JSON.parse(fs.readFileSync('./lib/config/Settings/config.json'))
const patents = JSON.parse(fs.readFileSync('./lib/config/Gerais/patentes.json'))
const {
	tools
} = require('./index')

exports.getValue = (user, place, chatId, what) => {
	if (Object.keys(place).includes(chatId)) {
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
				dima: 100,
				rubi: 100
			}
		}
		fs.writeFileSync('./lib/config/Gerais/level.json', JSON.stringify(place, null, "\t"))
		if (what !== null) {
			return place[chatId][user][what]
		} else return place[chatId][user]
	}
}

// ADICIONA VALORES
exports.addValue = (user, amount, place, chatId, what) => {
	if (Object.keys(place).includes(chatId)) {
		if (Object.keys(place[chatId]).includes(user)) {
			place[chatId][user][what] += Number(amount)
		} else {
			place[chatId][user] = {
				xp: Number(what == 'xp' ? amount : 0),
				level: Number(what == 'level' ? amount : 0),
				msg: 0,
				coin: Number(what == 'coin' ? amount : 100),
				guild: 'NO_GUILD',
				dima: Number(what == 'dima' ? amount : 100),
				rubi: Number(what == 'rubi' ? amount : 100)
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
				dima: Number(what == 'dima' ? amount : 100),
				rubi: Number(what == 'rubi' ? amount : 100)
			}
		}
	}
	fs.writeFileSync('./lib/config/Gerais/level.json', JSON.stringify(place, null, "\t"))
}

exports.resetValue = (user, place, chatId) => {
	if (Object.keys(place).includes(chatId)) {
		if (Object.keys(place[chatId]).includes(user)) {
			place[chatId][user]['xp'] = 0
			place[chatId][user]['level'] = 0
			place[chatId][user]['coin'] = 100
			place[chatId][user]['dima'] = 100
			place[chatId][user]['rubi'] = 100
		} else {
			place[chatId] = {
				[user]: {
					xp: 0,
					level: 0,
					msg: 0,
					coin: 100,
					guild: 'NO_GUILD',
					dima: 100,
					rubi: 100
				}
			}
		}
	} else {
		place[chatId] = {
			[user]: {
				xp: 0,
				level: 0,
				msg: 0,
				coin: 100,
				guild: 'NO_GUILD',
				dima: 100,
				rubi: 100
			}
		}
	}
	fs.writeFileSync('./lib/config/Gerais/level.json', JSON.stringify(place, null, "\t"))
}

// Isso cria uma object que salva quem já ganhou XP em 'x' segundos
xpGain = new Set()

// Verifica se o usuário já recebeu XP em 'x' segundos
exports.isWin = (userId) => xpGain.has(userId)

// Função que espera certo tempo para dar XP
exports.wait = (userId) => {
	xpGain.add(userId)
	setTimeout(() => {
		return xpGain.delete(userId)
	}, Number(config.Wait_to_Win) * 1000)
}

// Adiciona limite ao usuário
exports.addLimit = (user, place, chatId, what) => {
	if (Object.keys(place[what]).includes(chatId)) {
		place[what][chatId][user] = Date.now()
	} else {
		place[what] = {
			[chatId]: {
				[user]: Date.now()
			}
		}
	}
	fs.writeFileSync('./lib/config/Gerais/limit.json', JSON.stringify(place, null, "\t"))
}

// Adquire todos os limites ou um especifico
exports.getLimit = (user, place, chatId, getDetails, whoFilter) => {
	let Timings = {}
	for (let res of Object.keys(place)) {
		Timings[res] = {
			"Start_Time": 0,
			"Seconds_Left": 0,
			"Minutes_Left": 0,
			"Hours_Left": 0,
			"Days_Left": 0,
			"Last_Time_Seconds": 0,
			"Last_Time_Minutes": 0,
			"Last_Time_Hour": 0,
			"Last_Time_Days": 0,
			"isLimit": false
		}
		if (Object.keys(place[res]).includes(chatId)) {
			if (Object.keys(place[res][chatId]).includes(user)) {
				Timings[res]["Start_Time"] = place[res][chatId][user]
				Timings[res]["Last_Time_Seconds"] = ((Date.now() - Timings[res]["Start_Time"]) / 1e3).toFixed(2)
				Timings[res]["Last_Time_Minutes"] = ((Date.now() - Timings[res]["Start_Time"]) / 6e4).toFixed(2)
				Timings[res]["Last_Time_Hour"] = ((Date.now() - Timings[res]["Start_Time"]) / 36e5).toFixed(2)
				Timings[res]["Last_Time_Days"] = ((Date.now() - Timings[res]["Start_Time"]) / 864e+5).toFixed(2)
				if (place[res][chatId][user] !== undefined && Number(config.Wait_to_Play * 60000) - (Date.now() - place[res][chatId][user]) > 0) {
					Timings[res]["isLimit"] = true
					Timings[res]["Seconds_Left"] = tools('others').getRemainTime(1e3, place[res][chatId][user])
					Timings[res]["Minutes_Left"] = tools('others').getRemainTime(6e4, place[res][chatId][user])
					Timings[res]["Hours_Left"] = tools('others').getRemainTime(36e5, place[res][chatId][user])
					Timings[res]["Days_Left"] = tools('others').getRemainTime(864e+5, place[res][chatId][user])
				}
			}
		}
	}
	if (getDetails == false && whoFilter) {
		return Timings[whoFilter]['isLimit']
	} else return Timings
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
exports.LevelEXP = (level) => Number(config.XP_Difficulty) * Math.pow(level, 2) * Number(config.XP_Difficulty) + 1000

// Faz a mudança de Guilda
exports.changeGuild = (user, place, chatId, guild) => {
	place[chatId][user]['guild'] = guild
	fs.writeFileSync('./lib/config/Gerais/level.json', JSON.stringify(place, null, "\t"))
}

exports.verify = (tttSet, chatId) => {
	let whoWin = 0
	for (let i of ['xjogadas', 'ojogadas']) {
		if (tttSet[chatId][i].includes('a1') && tttSet[chatId][i].includes('a2') && tttSet[chatId][i].includes('a3') || tttSet[chatId][i].includes('b1') && tttSet[chatId][i].includes('b2') && tttSet[chatId][i].includes('b3') || tttSet[chatId][i].includes('c1') && tttSet[chatId][i].includes('c2') && tttSet[chatId][i].includes('c3') || tttSet[chatId][i].includes('a1') && tttSet[chatId][i].includes('b1') && tttSet[chatId][i].includes('c1') || tttSet[chatId][i].includes('a2') && tttSet[chatId][i].includes('b2') && tttSet[chatId][i].includes('c2') || tttSet[chatId][i].includes('a3') && tttSet[chatId][i].includes('b3') && tttSet[chatId][i].includes('c3') || tttSet[chatId][i].includes('a1') && tttSet[chatId][i].includes('b2') && tttSet[chatId][i].includes('c3') || tttSet[chatId][i].includes('a3') && tttSet[chatId][i].includes('b2') && tttSet[chatId][i].includes('c1')) {
			if (i == 'xjogadas') {
				whoWin = 1
			}
			if (i == 'ojogadas') {
				whoWin = 2
			}
		}
	}
	if (tttSet[chatId].finalAwnser == 0 && tttSet[chatId].tttboard.a1 !== '-' && tttSet[chatId].tttboard.a2 !== '-' && tttSet[chatId].tttboard.a3 !== '-' && tttSet[chatId].tttboard.b1 !== '-' && tttSet[chatId].tttboard.b2 !== '-' && tttSet[chatId].tttboard.b3 !== '-' && tttSet[chatId].tttboard.c1 !== '-' && tttSet[chatId].tttboard.c2 !== '-' && tttSet[chatId].tttboard.c3 !== '-') {
		whoWin = 3
	}
	return whoWin
}