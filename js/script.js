"use strict";
var DOMAIN = "huaban.com";
var global = "HUABAN_GLOBAL";
var old_global = "__huaban";
var global_settings = "HUABAN_PRESETTINGS";
var insertScript = function (c) {
    var a = document.getElementById("HUABAN_WIDGET_SCRIPT");
    if (a) {
        a.parentNode.removeChild(a)
    }
    a = document.createElement("script");
    a.setAttribute("charset", "utf-8");
    a.setAttribute("id", "HUABAN_WIDGET_SCRIPT");
    a.innerText = c.replace(/\s{2,}/g, " ");
    document.body.appendChild(a);
    var b = document.getElementById("HUABAN_WIDGET_SCRIPT");
    if (b) {
        b.parentNode.removeChild(b)
    }
};
//var insertBookmarklet = function (c, b) {
//    var a = "    (function(w,g,m,i,d){      w[g]=w[g]||{};      w[g].via=7;      w[g].autoInitialize=false;      w[g].autoAttachFloatingButton=i;      w[g].imageMinWidth=m;      w['__huaban_dev']=d;    }(window,'" + global_settings + "'," + c.minWidth + "," + c.isToggleOn + ",'" + DOMAIN + "'));";
//    var b = a + b;
//    console.log(b);
//    insertScript(b)
//};
var sendMsgToPopup = function () {
    setTimeout(function () {
        chrome.runtime.sendMessage({
            msg: "pinable"
        })
    },
    300)
};
sendMsgToPopup();
//chrome.runtime.sendMessage({
//    msg: "settings"
//}, function (a) {
//    var b = a;
    
//    //不需要请求icon了
//    chrome.runtime.sendMessage({
//        msg: "bookmarklet"
//    },
//    function (c) {
//        console.dir(c);
//        insertBookmarklet(b, c && c.code);
//        sendMsgToPopup()
//    })
//});
var takeAction = function (b) {
    var a = "    (function(w,d,g,a) {      w[g] && w[g]['interface'] && w[g]['interface'][a]();      var el = d.getElementById('HUABAN_WIDGET_SCRIPT');      el.parentNode.removeChild(el);    })(window,document,'" + global + "','" + b + "');";
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
    var a = "    (function(w,d,g,a,t) {      w[g] && w[g]['interface'] && w[g]['interface'][a](t);      var el = d.getElementById('HUABAN_WIDGET_SCRIPT');      el.parentNode.removeChild(el);    })(window,document,'" + global + "','pinImageUrl','" + b + "');";
    insertScript(a); (function () {
        var f = document.getElementById("HUABAN_MESSAGE");
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