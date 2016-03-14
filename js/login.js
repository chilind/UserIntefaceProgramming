
  $(".form-signin").on("submit", function(e) {
    e.preventDefault();
  });

  $("#submit").on("click", function() {
    var login = document.forms["form-signin"]["username"].value;
    var pwd = document.forms["form-signin"]["password"].value;

    var admins = ["ervtod","hirchr","jorass","saskru","svetor"];
    /*TODO: There are more users...*/
    var users = ["aamsta","anddar","ankov","aqulyn","aubbla","benfau","bratam","ceznew","dansch","didwat","domolh","edraug","einyam","elepic","eulcou","eusgor","felbar","felfra","fercrn","giamik","gollan","hyrlap","jacabb","janhei","jeaats","jershi","jovsit","karbly","katfab","kaywan","kenolg","krysan","larsch","lasnic","liatra","livzha","maihon","marpug","marsti","molbab","muhtof","nikpro","olislu","olubra","oludra","orapan","pauaaf","pomgra","prabar","rewes","schjou","shapet","sivan","steber","sulpen","sulstr","symzim","teojen","tohei","valpag","yevowe","zulgor"];
    var isUser = $.inArray(login,users);
    var isUserPwd = $.inArray(pwd,users);
    var isAdmin = $.inArray(login,admins);
    var isAdminPwd = $.inArray(pwd,admins);

    if (isUser !== -1) {
      if (isUser === isUserPwd) {
        //alert("user");
        sessionStorage.setItem('adminOrUser','user');
        window.location = "index.html";
        window.location.href = "index.html";
        location.href = 'index.html';
        console.log("1");
      }
      else {
        alert("Wrong password!");
        return false;
      }
    }
    else if (isAdmin !== -1) {
      if (isAdmin === isAdminPwd) {
        //alert("admin");
        sessionStorage.setItem('adminOrUser','admin');
        window.location = "index.html";
      }
      else {
        console.log("Wrong password!");
        return false;
      }
    }
    else {
      console.log("Wrong username!");
      return false;
    }
    /*TODO: Remove tests*/
    //console.log("Got here too!");
    console.log("admin");
    window.location = "index.html";
  });


function isInArray(value, array) {
  return (array.indexOf(value));
}

function loginRemember() {
  //TODO
  // var rm = document.forms["form-signin"]["rememberMe"].checked;
}
