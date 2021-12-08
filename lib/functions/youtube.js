const youtubedl = require('youtube-dl-exec')
const config = require('../config/Gerais/config.json')
const {
	randomString
} = require('./others.js')

exports.downPlay = async (url) => {
	let place = `./lib/media/audio/${randomString(10)}.mp3`
	try {
		await youtubedl(url, {
			maxFilesize: `${Number(config.Max_Download_Size)}M`,
			audioFormat: 'mp3',
			noCallHome: true,
			noCheckCertificate: true,
			noWarnings: true,
			o: place,
			x: true,
			youtubeSkipDashManifest: true
		})
		return place
	} catch (error) {
		if (fs.existsSync(place)) {
			await fs.unlinkSync(place)
		}
		return error
	}
}

exports.downVideo = async (url) => {
	try {
		let videoURL = await youtubedl(url, {
			maxFilesize: `${Number(config.Max_Download_Size)}M`,
			format: 'mp4',
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