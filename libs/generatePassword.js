const generator = require('generate-password')

module.exports = () => {
    var password = generator.generate({
        length: 12,
        numbers: true
    })
    return password
}