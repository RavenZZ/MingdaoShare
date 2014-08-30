debugger;
if (window.localStorage.getItem('token') && window.localStorage.getItem('tokenTime')) {
    var token = window.localStorage.getItem('token');
    var time = window.localStorage.getItem('tokenTime');
    var tokenExpired = (+new Date - parseInt(time)) / 1000 / 60 / 60 > 8;//本地token有效期,8个小时
    if (tokenExpired) {
        window.oauth2.start();
    } else {
        window.location = '/share.html';
    }
} else {
    window.oauth2.start();
}
