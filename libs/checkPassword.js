const bcrypt = require('bcrypt')

module.exports = async (pass, hashed_pass) => {

    try{
        if(await bcrypt.compare(pass, hashed_pass)){
            return true
        }
        return false
    }
    catch(e){
        console.log(e)
    }

}