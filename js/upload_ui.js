"use strict";
var HIDE_ERROR_INFO_DELAY_TIME = 5000;
var ShareButton = {
    pin: null,
    init: function () {
        var b = document.querySelectorAll("#pin-done .share-button");
        for (var a = 0; a < b.length; a++) {
            b[a].addEventListener("click",
            function (h) {
                h.preventDefault();
                if (this.classList.contains("disabled")) {
                    return
                }
                if (!ShareButton.pin) {
                    return
                }
                var d = "http://" + DOMAIN + "/pins/" + ShareButton.pin.pin_id;
                var j = Utils.getImgUrl(ShareButton.pin.file, "fw554");
                var i = ShareButton.pin.raw_text;
                var g = ["url=" + encodeURIComponent(d)];
                if (this.id == "share_sinaweibo") {
                    var c = "http://v.t.sina.com.cn/share/share.php?";
                    g.push("&appkey=2499394483");
                    g.push("&pic=" + encodeURIComponent(j));
                    g.push("&ralateUid=2493118952");
                    g.push("&title=" + encodeURIComponent(i))
                } else {
                    if (this.id == "share_douban") {
                        var c = "http://www.douban.com/recommend/?";
                        g.push("&title=" + encodeURIComponent(i));
                        g.push("&comment=" + encodeURIComponent(i))
                    } else {
                        if (this.id == "share_qzone") {
                            var c = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?";
                            g.push("&title=" + encodeURIComponent(i));
                            g.push("&pics=" + encodeURIComponent(j))
                        }
                    }
                }
                g = g.join(""); (function (k, m, l) {
                    function f() {
                        if (!window.open([c, g].join(""), "mb", ["toolbar=0,status=0,resizable=1,width=620,height=450,left=", (k.width - 620) / 2, ",top=", (k.height - 450) / 2].join(""))) {
                            u.href = [c, g].join("")
                        }
                    }
                    if (/Firefox/.test(navigator.userAgent)) {
                        setTimeout(f, 0)
                    } else {
                        f()
                    }
                })(screen, document, encodeURIComponent)
            })
        }
    },
    setPin: function (a) {
        ShareButton.pin = a
    }
};
var querySelector = function (str) {
    return document.querySelector(str);
}
var PopupPicker = {
    init: function (c, a, b) {
        this.element = c;
        this.popup = a;
        this.attach();
        this.onPick = b.onPick;
        this.popup.addEventListener("click",
        function (f) {
            var d = f.target;
            if (d.tagName.toLowerCase() != "li") {
                d = d.parentNode
            }
            if (d.tagName.toLowerCase() != "li") {
                return
            }
            this.onPick(d);
            this.hide()
        }.bind(this));
        return this
    },
    attach: function () {
        PopupPicker.element.addEventListener("click", PopupPicker.show)
    },
    detach: function () {
        PopupPicker.element.removeEventListener("click", PopupPicker.show)
    },
    show: function () {
        PopupPicker.detach();
        PopupPicker.popup.style.display = "block";
        setTimeout(function () {
            document.body.addEventListener("click", PopupPicker.bodyClicked)
        },
        100)
    },
    hide: function () {
        PopupPicker.popup.style.display = "none";
        document.body.removeEventListener("click", PopupPicker.bodyClicked);
        setTimeout(function () {
            PopupPicker.attach()
        },
        100)
    },
    bodyClicked: function (a) {
        if (PopupPicker.popup.style.display != "none" && !PopupPicker.isMouseOver(a)) {
            PopupPicker.hide()
        }
    },
    isMouseOver: function (h) {
        var a = h.pageX,
        i = h.pageY;
        var d = PopupPicker.popup.getBoundingClientRect();
        var g = d.left + PopupPicker.popup.clientLeft;
        var f = d.top + PopupPicker.popup.clientTop;
        var c = g + d.width;
        var b = f + d.height;
        return a > g && a < c && i > f && i < b
    }
};
var BoardPicker = {
    itemHeight: 30,
    maxVisibleItems: 8,
    setHeight: false,
    eventElement: document.createElement("div"),
    _h_boards: {},
    init: function (b, c) {
        this.element = b;
        this._maxH = this.itemHeight * this.maxVisibleItems;
        this.curEl = b.querySelector(".name"),
        this.popEl = b.querySelector(".board-list"),
        this.bodyEl = b.querySelector(".board-list-body");
        this.listEl = this.bodyEl.querySelector("ul");
        this.bodyEl.style.height = "0px";
        if (!this.popup) {
            this.popup = PopupPicker.init(b, this.popEl, {
                onPick: this.select
            })
        }
        this._items = 0;
        this.listEl.innerHTML = "";
        var everyone = { id: '-1', name: '所有同事' };
        BoardPicker._injectItem(everyone.id,everyone.name);
        if (c && c.length > 0) {
            this.boards = c;
            var a = {};
            a[everyone.id] = everyone;
            c.forEach(function (d) {
                BoardPicker._injectItem(d.id, d.name);
                a[d.id] = d
            });
            BoardPicker._h_boards = a;
            this.select(this.listEl.querySelector("li"))
        } else {
            this.curEl.innerHTML = "选择群组...";
            this.curEl.data = null
        }
        return this
    },
    _injectItem: function (d, c) {
        this._items += 1;
        var a = document.createElement("li");
        a.setAttribute("class", "board-category");
        a.innerHTML = "<span>" + c + "</span>";
        a.data = d;
        this.listEl.appendChild(a);
        var b = this._items * this.itemHeight;
        this.bodyEl.style.height = (b > this._maxH ? this._maxH : b) + "px";
        return a
    },
    add: function (b) {
        var a = this._injectItem(b.board_id, b.title);
        BoardPicker._h_boards[b.board_id] = b;
        this.select(a);
        return this
    },
    hide: function () {
        this.popup.hide()
    },
    select: function (a) {
        if (!a) {
            return
        }
        if (a.constructor === HTMLLIElement) {
            BoardPicker.curEl.innerHTML = a.querySelector("span").innerHTML;
            BoardPicker.curEl.data = a.data;
            var e = BoardPicker._h_boards[a.data];
            BoardPicker.eventElement.dispatchEvent(new CustomEvent("select", {
                detail: e
            }));
            return BoardPicker
        }
        var c = BoardPicker.listEl.querySelectorAll("li");
        for (var d = 0,
        b = c.length; d < b; d++) {
            if (c[d].data == a) {
                return BoardPicker.select(c[d])
            }
        }
        return BoardPicker
    },
    addEventListener: function (b, a) {
        BoardPicker.eventElement.addEventListener(b, a)
    },
    getSelected: function () {
        return BoardPicker.curEl.data
    }
};
var UploadUI = {
    init: function (a) {
        if (a) {
            Mingdao.currentUserId = a.id
        }
        //querySelector("#pin_wrapper .box-title .close").addEventListener("click",
        //function (c) {
        //    $("pin-done").style.display = "none";
        //    querySelector("#dialog-box .pbt").style.display = "block";
        //    var b = querySelector("#dialog-box .rbtn");
        //    b.classList.remove("disabled");
        //    b.innerText = "分享";
        //    UploadUI.closeDialog();
        //    c.preventDefault()
        //});
        UploadUI.initSave();
        UploadUI.initBoards();
        ShareButton.init()
    },
    dataURItoBlobLink: function () {
        var e = photoshop.getDataUrl();
        var f = atob(e.split(",")[1]);
        var b = e.split(",")[0].split(":")[1].split(";")[0];
        var d = ajax.constructBlobData(f, b);
        var c = document.createElement("a");
        c.download = "mingdao." + localStorage.screenshotFormat;
        c.href = window.webkitURL.createObjectURL(d);
        c.dataset.downloadurl = [b, c.download, c.href].join(":");
        c.draggable = true;
        return c
    },
    initSave: function () {
        var a = $("btn_save");
        if (!a) {
            return
        }
        a.addEventListener("click",
        function (b) {
            UploadUI.dataURItoBlobLink().click();
            b.preventDefault()
        })
    },
    showErrorInfo: function (a) {
        var msg_bar = $("msg_bar");
        if (!msg_bar) {
            alert(a);
            return;
        }
        $("msg_bar").innerHTML = a;
        $("msg_bar").style.display = "block";
        $("msg_bar").style.top = 0;
        setTimeout(function () {
            UploadUI.hideErrorInfo()
        },
        HIDE_ERROR_INFO_DELAY_TIME)
    },
    hideErrorInfo: function () {
        var a = $("msg_bar").clientHeight + 2;
        $("msg_bar").style.top = "-" + a + "px"
    },
    getAccessToken: function () {
        var a = function (b, c) {
            if (b == "success") {
                UploadUI.getUserInfo(c)
            } else {
                var d = c;
                if (c == "access_denied") {
                    d = "访问被拒绝"
                } else {
                    if (c == "invalid_grant") {
                        d = "无效的授权"
                    }
                }
                UploadUI.showErrorInfo(d);
                UploadUI.showAuth()
            }
        };
        Mingdao.getAccessToken(a)
    },
    getUserInfo: function (a) {
        Mingdao.getUserInfo(a,
        function (b, c, e) {
            if (b == "success") {
                var d = a.id;
                if (!Mingdao.getUser(d)) {
                    Mingdao.currentUserId = d;
                    Mingdao.addUser(a);
                    UploadUI.showShare(a);
                    UploadUI.fillBoards(e);
                }
            } else {
                UploadUI.showErrorInfo(c)
            }
        })
    },
    getBoards: function (a) {
        Mingdao.getBoards(a,
        function (b, c) {
            if (b == "success") {
                UploadUI.fillBoards(c)
            } else {
                UploadUI.signOut(a)
            }
        })
    },
    fillBoards: function (b) {
        var a = querySelector("div.board-picker");
        BoardPicker.init(a, b)
    },
    initBoards: function (a) {
        var b = querySelector("div.board-picker");
        var g = querySelector("div.create-board");
        var m = $("board_name_input");
        var e = querySelector("a.btn");
        var i = querySelector(".create-board-status");
        var c = querySelector("#dialog-box .rbtn");
        var h = 8;
        var j = querySelector("textarea.description-textarea");
        var f = BoardPicker;
        var k = $$(".tag-tip")[0];
        var n = $$(".tag-prompt")[0];
        var l = querySelector(".tags");
        UploadUI.fillBoards(a);
        j.addEventListener("keyup",
        function () {
            var p = j.value;
            var o = l.querySelectorAll("a");
            if (!o.length) return;
            o.forEach(function (r) {
                var q = r.dataset.tag;
                q = "#" + q + "#";
                if (!~p.indexOf(q) && r.classList.contains("selected")) {
                    r.classList.remove("selected")
                }
            })
        });
        n.addEventListener("click",
        function (q) {
            if (q.srcElement.tagName != "A" || !q.srcElement.dataset.tag) {
                return
            }
            var p = q.srcElement;
            p.classList.add("selected");
            var o = p.dataset.tag;
            o = "#" + o + "#";
            var r = j.value;
            if (~r.indexOf(o)) {
                j.selectionStart = r.indexOf(o);
                j.selectionEnd = o.length + r.indexOf(o);
                return
            }
            j.value = r.trim() + " " + o
        });
        f.addEventListener("select",
        function (r) {
            var q = r.detail;
            var s = q && q.recommend_tags || [];
            while (l.lastChild) {
                l.lastChild.remove()
            }
            if (s.length) {
                var p;
                for (var o = 0; o < s.length; o += 1) {
                    p = document.createElement("a");
                    p.textContent = s[o];
                    p.setAttribute("title", s[o]);
                    p.dataset.tag = s[o];
                    l.appendChild(p)
                }
                n.style.display = "block";
                k.style.display = "none"
            } else {
                k.style.display = "block";
                n.style.display = "none"
            }
        });
        e.addEventListener("click",
        function (o) {
            o.preventDefault();
            var p = m.value || "";
            p = p.replace(/^\s+|\s+$/g, "");
            if (p == "") {
                UploadUI.showErrorInfo("请输入名称");
                return
            }
            e.classList.add("disabled");
            Mingdao.createBoard(p,
            function (q, s) {
                if (q == "success" && s && s.board) {
                    f.add(s.board).hide()
                } else {
                    if (s.err && s.fieldErrors) {
                        for (var r in s.fieldErrors) {
                            UploadUI.showErrorInfo(s.fieldErrors[r][0]);
                            break
                        }
                    } else {
                        if (s.err && s.msg) {
                            UploadUI.showErrorInfo(s.msg)
                        } else {
                            UploadUI.showErrorInfo("网络错误，请稍候再试")
                        }
                    }
                }
                m.value = ""
            })
        });
        c.addEventListener("click",
        function (p) {
            p.preventDefault();
            c.classList.add("disabled");
            var t = f.getSelected();
            if (!t) {
                return alert("请选择群组")
            }
            var r = $("description").value;
            var q = querySelector("input.publish_to_weibo").checked;
            var o = $("url").value;
            var s = UploadUI.getImageData();
            c.innerText = "分享中…";
            Mingdao.upload(t, r, o, q, s,
            function (v, x, z) {
                if (v == "success") {
                    querySelector("#dialog-box .pbt").style.display = "none";
                    var y = x;
                    var w = $("pin-done");
                    var B = $("view_pin");
                    B.href = "http://" + DOMAIN + "/feeddetail?itemID=" + y.post;
                    B.onclick = function () {
                        chrome.extension.sendMessage({ msg: "open_new_url", url: B.href });
                        return false
                    };
                    w.style.display = "block";
                    var A = querySelector("a.less");
                    //A.innerText = y.board.title;
                    A.href = "#";
                    ShareButton.setPin(y);
                    return
                } else {
                    if (z && z == 413) {
                        UploadUI.showErrorInfo("图片太大")
                    } else {
                        UploadUI.showErrorInfo(x)
                    }
                }
                c.classList.remove("disabled");
                c.innerText = "分享"
            })
        });
        var d = function () {
            if (m.value != "") {
                e.classList.remove("disabled")
            } else {
                e.classList.add("disabled")
            }
        };
        m.addEventListener("keydown", d);
        m.addEventListener("focus", d);
        m.addEventListener("blur", d)
    },
    showShare: function (b) {
        var loadding = $("loading"),
           authorization = $("authorization"),
           pinform = querySelector(".pin-form");

        loadding.style.display = "none";
        authorization.style.display = "none";
        pinform.style.display = "block";
        if (b && b.bindings && b.bindings.weibo) {
            querySelector(".pin-form .buttons label.weibo").style.display = "block"
        } else {
            querySelector(".pin-form .buttons label.weibo").style.display = "none"
        }
    },
    showUser: function (b) {
        var f = $("user_icon");
        var c = document.createElement("a");
        c.href = Utils.getUserUrl(b);
        c.target = "_blank";
        var a = new Image();
        if (b.avatar) {
            a.src = Utils.getImgUrl(b.avatar, "sq75")
        } else {
            a.src = "/images/default_buddy_icon.jpg"
        }
        var d = document.createElement("span");
        d.title = "移除授权";
        d.addEventListener("click",
        function (g) {
            UploadUI.signOut(b);
            g.preventDefault()
        });
        var e = document.createTextNode(b.name);
        c.appendChild(a);
        c.appendChild(e);
        f.appendChild(c);
        f.appendChild(d);
        f.style.display = "block"
    },
    signOut: function (a) {
        var b = $("user_icon");
        b.innerHTML = "";
        b.style.display = "none";
        Mingdao.removeUser(a.id);
        UploadUI.showAuth();
        return false
    },
    showAuth: function () {
        $("loading").style.display = "none";
        $("authorization").style.display = "block";
        querySelector(".pin-form").style.display = "none"
    },
    showLoading: function () {
        $("loading").style.display = "block";
        $("authorization").style.display = "none";
        querySelector(".pin-form").style.display = "none"
    },
    getImageData: function () {
        var a;
        try {
            a = Mingdao.getCanvas() || parent.photoshop.getDataUrl();
        } catch (e) {

        }
        if (a)
            return atob(a.split(",")[1])
        return null;
    }
};
if (typeof chrome.tabs != 'undefined') {
    (function () {
        var a;
        chrome.tabs.query({
            active: true,
            currentWindow: true
        },
        function (b) {
            a = b[0].id
        });
        chrome.runtime.onMessage.addListener(function (d, c) {
            switch (d.msg) {
                case "url_for_access_token":
                    var b = d.url;
                    if (Mingdao.isRedirectUrl(b)) {
                        chrome.tabs.update(a, {
                            selected: true
                        });
                        chrome.tabs.remove(c.tab.id);
                        Mingdao.parseAccessToken(b)
                    }
                    break
            }
        })
    })();
}