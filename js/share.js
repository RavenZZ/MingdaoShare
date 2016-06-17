"use strict";
var bg = chrome.extension && chrome.extension.getBackgroundPage && chrome.extension.getBackgroundPage();
window.addEventListener('message',function(event) {
    console.log('received response:  ',event.data);
    debugger;
},false);
window.addEventListener("load", function () {
    var data;
    var mediaUrl = QueryString["media"];
    if (mediaUrl) {
        mediaUrl = decodeURIComponent (mediaUrl);
        var linkUrl = decodeURIComponent (QueryString["url"]);
        var width = QueryString["w"];
        var height = QueryString["h"];
        var description = decodeURIComponent (QueryString["description"]);
        var data = {
            type: 'img',
            info: {
                pageUrl: linkUrl,
                srcUrl:mediaUrl,
            },
            tab: { title: description, url: linkUrl }
        };
        Mingdao.setPageData(JSON.stringify(data));
    }
    if(!data){
        var pageData = Mingdao.getPageData();
        if (pageData)
            data = JSON.parse(pageData);
    }
    if(data){
        var url=window.shareUrl+"?";
        if(data.info.linkUrl){
            url+="url="+data.info.linkUrl.replace(/#(.)*/g,'');
        }else{
            url+="url="+data.info.pageUrl.replace(/#(.)*/g,'');
        }
        if(data.info.selectionText){
            url+="&title="+data.info.selectionText.substring(0,500);
        }else{
            url+="&title="+data.tab.title.substring(0,500);
        }
        if(data.info.srcUrl){
            url+="&pic="+data.info.srcUrl;
        }
        url+="&type="+data.type;
        url+="&appkey="+app_key;
        location.href=url;
    }else{
        alert("没有捕获到网页内容");
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