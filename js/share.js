window.addEventListener("load", function () {
    parent.photoshop.init();
    parent.$("photo").addEventListener("mousedown", parent.photoshop.onMouseDown, false);
    parent.$("photo").addEventListener("mousemove", parent.photoshop.onMouseMove, false);
    parent.$("photo").addEventListener("mouseup", parent.photoshop.onMouseUp, false);
    document.body.addEventListener("mousemove", parent.photoshop.onMouseMove, false);
    document.body.addEventListener("mouseup", parent.photoshop.onMouseUp, false);
    parent.$("canvas").addEventListener("selectstart",
    function () {
        return false
    });
    parent.$("mask_canvas").addEventListener("selectstart",
    function () {
        return false
    });
    setTimeout(function () {
        UploadUI.showDialog()
    },
    100);
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
        UploadUI.showUser(a);
        UploadUI.getBoards(a)
    }
    $("auth_btn").addEventListener("click",
    function (d) {
        UploadUI.showLoading();
        UploadUI.getAccessToken();
        d.preventDefault()
    });
    parent.$("btn_upload").addEventListener("click",
    function (d) {
        parent.photoshop.draw();
        if (localStorage.screenshotFormat == "jpeg") {
            c.src = parent.$("canvas").toDataURL("image/jpeg", 1)
        } else {
            c.src = parent.$("canvas").toDataURL("image/png")
        }
        UploadUI.showDialog();
        parent.photoshop.finish();
        d.preventDefault()
    });
    parent.$("btn_close").addEventListener("click",
    function (d) {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        },
        function (e) {
            chrome.tabs.remove(e[0].id)
        });
        d.preventDefault()
    })
});


//$(function () {
//    $('#ShareToMingdao').bind('click', function () {
//        var last = window.localStorage.getItem('last');
//        var data = JSON.parse(last);
//        if (data) {
//            var shareType = data.type;
//            if (shareType == 'link') {
//                var info = data.info;
//                var tab = data.tab;
//                var link = info.pageUrl;
//                var data = {
//                    msg: tab.title,
//                    title: tab.title,
//                    link: link
//                };

//                ShareLink(data, function () {

//                });
//            }
//        }
//    });
//});



//function GetToken(callback){
//    var token = window.localStorage.getItem('token');
//    callback(token);
//};

///*
//    分享链接
//*/
//function ShareLink(shareData, callback) {
//    var apiUrl = 'https://api.mingdao.com/post/update';
//    GetToken(function(token){
//        var data = {
//            access_token: token,
//            p_msg: shareData.msg,
//            p_type: 1,
//            l_title: shareData.title,
//            l_uri: shareData.link,
//            format:'json'
//        };
//        Post(apiUrl, data, function (result) {
//            var success = false;
//            if (result.post) {
//                success = true;
//            }
//            callback(success, result.post);
//        });
    
//    });




//}

///*
//    Post请求
//*/
//function Post(url, data, callback) {
//    var postData = new FormData();
//    for (var i in data) {
//        postData.append(i, data[i]);
//    }
//    var xhr = new XMLHttpRequest();
//    xhr.addEventListener('readystatechange', function (event) {
//        if (xhr.readyState == 4) {
//            if (xhr.status == 200) {
//                if (xhr.responseText.match(/error=/)) {
//                    callback(null);
//                } else {
//                    var result = JSON.parse(xhr.responseText);
//                    callback(result);
//                }
//            } else {
//                callback(null);
//            }
//        }
//    });
//    xhr.open('POST', url, true);
//    xhr.send(postData);
//}












