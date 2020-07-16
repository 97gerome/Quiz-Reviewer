const express = require('express')
const dbQuery = require('../libs/dbQuery')
const router = express.Router()
const checkAuthenticated = require('../libs/checkAuthenticated')

router.get('/', checkAuthenticated, (req, res) => {

    res.render('quiz_reviewer_exam.ejs', {course: req.query.course, exam_id: req.query.exam_id})

})

router.get('/:course/:exam_id', checkAuthenticated, (req, res) => {

    res.redirect(`/exam?course=${req.params.course}&exam=${req.params.exam_id}`)

})

router.post('/get_all_questions', async (req,res) => {

    var sql = `CALL get_all_questions_by_course(?)`
    results = await dbQuery(sql, [req.body.course_id])
    res.send(results[0])

})

router.post('/get_exam_question_details', async (req, res) => {
    var sql = `CALL get_exam_question_details(?)`
    var results = await dbQuery(sql, [req.body.question_id])
    res.send(results[0])
})

router.post('/get_correct_answer', async (req, res) => {
    var sql = `CALL get_correct_answer(?)`
    var results = await dbQuery(sql, [req.body.question_id])
    res.send(results[0])
})

router.post('/get_exam_questions', async (req, res) => {
    var sql = `CALL get_exam_questions(?)`
    var results = await dbQuery(sql, [req.body.exam_id])
    res.send(results[0])
})

router.get('/submit/:course_id/:exam_id/:grade', checkAuthenticated, async (req, res) => {

    var sql = `CALL add_grade(?,?,?,?)`
    var results = await dbQuery(sql, [req.session.passport.user, req.params.exam_id, req.params.grade, req.params.course_id])
    res.redirect("/")
})


module.exports = router