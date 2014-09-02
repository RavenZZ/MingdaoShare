"use strict";
var bookmarkletUrl = chrome.extension.getURL('js/weight.js?') + Math.floor(new Date() / 10000000);
//(function () {
//    var a = localStorage.toggle == "off" ? "/images/logo_48_gray.png" : "/images/logo_48.png";
//    chrome.browserAction.setIcon({
//        path: a
//    })
//})();

(function () {
    var a = function (b) {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        },
        function (d) {
            var e = d[0];
            var f = e.url;
            f = f.replace(/^https?:\/\/(www)?/, "");
            if (f.indexOf(DOMAIN) == 0) {
                return
            }
            if (b.mediaType == "image" && b.srcUrl && b.srcUrl.indexOf("data:") != 0) {
                var c = {
                    src: b.srcUrl || "",
                    url: b.pageUrl || "",
                    img: {
                        alt: "",
                        src: b.srcUrl,
                        width: 0,
                        height: 0
                    }
                };
                chrome.tabs.sendMessage(e.id, {
                    msg: "pinImage",
                    data: c
                },
                function (g) { });
            } else {
                chrome.tabs.sendMessage(e.id, {
                    msg: "showValidImages"
                },
                function (g) { });
            }
        })
    };
    createMenu();
}());
chrome.runtime.onMessage.addListener(function (f, g, c) {
    switch (f.msg) {
        case "show_modal_dialog":
            //window.open("login.html?authorize="+escape(f.url)+"", "明道授权", "width=650,height=500,toolbar=no,menubar=no,scrollbars=0,resizeble=no,location=no,status=no");
            var obj = new Object();
            obj.authorize = f.url;
            var token = window.showModalDialog("login.html", obj, "dialogWidth=600px;dialogHeight=500px");
            c(token);
            break;
        //case "auth_success":
        //    chrome.tabs.query({
        //        active: true,
        //        currentWindow: true
        //    },
        //    function (tabs) {
        //        console.dir(tabs);
        //        chrome.tabs.sendMessage(tabs[0].id, {
        //            msg: "auth_success"
        //        },
        //        function (k) { })
        //    });
        //    c();
        //    break;
        case "open_new_url":
            chrome.tabs.create({
                url: f.url,
                active: true
            });
            break;
        case "settings":
            var b = localStorage.minWidth || 200;
            b = parseInt(b);
            b = b < 100 ? 100 : b;
            c({
                isToggleOn: !(localStorage.toggle == "off"),
                minWidth: b
            });
            break;
        case "bookmarklet":
            ajax({
                url:
                bookmarkletUrl,
                parameters: {},
                success: function (e) {
                    c({
                        code: e
                    })
                }
            });
            return true;
        case "isShortCutEnabled":
            c({
                isShortCutEnabled:
                HotKey.isEnabled()
            });
            break;
        case "isToggleOn":
            c({
                isToggleOn:
                !(localStorage.toggle == "off")
            });
            break;
        case "toggle":
            var a = !!f.msg.toggle || !(localStorage.toggle == "on");
            localStorage.toggle = a ? "on" : "off";
            var j = a ? "/images/logo_48.png" : "/images/logo_48_gray.png";
            chrome.browserAction.setIcon({
                path: j
            });
            chrome.tabs.query({
                active: true,
                currentWindow: true
            },
            function (e) {
                chrome.tabs.sendMessage(e[0].id, {
                    msg: "toggle",
                    isToggleOn: a
                },
                function (k) { })
            });
            c({
                isToggleOn: a
            });
            break;
        case "minWidth":
            var b = localStorage.minWidth || 100;
            b = parseInt(b);
            b = b < 100 ? 100 : b;
            c({
                minWidth: b
            });
            break;
        case "getImageData":
            var d = document.createElement("canvas");
            var i = null;
            try {
                i = JSON.parse(f.imgSrcs)
            } catch (h) {
                i = null
            }
            if (!i) {
                return c({
                    error: "data parse error"
                })
            }
            Utils.asyncMap(i,
            function (l, e) {
                var k = new XMLHttpRequest();
                k.open("GET", l, true);
                k.responseType = "blob";
                k.onload = function (o) {
                    if (this.status == 200) {
                        var n = this.response;
                        var m = new window.FileReader();
                        m.readAsDataURL(n);
                        m.onloadend = function () {
                            var p = m.result;
                            e(null, p)
                        }
                    }
                };
                k.send()
            },
            function (l, k) {
                if (l) {
                    return c({
                        error: l
                    })
                }
                var e = JSON.stringify(k);
                c({
                    images: e
                })
            });
            return true;
        default:
            break
    }
});
var screenshot = {
    tab: 0,
    canvas: document.createElement("canvas"),
    startX: 0,
    startY: 0,
    scrollX: 0,
    scrollY: 0,
    docHeight: 0,
    docWidth: 0,
    visibleWidth: 0,
    visibleHeight: 0,
    scrollXCount: 0,
    scrollYCount: 0,
    scrollBarX: 17,
    scrollBarY: 17,
    captureStatus: true,
    handleHotKey: function (a) {
        if (HotKey.isEnabled()) {
            switch (a) {
                case HotKey.getCharCode("area"):
                    screenshot.showSelectionArea();
                    break;
                case HotKey.getCharCode("viewport"):
                    screenshot.captureViewport();
                    break;
                case HotKey.getCharCode("fullpage"):
                    screenshot.captureFullpage();
                    break;
                case HotKey.getCharCode("screen"):
                    screenshot.captureScreen();
                    break;
                default:
                    break
            }
        }
    },
    addMessageListener: function () {
        chrome.runtime.onMessage.addListener(function (e, b, a) {
            var d = e;
            switch (d.msg) {
                case "capture_hotkey":
                    screenshot.handleHotKey(d.keyCode);
                    break;
                case "capture_selected":
                    screenshot.captureSelected();
                    break;
                case "capture_area":
                    screenshot.showSelectionArea();
                    break;
                case "capture_viewport":
                    screenshot.captureViewport();
                    break;
                case "capture_fullpage":
                    screenshot.captureFullpage();
                    break;
                default:
                    break
            }
        })
    },
    sendMessage: function (data, response) {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        },
        function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, data, response)
        })
    },
    captureViewport: function () {
        screenshot.sendMessage({
            msg: "capture_viewport"
        },
        screenshot.onResponseVisibleSize)
    },
    captureFullpage: function () {
        screenshot.sendMessage({
            msg: "scroll_init"
        },
        screenshot.onResponseVisibleSize)
    },
    showSelectionArea: function () {
        screenshot.sendMessage({
            msg: "show_selection_area"
        },
        null)
    },
    captureSelected: function () {
        screenshot.sendMessage({
            msg: "capture_selected"
        },
        screenshot.onResponseVisibleSize)
    },
    captureVisible: function (b) {
        var a = localStorage.screenshotFormat || "png";
        chrome.tabs.captureVisibleTab(null, {
            format: a,
            quality: 100
        }, function (c) {
            var d = new Image();
            d.onload = function () {
                var k = d.width;
                var f = d.height;
                var e = screenshot.canvas.width = screenshot.visibleWidth;
                var g = screenshot.canvas.height = screenshot.visibleHeight;
                var j = Utils.isRetinaDisplay() ? e * window.devicePixelRatio : e;
                var i = Utils.isRetinaDisplay() ? g * window.devicePixelRatio : g;
                var h = screenshot.canvas.getContext("2d");
                h.drawImage(d, 0, 0, j, i, 0, 0, e, g);
                screenshot.postImage(b)
            };
            d.src = c
        })
    },
    captureVisibleSelected: function (b) {
        var a = localStorage.screenshotFormat || "png";
        chrome.tabs.captureVisibleTab(null, {
            format: a,
            quality: 100
        },
        function (c) {
            var d = new Image();
            d.onload = function () {
                var f = d.width;
                var m = d.height;
                var h = screenshot.canvas.width;
                var j = screenshot.canvas.height;
                var g = Utils.isRetinaDisplay() ? h * window.devicePixelRatio : h;
                var l = Utils.isRetinaDisplay() ? j * window.devicePixelRatio : j;
                var k = Utils.isRetinaDisplay() ? screenshot.startX * window.devicePixelRatio : screenshot.startX;
                var i = Utils.isRetinaDisplay() ? screenshot.startY * window.devicePixelRatio : screenshot.startY;
                var e = screenshot.canvas.getContext("2d");
                e.drawImage(d, k, i, g, l, 0, 0, h, j);
                screenshot.postImage(b)
            };
            d.src = c
        })
    },
    captureAndScroll: function (b) {
        var a = localStorage.screenshotFormat || "png";
        chrome.tabs.captureVisibleTab(null, {
            format: a,
            quality: 100
        },
        function (c) {
            var d = new Image();
            d.onload = function () {
                var i = screenshot.canvas.getContext("2d");
                var B = screenshot.canvas.width;
                var g = screenshot.canvas.height;
                var m = Utils.isRetinaDisplay() ? B * window.devicePixelRatio : B;
                var q = Utils.isRetinaDisplay() ? g * window.devicePixelRatio : g;
                var l = Utils.isRetinaDisplay() ? screenshot.docWidth * window.devicePixelRatio : screenshot.docWidth;
                var k = Utils.isRetinaDisplay() ? screenshot.docHeight * window.devicePixelRatio : screenshot.docHeight;
                var u = Utils.isRetinaDisplay() ? screenshot.scrollX * window.devicePixelRatio : screenshot.scrollX;
                var t = Utils.isRetinaDisplay() ? screenshot.scrollY * window.devicePixelRatio : screenshot.scrollY;
                var A = Utils.isRetinaDisplay() ? screenshot.startX * window.devicePixelRatio : screenshot.startX;
                var y = Utils.isRetinaDisplay() ? screenshot.startY * window.devicePixelRatio : screenshot.startY;
                if (Utils.isThisPlatform("mac")) {
                    screenshot.scrollBarX = screenshot.scrollBarY = 0
                } else {
                    screenshot.scrollBarY = screenshot.visibleHeight < screenshot.docHeight ? 17 : 0;
                    screenshot.scrollBarX = screenshot.visibleWidth < screenshot.docWidth ? 17 : 0
                }
                var v = screenshot.visibleWidth < B ? screenshot.visibleWidth : B;
                var s = screenshot.visibleHeight < g ? screenshot.visibleHeight : g;
                var f = (d.width - screenshot.scrollBarY < m ? d.width - screenshot.scrollBarY : m);
                var w = (d.height - screenshot.scrollBarX < q ? d.height - screenshot.scrollBarX : q);
                var e = screenshot.zoom;
                var z = A - Math.round(u * e);
                var j = y - Math.round(t * e);
                var x = 0;
                var h = 0;
                var r = 0;
                var o = 0;
                var p = 0;
                var n = 0;
                if ((screenshot.scrollYCount + 1) * f > m) {
                    r = m % f;
                    p = B % v;
                    z = (screenshot.scrollYCount + 1) * f - m + A - u
                } else {
                    r = f;
                    p = v
                }
                if ((screenshot.scrollXCount + 1) * w > q) {
                    o = q % w;
                    n = g % s;
                    if ((screenshot.scrollXCount + 1) * w + t < k) {
                        j = 0
                    } else {
                        j = (screenshot.scrollXCount + 1) * w + t - k
                    }
                } else {
                    o = w;
                    n = s
                }
                x = screenshot.scrollYCount * v;
                h = screenshot.scrollXCount * s;
                i.drawImage(d, z, j, r, o, x, h, p, n);
                screenshot.sendMessage({
                    msg: "scroll_next",
                    visibleWidth: v,
                    visibleHeight: s
                },
                screenshot.onResponseVisibleSize)
            };
            d.src = c
        })
    },
    captureAndScrollDone: function (a) {
        screenshot.postImage(a)
    },
    postImage: function (a) {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        },
        function (tabs) {
            screenshot.tab = tabs[0];
            screenshot.page_info = a
        });
        chrome.tabs.create({
            url: "edit.html"
        })
    },
    onResponseVisibleSize: function (a) {
        switch (a.msg) {
            case "capture_viewport":
                screenshot.visibleHeight = a.visibleHeight;
                screenshot.visibleWidth = a.visibleWidth;
                screenshot.captureVisible(a.page_info);
                break;
            case "capture_viewport_selected":
                screenshot.startX = a.startX;
                screenshot.startY = a.startY;
                screenshot.canvas.width = a.canvasWidth;
                screenshot.canvas.height = a.canvasHeight;
                screenshot.captureVisibleSelected(a.page_info);
                break;
            case "scroll_init_done":
                screenshot.startX = a.startX;
                screenshot.startY = a.startY;
                screenshot.scrollX = a.scrollX;
                screenshot.scrollY = a.scrollY;
                screenshot.canvas.width = a.canvasWidth;
                screenshot.canvas.height = a.canvasHeight;
                screenshot.visibleHeight = a.visibleHeight;
                screenshot.visibleWidth = a.visibleWidth;
                screenshot.scrollXCount = a.scrollXCount;
                screenshot.scrollYCount = a.scrollYCount;
                screenshot.docWidth = a.docWidth;
                screenshot.docHeight = a.docHeight;
                screenshot.zoom = a.zoom;
                setTimeout(function () {
                    screenshot.captureAndScroll(a.page_info)
                },
                100);
                break;
            case "scroll_next_done":
                screenshot.scrollXCount = a.scrollXCount;
                screenshot.scrollYCount = a.scrollYCount;
                setTimeout(function () {
                    screenshot.captureAndScroll(a.page_info)
                },
                100);
                break;
            case "scroll_finished":
                screenshot.captureAndScrollDone(a.page_info);
                break;
            default:
                break
        }
    },
    init: function () {
        localStorage.screenshotFormat = localStorage.screenshotFormat || "png";
        screenshot.addMessageListener()
    }
};
screenshot.init();



