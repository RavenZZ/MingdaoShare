(function () {
    chrome.runtime.onConnect.addListener(function (a) {
        a.onMessage.addListener(function (b) {
            if (b.msg == "is_page_capturable") {
                try {
                    if (isPageCapturable()) {
                        a.postMessage({
                            msg: "capturable"
                        })
                    } else {
                        a.postMessage({
                            msg: "uncapturable"
                        })
                    }
                } catch (c) {
                    a.postMessage({
                        msg: "loading"
                    })
                }
            } else {
                if (b.msg == "is_page_pinable") {
                    if (~document.documentElement.className.indexOf("hb-loaded")) {
                        a.postMessage({
                            msg: "pinable"
                        })
                    } else {
                        a.postMessage({
                            msg: "unpinable"
                        })
                    }
                }
            }
        })
    })
})();