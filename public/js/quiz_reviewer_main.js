var current_view = "";
$(document).ready(function(){

    sessionStorage.removeItem("questions");
    sessionStorage.removeItem("grade");
    sessionStorage.removeItem("examQuestions");
    sessionStorage.removeItem("examName");
    sessionStorage.removeItem("currentNumber");
    sessionStorage.removeItem("examCourse");
    get_account_type();
    get_account_details();
    get_my_questions();
    
    var mql = window.matchMedia('(min-width: 769px)');
    mql.addListener(screenTest);

    $("#true_false_button").click(function(){
      $(".question-type-highlight").animate({marginTop: "40px"}, { duration: 200, queue: false });
      $(".question-type-highlight").animate({borderRadius: "20px"}, { duration: 100, queue: false });
      $(".question-type-highlight").delay(100).animate({borderRadius: "10px"}, 100);
      $("#multiple_choice_button").css({color: "black"});
      setTimeout(function(){ $("#true_false_button").css("color", "white");}, 100);
      $("#fill_blanks_button").css({color: "black"});
      open_container("#multiple_choice_container", "#fill_blanks_container", "#true_false_container");
      clear_correct_answers(".correct-answer-div");
      $("#fill_answer").val("");
      $("#multiple_choice_container").find(".new-answer-input").val("");
      clear_mcq_upload_button_data();
    });
  
    $("#multiple_choice_button").click(function(){
      $(".question-type-highlight").animate({marginTop: "0px"}, { duration: 200, queue: false });
      $(".question-type-highlight").animate({borderRadius: "20px"}, { duration: 100, queue: false });
      $(".question-type-highlight").delay(100).animate({borderRadius: "10px"}, 100);
      setTimeout(function(){ $("#multiple_choice_button").css("color", "white");}, 125);
      $("#true_false_button").css({color: "black"});
      $("#fill_blanks_button").css({color: "black"});
      open_container("#true_false_container", "#fill_blanks_container", "#multiple_choice_container");
      clear_correct_answers(".correct-answer-div");
      $("#fill_answer").val("");
      $("#upload_tf_button").data("truth", null);
    });
  
    $("#fill_blanks_button").click(function(){
      $(".question-type-highlight").animate({marginTop: "80px"}, { duration: 200, queue: false });
      $(".question-type-highlight").animate({borderRadius: "20px"}, { duration: 100, queue: false });
      $(".question-type-highlight").delay(100).animate({borderRadius: "10px"}, 100);
      $("#multiple_choice_button").css({color: "black"});
      $("#true_false_button").css({color: "black"});
      setTimeout(function(){ $("#fill_blanks_button").css("color", "white");}, 125);
      open_container("#true_false_container", "#multiple_choice_container","#fill_blanks_container");
      clear_correct_answers(".correct-answer-div");
      $("#multiple_choice_container").find(".new-answer-input").val("");
      $("#upload_tf_button").data("truth", null);
      clear_mcq_upload_button_data();
    });
  
    $("#exams_tab").click(function(){
      $(".course-view-nav-highlight").animate({marginLeft: "34.5%"}, { duration: 200, queue: false });
      open_container("#add_questions_container", "#grades_container", "#exams_container");
    });
  
    $("#add_questions_tab").click(function(){
      $(".course-view-nav-highlight").animate({marginLeft: "20px"}, { duration: 200, queue: false });
      open_container("#grades_container", "#exams_container", "#add_questions_container");
    });
  
    $("#grades_tab").click(function(){
      $(".course-view-nav-highlight").animate({marginLeft: "65%"}, { duration: 200, queue: false });
      open_container("#exams_container", "#add_questions_container", "#grades_container");
    });
  
    $("#courses_button").click(function(){
      show_main_containers(".my-account-container", ".my-questions-container", ".course-view-container", ".courses-container");
      $(".mainview-modal-overlay").fadeOut(200);
      if(!mql.matches){
        $(".navbar-div").animate({left: "-240px"});
        $("html, body").animate({ scrollTop: 0}, 200);
        $("body").css({overflowY: "scroll"});
      }
    });
  
    $("#my_account_button").click(function(){
      show_main_containers(".course-view-container", ".courses-container", ".my-account-container", ".my-questions-container");
      $(".mainview-modal-overlay").fadeOut(200);
      if(!mql.matches){
        $(".navbar-div").animate({left: "-240px"});
        $("html, body").animate({ scrollTop: 0}, 200);
        $("body").css({overflowY: "scroll"});
      }
    });

    $(".mainview-modal-overlay").click(function(){
      $(".mainview-modal-overlay").fadeOut(200);
      if(!mql.matches){
        $(".navbar-div").animate({left: "-240px"});
        $("body").css({overflowY: "scroll"});
      }
    })
  
    $("#logout_button").click(function(){
      show_pop_up("#log_out_pop_up");
    });

    $(document).on("click", ".edit-question-button", function() {
      $("#edit_question_pop_up").append(`
      <div class = "loader-container" id = "edit_question_pop_up_loader">
        <div class="spinner">
          <div class="rect1"></div>
          <div class="rect2"></div>
          <div class="rect3"></div>
          <div class="rect4"></div>
          <div class="rect5"></div>
        </div>
      </div>  
      `);
      get_question_details($(this).data("questionId"));
      $("#save_edit_question_button").data("questionId", $(this).data("questionId"));
      show_pop_up("#edit_question_pop_up");
    })
  
    $(document).on("click", ".delete-question-button", function() {
      show_pop_up("#delete_question_pop_up");
      $("#confirm_delete_question_button").data("questionId", $(this).data("questionId"));
    });
  
    $("#cancel_log_out_button").click(function(){
      hide_pop_up("#log_out_pop_up");
    });
  
    $("#cancel_edit_question_button").click(function(){
      hide_pop_up("#edit_question_pop_up");
    });
  
    $("#cancel_delete_question_button").click(function(){
      hide_pop_up("#delete_question_pop_up");
    });

    $("#my_account_edit_button").click(function(){
        $("#my_account_save_button").css({display: "inline-block"});
        $("#my_account_cancel_button").css({display: "inline-block"});
        $("#my_account_edit_button").css({display: "none"});
        $("#my_account_name").prop("disabled", false);
        $("#my_account_name").css({border: "1px solid #D8DBE2"});
    })

    $("#my_account_save_button").click(function(){
        change_account_name();
    })

    $("#notification_ok_button").click(function(){
        hide_pop_up("#notification_pop_up");
      });

    $("#my_account_cancel_button").click(function(){
        disable_my_account_edit();
    })

    $("#save_new_password_button").click(function(){
        change_password()
    })

    $("#new_password_visibility").click(function(){
      if( $("#new_password").attr("type") === 'password' ){
        $("#new_password").attr("type", "text");
        $("#new_password_visibility").text("visibility_off");
      }else{
        $("#new_password").attr("type", "password");
        $("#new_password_visibility").text("visibility");
      } 
    })

    $(document).on("click", ".join-course-button", function() {
      join_course($(this).data("courseId"));
      $("html, body").animate({ scrollTop: 0}, 200);
    })

    $(document).on("click", ".leave-course-button", function() {
      leave_course($(this).data("accountCourseId"));
      $("html, body").animate({ scrollTop: 0}, 200);
    })

    $(document).on("click", "#create_new_course_button", function() {
      $(".pop-up-container").append(`
        <div class = "pop-up-div" id = "create_course_pop_up">
          <h6 class = "main-title-text">New Course</h6>
            <form id = "create_course_form" action = "main/create_course" method = "POST">
                <div class = "create-course-input-container">
                    <input class = "create-course-input" id = "create_course_code_input" name = "course_code"placeholder="Course Code">
                    <input class = "create-course-input" id = "create_course_name_input" name = "course_name" placeholder="Course Name">
                </div>
                <div class = "pop-up-button-container">
                    <button class="pop-up-button" id = "create_course_button">Create</button>
                    <button class="pop-up-button" id = "cancel_create_course_button" type = "button">Cancel</button>
                </div>
            </form>
        </div>`);
      show_pop_up("#create_course_pop_up");
    })

    $(document).on("click", "#cancel_create_course_button", function(){
      hide_pop_up("#create_course_pop_up");
      setTimeout(function() {
        $('#create_course_pop_up').remove();
      }, 300);
    })

    $(document).on("submit", "#create_course_form", function(){

      if($("#create_course_code_input").val() == "" || $("#create_course_name_input").val() == ""){
        $("#create_course_pop_up").effect("shake");
        return false;
      }
      else{
          return true;
      }

    })

    $("#selected_course_outcome_button").click(function(){
      $(".new-question-co-container").animate({height: "338px"}, 200);
    })

    $(".course-outcome-button").click(function(){
      $("#selected_course_outcome_button").data("courseOutcome", $(this).val());
      $("#selected_course_outcome_button").text($(this).text());
      $(".new-question-co-container").animate({height: "38px"}, 200);
    })

    $(document).on("click", ".view-course-button", function() {
      $("#course_view_course_name").text($(this).data("courseName"));
      $("#upload_fill_button").data("courseId", $(this).data("courseId"));
      $("#upload_mcq_button").data("courseId", $(this).data("courseId"));
      $("#upload_tf_button").data("courseId", $(this).data("courseId"));
      $("html, body").animate({ scrollTop: 0}, 200);
      if ($(".course-view-div").data("courseId") != $(this).data("courseId")){
        $("#exams_container_loader").css({display: "flex"});
        $("#grades_container_loader").css({display: "flex"});
        $("#exams_container").find(".exam-cell").remove();
        $(".course-view-div").data("courseId", $(this).data("courseId")); 
        $(".course-view-div").data("courseName", $(this).data("courseName"));
        $('#create_new_exam_form').attr('action', `create_exam/${$(this).data("courseId")}/${$(this).data("courseName")}`);
        get_course_question_count($(this).data("courseId"));
        get_all_questions_grade($(this).data("courseId"));
      }
    })

    $("#upload_fill_button").click(function(){
      check_fill_question_fields();
    })

    $("#upload_tf_button").click(function(){
      check_tf_question_fields();
    })

    $("#upload_mcq_button").click(function(){
      check_mcq_question_fields();
    })

    $(".correct-answer-div").click(function(){
      clear_correct_answers(".correct-answer-div");
      $(this).css({backgroundColor: "#58A4B0"});
      $(this).find("i").text("done");
    })

    $(document).on("click", ".edit-correct-answer-div", function(){
      $("#save_edit_question_button").data("answerId", $(this).data("answerId"));
      clear_correct_answers(".edit-correct-answer-div");
      $(this).css({backgroundColor: "#58A4B0"});
      $(this).find("i").text("done");
    })


    $("#true_correct_answer_div").click(function(){
      $("#upload_tf_button").data("truth", 1);
    })

    $("#false_correct_answer_div").click(function(){
      $("#upload_tf_button").data("truth", false);
    })

    $("#mcq_correct_answer_div1").click(function(){
      $("#upload_mcq_button").data("correctAnswer1", 1);
      $("#upload_mcq_button").data("correctAnswer2", false);
      $("#upload_mcq_button").data("correctAnswer3", false);
      $("#upload_mcq_button").data("correctAnswer4", false);
    })

    $("#mcq_correct_answer_div2").click(function(){
      $("#upload_mcq_button").data("correctAnswer1", false);
      $("#upload_mcq_button").data("correctAnswer2", 1);
      $("#upload_mcq_button").data("correctAnswer3", false);
      $("#upload_mcq_button").data("correctAnswer4", false);
    })

    $("#mcq_correct_answer_div3").click(function(){
      $("#upload_mcq_button").data("correctAnswer1", false);
      $("#upload_mcq_button").data("correctAnswer2", false);
      $("#upload_mcq_button").data("correctAnswer3", 1);
      $("#upload_mcq_button").data("correctAnswer4", false);
    })

    $("#mcq_correct_answer_div4").click(function(){
      $("#upload_mcq_button").data("correctAnswer1", false);
      $("#upload_mcq_button").data("correctAnswer2", false);
      $("#upload_mcq_button").data("correctAnswer3", false);
      $("#upload_mcq_button").data("correctAnswer4", 1);
    })

    $("#save_edit_question_button").click(function(){
      edit_my_question();
    })

    $(document).on("click", "#edit_question_true_button", function() {
      $("#save_edit_question_button").data("truth", 1);
    })

    $(document).on("click", "#edit_question_false_button", function() {
      $("#save_edit_question_button").data("truth", false);
    })

    $("#confirm_delete_question_button").click(function(){
      delete_question($(this).data("questionId"));
    })

    $(document).on("click", ".download-exam-button", function(){
      get_exam_questions($(this).data("examId"));
    })

    $(document).on("click", ".download-all-questions-button", function(){
      get_all_questions($(this).data("courseId"));
    })

    $("#menu_icon").click(function(){
      $(".navbar-div").animate({left: "0px"}, 200);
      $(".mainview-modal-overlay").fadeIn(200);
      $("body").css({overflow: "hidden"});
    })

});

