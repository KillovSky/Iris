const { default: got } = require('got/dist/source') // modulos e muito mais modulos
const fetch = require('node-fetch')
const { getBase64 } = require("./fetcher")
const emoji = require('emoji-regex')
const fs = require('fs-extra')
const request = require('request')
const axios = require('axios')
const config = require('./config/config.json')

const wall = async(query) => { // Sobre o comando de Wallpapers
    var q = query.replace(/ /g, '+')
    const response = await fetch('https://wall.alphacoders.com/api2.0/get.php?auth=' + config.wallac + '&method=search&count=1&term=${q}')
    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`)
    const json = await response.json()
    console.log()
    if (json.success === true) {
		const rnb = Math.floor(Math.random() * 5) + 1 
        return json.wallpapers[`${rnb}`].url_image
    } else {
        return `https://c4.wallpaperflare.com/wallpaper/976/117/318/anime-girls-404-not-found-glowing-eyes-girls-frontline-wallpaper-preview.jpg`
    }
}

const emojiStrip = (string) => { // Mata os emojis e.e
    return string.replace(emoji, '')
}

const isUrl = (url) => {
    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi))
}

const ss = async(query) => { // Um print de site
    request({
        url: "https://api.apiflash.com/v1/urltoimage",
        encoding: "binary",
        qs: {
            access_key: config.apifla,
            url: query
        }
    }, (error, response, body) => {
        if (error) {
            console.log(error);
        } else {
            fs.writeFile("./lib/media/img/screenshot.jpeg", body, "binary", error => {
                console.log(error);
            })
        }
    })
}

const tulis = async (teks) => new Promise((resolve, reject) => { // o comando que faz diarios haha
    axios.get(`https://st4rz.herokuapp.com/api/nulis?text=${encodeURIComponent(teks)}`)
    .then((res) => {
        resolve(`${res.data.result}`)
    })
    .catch((err) => {
        reject(err)
    })
})

const randomNimek = async (type) => {
    var url = 'https://api.computerfreaker.cf/v1/'
    switch(type) {
        case 'nsfw':
            const nsfw = await axios.get(url + 'nsfwneko')
            return nsfw.data.url
            break
        case 'hentai':
            const hentai = await axios.get(url + 'hentai')
            return hentai.data.url
            break
        case 'dva':
            const dva = await axios.get(url + 'dva')
            return dva.data.url
            break
        case 'yuri':
            const yuri = await axios.get(url + 'yuri')
            return yuri.data.url
            break
        case 'hug':
            const hug = await axios.get(url + 'hug')
            return hug.data.url
            break
        case 'anime':
            let anime = await axios.get(url + 'anime')
            return anime.data.url
            break
        case 'baguette':
            let baguette = await axios.get(url + 'baguette')
            return baguette.data.url
            break
        case 'trap':
            let trap = await axios.get(url + 'trap')
            return trap.data.url
            break
    }
}

const sleep = async (ms) => { // Função parecida com a de shell usada pra esperar certo tempo antes de rodar algo, usa sistema de milisegundos
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.randomNimek = randomNimek
exports.emojiStrip = emojiStrip
exports.sleep = sleep
exports.wall = wall
exports.ss = ss
exports.tulis = tulis // exporta uma função da const
exports.isUrl = isUrl