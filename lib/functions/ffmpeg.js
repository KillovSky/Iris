const {
	tools
} = require('./index')
const {
	mylang
} = require('../lang')
const fs = require('fs')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg')
ffmpeg.setFfmpegPath(ffmpegPath)

exports.octasound = async (mediaData, apu, kill, message, format) => {
	let onFile = `./lib/media/audio/8D-${tools('others').randomString(10)}.${format}`
	let offFile = `./lib/media/audio/8D-${tools('others').randomString(10)}.${format}`
	await fs.writeFile(onFile, mediaData, async (err) => {
		if (err) return console.error(err)
		await kill.reply(message.from, mylang(region).wait(), message.id)
		await ffmpeg(onFile)
		.audioFilter(`apulsator=hz=${apu || 0.200}`)
		.format(format)
		.save(offFile)
		.on('error', async function(error, stdout, stderr) {
			await kill.reply(message.from, mylang(region).fail('8D', error, (new Date).toString()), message.id)
			await tools('others').reportConsole('8D', error)
		})
		.on('end', async () => {
			await kill.sendFile(message.from, offFile, `audio.${format}`, '', message.id)
			await tools('others').clearFile(onFile)
			await tools('others').clearFile(offFile)
		})
	})
}

exports.bass = async (mediaData, g, type, width, f, kill, message, format) => {
	let onFile = `./lib/media/audio/BASS-${tools('others').randomString(10)}.${format}`
	let offFile = `./lib/media/audio/BASS-${tools('others').randomString(10)}.${format}`
	await fs.writeFile(onFile, mediaData, async (err) => {
		if (err) return console.error(err)
		await kill.reply(message.from, mess.wait(), message.id)
		await ffmpeg(onFile)
		.audioFilter(`equalizer=f=${f || 40}:width_type=${type || 'h'}:width=${width || 50}:g=${g || 3}`)
		.format(format)
		.save(offFile)
		.on('error', async function(error, stdout, stderr) {
			await kill.reply(message.from, mylang(region).fail('BASS', error, (new Date).toString()), message.id)
			await tools('others').reportConsole('BASS', error)
		})
		.on('end', async () => {
			await kill.sendFile(message.from, offFile, `bass.${format}`, '', message.id)
			await tools('others').clearFile(onFile)
			await tools('others').clearFile(offFile)
		})
	})
}

exports.nightcore = async (mediaData, night, kill, message, format) => {
	let onFile = `./lib/media/audio/NIGHTCORE-${tools('others').randomString(10)}.${format}`
	let offFile = `./lib/media/audio/NIGHTCORE-${tools('others').randomString(10)}.${format}`
	await fs.writeFile(onFile, mediaData, async (err) => {
		if (err) return console.error(err)
		await kill.reply(message.from, mess.wait(), message.id)
		await ffmpeg(onFile)
		.audioFilter(`asetrate=${night || 44100*1.25}`)
		.format(format)
		.save(offFile)
		.on('error', async function(error, stdout, stderr) {
			await kill.reply(message.from, mylang(region).fail('NIGHTCORE', error, (new Date).toString()), message.id)
			await tools('others').reportConsole('NIGHTCORE', error)
		})
		.on('end', async () => {
			await kill.sendFile(message.from, offFile, `NIGHTCORE.${format}`, '', message.id)
			await tools('others').clearFile(onFile)
			await tools('others').clearFile(offFile)
		})
	})
}

exports.audio = async (mediaData, mimetype, kill, message) => {
	let onFile = `./lib/media/audio/AUDIO-${tools('others').randomString(10)}.mp3`
	let offFile = `./lib/media/audio/AUDIO-${tools('others').randomString(10)}.mp3`
	await fs.writeFile(onFile, mediaData, async (err) => {
		if (err) return console.error(err)
		await kill.reply(message.from, mess.wait(), message.id)
		await ffmpeg(onFile)
		.noVideo()
		.format('mp3')
		.save(offFile)
		.on('error', async function(error, stdout, stderr) {
			await kill.reply(message.from, mylang(region).fail('8d', error, (new Date).toString()), message.id)
			await tools('others').reportConsole('8D', error)
		})
		.on('end', async () => {
			await kill.sendFile(message.from, offFile, 'audio.mp3', '', message.id)
			await tools('others').clearFile(onFile)
			await tools('others').clearFile(offFile)
		})
	})
}

