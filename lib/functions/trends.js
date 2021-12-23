const axios = require('axios')
const cheerio = require('cheerio')

exports.refs = async (place) => {
	let twit = await axios.get(place)
	let $ = await cheerio.load(twit.data)
	let trends = $(".trend-card").toArray().slice(0, 1)
	var results = []
	trends.forEach((v, i) => {
		let attr = $(v).find("li")
		var subjects = attr.toArray().map((v) => {
			return $(v).children().first().text()
		})
		results.push(subjects)
	})
	return results
}