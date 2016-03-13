/**
 * Created by Adib Abud Jaso on 03/03/16.
 * adibabud@gmail.com
 */
    //This object would be used when localStorage is not available, but only saves the preference temporarily.
    //Made public to be available in other scripts
var preferences = (function(){
    var notSaved = {};
    var getItem = function(name){
        if(window.localStorage !== undefined){
            return localStorage.getItem(name);
        } else {
            return notSaved[name];
        }
    };
    var setItem = function (name, value) {
        if(window.localStorage !== undefined){
            localStorage.setItem(name, value);
        } else {
            notSaved[name] = value;
        }
    };
    return {getItem:getItem, setItem:setItem}
})();


(function(){
    //Defaults to English for the first time or localstorage cleared
    if(preferences.getItem("preferedLanguage") == null){
        preferences.setItem("preferedLanguage", "english");
    }
    changeLanguage(preferences.getItem("preferedLanguage"));

    //Get the img (buttons) and give them the changing language action when clicked
    $("div.chooseLanguage > img[data-langButton]").click(function(event){
        var language = $(event.currentTarget).attr("data-langButton");
        preferences.setItem("preferedLanguage", language);
        changeLanguage(language);
    });

    function changeLanguage(name){
        var languageElements = $("[data-lang]");
        languageElements.each(function(index, element){
            var languageElement = LANGUAGE_SUPPORT[preferences.getItem("preferedLanguage")][$(element).attr("data-lang")];
            if(languageElement != undefined){
                $(element).text(languageElement);
            }
        });
        prepareLanguageFlags(name);
    }
    function prepareLanguageFlags(language){
        $("div.chooseLanguage > img[data-langButton]").each(function(index, flag){
            var img = $(flag);
            img.toggleClass("active", img.attr("data-langButton") === language);
        });
    }
})();

