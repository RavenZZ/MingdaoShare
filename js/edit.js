"use strict";
var bg = chrome.extension.getBackgroundPage();
var Canvas = (function () {
    var a = function (d, e) {
        var g = d.toLowerCase();
        var c = [];
        for (var f = 1; f < g.length; f += 2) {
            c.push(parseInt("0x" + g.slice(f, f + 2)))
        }
        return "rgba(" + c.join(",") + "," + e + ")"
    };
    var b = function (e, f, d, c, h, g) {
        var j = function () {
            var k = d - h;
            var o = c - g;
            var n = Math.sqrt(k * k + o * o);
            n = (n == 0 ? f : n);
            var m = Math.round(k / n * f);
            var l = Math.round(o / n * f);
            return {
                x: h + m,
                y: g + l
            }
        };
        var i = function (o, q) {
            var k = o.x - d;
            var p = o.y - c;
            var n = Math.sqrt(k * k + p * p);
            n = (n == 0 ? f : n);
            var m = Math.round((p / n * e) * q);
            var l = Math.round((k / n * e) * q);
            return {
                x: o.x + m,
                y: o.y - l
            }
        };
        return {
            p1: i(j(), 1),
            p2: i(j(), -1)
        }
    };
    return {
        drawStrokeRect: function (f, g, e, i, h, d, c) {
            f.strokeStyle = g;
            f.lineWidth = c;
            f.strokeRect(e, i, h, d)
        },
        drawFillRect: function (e, f, d, h, g, c) {
            e.fillStyle = f;
            e.fillRect(d, h, g, c)
        },
        drawEllipse: function (o, f, n, m, d, c, k, l) {
            var j = n + d;
            var h = m;
            o.beginPath();
            o.lineWidth = k;
            o.moveTo(j, h);
            for (var g = 0; g <= 360; g++) {
                var e = g * Math.PI / 180;
                j = n + (d - 2) * Math.cos(e);
                h = m - (c - 2) * Math.sin(e);
                o.lineTo(j, h)
            }
            if (l == "rect") {
                o.fillStyle = a(f, 0.5);
                o.fill()
            } else {
                if (l == "border") {
                    o.strokeStyle = f;
                    o.stroke()
                }
            }
            o.closePath()
        },
        getLines: function (n, m, e, f) {
            var k = m.split(" ");
            var o = [];
            var l = "";
            var d = 0;
            n.font = f;
            for (var h = 0; h < k.length; h++) {
                var c = k[h];
                d = n.measureText(l + c).width;
                if (d <= e || c == "") {
                    l += c + " "
                } else {
                    if (l != "") {
                        o.push(l)
                    }
                    d = n.measureText(c).width;
                    if (d <= e) {
                        l = c + " "
                    } else {
                        l = c[0];
                        for (var g = 1; g < c.length; g++) {
                            d = n.measureText(l + c[g]).width;
                            if (d <= e) {
                                l += c[g]
                            } else {
                                o.push(l);
                                l = c[g]
                            }
                        }
                        l += " "
                    }
                }
            }
            if (l != "") {
                o.push(l)
            }
            return o
        },
        setText: function (l, k, d, n, f, j, h, g, c) {
            l.textBaseline = "top";
            l.fillStyle = d;
            l.font = n + " " + f;
            l.lineHeight = j;
            var m = Canvas.getLines(l, k, c, l.font);
            l.save();
            l.beginPath();
            for (var e = 0; e < m.length; e++) {
                l.fillText(m[e], h, g + j * e, c)
            }
            l.restore()
        },
        drawLine: function (f, g, j, d, e, c, i, h) {
            f.beginPath();
            f.moveTo(e, c);
            f.strokeStyle = g;
            f.lineWidth = d;
            f.lineCap = j;
            f.lineTo(i, h);
            f.closePath();
            f.stroke()
        },
        drawArrow: function (m, d, i, f, e, l, h, g, k, j) {
            var c = b(f, e, h, g, k, j);
            m.beginPath();
            m.strokeStyle = d;
            m.lineWidth = i;
            m.lineCap = l;
            m.moveTo(h, g);
            m.lineTo(k, j);
            m.moveTo(c.p1.x, c.p1.y);
            m.lineTo(k, j);
            m.moveTo(c.p2.x, c.p2.y);
            m.lineTo(k, j);
            m.closePath();
            m.stroke()
        },
        drawRoundedRect: function (f, g, e, j, i, d, c, h) {
            f.beginPath();
            f.moveTo(e, j + c);
            f.lineTo(e, j + d - c);
            f.quadraticCurveTo(e, j + d, e + c, j + d);
            f.lineTo(e + i - c, j + d);
            f.quadraticCurveTo(e + i, j + d, e + i, j + d - c);
            f.lineTo(e + i, j + c);
            f.quadraticCurveTo(e + i, j, e + i - c, j);
            f.lineTo(e + c, j);
            f.quadraticCurveTo(e, j, e, j + c);
            if (h == "rect") {
                f.fillStyle = a(g, 0.5);
                f.fill()
            } else {
                if (h == "border") {
                    f.strokeStyle = g;
                    f.lineWidth = 2;
                    f.stroke()
                }
            }
            f.closePath()
        },
        blurImage: function (m, k, e, g, f, p, n) {
            var j = g < p ? g : p;
            var i = f < n ? f : n;
            var d = Math.abs(p - g - 1);
            var l = Math.abs(n - f - 1);
            k.width = $(e).clientWidth + 10;
            k.height = $(e).clientHeight + 10;
            var o = k.getContext("2d");
            try {
                o.drawImage(m, j, i, d, l, 0, 0, d, l)
            } catch (h) {
                console.log(h + " width : height" + d + " : " + l)
            }
            var c = o.getImageData(0, 0, d, l);
            c = this.boxBlur(c, d, l, 10);
            o.putImageData(c, 0, 0)
        },
        boxBlur: function (f, c, t, q) {
            var l;
            var s = f.data;
            var v = 0;
            var u = 0;
            var d = 0;
            var h;
            var p;
            var r;
            for (h = 0; h < 2; h++) {
                if (h) {
                    u = c;
                    v = t;
                    d = c * 4
                } else {
                    u = t;
                    v = c;
                    d = 4
                }
                for (var n = 0; n < u; n++) {
                    p = (h == 0 ? (n * c * 4) : (4 * n));
                    for (var g = 0; g < 4; g++) {
                        r = p + g;
                        var o = 0;
                        for (var e = 0; e < q; e++) {
                            o += s[r + d * e]
                        }
                        s[r] = s[r + d] = s[r + d * 2] = Math.floor(o / q);
                        for (l = 3; l < v - 2; l++) {
                            o = Math.max(0, o - s[r + (l - 2) * d] + s[r + (l + 2) * d]);
                            s[r + l * d] = Math.floor(o / q)
                        }
                        s[r + l * d] = s[r + (l + 1) * d] = Math.floor(o / q)
                    }
                }
            }
            return f
        }
    }
}());
var photoshop = {
    canvas: document.createElement("canvas"),
    tabTitle: "",
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    dragFlag: false,
    flag: "rectangle",
    layerId: "layer0",
    canvasId: "",
    color: "#ff0000",
    lastValidAction: 0,
    markedArea: [],
    isDraw: true,
    isCropTurnOn: false,
    nowHeight: 0,
    nowWidth: 0,
    highlightType: "border",
    highlightMode: "rectangle",
    text: "",
    actions: [],
    setUnfilled: function () {
        var a = $("photo");
        if (a.offsetLeft > 0) {
            a.className = "unfilled"
        } else {
            a.classList.remove("unfilled")
        }
    },
    markCurrentElement: function (c) {
        if (c && c.parentNode) {
            var b = c.parentNode.children;
            for (var a = 0; a < b.length; a++) {
                var d = b[a];
                if (d == c) {
                    c.classList.add("mark")
                } else {
                    d.classList.remove("mark")
                }
            }
        }
    },
    setHighLightMode: function () {
        photoshop.highlightType = localStorage.highlightType || "border";
        $(photoshop.layerId).style.border = "2px solid " + photoshop.color;
        if (photoshop.highlightType == "rect") {
            $(photoshop.layerId).style.backgroundColor = photoshop.color;
            $(photoshop.layerId).style.opacity = 0.5
        }
        if (photoshop.flag == "rectangle") {
            $(photoshop.layerId).style.borderRadius = "0 0"
        } else {
            if (photoshop.flag == "radiusRectangle") {
                $(photoshop.layerId).style.borderRadius = "6px 6px"
            } else {
                if (photoshop.flag == "ellipse") {
                    $(photoshop.layerId).style.border = "0";
                    $(photoshop.layerId).style.backgroundColor = "";
                    $(photoshop.layerId).style.opacity = 1
                }
            }
        }
    },
    setBlackoutMode: function () {
        photoshop.color = "#000000";
        $(photoshop.layerId).style.opacity = 1;
        $(photoshop.layerId).style.backgroundColor = "#000000";
        $(photoshop.layerId).style.border = "2px solid #000000"
    },
    setTextMode: function () {
        var b = +localStorage.fontSize || 14;
        photoshop.color = localStorage.color || "#FF0000";
        var a = $(photoshop.layerId);
        a.setAttribute("contentEditable", true);
        a.style.cursor = "text";
        a.style.minWidth = "24px";
        a.style.width = "auto";
        a.style.height = "auto";
        a.style.lineHeight = b + 4 + "px";
        a.style.fontSize = b + "px";
        a.style.color = photoshop.color;
        a.innerHTML = "<br/>";
        a.addEventListener("blur",
        function () {
            photoshop.setTextToArray("layer" + (photoshop.lastValidAction - 1))
        })
    },
    setTextToArray: function (d) {
        var b = $(d).innerText.split("\n");
        var c;
        if (photoshop.markedArea.length > 0) {
            for (var a = photoshop.markedArea.length - 1; a >= 0; a--) {
                if (photoshop.markedArea[a].id == d) {
                    c = photoshop.markedArea[a];
                    c.context = b;
                    c.width = $(d).offsetWidth;
                    c.height = $(d).offsetHeight;
                    c.endX = c.startX + c.width;
                    c.endY = c.startY + c.height;
                    break
                }
            }
        }
    },
    finish: function () {
        var a = $("canvas").getContext("2d");
        a.drawImage(photoshop.canvas, 0, 0)
    },
    colorRgba: function (b, c) {
        var e = b.toLowerCase();
        var a = [];
        for (var d = 1; d < e.length; d += 2) {
            a.push(parseInt("0x" + e.slice(d, d + 2)))
        }
        return "rgba(" + a.join(",") + "," + c + ")"
    },
    toDo: function (a, b) {
        if (b == "crop") {
            photoshop.isDraw = false;
            if (photoshop.flag !== "crop") {
                photoshop.createCropArea()
            }
        } else {
            photoshop.isDraw = true;
            if (photoshop.flag == "crop") {
                photoshop.removeCropArea()
            }
        }
        $("photo").style.cursor = "crosshair";
        if (b == "text") {
            $("photo").style.cursor = "text"
        }
        photoshop.flag = b;
        photoshop.markCurrentElement(a)
    },
    setDivStyle: function (a, c) {
        var b = $(photoshop.layerId);
        b.setAttribute("style", "");
        b.setAttribute("contentEditable", false);
        b.style.left = a + "px";
        b.style.top = c + "px";
        b.style.height = 0;
        b.style.width = 0;
        b.style.display = "block";
        switch (photoshop.flag) {
            case "rectangle":
            case "radiusRectangle":
            case "ellipse":
                photoshop.setHighLightMode();
                break;
            case "redact":
                photoshop.setBlackoutMode();
                break;
            case "text":
                photoshop.setTextMode();
                break;
            case "line":
            case "arrow":
                photoshop.drawLineOnMaskCanvas(a, c, a, c, "lineStart", photoshop.layerId);
                break;
            case "blur":
                photoshop.createCanvas(photoshop.layerId);
                break
        }
    },
    createDiv: function (c, d, b) {
        var a = document.createElement("div");
        a.id = d;
        if (b) {
            a.className = b
        }
        c.appendChild(a);
        return a
    },
    createCanvas: function (b) {
        photoshop.canvasId = "cav-" + b;
        if (!$(photoshop.canvasId)) {
            var a = document.createElement("canvas");
            a.id = photoshop.canvasId;
            a.width = 10;
            a.height = 10;
            $(photoshop.layerId).appendChild(a);
            return a
        }
        return $(photoshop.canvasId)
    },
    createLayer: function () {
        photoshop.lastValidAction++;
        photoshop.layerId = "layer" + photoshop.lastValidAction;
        if ($(photoshop.layerId)) {
            photoshop.removeElement(photoshop.layerId)
        }
        var a = document.createElement("div");
        a.id = photoshop.layerId;
        a.className = "layer";
        $("photo").appendChild(a);
        if (photoshop.flag == "blur") {
            photoshop.createCanvas(photoshop.layerId)
        }
        return a
    },
    removeLayer: function (b) {
        for (var a = 0; a < photoshop.markedArea.length; a++) {
            if (photoshop.markedArea[a].id == b) {
                photoshop.markedArea.splice(a, 1);
                break
            }
        }
        photoshop.removeElement(b)
    },
    createCropArea: function () {
        photoshop.marginLeft = $("photo").offsetLeft;
        photoshop.marginTop = $("photo").offsetTop;
        var d = $("crop_wrapper");
        d.style.width = photoshop.canvas.width + "px";
        d.style.height = photoshop.canvas.height + "px";
        d.style.display = "block";
        d.addEventListener("mousedown", photoshop.cropMouseDown, false);
        photoshop.createDiv(d, "dragshadow_t", "dragshadow");
        photoshop.createDiv(d, "dragshadow_b", "dragshadow");
        photoshop.createDiv(d, "dragshadow_l", "dragshadow");
        photoshop.createDiv(d, "dragshadow_r", "dragshadow");
        var e = photoshop.createDiv(d, "crop_container");
        var b = photoshop.createDiv(e, "crop_boundary");
        photoshop.createDiv(e, "drag_size");
        photoshop.createDiv(b, "dragline_t", "dragline");
        photoshop.createDiv(b, "dragline_d", "dragline");
        photoshop.createDiv(b, "dragline_l", "dragline");
        photoshop.createDiv(b, "dragline_r", "dragline");
        var c = photoshop.createDiv(e, "drag_cancel");
        c.innerHTML = "取消";
        c.addEventListener("mousedown",
        function (f) {
            photoshop.removeCropArea();
            photoshop.createCropArea();
            f.stopPropagation()
        },
        false);
        var a = photoshop.createDiv(e, "drag_crop");
        a.innerHTML = "确定";
        a.addEventListener("mousedown",
        function (f) {
            photoshop.crop();
            f.stopPropagation()
        },
        false)
    },
    removeChildrenEls: function (b) {
        var a = document.getElementById(b);
        while (a.firstChild) {
            a.removeChild(a.firstChild)
        }
    },
    removeCropArea: function () {
        $("crop_container").removeEventListener("dblclick",
        function () {
            photoshop.crop()
        });
        photoshop.removeChildrenEls("crop_wrapper");
        photoshop.isCropTurnOn = false
    },
    updateShadow: function (f, e, d, b) {
        $("dragshadow_t").style.height = e + "px";
        $("dragshadow_t").style.width = f + d + "px";
        $("dragshadow_l").style.height = photoshop.canvas.height - e + "px";
        $("dragshadow_l").style.width = f + "px";
        var c = e + b;
        c = c > 0 ? c : 0;
        var a = photoshop.canvas.width - f - d;
        a = a > 0 ? a : 0;
        $("dragshadow_r").style.height = c + "px";
        $("dragshadow_r").style.width = a + "px";
        c = photoshop.canvas.height - e - b;
        c = c > 0 ? c : 0;
        a = photoshop.canvas.width - f;
        a = a > 0 ? a : 0;
        $("dragshadow_b").style.height = c + "px";
        $("dragshadow_b").style.width = a + "px"
    },
    updateArea: function (e, d, b, a) {
        var c = $("crop_container");
        c.style.left = e + "px";
        c.style.top = d + "px";
        c.style.width = Math.abs(b) + "px";
        c.style.height = Math.abs(a) + "px"
    },
    updateSize: function (b, a) {
        $("drag_size").innerText = b + " x " + a
    },
    cropMouseDown: function (f) {
        if (f.button == 0 && photoshop.flag === "crop") {
            var c = function (l) {
                var i = l.pageX - b;
                var j = l.pageY - a;
                var k = photoshop.startX = (i > 0) ? b : b + i;
                var m = photoshop.startY = (j > 0) ? a : a + j;
                k -= photoshop.marginLeft;
                m -= photoshop.marginTop;
                i = Math.abs(i);
                j = Math.abs(j);
                photoshop.updateShadow(k, m, i, j);
                photoshop.updateArea(k, m, i, j);
                photoshop.updateSize(i, j);
                photoshop.endX = photoshop.startX + i;
                photoshop.endY = photoshop.startY + j;
                l.stopPropagation()
            };
            var d = function (j) {
                if ((j.pageX - b == 0 || j.pageY - a == 0) && $("crop_container").offsetWidth == 0) {
                    var i = photoshop.startX = b - h / 2;
                    var l = photoshop.startY = a - h / 2;
                    i -= photoshop.marginLeft;
                    l -= photoshop.marginTop;
                    photoshop.updateShadow(i, l, h, h);
                    photoshop.updateArea(i, l, h, h);
                    photoshop.updateSize(h, h);
                    photoshop.endX = photoshop.startX + h;
                    photoshop.endY = photoshop.startY + h
                }
                e.removeEventListener("mousedown", photoshop.cropMouseDown, false);
                e.removeEventListener("mousemove", c, false);
                e.removeEventListener("mouseup", d, false);
                var k = $("photo");
                if (photoshop.endY + 25 > k.offsetTop + k.clientHeight) {
                    $("drag_crop").style.bottom = "3px";
                    $("drag_cancel").style.bottom = "3px"
                } else {
                    $("drag_crop").style.bottom = "-28px";
                    $("drag_cancel").style.bottom = "-28px"
                }
                if (photoshop.startY - 22 < k.offsetTop) {
                    $("drag_size").style.top = "3px"
                } else {
                    $("drag_size").style.top = "-22px"
                }
                $("drag_size").style.display = "block";
                $("drag_cancel").style.display = "block";
                $("drag_crop").style.display = "block";
                photoshop.createDiv(g, "dragdot_tl", "dragdot").setAttribute("data-direct", "tl");
                photoshop.createDiv(g, "dragdot_tr", "dragdot").setAttribute("data-direct", "tr");
                photoshop.createDiv(g, "dragdot_br", "dragdot").setAttribute("data-direct", "br");
                photoshop.createDiv(g, "dragdot_bl", "dragdot").setAttribute("data-direct", "bl");
                photoshop.createDiv(g, "dragdot_mt", "dragdot").setAttribute("data-direct", "mt");
                photoshop.createDiv(g, "dragdot_mr", "dragdot").setAttribute("data-direct", "mr");
                photoshop.createDiv(g, "dragdot_mb", "dragdot").setAttribute("data-direct", "mb");
                photoshop.createDiv(g, "dragdot_ml", "dragdot").setAttribute("data-direct", "ml");
                photoshop.createDiv(g, "dragbar_t", "dragbar").setAttribute("data-direct", "mt");
                photoshop.createDiv(g, "dragbar_r", "dragbar").setAttribute("data-direct", "mr");
                photoshop.createDiv(g, "dragbar_b", "dragbar").setAttribute("data-direct", "mb");
                photoshop.createDiv(g, "dragbar_l", "dragbar").setAttribute("data-direct", "ml");
                $("crop_boundary").addEventListener("dblclick",
                function () {
                    photoshop.crop()
                },
                false);
                photoshop.isCropTurnOn = true;
                j.stopPropagation()
            };
            var h = 200;
            var b = f.pageX;
            var a = f.pageY;
            var e = $("crop_wrapper");
            var g = $("crop_container");
            photoshop.updateShadow(b, a, 0, 0);
            e.addEventListener("mousemove", c, false);
            e.addEventListener("mouseup", d, false);
            f.stopPropagation()
        }
    },
    cropDragMouseDown: function (a) {
        a.stopPropagation();
        var e = a.target;
        if (e) {
            var i = e.tagName;
            if (i && document) {
                photoshop.isMouseDown = true;
                var h = $("crop_container");
                var c = a.pageX;
                var f = a.pageY;
                var d = photoshop.direct = e.getAttribute("data-direct");
                if (h) {
                    var g = h.offsetLeft + photoshop.marginLeft;
                    var b = h.offsetTop + photoshop.marginTop;
                    if (e == $("crop_boundary")) {
                        photoshop.moving = true;
                        photoshop.moveX = c - h.offsetLeft;
                        photoshop.moveY = f - h.offsetTop
                    } else {
                        if (d == "tr") {
                            photoshop.resizing = true;
                            photoshop.startX = g;
                            photoshop.startY = b + h.clientHeight
                        } else {
                            if (d == "tl") {
                                photoshop.resizing = true;
                                photoshop.startX = g + h.clientWidth;
                                photoshop.startY = b + h.clientHeight
                            } else {
                                if (d == "br") {
                                    photoshop.resizing = true;
                                    photoshop.startX = g;
                                    photoshop.startY = b
                                } else {
                                    if (d == "bl") {
                                        photoshop.resizing = true;
                                        photoshop.startX = g + h.clientWidth;
                                        photoshop.startY = b
                                    } else {
                                        if (d == "mt") {
                                            photoshop.resizing = true;
                                            photoshop.startY = b + h.clientHeight
                                        } else {
                                            if (d == "mr") {
                                                photoshop.resizing = true;
                                                photoshop.startX = g
                                            } else {
                                                if (d == "mb") {
                                                    photoshop.resizing = true;
                                                    photoshop.startY = b
                                                } else {
                                                    if (d == "ml") {
                                                        photoshop.resizing = true;
                                                        photoshop.startX = g + h.clientWidth
                                                    } else {
                                                        photoshop.dragging = true;
                                                        photoshop.endX = photoshop.startX = c;
                                                        photoshop.endY = photoshop.startY = f
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                a.preventDefault()
            }
        }
    },
    cropDragMouseMove: function (b) {
        b.stopPropagation();
        var h = b.target;
        if (h && photoshop.isMouseDown) {
            var l = $("crop_container");
            if (l) {
                var d = b.pageX;
                var k = b.pageY;
                var f = 0;
                var g = 0;
                var q;
                var p;
                var n = photoshop.direct || null;
                if (photoshop.dragging || photoshop.resizing) {
                    var o = $("photo").offsetLeft;
                    var m = $("photo").offsetTop;
                    var e = o + photoshop.canvas.width;
                    var j = m + photoshop.canvas.height;
                    if (d > e) {
                        d = e
                    } else {
                        if (d < o) {
                            d = o
                        }
                    }
                    if (k > j) {
                        k = j
                    } else {
                        if (k < m) {
                            k = m
                        }
                    }
                    if (photoshop.dragging || (photoshop.resizing && ["tr", "tl", "br", "bl"].indexOf(n) != -1)) {
                        f = d - photoshop.startX;
                        g = k - photoshop.startY;
                        q = f > 0 ? photoshop.startX : d;
                        p = g > 0 ? photoshop.startY : k;
                        f = Math.abs(f);
                        g = Math.abs(g);
                        photoshop.endX = d;
                        photoshop.endY = k
                    } else {
                        if (photoshop.resizing && ["mt", "mr", "mb", "ml"].indexOf(n) != -1) {
                            if (n == "mt" || n == "mb") {
                                g = k - photoshop.startY;
                                q = photoshop.startX;
                                p = g > 0 ? photoshop.startY : k;
                                f = photoshop.endX - photoshop.startX;
                                g = Math.abs(g);
                                photoshop.endY = k
                            } else {
                                if (n == "mr" || n == "ml") {
                                    f = d - photoshop.startX;
                                    q = f > 0 ? photoshop.startX : d;
                                    p = photoshop.startY;
                                    f = Math.abs(f);
                                    g = photoshop.endY - photoshop.startY;
                                    photoshop.endX = d
                                }
                            }
                        }
                    }
                    q -= photoshop.marginLeft;
                    p -= photoshop.marginTop;
                    photoshop.updateShadow(q, p, f, g);
                    photoshop.updateArea(q, p, f, g);
                    photoshop.updateSize(f, g);
                    if (window.innerWidth < d) {
                        document.body.scrollLeft = d - window.innerWidth
                    }
                    if (document.body.scrollTop + window.innerHeight < k + 25) {
                        document.body.scrollTop = k - window.innerHeight + 25
                    }
                    if (k < document.body.scrollTop) {
                        document.body.scrollTop -= 25
                    }
                } else {
                    if (photoshop.moving) {
                        f = l.clientWidth;
                        g = l.clientHeight;
                        var a = d - photoshop.moveX;
                        var i = k - photoshop.moveY;
                        if (a < 0) {
                            a = 0
                        } else {
                            if (a + f > photoshop.canvas.width) {
                                a = photoshop.canvas.width - f
                            }
                        }
                        if (i < 0) {
                            i = 0
                        } else {
                            if (i + g > photoshop.canvas.height) {
                                i = photoshop.canvas.height - g
                            }
                        }
                        p = i;
                        photoshop.updateShadow(a, i, f, g);
                        photoshop.updateArea(a, i, f, g);
                        a += photoshop.marginLeft;
                        i += photoshop.marginTop;
                        photoshop.startX = a;
                        photoshop.endX = a + f;
                        photoshop.startY = i;
                        photoshop.endY = i + g
                    }
                }
                var c = $("photo");
                if (p + g + 25 > c.clientHeight) {
                    $("drag_crop").style.bottom = "3px";
                    $("drag_cancel").style.bottom = "3px"
                } else {
                    $("drag_crop").style.bottom = "-28px";
                    $("drag_cancel").style.bottom = "-28px"
                }
                if (p < 22) {
                    $("drag_size").style.top = "3px"
                } else {
                    $("drag_size").style.top = "-22px"
                }
            }
        }
    },
    cropDragMouseUp: function (b) {
        b.stopPropagation();
        photoshop.isMouseDown = false;
        if (b.button != 2) {
            photoshop.resizing = false;
            photoshop.dragging = false;
            photoshop.moving = false;
            photoshop.moveX = 0;
            photoshop.moveY = 0;
            var a;
            if (photoshop.endX < photoshop.startX) {
                a = photoshop.endX;
                photoshop.endX = photoshop.startX;
                photoshop.startX = a
            }
            if (photoshop.endY < photoshop.startY) {
                a = photoshop.endY;
                photoshop.endY = photoshop.startY;
                photoshop.startY = a
            }
        }
    },
    onMouseDown: function (a) {
        if (photoshop.flag === "crop") {
            if (photoshop.isCropTurnOn) {
                photoshop.cropDragMouseDown(a)
            }
            return
        }
        if (photoshop.flag === "text") {
            return
        }
        if (photoshop.isDraw && a.button != 2) {
            photoshop.startX = a.pageX - $("photo").offsetLeft;
            photoshop.startY = a.pageY - $("photo").offsetTop;
            photoshop.setDivStyle(photoshop.startX, photoshop.startY);
            photoshop.dragFlag = true
        }
    },
    onMouseMove: function (a) {
        if (photoshop.flag === "crop") {
            if (photoshop.isCropTurnOn) {
                photoshop.cropDragMouseMove(a)
            }
            return
        }
        if (photoshop.dragFlag) {
            $("mask_canvas").style.zIndex = 200;
            photoshop.endX = a.pageX - $("photo").offsetLeft;
            if (photoshop.endX > photoshop.canvas.width) {
                photoshop.endX = photoshop.canvas.width
            }
            if (photoshop.endX < 0) {
                photoshop.endX = 0
            }
            photoshop.endY = a.pageY - $("photo").offsetTop;
            if (photoshop.endY > photoshop.canvas.height) {
                photoshop.endY = photoshop.canvas.height
            }
            if (photoshop.endY < 0) {
                photoshop.endY = 0
            }
            photoshop.nowHeight = photoshop.endY - photoshop.startY - 1;
            photoshop.nowWidth = photoshop.endX - photoshop.startX - 1;
            if (photoshop.nowHeight < 0) {
                $(photoshop.layerId).style.top = photoshop.endY + "px";
                photoshop.nowHeight = -1 * photoshop.nowHeight
            }
            if (photoshop.nowWidth < 0) {
                $(photoshop.layerId).style.left = photoshop.endX + "px";
                photoshop.nowWidth = -1 * photoshop.nowWidth
            }
            $(photoshop.layerId).style.height = photoshop.nowHeight - 3 + "px";
            $(photoshop.layerId).style.width = photoshop.nowWidth - 3 + "px";
            if (photoshop.flag == "line" || photoshop.flag == "arrow") {
                photoshop.drawLineOnMaskCanvas(photoshop.startX, photoshop.startY, photoshop.endX, photoshop.endY, "lineDrawing", photoshop.layerId)
            } else {
                if (photoshop.flag == "blur") {
                    $(photoshop.layerId).style.height = photoshop.nowHeight + "px";
                    $(photoshop.layerId).style.width = photoshop.nowWidth + "px";
                    Canvas.blurImage(photoshop.canvas, $(photoshop.canvasId), photoshop.layerId, photoshop.startX, photoshop.startY, photoshop.endX, photoshop.endY)
                } else {
                    if (photoshop.flag == "ellipse") {
                        photoshop.drawEllipseOnMaskCanvas(photoshop.endX, photoshop.endY, "drawing", photoshop.layerId)
                    }
                }
            }
        }
        a.stopPropagation()
    },
    onMouseUp: function (a) {
        if (photoshop.flag === "crop") {
            if (photoshop.isCropTurnOn) {
                photoshop.cropDragMouseUp(a)
            }
            return
        }
        $("mask_canvas").style.zIndex = 10;
        photoshop.endX = a.pageX - $("photo").offsetLeft;
        photoshop.endY = a.pageY - $("photo").offsetTop;
        if (photoshop.flag == "text") {
            if (photoshop.endX > 0 && photoshop.endX < photoshop.canvas.width && photoshop.endY > 0 && photoshop.endY < photoshop.canvas.height) {
                photoshop.setDivStyle(photoshop.endX, photoshop.endY);
                photoshop.enableUndo();
                photoshop.saveAction({
                    type: "draw"
                },
                {
                    id: photoshop.layerId
                });
                photoshop.markedArea.push({
                    id: photoshop.layerId,
                    startX: photoshop.endX,
                    startY: photoshop.endY,
                    endX: photoshop.endX,
                    endY: photoshop.endY,
                    width: photoshop.nowWidth,
                    height: photoshop.nowHeight,
                    flag: photoshop.flag,
                    highlightType: photoshop.highlightType,
                    fontSize: localStorage.fontSize,
                    color: photoshop.color,
                    context: "",
                });
                $(photoshop.layerId).focus();
                photoshop.createLayer()
            }
            return a.stopPropagation()
        }
        if (photoshop.endX > photoshop.canvas.width) {
            photoshop.endX = photoshop.canvas.width
        }
        if (photoshop.endX < 0) {
            photoshop.endX = 0
        }
        if (photoshop.endY > photoshop.canvas.height) {
            photoshop.endY = photoshop.canvas.height
        }
        if (photoshop.endY < 0) {
            photoshop.endY = 0
        }
        if (photoshop.isDraw && photoshop.dragFlag && (photoshop.endX != photoshop.startX || photoshop.endY != photoshop.startY)) {
            if (photoshop.flag == "line" || photoshop.flag == "arrow") {
                photoshop.drawLineOnMaskCanvas(photoshop.startX, photoshop.startY, photoshop.endX, photoshop.endY, "drawEnd", photoshop.layerId)
            } else {
                if (photoshop.flag == "blur") {
                    Canvas.blurImage(photoshop.canvas, $(photoshop.canvasId), photoshop.layerId, photoshop.startX, photoshop.startY, photoshop.endX, photoshop.endY)
                } else {
                    if (photoshop.flag == "ellipse") {
                        photoshop.drawEllipseOnMaskCanvas(photoshop.endX, photoshop.endY, "end", photoshop.layerId)
                    }
                }
            }
            photoshop.enableUndo();
            photoshop.saveAction({
                type: "draw"
            },
            {
                id: photoshop.layerId
            });
            photoshop.markedArea.push({
                id: photoshop.layerId,
                startX: photoshop.startX,
                startY: photoshop.startY,
                endX: photoshop.endX,
                endY: photoshop.endY,
                width: photoshop.nowWidth,
                height: photoshop.nowHeight,
                flag: photoshop.flag,
                highlightType: photoshop.highlightType,
                fontSize: localStorage.fontSize,
                color: photoshop.color,
                context: "",
            });
            $(photoshop.layerId).focus();
            photoshop.createLayer()
        } else {
            if (photoshop.endX == photoshop.startX && photoshop.endY == photoshop.startY) {
                photoshop.removeElement(photoshop.layerId);
                photoshop.createLayer()
            }
        }
        photoshop.dragFlag = false;
        a.stopPropagation()
    },
    removeElement: function (a) {
        if ($(a)) {
            $(a).parentNode.removeChild($(a))
        }
    },
    draw: function () {
        var d = $("canvas").getContext("2d");
        for (var h = 0; h < photoshop.markedArea.length; h++) {
            var f = photoshop.markedArea[h];
            var m = (f.startX < f.endX) ? f.startX : f.endX;
            var l = (f.startY < f.endY) ? f.startY : f.endY;
            var c = f.width;
            var n = f.height;
            var g = f.color;
            switch (f.flag) {
                case "rectangle":
                    if (f.highlightType == "border") {
                        Canvas.drawStrokeRect(d, g, m, l, c, n, 2)
                    } else {
                        var g = changeColorToRgba(g, 0.5);
                        Canvas.drawFillRect(d, g, m, l, c, n)
                    }
                    break;
                case "radiusRectangle":
                    Canvas.drawRoundedRect(d, g, m, l, c, n, 6, f.highlightType);
                    break;
                case "ellipse":
                    m = (f.startX + f.endX) / 2;
                    l = (f.startY + f.endY) / 2;
                    var e = Math.abs(f.endX - f.startX) / 2;
                    var b = Math.abs(f.endY - f.startY) / 2;
                    Canvas.drawEllipse(d, g, m, l, e, b, 3, f.highlightType);
                    break;
                case "redact":
                    Canvas.drawFillRect(d, g, m, l, c, n);
                    break;
                case "text":
                    for (var k = 0; k < f.context.length; k++) {
                        Canvas.setText(d, f.context[k], g, f.fontSize + "px", "arial", f.fontSize, m, l + f.fontSize * k, c)
                    }
                    break;
                case "blur":
                    var a = d.getImageData(m, l, photoshop.markedArea[h].width, photoshop.markedArea[h].height);
                    a = Canvas.boxBlur(a, photoshop.markedArea[h].width, photoshop.markedArea[h].height, 10);
                    d.putImageData(a, m, l, 0, 0, photoshop.markedArea[h].width, photoshop.markedArea[h].height);
                    break;
                case "line":
                    Canvas.drawLine(d, g, "round", 2, f.startX, f.startY, f.endX, f.endY);
                    break;
                case "arrow":
                    Canvas.drawArrow(d, g, 2, 4, 10, "round", f.startX, f.startY, f.endX, f.endY);
                    break
            }
        }
    },
    crop: function () {
        var g = $("crop_container");
        var j = parseInt(g.style.left);
        var h = parseInt(g.style.top);
        var d = parseInt(g.style.width);
        var e = parseInt(g.style.height);
        var a = $("canvas").getContext("2d");
        var b = a.getImageData(j, h, d, e);
        var c = $$(".layer");
        c = Array.prototype.slice.call(c, 0, c.length - 1);
        for (var f = c.length - 1; f >= 0; f--) {
            c[f].style.left = parseInt(c[f].style.left) - j + "px";
            c[f].style.top = parseInt(c[f].style.top) - h + "px";
            photoshop.markedArea[f].startX -= j;
            photoshop.markedArea[f].endX -= j;
            photoshop.markedArea[f].startY -= h;
            photoshop.markedArea[f].endY -= h
        }
        photoshop.enableUndo();
        photoshop.saveAction({
            type: "crop"
        },
        {
            width: photoshop.canvas.width,
            height: photoshop.canvas.height,
            layers: c,
            offsetTop: h,
            offsetLeft: j
        });
        $("canvas").width = $("mask_canvas").width = photoshop.canvas.width = d;
        $("photo").style.width = d + "px";
        $("canvas").height = $("mask_canvas").height = photoshop.canvas.height = e;
        $("photo").style.height = e + "px";
        photoshop.setUnfilled();
        a.putImageData(b, 0, 0);
        a = photoshop.canvas.getContext("2d");
        a.putImageData(b, 0, 0);
        photoshop.removeCropArea();
        photoshop.createCropArea()
    },
    undo: function () {
        var b = function () {
            $("canvas").width = $("mask_canvas").width = photoshop.canvas.width = c.width;
            $("photo").style.width = c.width + "px";
            $("canvas").height = $("mask_canvas").height = photoshop.canvas.height = c.height;
            $("photo").style.height = c.height + "px";
            photoshop.setUnfilled();
            var h = c.data;
            $("canvas").getContext("2d").putImageData(h, 0, 0);
            photoshop.canvas.getContext("2d").putImageData(h, 0, 0);
            photoshop.marginLeft = $("photo").offsetLeft;
            photoshop.marginTop = $("photo").offsetTop;
            var j = $("crop_wrapper");
            j.style.width = c.width + "px";
            j.style.height = c.height + "px";
            var g = c.layers;
            var f = c.offsetTop;
            var e = c.offsetLeft;
            for (var d = g.length - 1; d >= 0; d--) {
                g[d].style.left = parseInt(g[d].style.left) + e + "px";
                g[d].style.top = parseInt(g[d].style.top) + f + "px";
                photoshop.markedArea[d].startX += e;
                photoshop.markedArea[d].endX += e;
                photoshop.markedArea[d].startY += f;
                photoshop.markedArea[d].endY += f
            }
            c = null
        };
        var a = photoshop.actions.length;
        var c = photoshop.actions.pop();
        if (a == 0) {
            return
        }
        if (a == 1) {
            photoshop.disableUndo()
        }
        switch (c.type) {
            case "draw":
                photoshop.removeLayer(c.id);
                break;
            case "crop":
                b();
                break
        }
    },
    enableUndo: function () {
        $("btn_undo").classList.remove("disabled")
    },
    disableUndo: function () {
        $("btn_undo").classList.add("disabled")
    },
    saveAction: function (e, b) {
        var d = $("canvas").getContext("2d");
        switch (e.type) {
            case "draw":
                photoshop.actions.push({
                    type:
                    "draw",
                    id: b.id
                });
                break;
            case "crop":
                var a = b.width;
                var c = b.height;
                photoshop.actions.push({
                    type: "crop",
                    data: d.getImageData(0, 0, a, c),
                    width: a,
                    height: c,
                    layers: b.layers,
                    offsetTop: b.offsetTop,
                    offsetLeft: b.offsetLeft
                });
                break
        }
    },
    getDataUrl: function () {
        photoshop.draw();
        var a;
        if (localStorage.screenshotFormat == "jpeg") {
            a = $("canvas").toDataURL("image/jpeg", 1)
        } else {
            a = $("canvas").toDataURL("image/png")
        }
        photoshop.finish();
        return a
    },
    drawLineOnMaskCanvas: function (g, f, l, k, i, e) {
        var m = $("mask_canvas").getContext("2d");
        m.clearRect(0, 0, $("mask_canvas").width, $("mask_canvas").height);
        if (i == "drawEnd") {
            var d = 20;
            var a = Math.abs(l - photoshop.startX) > 0 ? Math.abs(l - photoshop.startX) : 0;
            var j = Math.abs(k - photoshop.startY) > 0 ? Math.abs(k - photoshop.startY) : 0;
            var c = parseInt($(e).style.left);
            var b = parseInt($(e).style.top);
            g = g - c + d / 2;
            f = f - b + d / 2;
            l = l - c + d / 2;
            k = k - b + d / 2;
            $(e).style.left = c - d / 2 + "px";
            $(e).style.top = b - d / 2 + "px";
            var h = photoshop.createCanvas(e);
            h.width = a + d;
            h.height = j + d;
            m = h.getContext("2d")
        }
        if (localStorage.lineType == "line") {
            Canvas.drawLine(m, localStorage.color, "round", 2, g, f, l, k)
        } else {
            Canvas.drawArrow(m, localStorage.color, 2, 4, 10, "round", g, f, l, k)
        }
    },
    drawEllipseOnMaskCanvas: function (p, o, l, f) {
        var q = $("mask_canvas").getContext("2d");
        q.clearRect(0, 0, $("mask_canvas").width, $("mask_canvas").height);
        var n = (photoshop.startX + p) / 2;
        var m = (photoshop.startY + o) / 2;
        var c = Math.abs(p - photoshop.startX) / 2;
        var a = Math.abs(o - photoshop.startY) / 2;
        Canvas.drawEllipse(q, photoshop.color, n, m, c, a, 3, photoshop.highlightType);
        if (l == "end") {
            var d = parseInt($(f).style.left);
            var b = parseInt($(f).style.top);
            var i = photoshop.startX - d;
            var g = photoshop.startY - b;
            var j = photoshop.endX - d;
            var h = photoshop.endY - b;
            n = (i + j) / 2;
            m = (g + h) / 2;
            c = Math.abs(j - i) / 2;
            a = Math.abs(h - g) / 2;
            var k = photoshop.createCanvas(f);
            k.width = Math.abs(p - photoshop.startX);
            k.height = Math.abs(o - photoshop.startY);
            var e = k.getContext("2d");
            Canvas.drawEllipse(e, photoshop.color, n, m, c, a, 3, photoshop.highlightType);
            q.clearRect(0, 0, $("mask_canvas").width, $("mask_canvas").height)
        }
    },
    createColorPadEl: function (d) {
        var c = ["#000000", "#0036ff", "#008000", "#dacb23", "#d56400", "#c70000", "#be00b3", "#1e2188", "#0090ff", "#22cc01", "#ffff00", "#ff9600", "#ff0000", "#ff008e", "#7072c3", "#49d2ff", "#9dff3d", "#ffffff", "#ffbb59", "#ff6b6b", "#ff6bbd"];
        var e = document.createElement("div");
        e.id = "colorpad";
        for (var b = 0; b < c.length; b++) {
            var a = c[b];
            c[b] = document.createElement("a");
            c[b].setAttribute("title", a);
            c[b].style.backgroundColor = a;
            c[b].addEventListener("click",
            function (f) {
                photoshop.colorPadPick(f.target.title, d);
                f.stopPropagation()
            });
            e.appendChild(c[b])
        }
        return e
    },
    colorPadPick: function (a, b) {
        photoshop.color = a;
        localStorage.color = a;
        $("color_box").style.background = a
    },
    setFontSize: function (a) {
        localStorage.fontSize = a;
        $("size_12").className = "";
        $("size_14").className = "";
        $("size_18").className = "";
        $("size_24").className = "";
        $("size_" + a).className = "mark"
    },
    initTools: function () {
        $("btn_crop").addEventListener("click",
        function (c) {
            photoshop.toDo(this, "crop");
            c.stopPropagation()
        },
        false);
        $("btn_rectangle").addEventListener("click",
        function (c) {
            photoshop.toDo(this, "rectangle");
            c.stopPropagation()
        },
        false);
        $("btn_radius_rectangle").addEventListener("click",
        function (c) {
            photoshop.toDo(this, "radiusRectangle");
            c.stopPropagation()
        },
        false);
        $("btn_ellipse").addEventListener("click",
        function (c) {
            photoshop.toDo(this, "ellipse");
            c.stopPropagation()
        },
        false);
        $("btn_line").addEventListener("click",
        function (c) {
            localStorage.lineType = "line";
            photoshop.toDo(this, "line");
            c.stopPropagation()
        },
        false);
        $("btn_arrow").addEventListener("click",
        function (c) {
            localStorage.lineType = "arrow";
            photoshop.toDo(this, "arrow");
            c.stopPropagation()
        },
        false);
        $("btn_blur").addEventListener("click",
        function (c) {
            photoshop.toDo(this, "blur");
            c.stopPropagation()
        },
        false);
        $("btn_text").addEventListener("click",
        function (c) {
            photoshop.toDo(this, "text");
            c.stopPropagation()
        },
        false);
        $("btn_undo").addEventListener("click",
        function (c) {
            photoshop.undo();
            c.stopPropagation()
        },
        false);
        photoshop.toDo($("btn_rectangle"), "rectangle");
        var b = localStorage.fontSize || 14;
        if (b != 12 && b != 14 && b != 18 && b != 24) {
            b = 14
        }
        photoshop.setFontSize(b);
        $("size_12").addEventListener("click",
        function () {
            photoshop.setFontSize(12)
        },
        false);
        $("size_14").addEventListener("click",
        function () {
            photoshop.setFontSize(14)
        },
        false);
        $("size_18").addEventListener("click",
        function () {
            photoshop.setFontSize(18)
        },
        false);
        $("size_24").addEventListener("click",
        function () {
            photoshop.setFontSize(24)
        },
        false);
        $("colors_pad").appendChild(photoshop.createColorPadEl("colors"));
        var a = localStorage.color || "#FF0000";
        photoshop.colorPadPick(a);
        $("btn_text").addEventListener("mousedown",
        function (c) {
            c.stopPropagation()
        });
        $("btn_text").addEventListener("mousemove",
        function (c) {
            c.stopPropagation()
        });
        $("btn_text").addEventListener("mouseup",
        function (c) {
            c.stopPropagation()
        });
        $("btn_color").addEventListener("mousedown",
        function (c) {
            c.stopPropagation()
        });
        $("btn_color").addEventListener("mousemove",
        function (c) {
            c.stopPropagation()
        });
        $("btn_color").addEventListener("mouseup",
        function (c) {
            c.stopPropagation()
        })
    },
    initCanvas: function () {
        $("canvas").width = $("mask_canvas").width = photoshop.canvas.width = bg.screenshot.canvas.width;
        $("photo").style.width = bg.screenshot.canvas.width + "px";
        $("canvas").height = $("mask_canvas").height = photoshop.canvas.height = bg.screenshot.canvas.height;
        $("photo").style.height = bg.screenshot.canvas.height + "px";
        var a = photoshop.canvas.getContext("2d");
        a.drawImage(bg.screenshot.canvas, 0, 0);
        a = $("canvas").getContext("2d");
        a.drawImage(photoshop.canvas, 0, 0);
        $("canvas").style.display = "block"
    },
    init: function () {
        photoshop.initTools();
        photoshop.initCanvas();
        photoshop.tabTitle = bg.screenshot.tab.title;
        var a = function () {
            photoshop.setUnfilled();
            $("show_box").style.height = window.innerHeight - photoshop.offsetY - 1 + "px"
        };
        setTimeout(a, 50)
    }
};
window.addEventListener("load", function () {
    photoshop.init();
    $("photo").addEventListener("mousedown", photoshop.onMouseDown, false);
    $("photo").addEventListener("mousemove", photoshop.onMouseMove, false);
    $("photo").addEventListener("mouseup", photoshop.onMouseUp, false);
    document.querySelector("#pin_wrapper .box-title .close").addEventListener("click",
            function (event) {
                Page.closeDialog();
                event.preventDefault()
            });
    $("canvas").addEventListener("selectstart",
    function () {
        return false
    });
    $("mask_canvas").addEventListener("selectstart",
    function () {
        return false
    });
    setTimeout(function () {
        Page.showDialog();
    },
    100);
    var a = Mingdao.getUser();
    if (a) {
        UploadUI.showUser(a);
    } else {
        var token = Mingdao.getToken();
        if (token) {
            UploadUI.getUserInfo({ accessToken: token });
        }
    }
    
    $("btn_upload").addEventListener("click",
    function (d) {
        photoshop.draw();
        photoshop.finish();
        Page.showDialog();
        d.preventDefault()
    });
    $("btn_close").addEventListener("click",
    function (d) {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        },
        function (e) {
            chrome.tabs.remove(e[0].id)
        });
        d.preventDefault()
    });

    document.body.addEventListener("mousemove", photoshop.onMouseMove, false);
    document.body.addEventListener("mouseup", photoshop.onMouseUp, false);
});
