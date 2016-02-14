"use strict";
var bg = chrome.extension && chrome.extension.getBackgroundPage && chrome.extension.getBackgroundPage();


window.addEventListener("load", function () {

    var pageData = Mingdao.getPageData();
    var data;
    if (pageData)
        data = JSON.parse(pageData);
    if(data){
        var url=window.shareUrl+"?";
        if(data.info.linkUrl){
            url+="url="+data.info.linkUrl;
        }else{
            url+="url="+data.info.pageUrl;
        }
        if(data.info.selectionText){
            url+="&title="+data.info.selectionText
        }else{
            url+="&title="+data.tab.title;
        }
        if(data.info.srcUrl){
            url+="&pic="+data.info.srcUrl;
        }
        url+="&appkey=932454786"
        location.href=url;
    }else{
        alert("没有捕获到网页内容");
    }
    return;
    var b = document.querySelector("#dialog-box .image-picker .carousel-clip");
    var imgPicker = document.querySelector("#dialog-box .image-picker");
    var doms = [document.querySelector("#dialog-box .pin-form"), $("loading"), $("authorization")];
    var pageData = Mingdao.getPageData();
    var data;
    if (pageData)
        data = JSON.parse(pageData);
    var ShowImage = function () {
        var c = new Image();
        var Canvas;
        try {
            Canvas = Mingdao.getCanvas() || parent.photoshop.getDataUrl();
        } catch (e) {

        }
        
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
            for (var i = 0, len = doms.length; i < len; i++) {
                var dom = doms[i];
                dom.style.marginLeft = "0px";
            }
        }

        var pageData = Mingdao.getPageData();
        var data;
        if (pageData)
            data = JSON.parse(pageData);
        if (data) {
            var data = JSON.parse(pageData);
            if (data.info.selectionText)
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
    }


    var mediaUrl = QueryString["media"];
    if (mediaUrl) {
        mediaUrl = unescape(mediaUrl);
        var linkUrl = unescape(QueryString["url"]);
        var width = QueryString["w"];
        var height = QueryString["h"];
        var description = unescape(QueryString["description"]);
        var data = {
            type: 'pic',
            info: { pageUrl: linkUrl },
            tab: { title: description, url: linkUrl }
        };
        Mingdao.setPageData(JSON.stringify(data));
        Mingdao.setCanvas(mediaUrl, function () {
            ShowImage();
        });
    } else {
        if (data && data.canvas) {
            Mingdao.setCanvas(data.info.srcUrl, ShowImage);
        } else { //链接
            Mingdao.setCanvas('',ShowImage);
        }
    }
});

var QueryString = function () {
    // This function is anonymous, is executed immediately and 
    // the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = pair[1];
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [query_string[pair[0]], pair[1]];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
            query_string[pair[0]].push(pair[1]);
        }
    }
    return query_string;
}();