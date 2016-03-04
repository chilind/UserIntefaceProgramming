/**
 * Created by Adib Abud Jaso on 03/03/16.
 * adibabud@gmail.com
 */
(function(){
    //Defaults to English for the first time or localstorage cleared
    if(localStorage.getItem("preferedLanguage") === null){
        localStorage.setItem("preferedLanguage", "english");
    }
    changeLanguage(localStorage.getItem("preferedLanguage"));

    //Get the img (buttons) and give them the changing language action when clicked
    $("div.chooseLanguage > img[data-langButton]").click(function(event){
        var language = $(event.currentTarget).attr("data-langButton");
        localStorage.setItem("preferedLanguage", language);
        changeLanguage(language);
    });

    function changeLanguage(name){
        prepareLanguageFlags(name);
        //This has problems when running locally on Chrome and Edge, but on a local server works fine on all browsers (Tested on Chrome, Safari, Edge and Firefox).
        $.getJSON("./languages/" + localStorage.getItem("preferedLanguage") + "_strings.json", function(data){
            var languageElements = $("[data-lang]");
            languageElements.each(function(index, element){
                var languageElement = data[$(element).attr("data-lang")];
                if(languageElement != undefined){
                    $(element).text(languageElement);
                }
            });
        });
    }
    function prepareLanguageFlags(language){
        $("div.chooseLanguage > img[data-langButton]").each(function(index, flag){
            var img = $(flag);
            img.toggleClass("active", img.attr("data-langButton") === language);
        });
    }
})();

