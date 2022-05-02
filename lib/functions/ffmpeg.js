const {
	tools
} = require('./index')
const {
	mylang
} = require('../lang')
const fs = require('fs')
const axios = require('axios')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg')
ffmpeg.setFfmpegPath(ffmpegPath)

exports.octasound = async (mediaData, apu, kill, message, format) => {
	let onFile = `./lib/media/audio/8D-${tools('others').randomString(10)}.${format}`
	let offFile = `./lib/media/audio/8D-${tools('others').randomString(10)}.${format}`
	fs.writeFile(onFile, mediaData, async (err) => {
		if (err) return console.error(err)
		await kill.reply(message.from, mylang(region).wait(), message.id)
		ffmpeg(onFile)
		.audioFilter(`apulsator=hz=${apu || 0.200}`)
		.format(format)
		.save(offFile)
		.on('error', async function(error, stdout, stderr) {
			await kill.reply(message.from, mylang(region).fail('8D', error, (new Date).toString()), message.id)
			tools('others').reportConsole('8D', error)
		})
		.on('end', async () => {
			await kill.sendFile(message.from, offFile, `audio.${format}`, '', message.id)
			tools('others').clearFile(onFile)
			tools('others').clearFile(offFile)
		})
	})
}

exports.bass = async (mediaData, g, type, width, f, kill, message, format) => {
	let onFile = `./lib/media/audio/BASS-${tools('others').randomString(10)}.${format}`
	let offFile = `./lib/media/audio/BASS-${tools('others').randomString(10)}.${format}`
	fs.writeFile(onFile, mediaData, async (err) => {
		if (err) return console.error(err)
		await kill.reply(message.from, mylang(region).wait(), message.id)
		ffmpeg(onFile)
		.audioFilter(`equalizer=f=${f || 40}:width_type=${type || 'h'}:width=${width || 50}:g=${g || 3}`)
		.format(format)
		.save(offFile)
		.on('error', async function(error, stdout, stderr) {
			await kill.reply(message.from, mylang(region).fail('BASS', error, (new Date).toString()), message.id)
			tools('others').reportConsole('BASS', error)
		})
		.on('end', async () => {
			await kill.sendFile(message.from, offFile, `bass.${format}`, '', message.id)
			tools('others').clearFile(onFile)
			tools('others').clearFile(offFile)
		})
	})
}

exports.nightcore = async (mediaData, night, kill, message, format) => {
	let onFile = `./lib/media/audio/NIGHTCORE-${tools('others').randomString(10)}.${format}`
	let offFile = `./lib/media/audio/NIGHTCORE-${tools('others').randomString(10)}.${format}`
	fs.writeFile(onFile, mediaData, async (err) => {
		if (err) return console.error(err)
		await kill.reply(message.from, mylang(region).wait(), message.id)
		ffmpeg(onFile)
		.audioFilter(`asetrate=${night || 44100*1.25}`)
		.format(format)
		.save(offFile)
		.on('error', async function(error, stdout, stderr) {
			await kill.reply(message.from, mylang(region).fail('NIGHTCORE', error, (new Date).toString()), message.id)
			tools('others').reportConsole('NIGHTCORE', error)
		})
		.on('end', async () => {
			await kill.sendFile(message.from, offFile, `NIGHTCORE.${format}`, '', message.id)
			tools('others').clearFile(onFile)
			tools('others').clearFile(offFile)
		})
	})
}

exports.audio = async (mediaData, kill, message, mimetype) => {
	let onFile = `./lib/media/audio/AUDIO-${tools('others').randomString(10)}.${mimetype.replace(/.+\//, '')}`
	let offFile = `./lib/media/audio/AUDIO-${tools('others').randomString(10)}.mp3`
	fs.writeFile(onFile, mediaData, async (err) => {
		if (err) return console.error(err)
		await kill.reply(message.from, mylang(region).wait(), message.id)
		ffmpeg(onFile)
		.noVideo()
		.format('mp3')
		.save(offFile)
		.on('error', async function(error, stdout, stderr) {
			await kill.reply(message.from, mylang(region).fail('AUDIO', error, (new Date).toString()), message.id)
			tools('others').reportConsole('AUDIO', error)
		})
		.on('end', async () => {
			await kill.sendFile(message.from, offFile, 'audio.mp3', '', message.id)
			tools('others').clearFile(onFile)
			tools('others').clearFile(offFile)
		})
	})
}

