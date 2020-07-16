const dbQuery = require('./dbQuery')

module.exports = async (questions) => {
    return new Promise(function(resolve, reject) {
        try{
            var question_str = "";
            questions[0].forEach( async function(item, i){
                sql = `CALL get_exam_question_details(?)`
                var data = await dbQuery(sql, [item.id])
                console.log(data)
                if(data[0].question_type_id == 1){
                    question_str += data[0].question_type_code + "\t";
                    question_str += data[0].question_content + "\t";
                    data.forEach(function(mcq_item, i){
                        question_str += mcq_item.answer_content + "\t";
                        if(item.answer){
                            question_str += "correct" + "\t";
                        }
                        else{
                            question_str += "incorrect" + "\t";
                        }
                    })
                    question_str += "\n";
                }
                else if(data[0].question_type_id == 11){
                    question_str += data[0].question_type_code + "\t";
                    question_str += data[0].question_content + "\t";
                    if(data[0].truth){
                        question_str += "true" + "\n";
                    }
                    else{
                        question_str += "false" + "\n";
                    }
                }
                else{
                    question_str += data[0].question_type_code + "\t";
                    question_str += data[0].question_content + "\t";
                    question_str += data[0].answer_content + "\n";
                }
            })

            resolve(question_str)
        }
        catch(e){
            throw(e)
        }
    })
}