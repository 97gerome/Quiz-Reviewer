const express = require('express')
const router = express.Router()
const checkNotAuthenticated = require('../libs/checkNotAuthenticated')

router.get('/', checkNotAuthenticated, (req, res) => {
    res.redirect('/login')
})

module.exports = router