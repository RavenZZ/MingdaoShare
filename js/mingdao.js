"use strict"; (function () {
    var domain = "mingdao.com";
    var app_key = "FC07433C4B74";
    var authorizeUrl = "https://api." + domain + "/oauth2/authorize";
    var response_type = "token";
    var callbackUrl = chrome.extension.getURL('index.html');
   
    var acctountUrl = "http://api." + domain + "/passport/detail";
    var groupUrl = "http://api." + domain + "/group/my_joined";
    var g = "http://api." + domain + "/post/upload";
    var e = "Mingdao_Bobobee_Boundary";
    var j = function (m) {
        for (var n in m) {
            this[n] = m[n]
        }
    };
    var c = {
        getToken: function () {
            var token = localStorage.getItem("token");
            return token;
        },
        getAllUsers: function () {
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
        isExpires: function (n) {
            var m = n.expires;
            if (m) {
                return new Date().getTime() >= m
            }
            return false
        }
    };
    var b = window.Mingdao = {
        currentUserId: null,
        redirectUrl: callbackUrl,
        accessTokenCallback: null,
        getToken: function () {
            return c.getToken();
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
            b.accessTokenCallback = n;
            var m = authorizeUrl + "?app_key=" + app_key + "&redirect_uri=" + callbackUrl + "&response_type=" + response_type;
            //chrome.tabs.create({
            //    url: m
            //})
            window.location = m;
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
            var n = "bearer " + m.accessToken;
            ajax({
                url: groupUrl,
                headers: {
                    Authorization: n
                },
                parameters: {
                    access_token: m.accessToken,
                    u_id: m.id,
                    format: 'json'
                },
                success: function (p) {
                    if (p.err) {
                        return o("failure", p)
                    }
                    //var q = p.boards.filter(function (r) {
                    //    return r.is_private != 2
                    //});
                    return o("success", p.groups)
                }
            })
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
        upload: function (n, x, t, p, m, w) {
            var r = c.getUser(Mingdao.currentUserId);
            var s = "Bearer " + r.accessToken;
            var v = new Date().getTime() + "." + localStorage.screenshotFormat;
            var q = "image/" + localStorage.screenshotFormat;
            x += '\n' + t;
            var u = {
                boundary: e,
                data: m,
                value: v,
                type: q,
                name: 'p_img'
            };
            ajax({
                url: g,
                headers: {},
                multipartData: u,
                parameters: {
                    access_token: r.accessToken,
                    g_id: n,
                    p_msg: x,
                    s_type: 1,
                    format: 'json'
                },
                success: function (y) {
                    if (y.post) {
                        w("success", y)
                    } else {
                        w("failure", y.msg || y)
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
            })
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