const express = require('express')
const router = express.Router()
const checkEmail = require('../libs/checkEmail')
const encryptPassword = require('../libs/encryptPassword')
const sendPassword = require('../libs/sendPassword')
const bodyParser = require('body-parser')
const generatePassword = require('../libs/generatePassword')
const addUser = require('../libs/addUser')

router.post('/', async (req, res) => {
    result = await checkEmail(req.body.email)
    if(result[0][0].existence){
        res.send(`The email ${req.body.email} is already in use.`)
    }
    else{
        pass = generatePassword()
        hashed_pass = await encryptPassword(pass)
        add_user_status = await addUser(req.body.name, req.body.email, hashed_pass, req.body.account_type)
        send_password_status = await sendPassword(req.body.email, pass, "Welcome to Quiz Reviewer!")
        if(add_user_status && send_password_status)
            res.send(`Sign Up success! An email has been sent to ${req.body.email} containing your password.`)
        else
            res.send(`Sign Up failed. Please try again.`)
    }
})

module.exports = router