exports.reverse = async (decryptedMedia, kill, message, args) => {
	let bEntry = `./lib/media/video/REVERSE-${tools('others').randomString(10)}.mp4`
	let bSaid = `./lib/media/video/REVERSE-${tools('others').randomString(10)}.mp4`
	await fs.writeFile(bEntry, decryptedMedia, async (err) => {
		if (err) return console.error(err)
		await kill.reply(message.from, mylang(region).wait(), message.id)
		if (args.includes('-video')) {
			await ffmpeg(bEntry)
			.videoFilter('reverse')
			.format('mp4')
			.save(bSaid)
			.on('error', async function(error, stdout, stderr) {
				await kill.reply(message.from, mylang(region).fail('reverse', error, (new Date).toString()), message.id)
				await tools('others').reportConsole('reverse', error)
			})
			.on('end', async () => {
				await kill.sendFile(message.from, bSaid, 'reverse.mp4', '', message.id)
				await tools('others').clearFile(bSaid)
				await tools('others').clearFile(bEntry)
			})
		} else if (args.includes('-audio')) {
			await ffmpeg(bEntry)
			.audioFilter('areverse')
			.format('mp4')
			.save(bSaid)
			.on('error', async function(error, stdout, stderr) {
				await kill.reply(message.from, mylang(region).fail('reverse', error, (new Date).toString()), message.id)
				await tools('others').reportConsole('reverse', error)
			})
			.on('end', async () => {
				await kill.sendFile(message.from, bSaid, 'reverse.mp4', '', message.id)
				await tools('others').clearFile(bSaid)
				await tools('others').clearFile(bEntry)
			})
		} else {
			await ffmpeg(bEntry)
			.videoFilter('reverse')
			.audioFilter('areverse')
			.format('mp4')
			.save(bSaid)
			.on('error', async function(error, stdout, stderr) {
				await kill.reply(message.from, mylang(region).fail('reverse', error, (new Date).toString()), message.id)
				await tools('others').reportConsole('reverse', error)
			})
			.on('end', async () => {
				await kill.sendFile(message.from, bSaid, 'reverse.mp4', '', message.id)
				await tools('others').clearFile(bSaid)
				await tools('others').clearFile(bEntry)
			})
		}
	})
}

exports.areverse = async (decryptedMedia, kill, message) => {
	let bEntry = `./lib/media/audio/REVERSE-${tools('others').randomString(10)}.mp3`
	let bSaid = `./lib/media/audio/REVERSE-${tools('others').randomString(10)}.mp3`
	await fs.writeFile(bEntry, decryptedMedia, async (err) => {
		if (err) return console.error(err)
		await kill.reply(message.from, mylang(region).wait(), message.id)
		await ffmpeg(bEntry)
		.audioFilter(`areverse`)
		.format('mp3')
		.save(bSaid)
		.on('error', async function(error, stdout, stderr) {
			await kill.reply(message.from, mylang(region).fail('reverse', error, (new Date).toString()), message.id)
			await tools('others').reportConsole('reverse', error)
		})
		.on('end', async () => {
			await kill.sendFile(message.from, bSaid, 'audio.mp3', '', message.id)
			await tools('others').clearFile(bSaid)
			await tools('others').clearFile(bEntry)
		})
	})
}

