if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express=require('express');
const bodyParser = require('body-parser')
const session = require('express-session')
const indexRouter = require('./routes/index')
const loginRouter = require('./routes/login')
const signupRouter = require('./routes/sign_up')
const logoutRouter = require('./routes/logout')
const createExamRouter = require('./routes/create_exam')
const examRouter = require('./routes/exam')
const passport = require('passport');
const flash = require('express-flash')
const methodoverride = require('method-override')
const mainRouter = require('./routes/main')(passport)

const app = express()
app.set('view engine', 'ejs'); 
app.set('port', (process.env.PORT || 8080))

app.use(flash())
app.use(
  session({ 
  secret: 'secret',
  resave: true,
  saveUninitialized: false
  })
)
app.use(passport.initialize())
app.use(passport.session({
  secre: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))


app.use('/public', express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(methodoverride('_method'))
app.use('/', indexRouter)
app.use('/login', loginRouter)
app.use('/sign_up', signupRouter)
app.use('/main', mainRouter)
app.use('/logout', logoutRouter)
app.use('/create_exam', createExamRouter)
app.use('/exam', examRouter)


app.listen(app.get('port'),()=>{ console.log(`App running on ${app.get('port')}`)})