function get_account_type(){
  $.ajax({
    type: 'POST',
    url: '/main/get_account_details',
    datatype: 'json',
    contenttype: 'application/json; charset=utf-8'
  })
  .done(function(data){
    sessionStorage.setItem("accountType", data.description)
    get_courses();
    if(data.description == "Student"){
      get_other_courses();
    }
    else{
      show_create_course();
    }
    initialize_course_view();
    
  })
  .fail(function(jqXHR, textStatus, err){
    console.log(textStatus);
  })
}

function get_account_details(){
    $.ajax({
        type: 'POST',
        url: '/main/get_account_details',
        datatype: 'json',
        contenttype: 'application/json; charset=utf-8'
      })
      .done(function(data){
        $("#my_account_name").val(data.full_name);
        $("#my_account_email").val(data.email);
        $("#my_account_type").val(data.description);
      })
      .fail(function(jqXHR, textStatus, err){
        console.log(textStatus);
      })

}

function change_account_name(){
    $.ajax({
        type: 'POST',
        url: '/main/change_account_name',
        datatype: 'json',
        contenttype: 'application/json; charset=utf-8',
        data: {
            name: $("#my_account_name").val()
        }
      })
      .done(function(data){
        show_pop_up("#notification_pop_up", data);
        disable_my_account_edit();
      })
      .fail(function(jqXHR, textStatus, err){
        console.log(textStatus);
      })

}