exports.reverse = async (decryptedMedia, kill, message, args, format) => {
	let bEntry = `./lib/media/video/REVERSE-${tools('others').randomString(10)}.${format}`
	let bSaid = `./lib/media/video/REVERSE-${tools('others').randomString(10)}.${format}`
	fs.writeFile(bEntry, decryptedMedia, async (err) => {
		if (err) return console.error(err)
		await kill.reply(message.from, mylang(region).wait(), message.id)
		var mediaReverse = ffmpeg(bEntry)
		if (args.includes('-video') && format == 'mp4') {
			mediaReverse.videoFilter('reverse')
		} else if (args.includes('-audio')) {
			mediaReverse.audioFilter('areverse')
		} else {
			if (format == 'mp4') {
				mediaReverse.videoFilter('reverse')
			}
			mediaReverse.audioFilter('areverse')
		}
		mediaReverse.format(format)
		.save(bSaid)
		.on('error', async function(error, stdout, stderr) {
			await kill.reply(message.from, mylang(region).fail('reverse', error, (new Date).toString()), message.id)
			tools('others').reportConsole('reverse', error)
		})
		.on('end', async () => {
			await kill.sendFile(message.from, bSaid, `reverse.${format}`, '', message.id)
			tools('others').clearFile(bSaid)
			tools('others').clearFile(bEntry)
		})
	})
}

exports.gray = async (decryptedMedia, kill, message) => {
	let bEntry = `./lib/media/audio/REVERSE-${tools('others').randomString(10)}.mp4`
	let bSaid = `./lib/media/audio/REVERSE-${tools('others').randomString(10)}.mp4`
	fs.writeFile(bEntry, decryptedMedia, async (err) => {
		if (err) return console.error(err)
		await kill.reply(message.from, mylang(region).wait(), message.id)
		ffmpeg(bEntry)
		.videoFilter(`format=gray`)
		.format('mp4')
		.save(bSaid)
		.on('error', async function(error, stdout, stderr) {
			await kill.reply(message.from, mylang(region).fail('reverse', error, (new Date).toString()), message.id)
			tools('others').reportConsole('reverse', error)
		})
		.on('end', async () => {
			await kill.sendFile(message.from, bSaid, 'gray.mp4', '', message.id)
			tools('others').clearFile(bSaid)
			tools('others').clearFile(bEntry)
		})
	})
}

exports.square = async (decryptedMedia, kill, message) => {
	let bEntry = `./lib/media/audio/REVERSE-${tools('others').randomString(10)}.mp4`
	let bSaid = `./lib/media/audio/REVERSE-${tools('others').randomString(10)}.mp4`
	fs.writeFile(bEntry, decryptedMedia, async (err) => {
		if (err) return console.error(err)
		await kill.reply(message.from, mylang(region).wait(), message.id)
		ffmpeg(bEntry)
		.videoFilter(`crop=in_h:in_h`)
		.format('mp4')
		.save(bSaid)
		.on('error', async function(error, stdout, stderr) {
			await kill.reply(message.from, mylang(region).fail('reverse', error, (new Date).toString()), message.id)
			tools('others').reportConsole('reverse', error)
		})
		.on('end', async () => {
			await kill.sendFile(message.from, bSaid, 'square.mp4', '', message.id)
			tools('others').clearFile(bSaid)
			tools('others').clearFile(bEntry)
		})
	})
}