// A generic onclick callback function.
function genericOnClick(info, tab) {
  console.log("item " + info.menuItemId + " was clicked");
  console.log("info: " + JSON.stringify(info));
  console.log("tab: " + JSON.stringify(tab));
}

// Create one test item for each context type.
//var contexts = ["page","selection","link","editable","image","video",
//                "audio"];
//for (var i = 0; i < contexts.length; i++) {
//  var context = contexts[i];
//  var title = "Test '" + context + "' menu item";
//  var id = chrome.contextMenus.create({"title": title, "contexts":[context],
//                                       "onclick": genericOnClick});
//  console.log("'" + context + "' item:" + id);
//}

function createMenu() {
    var title = "分享此网页";
    var pageMenuID = chrome.contextMenus.create({
        "title": title,
        "onclick": pageMenuClick
    });
    var title2 ="分享选中文字"
    var selectionMenuID = chrome.contextMenus.create({
        "title": title2, "contexts": ['selection'],
        "onclick": selectionMenuClick
    });
    var title3 = "分享此链接";
    var linkMenuID = chrome.contextMenus.create({
        "title": title3, "contexts": ['link'],
        "onclick": linkMenuClick
    });
    var title4 = "分享此图片";
    var imgMenuID = chrome.contextMenus.create({
        "title": title4, "contexts": ['image'],
        "onclick": imgMenuClick
    });
}

