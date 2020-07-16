const pool = require('./dbPool')

module.exports = async (sql, arr) => {
    return new Promise(function(resolve, reject) {
        try{
            pool.query(sql, arr, function(err, result){
            if (err) throw err  
            resolve(result)
            }) 
        }
        catch(e){
            throw e
        }
    })
}