exports.gray = async (decryptedMedia, kill, message) => {
	let bEntry = `./lib/media/audio/REVERSE-${tools('others').randomString(10)}.mp4`
	let bSaid = `./lib/media/audio/REVERSE-${tools('others').randomString(10)}.mp4`
	await fs.writeFile(bEntry, decryptedMedia, async (err) => {
		if (err) return console.error(err)
		await kill.reply(message.from, mylang(region).wait(), message.id)
		await ffmpeg(bEntry)
		.videoFilter(`format=gray`)
		.format('mp4')
		.save(bSaid)
		.on('error', async function(error, stdout, stderr) {
			await kill.reply(message.from, mylang(region).fail('reverse', error, (new Date).toString()), message.id)
			await tools('others').reportConsole('reverse', error)
		})
		.on('end', async () => {
			await kill.sendFile(message.from, bSaid, 'gray.mp4', '', message.id)
			await tools('others').clearFile(bSaid)
			await tools('others').clearFile(bEntry)
		})
	})
}

exports.square = async (decryptedMedia, kill, message) => {
	let bEntry = `./lib/media/audio/REVERSE-${tools('others').randomString(10)}.mp4`
	let bSaid = `./lib/media/audio/REVERSE-${tools('others').randomString(10)}.mp4`
	await fs.writeFile(bEntry, decryptedMedia, async (err) => {
		if (err) return console.error(err)
		await kill.reply(message.from, mylang(region).wait(), message.id)
		await ffmpeg(bEntry)
		.videoFilter(`crop=in_h:in_h`)
		.format('mp4')
		.save(bSaid)
		.on('error', async function(error, stdout, stderr) {
			await kill.reply(message.from, mylang(region).fail('reverse', error, (new Date).toString()), message.id)
			await tools('others').reportConsole('reverse', error)
		})
		.on('end', async () => {
			await kill.sendFile(message.from, bSaid, 'square.mp4', '', message.id)
			await tools('others').clearFile(bSaid)
			await tools('others').clearFile(bEntry)
		})
	})
}

exports.mute = async (decryptedMedia, kill, message) => {
	let bEntry = `./lib/media/audio/REVERSE-${tools('others').randomString(10)}.mp4`
	let bSaid = `./lib/media/audio/REVERSE-${tools('others').randomString(10)}.mp4`
	await fs.writeFile(bEntry, decryptedMedia, async (err) => {
		if (err) return console.error(err)
		await kill.reply(message.from, mylang(region).wait(), message.id)
		await ffmpeg(bEntry)
		.audioFilter(`volume=0`)
		.format('mp4')
		.save(bSaid)
		.on('error', async function(error, stdout, stderr) {
			await kill.reply(message.from, mylang(region).fail('mute', error, (new Date).toString()), message.id)
			await tools('others').reportConsole('mute', error)
		})
		.on('end', async () => {
			await kill.sendFile(message.from, bSaid, 'mute.mp4', '', message.id)
			await tools('others').clearFile(bSaid)
			await tools('others').clearFile(bEntry)
		})
	})
}

exports.blur = async (decryptedMedia, kill, message, radius) => {
	let bEntry = `./lib/media/audio/REVERSE-${tools('others').randomString(10)}.mp4`
	let bSaid = `./lib/media/audio/REVERSE-${tools('others').randomString(10)}.mp4`
	await fs.writeFile(bEntry, decryptedMedia, async (err) => {
		if (err) return console.error(err)
		await kill.reply(message.from, mylang(region).wait(), message.id)
		await ffmpeg(bEntry)
		.videoFilter(`avgblur=sizeX=${radius}`)
		.format('mp4')
		.save(bSaid)
		.on('error', async function(error, stdout, stderr) {
			await kill.reply(message.from, mylang(region).fail('reverse', error, (new Date).toString()), message.id)
			await tools('others').reportConsole('reverse', error)
		})
		.on('end', async () => {
			await kill.sendFile(message.from, bSaid, 'blur.mp4', '', message.id)
			await tools('others').clearFile(bSaid)
			await tools('others').clearFile(bEntry)
		})
	})
}