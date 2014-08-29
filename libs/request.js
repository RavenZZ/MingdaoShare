////获取URL里的参数，返回一个参数数组
////调用方法如下
//var Request = GetRequest();
//var 参数1,参数2,参数N;
//参数1 = Request['参数1'];
//参数2 = Request['参数2'];
//参数N = Request['参数N'];  
function GetRequest() {
    var url = location.href;  //获取url中"?"符后的字串  
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substring(url.indexOf("?") + 1);
        str = str.replace(/#/g, "");
        if (url.indexOf("&") == -1) {
            theRequest[str.substring(0, str.indexOf("="))] = str.substring(str.indexOf("=") + 1);
        }
        else {
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].substring(0, strs[i].indexOf("="))] = strs[i].substring(strs[i].indexOf("=") + 1);
            }
        }

    } else if (url.indexOf("&") != -1) {
        var str = url.substring(url.indexOf("&") + 1);
        str = str.replace(/#/g, "");
        if (url.indexOf("&") == -1) {
            theRequest[str.substring(0, str.indexOf("="))] = str.substring(str.indexOf("=") + 1);
        }
        else {
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].substring(0, strs[i].indexOf("="))] = strs[i].substring(strs[i].indexOf("=") + 1);
            }
        }
    }
    return theRequest;
}
var Request = GetRequest();