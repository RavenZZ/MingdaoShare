"use strict";
window.addEventListener("load", function () {
    var b = document.querySelector("#dialog-box .image-picker .carousel-clip");
    var c = new Image();
    var Canvas = Mingdao.getCanvas();
    if (Canvas) {
        c.src = Canvas;
    }
    b.appendChild(c);
    var pageData = Mingdao.getPageData()
    if (pageData) {
        var data = JSON.parse(pageData);
        $("description").value = data.tab.title;
        $("url").value = data.tab.url;
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
