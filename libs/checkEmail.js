const pool = require('./dbPool')

module.exports = async (email) => {
    return new Promise(function(resolve, reject) {
        var sql = `CALL check_email_exists('${email}')`;
        try{
            pool.query(sql, function(err, result){
            if (err) throw err  
            resolve(result)
            }) 
        }
        catch(e){
            throw e
        }
    })
    
}