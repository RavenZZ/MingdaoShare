(function () {
    "use strict";
    var $ = function (id) {
        return document.getElementById(id);
    }
    var Menu = {
        init: function () { },
        shareLink: function () { },
        shareImage: function () { }
    };

    Menu.shareLink = function () {
        
    }
    Menu.init = function () {
        var btnShareLink = $("btn-share-link");
        btnShareLink.addEventListener("click", function (e) {
            if (this.classList.contains("disabled")) {
                return false
            }
            chrome.tabs.query(
                {
                    active: true,
                    currentWindow: true
                },
                function (tabs) {
                    chrome.tabs.sendMessage(
                        tabs[0].id,
                        {
                            msg: "showValidImages",
                            fun: "createFrame"
                        },
                        function (response) {});
                });
            //chrome.runtime.sendMessage({
            //    msg: "ga",
            //    type: "popup item",
            //    value: "pinAll"
            //},
            //function () { });
            setTimeout(function () {
                window.close()
            },
            100)
        });
    }
    document.addEventListener("DOMContentLoaded", Menu.init);
}());