function change_password(){

  if ($("#new_password").val().length < 6){
    show_pop_up("#notification_pop_up", "Your password must contain at least 6 characters.");
  }
  else{
    $.ajax({
      type: 'POST',
      url: '/main/change_password',
      datatype: 'json',
      contenttype: 'application/json; charset=utf-8',
      data: {
          old_pass: $("#old_password").val(),
          new_pass: $("#new_password").val()
      }
    })
    .done(function(data){
      show_pop_up("#notification_pop_up", data);
    })
    .fail(function(jqXHR, textStatus, err){
      console.log(textStatus);
    })
  }
  
}

function initialize_course_view(){
  $.ajax({
    type: 'POST',
    url: '/main/get_courses',
    datatype: 'json',
    contenttype: 'application/json; charset=utf-8'
  })
  .done(function(data){
    if(data.length != 0){
      $("#exams_container").find(".exam-cell").remove();
      if(sessionStorage.getItem("accountType") == "Instructor")
      {
        show_create_exam();
      }
      $("#course_view_course_name").text(data[0].course_name);
      $("#upload_mcq_button").data("courseId", data[0].id);
      $("#upload_tf_button").data("courseId", data[0].id);
      $("#upload_fill_button").data("courseId", data[0].id);
      $(".course-view-div").data("courseId", data[0].id);
      $(".course-view-div").data("courseName", data[0].course_name);
      $('#create_new_exam_form').attr('action', `create_exam/${data[0].id}/${data[0].course_name}`);
      get_course_question_count(data[0].id);
      get_all_questions_grade(data[0].id);
    }
    else{
     $(".course-view-div").css({overflowY: "hidden"});
      $(".course-view-div").append(`
        <div class = "no-course-view-container">
          <img src = "../public/assets/images/white_quiz_reviewer_logo.png" id = "course_view_logo">
          <h6>You have not joined any courses. Please join a course first.</h6>
        </div>
      `)
      $("#course_view_loader").fadeOut(200);
    }
  })
  .fail(function(jqXHR, textStatus, err){
    console.log(textStatus);
  })

}

