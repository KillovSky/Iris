const youtubedl = require('youtube-dl-exec')
const fs = require('fs')
const config = JSON.parse(fs.readFileSync('./lib/config/Settings/config.json'))
const {
	tools
} = require('./index')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path

exports.downPlay = async (url) => {
	let place = `./lib/media/audio/${tools('others').randomString(10)}.mp3`
	try {
		await youtubedl(url, {
			maxFilesize: `${Number(config.Max_Download_Size)}M`,
			audioFormat: 'mp3',
			ffmpegLocation: ffmpegPath,
			noCallHome: true,
			noCheckCertificate: true,
			noWarnings: true,
			o: place,
			x: true,
			youtubeSkipDashManifest: true
		})
		return place
	} catch (error) {
		tools('others').clearFile(place)
		return error
	}
}

exports.downVideo = async (url) => {
	try {
		let videoURL = await youtubedl(url, {
			maxFilesize: `${Number(config.Max_Download_Size)}M`,
			format: 'mp4',
			ffmpegLocation: ffmpegPath,
			getUrl: true,
			noCallHome: true,
			noCheckCertificate: true,
			noWarnings: true,
			skipDownload: true,
			x: true,
			youtubeSkipDashManifest: true
		})
		return videoURL
	} catch (error) {
		return error
	}
}

exports.getVideo = async (url) => {
	try {
		const videoInfo = await youtubedl(url, {
			noWarnings: true,
			callHome: false,
			getUrl: true,
			noCheckCertificate: true
		})
		return videoInfo
	} catch (error) {
		return error
	}
}