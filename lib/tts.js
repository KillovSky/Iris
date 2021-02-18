module.exports = ngtts = async (dataBhs, dataText) => {
	console.log('Lingua: ' + dataBhs + '\n\n' + dataText)
	const ttsId = require('node-gtts')('id')
	const ttsEn = require('node-gtts')('en')
	const ttsJp = require('node-gtts')('ja')
	const ttsAr = require('node-gtts')('ar')
	const ttsAf = require('node-gtts')('af')
	const ttsSq = require('node-gtts')('sq')
	const ttsHy = require('node-gtts')('hy')
	const ttsCa = require('node-gtts')('ca')
	const ttsZh = require('node-gtts')('zh')
	const ttsCn = require('node-gtts')('zh-cn')
	const ttsTw = require('node-gtts')('zh-tw')
	const ttsYu = require('node-gtts')('zh-yue')
	const ttsHr = require('node-gtts')('hr')
	const ttsCs = require('node-gtts')('cs')
	const ttsDa = require('node-gtts')('da')
	const ttsNl = require('node-gtts')('nl')
	const ttsAu = require('node-gtts')('en-au')
	const ttsUk = require('node-gtts')('en-uk')
	const ttsUs = require('node-gtts')('en-us')
	const ttsEo = require('node-gtts')('eo')
	const ttsFi = require('node-gtts')('fi')
	const ttsFr = require('node-gtts')('fr')
	const ttsEl = require('node-gtts')('el')
	const ttsHt = require('node-gtts')('ht')
	const ttsHi = require('node-gtts')('hi')
	const ttsHu = require('node-gtts')('hu')
	const ttsIs = require('node-gtts')('is')
	const ttsIt = require('node-gtts')('it')
	const ttsKo = require('node-gtts')('ko')
	const ttsLa = require('node-gtts')('la')
	const ttsLv = require('node-gtts')('lv')
	const ttsMk = require('node-gtts')('mk')
	const ttsNo = require('node-gtts')('no')
	const ttsPl = require('node-gtts')('pl')
	const ttsRo = require('node-gtts')('ro')
	const ttsSr = require('node-gtts')('sr')
	const ttsSk = require('node-gtts')('sk')
	const ttsEs = require('node-gtts')('es')
	const ttsSp = require('node-gtts')('es-es')
	const ttsSu = require('node-gtts')('es-us')
	const ttsSw = require('node-gtts')('sw')
	const ttsSv = require('node-gtts')('sv')
	const ttsTa = require('node-gtts')('ta')
	const ttsTh = require('node-gtts')('th')
	const ttsTr = require('node-gtts')('tr')
	const ttsVi = require('node-gtts')('vi')
	const ttsCy = require('node-gtts')('cy')
	const ttsDe = require('node-gtts')('de')
	const ttsBr = require('node-gtts')('pt-br')
	const ttsPt = require('node-gtts')('pt')
	const ttsRu = require('node-gtts')('ru')
	if (dataBhs == 'id') {
        await ttsId.save('./lib/media/tts/resId.mp3', dataText);
		var tts = 'Id'
		return tts;
    } else if (dataBhs == 'en') {
        await ttsEn.save('./lib/media/tts/resEn.mp3', dataText);
		var tts = 'En'
		return tts;
    } else if (dataBhs == 'jp') {
        await ttsJp.save('./lib/media/tts/resJp.mp3', dataText);
		var tts = 'Jp'
		return tts;
    } else if (dataBhs == 'de') {
        await ttsDe.save('./lib/media/tts/resDe.mp3', dataText);
		var tts = 'De'
		return tts;
    } else if (dataBhs == 'br') {
        await ttsBr.save('./lib/media/tts/resBr.mp3', dataText);
		var tts = 'Br'
		return tts;
    } else if (dataBhs == 'ru') {
        await ttsRu.save('./lib/media/tts/resRu.mp3', dataText);
		var tts = 'Ru'
		return tts;
	} else if (dataBhs == 'ar') {
        await ttsAr.save('./lib/media/tts/resAr.mp3', dataText);
		var tts = 'Ar'
		return tts;
    } else if (dataBhs == 'pt') {
        await ttsPt.save('./lib/media/tts/resPt.mp3', dataText);
		var tts = 'Pt'
		return tts;
    } else if (dataBhs == 'af') {
        await ttsAf.save('./lib/media/tts/resAf.mp3', dataText);
		var tts = 'Af'
		return tts;
    } else if (dataBhs == 'sq') {
        await ttsSq.save('./lib/media/tts/resSq.mp3', dataText);
		var tts = 'Sq'
		return tts;
    } else if (dataBhs == 'hy') {
        await ttsHy.save('./lib/media/tts/resHy.mp3', dataText);
		var tts = 'Hy'
		return tts;
    } else if (dataBhs == 'ca') {
        await ttsCa.save('./lib/media/tts/resCa.mp3', dataText);
		var tts = 'Ca'
		return tts;
    } else if (dataBhs == 'zh') {
        await ttsZh.save('./lib/media/tts/resZh.mp3', dataText);
		var tts = 'Zh'
		return tts;
    } else if (dataBhs == 'cn') {
        await ttsCn.save('./lib/media/tts/resCn.mp3', dataText);
		var tts = 'Cn'
		return tts;
    } else if (dataBhs == 'tw') {
        await ttsTw.save('./lib/media/tts/resTw.mp3', dataText);
		var tts = 'Tw'
		return tts;
    } else if (dataBhs == 'yu') {
        await ttsYu.save('./lib/media/tts/resYue.mp3', dataText);
		var tts = 'Yue'
		return tts;
	} else if (dataBhs == 'hr') {
        await ttsHr.save('./lib/media/tts/resHr.mp3', dataText);
		var tts = 'Hr'
		return tts;
    } else if (dataBhs == 'cs') {
        await ttsCs.save('./lib/media/tts/resCs.mp3', dataText);
		var tts = 'Cs'
		return tts;
    } else if (dataBhs == 'da') {
        await ttsDa.save('./lib/media/tts/resDa.mp3', dataText);
		var tts = 'Da'
		return tts;
    } else if (dataBhs == 'nl') {
        await ttsNl.save('./lib/media/tts/resNl.mp3', dataText);
		var tts = 'Nl'
		return tts;
    } else if (dataBhs == 'au') {
        await ttsAu.save('./lib/media/tts/resAu.mp3', dataText);
		var tts = 'Au'
		return tts;
    } else if (dataBhs == 'uk') {
        await ttsUk.save('./lib/media/tts/resUk.mp3', dataText);
		var tts = 'Uk'
		return tts;
    } else if (dataBhs == 'us') {
        await ttsUs.save('./lib/media/tts/resUs.mp3', dataText);
		var tts = 'Us'
		return tts;
    } else if (dataBhs == 'eo') {
        await ttsEo.save('./lib/media/tts/resEo.mp3', dataText);
		var tts = 'Eo'
		return tts;
    } else if (dataBhs == 'fi') {
        await ttsFi.save('./lib/media/tts/resFi.mp3', dataText);
		var tts = 'Fi'
		return tts;
    } else if (dataBhs == 'fr') {
        await ttsFr.save('./lib/media/tts/resFr.mp3', dataText);
		var tts = 'Fr'
		return tts;
    } else if (dataBhs == 'el') {
        await ttsEl.save('./lib/media/tts/resEl.mp3', dataText);
		var tts = 'El'
		return tts;
    } else if (dataBhs == 'ht') {
        await ttsHt.save('./lib/media/tts/resJp.mp3', dataText);
		var tts = 'Ht'
		return tts;
    } else if (dataBhs == 'hi') {
        await ttsHi.save('./lib/media/tts/resHi.mp3', dataText);
		var tts = 'Hi'
		return tts;
    } else if (dataBhs == 'hu') {
        await ttsHu.save('./lib/media/tts/resHu.mp3', dataText);
		var tts = 'Hu'
		return tts;
    } else if (dataBhs == 'is') {
        await ttsIs.save('./lib/media/tts/resIs.mp3', dataText);
		var tts = 'Is'
		return tts;
	} else if (dataBhs == 'it') {
        await ttsIt.save('./lib/media/tts/resIt.mp3', dataText);
		var tts = 'It'
		return tts;
    } else if (dataBhs == 'ko') {
        await ttsKo.save('./lib/media/tts/resKo.mp3', dataText);
		var tts = 'Ko'
		return tts;
    } else if (dataBhs == 'la') {
        await ttsLa.save('./lib/media/tts/resLa.mp3', dataText);
		var tts = 'La'
		return tts;
    } else if (dataBhs == 'lv') {
        await ttsLv.save('./lib/media/tts/resLv.mp3', dataText);
		var tts = 'Lv'
		return tts;
    } else if (dataBhs == 'mk') {
        await ttsMk.save('./lib/media/tts/resMk.mp3', dataText);
		var tts = 'Mk'
		return tts;
    } else if (dataBhs == 'no') {
        await ttsNo.save('./lib/media/tts/resNo.mp3', dataText);
		var tts = 'No'
		return tts;
    } else if (dataBhs == 'pl') {
        await ttsPl.save('./lib/media/tts/resPl.mp3', dataText);
		var tts = 'Pl'
		return tts;
    } else if (dataBhs == 'ro') {
        await ttsRo.save('./lib/media/tts/resRo.mp3', dataText);
		var tts = 'Ro'
		return tts;
    } else if (dataBhs == 'sr') {
        await ttsSr.save('./lib/media/tts/resSr.mp3', dataText);
		var tts = 'Sr'
		return tts;
    } else if (dataBhs == 'sk') {
        await ttsSk.save('./lib/media/tts/resSk.mp3', dataText);
		var tts = 'Sk'
		return tts;
	} else if (dataBhs == 'es') {
        await ttsEs.save('./lib/media/tts/resEs.mp3', dataText);
		var tts = 'Es'
		return tts;
    } else if (dataBhs == 'sp') {
        await ttsSp.save('./lib/media/tts/resSp.mp3', dataText);
		var tts = 'Sp'
		return tts;
    } else if (dataBhs == 'su') {
        await ttsSu.save('./lib/media/tts/resSu.mp3', dataText);
		var tts = 'Su'
		return tts;
    } else if (dataBhs == 'sw') {
        await ttsSw.save('./lib/media/tts/resSw.mp3', dataText);
		var tts = 'Sk'
		return tts;
    } else if (dataBhs == 'sv') {
        await ttsSv.save('./lib/media/tts/resSv.mp3', dataText);
		var tts = 'Sv'
		return tts;
    } else if (dataBhs == 'ta') {
        await ttsTa.save('./lib/media/tts/resTa.mp3', dataText);
		var tts = 'Ta'
		return tts;
    } else if (dataBhs == 'tr') {
        await ttsTr.save('./lib/media/tts/resTr.mp3', dataText);
		var tts = 'Tr'
		return tts;
    } else if (dataBhs == 'vi') {
        await ttsVi.save('./lib/media/tts/resVi.mp3', dataText);
		var tts = 'Vi'
		return tts;
    } else if (dataBhs == 'cy') {
        await ttsCy.save('./lib/media/tts/resCy.mp3', dataText);
		var tts = 'Cy'
		return tts;
    } else {
		var tts = 'Error'
		return tts;
	}
}