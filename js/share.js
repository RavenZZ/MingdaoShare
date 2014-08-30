var last = window.localStorage.getItem('last');
var data = JSON.parse(last);
if (data) {
    var shareType = data.type;
    if (shareType == 'link') {
        var info = data.info;
        var tab = data.tab;
        var link = info.pageUrl;
        var data = {
            msg: tab.title,
            title: tab.title,
            link: link
        };

        ShareLink(data, function () {


        });
    }
 


}

function GetToken(callback){
    var token = window.localStorage.getItem('token');
    callback(token);
};

/*
    分享链接
*/
function ShareLink(shareData, callback) {
    var apiUrl = 'https://api.mingdao.com/post/update';
    GetToken(function(token){
        var data = {
            access_token: token,
            p_msg: shareData.msg,
            p_type: 1,
            l_title: shareData.title,
            l_uri: shareData.link,
            format:'json'
        };
        Post(apiUrl, data, function (result) {
            var success = false;
            if (result.post) {
                success = true;
            }
            callback(success, result.post);
        });
    
    });




}


function Post(url, data, callback) {
    var postData = new FormData();
    for (var i in data) {
        postData.append(i, data[i]);
    }

    var xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', function (event) {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                if (xhr.responseText.match(/error=/)) {
                    removeTab();
                } else {
                    var result = JSON.parse(xhr.responseText);
                    callback(result);
                }
            } else {
                removeTab();
            }
        }
    });
    xhr.open('POST', url, true);
    xhr.send(postData);
}












