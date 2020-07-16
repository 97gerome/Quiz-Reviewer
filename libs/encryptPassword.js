const bcrypt = require('bcrypt')

encryptPassword = async(password) => {
    
    var hashed_pass = await bcrypt.hash(password, 10);
    return hashed_pass
}

module.exports = encryptPassword