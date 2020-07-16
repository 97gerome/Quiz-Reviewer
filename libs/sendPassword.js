const nodemailer = require('nodemailer')
const config = require('../config/config')
const path = require('path')
const transporter = nodemailer.createTransport(config.email)
const ejs = require('ejs')
const hbs = require('nodemailer-express-handlebars')

transporter.use('compile', hbs({
    viewEngine: 'express-handlebars',
    viewPath: './views/'
}))

module.exports = async (email, password, message) => {
    try{
        ejs.renderFile(path.join(__dirname, '../views/email_template.ejs'), { password: password, message: message}, async function (err, data) {
            if (err) {
                console.log(err);
            } 
            else {
                var mailOptions = {
                    from: 'quizreviewer_system@outlook.com',
                    to: email,
                    subject: `${message}`,
                    html: data,
                    attachments: [{
                        filename: 'quiz_reviewer_logo.png',
                        path: path.join(__dirname ,'../public/assets/images/quiz_reviewer_logo.png'),
                        cid: 'logo'
                   }]
                }
                transporter.sendMail(mailOptions)
            }
                
        })
        return true
    }
    catch(e){
        console.log(e)
        return false
    }
    
}