function get_courses(){
    $.ajax({
      type: 'POST',
      url: '/main/get_courses',
      datatype: 'json',
      contenttype: 'application/json; charset=utf-8'
    })
    .done(function(data){
      populate_my_courses(data);
      if(sessionStorage.getItem("accountType") == "Instructor"){
        $("#courses_loader").fadeOut(200);
        $(".courses-container").css({overflowY: "scroll"});
      }
    })
    .fail(function(jqXHR, textStatus, err){
      console.log(textStatus);
    })
  
}

function get_other_courses(){
  $.ajax({
    type: 'POST',
    url: '/main/get_other_courses',
    datatype: 'json',
    contenttype: 'application/json; charset=utf-8'
  })
  .done(function(data){
    populate_other_courses(data);
    $("#courses_loader").fadeOut(200);
    $(".courses-container").css({overflowY: "scroll"});
  })
  .fail(function(jqXHR, textStatus, err){
    console.log(textStatus);
  })

}

function join_course(course_id){
  $.ajax({
    type: 'POST',
    url: '/main/join_course',
    datatype: 'json',
    contenttype: 'application/json; charset=utf-8',
    data: {
      course_id: course_id
    }
  })
  .done(function(data){
    refresh_courses();
  })
  .fail(function(jqXHR, textStatus, err){
    console.log(textStatus);
  })

}

function leave_course(account_course_id){
  $.ajax({
    type: 'DELETE',
    url: '/main/leave_course',
    datatype: 'json',
    contenttype: 'application/json; charset=utf-8',
    data: {
      account_course_id: account_course_id
    }
  })
  .done(function(data){
    refresh_courses();
  })
  .fail(function(jqXHR, textStatus, err){
    console.log(textStatus);
  })

}

function get_exams(course_id){
  $.ajax({
    type: 'POST',
    url: '/main/get_exams',
    datatype: 'json',
    contenttype: 'application/json; charset=utf-8',
    data: {
      course_id: course_id
    }
  })
  .done(function(data){
    populate_exams(data);
    $(".course-view-div").css({overflowY: "scroll"});
    $("#exams_container_loader").fadeOut(200);
    $("#course_view_loader").fadeOut(200);
  })
  .fail(function(jqXHR, textStatus, err){
    console.log(textStatus);
  })
}

function add_fill_question(){
  $.ajax({
      type: 'POST',
      url: '/main/add_fill_question',
      datatype: 'json',
      contenttype: 'application/json; charset=utf-8',
      data: {
          course_outcome: $("#selected_course_outcome_button").data("courseOutcome"),
          question: $("#question_textarea").val(),
          answer: $("#fill_answer").val(), 
          course_id: $("#upload_fill_button").data("courseId")
      }
    })
    .done(function(data){
      show_pop_up("#notification_pop_up", data);
      refresh_my_questions();
      $("#upload_loader").fadeOut(200);
    })
    .fail(function(jqXHR, textStatus, err){
      console.log(textStatus);
    })

}

function add_tf_question(){
  $.ajax({
      type: 'POST',
      url: '/main/add_tf_question',
      datatype: 'json',
      contenttype: 'application/json; charset=utf-8',
      data: {
          course_outcome: $("#selected_course_outcome_button").data("courseOutcome"),
          question: $("#question_textarea").val(),
          answer: $("#upload_tf_button").data("truth"), 
          course_id: $("#upload_tf_button").data("courseId")
      }
    })
    .done(function(data){
      show_pop_up("#notification_pop_up", data);
      refresh_my_questions();
      $("#upload_loader").fadeOut(200);
    })
    .fail(function(jqXHR, textStatus, err){
      console.log(textStatus);
    })

}

