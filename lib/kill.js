const { fetchJson } = require('./fether')

const quote = async (quotes, author) => new Promise((resolve, reject) => {
    const q = quotes.replace(/ /g, '%20').replace('\n','%5Cn')
    fetchJson('http://terhambar.com/aw/qts/?kata=' + q + '&author=' + author + '&tipe=random')
       .then((res) => {
           resolve(res.result)
    })
       .catch((err) => {
            reject(err)
    })
     
})

module.exports = {
	quote
}
