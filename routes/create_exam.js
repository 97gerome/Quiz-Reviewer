const express = require('express')
const dbQuery = require('../libs/dbQuery')
const router = express.Router()
const checkAuthenticated = require('../libs/checkAuthenticated')

router.get('/', checkAuthenticated, (req, res) => {

    res.render('quiz_reviewer_create_exam.ejs', {id: req.query.id, course_name: req.query.course_name})

})

router.get('/:id/:courseName', checkAuthenticated, (req, res) => {

    res.redirect(`/create_exam?id=${req.params.id}&course_name=${req.params.courseName}`)

})

router.post('/get_course_outcomes', async(req, res) => {

    var sql = `CALL get_course_outcomes()`
    var results = await dbQuery(sql)
    res.send(results[0])

})

router.post('/get_tf_questions_by_co', async(req, res) => {

    var sql = `CALL get_true_false_questions_by_course_outcome(?,?)`
    var results = await dbQuery(sql, [req.body.course_outcome_id, req.body.course_id])
    res.send(results[0])

})

router.post('/get_other_questions_by_co', async(req, res) => {

    var sql = `CALL get_other_questions_by_course_outcome(?,?)`
    var results = await dbQuery(sql, [req.body.course_outcome_id, req.body.course_id])
    res.send(results[0])

})

router.post('/add_exam', async(req, res) => {

    var sql = `CALL add_exam(?,?,?,?)`
    var results = await dbQuery(sql, [req.session.passport.user, req.body.course_id, req.body.exam_name, req.body.visibility])
    res.send(results[0])

})

router.post('/add_exam_question', async(req, res) => {

    var sql = `CALL add_exam_question(?,?)`
    var results = await dbQuery(sql, [req.body.exam_id, req.body.question_id])
    res.end()

})

module.exports = router