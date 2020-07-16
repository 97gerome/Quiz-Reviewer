const express = require('express')
const router = express.Router()
const dbQuery = require('../libs/dbQuery')
const encryptPassword = require('../libs/encryptPassword')
const checkEmail = require('../libs/checkEmail')
const sendPassword = require('../libs/sendPassword')
const generatePassword = require('../libs/generatePassword')
const checkNotAuthenticated = require('../libs/checkNotAuthenticated')

router.get('/', checkNotAuthenticated, (req, res) => {

    res.render('quiz_reviewer_login.ejs')

})

router.post('/reset_password', async (req, res) => {

    result = await checkEmail(req.body.email)
    if(!result[0][0].existence){
        res.send(`An account using this email does not exist.`)
    }
    else{
        var sql = `CALL check_password_reset(?)`
        var reset_status = await dbQuery(sql, [req.body.email])
        if(reset_status[0][0].password_reset){
            res.send("A new password has already been sent to your email.");
        }
        else{
            pass = generatePassword()
            hashed_pass = await encryptPassword(pass)
            var send_password_status = await sendPassword(req.body.email, pass, "Password Reset")
            if(send_password_status){
                var sql = `CALL reset_password(?,?)`
                var results = await dbQuery(sql, [req.body.email, hashed_pass])
                res.send(`An email containing your new password was sent to ${req.body.email}`)
            }
            else{

                res.send("Something went wrong.");

            }
        }

    }
    

})

module.exports = router