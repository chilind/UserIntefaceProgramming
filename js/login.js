  /*
  Fix for chrome browser.
  */
  $(".form-signin").on("submit", function(e) {
    e.preventDefault();
  });

  $("#submit").on("click", function() {
    // Get login credentials from form
    var login = document.forms["form-signin"]["username"].value;
    var pwd = document.forms["form-signin"]["password"].value;

    // Saved login credentials
    var admins = ["ervtod","hirchr","jorass","saskru","svetor"];
    var users = ["aamsta","anddar","ankov","aqulyn","aubbla","benfau","bratam","ceznew","dansch","didwat","domolh","edraug","einyam","elepic","eulcou","eusgor","felbar","felfra","fercrn","giamik","gollan","hyrlap","jacabb","janhei","jeaats","jershi","jovsit","karbly","katfab","kaywan","kenolg","krysan","larsch","lasnic","liatra","livzha","maihon","marpug","marsti","molbab","muhtof","nikpro","olislu","olubra","oludra","orapan","pauaaf","pomgra","prabar","rewes","schjou","shapet","sivan","steber","sulpen","sulstr","symzim","teojen","tohei","valpag","yevowe","zulgor"];

    var isUser = $.inArray(login,users);
    var isUserPwd = $.inArray(pwd,users);
    var isAdmin = $.inArray(login,admins);
    var isAdminPwd = $.inArray(pwd,admins);

    // Check if given credentials match a user.
    if (isUser !== -1) {
      // If user credentials match, update sessionStorage and send user to drinks page.
      if (isUser === isUserPwd) {
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
    // Check if given credentials match an admin.
    else if (isAdmin !== -1) {
      // If admin credentials match, update sessionStorage and send admin to drinks page.
      if (isAdmin === isAdminPwd) {
        sessionStorage.setItem('adminOrUser','admin');
        window.location = "index.html";
      }
      else {
        console.log("Wrong password!");
        return false;
      }
    }
    // Wrong username.
    else {
      console.log("Wrong username!");
      return false;
    }
    window.location = "index.html";
  });
