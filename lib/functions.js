const { default: got } = require('got/dist/source') // modulos e muito mais modulos
const fetch = require('node-fetch')
const { getBase64 } = require("./fetcher")
const emoji = require('emoji-regex')
const fs = require('fs-extra')
const request = require('request')
const axios = require('axios')
const snek = require("snekfetch")

const wall = async(query) => { // Sobre o comando de Wallpapers
    var q = query.replace(/ /g, '+')
    const response = await fetch(`https://wall.alphacoders.com/api2.0/get.php?auth=BOTE AQUI UMA API SEM ESPACOS&method=search&count=1&term=${q}`) // Troque o API por uma API do site alpha coders
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

const ss = async(query) => { // Um print de site
    request({
        url: "https://api.apiflash.com/v1/urltoimage",
        encoding: "binary",
        qs: {
            access_key: "INSIRA AQUI UMA API", // Insira uma api do site apiflash url to image dentro das aspas
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
    axios.get(`https://arugaz.herokuapp.com/api/nulis?text=${encodeURIComponent(teks)}`)
    .then((res) => {
        resolve(`${res.data.result}`)
    })
    .catch((err) => {
        reject(err)
    })
})

const randomNimek = async (type) => { // Uma api de fotos descritas na case
    var url = 'https://api.computerfreaker.cf/v1/'
    switch(type) {
        case 'nsfw':
            const nsfw = await snek.get(url + 'nsfwneko')
            if (!nsfw.ok) throw new Error(`unexpected response ${nsfw.statusText}`)
            return nsfw.body.url
            break
        case 'hentai':
            const hentai = await snek.get(url + 'hentai')
            if (!hentai.ok) throw new Error(`unexpected response ${hentai.statusText}`)
            return hentai.body.url
            break
        case 'dva':
            const dva = await snek.get(url + 'dva')
            if (!dva.ok) throw new Error(`unexpected response ${dva.statusText}`)
            return dva.body.url
            break
        case 'yuri':
            const yuri = await snek.get(url + 'yuri')
            if (!yuri.ok) throw new Error(`unexpected response ${yuri.statusText}`)
            return yuri.body.url
            break
        case 'hug':
            const hug = await snek.get(url + 'hug')
            if (!hug.ok) throw new Error(`unexpected response ${hug.statusText}`)
            return hug.body.url
            break
        case 'anime':
            let anime = await snek.get(url + 'anime')
            if (!anime.ok) throw new Error(`unexpected response ${anime.statusText}`)
            return anime.body.url
            break
        case 'baguette':
            let baguette = await snek.get(url + 'baguette')
            if (!baguette.ok) throw new Error(`unexpected response ${baguette.statusText}`)
            return baguette.body.url
            break
        case 'trap':
            let trap = await snek.get(url + 'trap')
            if (!trap.ok) throw new Error(`unexpected response ${trap.statusText}`)
            return trap.body.url
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