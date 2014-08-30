(function() {
    window.oauth2 = {

        access_token_url: "https://api.mingdao.com/oauth2/access_token",
        authorization_url: "https://api.mingdao.com/oauth2/authorize",
        client_id: "FC07433C4B74",
        client_secret: "501C8FA4F7E51BFCAE7EED783653150",
        redirect_url: chrome.extension.getURL('index.html'),
        grant_type:'authorization_code',
        scopes: [],

        key: "FC07433C4B74",

        /**
         * Starts the authorization process.
         */
        start: function() {
            //window.close();
            var url = this.authorization_url + "?client_id=" + this.client_id + "&redirect_uri=" + this.redirect_url + "&scopes=";
            for(var i in this.scopes) {
                url += this.scopes[i];
            }
            window.location = url;
            //chrome.tabs.create({url: url, active: true});
        },

        /**
         * Finishes the oauth2 process by exchanging the given authorization code for an
         * authorization token. The authroiztion token is saved to the browsers local storage.
         * If the redirect page does not return an authorization code or an error occures when 
         * exchanging the authorization code for an authorization token then the oauth2 process dies
         * and the authorization tab is closed.
         * 
         * @param url The url of the redirect page specified in the authorization request.
         */
        finish: function(url) {

            function removeTab() {
                chrome.tabs.getCurrent(function(tab) {
                    chrome.tabs.remove(tab.id);
                });
            };

            if(url.match(/\?error=(.+)/)) {
                removeTab();
            } else {
                var code = Request['code'];

                var that = this;
                var data = new FormData();
                data.append('app_Key', this.key);
                data.append('app_secret', this.client_secret);
                data.append('grant_type', this.grant_type);
                data.append('code',code);
                data.append('redirect_uri', this.redirect_url);
                data.append('format', 'json');

                // Send request for authorization token.
                var xhr = new XMLHttpRequest();
                xhr.addEventListener('readystatechange', function(event) {
                    if(xhr.readyState == 4) {
                        if(xhr.status == 200) {
                            if(xhr.responseText.match(/error=/)) {
                                removeTab();
                            } else {
                                var result = JSON.parse(xhr.responseText);
                                var token = result.access_token;// xhr.responseText.match(/access_token=([^&]*)/)[1];
                                window.localStorage.setItem('token', token);
                                window.location = '/share.html';
                                //removeTab();
                            }
                        } else {
                            removeTab();
                        }
                    }
                });
                xhr.open('POST', this.access_token_url, true);
                xhr.send(data);
            }
        },

        /**
         * Retreives the authorization token from local storage.
         *
         * @return Authorization token if it exists, null if not.
         */
        getToken: function() {
            return window.localStorage.getItem(this.key);
        },

        /**
         * Clears the authorization token from the local storage.
         */
        clearToken: function() {
            delete window.localStorage.removeItem(this.key);
        }
    }
})();