function add_mcq_question(){
  $.ajax({
      type: 'POST',
      url: '/main/add_mcq_question',
      datatype: 'json',
      contenttype: 'application/json; charset=utf-8',
      data: {
          course_outcome: $("#selected_course_outcome_button").data("courseOutcome"),
          question: $("#question_textarea").val(),
          course_id: $("#upload_mcq_button").data("courseId"),
          answer1: $("#mcq_answer1").val(),
          correct_answer1: $("#upload_mcq_button").data("correctAnswer1"),
          answer2: $("#mcq_answer2").val(),
          correct_answer2: $("#upload_mcq_button").data("correctAnswer2"),
          answer3: $("#mcq_answer3").val(),
          correct_answer3: $("#upload_mcq_button").data("correctAnswer3"),
          answer4: $("#mcq_answer4").val(),
          correct_answer4: $("#upload_mcq_button").data("correctAnswer4")
      }
    })
    .done(function(data){
      show_pop_up("#notification_pop_up", data);
      refresh_my_questions();
      $("#upload_loader").fadeOut(200);
    })
    .fail(function(jqXHR, textStatus, err){
      console.log(textStatus);
    })

}

function get_my_questions(){
  $.ajax({
    type: 'POST',
    url: '/main/get_my_questions',
    datatype: 'json',
    contenttype: 'application/json; charset=utf-8'
  })
  .done(function(data){
    populate_my_questions(data);
  })
  .fail(function(jqXHR, textStatus, err){
    console.log(textStatus);
  })
}

function get_question_details(question_id){
  $.ajax({
    type: 'POST',
    url: '/main/get_question_details',
    datatype: 'json',
    contenttype: 'application/json; charset=utf-8',
    data: {
      question_id: question_id
    }
  })
  .done(function(data){
    populate_question_details(data);
    $("#edit_question_pop_up_loader").fadeOut(200);
    setTimeout(function(){$("#edit_question_pop_up_loader").remove();}, 200);
  })
  .fail(function(jqXHR, textStatus, err){
    console.log(textStatus);
  })

}

function edit_my_question(){
  $.ajax({
    type: 'POST',
    url: '/main/edit_my_question',
    datatype: 'json',
    contenttype: 'application/json; charset=utf-8',
    data: {
      question_id: $("#save_edit_question_button").data("questionId"),
      question: $(".edit-question-textarea").text(),
      answer_id: $("#save_edit_question_button").data("answerId"),
      truth: $("#save_edit_question_button").data("truth"),
      answer: $("#edit_fill_answer").val()
    }
  })
  .done(function(data){
    hide_pop_up("#edit_question_pop_up");
    refresh_my_questions();
  })
  .fail(function(jqXHR, textStatus, err){
    console.log(textStatus);
  })

}

function delete_question(question_id){
  $.ajax({
    type: 'DELETE',
    url: '/main/delete_question',
    datatype: 'json',
    contenttype: 'application/json; charset=utf-8',
    data: {
      question_id: question_id
    }
  })
  .done(function(data){
    hide_pop_up("#delete_question_pop_up");
    refresh_courses();
    refresh_my_questions();
  })
  .fail(function(jqXHR, textStatus, err){
    console.log(textStatus);
  })

}

function get_course_question_count(course_id){
  $.ajax({
    type: 'POST',
    url: '/main/get_course_question_count',
    datatype: 'json',
    contenttype: 'application/json; charset=utf-8',
    data: {
      course_id: course_id
    }
  })
  .done(function(data){
    $("#no_grades_container").remove();
    $("#no_exams_container").remove();
    if(data[0].question_count == 0){
      if(sessionStorage.getItem("accountType") == "Student"){
        $("#exams_container").append(`
        <div id = "no_exams_container">
          <h6>This Course currently has no exams</h6>
        </div>
      `);
      }

      $("#exams_container_loader").fadeOut(200);
    }
    else{
      $("#exams_container").prepend(`
      <div class = "exam-cell" id = "all_question_exam_cell">
        <div class = "exam-details-container">
            <i class = "material-icons exam-icon">library_books</i>
            <div class = "exam-details-text-container">
              <h6 class = "exam-name-text">All Questions</h6>
              <h6 class = "exam-questions-text">${data[0].question_count} questions</h6>
            </div>
        </div>
        <form action = "/exam/${course_id}/0" method = "GET">
          <div class = "take-exam-container" id = "take_exam_container_all${course_id}">
              <button class = "take-exam-button" id = "take_all_questions_exam_button${course_id}">Take Exam</button>
          </div>
        </form>
      </div>
        `)

      if(sessionStorage.getItem("accountType") == "Instructor"){

        $(`#take_exam_container_all${course_id}`).append(`
            <button type = "button" class = "download-all-questions-button" id = "download_all_questions_button${course_id}">Download</button>
        `);
        $(`#download_all_questions_button${course_id}`).data("courseId", course_id);
      }
    }
    get_exams(course_id);
  })
  .fail(function(jqXHR, textStatus, err){
    console.log(textStatus);
  })

}

function get_all_questions_grade(course_id){
  $.ajax({
    type: 'POST',
    url: '/main/get_all_questions_grade',
    datatype: 'json',
    contenttype: 'application/json; charset=utf-8',
    data: {
      course_id: course_id
    }
  })
  .done(function(data){
    $("#grades_container").find(".grades-cell").remove();
    if(data.length != 0){
      $("#grades_container").append(`
      <div class = "grades-cell">
        <div class = "grade-details-container">
            <h6 class = "grade-exam-name-text">All Questions</h6>
        </div>
        <div class = "latest-grade-container">
            <h6>${data[0].grade}%</h6>
        </div>
      </div>`);
    }
    get_exam_grades(course_id);
    
  })
  .fail(function(jqXHR, textStatus, err){
    console.log(textStatus);
  })
}

