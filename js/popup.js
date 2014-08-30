(function () {
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
                            msg: "shareDocumentUrl"
                        },
                        function (response) { });
                });
            setTimeout(function () {
                window.close()
            },
            100)
        });
        var pinAllBtn = $("pin-all-btn");
        pinAllBtn.addEventListener("click",function () {
            if (this.classList.contains("disabled")) {
                return false
            }
            chrome.tabs.query({
                active: true,
                currentWindow: true
            },
            function (tabs) {
                var tab = tabs[0];
                var url = tab.url.replace(/^https?:\/\/(www)?/, "");
                if (url.indexOf(DOMAIN) == 0) {
                    return
                }
                chrome.tabs.sendMessage(i.id, {
                    msg: "showValidImages"
                },
                function (response) { })
            });
            setTimeout(function () {
                window.close()
            },
            100)
        });
        var captureAreaItem = $("capture-area-item");
        var captureViewportItem = $("capture-viewport-item");
        var captureFullpageItem = $("capture-fullpage-item");
        captureAreaItem.classList.add("disabled");
        captureViewportItem.classList.add("disabled");
        captureFullpageItem.classList.add("disabled");

        chrome.runtime.sendMessage({msg: "isShortCutEnabled" },function (response) {
            var elabled = response.isShortCutEnabled;
            captureAreaItem.getElementsByClassName("prompt")[0].style.display = elabled ? "inline" : "none";
            captureViewportItem.getElementsByClassName("prompt")[0].style.display = elabled ? "inline" : "none";
            captureFullpageItem.getElementsByClassName("prompt")[0].style.display = elabled ? "inline" : "none"
        });
        captureAreaItem.addEventListener("click",function () {
            if (this.classList.contains("disabled")) {
                return false
            }
            var background = chrome.extension.getBackgroundPage();
            background.screenshot.showSelectionArea();
            window.close()
        });
        captureViewportItem.addEventListener("click",function () {
               if (this.classList.contains("disabled")) {
                   return false
               }
               var background = chrome.extension.getBackgroundPage();
               background.screenshot.captureViewport();
               window.close()
           });
        captureFullpageItem.addEventListener("click",function () {
             if (this.classList.contains("disabled")) {
                 return false
             }
             var h = chrome.extension.getBackgroundPage();
             h.screenshot.captureFullpage();
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
    document.addEventListener("DOMContentLoaded", Menu.init);
    chrome.runtime.onMessage.addListener(function (b, a) {
        console.log(b.msg);
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
}());
