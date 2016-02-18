function onSubmitForm() {
  var login = document.forms["form-signin"]["username"].value;
  var pwd = document.forms["form-signin"]["password"].value;

  var admins = ["ervtod","hirchr","jorass","saskru","svetor"];
  /*TODO: There are more users...*/
  var users = ["aamsta","anddar","ankov","aqulyn","aubbla","benfau","bratam","ceznew","dansch","didwat","domolh","edraug"];

  var isUser = isInArray(login,users);
  var isUserPwd = isInArray(pwd,users);
  var isAdmin = isInArray(login,admins);
  var isAdminPwd = isInArray(pwd,admins);

  if (isUser > -1) {
    if (isUser == isUserPwd) {
      //alert("user");
      sessionStorage.setItem('adminOrUser','user');
      return true;
    }
    else {
      alert("Wrong password!");
      return false;
    }
  }
  else if (isAdmin > -1) {
    if (isAdmin == isAdminPwd) {
      console.log("Got here!");
      //alert("admin");
      //sessionStorage.setItem('adminOrUser','admin');
      //window.location.replace("index.html");
      //return true;
    }
    else {
      alert("Wrong password!");
      return false;
    }
  }
  else {
    alert("Wrong username!");
    return false;
  }
  /*TODO: Remove tests*/
  console.log("Got here too!");
  alert("admin");
  return true;
}
function isInArray(value, array) {
  return (array.indexOf(value));
}

/*
$("#form-signin").submit(console.log("Got here!"));
//  window.location.replace("index.html");
*/
function submitform()
{
  document.form-signin.submit();
  submit(console.log("Got here!"));
}


function loginRemember() {
  //TODO
  var rm = document.forms["form-signin"]["rememberMe"].checked;
  //console.log("Remember me: ",rm);
}
