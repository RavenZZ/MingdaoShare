"use strict";
var Page = {
    showDialog: function () {
        //var a = $("overlay");
        //a.style.width = document.body.scrollWidth + "px";
        //a.style.height = document.body.scrollHeight + "px";
        //a.style.display = "block";
        //$("share-to-mingdao").src = chrome.extension.getURL("share.html");
        //$("pin_wrapper").style.display = "block"
       window.open(chrome.extension.getURL("share.html"));
    },
    closeDialog: function () {
        var a = $("overlay");
        a.style.width = document.body.scrollWidth + "px";
        a.style.height = document.body.scrollHeight + "px";
        a.style.display = "none";
        $("pin_wrapper").style.display = "none"
    }
}

