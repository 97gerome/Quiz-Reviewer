var added_questions_arr = [];
$(document).ready(function(){
    $("#save_create_exam_button").data("courseId", getParameterByName("id"));
    $("#save_create_exam_button").click(function(){

    })

    get_course_outcomes();

    $("#notification_ok_button").click(function(){
        hide_pop_up("#notification_pop_up");
    });

    $("#cancel_create_exam_form").submit(function(){

        if(added_questions_arr.length == 0){
            return true;
        }
        else{
            let confirm_return = confirm("You have not saved this exam. Are you sure you want to return?");
            if(confirm_return){
                return true;
            }
            return false;
        }     
        
    })

    $("#save_create_exam_button").click(function(){
        if($("#create_exam_name_input").val() == "")
        {
            show_pop_up("#notification_pop_up", "Please enter an exam name before saving.");
        }
        else if(added_questions_arr.length == 0){

            show_pop_up("#notification_pop_up", "Please add questions to the exam before saving.");
        }
        else{

            add_exam();

        }

    })

    $(document).on("click", ".exam-coverage-co-cell", function(){

        if(!$(this).data("included")){
            $("#create_exam_questions_loader").css({display: "flex"});
            $(".create-exam-added-questions-container").append(`<div id = "course_outcome${$(this).data("courseOutcomeNumber")}_added_container"></div>`);
            $(".create-exam-questions-container").append(`<div id = "course_outcome${$(this).data("courseOutcomeNumber")}_container"></div>`);
            $(`#course_outcome${$(this).data("courseOutcomeNumber")}_container`).append(`<h6 class = "white-main-title-text">Course Outcome ${$(this).data("courseOutcomeNumber")}</h6>`);
            $(this).css({backgroundColor: "#58A4B0", color: "white"});
            $(this).data("included", true);
            get_tf_questions_by_co($(this).data("courseOutcomeId"));
            get_other_questions_by_co($(this).data("courseOutcomeId"));
        }
        else{
            if($(`#course_outcome${$(this).data("courseOutcomeNumber")}_added_container`).is(':empty')){
                $(this).css({backgroundColor: "white", color: "black"});
                $(this).data("included", false);
                $(`#course_outcome${$(this).data("courseOutcomeNumber")}_container`).remove();
                $(`#course_outcome${$(this).data("courseOutcomeNumber")}_added_container`).remove();
            }
            else{
                show_pop_up("#notification_pop_up", "You have added questions under this Course Outcome");
            }         
        }
    })

    $(document).on("click", ".create-exam-question-cell", function(){

        if(!(added_questions_arr.includes($(this).data("questionId")))){
            added_questions_arr.push($(this).data("questionId"));
            node = document.getElementById($(this).attr('id'));
            document.getElementById(`course_outcome${$(this).data("courseOutcomeNumber")}_added_container`).appendChild(node);
            console.log(added_questions_arr[0])
        }
        else{
            var index = added_questions_arr.indexOf($(this).data("questionId"));
            if (index > -1) { added_questions_arr.splice(index, 1) }
            node = document.getElementById($(this).attr('id'));
            document.getElementById(`course_outcome${$(this).data("courseOutcomeNumber")}_container`).appendChild(node);
            console.log(added_questions_arr[0])
        }
        
    })

})

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function get_course_outcomes(){
    $.ajax({
      type: 'POST',
      url: '/create_exam/get_course_outcomes',
      datatype: 'json',
      contenttype: 'application/json; charset=utf-8'
    })
    .done(function(data){
        data.forEach( (item, i) => {
            $(".exam-coverage-container").append(`
                <div class = "exam-coverage-co-cell" id = "exam_coverage_co_cell${i}">
                    <h6>Course Outcome ${item.number}</h6>
                </div>`);

            $(`#exam_coverage_co_cell${i}`).data("courseOutcomeId", item.id);
            $(`#exam_coverage_co_cell${i}`).data("courseOutcomeNumber", item.number);
            $(`#exam_coverage_co_cell${i}`).data("included", false);
            
        })
        $("#create_exam_details_container").fadeOut(200);
    })
    .fail(function(jqXHR, textStatus, err){
      console.log(textStatus);
    })
  
}

