"use strict";
window.addEventListener("load", function () {
    var b = document.querySelector("#dialog-box .image-picker .carousel-clip");
    var imgPicker = document.querySelector("#dialog-box .image-picker");
    var doms = [document.querySelector("#dialog-box .pin-form"), $("loading"), $("authorization")];
    var c = new Image();
    var Canvas = Mingdao.getCanvas();
    if (Canvas) {
        c.src = Canvas;
        b.appendChild(c);
        imgPicker.style.display = "block";
        for (var i = 0, len = doms.length; i < len; i++) {
            var dom = doms[i];
            dom.style.marginLeft = "190px";
        }
    } else {
        imgPicker.style.display = "none";
        for (var i = 0,len=doms.length; i < len; i++) {
            var dom=doms[i];
            dom.style.marginLeft="0px";
        }
    }
    
    var pageData = Mingdao.getPageData()
    if (pageData) {
        var data = JSON.parse(pageData);
        if(data.info.selectionText)
            $("description").value = data.info.selectionText;
        else
            $("description").value = data.tab.title;
        if (data.info.linkUrl) 
            $("url").value = data.info.linkUrl;
        else
            $("url").value = data.info.pageUrl;
    }
    var a = Mingdao.getUser();
    UploadUI.init(a);
    if (!a) {
        UploadUI.showAuth()
    } else {
        UploadUI.getBoards(a)
    }
    $("auth_btn").addEventListener("click",
    function (d) {
        UploadUI.showLoading();
        UploadUI.getAccessToken();
        d.preventDefault()
    });
});
