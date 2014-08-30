if (parent === top) {
    window.addEventListener("load", function () {

        // here you can put your code that will run only inside iframe

        document.body.addEventListener("mousemove", parent.photoshop.onMouseMove, false);
        document.body.addEventListener("mouseup", parent.photoshop.onMouseUp, false);
        var b = document.querySelector("#dialog-box .image-picker .carousel-clip");
        var c = new Image();
        if (localStorage.screenshotFormat == "jpeg") {
            c.src = parent.$("canvas").toDataURL("image/jpeg", 1)
        } else {
            c.src = parent.$("canvas").toDataURL("image/png")
        }
        b.appendChild(c);
        $("description").value = parent.bg.screenshot.page_info.text;
        $("url").value = parent.bg.screenshot.page_info.href;
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
}