function popup(url) {
    window.open(url, "window", "width=600,height=400,status=yes,scrollbars=yes,resizable=yes");
}
/*
    页面直接点击
*/
function pageMenuClick(info, tab) {
    chrome.tabs.query(
                {
                    active: true,
                    currentWindow: true
                },
                function (tabs) {
                    var data = {
                        type: 'link',
                        info: info,
                        tab: tab
                    };
                    Mingdao.removeCanvas();
                    Mingdao.setPageData(JSON.stringify(data));
                    chrome.tabs.sendMessage(
                        tabs[0].id,
                        {
                            msg: "shareDocumentUrl"
                        },
                        function (response) { });
                });
}

/*
    选中文字点击
*/
function selectionMenuClick(info,tab) {
    chrome.tabs.query(
                {
                    active: true,
                    currentWindow: true
                },
                function (tabs) {
                    var data = {
                        type: 'post',
                        info: info,
                        tab: tab
                    };
                    Mingdao.removeCanvas();
                    Mingdao.setPageData(JSON.stringify(data));
                    chrome.tabs.sendMessage(
                        tabs[0].id,
                        {
                            msg: "shareDocumentUrl"
                        },
                        function (response) { });
                });
}

/*
    链接点击
*/
function linkMenuClick(info, tab) {
    chrome.tabs.query(
                {
                    active: true,
                    currentWindow: true
                },
                function (tabs) {
                    var data = {
                        type: 'link',
                        info: info,
                        tab: tab
                    };
                    Mingdao.removeCanvas();
                    Mingdao.setPageData(JSON.stringify(data));
                    chrome.tabs.sendMessage(
                        tabs[0].id,
                        {
                            msg: "shareDocumentUrl"
                        },
                        function (response) { });
                });
}

/*
    图片点击
*/
function imgMenuClick(info, tab) {
    chrome.tabs.query(
                {
                    active: true,
                    currentWindow: true
                },
                function (tabs) {
                    var data = {
                        type: 'pic',
                        canvas:true,
                        info: info,
                        tab: tab
                    };
                    Mingdao.setPageData(JSON.stringify(data));

                    chrome.tabs.sendMessage(
                        tabs[0].id,
                        {
                            msg: "shareDocumentUrl"
                        },
                        function (response) { }
                    );
                    
                });
}


 
 