exports.mute = async (decryptedMedia, kill, message) => {
	let bEntry = `./lib/media/audio/REVERSE-${tools('others').randomString(10)}.mp4`
	let bSaid = `./lib/media/audio/REVERSE-${tools('others').randomString(10)}.mp4`
	fs.writeFile(bEntry, decryptedMedia, async (err) => {
		if (err) return console.error(err)
		await kill.reply(message.from, mylang(region).wait(), message.id)
		ffmpeg(bEntry)
		.audioFilter(`volume=0`)
		.format('mp4')
		.save(bSaid)
		.on('error', async function(error, stdout, stderr) {
			await kill.reply(message.from, mylang(region).fail('mute', error, (new Date).toString()), message.id)
			tools('others').reportConsole('mute', error)
		})
		.on('end', async () => {
			await kill.sendFile(message.from, bSaid, 'mute.mp4', '', message.id)
			tools('others').clearFile(bSaid)
			tools('others').clearFile(bEntry)
		})
	})
}

exports.blur = async (decryptedMedia, kill, message, radius) => {
	let bEntry = `./lib/media/audio/REVERSE-${tools('others').randomString(10)}.mp4`
	let bSaid = `./lib/media/audio/REVERSE-${tools('others').randomString(10)}.mp4`
	fs.writeFile(bEntry, decryptedMedia, async (err) => {
		if (err) return console.error(err)
		await kill.reply(message.from, mylang(region).wait(), message.id)
		ffmpeg(bEntry)
		.videoFilter(`avgblur=sizeX=${radius}`)
		.format('mp4')
		.save(bSaid)
		.on('error', async function(error, stdout, stderr) {
			await kill.reply(message.from, mylang(region).fail('reverse', error, (new Date).toString()), message.id)
			tools('others').reportConsole('reverse', error)
		})
		.on('end', async () => {
			await kill.sendFile(message.from, bSaid, 'blur.mp4', '', message.id)
			tools('others').clearFile(bSaid)
			tools('others').clearFile(bEntry)
		})
	})
}

exports.resize = async (link, command, kill, message) => {
	let bEntry = `./lib/media/img/${command}-${tools('others').randomString(20)}.gif`
	let bSaid = `./lib/media/img/${command}-${tools('others').randomString(20)}.mp4`
	await axios.get(link, {
		responseType: 'arraybuffer'
	}).then(async (response) => {
		fs.writeFile(bEntry, Buffer.from(response.data, 'binary'), async (err) => {
			if (err) return console.error(err)
			ffmpeg(bEntry)
			.outputOptions(['-movflags', 'faststart', '-pix_fmt', 'yuv420p', '-vf', "scale=trunc(iw/2)*2:trunc(ih/2)*2"])
			.save(bSaid)
			.on('error', async function(error, stdout, stderr) {
				await kill.reply(message.from, mylang(region).fail(command, error, time), message.id)
				tools('others').reportConsole('8D', error)
			})
			.on('end', async () => {
				await tools('others').sleep(2000)
				await kill.sendFile(message.from, bSaid, 'video.mp4', '', message.id)
				tools('others').clearFile(bSaid)
				tools('others').clearFile(bEntry)
			})
		})
	})
}

exports.speed = async (mediaData, kill, message, speed, format) => {
	let bEntry = `./lib/media/video/REVERSE-${tools('others').randomString(10)}.${format}`
	let bSaid = `./lib/media/video/REVERSE-${tools('others').randomString(10)}.${format}`
	fs.writeFile(bEntry, mediaData, async (err) => {
		if (err) return console.error(err)
		await kill.reply(message.from, mylang(region).wait(), message.id)
		var mediaSpeed = ffmpeg(bEntry)
		if (format == 'mp3') {
			mediaSpeed.audioFilters(`atempo=${speed}`)
		}
		if (format == 'mp4') {
			mediaSpeed.videoFilters(`setpts=${1/speed}*PTS`)
			.audioFilters(`atempo=${speed}`)
		}
		mediaSpeed.format(format)
		.save(bSaid)
		.on('error', async function(error, stdout, stderr) {
			await kill.reply(message.from, mylang(region).fail('speed', error, (new Date).toString()), message.id)
			tools('others').reportConsole('speed', error)
		})
		.on('end', async () => {
			await kill.sendFile(message.from, bSaid, `speed.${format}`, '', message.id)
			tools('others').clearFile(bSaid)
			tools('others').clearFile(bEntry)
		})
	})
}