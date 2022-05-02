const shell = require('shelljs')
const fs = require('fs')
const {
	tools
} = require('./index')

exports.scanImage = async (cmd, image) => {
	return new Promise(async (resolve, reject) => {
		let wkrImg = `./lib/media/img/OCR-${tools('others').randomString(10)}.jpg`
		var finalRes = {
			'code': false,
			'result': false
		}
		try {
			fs.writeFile(wkrImg, image, 'base64', async (err) => {
				if (err) throw new Error(err)
				let tess = await shell.exec(`bash -c "tesseract ${wkrImg} stdout"`, {
					silent: true
				})
				tools('others').clearFile(wkrImg)
				if (tess.stdout == '') {
					finalRes.result = tess.stderr.replace(/(\r\n|\n|\r)/gm, "")
					reject(finalRes)
				} else {
					finalRes.code = true
					finalRes.result = tess.stdout.replace(/(\r\n|\n|\r)/gm, "")
					resolve(finalRes)
				}
			})
		} catch (error) {
			tools('others').reportConsole(cmd, error)
			tools('others').clearFile(wkrImg)
			finalRes.result = error
			reject(finalRes)
		}
	})
}