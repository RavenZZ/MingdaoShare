(function() {
    window.oauth2 = {
        scopes: [],

        /**
         * Starts the authorization process.
         */
        start: function() {
            //window.close();
            //var url = unescape(Request["authorize"]);
            var obj = window.dialogArguments;
            window.location = obj.authorize;
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
                window.close();
            };

            if(url.match(/\?error=(.+)/)) {
                removeTab();
            } else {
                var code = Request['code'];

                var that = this;
                var data = new FormData();
                data.append('app_Key', app_key);
                data.append('app_secret', app_secret);
                data.append('grant_type', response_type);
                data.append('code',code);
                data.append('redirect_uri', callbackUrl);
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
                                //window.returnValue = token;
                                Mingdao.setToken(token);
                                window.returnValue = token;
                                removeTab();
                            }
                        } else {
                            removeTab();
                        }
                    }
                });
                xhr.open('POST', access_token_url, true);
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
