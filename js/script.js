"use strict";
var DOMAIN = "mingdao.com";
var global = "MINGDAO_GLOBAL";
var old_global = "__mingdao";
var global_settings = "MINGDAO_PRESETTINGS";
var insertScript = function (c) {
    var a = document.getElementById("MINGDAO_WIDGET_SCRIPT");
    if (a) {
        a.parentNode.removeChild(a)
    }
    a = document.createElement("script");
    a.setAttribute("charset", "utf-8");
    a.setAttribute("id", "MINGDAO_WIDGET_SCRIPT");
    a.innerText = c.replace(/\s{2,}/g, " ");
    document.body.appendChild(a);
    var b = document.getElementById("MINGDAO_WIDGET_SCRIPT");
    if (b) {
        b.parentNode.removeChild(b)
    }
};
var insertBookmarklet = function (c, b) {
    var imgBase = chrome.extension.getURL('images');
    var a = "    (function(window,global_settings,width,toggle,domain){      window[global_settings]=window[global_settings]||{};   window[global_settings].imgBase='" + imgBase + "';   window[global_settings].via=7;      window[global_settings].autoInitialize=false;      window[global_settings].autoAttachFloatingButton=toggle;     window[global_settings].imageMinWidth=width;      window['__mingdao_dev']=domain;    }(window,'" + global_settings + "'," + c.minWidth + "," + c.isToggleOn + ",'" + DOMAIN + "'));";
    var b = a + b;
    insertScript(b)
};
var sendMsgToPopup = function () {
    setTimeout(function () {
        chrome.runtime.sendMessage({
            msg: "pinable"
        })
    },
    300)
};
//chrome.runtime.sendMessage({ msg: "bookmarklet" }, function (c) {
//    insertBookmarklet(b, c && c.code);
//    sendMsgToPopup()
//})
chrome.runtime.sendMessage({
    msg: "settings"
}, function (a) {
    var b = a;
   
    chrome.runtime.sendMessage({msg: "bookmarklet"},function (c) {
        insertBookmarklet(b, c && c.code);
        sendMsgToPopup()
    })
});
var takeAction = function (b) {
    var a = "    (function(window,document,global,method) {      window[global] && window[global]['interface'] && window[global]['interface'][method]();      var el = document.getElementById('MINGDAO_WIDGET_SCRIPT');      el.parentNode.removeChild(el);    })(window,document,'" + global + "','" + b + "');";
    insertScript(a)
};
var attachFloatingButton = function () {
    takeAction("attachFloatingButton")
};
var detachFloatingButton = function () {
    takeAction("detachFloatingButton")
};
var showValidImages = function () {
    takeAction("show")
};
var pinImage = function (b) {
    var a = "    (function(winwow,document,global,method,param) {      window[global] && window[global]['interface'] && window[global]['interface'][method](param);      var el = document.getElementById('MINGDAO_WIDGET_SCRIPT');      el.parentNode.removeChild(el);    })(window,document,'" + global + "','pinImageUrl','" + b + "');";
    insertScript(a); (function () {
        var f = document.getElementById("MINGDAO_MESSAGE");
        try {
            var d = f.innerText;
            d = JSON.parse(d);
            window.open(d.url, "", d.features)
        } catch (c) {
            console.error(c)
        }
    })()
};
var target = null;
document.body.addEventListener("contextmenu",
function (a) {
    target = a.target
});
chrome.runtime.onMessage.addListener(function (c, b, a) {
    if (c.msg) {
        switch (c.msg) {
            case "showValidImages":
                showValidImages();
                break;
            case "pinImage":
                if (target.width >= 16 && target.height >= 16) {
                    pinImage(target.src)
                } else {
                    showValidImages()
                }
                break;
            case "toggle":
                if (c.isToggleOn) {
                    attachFloatingButton()
                } else {
                    detachFloatingButton()
                }
                break;
            default:
                break
        }
    }
});