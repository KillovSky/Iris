const chalk = require('chalk') // serve pra usar cores na console log

module.exports = color = (text, color) => {
    return !color ? chalk.green(text) : chalk.keyword(color)(text)
}