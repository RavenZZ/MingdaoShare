"use strict";
var enableCapture = function () {
    $("capture-area-item").classList.remove("disabled");
    $("capture-viewport-item").classList.remove("disabled");
    $("capture-fullpage-item").classList.remove("disabled")
};
var disableCapture = function () {
    $("capture-area-item").classList.add("disabled");
    $("capture-viewport-item").classList.add("disabled");
    $("capture-fullpage-item").classList.add("disabled")
};
function init() {
    var a = document.getElementsByTagName("a");
    for (var d = 0; a[d]; d++) {
        a[d].addEventListener("click",
        function () {
            if (this.href && !~this.href.indexOf("chrome-extension")) {
                window.open(this.href)
            }
            return false
        })
    }
    var e = $("toggle-btn");
    e.addEventListener("click",
    function () {
        chrome.runtime.sendMessage({
            msg: "toggle"
        },
        function (h) {
            var i = e.getElementsByClassName("title")[0];
            if (h.isToggleOn) {
                i.classList.add("checked")
            } else {
                i.classList.remove("checked")
            }
        });
        chrome.runtime.sendMessage({
            msg: "ga",
            type: "popup item",
            value: "toggleBtn"
        },
        function () { })
    });
    chrome.runtime.sendMessage({
        msg: "isToggleOn"
    },
    function (h) {
        var i = e.getElementsByClassName("title")[0];
        if (h.isToggleOn) {
            i.classList.add("checked")
        } else {
            i.classList.remove("checked")
        }
    });
    var c = $("pin-all-btn");
    c.addEventListener("click",
    function () {
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
        setTimeout(function () {
            window.close()
        },
        100)
    });
    var b = $("capture-area-item");
    var f = $("capture-viewport-item");
    var g = $("capture-fullpage-item");
    b.classList.add("disabled");
    f.classList.add("disabled");
    g.classList.add("disabled");
    chrome.runtime.sendMessage({
        msg: "isShortCutEnabled"
    },
    function (h) {
        var i = h.isShortCutEnabled;
        b.getElementsByClassName("prompt")[0].style.display = i ? "inline" : "none";
        f.getElementsByClassName("prompt")[0].style.display = i ? "inline" : "none";
        g.getElementsByClassName("prompt")[0].style.display = i ? "inline" : "none"
    });
    g.addEventListener("click",
    function () {
        if (this.classList.contains("disabled")) {
            return false
        }
        chrome.runtime.sendMessage({
            msg: "ga",
            type: "popup item",
            value: "captureWebpage"
        },
        function () { });
        var h = chrome.extension.getBackgroundPage();
        h.screenshot.captureFullpage();
        window.close()
    });
    f.addEventListener("click",
    function () {
        if (this.classList.contains("disabled")) {
            return false
        }
        chrome.runtime.sendMessage({
            msg: "ga",
            type: "popup item",
            value: "captureWindow"
        },
        function () { });
        var h = chrome.extension.getBackgroundPage();
        h.screenshot.captureViewport();
        window.close()
    });
    b.addEventListener("click",
    function () {
        if (this.classList.contains("disabled")) {
            return false
        }
        chrome.runtime.sendMessage({
            msg: "ga",
            type: "popup item",
            value: "captureArea"
        },
        function () { });
        var h = chrome.extension.getBackgroundPage();
        h.screenshot.showSelectionArea();
        window.close()
    });
    chrome.tabs.query({
        active: true,
        currentWindow: true
    },
    function (i) {
        var h = chrome.tabs.connect(i[0].id);
        h.onMessage.addListener(function (j) {
            if (j.msg == "capturable") {
                enableCapture()
            } else {
                if (j.msg == "uncapturable") {
                    disableCapture()
                } else {
                    if (j.msg == "loading") { }
                }
            }
            if (j.msg == "pinable") {
                $("pin-all-btn").classList.remove("disabled")
            } else {
                if (j.msg == "unpinable") {
                    $("pin-all-btn").classList.add("disabled")
                }
            }
        });
        h.postMessage({
            msg: "is_page_capturable"
        });
        h.postMessage({
            msg: "is_page_pinable"
        })
    })
}
document.addEventListener("DOMContentLoaded", init);
chrome.runtime.onMessage.addListener(function (b, a) {
    if (b.msg == "page_capturable") {
        enableCapture()
    } else {
        if (b.msg == "page_uncapturable") {
            disableCapture()
        }
    }
    if (b.msg == "pinable") {
        $("pin-all-btn").classList.remove("disabled")
    } else {
        if (b.msg == "unpinable") {
            $("pin-all-btn").classList.add("disabled")
        }
    }
});