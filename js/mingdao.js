"use strict"; (function () {
    var domain = "mingdao.com";
    //window.app_key = "E9EEBF47C2CB";
    //window.app_secret = "8B9E15C9F494AAF867D141FE7F564AB";
    window.app_key = "FC07433C4B74";
    window.app_secret = "501C8FA4F7E51BFCAE7EED783653150";
    window.response_type = "authorization_code";
    window.callbackUrl = chrome.extension.getURL('index.html');
    window.authorizeUrl = "https://api." + domain + "/oauth2/authorize";
    window.access_token_url = "https://api." + domain + "/oauth2/access_token";
    var acctountUrl = "http://api." + domain + "/passport/detail";
    var groupUrl = "http://api." + domain + "/group/my_joined";
    var uploadUrl = "http://api." + domain + "/post/upload";
    var postUrl = "http://api." + domain + "/post/update";
    var e = "Mingdao_Bobobee_Boundary";
    var j = function (m) {
        for (var n in m) {
            this[n] = m[n]
        }
    };
    var c = {
        getToken: function () {
            var time = localStorage.getItem("tokentime");
            if (time) {
                debugger;
                if ((new Date().getTime() - parseInt(time)) > 432000000)
                localStorage.removeItem("token");
                var token = localStorage.getItem("token");
                return token;
            }
            return null;
        },
        setToken: function (token) {
            localStorage.setItem("tokentime",new Date().getTime());
            localStorage.setItem("token", token);
        },
        getAllUsers: function () {
            var time = localStorage.getItem("tokentime");
            if ((new Date().getTime() - time) > 432000000)
                this.removeAllUsers();
            var n = localStorage.getItem("mingdao_userInfo");
            if (n) {
                n = JSON.parse(n);
                for (var m in n) {
                    if (c.isExpires(n[m])) {
                        delete n[m]
                    }
                }
                localStorage.setItem("mingdao_userInfo", JSON.stringify(n));
                return n
            }
            return {}
        },
        removeAllUsers: function () {
            localStorage.removeItem("mingdao_userInfo");
        },
        getUser: function (n) {
            var o = c.getAllUsers();
            var m = o[n];
            if (m && c.isExpires(m)) {
                c.removeUser(n);
                return null
            } else {
                return m
            }
        },
        addUser: function (m) {
            var o = c.getAllUsers();
            var n = m.id;
            if (!o[n]) {
                o[n] = m;
                o = JSON.stringify(o);
                localStorage.setItem("mingdao_userInfo", o)
            }
        },
        updateUser: function (m) {
            var o = c.getAllUsers();
            var n = m.id;
            if (o && o[n]) {
                o[n] = m;
                o = JSON.stringify(o);
                localStorage.setItem("mingdao_userInfo", o)
            }
        },
        removeUser: function (m) {
            var n = c.getAllUsers();
            delete n[m];
            n = JSON.stringify(n);
            localStorage.setItem("mingdao_userInfo", n)
        },
        getBoards: function () {
            var boards = localStorage.getItem("mingdao_groups");
            if (boards) {
                boards = JSON.parse(boards);
                return boards;
            }
            return [];
        },
        setBoards: function (groups) {
            var str = JSON.stringify(groups);
            localStorage.setItem("mingdao_groups", str)
        },
        isExpires: function (n) {
            var m = n.expires;
            if (m) {
                return new Date().getTime() >= m
            }
            return false
        },
        setCanvas: function (data) {
            localStorage.setItem("canvas", data);
        },
        getCanvas: function () {
            return localStorage.getItem("canvas");
        },
        removeCanvas: function () {
            localStorage.removeItem("canvas");
        },
        getPageData: function () {
            return localStorage.getItem("pagedata");
        },
        setPageData: function (data) {
            localStorage.setItem("pagedata", data);
        }
    };
    var b = window.Mingdao = {
        canvas:null,
        currentUserId: null,
        redirectUrl: callbackUrl,
        setCanvas: function (src, callback) {
            if (src) {
                var img = new Image();
                img.src = src;
                img.onload = function () {
                    var c;
                    if (typeof screenshot != 'undefined')
                        c = screenshot.canvas;
                    else if (typeof bg != 'undefined')
                        c = bg.screenshot.canvas;
                    else {
                        Mingdao.canvas = document.createElement("canvas");
                        c = Mingdao.canvas
                    }
                    c.width = this.width;
                    c.height = this.height;
                    var h = c.getContext("2d");
                    h.drawImage(this, 0, 0, this.width, this.height);
                    (callback && callback())
                };
            } else {
                Mingdao.canvas = null;
                (callback && callback())
            }
        },
        getCanvas: function () {
            var canvas = null;
            if (typeof screenshot != 'undefined')
                canvas = screenshot.canvas;
            if (typeof bg != 'undefined')
                canvas = bg.screenshot.canvas;
            if (typeof Mingdao != 'undefined') 
                canvas = Mingdao.canvas;

            if (canvas) 
                return canvas.toDataURL("image/png");
            else 
                return '';
        },
        removeCanvas: function () {
            c.removeCanvas();
        },
        getPageData: function () {
            return c.getPageData();
        },
        setPageData: function (data) {
            c.setPageData(data);
        },
        accessTokenCallback: null,
        getToken: function () {
            return c.getToken();
        },
        setToken: function (token) {
            c.removeAllUsers();
            return c.setToken(token);
        },
        addUser: function (m) {
            return c.addUser(m)
        },
        getUser: function (o) {
            if (o) {
                return c.getUser(o)
            } else {
                var p = c.getAllUsers();
                var n = null;
                for (var m in p) {
                    n = p[m];
                    break
                }
                return n
            }
        },
        removeUser: function (m) {
            return c.removeUser(m)
        },
        getAccessToken: function (n) {
            Mingdao.accessTokenCallback = n;
            var m = authorizeUrl + "?app_key=" + app_key + "&redirect_uri=" + callbackUrl + "&response_type=" + response_type;
            chrome.extension.sendMessage({ msg: "show_modal_dialog", url: m });
            var _interval = setInterval(function () {
                var token = Mingdao.getToken();
                if (token) {
                    Mingdao.accessTokenCallback("success", { accessToken: Mingdao.getToken() });
                    clearInterval(_interval);
                }
            },100);
        },
        parseRedirectUrl: function (p) {
            var m = false;
            if (p.indexOf(l) == 0) {
                var s = p.split("#")[1];
                if (s) {
                    var t = s.split("&");
                    var r = {};
                    t.forEach(function (u) {
                        r[u.split("=")[0]] = u.split("=")[1]
                    });
                    var o = r.access_token;
                    var n = r.expires_in;
                    if (o && n) {
                        m = {
                            accessToken: o,
                            expires: n
                        }
                    } else {
                        m = "bad_redirect_url"
                    }
                } else {
                    var q = p.split("?")[1];
                    if (q.indexOf("error=") == 0) {
                        m = q.substr(6)
                    }
                }
            }
            return m
        },
        isRedirectUrl: function (m) {
            return b.parseRedirectUrl(m) != false
        },
        parseAccessToken: function (o) {
            var n = b.parseRedirectUrl(o);
            if (n && typeof n == "object") {
                var m = new j({
                    accessToken: n.accessToken,
                    expires: new Date().getTime() + n.expires * 1000
                });
                b.accessTokenCallback("success", m)
            } else {
                b.accessTokenCallback("failure", n)
            }
            b.accessTokenCallback = null
        },
        getBoards: function (m, o) {
            var boards = c.getBoards();
            if (boards.length == 0) {
                var n = "bearer " + m.accessToken;
                ajax({
                    url: groupUrl,
                    headers: {},
                    parameters: {
                        access_token: m.accessToken,
                        u_id: m.id,
                        format: 'json'
                    },
                    success: function (p) {
                        if (p.err) {
                            return o("failure", p)
                        }
                        c.setBoards(p.groups);
                        return o("success", p.groups)
                    }
                })
            } else {
                o("success", boards);
            }
        },
        createBoard: function (o, q) {
            var m = c.getUser(Mingdao.currentUserId);
            var p = "bearer " + m.accessToken;
            var n = "title=" + encodeURIComponent(o);
            ajax({
                method: "POST",
                url: h,
                headers: {
                    Authorization: p,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                data: n,
                success: function (r) {
                    q("success", r)
                }
            })
        },
        getUserInfo: function (m, o) {
            ajax({
                url: acctountUrl,
                headers: {},
                parameters: {
                    access_token: m.accessToken,
                    format: 'json'
                },
                success: function (q) {
                    if (!q.user) {
                        o("failure", "failed_to_get_user_info");
                        return
                    }
                    var p = q.user.id;
                    var r = q.user.name;
                    m.id = p;
                    m.name = r;
                    m.avatar = q.user.avatar;
                    ajax({
                        url: groupUrl,
                        headers: {},
                        parameters: { access_token: m.accessToken, u_id: m.id, format: "json" },
                        success: function (s) {
                            c.setBoards(s.groups);
                            o("success", m, s.groups)
                        }
                    })
                },
                status: {
                    404: function () {
                        o("failure", "failed_to_get_user_info")
                    }
                }
            })
        },
        upload: function (gid, msg, link, toweibo, imgData, callback) {
            var r = c.getUser(Mingdao.currentUserId);
            var time = new Date().getTime() + "." + (localStorage.screenshotFormat || "png");
            var imageType = "image/" + (localStorage.screenshotFormat || "png");
            
            var parameters = {
                "access_token": r.accessToken,
                "g_id": (gid == "-1" ? "" : gid),
                "s_type": (gid == "1" ? 0 : 1),
                "format": "json"
            };
            var request = {
                method: "POST",
                headers: {},
                success: function (y) {
                    if (y.post) {
                        callback("success", y)
                    } else {
                        callback("failure", y.error_code || y)
                    }
                },
                status: {
                    413: function (y) {
                        w("failure", "Entity Too Large", 413)
                    },
                    others: function (y, z) {
                        w("failure", y, z)
                    }
                }
            }
            if (imgData) {
                request.url = uploadUrl;
                request.multipartData = {
                    boundary: "boundary=" + e,
                    data: imgData,
                    value: time,
                    type: imageType,
                    name: 'p_img'
                }
                msg += '\n' + link;
                parameters.p_msg = msg;
                request.parameters = parameters;

            } else {
                request.headers = { "Content-Type": "application/x-www-form-urlencoded" };
                request.url = postUrl;
                var param = new Array();
                for (var key in parameters) {
                    param.push(key + "=" + parameters[key]);
                }
                param.push("l_title=" + link);
                param.push("l_uri=" + link);
                param.push("p_type=1");
                param.push("p_msg=" + msg);
                request.data = param.join("&");
            }
            ajax(request);
        },
        postPin: function (p, r) {
            var n = c.getUser(b.currentUserId);
            var q = "bearer " + n.accessToken;
            var m = "";
            for (var o in p) {
                m += o + "=" + encodeURIComponent(p[o]) + "&"
            }
            m += "via=7";
            ajax({
                method: "POST",
                url: g,
                headers: {
                    access_token: q,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                data: m,
                success: function (s) {
                    r("success", s)
                },
                status: {
                    others: function (s, t) {
                        r("failure", t)
                    }
                }
            })
        }
    }
})();