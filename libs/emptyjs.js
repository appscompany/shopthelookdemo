(function () {

    /* Load Script function we may need to load jQuery from the Google's CDN */
    /* That code is world-reknown. */
    /* One source: http://snipplr.com/view/18756/loadscript/ */

    var loadScript = function (url, callback) {

        var script = document.createElement("script");
        script.type = "text/javascript";

        // If the browser is Internet Explorer.
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
            // For any other browser.
        } else {
            script.onload = function () {
                callback();
            };
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);

    };

    /* This is my app's JavaScript */
    var myAppJavaScript = function ($) {
        // $ in this scope references the jQuery object we'll use.
        // Don't use jQuery, or jQuery191, use the dollar sign.
        // Do this and do that, using $.

        var url = window.location.href;

        var nowtime = new Date();

        var domainname = window.location.hostname;
        var url = window.location.href;
        var originalurl = window.location.href.split('?')[0];
        var pathslist = originalurl.split('/');

        var laststring = pathslist[pathslist.length - 1];
        var productstring = pathslist[pathslist.length - 2];

        // Get parameter
        function getParameterByName(name, url) {
            if (!url) {
                url = window.location.href;
            }
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }

        // Resize Images
        function resizeImage(imageurl, size) {
            imageurl = imageurl.split('?')[0];
            var imageextension = imageurl.split('.').pop();
            if (imageextension == 'jpg') {
                imageurl = imageurl.replace('.jpg', '_' + size + 'x' + size + '.jpg');
            }

            if (imageextension == 'jpeg') {
                imageurl = imageurl.replace('.jpeg', '_' + size + 'x' + size + '.jpeg');
            }
            if (imageextension == 'png') {
                imageurl = imageurl.replace('.png', '_' + size + 'x' + size + '.png');
            }
            var convertedimage = imageurl;
            return convertedimage;
        }

        // RGB to Hexa Conversion
        var rgbToHex = function (rgb) {
            var hex = Number(rgb).toString(16);
            if (hex.length < 2) {
                hex = "0" + hex;
            }
            return hex;
        };

        var fullColorHex = function (r, g, b) {
            var red = rgbToHex(r);
            var green = rgbToHex(g);
            var blue = rgbToHex(b);
            return red + green + blue;
        };

        (function ($) {

            if (!$) {
                throw Error('jquery-parallel-ajax: jQuery not found');
            }

            var defalutOption = {
                type: 'GET',
                cache: true
            };

            var reqAmount = 0;
            var resList = {
                length: 0
            };
            var timeoutTimer = null;
            var timeoutDefault = 3000;

            function reqCallBackSuccess(idx, res, successCallback) {
                resList[idx] = res;
                resList.length++;
                if (resList.length === reqAmount) {
                    successCallback(resList);
                    clearTimeout(timeoutTimer);
                }
            }

            function reqCallBackError(idx, err, errorCallback) {
                if (resList.length === -1) {
                    return;
                }
                resList.length = -1;
                console.error('reqCallBackError', {
                    index: idx,
                    error: err
                });
                errorCallback(err);
                clearTimeout(timeoutTimer);
            }

            function parallelAjax(options, success, error, timeout) {
                var ajaxOptions = [];
                if (options instanceof Array) {
                    ajaxOptions = options;
                }
                else {
                    ajaxOptions.push(options);
                }
                // set ajax amount
                reqAmount = ajaxOptions.length;
                for (var i = 0; i < ajaxOptions.length; i++) {
                    (function (arg) {
                        // combine defalut option
                        $.extend(ajaxOptions[i], defalutOption);
                        // add success callback
                        ajaxOptions[i].success = function (res) {
                            reqCallBackSuccess(arg, res, success);
                        }
                        // add fail callback
                        ajaxOptions[i].error = function (err) {
                            reqCallBackError(arg, err, error);
                        }
                    })(i);
                }

                // do the reqests
                for (var i = 0; i < ajaxOptions.length; i++) {
                    $.ajax(ajaxOptions[i]);
                }

                // set timeout
                timeoutTimer = setTimeout(function () {
                    resList.length = -1;
                    error({ msg: 'timeout' });
                }, timeout || timeoutDefault);
            }

            $.extend({
                'parallelAjax': parallelAjax
            })
        })($);
        $.extend({
            getValues: function (url) {
                var result = null;
                $.ajax({
                    url: url,
                    type: 'get',
                    dataType: 'json',
                    async: false,
                    success: function (data) {
                        result = data;
                    }
                });
                return result;
            }
        });
      $(document).ready(function () {
        
      });
       

    };

    /* If jQuery has not yet been loaded or if it has but it's too old for our needs,
          we will load jQuery from the Google CDN, and when it's fully loaded, we will run
          our app's JavaScript. Set your own limits here, the sample's code below uses 1.9.1
          as the minimum version we are ready to use, and if the jQuery is older, we load 1.9.1 */
    if ((typeof jQuery === 'undefined') || (parseInt(jQuery.fn.jquery) === 1 && parseFloat(jQuery.fn.jquery.replace(/^1\./, "")) < 9.1)) {
        loadScript('//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', function () {
            jQuery191 = jQuery.noConflict(true);
            myAppJavaScript(jQuery191);
        });
    } else {
        myAppJavaScript(jQuery);
    }

})();