function get_exam_grades(course_id){
  $.ajax({
    type: 'POST',
    url: '/main/get_exam_grades',
    datatype: 'json',
    contenttype: 'application/json; charset=utf-8',
    data: {
      course_id: course_id
    }
  })
  .done(function(data){
    data.forEach(function(item, i){
      $("#grades_container").append(`
      <div class = "grades-cell">
        <div class = "grade-details-container">
            <h6 class = "grade-exam-name-text">${item.exam_name}</h6>
        </div>
        <div class = "latest-grade-container">
            <h6>${item.grade}%</h6>
        </div>
      </div>`);
    })

    console.log($("#grades_container").find(".grades-cell").length)
    if($("#grades_container").find(".grades-cell").length == 0){
      $("#grades_container").append(`
        <div id = "no_grades_container">
          <h6>You currently have no grades.</h6>
        </div>
      `);
    }

    $("#grades_container_loader").fadeOut(200);
    
  })
  .fail(function(jqXHR, textStatus, err){
    console.log(textStatus);
  })
}

function get_all_questions(course_id){
  $.ajax({
    type: 'POST',
    url: '/exam/get_all_questions',
    datatype: 'json',
    contenttype: 'application/json; charset=utf-8',
    data: {
        course_id: course_id
    }
  })
  .done(function(data){
    sessionStorage.setItem("questionsTxt", "");
    var promises = [];
    data.forEach(function(item, i){
      var request = get_exam_question_details(item.id);
      promises.push(request);
    })

    $.when.apply(null, promises).done(function(){
      download(`${data[0].course_code} All Questions`, sessionStorage.getItem("questionsTxt"));
    })
  })
  .fail(function(jqXHR, textStatus, err){
    console.log(textStatus);
  })

}

function get_exam_questions(exam_id){
  $.ajax({
    type: 'POST',
    url: '/exam/get_exam_questions',
    datatype: 'json',
    contenttype: 'application/json; charset=utf-8',
    data: {
        exam_id: exam_id
    }
  })
  .done(function(data){
    sessionStorage.setItem("questionsTxt", "");
    var promises = [];
    data.forEach(function(item, i){
      var request = get_exam_question_details(item.id);
      promises.push(request);
    })

    $.when.apply(null, promises).done(function(){
      download(`${data[0].course_code} ${data[0].exam_name}`, sessionStorage.getItem("questionsTxt"));
    })

  })
  .fail(function(jqXHR, textStatus, err){
    console.log(textStatus);
  })

}

function get_exam_question_details(question_id){
  return $.ajax({
    type: 'POST',
    url: '/exam/get_exam_question_details',
    datatype: 'json',
    contenttype: 'application/json; charset=utf-8',
    data: {
      question_id: question_id
    }
  })
  .done(function(data){

    add_to_text_file(data);

  })
  .fail(function(jqXHR, textStatus, err){
    console.log(textStatus);
  })

}

function refresh_courses(){
  $("#courses_loader").css({display: "flex"});
  $(".courses-container").css({overflowY: "hidden"});
  $("#course_view_loader").css({display: "flex"});
  $(".my-courses-container").empty();
  $(".other-courses-container").empty();
  get_account_type();
}

function show_create_course(){
  $(".courses-container").append(`
    <div class = "course-cell-div" id = "create_course_cell">
      <button id = "create_new_course_button">Create New Course</button>
    </div>`)
}

function show_create_exam(){

  $("#exams_container").append(`
    <form id = "create_new_exam_form" method = "GET">
    <div class = "create-new-exam-container">
      <button id = "create_new_exam_button">Create New Exam</button>
    </div>
    </form>`)
}

function populate_exams(data){
  data.forEach( (item, i) => {
    $("#all_question_exam_cell").after(`
    <div class = "exam-cell">
      <div class = "exam-details-container">
          <i class = "material-icons exam-icon" id="exam_icon${item.id}">library_books</i>
          <div class = "exam-details-text-container">
            <h6 class = "exam-name-text">${item.exam_name}</h6>
            <h6 class = "exam-questions-text">${item.question_count} questions</h6>
          </div>
      </div>
      <form action = "/exam/${item.course_id}/${item.id}" method = "GET">
          <div class = "take-exam-container" id = "take_exam_container${item.id}">
              <button class = "take-exam-button">Take Exam</button>
          </div>
      </form>
    </div>
    `)

    if(sessionStorage.getItem("accountType") == "Instructor"){
      $(`#take_exam_container${item.id}`).append(`
        <button class = "download-exam-button" id = "download_exam_button${item.id}" type = "button">Download</button>
      `)
    }

    $(`#download_exam_button${item.id}`).data("examId", item.id)
    if(item.visibility_id == 1){
      $(`#exam_icon${item.id}`).text("visibility_off")
    }

  })

}

function populate_my_questions(data){
  data.forEach( (item, i) => {
    $(".my-questions-div").append(`
      <div class = "my-question-cell">
        <h6 class = "edit-my-question-text">${item.question_content}</h6>
        <div class = "my-question-options-container">
          <i class = "material-icons delete-question-button" id = "delete_question_button${i}">delete</i>
          <i class = "material-icons edit-question-button" id = "edit_question_button${i}">edit</i>
        </div>
      </div>
      `)

    $(`#delete_question_button${i}`).data("questionId",item.id);
    $(`#edit_question_button${i}`).data("questionId", item.id);
  })

}

