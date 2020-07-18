$(document).ready(function(){

  if(sessionStorage.getItem("questions") === null){
    if(getParameterByName("exam") == 0){
      get_all_questions();
    }
    else{
      get_exam_questions();
    }
    
    sessionStorage.setItem("grade", 0);
  }
  else if(JSON.parse(sessionStorage.getItem("questions")).length == 0){
    $(".exam-course-text").text(`${sessionStorage.getItem("examCourse")} ${sessionStorage.getItem("examName")}`);
    $(".exam-course-text").fadeIn(200);
    $(".check-question-button").remove();
    $("#next_question_button").remove();
    show_end_of_exam();
  }
  else{
    $(".exam-course-text").text(`${sessionStorage.getItem("examCourse")} ${sessionStorage.getItem("examName")}`);
    $(".exam-course-text").fadeIn(200);
    get_exam_question_details(JSON.parse(sessionStorage.getItem("questions"))[0]);
  }

  $(document).on("click", ".exam-answers-cell", function(){
    $(".exam-answers-cell").css({backgroundColor: "white", color: "black", borderColor: "#D8DBE2"});
    $(this).css({backgroundColor: "#58A4B0", color: "white", borderColor: "#58A4B0"});
    if($(this).data("questionTypeId") == 1){
      $(".check-question-button").data("answerId", $(this).data("answerId"));
    }
  })

  $(document).on("click", "#exam_answer_cell_true", function(){
    $(".check-question-button").data("truth", 1);
  })

  $(document).on("click", "#exam_answer_cell_false", function(){
    $(".check-question-button").data("truth", false);
  })


  $("#submit_exam_button").click(function(){
    show_pop_up("#submit_exam_pop_up");
  })

  $("#cancel_submit_exam_button").click(function(){
    hide_pop_up("#submit_exam_pop_up");
  })

  $(document).on("submit", "#submit_exam_form", function(){
    $('#submit_exam_form').attr('action', `exam/submit/${getParameterByName("course")}/${getParameterByName("exam")}/${100*sessionStorage.getItem("grade")/sessionStorage.getItem("examQuestions")}`);
    return true;
  })

  $(".check-question-button").click(function(){
    if($(this).data("questionTypeId") == 1 || $(this).data("questionTypeId") == 11 ){
      if($(".check-question-button").data("answerId") != null || 
        $(".check-question-button").data("truth") != null){
          $(document).off("click", ".exam-answers-cell");
          get_correct_answer(JSON.parse(sessionStorage.getItem("questions"))[0]);
        }else{
          $(this).effect("shake");
        }
    }else{
      if($("#fill_exam_answer_input").val() != ""){
        $(document).off("click", ".exam-answers-cell");
        get_correct_answer(JSON.parse(sessionStorage.getItem("questions"))[0]);
      }
      else{
        $(this).effect("shake");
      }
    }
    
  })

  $("#next_question_button").click(function(){
    $(".check-question-button").data("answerId", null);
    $(".check-question-button").data("truth", null);
    get_exam_question_details(JSON.parse(sessionStorage.getItem("questions"))[0]);
    $("#answer_indicator_div").animate({bottom: "-85px"});
    $(".loader-container").fadeIn(200);
    click_answers();
  })

  $("#return_to_main_button").click(function(){
    show_pop_up("#return_to_main_pop_up");
  })

  $("#cancel_return_to_main_button").click(function(){
    hide_pop_up("#return_to_main_pop_up");
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


function get_all_questions(){
    $.ajax({
      type: 'POST',
      url: '/exam/get_all_questions',
      datatype: 'json',
      contenttype: 'application/json; charset=utf-8',
      data: {
          course_id: getParameterByName("course")
      }
    })
    .done(function(data){
      sessionStorage.setItem("examCourse", data[0].course_code);
      sessionStorage.setItem("examName", "All Questions");
      $(".exam-course-text").text(`${sessionStorage.getItem("examCourse")} ${sessionStorage.getItem("examName")}`);
      $(".exam-course-text").fadeIn(200);
      let questions_arr = [];
      data.forEach(function(item, i){
        questions_arr.push(item.id);
      })

      sessionStorage.setItem("examQuestions", data.length)
      sessionStorage.setItem("questions", JSON.stringify(questions_arr));
      sessionStorage.setItem("currentNumber", 1);
      get_exam_question_details(data[0].id);

    })
    .fail(function(jqXHR, textStatus, err){
      console.log(textStatus);
    })
  
}

function get_exam_questions(){
  $.ajax({
    type: 'POST',
    url: '/exam/get_exam_questions',
    datatype: 'json',
    contenttype: 'application/json; charset=utf-8',
    data: {
        exam_id: getParameterByName("exam")
    }
  })
  .done(function(data){
    sessionStorage.setItem("examCourse", data[0].course_code);
    sessionStorage.setItem("examName", data[0].exam_name);
    $(".exam-course-text").text(`${sessionStorage.getItem("examCourse")} ${sessionStorage.getItem("examName")}`);
    $(".exam-course-text").fadeIn(200);
    let questions_arr = [];
    data.forEach(function(item, i){
      questions_arr.push(item.id);
    })

    sessionStorage.setItem("examQuestions", data.length)
    sessionStorage.setItem("questions", JSON.stringify(questions_arr));
    sessionStorage.setItem("currentNumber", 1);
    get_exam_question_details(data[0].id);

  })
  .fail(function(jqXHR, textStatus, err){
    console.log(textStatus);
  })

}

function get_exam_question_details(question_id){
    $.ajax({
      type: 'POST',
      url: '/exam/get_exam_question_details',
      datatype: 'json',
      contenttype: 'application/json; charset=utf-8',
      data: {
        question_id: question_id
      }
    })
    .done(function(data){
      $(".exam-question-text").text(data[0].question_content);
      $(".question-counter-text").text(`${sessionStorage.getItem("currentNumber")} of ${sessionStorage.getItem("examQuestions")}`);
      populate_exam_question_details(data);
      $(".loader-container").fadeOut(200);

    })
    .fail(function(jqXHR, textStatus, err){
      console.log(textStatus);
    })
  
}

function populate_exam_question_details(data){
  $(".exam-answers-container").empty();
  if(data[0].question_type_id == 1){
    data.forEach( (item, i) => {

      $(".exam-answers-container").append(`
        <div class = "exam-answers-cell" id = "exam_answer_cell${i}">
          <h6 class = "exam-answers-cell-text">${item.answer_content}</h6>
        </div>
        `);

      $(`#exam_answer_cell${i}`).data("answerId", item.answer_id);
      $(`#exam_answer_cell${i}`).data("questionTypeId", item.question_type_id);
      $(".check-question-button").data("questionTypeId", item.question_type_id);

    })

  }
  else if(data[0].question_type_id == 11){
      $(".exam-answers-container").append(`
        <div class = "exam-answers-cell" id = "exam_answer_cell_true">
          <h6 class = "exam-answers-cell-text" >True</h6>
        </div>
        `);

      $(".exam-answers-container").append(`
        <div class = "exam-answers-cell" id = "exam_answer_cell_false">
          <h6 class = "exam-answers-cell-text">False</h6>
        </div>
        `);

      $(`#exam_answer_cell_true`).data("questionTypeId", data[0].question_type_id);
      $(`#exam_answer_cell_false`).data("questionTypeId", data[0].question_type_id);
      $(".check-question-button").data("questionTypeId", data[0].question_type_id);

  }
  else{
    $(".exam-answers-container").append(`
        <div class = "exam-fill-answers-cell">
          <input id = "fill_exam_answer_input" placeholder = "Answer" autocomplete = "off">
        </div>
        `);
    $(".check-question-button").data("questionTypeId", data[0].question_type_id);
  }
}

function get_correct_answer(question_id){
  $.ajax({
    type: 'POST',
    url: '/exam/get_correct_answer',
    datatype: 'json',
    contenttype: 'application/json; charset=utf-8',
    data: {
      question_id: question_id
    }
  })
  .done(function(data){
    if(data[0].question_type_id == 1)
    {
      if($(".check-question-button").data("answerId") == data[0].id){

        grade_increment();
        show_answer_correct();

      }
      else{
        show_answer_incorrect();
      }
    }
    else if (data[0].question_type_id == 11)
    {
      if($(".check-question-button").data("truth") == data[0].truth){

        grade_increment();
        show_answer_correct();
      }
      else{
        show_answer_incorrect();
      }
    }
    else{
      if($("#fill_exam_answer_input").val().toLowerCase() == data[0].answer_content.toLowerCase()){
        grade_increment();
        show_answer_correct();
      }
      else{
        show_answer_incorrect();
      }
    }
    let arr = JSON.parse(sessionStorage.getItem("questions"));
    arr.shift();
    sessionStorage.setItem("questions", JSON.stringify(arr));
    let current_number = parseInt(sessionStorage.getItem("currentNumber"));
    current_number++;
    sessionStorage.setItem("currentNumber", current_number);
    if(JSON.parse(sessionStorage.getItem("questions"))[0] == null){
      $("#next_question_button").remove();
    }
    

  })
  .fail(function(jqXHR, textStatus, err){
    console.log(textStatus);
  })
}

function show_answer_correct(){
  $("#answer_status_text").text("Correct!");
  $("#answer_indicator_div").css({backgroundColor: "#58A4B0"});
  $("#answer_indicator_div").animate({bottom: "0px"});
}

function show_end_of_exam(){
  $("#answer_status_text").text("Exam done! Please submit to save your grade.");
  $("#answer_indicator_div").css({backgroundColor: "#58A4B0"});
  $("#answer_indicator_div").animate({bottom: "0px"});
}

function show_answer_incorrect(){
  $("#answer_status_text").text("Incorrect!");
  $("#answer_indicator_div").css({backgroundColor: "#BA3B46"});
  $("#answer_indicator_div").animate({bottom: "0px"});
}

function grade_increment(){
  let grade = sessionStorage.getItem("grade");
  grade++;
  sessionStorage.setItem("grade", grade);
}

function click_answers(){
  $(document).on("click", ".exam-answers-cell", function(){
    $(".exam-answers-cell").css({backgroundColor: "white", color: "black", borderColor: "#D8DBE2"});
    $(this).css({backgroundColor: "#58A4B0", color: "white", borderColor: "#58A4B0"});
    if($(this).data("questionTypeId") == 1){
      $(".check-question-button").data("answerId", $(this).data("answerId"));
    }
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

