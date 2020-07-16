const localStrategy = require('passport-local').Strategy
const pool = require('./dbPool')
const dbQuery = require('../libs/dbQuery')
const bcrypt = require('bcrypt')

module.exports = function(passport) { 
    passport.use('local', new localStrategy({
        usernameField: 'email_login',
        passwordField: 'password_login'
    },
        function(email, password, done) {
            var sql = `CALL get_login_credentials('${email}')`
            pool.query(sql, function(err, result){
                if (err) 
                    return done(err)

                if(result[0][0] == null){
                    return done(null, false, {message: 'Please use a valid email address.'})
                }
                bcrypt.compare(password, result[0][0].password, (err,isMatch) => {
                    if(err) throw err

                    if(isMatch){
                        var sql = `CALL remove_password_reset(?)`
                        var results = dbQuery(sql, [email])
                        return done(null, result[0][0].email)
                    } else {
                        return done(null, false, {message: "The password you've entered is incorrect."})
                    }
                })
            })
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user)
    })
      
    passport.deserializeUser((user, done) => {
        done(null, user)
    })
}