function clear_correct_answers(correct_answers_div){
  $(correct_answers_div).css({backgroundColor: "#D8DBE2"});
  $(correct_answers_div).find("i").text("");
}


function check_tf_question_fields(){
  var co_num = parseInt($("#selected_course_outcome_button").data("courseOutcome"));
  if($("#question_textarea").val() == ""){

    show_pop_up("#notification_pop_up", "Please fill all empty fields.");

  }
  else if ($("#selected_course_outcome_button").data("courseOutcome") == null){

    show_pop_up("#notification_pop_up", "Please indicate the question's course outcome.");

  }
  else if(!(Number.isInteger(co_num)) || co_num > 6 || co_num < 1){
    show_pop_up("#notification_pop_up", "Please use a valid course outcome.");
  }
  else if($("#upload_tf_button").data("truth") == null){

    show_pop_up("#notification_pop_up", "Please indicate the correct answer.");

  }
  else{
    $("#upload_loader").fadeIn(100);
    add_tf_question();
  }
}

function check_fill_question_fields(){
  var co_num = parseInt($("#selected_course_outcome_button").data("courseOutcome"));
  if($("#question_textarea").val() == ""){

    show_pop_up("#notification_pop_up", "Please fill all empty fields.");

  }
  else if($("#fill_answer").val() == ""){

    show_pop_up("#notification_pop_up", "Please fill in the correct answer.");

  }
  else if ($("#selected_course_outcome_button").data("courseOutcome") == null){

    show_pop_up("#notification_pop_up", "Please indicate the question's course outcome.");

  }
  else if(!(Number.isInteger(co_num)) || co_num > 6 || co_num < 1){
    show_pop_up("#notification_pop_up", "Please use a valid course outcome.");
  }
  else{
    $("#upload_loader").fadeIn(100);
    add_fill_question();
  }
}

function check_mcq_question_fields(){
  var co_num = parseInt($("#selected_course_outcome_button").data("courseOutcome"));
  if( $("#question_textarea").val() == "" ||
      $("#mcq_answer1").val() == "" ||
      $("#mcq_answer2").val() == "" ||
      $("#mcq_answer3").val() == "" ||
      $("#mcq_answer4").val() == ""){

    show_pop_up("#notification_pop_up", "Please fill all empty fields.");

  }
  else if($("#upload_mcq_button").data("correctAnswer1") == null ||
          $("#upload_mcq_button").data("correctAnswer2") == null ||
          $("#upload_mcq_button").data("correctAnswer3") == null ||
          $("#upload_mcq_button").data("correctAnswer4") == null){
    show_pop_up("#notification_pop_up", "Please indicate the correct answer.");

  }
  else if ($("#selected_course_outcome_button").data("courseOutcome") == null){

    show_pop_up("#notification_pop_up", "Please indicate the question's course outcome.");

  }
  else if(!(Number.isInteger(co_num)) || co_num > 6 || co_num < 1){
    show_pop_up("#notification_pop_up", "Please use a valid course outcome.");
  }
  else{
    $("#upload_loader").fadeIn(100);
    add_mcq_question();
  }
}

function open_container(close_div1, close_div2, open_div){
  $(close_div1).css({display: "none"});
  $(close_div2).css({display: "none"});
  $(open_div).css({display: "inline-block"});
}

