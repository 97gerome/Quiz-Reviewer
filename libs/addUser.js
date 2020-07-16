const pool = require('./dbPool')

module.exports = async (name, email, hashed_pass, account_type) => {
    return new Promise(function(resolve, reject) {
        var sql = `CALL add_user(?,?,?,?)`
        pool.query(sql, [name, email, hashed_pass, account_type],(err, result) => {
            if(err){
                console.log(err)
                resolve(false)
            }
            resolve(true)

        })    
    })
}