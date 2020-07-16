
$(document).ready(function(){
  $("#show_signup_button").click(function(){
    $("#login_form").animate({left: "-100%"}, 400);
    $("#signup_form").animate({right: "0px"}, 400);
    $("#lower_border").animate({marginRight: "10%",marginLeft: "56%", width: "34%"}, 400);
  });

  $("#show_login_button").click(function(){
    $("#login_form").animate({left: "0px"}, 400);
    $("#signup_form").animate({right: "-100%"}, 400);
    $("#lower_border").animate({marginRight: "66%",marginLeft: "10%", width: "24%"}, 400);
  });


  $('#signup_button').click(function(){
    if($("#email_signup").val().length === 0 || $("#name_signup").val().length === 0){
      if($("#email_signup").val().length === 0){
        $("#email_signup_container").css({border: '1px solid #58A4B0'});
        $("#email_signup_container").effect("shake");
      }
      if($("#name_signup").val().length === 0){
        $("#name_signup_container").css({border: '1px solid #58A4B0'});
        $("#name_signup_container").effect("shake");
      }

    }
    else{
      $("#signup_loader").css({display: "flex"});
      if(validateEmail($('#email_signup').val())){
        $.ajax({
          type: 'POST',
          url: '/sign_up',
          datatype: 'json',
          contenttype: 'application/json; charset=utf-8',
          data: {
            email: $("#email_signup").val(),
            name: $("#name_signup").val(),
            account_type: $('input[name="signup_account_radio"]:checked').val()
          }
        })
        .done(function(data){
          $("#signup_message").text(data);
          $("#signup_loader").fadeOut(200);
        })
        .fail(function(jqXHR, textStatus, err){
          console.log(textStatus);
        })
      }
      else{
        $("#email_signup_container").css({border: '1px solid #58A4B0'})
        $('#signup_message').text('Please enter a valid email address');
      }
      
    }
  })

  $("#forgot_password_button").click(function(){
    if($("#email_login").val() == ""){
      $("#login_message").text("Please enter your email address.");
    }
    else{
      $("#login_loader").css({display: "flex"});
      reset_password();
    }
  })

});

function reset_password(){
  $.ajax({
    type: 'POST',
    url: '/login/reset_password',
    datatype: 'json',
    contenttype: 'application/json; charset=utf-8',
    data: {
      email: $("#email_login").val()
    }
  })
  .done(function(data){
    $("#login_loader").fadeOut(200);
    $("#login_message").text(data);
  })
  .fail(function(jqXHR, textStatus, err){
    console.log(textStatus);
  })
}

function validateEmail(mail) 
{
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
    {
      return (true)
    }
      return (false)
}