function show_main_containers(close_div1, close_div2, open_div1, open_div2){
  $(close_div1).css({display: "none"});
  $(close_div2).css({display: "none"});
  $(open_div1).css({display: "inline-block"});
  $(open_div2).css({display: "inline-block"});
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

function disable_my_account_edit(){
  $("#my_account_save_button").css({display: "none"});
  $("#my_account_cancel_button").css({display: "none"});
  $("#my_account_edit_button").css({display: "inline-block"});
  $("#my_account_name").prop("disabled", true);
  $("#my_account_email").css({border: "none"});
  $("#my_account_name").css({border: "none"});
}

function clear_mcq_upload_button_data(){
  $("#upload_mcq_button").data("correctAnswer1", null);
  $("#upload_mcq_button").data("correctAnswer2", null);
  $("#upload_mcq_button").data("correctAnswer3", null);
  $("#upload_mcq_button").data("correctAnswer4", null);
}

function populate_my_courses(data){

  if (sessionStorage.getItem("accountType") == "Student")
  {
    data.forEach( (item, i) => {
      $(".my-courses-container").append(`
        <div class = "course-cell-div">
        <div class = "course-details-container">
            <h6 class = "course-details-text">${item.course_code}</h6>
            <h6 class = "course-instructor-text">${item.instructor}</h6>
            <h6 id = "course_name_text">${item.course_name}</h6>
        </div>
        <div class = "view-course-container">
            <button class = "view-course-button" id="view_course_button${i}">View</button>
            <button class = "leave-course-button" id="leave_course_button${i}">Leave</button>
        </div>
        </div>`);
    
        $(`#view_course_button${i}`).data("courseId", item.id);
        $(`#view_course_button${i}`).data("courseName", item.course_name);
        $(`#leave_course_button${i}`).data("accountCourseId", item.account_course_id);
    })
  }
  else{

    data.forEach( (item, i) => {
        $(".my-courses-container").append(`
          <div class = "course-cell-div">
          <div class = "course-details-container">
              <h6 class = "course-details-text" >${item.course_code}</h6>
              <h6 class = "course-instructor-text">${item.instructor}</h6>
              <h6 id = "course_name_text">${item.course_name}</h6>
          </div>
          <div class = "view-course-container">
              <button class = "view-course-button" id="view_course_button${i}">View</button>
          </div>
          </div>`)

        $(`#view_course_button${i}`).data("courseId", item.id);
        $(`#view_course_button${i}`).data("courseName", item.course_name);
      })

  }
  
}

function populate_other_courses(data){

    data.forEach( (item, i) => {
      $(".other-courses-container").append(`
        <div class = "course-cell-div">
          <div class = "course-details-container">
            <h6 class = "course-details-text">${item.course_code}</h6>
            <h6 class = "course-instructor-text" >${item.instructor}</h6>
            <h6 id = "course_name_text">${item.course_name}</h6>
          </div>
          <div class = "join-button-container">
            <button class = "join-course-button" id = "join_course_button${i}">Join</button>
          </div>
        </div>`)

      $(`#join_course_button${i}`).data("courseId", item.id);
    })
  
}

function populate_question_details(data){
  $(".edit-question-container").empty();
  $("#edit_question_details_text").text(`${data[0].course_code} Course Outcome ${data[0].number}`);
  $(".edit-question-textarea").text(data[0].question_content);
  $("#save_edit_question_button").data("questionId", data[0].id);
  if(data[0].question_type_id == 1){
    data.forEach( (item, i) => {
      if(item.answer){

        $(".edit-question-container").append(`
          <div class = "edit-question-div">
            <div class = "edit-correct-answer-div" id = "edit_answer${i}" style = "background-color: #58A4B0">
              <i class = "material-icons correct-icon">check</i>
            </div>
            <input class = "edit-answer-input" value = "${item.answer_content}">
          </div>
        `);

        $("#save_edit_question_button").data("answerId", item.answer_id);

      }
      else{
        $(".edit-question-container").append(`
          <div class = "edit-question-div">
            <div class = "edit-correct-answer-div" id = "edit_answer${i}">
              <i class = "material-icons correct-icon"></i>
            </div>
            <input class = "edit-answer-input"  value = "${item.answer_content}">
          </div>
        `)
      }

      $(`#edit_answer${i}`).data("answerId", item.answer_id);
      
    })
  }
  else if(data[0].question_type_id == 11){
    if(data[0].truth){
      $(".edit-question-container").append(`
          <div class = "edit-question-div">
          <div class = "edit-correct-answer-div" id = "edit_question_true_button" style = "background-color: #58A4B0">
            <i class = "material-icons correct-icon">check</i>
          </div>
            <input class = "edit-answer-input" value = "True" disabled></input>
          </div>
        `)
      $(".edit-question-container").append(`
          <div class = "edit-question-div">
            <div class = "edit-correct-answer-div" id = "edit_question_false_button">
              <i class = "material-icons correct-icon"></i>
            </div>
            <input class = "edit-answer-input" value = "False" disabled></input>
          </div>
        `);
      $("#save_edit_question_button").data("truth", 1);
    }
    else{
      $(".edit-question-container").append(`
          <div class = "edit-question-div">
          <div class = "edit-correct-answer-div" id = "edit_question_true_button">
            <i class = "material-icons correct-icon"></i>
          </div>
            <input class = "edit-answer-input" value = "True" disabled></input>
          </div>
        `)
      $(".edit-question-container").append(`
          <div class = "edit-question-div">
          <div class = "edit-correct-answer-div" id = "edit_question_false_button" style = "background-color: #58A4B0">
            <i class = "material-icons correct-icon">check</i>
          </div>
            <input class = "edit-answer-input" value = "False" disabled></input>
          </div>
        `);
      
      $("#save_edit_question_button").data("truth", false);

    }
  }
  else{
    $(".edit-question-container").append(`
        <div class = "edit-question-div">
          <div id = "fill_correct_answer_div">
            <i class = "material-icons correct-icon">check</i>
          </div>
          <input class = "edit-answer-input" id = "edit_fill_answer" value = "${data[0].answer_content}">
        </div>
      `)
    
    $("#save_edit_question_button").data("answerId", data[0].answer_id);
  }
}

function refresh_my_questions(){
  $("html, body").animate({ scrollTop: 0}, 200);
  $(".my-questions-div").empty();
  get_my_questions();
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function add_to_text_file(data, last_item){
    let question_str = sessionStorage.getItem("questionsTxt");
    if(data[0].question_type_id == 1){
        question_str += data[0].question_type_code + "\t";
        question_str += data[0].question_content + "\t";
        data.forEach(function(item, i){
            question_str += item.answer_content + "\t";
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

    sessionStorage.setItem("questionsTxt", question_str);

}

function screenTest(e) {
  if (e.matches) {
    $(".navbar-div").css({left: 0});
    $("body").css({overflow: "hidden"});
  }
}
