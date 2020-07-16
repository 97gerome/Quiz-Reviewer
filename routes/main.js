const express = require('express')
const dbQuery = require('../libs/dbQuery')
const router = express.Router()
const checkAuthenticated = require('../libs/checkAuthenticated')
const encryptPassword = require('../libs/encryptPassword')
const checkPassword = require('../libs/checkPassword')
const { session } = require('passport')
const createTextFile = require('../libs/createTextFile')


module.exports = function(passport){

    require('../libs/passportConfig')(passport)
    
    router.get('/',checkAuthenticated, (req, res) => {

        res.render('quiz_reviewer_main.ejs')
    
    })
    
    router.post('/', (req, res,next) => {
        passport.authenticate('local', {
        successRedirect: '/main',
        failureRedirect: '/',
        failureFlash: true
        })(req,res,next)
    })

    router.post('/get_account_details', async (req,res) => {

        var sql = `CALL get_account_details(?)`
        results = await dbQuery(sql, [req.session.passport.user])
        res.send(results[0][0])

    })

    router.post('/change_account_name', async (req, res) => {

        var sql = `CALL change_account_name(?,?)`
        var results = await dbQuery(sql, [req.body.name, req.session.passport.user])
        res.send("Account name successfully changed.")

    })

    router.post('/change_password', async (req, res) => {

        var sql = `CALL get_login_credentials(?)`
        var results = await dbQuery(sql, [req.session.passport.user])
        if(await checkPassword(req.body.old_pass, results[0][0].password)){
            new_hashed_pass = await encryptPassword(req.body.new_pass)
            console.log(new_hashed_pass)
            var sql = `CALL change_password(?,?)`
            results = await dbQuery(sql, [req.session.passport.user, new_hashed_pass])
            res.send(`Password changed successfully.`)
        }
        else res.send(`The old password you've entered is incorrect.`)
    })

    router.post('/get_courses', async (req, res) => {
        var sql = `CALL get_my_courses(?)`
        var results = await dbQuery(sql, [req.session.passport.user])
        res.send(results[0])
    })

    router.post('/get_other_courses', async(req, res) => {
        var sql = `CALL get_other_courses(?)`
        var results = await dbQuery(sql, [req.session.passport.user])
        res.send(results[0])
    })

    router.post('/join_course', async (req, res) => {
        var sql = `CALL add_account_course(?,?)`
        var results = await dbQuery(sql, [req.body.course_id, req.session.passport.user])
        res.send(results[0])
    })

    router.delete('/leave_course', async (req, res) => {
        var sql = `CALL delete_account_course(?)`
        var results = await dbQuery(sql, [req.body.account_course_id])
        res.end()
    })

    router.post('/create_course', async (req, res) => {
        var sql = `CALL add_course(?,?,?)`
        var results = await dbQuery(sql, [req.body.course_code, req.body.course_name, req.session.passport.user])
        res.redirect('/main')
    })

    router.post('/get_exams', async (req, res) => {
        var sql = `CALL get_exams(?,?)`
        var results = await dbQuery(sql, [req.body.course_id, req.session.passport.user])
        res.send(results[0])
    })

    router.post('/add_fill_question', async (req, res) => {
        var sql = `CALL add_fill_question(?,?,?,?,21,?)`
        var results = await dbQuery(sql, [req.body.course_outcome, req.body.question, req.body.course_id, req.session.passport.user, req.body.answer])
        res.send("Question successfully uploaded!");
    })

    router.post('/add_tf_question', async (req, res) => {
        var sql = `CALL add_true_false_question(?,?,?,?,11,?)`
        var results = await dbQuery(sql, [req.body.course_outcome, req.body.question, req.body.course_id, req.session.passport.user, req.body.answer])
        res.send("Question successfully uploaded!");
    })

    router.post('/add_mcq_question', async (req, res) => {
        var sql = `CALL add_multiple_choice_question( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        var results = await dbQuery(sql, [req.body.course_outcome, req.body.question, req.body.course_id, req.session.passport.user, 1, req.body.answer1, req.body.correct_answer1, req.body.answer2, req.body.correct_answer2, req.body.answer3, req.body.correct_answer3, req.body.answer4, req.body.correct_answer4])
        res.send("Question successfully uploaded!");
    })

    router.post('/get_my_questions', async (req, res) => {
        var sql = `CALL get_my_questions(?)`
        var results = await dbQuery(sql, [req.session.passport.user])
        res.send(results[0])
    })

    router.post('/get_question_details', async (req, res) => {
        var sql = `CALL get_question_details(?,?)`
        var results = await dbQuery(sql, [req.body.question_id, req.session.passport.user])
        res.send(results[0])
    })

    router.post('/edit_my_question', async (req, res) => {
        var sql = `CALL edit_my_question(?,?,?,?,?)`
        var results = await dbQuery(sql, [req.body.question_id, req.body.question, req.body.answer_id, req.body.truth, req.body.answer])
        res.send("Changes have been saved!")
    })

    router.delete('/delete_question', async (req, res) => {
        var sql = `CALL delete_question(?)`
        var results = await dbQuery(sql, [req.body.question_id])
        res.end()
    })

    router.post('/get_course_question_count', async (req, res) => {
        var sql = `CALL get_course_question_count(?)`
        var results = await dbQuery(sql, [req.body.course_id])
        res.send(results[0])
    })

    router.post('/get_all_questions_grade', async (req, res) => {
        var sql = `CALL get_all_questions_grade(?,?)`
        var results = await dbQuery(sql, [req.session.passport.user ,req.body.course_id])
        res.send(results[0])
    })

    router.post('/get_exam_grades', async (req, res) => {
        var sql = `CALL get_exam_grades(?,?)`
        var results = await dbQuery(sql, [req.session.passport.user ,req.body.course_id])
        res.send(results[0])
    })

    return router
}