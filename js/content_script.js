 (function () {
    "use strict";
    var $ = function (id) {
        return document.getElementById(id);
    }
    chrome.runtime.onMessage.addListener(function (b) {
        Content[b.fun]();
    });
    var Content = {
        createFrame: function () { }
    }
    Content.createFrame = function () {
        var iframe = document.createElement("iframe");
        iframe.id = "login";
        iframe.src = chrome.extension.getURL('login.html');
        iframe.width = 500;
        iframe.height = 200;
        iframe.frameBorder = 1;
        document.body.appendChild(iframe);
    }
}());

