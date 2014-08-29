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
            chrome.tabs.query({
                active: true,
                currentWindow: true
            },
            function (h) {
                var i = h[0];
                var j = i.url.replace(/^https?:\/\/(www)?/, "");
                if (j.indexOf(DOMAIN) == 0) {
                    return
                }
                chrome.tabs.sendMessage(i.id, {
                    msg: "showValidImages"
                },
                function (k) { })
            });
            chrome.runtime.sendMessage({
                msg: "ga",
                type: "popup item",
                value: "pinAll"
            },
            function () { });
            //setTimeout(function () {
            //    window.close()
            //},
            //100)
        });
    }
    document.addEventListener("DOMContentLoaded", Menu.init);
}());