function get_tf_questions_by_co(course_outcome_id){
    $.ajax({
        type: 'POST',
        url: '/create_exam/get_tf_questions_by_co',
        datatype: 'json',
        contenttype: 'application/json; charset=utf-8',
        data: {
            course_outcome_id: course_outcome_id,
            course_id: $("#save_create_exam_button").data("courseId")
        }
      })
      .done(function(data){
          data.forEach( (item, i) => {
              $(`#course_outcome${item.number}_container`).append(`
                <div class = "create-exam-question-cell" id = "create_exam_question_cell${item.id}">
                    <h6 class = "create-exam-question-text">${item.question_content}</h6>
                </div>
              `);

              if(item.truth){
                $(`#create_exam_question_cell${item.id}`).append(`
                <h6 class = "create-exam-correct-answer-text">True</h6>
                <h6 class = "create-exam-answer-text">False</h6>`);
              }
              else{
                $(`#create_exam_question_cell${item.id}`).append(`
                <h6 class = "create-exam-answer-text">True</h6>
                <h6 class = "create-exam-correct-answer-text">False</h6>`);
              }
              $(`#create_exam_question_cell${item.id}`).data("questionId", item.id)
              $(`#create_exam_question_cell${item.id}`).data("courseOutcomeNumber", item.number)
          })
      })
      .fail(function(jqXHR, textStatus, err){
        console.log(textStatus);
      })
}

function get_other_questions_by_co(course_outcome_id){
    $.ajax({
        type: 'POST',
        url: '/create_exam/get_other_questions_by_co',
        datatype: 'json',
        contenttype: 'application/json; charset=utf-8',
        data: {
            course_outcome_id: course_outcome_id,
            course_id: $("#save_create_exam_button").data("courseId")
        }
      })
      .done(function(data){
          data.forEach( (item, i) => {

            if (item.question_type_id == 21){
                $(`#course_outcome${item.number}_container`).append(`
                    <div class = "create-exam-question-cell" id = "create_exam_question_cell${item.id}">
                        <h6 class = "create-exam-question-text">${item.question_content}</h6>
                        <h6 class = "create-exam-correct-answer-text">${item.answer_content}</h6>
                    </div>
                `);
            }
            else if(!($(`#create_exam_question_cell${item.id}`).length)){
                $(`#course_outcome${item.number}_container`).append(`
                    <div class = "create-exam-question-cell" id = "create_exam_question_cell${item.id}">
                        <h6 class = "create-exam-question-text">${item.question_content}</h6>
                    </div>
                `);
                if(item.answer){
                    $(`#create_exam_question_cell${item.id}`).append(`
                    <h6 class = "create-exam-correct-answer-text">${item.answer_content}</h6>`);

                }
                else{
                    $(`#create_exam_question_cell${item.id}`).append(`
                    <h6 class = "create-exam-answer-text">${item.answer_content}</h6>`);
                }

            }
            else{
                if(item.answer){
                    $(`#create_exam_question_cell${item.id}`).append(`
                    <h6 class = "create-exam-correct-answer-text">${item.answer_content}</h6>`);

                }
                else{
                    $(`#create_exam_question_cell${item.id}`).append(`
                    <h6 class = "create-exam-answer-text">${item.answer_content}</h6>`);
                }

            }

              $(`#create_exam_question_cell${item.id}`).data("questionId", item.id)
              $(`#create_exam_question_cell${item.id}`).data("courseOutcomeNumber", item.number)
          })

          $("#create_exam_questions_loader").fadeOut(200);
      })
      .fail(function(jqXHR, textStatus, err){
        console.log(textStatus);
      })
}

function show_pop_up(pop_up_div, message){
    $("#notification_pop_up_text").text(message)
    $(".pop-up-container").css({display: "flex"});
    $(".pop-up-container").animate({backgroundColor: "rgb(0,0,0,0.2)"}, 300);
    $(pop_up_div).css({display: "inline-block"});
    $(pop_up_div).animate({marginTop: "0"}, 300);
}

function hide_pop_up(pop_up_div){
    $(".pop-up-container").animate({backgroundColor: "transparent"}, 300);
    setTimeout(function(){ $(".pop-up-container").css("display", "none");}, 300);
    setTimeout(function(){ $(pop_up_div).css("display", "none");}, 300);
    $(pop_up_div).animate({marginTop: "200vh"}, 300);
}

function add_exam(){
    $.ajax({
        type: 'POST',
        url: '/create_exam/add_exam',
        datatype: 'json',
        contenttype: 'application/json; charset=utf-8',
        data: {
            exam_name: $("#create_exam_name_input").val(),
            visibility: $('input[name="visibility_radio"]:checked').val(),
            course_id: $('#save_create_exam_button').data("courseId")
        }
      })
      .done(function(data){
          added_questions_arr.forEach((item,i) => {
            add_exam_question(data[0].id, item);
            console.log(item);
          })
          show_pop_up("#notification_pop_up", "Success!")
      })
      .fail(function(jqXHR, textStatus, err){
        console.log(textStatus);
      })
}

function add_exam_question(exam_id, question_id){
    $.ajax({
        type: 'POST',
        url: '/create_exam/add_exam_question',
        datatype: 'json',
        contenttype: 'application/json; charset=utf-8',
        data: {
            exam_id: exam_id,
            question_id: question_id
        }
      })
      .done(function(data){
      })
      .fail(function(jqXHR, textStatus, err){
        console.log(textStatus);
      })
}