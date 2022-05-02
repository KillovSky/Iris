const fs = require('fs')
const config = JSON.parse(fs.readFileSync('./lib/config/Settings/config.json'))
const prefix = config.Prefix[0]
const {
	mylang
} = require('../lang')
const {
	tools
} = require('./index')

/* -----------------------------------------------------------------------
 * A parte das votações [Eleições] - A famosa urna eletrônica do Zap-Zap
 * ---------------------------------------------------------------------- */

exports.create = async (kill, message, file, poll) => {
	let pollcreate = {
		id: message.from,
		title: poll[0],
		candis: {},
		voters: [],
		creator: message.author,
		maxVotes: parseInt(Number(poll[1] || config.Max_Votes))
	}
	fs.writeFileSync(file, JSON.stringify(pollcreate, null, "\t"))
	await kill.sendText(message.from, mylang(region).startvote(poll[0]) + `\n\n🏆 - Max. de Votos: "${pollcreate.maxVotes}".`)
}

exports.vote = async (kill, message, vote, file) => {
	if (!fs.existsSync(file)) return await kill.sendText(message.from, mylang(region).noPolls())
	let poll = JSON.parse(fs.readFileSync(file))
	if (Object.keys(poll.candis) == '') return await kill.sendText(message.from, mylang(region).nocand())
	if (poll.voters.includes(message.author)) return await kill.sendText(message.from, mylang(region).polliv())
	if (Number(vote) > Object.keys(poll.candis).length || Object.keys(poll.candis)[vote] == null) return await kill.sendText(message.from, mylang(region).wrongcand(vote))
	poll.voters.push(message.author)
	poll.candis[Object.keys(poll.candis)[vote]]++
	fs.writeFileSync(file, JSON.stringify(poll, null, "\t"))
	let votes = `📥 - Votou em "${Object.keys(poll.candis)[vote]}"\n\n🗳️ - Em ${poll.title}\n`
	let hasWinner = false
	for (let i in Object.keys(poll.candis)) {
		if (poll.candis[Object.keys(poll.candis)[i]] >= poll.maxVotes) {
			votes += `\n🥇 - ${Object.keys(poll.candis)[i].toUpperCase()} VENCEU POR "${poll.candis[Object.keys(poll.candis)[i]]}" VOTOS!\n\n🛑 - ${mylang(region).finishedVote} - 🛑\n`
			hasWinner = true
		} else {
			votes += `\n🎁 [${i}] -> "${Object.keys(poll.candis)[i]}" = "${poll.candis[Object.keys(poll.candis)[i]]}" Votos.\n`
		}
	}
	await kill.sendText(message.from, votes)
	if (hasWinner) {
		tools('others').clearFile(file, 1000)
	}
}

exports.add = async (kill, message, cand, file, isadm) => {
	if (!fs.existsSync(file)) return await kill.sendText(message.from, mylang(region).noPolls())
	let poll = JSON.parse(fs.readFileSync(file))
	if (Object.keys(poll.candis).includes(cand.toLowerCase())) return await kill.sendText(message.from, mylang(region).candInvalid(cand))
	if (!isadm && message.sender.id !== poll.creator) return await kill.sendTextWithMentions(message.from, mylang(region).noNewPoll(poll))
	poll.candis[cand] = 0
	fs.writeFileSync(file, JSON.stringify(poll, null, "\t"))
	await kill.sendText(message.from, mylang(region).addcand(cand))
}

exports.get = async (kill, message, file) => {
	if (!fs.existsSync(file)) return await kill.sendText(message.from, mylang(region).noPolls())
	let poll = JSON.parse(fs.readFileSync(file))
	let urna = `🗳️ - ${poll.title}\n\n`
	if (Object.keys(poll.candis).length == 0) {
		urna += mylang(region).nocand()
	} else {
		for (let i in Object.keys(poll.candis)) {
			urna += `🎁 #${i} -> "${Object.keys(poll.candis)[i]}" = "${poll.candis[Object.keys(poll.candis)[i]]}" Votos.\n`
		}
	}
	await kill.sendText(message.from, urna + '\n' + mylang(region).howvote())
}