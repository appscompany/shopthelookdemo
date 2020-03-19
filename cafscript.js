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
    //var nowtime = new Date();
    //$("head").append("<link rel='stylesheet' href='https://variantswatches.apphb.com/cafilterscss.css' type='text/css' media='screen'>");
    $("head").append("<script type='text/javascript' src='https://cdn.shopify.com/s/javascripts/currencies.js'></script>");
    //$('body').append("<link rel='stylesheet' type='text/css' href='https://variantswatches.apphb.com/cafilterandswatchappcss.css?datetime=" + nowtime + "'>");
    //$('head').append("<link rel='stylesheet' type='text/css' href='https://variantswatches.apphb.com/cafilterandswatchappcss.css'>");
    //$('head').append("<link rel='stylesheet' type='text/css' href='https://cdn.jsdelivr.net/npm/cafilter@1/index.css'>");
    // Parallel Ajax
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

      /* function _clearTimeout()
                                        {
                                          timeoutTimer = setTimeout(function(){
                                            resList.length = 0;            
                                            error({msg: 'timeout'});
                                          }, timeoutTimer || timeoutDefault);
                                        }*/
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
        resList = {
          length: 0
        };
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
    function resizeImages(imgsrc, size) {

      imgsrc = imgsrc.replace('_small', '');
      imgsrc = imgsrc.replace('_grande', '');
      imgsrc = imgsrc.replace('_medium', '');
      imgsrc = imgsrc.replace('_large', '');

      var imageextensionList = imgsrc.split('.');
      var imageextensionstring = imageextensionList[imageextensionList.length - 1];
      var imageextension = imageextensionstring.split('?')[0];

      if (imageextension == 'jpg') {
        imgsrc = imgsrc.replace('.jpg', '_' + size + 'x' + size + '.jpg');
      }
      if (imageextension == 'jpeg') {
        imgsrc = imgsrc.replace('.jpeg', '_' + size + 'x' + size + '.jpeg');
      }
      if (imageextension == 'png') {
        imgsrc = imgsrc.replace('.png', '_' + size + 'x' + size + '.png');
      }
      return imgsrc;

    }
    function ConvertToSingular(wordtoconvert) {
      var convertedword = wordtoconvert;
      if (wordtoconvert != '' && wordtoconvert != null) {
        var convertedword = wordtoconvert;
        var lastchar = convertedword[convertedword.length - 1];
        if (lastchar == 's') {
          convertedword = convertedword.substr(0, convertedword.length - 1);
          var _lastchar = convertedword[convertedword.length - 1];
          if (_lastchar == 's') {
            convertedword = convertedword.substr(0, convertedword.length - 1);
          }
        }
      }


      return convertedword;
    }
    Array.prototype.removeByVal = function (val) {
      for (var i = 0; i < this.length; i++) {
        if (this[i] === val) {
          this.splice(i, 1);
          i--;
        }
      }
      return this;
    }

    var url = window.location.href;
    var _pathslist = url.split('?')[0];
    var pathslist = _pathslist.split('/');
    var laststring = pathslist[pathslist.length - 1];

    var productstring = pathslist[pathslist.length - 2];

    var hamsters=function(e){var t={};function r(n){if(t[n])return t[n].exports;var a=t[n]={exports:{},id:n,loaded:!1};return e[n].call(a.exports,a,a.exports,r),a.loaded=!0,a.exports}return r.m=e,r.c=t,r.p="",r(0)}([function(e,t,r){e.exports=r(1)},function(e,t,r){"use strict";var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),a=f(r(2)),i=f(r(3)),o=f(r(6)),s=f(r(5)),u=(f(r(7)),f(r(8))),l=f(r(9));function f(e){return e&&e.__esModule?e:{default:e}}var h=new(function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.persistence=!0,this.memoize=!1,this.atomics=!1,this.debug=!1,this.version=a.default,this.maxThreads=i.default.logicalThreads,this.habitat=i.default,this.data=s.default,this.pool=o.default,this.logger=u.default,this.memoizer=l.default,this.run=this.hamstersRun,this.promise=this.hamstersPromise,this.init=this.initializeLibrary}return n(e,[{key:"initializeLibrary",value:function(e){this.logger.info("Preparing the hamster wheels & readying hamsters"),void 0!==e&&this.processStartOptions(e),o.default.spawnHamsters(this.persistence,o.default.selectHamsterWheel(),this.maxThreads),delete this.init}},{key:"processStartOptions",value:function(e){var t=["worker","sharedWorker","legacy"];for(var r in e)e.hasOwnProperty(r)&&(-1!==t.indexOf(r.toLowerCase())?this.habitat[r]=e[r]:this[r]=e[r])}},{key:"hamstersTask",value:function(e,t,r){this.id=r.pool.tasks.length,this.count=0,this.aggregate=e.aggregate||!1,this.output=[],this.workers=[],this.memoize=e.memoize||!1,this.dataType=e.dataType?e.dataType.toLowerCase():null,this.input=e,i.default.legacy?(this.threads=1,this.input.hamstersJob=t):(this.threads=e.threads||1,this.input.hamstersJob=r.data.prepareJob(t))}},{key:"hamstersPromise",value:function(e,t){var r=this;return new Promise(function(n,a){var i=new r.hamstersTask(e,t,r);r.pool.scheduleTask(i,r.persistence,r.maxThreads).then(function(e){n(e)}).catch(function(e){u.default.error(e.messsage,a)})})}},{key:"hamstersRun",value:function(e,t,r,n){var a=new this.hamstersTask(e,t,this),i=o.default.selectHamsterWheel();this.pool.scheduleTask(a,this.persistence,i,this.maxThreads).then(function(e){r(e)}).catch(function(e){u.default.error(e.messsage,n)})}}]),e}());void 0!==e&&void 0!==e.exports&&(e.exports=h)},function(e,t){"use strict";void 0!==e&&void 0!==e.exports&&(e.exports="5.0.0")},function(e,t,r){(function(t,n){"use strict";var a,i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},o=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),s=r(5),u=(a=s)&&a.__esModule?a:{default:a};var l=new(function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.browser=this.isBrowser(),this.webWorker=this.isWebWorker(),this.node=this.isNode(),this.reactNative=this.isReactNative(),this.shell=this.isShell(),this.transferrable=this.supportsTransferrableObjects(),this.legacy=this.isLegacyEnvironment(),this.atomics=this.supportsAtomicOperations(),this.proxies=this.supportsProxies(),this.isIE=this.isInternetExplorer,this.logicalThreads=this.determineGlobalThreads(),this.Worker=this.locateWorkerObject(),this.sharedWorker=this.locateSharedWorkerObject()}return o(e,[{key:"determineGlobalThreads",value:function(){var e=4;return"undefined"!=typeof navigator&&(void 0!==navigator.hardwareConcurrency&&(e=navigator.hardwareConcurrency),e>20&&-1!==navigator.userAgent.toLowerCase().indexOf("firefox")&&(e=20)),e}},{key:"locateWorkerObject",value:function(){return"undefined"!=typeof Worker?Worker:null}},{key:"locateSharedWorkerObject",value:function(){return"undefined"!=typeof SharedWorker?SharedWorker:null}},{key:"isBrowser",value:function(){return"object"===("undefined"==typeof window?"undefined":i(window))}},{key:"isInternetExplorer",value:function(e){return new RegExp("msie"+(isNaN(e)?"":"\\s"+e),"i").test(navigator.userAgent)}},{key:"isNode",value:function(){return"object"===(void 0===t?"undefined":i(t))&&!this.isBrowser()&&!this.isWebWorker()}},{key:"isWebWorker",value:function(){return"function"==typeof importScripts}},{key:"isReactNative",value:function(){return!this.isNode()&&"object"===(void 0===n?"undefined":i(n))}},{key:"isShell",value:function(){return this.isBrowser()&&!this.isNode()&&!this.isWebWorker()&&!this.isReactNative()}},{key:"isLegacyEnvironment",value:function(){if(this.isBrowser()&&!this.isReactNative()){var e=this.habitat.isIE(10),t=navigator.userAgent;(void 0===this.Worker||-1!==["Kindle/3.0","Mobile/8F190","IEMobile"].indexOf(t)||e)&&(this.legacy=!0)}if(this.webWorker&&void 0!==this.SharedWorker)try{var r=u.default.generateBlob();new this.SharedWorker(r,"SharedHamsterWheel");u.default.workerURI=r}catch(e){this.legacy=!0}if(!this.legacy)return this.isShell()||!this.locateWorkerObject()}},{key:"supportsTransferrableObjects",value:function(){return"undefined"!=typeof Uint8Array}},{key:"supportsAtomicOperations",value:function(){return"undefined"!=typeof SharedArrayBuffer}},{key:"supportsProxies",value:function(){return"undefined"!=typeof Proxy}}]),e}());void 0!==e&&void 0!==e.exports&&(e.exports=l)}).call(t,r(4),function(){return this}())},function(e,t){var r,n,a=e.exports={};function i(){throw new Error("setTimeout has not been defined")}function o(){throw new Error("clearTimeout has not been defined")}function s(e){if(r===setTimeout)return setTimeout(e,0);if((r===i||!r)&&setTimeout)return r=setTimeout,setTimeout(e,0);try{return r(e,0)}catch(t){try{return r.call(null,e,0)}catch(t){return r.call(this,e,0)}}}!function(){try{r="function"==typeof setTimeout?setTimeout:i}catch(e){r=i}try{n="function"==typeof clearTimeout?clearTimeout:o}catch(e){n=o}}();var u,l=[],f=!1,h=-1;function c(){f&&u&&(f=!1,u.length?l=u.concat(l):h=-1,l.length&&d())}function d(){if(!f){var e=s(c);f=!0;for(var t=l.length;t;){for(u=l,l=[];++h<t;)u&&u[h].run();h=-1,t=l.length}u=null,f=!1,function(e){if(n===clearTimeout)return clearTimeout(e);if((n===o||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(e);try{n(e)}catch(t){try{return n.call(null,e)}catch(t){return n.call(this,e)}}}(e)}}function p(e,t){this.fun=e,this.array=t}function y(){}a.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r];l.push(new p(e,t)),1!==l.length||f||s(d)},p.prototype.run=function(){this.fun.apply(null,this.array)},a.title="browser",a.browser=!0,a.env={},a.argv=[],a.version="",a.versions={},a.on=y,a.addListener=y,a.once=y,a.off=y,a.removeListener=y,a.removeAllListeners=y,a.emit=y,a.prependListener=y,a.prependOnceListener=y,a.listeners=function(e){return[]},a.binding=function(e){throw new Error("process.binding is not supported")},a.cwd=function(){return"/"},a.chdir=function(e){throw new Error("process.chdir is not supported")},a.umask=function(){return 0}},function(e,t,r){"use strict";var n,a=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),i=r(3),o=(n=i)&&n.__esModule?n:{default:n};var s=new(function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.randomArray=this.randomArray,this.aggregateArrays=this.aggregateThreadOutputs,this.splitArrays=this.splitArrayIntoSubArrays,this.createBlob=this.createDataBlob,this.generateBlob=this.generateWorkerBlob,this.processDataType=this.processDataType,this.sortOutput=this.sortArray,this.getOutput=this.prepareOutput,this.prepareJob=this.prepareFunction,this.feedHamster=this.messageWorker,this.prepareMeal=this.prepareHamsterFood,this.workerURI=null}return a(e,[{key:"prepareHamsterFood",value:function(e){var t=e.input;for(var r in e.input)e.input.hasOwnProperty(r)&&"array"!==r&&(t[r]=e.input[r]);return t.array=e.input.array,e.hamstersJob&&!t.hamstersJob&&(t.hamstersJob=hamstersJob),t}},{key:"messageWorker",value:function(e,t){return o.default.webWorker?e.port.postMessage(t):o.default.ie10?e.postMessage(t):e.postMessage(t,this.prepareTransferBuffers(t))}},{key:"prepareTransferBuffers",value:function(e){var t=[],r=null;if(o.default.transferrable)for(r in e)e.hasOwnProperty(r)&&e[r]&&(e[r].buffer?t.push(e[r].buffer):Array.isArray(e[r])&&"undefined"!=typeof ArrayBuffer&&t.push(new ArrayBuffer(e[r])));return t}},{key:"prepareFunction",value:function(e){if(!o.default.legacy&&(e=String(e),!o.default.webWorker)){var t=e.indexOf("{")+1,r=e.length-1;return e.substring(t,r)}return e}},{key:"generateWorkerBlob",value:function(e){var t="("+String(e)+")();",r=this.createBlob(t);return URL.createObjectURL(r)}},{key:"processDataType",value:function(e,t){return o.default.transferrable?this.typedArrayFromBuffer(e,t):t}},{key:"prepareOutput",value:function(e){return e.aggregate&&1!==e.threads?this.aggregateThreadOutputs(e.output,e.dataType):e.output}},{key:"sortArray",value:function(e,t){switch(t){case"desc":case"asc":return Array.prototype.sort.call(e,function(e,r){return"asc"===t?e-r:r-e});case"ascAlpha":return e.sort();case"descAlpha":return e.reverse();default:return e}}},{key:"typedArrayFromBuffer",value:function(e,t){var r={uint32:Uint32Array,uint16:Uint16Array,uint8:Uint8Array,uint8clamped:Uint8ClampedArray,int32:Int32Array,int16:Int16Array,int8:Int8Array,float32:Float32Array,float64:Float64Array};return r[e]?new r[e](t):e}},{key:"createDataBlob",value:function(e){if("undefined"==typeof Blob){var t=new(BlobBuilder||WebKitBlobBuilder||MozBlobBuilder||MSBlobBuilder);return t.append([e],{type:"application/javascript"}),t.getBlob()}return new Blob([e],{type:"application/javascript"})}},{key:"randomArray",value:function(e,t){for(var r=[];e>0;)r.push(Math.round(99*Math.random()+1)),e-=1;t(r)}},{key:"aggregateThreadOutputs",value:function(e,t){if(!t||!o.default.transferrable)return e.reduce(function(e,t){return e.concat(t)});for(var r=0,n=e.length,a=0;r<n;r+=1)a+=e[r].length;var i=this.processDataType(t,a),s=0;for(r=0;r<n;r+=1)i.set(e[r],s),s+=e[r].length;return i}},{key:"splitArrayIntoSubArrays",value:function(e,t){var r=0,n=[],a=Math.ceil(e.length/t);if(e.slice)for(;r<e.length;)n.push(e.slice(r,r+=a));else for(;r<e.length;)n.push(e.subarray(r,r+=a));return n}}]),e}());void 0!==e&&void 0!==e.exports&&(e.exports=s)},function(e,t,r){"use strict";var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),a=u(r(5)),i=u(r(3)),o=u(r(7)),s=u(r(8));function u(e){return e&&e.__esModule?e:{default:e}}var l=new(function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.tasks=[],this.threads=[],this.running=[],this.pending=[],this.fetchHamster=this.grabHamster,this.selectHamsterWheel=this.selectHamsterWheel}return n(e,[{key:"addWorkToPending",value:function(e,t,r,n,a,i){this.pending.push(arguments)}},{key:"processQueue",value:function(e){return this.runTask(e.array,e.task,e.persistence,e.wheel,e.resolve,e.reject)}},{key:"grabHamster",value:function(e,t,r){return t?this.threads[e]:this.spawnHamster(i.default,r,a.default.workerURI)}},{key:"keepTrackOfThread",value:function(e,t){e.workers.push(t),this.running.push(t)}},{key:"registerTask",value:function(e){var t=this.tasks.push(e);return this.tasks[t-1]}},{key:"spawnHamsters",value:function(e,t,r){var n=null;if(!i.default.legacy&&(i.default.browser&&(n=a.default.generateBlob(t)),e)){for(s.default.info(r+" Logical Threads Detected, Spawning "+r+" Hamsters");r>0;r--)this.threads.push(this.spawnHamster(t,n));s.default.info(this.threads.length+" hamsters ready and awaiting instructions")}}},{key:"spawnHamster",value:function(e,t){return i.default.ie10?new i.default.Worker(e):i.default.webWorker?new i.default.SharedWorker(t,"SharedHamsterWheel"):!i.default.node&&!i.default.reactNative||i.default.browser?new i.default.Worker(t):new i.default.Worker(e)}},{key:"prepareMeal",value:function(e,t){var r={array:e};for(var n in t.input)t.input.hasOwnProperty(n)&&-1==["array","threads"].indexOf(n)&&(r[n]=t.input[n]);return r}},{key:"runTask",value:function(e,t,r,n,o,s){var u=this.running.length,l=this.prepareMeal(e,t);if(this.registerTask(t.id),this.keepTrackOfThread(t,u),i.default.legacy)n(l,o,s);else{var f=this.grabHamster(u,r,n);this.trainHamster(u,t,f,r,o,s),a.default.feedHamster(f,l)}t.count+=1}},{key:"hamsterWheel",value:function(e,t,r,n,a,i){return this.maxThreads===this.running.length?this.addWorkToPending(e,t,r,n,a,i):this.runTask(e,t,r,n,a,i)}},{key:"returnOutputAndRemoveTask",value:function(e,t){var r=a.default.getOutput(e,i.default.transferrable);e.sort&&(r=a.default.sortOutput(r,e.sort)),this.tasks[e.id]=null,t({data:r})}},{key:"trainHamster",value:function(e,t,r,n,a,o){var u=this;function l(o){var s=o.data;u.running.splice(u.running.indexOf(e),1),t.workers.splice(t.workers.indexOf(e),1),t.output[e]=s.data,0===t.workers.length&&t.count===t.threads&&u.returnOutputAndRemoveTask(t,a),0!==u.pending.length&&u.processQueue(u.pending.shift()),n||i.default.webWorker||r.terminate()}function f(e){s.default.errorFromThread(e,o)}i.default.webWorker?(r.port.onmessage=l,r.port.onerror=f):(r.onmessage=l,r.onerror=f)}},{key:"selectHamsterWheel",value:function(){return i.default.legacy?o.default.legacy:i.default.webWorker?o.default.worker:o.default.regular}},{key:"scheduleTask",value:function(e,t,r,n){var i=this,o=[];return this.running.length===n?this.addWorkToPending(e,t,r,resolve,reject):(e.input.array&&1!==e.threads&&(o=a.default.splitArrays(e.input.array,e.threads)),new Promise(function(n,a){for(var s=0;s<e.threads;)o&&1!==e.threads?i.hamsterWheel(o[s],e,t,r,n,a):i.hamsterWheel(e.input.array,e,t,r,n,a),s+=1}))}}]),e}());void 0!==e&&void 0!==e.exports&&(e.exports=l)},function(module,exports,__webpack_require__){(function(global){"use strict";var _createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),_data=__webpack_require__(5),_data2=_interopRequireDefault(_data),_habitat=__webpack_require__(3),_habitat2=_interopRequireDefault(_habitat);function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var wheel=function(){function wheel(){_classCallCheck(this,wheel),this.worker=this.workerScaffold,this.regular=this.regularScaffold,this.legacy=this.legacyScaffold}return _createClass(wheel,[{key:"workerScaffold",value:function workerScaffold(){self.params={},self.rtn={},addEventListener("connect",function(incomingConnection){var port=incomingConnection.ports[0];port.start(),port.addEventListener("message",function(incomingMessage){params=incomingMessage.data,rtn={data:[],dataType:params.dataType,threadStart:Date.now()},eval("("+params.hamstersJob+")")(),rtn.threadEnd=Date.now(),port.postMessage(rtn)},!1)},!1)}},{key:"regularScaffold",value:function(){function e(e){var t=e.dataType;return t&&(e.data=function(e,t){var r={uint32:Uint32Array,uint16:Uint16Array,uint8:Uint8Array,uint8clamped:Uint8ClampedArray,int32:Int32Array,int16:Int16Array,int8:Int8Array,float32:Float32Array,float64:Float64Array};if(!r[e])return t;return new r[e](t)}(t,e.data)),e}self.params={},self.rtn={},addEventListener("message",function(t){params=t.data,rtn={threadStart:Date.now(),data:[],dataType:params.dataType?params.dataType.toLowerCase():null},new Function(params.hamstersJob)(),rtn.threadEnd=Date.now(),postMessage(e(rtn),function(e){var t=[],r=null;for(r in e)e.hasOwnProperty(r)&&e[r]&&(e[r].buffer?t.push(e[r].buffer):Array.isArray(e[r])&&"undefined"!=typeof ArrayBuffer&&t.push(new ArrayBuffer(e[r])));return t}(rtn))})}},{key:"legacyScaffold",value:function(e,t){var r=this;setTimeout(function(){var n=n||global||window||r;n.params=e,n.rtn={threadStart:Date.now(),data:[]},e.hamstersJob(),rtn.threadEnd=Date.now(),t(rtn)},4)}}]),wheel}(),hamstersWheel=new wheel;void 0!==module&&void 0!==module.exports&&(module.exports=hamstersWheel)}).call(exports,function(){return this}())},function(e,t,r){"use strict";var n,a=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),i=r(2),o=(n=i)&&n.__esModule?n:{default:n};var s=new(function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.logBook={error:[],warning:[],info:[]},this.info=this.infoLog,this.warning=this.warningLog,this.error=this.errorLog,this.errorFromThread=this.errorFromThread,this.saveLogEntry=this.saveToLogBook,this.getLogEntries=this.fetchLogBook,this.searchLogEntries=this.searchLogBook}return a(e,[{key:"infoLog",value:function(e){var t=Date.now(),r="Hamsters.js v"+o.default+" Info: "+e+" @ "+t;this.saveLogEntry("info",r),console.info(r)}},{key:"warningLog",value:function(e){var t=Date.now(),r="Hamsters.js v"+o.default+" Warning: "+e+" @ "+t;this.saveLogEntry("warning",r),console.warning(r)}},{key:"errorLog",value:function(e,t){var r=Date.now(),n="Hamsters.js v"+o.default+" Error: "+e+" @ "+r;if(this.saveLogEntry("error",n),console.error(n),!t)return n;t(n)}},{key:"errorFromThread",value:function(e,t){var r="#"+e.lineno+" in "+e.filename+": "+e.message;this.errorLog(r,t)}},{key:"saveToLogBook",value:function(e,t){this.logBook[e].push(t)}},{key:"fetchLogBook",value:function(e){return e?this.logBook[e]:this.logBook}},{key:"findStringInLogBook",value:function(e,t){for(var r=[],n=0;n<e.length;n++)-1!==e[n].indexOf(t)&&r.push(e[n]);return r}},{key:"findStringInLogBookAllTypes",value:function(e,t){var r=void 0,n=null;for(r in e)e.hasOwnProperty(r)&&(n=e[r],this.findStringInLogBook(n,t));return[]}},{key:"searchLogBook",value:function(e,t){var r=[];return{total:(r=t?this.findStringInLogBook(this.logBook[t],string):this.findStringInLogBookAllTypes(this.logBook)).length,results:r}}}]),e}());void 0!==e&&void 0!==e.exports&&(e.exports=s)},function(e,t){"use strict";var r=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}();var n=new(function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.maxCacheEntries=25,this.cacheEntries=[],this.itemCached=this.isItemCached,this.fetchItem=this.fetchItemFromCache,this.saveItem=this.saveItemToCache}return r(e,[{key:"isItemCached",value:function(e,t){return!!this.fetchItem({fn:t,data:e})||!1}},{key:"fetchItemFromCache",value:function(e){var t=null;for(var r in this.cache)this.cache.hasOwnProperty(r)&&e[r].fn===e.fn&&e[r].input===e.data&&(t=e[r].input);return t||!1}},{key:"saveItemToCache",value:function(e,t,r){var n={fn:e,input:t},a=this.cacheEntries;a.length<r?a.push(n):a.splice(0,0,n),this.cacheEntries=a}}]),e}());void 0!==e&&void 0!==e.exports&&(e.exports=n)}]);


      //return an array of objects according to key, value, or key and value matching
      function getObjects(obj, key, val) {
        var objects = [];
        for (var i in obj) {
          if (!obj.hasOwnProperty(i)) continue;
          if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
          } else
            //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
            if (i == key && obj[i] == val || i == key && val == '') { //
      objects.push(obj);
    } else if (obj[i] == val && key == '') {
      //only add if the object is not already in the array
      if (objects.lastIndexOf(obj) == -1) {
        objects.push(obj);
      }
    }
        }
        return objects;
      }
      //return an array of values that match on a certain key
      function getValues(obj, key) {
      var objects = [];
      for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
          objects = objects.concat(getValues(obj[i], key));
        } else if (i == key) {
          objects.push(obj[i]);
        }
      }
      return objects;
    }
      //return an array of keys that match on a certain value
      function getKeys(obj, val) {
        var objects = [];
        for (var i in obj) {
          if (!obj.hasOwnProperty(i)) continue;
          if (typeof obj[i] == 'object') {
            objects = objects.concat(getKeys(obj[i], val));
          } else if (obj[i] == val) {
            objects.push(i);
          }
        }
        return objects;
      }
      // Detect Mobile Devices
      !function (e) { var n = /iPhone/i, t = /iPod/i, r = /iPad/i, a = /\bAndroid(?:.+)Mobile\b/i, p = /Android/i, l = /\bAndroid(?:.+)SD4930UR\b/i, b = /\bAndroid(?:.+)(?:KF[A-Z]{2,4})\b/i, f = /Windows Phone/i, u = /\bWindows(?:.+)ARM\b/i, c = /BlackBerry/i, s = /BB10/i, v = /Opera Mini/i, h = /\b(CriOS|Chrome)(?:.+)Mobile/i, w = /\Mobile(?:.+)Firefox\b/i; function m(e, i) { return e.test(i) } function i(e) { var i = e || ("undefined" != typeof navigator ? navigator.userAgent : ""), o = i.split("[FBAN"); void 0 !== o[1] && (i = o[0]), void 0 !== (o = i.split("Twitter"))[1] && (i = o[0]); var d = { apple: { phone: m(n, i) && !m(f, i), ipod: m(t, i), tablet: !m(n, i) && m(r, i) && !m(f, i), device: (m(n, i) || m(t, i) || m(r, i)) && !m(f, i) }, amazon: { phone: m(l, i), tablet: !m(l, i) && m(b, i), device: m(l, i) || m(b, i) }, android: { phone: !m(f, i) && m(l, i) || !m(f, i) && m(a, i), tablet: !m(f, i) && !m(l, i) && !m(a, i) && (m(b, i) || m(p, i)), device: !m(f, i) && (m(l, i) || m(b, i) || m(a, i) || m(p, i)) }, windows: { phone: m(f, i), tablet: m(u, i), device: m(f, i) || m(u, i) }, other: { blackberry: m(c, i), blackberry10: m(s, i), opera: m(v, i), firefox: m(w, i), chrome: m(h, i), device: m(c, i) || m(s, i) || m(v, i) || m(w, i) || m(h, i) } }; return d.any = d.apple.device || d.android.device || d.windows.device || d.other.device, d.phone = d.apple.phone || d.android.phone || d.windows.phone, d.tablet = d.apple.tablet || d.android.tablet || d.windows.tablet, d } "undefined" != typeof module && module.exports && "undefined" == typeof window ? module.exports = i : "undefined" != typeof module && module.exports && "undefined" != typeof window ? module.exports = i() : "function" == typeof define && define.amd ? define([], e.isMobile = i()) : e.isMobile = i() }(this);
      var domainName = window.location.hostname;
      domainName = domainName.replace('www.', '');
      var _ismobiledevice = false;
      if (isMobile.android.device == true ||
          isMobile.windows.device == true ||
          isMobile.apple.device == true ||
          isMobile.amazon.device == true ||
          isMobile.other.device == true) {
        _ismobiledevice = true;
      }



      String.prototype.replaceAll = function (search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
      };

      function sortJson(element, prop, propType, asc) {
        switch (propType) {
          case "int":
            element = element.sort(function (a, b) {
              if (asc) {
                return (parseInt(a[prop]) > parseInt(b[prop])) ? 1 : ((parseInt(a[prop]) < parseInt(b[prop])) ? -1 : 0);
              } else {
                return (parseInt(b[prop]) > parseInt(a[prop])) ? 1 : ((parseInt(b[prop]) < parseInt(a[prop])) ? -1 : 0);
              }
            });
            break;
          default:
            element = element.sort(function (a, b) {
              if (asc) {
                return (a[prop].toLowerCase() > b[prop].toLowerCase()) ? 1 : ((a[prop].toLowerCase() < b[prop].toLowerCase()) ? -1 : 0);
              } else {
                return (b[prop].toLowerCase() > a[prop].toLowerCase()) ? 1 : ((b[prop].toLowerCase() < a[prop].toLowerCase()) ? -1 : 0);
              }
            });
        }
      }
      //Comparer Function  
      function GetSortOrderA(prop) {
        return function (a, b) {
          if (a[prop] > b[prop]) {
            return 1;
          } else if (a[prop] < b[prop]) {
            return -1;
          }
          return 0;
        }
      }
      function GetSortOrderD(prop) {
        return function (a, b) {
          if (a[prop] < b[prop]) {
            return 1;
          } else if (a[prop] > b[prop]) {
            return -1;
          }
          return 0;
        }
      }
      function GetSortOrderPrice_A(prop) {
        return function (a, b) {
          if (a[prop] > b[prop]) {
            return 1;
          } else if (a[prop] < b[prop]) {
            return -1;
          }
          return 0;
        }
      }
      function GetSortOrderPrice_D(prop) {
        return function (a, b) {
          if (a[prop] < b[prop]) {
            return 1;
          } else if (a[prop] > b[prop]) {
            return -1;
          }
          return 0;
        }
      }
    function unique(list) {
      var result = [];
      $.each(list, function (i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
      });
      return result;
    }
    var themeGridQuerySelectors = [];
             var _queryselector = '.grid--uniform';    
            var _gridselector = document.querySelectorAll(_queryselector)[0];


     if(url.includes('design_theme_id'))
     {
       console.log('THEME EDITOR');
       //$('#shopify-section-ca_cfiltershtml_section').show();
       var originalurl = window.location.href.split('?')[0];
       var pathslist = originalurl.split('/');

       var laststring = pathslist[pathslist.length - 1];
       var productstring = pathslist[pathslist.length - 2];
       //var _sortElement = document.getElementById('ca_filter_sortbydiv');
       //var _parentElement = _gridselector.parentElement; 

       var acc = document.getElementsByClassName("ca_filter_accordion");
       var i;

       for (i = 0; i < acc.length; i++) {
         acc[i].addEventListener("click", function() {
           this.classList.toggle("ca_filter_active");
           var panel = this.nextElementSibling;
           console.log(panel.style.maxHeight);
           if (panel.style.maxHeight){
             panel.style.maxHeight = null;
           } else {
             panel.style.maxHeight = panel.scrollHeight + "px";
           } 
         });
       }


       // Relocate filters location

       //var _filtertype = document.getElementById('ca_filter_typevalue').value;
       var _filtertype = 'Vertical';
       //var _viewmoreBtn = document.getElementById('ca_swatchy_filtery_viewmorebtndiv');
       var _filterElement = document.getElementById('ca_filterdiv');
       //$(_gridselector).after(_viewmoreBtn);
       var domainName = window.location.hostname;
       domainName = domainName.replace('www.', '');
       /*var _allproductscount = document.getElementById('ca_filters_productscount').value * 1;
       var _allproductscountindex = Math.ceil(_allproductscount /250);
       var _parallelajax_collection_urls_ = [];
       var _products_json;
       var _products_response = '';*/
       // $('#shopify-section-ca_cfiltershtml_section').show();
       /* if(_filtertype == 'Vertical')
       {
         $('#ca_filterdiv').show();
         //console.log(_queryselector);
         //console.log(_filterElement);
         var _gridselector = document.querySelector(_queryselector);

         _filterElement.style.width = '20%';
         _filterElement.style.float = 'left';
         _filterElement.style.display = 'block';
         _gridselector.style.width = '70%';
         _gridselector.style.float = 'right';       
         $(_gridselector).before(_filterElement);

       }

       if(_filtertype == 'Horizontal')
       {
         var _gridselector = document.querySelector(_queryselector);
         $(_gridselector).before(_filterElement);
       }*/
     }
      else
      {
        console.log('LIVE STORE');
      }
        var _filtertype = 'Vertical';
         var _queryselector = '.grid--uniform';
         window.actualjsonstring;


      //var _viewmorebtntext = document.getElementById('ca_filter_shownextbtntextinput').value;
      //var shopcurrency = Shopify.currency.active;
      //var currencysymbol = CurrencyMoneyFormats[shopcurrency].money_format;
      var _paginationElementDiv = '<button type="button" id="ca_swatchy_filtery_viewmorebtn" class="btn">' +
          //_viewmorebtntext +
          '</button>';
      var paginationElementDiv = document.createElement('button');
      paginationElementDiv.id = 'ca_swatchy_filtery_viewmorebtn';
      paginationElementDiv.className = 'btn';
      paginationElementDiv.type = 'button';
      //paginationElementDiv.innerHTML = _viewmorebtntext;
      //$('body').append(paginationElementDiv);

      var filteredcountInput = document.createElement('input');
      filteredcountInput.id = 'ca_filter_filteredproductscount';
      filteredcountInput.type = 'hidden';
      filteredcountInput.value = 0;
      $('body').append(filteredcountInput);

      var pagesHiddenInput = document.createElement('input');
      pagesHiddenInput.type = 'hidden';
      pagesHiddenInput.id = 'ca_swatchfilter_page';
      pagesHiddenInput.value = 0;
      pagesHiddenInput.setAttribute('data-cafilter-url', '');
      $('body').append(pagesHiddenInput);
      var getObjectByValue = function (array, key, value) {
        return array.filter(function (object) {
          return object[key] === value;
        });
      };
      // Sort Div
      var _weburl = window.location.href;
      var parameterCheck = getParameterByName('filerinstallation', _weburl);
      //console.log(parameterCheck);
      if (parameterCheck != '' && parameterCheck != null) {
        var filterinstallationDiv = document.createElement('div');
        filterinstallationDiv.id = 'ca_filter_installdiv';
        filterinstallationDiv.style.width = '100%';
        filterinstallationDiv.style.height = '100%';
        filterinstallationDiv.style.position = 'fixed';
        filterinstallationDiv.style.zIndex = 5;
        filterinstallationDiv.style.backgroundColor = '#000';
        filterinstallationDiv.style.top = '0px';
        filterinstallationDiv.style.left = '0px';
        filterinstallationDiv.style.bottom = '0px';
        filterinstallationDiv.style.right = '0px';
        $('body').append(filterinstallationDiv);

        var filterinstallloader = document.createElement('div');
        filterinstallloader.id = 'ca_filterinstallation_loader';
        filterinstallloader.className = 'loader';
        $('body').append(filterinstallloader);
      }

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

      var _isadmin = 'false';
      var adminiframe = document.getElementById('admin-bar-iframe');
      if (adminiframe != null) {
        _isadmin = true;
      }
      /// preview
      var previewiframe = document.getElementById('preview-bar-iframe');
      if (previewiframe != null) {
        _isadmin = true;
      }
      _isadmin = true;

      var appvariables = $.getValues('https://variantswatches.apphb.com/api/FilterAppVariables/GetVariables?DomainName=' + domainName + '&IsAdmin=' + _isadmin);
      //console.log(appvariables);

      var collectionjson = '';

      var _iscollectionpage = 'false';
      var _issearchpage = 'false';
      var _collectionname = '';
      var _url = window.location.href;
      var pathslist = _url.split('/');
      var lasttring = pathslist[pathslist.length - 1];
      var collectionstring = pathslist[pathslist.length - 2];
      var _collectionstring =  pathslist[pathslist.length - 3];

      $(document).ready(function () {
        $('body').append('<div id="ca_filterdiv"></div>');
        fetch('https://cdn.jsdelivr.net/gh/cupelapps/shopthelookdemo@latest/_tshirts.json')
        .then((response) => {
          return response.json();
        })
        .then((data) => {

          var _data = data.data;
          window.actualjsonstring = data;
          //console.log(window.actualjsonstring);
          //console.log(_data);
          //console.log(data[0].title);
          //var jsonString = JSON.stringify(data);
          //console.log(jsonString);
          //var encryptedjsonstring = CryptoJS.AES.encrypt(jsonString, "smss");
          /*var decryptedjsonstring = CryptoJS.AES.decrypt(_data, "smss");
          window.actualjsonstring = decryptedjsonstring.toString(CryptoJS.enc.Utf8);*/

          //console.log(decryptedjsonstring);
          //console.log(window.actualjsonstring);
          //document.getElementById('ca_encrypted_html').value = encryptedjsonstring;
          // var _filterElement = document.getElementById('shopify-section-ca_cfilters_section');



          var _filterElement = document.getElementById('ca_filterdiv');

          //$('#shopify-section-ca_cfilters_section').show();
          var _all_products_json = window.actualjsonstring;

          //var _all_products_json = JSON.parse(window.actualjsonstring);
          // Generate Filter Layout
          // var _filtertype = document.getElementById('ca_filter_type').value;
          var _filtertype = 'Vertical';
          //var _filtertitletext = document.getElementById('ca_filter_type').value;
          var _producttypes_Array = [];
          var _product_vendors_Array = [];
          var _productprices_Array_min = [];
          var _productprices_Array_max = [];
          //console.log(_all_products_json.length);

          for(var _f=0; _f<_all_products_json.length; _f++)
          {
            _producttypes_Array.push(_all_products_json[_f].type);
            _product_vendors_Array.push(_all_products_json[_f].vendor);
            _productprices_Array_min.push(_all_products_json[_f].minprice * 0.01);
            _productprices_Array_max.push(_all_products_json[_f].maxprice * 0.01);
            //console.log(_all_products_json[_f].type);
          }
          _producttypes_Array = unique(_producttypes_Array);
          _product_vendors_Array = unique(_product_vendors_Array);
          var _budget_min = Math.min.apply(null, _productprices_Array_min);
          var _budget_max = Math.max.apply(null, _productprices_Array_max);

          console.log(_filtertype);
          if(_filtertype == 'Vertical')
          {

            // Product Type
            var _producttypesting = '';
            for(var _t=0; _t<_producttypes_Array.length; _t++)
            {
              var _producttypesList = getKeys(_producttypes_Array, _producttypes_Array[_t]);
              _producttypesting = _producttypesting + '<li>' +
                '<label class="ca_filter_container">' + _producttypes_Array[_t] +  '(' + _producttypesList.length + ')' +
                '<input data-filtername="ca_filter_producttype" id="' + _producttypes_Array[_t] + '" name="' + _producttypes_Array[_t] + '" class="ca_filtery_checkbox" type="checkbox" value="' + _producttypes_Array[_t] + '">' +
                '<span class="ca_filter_checkmark"></span>' +
                '</label>';
              '</li>';

            }
            var _producttypeHTML = '<div id="ca_filter_producttype_container" class="ca_filter_div">' +
                '<button type="button" id="ca_filter_producttype_accordion" class="ca_filter_accordion"><h3 class="ca_filter_h3">Select Product Type</h3></button>' +
                '<div class="ca_filter_panel">' +
                '<ul>' + _producttypesting + '</ul></div></div>' + 
                '<input class="ca_filter_hiddeninput" type="hidden" name="ca_filtervalue_producttype" id="ca_filtervalue_producttype" value="" />';            

            // Product Vendor
            var _productvendorsting = '';
            for(var _t=0; _t<_product_vendors_Array.length; _t++)
            {
              var _productvendorsList = getKeys(_product_vendors_Array, _product_vendors_Array[_t]);
              _productvendorsting = _productvendorsting + '<li>' +
                '<label class="ca_filter_container">' + _product_vendors_Array[_t] +  '(' + _productvendorsList.length + ')' +
                '<input data-filtername="ca_filter_vendor" id="' + _product_vendors_Array[_t] + '" name="' + _product_vendors_Array[_t] + '" class="ca_filtery_checkbox" type="checkbox" value="' + _product_vendors_Array[_t] + '">' +
                '<span class="ca_filter_checkmark"></span>' +
                '</label>';
              '</li>'; 

            }
            var _productvendorHTML = '<div id="ca_filter_productvendor_container" class="ca_filter_div">' +
                '<button type="button" id="ca_filter_productvendor_accordion" class="ca_filter_accordion"><h3 class="ca_filter_h3">Select Vendor</h3></button>' +
                '<div class="ca_filter_panel">' +
                '<ul>' + _productvendorsting + '</ul></div></div>' + 
                '<input class="ca_filter_hiddeninput" type="hidden" name="ca_filtervalue_vendor" id="ca_filtervalue_vendor" value="" />';        
            // Budget Range
            var budgetarrayHTML = '<div class="range-slider"><span>from' +
                '<input style="float: left; width: 50%;" type="number" value="' + _budget_min + '" min="' + _budget_min + '" max="' + _budget_max + '"/>	to' +
                '<input style="float: right; width: 50%;" type="number" value="' + _budget_max + '" min="' + _budget_min + '" max="' + _budget_max + '"/></span>' +
                '<input value="' + _budget_min + '" min="' + _budget_min + '" max="' + _budget_max + '" step="1" type="range"/>' +
                '<input value="' + _budget_max + '" min="' + _budget_min + '" max="' + _budget_max + '" step="1" type="range"/>' +
                '<svg width="100%" height="24">' +
                '<line x1="4" y1="0" x2="300" y2="0" stroke="#444" stroke-width="12" stroke-dasharray="1 28"></line>' +
                '</svg>' +
                '</div>' + '<input type="hidden" name="ca_filtervalue_budget" id="ca_filtervalue_budget" value=""/>';
            var _budgetarrayHTML = '<div id="ca_filter_budget_container" class="ca_filter_div">' +
                '<button type="button" id="ca_filter_budget_accordion" class="ca_filter_accordion"><h3 class="ca_filter_h3">Price Range</h3></button>' +
                '<div class="ca_filter_panel" style="width: 100%;">' +
                '<div id="ca_filter_pricerangeboxes" style="height: 50px;">' +
                '<input style="width: 45%; float: left;" id="ca_filter_pricerangeboxmin" type="text" disabled="disabled" value="" />' +
                'to' +
                '<input style="width: 45%; float: right;" id="ca_filter_pricerangeboxmax" type="text" disabled="disabled" value="" />' +
                '</div>' +
                '<div id="slider-range"></div><div class="row slider-labels">' +
                '<div class="col-xs-6 caption">' +
                '<input type="hidden" id="ca_filter_pricerange_min" name="ca_filter_pricerange_min" value="" />' +            
                '</div>' +
                '<div class="col-xs-6 text-right caption">' +
                '<input type="hidden" id="ca_filter_pricerange_max" name="ca_filter_pricerange_max" value="" />' +           
                '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-sm-12">' +
                '<form>' +
                '<input type="hidden" name="min-value" value="">' +
                '<input type="hidden" name="max-value" value="">' +
                '</form>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<input class="ca_filter_hiddeninput" type="hidden" name="ca_filtervalue_budget" id="ca_filtervalue_budget" value="" />' +
                '<ul>' +      
                '</ul>' +
                '</div>';
               
            // Out of Stock
            var outofstockHTML = '<div id="ca_filter_budget_container" class="ca_filter_div">' +
                '<button type="button" id="ca_filter_budget_accordion" class="ca_filter_accordion"><h3 class="ca_filter_h3">Include Out of Stock Products</h3></button>' +
                '<div class="ca_filter_panel" style="width: 100%;">' +
                '<ul>' + 
                '<li>' +
                '<label class="ca_filter_container">' +
                '<input data-filtername="ca_filter_includeoutofstock" id="IncludeOutOfStockProducts" name="IncludeOutOfStockProducts" class="ca_filtery_checkbox" type="checkbox" value="Include Out Of Stock Products"> Include Out of Stock Products' +
                '<span class="ca_filter_checkmark"></span>' +
                '</label>' +
                '</li>' +
                '</ul>' +
                '</div>' + 
                '</div>';

            var _verticalfilterdiv = '<h1 id="ca_filtertitle"></h1>' + _producttypeHTML + _productvendorHTML + budgetarrayHTML + outofstockHTML;


            var filterdiv = document.getElementById('ca_filterdiv');
            filterdiv.innerHTML = _verticalfilterdiv;
            console.log(_verticalfilterdiv);
            var _filterElement = document.getElementById('ca_filterdiv');
            console.log(_filterElement);
            var _gridselector = document.querySelectorAll(_queryselector)[0];
            if(_filtertype == 'Vertical')
            {
              $('#ca_filterdiv').show();
              //console.log(_queryselector);
              //console.log(_filterElement);

              _filterElement.style.width = '20%';
              _filterElement.style.float = 'left';
              _filterElement.style.display = 'block';
              _gridselector.style.width = '70%';
              _gridselector.style.float = 'right';       
              $(_gridselector).before(_filterElement);

            }

            if(_filtertype == 'Horizontal')
            {
              var _gridselector = document.querySelector(_queryselector);
              $(_gridselector).before(_filterElement);
            }

            var acc = document.getElementsByClassName("ca_filter_accordion");
            var i;

            for (i = 0; i < acc.length; i++) {
              acc[i].addEventListener("click", function() {
                this.classList.toggle("ca_filter_active");
                var panel = this.nextElementSibling;
                console.log(panel.style.maxHeight);
                if (panel.style.maxHeight){
                  panel.style.maxHeight = null;
                } else {
                  panel.style.maxHeight = panel.scrollHeight + "px";
                } 
              });
            }
          }



          var _filterElement = document.getElementById('ca_filterdiv');
          if(_filtertype == 'Vertical')
          {
            $('#ca_filterdiv').show();
            //console.log(_queryselector);
            //console.log(_filterElement);
            var _gridselector = document.querySelector(_queryselector);

            _filterElement.style.width = '20%';
            _filterElement.style.float = 'left';
            _filterElement.style.display = 'block';
            _gridselector.style.width = '70%';
            _gridselector.style.float = 'right';
            //console.log(_gridselector);
            //console.log(_filterElement);
            $(_gridselector).before(_filterElement);

            // $('.ca_filters_skeletonbox').hide();

          }

          if(_filtertype == 'Horizontal')
          {
            var _gridselector = document.querySelectorAll(_queryselector)[0];

            //console.log(_gridselector);
            //_gridselector.style.width = '70%';
            //_gridselector.style.float = 'right';
            _filterElement.style.width = '100%';
            $('#ca_filterdiv').show();
            $(_gridselector).before(_filterElement);
          }

          var parent = document.querySelector(".range-slider");
          if(!parent) return;

          var rangeS = parent.querySelectorAll("input[type=range]"),
              numberS = parent.querySelectorAll("input[type=number]");

          rangeS.forEach(function(el) {
            el.oninput = function() {
              var slide1 = parseFloat(rangeS[0].value),
                  slide2 = parseFloat(rangeS[1].value);

              if (slide1 > slide2) {
                [slide1, slide2] = [slide2, slide1];
                // var tmp = slide2;
                // slide2 = slide1;
                // slide1 = tmp;
              }

              numberS[0].value = slide1;
              numberS[1].value = slide2;
            }
          });

          numberS.forEach(function(el) {
            el.oninput = function() {
              var number1 = parseFloat(numberS[0].value),
                  number2 = parseFloat(numberS[1].value);

              if (number1 > number2) {
                var tmp = number1;
                numberS[0].value = number2;
                numberS[1].value = tmp;
              }

              rangeS[0].value = number1;
              rangeS[1].value = number2;
              var _pricerangestring = number1 + ',' + number2;
              document.getElementById('ca_filtervalue_budget').value = _pricerangestring;

            }
          });

        });
        //console.log(window.actualjsonstring);
        /*var elem = document.querySelector('#collectionsgrid');
        var infScroll = new InfiniteScroll( elem, {
          // options
          path: '.pagination__next',
          append: '#collectionsgrid',
          history: 'replace',
        });

        // element argument can be a selector string
        //   for an individual element
        var infScroll = new InfiniteScroll( '#collectionsgrid', {
          // options
        });*/
        /*$('#collectionsgrid').infiniteScroll({
          // options
          path: '.pagination__next',
          append: '#collectionsgrid',
          history: false,
          checkLastPage: false
        });*/
        var startOptions = {
          maxThreads: 32,
          cache: true,
          debug: true,
          persistence: true,
          debug: 'verbose'
        };
        hamsters.init(startOptions);
        var CollectionFilterType = _filtertype;
        console.log(collectionstring);
        if (collectionstring == 'collections' || _collectionstring == 'collections') {

          //var collectionfiltertype = document.getElementById('ca_filter_typevalue').value;
          //CollectionFilterType = CollectionFilterType;
          //console.log(CollectionFilterType);
          /*var SearchFilterType = appvariables.Search_FilterType;*/
          /*var FilterValueInput = '<input type="hidden" class="ca_filter_hiddeninput" id="ca_filtervalue_producttype" name="ca_filtervalue_producttype" value="" />';
          var VendorInput = '<input type="hidden" class="ca_filter_hiddeninput" id="ca_filtervalue_vendor" name="ca_filtervalue_vendor" value="" />';
          var Option1Input = '<input type="hidden" class="ca_filter_hiddeninput" id="ca_filtervalue_option1" name="ca_filtervalue_option1" value="" />';
          var Option2Input = '<input type="hidden" class="ca_filter_hiddeninput" id="ca_filtervalue_option2" name="ca_filtervalue_option2" value="" />';
          var Option3Input = '<input type="hidden" class="ca_filter_hiddeninput" id="ca_filtervalue_option3" name="ca_filtervalue_option3" value="" />';
          var DiscountInput = '<input type="hidden" class="ca_filter_hiddeninput" id="ca_filtervalue_discount" name="ca_filtervalue_discount" value="" />';
          var BudgetInput = '<input type="hidden" class="ca_filter_hiddeninput" id="ca_filtervalue_budget" name="ca_filtervalue_budget" value="" />';
          $('body').append(FilterValueInput);
          $('body').append(VendorInput);
          $('body').append(Option1Input);
          $('body').append(Option2Input);
          $('body').append(Option3Input);
          $('body').append(DiscountInput);
          $('body').append(BudgetInput);*/
          //var FilterContainerDiv = '<div id="ca_filterdivcontainer">Filter Results</div>';
          var FilterDiv = '<div id="ca_filterdiv"></div>';
          var paginationDiv = '<div id="ca_filter_paginationdiv" class="ca_filter_pagination">' +
              _paginationElementDiv +
              '</div>';

          $('body').append(FilterDiv);
          var productscountinput = document.createElement('input');
          productscountinput.id = 'ca_filter_productscount';
          productscountinput.type = 'hidden';
          $('body').append(productscountinput);
          //$('body').append(paginationDiv);
          var productpagesListInput = document.createElement('input');
          productpagesListInput.id = 'ca_filtery_pageslist';
          productpagesListInput.type = 'hidden';
          productpagesListInput.value = '1';
          $('body').append(productpagesListInput);
          var displayedproductpagesListInput = document.createElement('input');
          displayedproductpagesListInput.id = 'ca_filtery_displayedpageslist';
          displayedproductpagesListInput.type = 'hidden';
          displayedproductpagesListInput.value = '1';
          $('body').append(displayedproductpagesListInput);
          var displayedproductcountInput = document.createElement('input');
          displayedproductcountInput.id = 'ca_filtery_displayedproductcountlist';
          displayedproductcountInput.type = 'hidden';
          displayedproductcountInput.value = '16';
          $('body').append(displayedproductcountInput);
          _iscollectionpage = 'true';
          var _lasttring = lasttring.split('?')[0];
          _collectionname = _lasttring;
          var _collectionjson = null;
          if(collectionstring == 'collections')
          {
            _collectionjson = $.getValues("https://" + window.location.hostname + "/collections/" + _collectionname + ".json");
          }
          else
          {
            _collectionname = pathslist[pathslist.length - 2];
            _collectionname = _collectionname.split('?')[0];
            _collectionjson = $.getValues("https://" + window.location.hostname + "/collections/" + _collectionname + ".json");
          }
          //console.log(_collectionjson);
          var _collection = _collectionjson.collection;
          document.getElementById('ca_filter_productscount').value = _collection.products_count;

          var searchproductsperpage = 0;

          //console.log(searchproductsperpage);


          var collectionProductsArray = [];
          var searchProductsArray = [];
          var ProductTypesArray = [];
          var VendorsArray = [];
          var Option1ValuesArray = [];
          var Option2ValuesArray = [];
          var Option3ValuesArray = [];
          var searchProductsArray = [];
          var buttonOptions = [];
          buttonOptions.push('Size');
          var ColorOptions = [];
          ColorOptions.push('Color');
          ColorOptions.push('Colour');
          ColorOptions.push('Fabric Color');
          var themename = Shopify.theme.name;
          var themestoreid = Shopify.theme.theme_store_id;
          var allatags = document.querySelectorAll('a');
          var paginationElement;
          var correctatags = [];
          for (var a = 0; a < allatags.length; a++) {
            var ahref = allatags[a].href;
            if (ahref.includes('products')) {
              correctatags.push(allatags[a]);
            }
          }

          var _allcollectionsArray = [];


        }




        if (productstring == 'collections' || laststring == 'search' || _collectionstring == 'collections') {
          //var paginationElements = document.querySelectorAll(appvariables.Search_PaginationElementQuerySelector);
          /*var paginationElements = document.querySelectorAll('.pagination');
          for (var p = 0; p < paginationElements.length; p++) {
            paginationElements[p].style.display = 'none';
          }*/
          var collectionHandle = laststring;
          if(collectionstring == 'collections')
          {
            collectionjson = $.getValues('https://' + window.location.hostname + '/collections/' + laststring + '.json');
            collectionHandle = laststring;
          }
          else
          {
            var _collectionname = productstring;
            collectionHandle = productstring;
            collectionjson = $.getValues('https://' + window.location.hostname + '/collections/' + _collectionname + '.json');

          }
          var _collectionjson = collectionjson.collection;

          var _collectionhandle = _collectionjson.handle;
          var _collectionid = _collectionjson.id;
          var _collectionproductsList = [];
          var _collectionallproductsList = [];
          var _collectionproductsnoofpages = 1;
          /*var settings = {
            "async": true,
            "crossDomain": true,
            //"url": "https://variantswatches.apphb.com/api/GetFilterMetafield/GetMetafield?DomainName=" + domainName + "&IsAdmin=true&CollectionId=" + _collectionid,
            "url": "https://" + window.location.hostname + "/collections/" + _collectionhandle + "?view=ca_metafieldsjson",
            "method": "GET",
            "headers": {
              "cache-control": "no-cache"
            }
          }

          $.ajax(settings).done(function (response) {
            //console.log(response);
            var ca_metafield = response;
            console.log(ca_metafield);
          });*/
          var ca_productscount = collectionjson.products_count;
          var ca_themename = appvariables.ThemeName;
          var ca_collection_handle = collectionjson.handle;
          var _totalproductsincollection = collectionjson.products_count;          //console.log(_totalproductsincollection);

          collectionHandle.split('?')[0];

          if(appvariables.Filter_IsActive == true) {
          }
          var allproductatagsinpage = document.querySelectorAll('a');
          var correctallproductatagsinpage = [];
          for (var t = 0; t < allproductatagsinpage.length; t++) {
            var ataghref = allproductatagsinpage[t].href;
            if (ataghref.includes('products')) {
              correctallproductatagsinpage.push(allproductatagsinpage[t]);
            }

          }
          var productsperpage = correctallproductatagsinpage.length;
          function GetSortOrder(prop) {
            return function (a, b) {
              if (a[prop] > b[prop]) {
                return 1;
              } else if (a[prop] < b[prop]) {
                return -1;
              }
              return 0;
            }
          }
          var loaderElementDiv = document.createElement('div');
          loaderElementDiv.id = 'ca_filter_loaderspinner';
          loaderElementDiv.style.display = 'none';
          $('body').append(loaderElementDiv);
          var themename = Shopify.theme.name;
          var Filter_GridQuerySelector = '.grid.grid--uniform.grid--view-items';
          if (_iscollectionpage == 'true') {
            var collectiondiv = document.querySelector(Filter_GridQuerySelector);
            //$(collectiondiv).before(paginationElement);
            //$(collectiondiv).after(paginationDiv);
            if (appvariables.Filter_PaginationElementQuerySelector != '') {
              var default_paginationElement = document.querySelector(appvariables.Filter_PaginationElementQuerySelector);
              if (default_paginationElement != null) {
                //default_paginationElement.style.display = 'none';
              }
            }



            var collectionproductscount = document.getElementById('ca_filter_productscount').value * 1;
            if (collectionproductscount > productsperpage) {
              // Enable Pagination
              //$('#ca_filter_paginationdiv').hide();
            }

          }

          if (_ismobiledevice == true) {
            var Filterbtn = document.createElement('button');
            Filterbtn.id = 'ca_filter_filterbtn';
            Filterbtn.innerHTML = 'Filter Results';
            Filterbtn.className = 'btn';
            Filterbtn.style.width = '95%';
            Filterbtn.style.margin = '10px';
            $('body').append(Filterbtn);

          }


          var gridSelector = document.querySelectorAll('.grid.grid--uniform.grid--view-items')[0];
          // Collection Filter Load
          // Search Filter Load
          var productsurl_Array = [];
          var collectionpageurl = window.location.href;
          collectionpageurl = collectionpageurl.split('?')[0];
          if (_iscollectionpage == 'true') {

          }
          var _searchedProducts;
          var themename = Shopify.theme.name;
          var filteredProductsArray = [];
          function FilterCollectionNew() {
            //console.log(_CollectionProductsArray);

          }
          function cartesianProduct(a) { // a = array of array
            var i, j, l, m, a1, o = [];
            if (!a || a.length == 0) return a;

            a1 = a.splice(0, 1)[0]; // the first array of a
            a = cartesianProduct(a);
            for (i = 0, l = a1.length; i < l; i++) {
              if (a && a.length) for (j = 0, m = a.length; j < m; j++)
                o.push([a1[i]].concat(a[j]));
              else
                o.push([a1[i]]);
            }
            return o;
          }
          var _selectedsortby = 'title-ascending';
          function _FilterCollectionProducts(filterpageno, sortby) {
            $('#ca_filterdiv').find('*').prop('disabled', true);
            var themename = Shopify.theme.name;
            var themestoreid = Shopify.theme.theme_store_id;
            $('#ca_filter_loaderspinner').show();
            var productsperpage = appvariables.Filter_ProductsPerPage;
            //console.log(productsperpage);
            //$('body').append(loadingdiv);
            var producttypevalues = document.getElementById('ca_filtervalue_producttype').value;
            var vendorvalues = document.getElementById('ca_filtervalue_vendor').value;
            var option1values = document.getElementById('ca_filtervalue_option1').value;
            var option2values = document.getElementById('ca_filtervalue_option2').value;
            var option3values = document.getElementById('ca_filtervalue_option3').value;
            var discountvalues = document.getElementById('ca_filtervalue_discount').value;
            var budgetvalues = document.getElementById('ca_filtervalue_budget').value;
            var _producttypevalues = [];
            if (producttypevalues != '') {
              _producttypevalues = producttypevalues.split(',');
            }
            var filterString = '';
            var _vendorvalues = [];
            if (vendorvalues != '') {
              _vendorvalues = vendorvalues.split(',');
            }
            var _optionvalues = [];
            var _optionvaluesList = [];
            var optioninputElements = document.querySelectorAll('.ca_filter_option_inputs');
            console.log(optioninputElements);
            for (var m = 0; m < optioninputElements.length; m++) {
              var optionvaluesstring = '';

              var optionName = optioninputElements[m].id;
              var _option_value = optioninputElements[m].value;
              var optionvaluesList = _option_value.split(',');
              for (var o = 0; o < optionvaluesList.length; o++) {
                if (optionvaluesList[o] != '') {
                  _optionvaluesList.push(optionvaluesList[o]);
                }

              }
              var _optionvaluesstring = '';
              if (_option_value != '') {
                _optionvaluesstring = optionName + '_' + optioninputElements[m].value;
                //_optionvaluesstring = optioninputElements[p].value;

              }
              if (_optionvaluesstring != '') {
                _optionvalues.push(_optionvaluesstring);
              }

            }

            var _discountvalues = [];
            if (discountvalues != '') {
              _discountvalues = discountvalues.split(',');
            }
            var _budgetvalues = [];
            if (budgetvalues != '') {
              _budgetvalues = budgetvalues.split(',');
            }

            var isProductTypeAvailable = false;
            var isProductVendorAvailable = false;
            var IsOptionsAvailable = false;
            var IsPriceRangeAvailable = false;
            var IsDiscountRangeAvailable = false;
            // var gridSelector = document.querySelectorAll(appvariables.Filter_GridQuerySelector)[0];
            //gridSelector.style.opacity = 0.3;
            //console.log(_producttypevalues);
            $('html, body').animate({
              scrollTop: $(gridSelector).offset().top
            }, 'slow');
            var filteredProducts = [];
            //console.log(_collectionallproductsList.length);
            //console.log(_collectionallproductsList);
            for (var v = 0; v < _collectionallproductsList.length; v++) {
              //var products = JSON.parse(_collectionallproductsList[v]);
              var products = _collectionallproductsList[v].products;
              //console.log(products);
              for (var p = 0; p < products.length; p++) {
                //var _variantsjson = products[p].variants;
                var _product_options_w_values = products[p].options;
                isProductTypeAvailable = false;
                isProductVendorAvailable = false;
                IsOptionsAvailable = false;
                IsPriceRangeAvailable = false;
                IsDiscountRangeAvailable = false;

                // Check Product Type
                if (_producttypevalues.length > 0) {
                  //console.log(_producttypevalues.includes(products[p].product_type));
                  if (_producttypevalues.includes(products[p].product_type) == true) {
                    isProductTypeAvailable = true;
                  }


                }
                else {
                  isProductTypeAvailable = true;
                }
                // Check Product Vendor
                if (_vendorvalues.length > 0) {
                  if (_vendorvalues.includes(products[p].vendor)) {
                    isProductVendorAvailable = true;
                  }

                }
                else {
                  isProductVendorAvailable = true;
                }

                // Check Options
                //console.log(_optionvaluesList);
                //var _optionValues = _optionvaluesList.split(',');

                var _isOptionAvailableList = [];
                var _isOptionAvailable = false;
                //console.log(_optionvalues);
                if (_optionvalues.length > 0) {

                  for (var b = 0; b < _optionvalues.length; b++) {
                    _isOptionAvailable = false;
                    //console.log(_optionvalues[b]);
                    var _optionName = _optionvalues[b].split('_')[0];
                    var _optionValues = _optionvalues[b].split('_')[1];
                    //console.log(_optionValues);
                    // var _productoptions = products[p].options;

                    if (_optionValues != undefined) {
                      var option_ValuesList = _optionValues.split(',');

                      for (var o = 0; o < option_ValuesList.length; o++) {

                        var _optionvalue = option_ValuesList[o].replace('-', ' ');

                        for(var _o=0; _o<_product_options_w_values.length; _o++)
                        {
                          var _option_values_list = _product_options_w_values[_o].values;
                          for(var _l=0; _l<_option_values_list.length; _l++)
                          {
                            if(_option_values_list[_l] == _optionvalue)
                            {
                              _isOptionAvailable = true;
                            }
                          }
                        }
                        /*var variantslist = getObjects(_variantsjson, 'option1', _optionvalue);
                          //console.log(variantslist);
                          //console.log(products[p].options);

                          //console.log(variantslist);
                          if (variantslist.length == 0) {
                            variantslist = getObjects(_variantsjson, 'option2', _optionvalue);
                            // console.log(variantslist);
                          }
                          else {
                            _isOptionAvailable = true;

                          }
                          if (variantslist.length == 0) {
                            variantslist = getObjects(_variantsjson, 'option3', _optionvalue);
                          }
                          else {
                            _isOptionAvailable = true;

                          }*/

                      }
                    }
                    else {
                      _isOptionAvailable = true;
                      _isOptionAvailableList.push(_isOptionAvailable);
                    }

                    //console.log(_isOptionAvailable);
                    _isOptionAvailableList.push(_isOptionAvailable);

                  }
                }
                else {
                  _isOptionAvailable = true;
                }

                //console.log(_isOptionAvailableList);

                var lengthofOptionsAvailableCount = _isOptionAvailableList.length;
                var _lengthofOptionsAvailableCount = 0;

                for (var n = 0; n < _isOptionAvailableList.length; n++) {
                  if (_isOptionAvailableList[n] == true) {
                    _lengthofOptionsAvailableCount = _lengthofOptionsAvailableCount + 1;
                  }
                }
                if (_lengthofOptionsAvailableCount == lengthofOptionsAvailableCount) {
                  IsOptionsAvailable = true;
                }
                else {
                  IsOptionsAvailable = false;
                }

                // Check Discount
                var discountp = products[p].discountp;
                //console.log(_discountvalues);
                if (_discountvalues.length > 0) {
                  for (var d = 0; d < _discountvalues.length; d++) {

                    if (_discountvalues[d] == 'Under25') {
                      if (discountp <= 25) {
                        IsDiscountRangeAvailable = true;
                      }
                    }
                    if (_discountvalues[d] == '26-50') {
                      if (discountp > 25 && discountp <= 50) {
                        IsDiscountRangeAvailable = true;
                      }
                    }
                    if (_discountvalues[d] == '51-75') {
                      if (discountp > 50 && discountp <= 75) {
                        IsDiscountRangeAvailable = true;
                      }
                    }
                    if (_discountvalues[d] == 'Above75') {
                      if (discountp > 75) {
                        IsDiscountRangeAvailable = true;
                      }
                    }
                  }
                }
                else {
                  IsDiscountRangeAvailable = true;
                }
                // Check Price Range
                var _minprice = products[p].minprice;
                //console.log(_budgetvalues);
                if (_budgetvalues.length > 0) {
                  for (var b = 0; b < _budgetvalues.length; b++) {
                    var pricestring = _budgetvalues[b];
                    var minprice = pricestring.split('_')[0];
                    var maxprice = pricestring.split('_')[1];
                    if (_minprice >= minprice && _minprice <= maxprice) {
                      IsPriceRangeAvailable = true;
                    }
                  }
                }
                else {
                  IsPriceRangeAvailable = true;
                }
                //console.info(isProductTypeAvailable, isProductVendorAvailable, IsOptionsAvailable, IsPriceRangeAvailable, IsDiscountRangeAvailable);
                if (isProductTypeAvailable == true && isProductVendorAvailable == true &&
                    IsOptionsAvailable == true && IsPriceRangeAvailable == true &&
                    IsDiscountRangeAvailable == true) {
                  filteredProducts.push(products[p]);
                }
              }

            }
            //console.log(filteredProducts);
            document.getElementById('ca_filter_filteredproductscount').value = filteredProducts.length;
            if (filteredProducts.length <= 20) {
              $('#ca_filter_show_next_btn').hide();
            }
            // Sorting
            var sortElement = document.getElementById('ca_filter_sortbyselect');
            //var sortby = sortElement.value;
            sortby = 'title-ascending';
            var _filteredProducts;
            if (sortby == 'title-ascending') {
              _filteredProducts = filteredProducts.sort(GetSortOrderA("title"));
            }
            if (sortby == 'title-descending') {
              _filteredProducts = filteredProducts.sort(GetSortOrderD("title"));
            }
            if (sortby == 'best-selling') {
              _filteredProducts = filteredProducts;
            }
            if (sortby == 'price-ascending') {
              _filteredProducts = filteredProducts.sort(function (a, b) { return a.minprice - b.minprice });
              //_filteredProducts = filteredProducts.sort(GetSortOrderPrice_A("minprice"));
            }
            if (sortby == 'price-descending') {
              _filteredProducts = filteredProducts.sort(function (a, b) { return b.minprice - a.minprice });
              //_filteredProducts = filteredProducts.sort(GetSortOrderPrice_D("minprice"));
            }
            console.log(_filteredProducts);
            var first20products = _filteredProducts.slice(0, 20);
            var producthandlesstring = '';
            if (first20products.length > 0) {
              for (var f = 0; f < first20products.length; f++) {
                if (producthandlesstring == '') {
                  producthandlesstring = first20products[f].handle;
                }
                else {
                  producthandlesstring = producthandlesstring + ',' + first20products[f].handle;
                }
              }

              var producttypevalues = document.getElementById('ca_filtervalue_producttype').value;
              var vendorvalues = document.getElementById('ca_filtervalue_vendor').value;
              var option1values = document.getElementById('ca_filtervalue_option1').value;
              var option2values = document.getElementById('ca_filtervalue_option2').value;
              var option3values = document.getElementById('ca_filtervalue_option3').value;
              var discountvalues = document.getElementById('ca_filtervalue_discount').value;
              var budgetvalues = document.getElementById('ca_filtervalue_budget').value;

              //console.log(_filteredProducts);
              console.log(producttypevalues.toString());
              var _producttypevaluesstring = producttypevalues.toString().replace(',', ' OR ');
              console.log(_producttypevaluesstring);
              var _vendorvaluesstring = '';
              var _optionvaluesstring = '';
              var _discountvaluesstring = '';
              var _producttypevaluesstring = '';
              var _budgetvaluesstring = '';
              console.log(_producttypevaluesstring);

              /*var _my_Search_Request = 'https://' + domainName + '/search?q=' + producttypevalues + '&view=json250';
              var myRequest = collectionpageurl + '?sort_by=' + sortby + '&page=1' + '?products=' + producthandlesstring;
              console.log(_my_Search_Request);

              var _filter_settings = {
                "async": true,
                "crossDomain": true,
                "url": _my_Search_Request,
                "method": "GET",
                "headers": {
                  "Content-Type": "application/json",
                  "cache-control": "no-cache"
                },
                "processData": false

              }

              $.ajax(_filter_settings).done(function (response) {
                console.log(response);
                var _searchedResults = JSON.parse(response);
                console.log(_searchedResults[0].handle);
                var _searchedhandlesstring = '';
                for(var _v=0; _v<_searchedResults.length; _v++)
                {
                  if(_searchedhandlesstring == '')
                  {
                    _searchedhandlesstring = _searchedResults[_v].handle;
                  }
                  else
                  {
                    _searchedhandlesstring = _searchedhandlesstring + ',' + _searchedResults[_v].handle;
                  }
                }


                var _filteredurl = 'https://' + domainName + '/collections/' + laststring + '?sort_by=best-selling&page=1?products=' + _searchedhandlesstring;
                window.location = _filteredurl;
              });*/

              //$("#collectionsgrid").load("https://shopthelookdemo.myshopify.com/collections/tops?sort_by=best-selling&page=1?products=" + producthandlesstring +" #collectionsgrid>*","");
              //gridSelector.style.opacity = 1;
              $('#ca_filter_loaderspinner').hide();
              var _producthandlesString = '';
              for(f=0; f<_filteredProducts.length; f++)
              {
                if(_producthandlesString == '')
                {
                  _producthandlesString = _filteredProducts[f].handle;
                }
                else
                {
                  _producthandlesString = _producthandlesString + ',' + _filteredProducts[f].handle;
                }
              }
              /*var settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://shopthelookdemo.myshopify.com/collections/t-shirts?view=cafiltersjson&page=1",
                "method": "GET",
                "headers": {
                  "cache-control": "no-cache"
                }
              }

              $.ajax(settings).done(function (response) {
                console.log(response);
                var _productslist = JSON.parse(response);
                console.log(_productslist);
              });*/
              // Displaying Products using URL
              var _urltoload = 'https://' + domainName + '/collections/' + laststring + '?sort_by=best-selling&page=1?products=' + _producthandlesString;
              //window.location = _urltoload;

              // Displaying Products using JS
              /*var _productGridString = '';
                  for(var _p=0; _p<_filteredProducts.length; _p++)
                  {
                    var _producturl = 'https://' + window.location.hostname + '/collections/' + laststring + '/products/' + _filteredProducts[_p].handle;
                    var _singleproductgridstring = '<a href="' + _producturl + '" class="product-card">' +
                      '<div class="product-image">' +
                      '<img src="' + _filteredProducts[_p].images[0].src + '">' +
                      '</div>' +
                      '<div class="product-info">' +
                      '<h5>' + _filteredProducts[_p].title + '</h5>' +
                      '<h6>$' + _filteredProducts[_p].variants[0].price + '</h6>' +
                      '</div>' +
                        '<div id="ca_filter_wishlist" class="ca_filter_wishlist">&#9825; &#x2764;</div>' +
                        '<span class="shopify-product-reviews-badge" data-id="' + filteredProducts[_p].id + '"></span>' +
                      '</a>';
                    if(_productGridString == '')
                    {
                      _productGridString = _singleproductgridstring;
                    }
                    else
                    {
                      _productGridString = _productGridString + _singleproductgridstring;
                    }
                  }
                  if(gridSelector.className == '')
                  {
                    gridSelector.className = 'products'; 
                  }
                  else
                  {
                    gridSelector.className = gridSelector.className + ' products'; 
                  }
                  gridSelector.innerHTML = _productGridString;
                  gridSelector.style.opacity = 1;
                  $('#ca_filter_loaderspinner').hide();*/

              console.log(Filter_GridQuerySelector);
              // Display Using Liquid
              /*fetch(_urltoload).then(function (response) {
                return response.text().then(function (text) {
                  var _productgrid = new DOMParser().parseFromString(text, "text/html");
                  var Filter_GridQuerySelector = '.grid.grid--uniform.grid--view-items';
                  //var productgrid = _productgrid.querySelector(appvariables.Filter_GridQuerySelector);
                  var productgrid = _productgrid.querySelectorAll(Filter_GridQuerySelector)[0];
                  $(gridSelector).html('');
                  gridSelector.innerHTML = productgrid.innerHTML;
                  gridSelector.style.opacity = 1;

                  $('#ca_filter_loaderspinner').hide();



                  // Color Swathes
                  var swatchydivs = document.querySelectorAll('.swatch_swatchdiv');
                  for (var s = 0; s < swatchydivs.length; s++) {
                    swatchydivs[s].style.display = 'inline-block';
                    swatchydivs[s].style.marginTop = '5px';
                    swatchydivs[s].style.marginBottom = '5px';
                  }

                  var productsincollection = [];
                  var correctatags = [];
                  for (var a = 0; a < allatags.length; a++) {
                    var ataghref = allatags[a].href;
                    if (ataghref.includes('products')) {
                      var ataghreflist = ataghref.split('/');
                      var producthandle = ataghreflist[ataghreflist.length - 1];
                      //productsincollection.push({ url: 'https://' + window.location.hostname + '/products/' + producthandle + '.json' });
                      correctatags.push(allatags[a]);
                    }
                  }
                  var swatchcolorelements = document.querySelectorAll('.swatchy_colordiv');
                  for (s = 0; s < swatchcolorelements.length; s++) {
                    swatchcolorelements[s].style.width = appvariables.Swatch_Size + 'px';
                    swatchcolorelements[s].style.height = appvariables.Swatch_Size + 'px';
                    swatchcolorelements[s].style.lineHeight = appvariables.Swatch_Size + 'px';

                    swatchcolorelements[s].style.verticalAlign = 'middle';
                    swatchcolorelements[s].style.backgroundClip = 'content-box';
                    //swatchcolorelements[s].style.boxShadow = '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)';
                    if (appvariables.Swatch_IsCircular == true) {
                      swatchcolorelements[s].style.borderRadius = '50%';
                      //_parentElement.style.borderRadius = '50%';

                    }
                    else {
                      swatchcolorelements[s].style.borderRadius = '2px';
                      //_parentElement.style.borderRadius = '2px';
                    }

                    //console.log(swatchyp_swatchtype);
                    if (appvariables.SwatchType == 'ImageSwatch') {
                      //swatchcolorelements[s].style.borderRadius = '50%';
                      swatchcolorelements[s].style.backgroundSize = 'cover';

                    }
                    if (appvariables.SwatchType == 'PatchExtractSwatch') {

                    }
                    if (appvariables.SwatchType == 'HexColorCode') {
                      var colorcodes = appvariables.Swatch_SolidColors;
                      var colorcodeslist = colorcodes.split(',');

                      var _colorname = swatchcolorelements[s].getAttribute('swatchy-data-color');


                      for (var c = 0; c < colorcodeslist.length; c++) {

                        var colorname = colorcodeslist[c].split('_')[0];
                        colorname = colorname.replace('andsymbol', '&');
                        colorname = colorname.replace('plussymbol', '+');
                        colorname = colorname.replace('slashsymbol', '/');
                        var colorvaluesstring = colorcodeslist[c].split('_')[1];
                        var colorvaluesList;
                        var colorvalue1 = '';
                        var colorvalue2 = '';
                        var colorvalue3 = '';
                        if (colorvaluesstring != undefined) {
                          colorvaluesList = colorvaluesstring.split('*');
                          colorvalue1 = colorvaluesList[0];
                          colorvalue2 = colorvaluesList[1];
                          colorvalue3 = colorvaluesList[2];
                        }


                        //console.log(_colorname + ',' + colorname + ',' + colorvalue);
                        if (_colorname == colorname) {
                          //console.log(colorname);
                          //console.log(colorvalue1);
                          //console.log(colorvalue2);
                          //console.log(colorvalue3);
                          swatchcolorelements[s].style.backgroundImage = 'none';
                          if ((colorvalue2 == 'FFFFFF' && colorvalue3 == 'FFFFFF') || (colorvalue2 == undefined && colorvalue3 == undefined) || (colorvalue2 == '' && colorvalue3 == '')) {
                            swatchcolorelements[s].style.backgroundColor = '#' + colorvalue1;
                          }
                          if (colorvalue2 == 'FFFFFF' || colorvalue2 == undefined || colorvalue2 == '') {
                            swatchcolorelements[s].style.backgroundColor = '#' + colorvalue1;
                          }
                          else {
                            if (colorvalue3 == 'FFFFFF' || colorvalue3 == undefined || colorvalue3 == '') {
                              //swatchcolorelements[s].style.borderBottom = swatchSizeTriple + 'px solid #' + colorvalue1;
                              //swatchcolorelements[s].style.backgroundColor = swatchSizeTriple + 'px solid #' + colorvalue2;
                              //swatchcolorelements[s].style.borderTop = swatchSizeTriple + 'px solid #' + colorvalue3;
                              //console.log('linear-gradient( -180deg, #' + colorvalue1 + ', #' + colorvalue1 + ' 49%, #' + colorvalue2 + ' 49%, #' + colorvalue2 + ' 51%, #' + colorvalue3 + ' 51% )');
                              swatchcolorelements[s].style.background = 'linear-gradient(-180deg, #' + colorvalue1 + ', #' + colorvalue1 + ' 49%, #ffffff 49%, #ffffff 49%, #' + colorvalue2 + ' 51%)';

                            }
                            else {
                              //swatchcolorelements[s].style.borderBottom = swatchSizeDouble + 'px solid #' + colorvalue1;
                              //swatchcolorelements[s].style.backgroundColor = '#' + colorvalue2;
                              //swatchcolorelements[s].style.borderTop = '#' + colorvalue3;
                              swatchcolorelements[s].style.background = 'linear-gradient(-180deg, ' + colorvalue1 + ', #' + colorvalue1 + ' 30%, #' + colorvalue2 + ' 25%, #' + colorvalue2 + ' 55%, #' + colorvalue3 + ' 55%)';

                            }
                          }

                          if (colorvalue3 == 'FFFFFF' || colorvalue3 == undefined || colorvalue3 == '') {

                          }
                          else {
                            //swatchcolorelements[s].style.borderBottom = swatchSizeTriple + 'px solid #' + colorvalue1;
                            //swatchcolorelements[s].style.backgroundColor = swatchSizeTriple + 'px solid #' + colorvalue2;
                            //swatchcolorelements[s].style.borderTop = swatchSizeTriple + 'px solid #' + colorvalue3;
                            //console.log('linear-gradient( -180deg, #' + colorvalue1 + ', #' + colorvalue1 + ' 49%, #' + colorvalue2 + ' 49%, #' + colorvalue2 + ' 51%, #' + colorvalue3 + ' 51% )');
                            swatchcolorelements[s].style.background = 'linear-gradient(-180deg, #' + colorvalue1 + ', #' + colorvalue1 + ' 30%, #' + colorvalue2 + ' 25%, #' + colorvalue2 + ' 55%, #' + colorvalue3 + ' 55%)';
                          }


                        }
                      }

                    }

                  }

                  tippy('.swatchy_c_colordiv', {
                    arrow: true,
                    theme: 'swatchytheme'
                  });

                });
              }).catch(function (err) {
                console.log("Something went wrong!", err);
              });*/
            }
            else {

              if (gridSelector != null) {
                $(gridSelector).html('');
                $('#ca_filter_loaderspinner').hide();
              }
            }
            $('#ca_filterdiv').find('*').prop('disabled', false);

          }

          $('body').on('change', '#ca_filter_sortbyselect', function (e) {
            e.preventDefault();
            var selectedsortby = e.currentTarget.value;
            console.log(selectedsortby);
            var filterHiddenInputs = document.querySelectorAll('.ca_filter_hiddeninput');
            var filterValuesList = [];
            for (var f = 0; f < filterHiddenInputs.length; f++) {
              var filterinputvalue = filterHiddenInputs[f].value;
              if (filterinputvalue != '') {
                filterValuesList.push(filterinputvalue);
              }
            }
            var optioninputs = document.querySelectorAll('.ca_filter_option_inputs');
            for (var o = 0; o < optioninputs.length; o++) {
              var filterinputvalue = optioninputs[o].value;
              if (filterinputvalue != '') {
                filterValuesList.push(filterinputvalue);
              }
            }
            console.log(filterValuesList);
            console.log(filterValuesList.length);
            if (filterValuesList.length > 0) {

              //alert(selectedsortby);
              console.log(selectedsortby);
              _FilterCollectionProducts(1, selectedsortby);
            }


          });

          function LoadFilterCollectionProducts() {
            //console.log(first20products);
            //console.log(collectionpageurl);
            //console.log(producthandlesstring);
            var myRequest = collectionpageurl + '?sort_by=' + ca_filter_sortby + '&page=1' + '?products=' + producthandlesstring;
            fetch(myRequest).then(function (response) {
              return response.text().then(function (text) {
                var _productgrid = new DOMParser().parseFromString(text, "text/html");
                var productgrid = _productgrid.querySelector(appvariables.Filter_GridQuerySelector);

                $(gridSelector).html('');
                gridSelector.innerHTML = productgrid.innerHTML;
                //gridSelector.style.opacity = 1;
                $('#ca_filter_loaderspinner').hide();

                // Color Swatches Code          




              });
            }).catch(function (err) {
              console.log("Something went wrong!", err);
            });
          }
          function FilterCollectionProducts(filterpageno) {
            $('#ca_filterdiv').find('*').prop('disabled', true);
            var themename = Shopify.theme.name;
            var themestoreid = Shopify.theme.theme_store_id;

            var productsperpage = appvariables.Filter_ProductsPerPage;
            var producttypevalues = document.getElementById('ca_filtervalue_producttype').value;
            var vendorvalues = document.getElementById('ca_filtervalue_vendor').value;
            var option1values = document.getElementById('ca_filtervalue_option1').value;
            var option2values = document.getElementById('ca_filtervalue_option2').value;
            var option3values = document.getElementById('ca_filtervalue_option3').value;
            var discountvalues = document.getElementById('ca_filtervalue_discount').value;
            var budgetvalues = document.getElementById('ca_filtervalue_budget').value;
            var _producttypevalues = [];
            if (producttypevalues != '') {
              _producttypevalues = producttypevalues.split(',');
            }
            var filterString = '';
            var _vendorvalues = [];
            if (vendorvalues != '') {
              _vendorvalues = vendorvalues.split(',');
            }
            var _option1values = [];
            if (option1values != '') {
              _option1values = option1values.split(',');
            }
            var _option2values = [];
            if (option2values != '') {
              _option2values = option2values.split(',');
            }
            var _option3values = [];
            if (option3values != '') {
              _option3values = option3values.split(',');
            }
            var _discountvalues = [];
            if (discountvalues != '') {
              _discountvalues = discountvalues.split(',');
            }
            var _budgetvalues = [];
            if (budgetvalues != '') {
              _budgetvalues = budgetvalues.split(',');
            }
            var productLayoutDiv = document.querySelectorAll(appvariables.Filter_GridQuerySelector);
            var filteredproductsurlArray = [];
            var filterstring_producttype = '';
            var filterstring_vendor = '';
            var filterstring_option1 = '';
            var filterstring_option2 = '';
            var filterstring_option3 = '';
            var filterstring_pricerange = '';
            var filterstring_discount = '';
            var filterstring = '';
            if (productLayoutDiv != null) {
              //console.log(_discountvalues);
              //console.log(cartesianProduct([["1","2"], ["100", "200", "300"]]));
              var filterArrays = [];

              if (_option1values.length > 0) {
                filterArrays.push(_option1values);
              }
              if (_option2values.length > 0) {
                filterArrays.push(_option2values);
              }
              if (_option3values.length > 0) {
                filterArrays.push(_option3values);
              }
              if (_discountvalues.length > 0) {
                for (var d = 0; d < _discountvalues.length; d++) {
                  _discountvalues[d] = 'discount_' + _discountvalues[d];
                }
                filterArrays.push(_discountvalues);
              }
              if (_budgetvalues.length > 0) {
                for (var d = 0; d < _budgetvalues.length; d++) {
                  _budgetvalues[d] = 'pricerange_' + _budgetvalues[d];
                }
                filterArrays.push(_budgetvalues);
              }
              if (_producttypevalues.length > 0) {
                filterArrays.push(_producttypevalues);
                for (var t = 0; t < _producttypevalues.length; t++) {
                  if (filterstring_producttype == '') {
                    filterstring_producttype = _producttypevalues[t];
                  }
                  else {
                    filterstring_producttype = filterstring_producttype + ',' + _producttypevalues[t];
                  }
                }

              }
              filterstring_producttype = '?caftype=' + filterstring_producttype;
              if (_vendorvalues.length > 0) {
                filterArrays.push(_vendorvalues);
                for (var t = 0; t < _vendorvalues.length; t++) {
                  if (filterstring_vendor == '') {
                    filterstring_vendor = _vendorvalues[t];
                  }
                  else {
                    filterstring_vendor = filterstring_vendor + ',' + _vendorvalues[t];
                  }
                }

              }

              // OptionValues
              var optioninputElements = document.querySelectorAll('.ca_filter_option_inputs');
              var optionvaluesstring = '';
              for (var p = 0; p < optioninputElements.length; p++) {
                var optionName = optioninputElements[p].id;
                var _optionvaluesstring = '?caf' + optionName + '=' + optioninputElements[p].value;
                if (optionvaluesstring == '') {
                  optionvaluesstring = _optionvaluesstring;
                }
                else {
                  optionvaluesstring = optionvaluesstring + _optionvaluesstring;
                }
              }
              //console.log(optionvaluesstring);
              filterstring_vendor = '?cafvendor=' + filterstring_vendor;
              //console.log(filterArrays);
              filterstring = optionvaluesstring + filterstring_producttype + filterstring_vendor;
              var FilterUrls = cartesianProduct(filterArrays);
              //console.log(FilterUrls);


              filteredproductsurlArray.push({ url: window.location.href + filterstring });

              //console.log(filteredproductsurlArray);

              $(productLayoutDiv).html('');
              var colorname = '';
              var _filteredproductsurlArray = unique(filteredproductsurlArray);
              //console.log(_filteredproductsurlArray);

              var productLayoutDiv = document.querySelectorAll(appvariables.Filter_GridQuerySelector);
              //window.open(window.location.href + '/' + _option2values[0], '_self');
              $.parallelAjax(_filteredproductsurlArray, function (response) {
                //console.log(_filteredproductsurlArray);
                //console.info('success', response);
                for (let h = 0; h < response.length; h++) {
                  var responseurl = _filteredproductsurlArray[h].url;

                  var responseurllist = responseurl.split('/');

                  var optionnamestring = responseurllist[responseurllist.length - 1];
                  var optionnamelist = optionnamestring.split('+');
                  var optionname = optionnamelist[0];
                  var responsehtml = new DOMParser().parseFromString(response[h], "text/html");

                  var responsehtmlproductsul = responsehtml.querySelectorAll(appvariables.Filter_GridQuerySelector);
                  if (responsehtmlproductsul[0] != null) {
                    var responsehtmlproductslist = responsehtmlproductsul[0].children;

                    optionname = optionname.split('?')[0];
                    optionname = optionname.replace('-', ' ');
                    //console.log(optionname);
                    var productsList = [];

                    //console.log(responsehtmlproductsul);
                    $(productLayoutDiv).append(responsehtmlproductslist);
                    var gridList = document.querySelectorAll(appvariables.Filter_GridQuerySelector);
                    var allImagesList = $(gridList).find('img');
                    /*setTimeout(function(){  


                                                                for(var a=0; a<allImagesList.length; a++)
                                                                {

                                                                  allImagesList[a].setAttribute('srcset', '');
                                                                  allImagesList[a].setAttribute('data-srcset', '');
                                                                } 
                                                              }, 800);*/
                  }


                }

                var _collectiondiv = document.querySelector(appvariables.Filter_GridQuerySelector);
                var loadspinner = document.getElementById('ca_filter_loaderspinner');
                loadspinner.style.display = 'none';
                var allatagsinGrid = $(_collectiondiv).find('img');



                var filterpageInput = document.getElementById('ca_swatchfilter_page');
                filterpageInput.value = filterpageno;
                var urlstring = '';
                for (var u = 0; u < _filteredproductsurlArray.length; u++) {
                  if (urlstring == '') {
                    urlstring = _filteredproductsurlArray[u].url;

                  }
                  else {
                    urlstring = urlstring + ',' + _filteredproductsurlArray[u].url;
                  }
                }

                filterpageInput.setAttribute('data-cafilter-url', urlstring);

                //console.log(_ismobiledevice);
                //console.log(filtettagdiv);
                /* if (isfilterAvailable == false) {
                                                      if (_ismobiledevice == false) {
                                                        $(collectiondiv).before(filtettagdiv);
                                                      }
                                                    }*/
                $('#ca_filterdiv').find('*').prop('disabled', false);

                // Swatches
                var colorswatchDivs = document.querySelectorAll('.swatch_c_swatchdiv');
                var colorswatchElements = document.querySelectorAll('.swatchy_c_colordiv');
                //console.log(colorswatchElements);
                for (var c = 0; c < colorswatchElements.length; c++) {
                  colorswatchElements[c].style.borderRadius = '50%';
                }
                console.log(appvariables);
                var swatchcolorelements = document.querySelectorAll('.swatchy_c_colordiv');
                //console.log(swatchcolorelements);
                for (s = 0; s < swatchcolorelements.length; s++) {
                  swatchcolorelements[s].style.width = appvariables.Swatch_Size + 'px';
                  swatchcolorelements[s].style.height = appvariables.Swatch_Size + 'px';
                  swatchcolorelements[s].style.lineHeight = appvariables.Swatch_Size + 'px';
                  swatchcolorelements[s].style.verticalAlign = 'middle';
                  swatchcolorelements[s].style.backgroundClip = 'content-box';
                  if (appvariables.Swatch_IsCircular == true) {
                    swatchcolorelements[s].style.borderRadius = '50%';

                  }
                  else {
                    swatchcolorelements[s].style.borderRadius = '2px';
                  }

                  //console.log(swatchyp_swatchtype);
                  if (appvariables.SwatchType == 0) {
                    //swatchcolorelements[s].style.borderRadius = '50%';
                    swatchcolorelements[s].style.backgroundSize = 'cover';

                  }
                  if (appvariables.SwatchType == 1) {

                  }
                  if (appvariables.SwatchType == 2) {
                    var colorcodes = appvariables.Swatch_SolidColors;
                    var colorcodeslist = colorcodes.split(',');

                    var _colorname = swatchcolorelements[s].getAttribute('swatchy-data-color');

                    for (var c = 0; c < colorcodeslist.length; c++) {

                      var colorname = colorcodeslist[c].split('_')[0];
                      colorname = colorname.replace('andsymbol', '&');
                      colorname = colorname.replace('plussymbol', '+');
                      var colorvalue = colorcodeslist[c].split('_')[1];
                      //console.log(_colorname + ',' + colorname + ',' + colorvalue);
                      if (_colorname == colorname) {
                        swatchcolorelements[s].style.backgroundImage = 'none';
                        swatchcolorelements[s].style.backgroundColor = '#' + colorvalue;
                      }
                    }

                  }

                }

                tippy('.swatchy_c_colordiv', {
                  arrow: true,
                  theme: 'swatchytheme'
                });
              }, function (error) {
                console.info('error', error);
              }, 95000);



            }
          }
          $('body').on('click', '.product-card', function (e) {
            var divElement = e.currentTarget;
            var producturl = divElement.getAttribute('caf-data-producturl');
            window.location = 'https://' + window.location.hostname + producturl;
          });
          $('body').on('hover', '.ca_f_productimage', function (e) {
            var imageElement = e.currentTarget;

          });
          $('body').on('click', '#ca_swatchy_filtery_viewmorebtn', function (e) {
            //console.log('scrolling....');

            //$('#ca_filter_paginationdiv').hide();
            var FilterpageInput = document.getElementById('ca_swatchfilter_page');
            var oldpageNo = FilterpageInput.value * 1;
            var productsperpage = appvariables.Filter_ProductsPerPage * 1;
            var ca_collectionproductscount = document.getElementById('ca_collectionproductscountvalue').value;
            var totalproducts = ca_collectionproductscount * 1;
            var noofpages = (totalproducts / productsperpage);
            noofpages = Math.ceil(noofpages);
            var noofpagesminusone = noofpages - 1;
            if (oldpageNo < noofpages) {
              // Show Button
              var newPageNo = (FilterpageInput.value * 1) + 1;
              //console.log(newPageNo);
              FilterpageInput.value = newPageNo;
              var filterpageurls = FilterpageInput.getAttribute('data-cafilter-url');
              var filterpageurlstringList = filterpageurls.split(',');
              var _filteredproductsurlArray = [];
              for (var f = 0; f < filterpageurlstringList.length; f++) {
                var filterpageurlstring = filterpageurlstringList[f].split('?')[0];
                filterpageurlstring = filterpageurlstring + '?page=' + newPageNo;
                _filteredproductsurlArray.push({ url: filterpageurlstring });
              }

              //console.log(_filteredproductsurlArray);
              $.parallelAjax(_filteredproductsurlArray, function (response) {
                //console.log(_filteredproductsurlArray);
                //console.info('success', response);
                for (let h = 0; h < response.length; h++) {
                  var responseurl = _filteredproductsurlArray[h].url;


                  var responsehtml = new DOMParser().parseFromString(response[h], "text/html");

                  var responsehtmlproductsul = responsehtml.querySelectorAll(appvariables.Filter_GridQuerySelector);
                  var responsehtmlproductslist = responsehtmlproductsul[0].children;
                  var productLayoutDiv = document.querySelectorAll(appvariables.Filter_GridQuerySelector);

                  //console.log(responsehtmlproductsul);
                  $(productLayoutDiv).append(responsehtmlproductslist);

                  var paginationelementdiv = document.getElementById('ca_swatchy_filtery_viewmorebtn');
                  //$(productLayoutDiv).after(paginationelementdiv);

                  var gridList = document.querySelectorAll(appvariables.Filter_GridQuerySelector);
                  var allImagesList = $(gridList).find('img');


                }

                var _collectiondiv = document.querySelector(appvariables.Filter_GridQuerySelector);
                var loadspinner = document.getElementById('ca_filter_loaderspinner');
                loadspinner.style.display = 'none';
                var allatagsinGrid = $(_collectiondiv).find('img');



                var filterpageInput = document.getElementById('ca_swatchfilter_page');
                filterpageInput.value = newPageNo;
                var urlstring = '';
                for (var u = 0; u < _filteredproductsurlArray.length; u++) {
                  if (urlstring == '') {
                    urlstring = _filteredproductsurlArray[u].url;

                  }
                  else {
                    urlstring = urlstring + ',' + _filteredproductsurlArray[u].url;
                  }
                }

                filterpageInput.setAttribute('data-cafilter-url', urlstring);

                if (newPageNo == noofpages) {
                  $('#ca_filter_paginationdiv').hide();
                }
                //console.log(_ismobiledevice);
                //console.log(filtettagdiv);
                /* if (isfilterAvailable == false) {
                                                      if (_ismobiledevice == false) {
                                                        $(collectiondiv).before(filtettagdiv);
                                                      }
                                                    }*/
                $('#ca_filterdiv').find('*').prop('disabled', false);
              }, function (error) {
                console.info('error', error);
              }, 95000);
            }
            else {
              $('#ca_filter_paginationdiv').hide();
            }

          });         
          var leftfilterdiv = document.getElementById('ca_filterdiv');

          $('#ca_filter_paginationdiv').on('click', '.ca_paginationPrevNextatag', function (e) {
            var prevnextbutton = e.currentTarget;
            console.log(prevnextbutton);
            var collectiondiv = document.querySelector(appvariables.Filter_GridQuerySelector);
            var buttonid = prevnextbutton.id;
            var currentpagenumberstring = $('#ca_filter_pagenospan').html();
            currentpagenumberstring = currentpagenumberstring.replace('Page ', '');
            var currentpageno = currentpagenumberstring * 1;

            var allfiltervalues = document.querySelectorAll('.ca_filter_hiddeninput');
            var allfiltervaluesArray = [];
            for (var f = 0; f < allfiltervalues.length; f++) {
              var filtervalues = allfiltervalues[f].value;
              var filtervalueslist = filtervalues.split(',');
              for (var _f = 0; _f < filtervalueslist.length; _f++) {
                if (filtervalueslist[_f] != '') {
                  allfiltervaluesArray.push(filtervalueslist[_f]);
                }

              }
            }

            var productsperpage = appvariables.Filter_ProductsPerPage;
            var newContainer;
            var containerElement;
            //console.log(allfiltervaluesArray);       
            if (allfiltervaluesArray.length > 0) {
              var isfilterAvailable = true;
              // Filter Applied
              if (buttonid == 'ca_paginationPrev') {
                var _pageNo = currentpageno - 1;
                $('#ca_filter_pagenospan').html('Page ' + _pageNo);
              }
              if (buttonid == 'ca_paginationNext') {
                var _pageNo = currentpageno + 1;
                var _urlstring = window.location.href;
                var urlstring = _urlstring.split('?')[0];
                $('#ca_filter_pagenospan').html('Page ' + _pageNo);

              }

              var newurl = window.location.href + '&page=' + _pageNo;
              newurl = newurl.replace('#', '');
              newurl = newurl.replace('&page=' + currentpageno, '');
              //console.log(newurl);
              window.history.pushState({ path: newurl }, '', newurl);
              var sliceindex = productsperpage * _pageNo;
              var filteredproductslength = filteredProductsArray.length;
              var slicedproducts;
              var currentsliceindex = currentpageno * productsperpage;
              if (_pageNo > currentpageno) {
                // Next Page
                if (sliceindex < filteredproductslength) {
                  slicedproducts = filteredProductsArray.slice(currentsliceindex, (productsperpage * _pageNo));
                }
                else {
                  slicedproducts = filteredProductsArray.slice(currentsliceindex, filteredproductslength);
                }
              }
              //console.log(slicedproducts);
              if (_pageNo < currentpageno) {
                // Prev Page
                if (_pageNo == 1) {
                  slicedproducts = filteredProductsArray.slice(0, (productsperpage * _pageNo));
                }
                else {
                  currentsliceindex = (productsperpage * _pageNo) - productsperpage;
                  slicedproducts = filteredProductsArray.slice(currentsliceindex, (productsperpage * _pageNo));
                }
              }
              var productspageList = [];

              var producthandlesList = [];
              for (var p = 0; p < slicedproducts.length; p++) {
                productspageList.push(slicedproducts[p].pageno * 1);
                //producthandlesList.push(searchedproducts[p].handle);
                //var pagewiseproducts = JSON.search(searchedproducts, '//person[age=65]' );
              }
              //console.log(productspageList);
              var pageslistelement = document.getElementById('ca_filtery_pageslist');
              //console.log(pageslistelement);
              var pagesstring = '';
              for (var c = 0; c < productspageList.length; c++) {
                if (pagesstring == '') {
                  pagesstring = productspageList[c];
                }
                else {
                  pagesstring = pagesstring + ',' + productspageList[c];
                }
              }
              pageslistelement.value = pagesstring;
              var _productspageList = unique(productspageList);
              var containerElement = document.querySelectorAll(appvariables.Filter_GridQuerySelector)[0];
              $(containerElement).html('');
              var allpageElements = [];
              // Filters Applied
              var productsdataurlArray = [];
              var paginationInput = document.createElement('input');
              var productspageList = [];
              var producthandlesList = [];
              for (var p = 0; p < filteredProductsArray.length; p++) {
                productspageList.push(filteredProductsArray[p].pageno * 1);
                //producthandlesList.push(searchedproducts[p].handle);
                //var pagewiseproducts = JSON.search(searchedproducts, '//person[age=65]' );
              }
              //console.log(productspageList);
              var pageslistelement = document.getElementById('ca_filtery_pageslist');
              //console.log(pageslistelement);
              var pagesstring = '';
              for (var c = 0; c < productspageList.length; c++) {
                if (pagesstring == '') {
                  pagesstring = productspageList[c];
                }
                else {
                  pagesstring = pagesstring + ',' + productspageList[c];
                }
              }
              pageslistelement.value = pagesstring;
              var _productspageList = unique(productspageList);
              //console.log(productsperpage);
              var containerElement = document.querySelectorAll(appvariables.Filter_GridQuerySelector)[0];
              $(containerElement).html('');
              var filtetedDiv = [];
              var slicestartindex = 0;
              var sliceEndindex = 0;
              var filteredproductslength = filteredProductsArray.length;
              if (_pageNo == 1) {
                slicestartindex = 0;
              }
              else {
                slicestartindex = (_pageNo - 1) * productsperpage;
              }
              slicedproducts = filteredProductsArray.slice(slicestartindex, (slicestartindex + productsperpage));
              //console.log(slicedproducts);
              //console.log(_productspageList);

              for (var w = 0; w < _productspageList.length; w++) {
                productsdataurlArray.push({ url: collectionpageurl + '?sort_by=title-ascending&page=' + _productspageList[w] });
              }

              //console.log(productsdataurlArray);
              $.parallelAjax(productsdataurlArray, function (response) {

                var newContainer;
                var containerElement;
                var _Children;
                //console.log(response);
                //console.log(slicedproducts);

                console.log(collectiondiv);
                $('html, body').animate({
                  scrollTop: $(collectiondiv).offset().top
                }, 2000);

                for (let h = 0; h < response.length; h++) {
                  var responsehtml = new DOMParser().parseFromString(response[h], "text/html");
                  var requesturl = productsdataurlArray[h].url;
                  var requesturllist = requesturl.split('?')[1];
                  var requsturlstring = requesturllist.replace('sort_by=title-ascending&page=', '');
                  var _pageNo = requsturlstring * 1;
                  newContainer = responsehtml.querySelectorAll(appvariables.Filter_GridQuerySelector)[0];
                  containerElement = document.querySelectorAll(appvariables.Filter_GridQuerySelector)[0];

                  _Children = newContainer.children;
                  for (var s = 0; s < slicedproducts.length; s++) {
                    var productindex = (slicedproducts[s].ProductIndexInPage * 1) - 1;
                    var pageno = slicedproducts[s].pageno * 1;
                    var productindexinpage = slicedproducts[s].ProductIndexInPage * 1;
                    var _productindexinpage = s + 1;
                    //console.log(_pageNo + '-' + pageno);

                    if (_pageNo == pageno) {
                      //console.log(_pageNo + '-' + pageno + ',' + (productindexinpage - 1));
                      containerElement = document.querySelectorAll(appvariables.Filter_GridQuerySelector)[0];
                      //console.log(containerElement);
                      //console.log(containerElement.children);
                      //_Children[productindexinpage - 1].setAttribute('data-pageno', _pageNo);
                      containerElement.insertAdjacentHTML('beforeend', _Children[productindexinpage - 1].outerHTML);


                    }

                  }
                }

                if (_ismobiledevice == true) {
                  // Close Filter Div
                  _ca_filter_modal.close();

                }

                var loadspinner = document.getElementById('ca_filter_loaderspinner');
                loadspinner.style.display = 'none';
                //console.log(_ismobiledevice);
                //console.log(filtettagdiv);
                if (isfilterAvailable == false) {
                  if (_ismobiledevice == false) {
                    $(collectiondiv).before(filtettagdiv);
                  }
                }
                $('#ca_filterdiv').find('*').prop('disabled', false);

                // Color Swatches Code


                // Discount Percentage
                var productdivs = $('[data-productid]');
                console.log(productdivs);
                for (var p = 0; p < productdivs.length; p++) {
                  var productid = productdivs[p].getAttribute('data-productid');
                  var _aElement = $(productdivs[p]).find('a')[0];
                  var discountinput = $('input[name="ca_filterapp_input_' + productid + '"]')[0];
                  if (discountinput != null) {
                    var discountvaluestring = discountinput.value;

                    if (discountvaluestring != '') {
                      var discountsList = discountvaluestring.split('_');
                      var _mindiscountp = Math.min.apply(Math, discountsList);
                      var _maxdiscountp = Math.max.apply(Math, discountsList);
                      //console.log(_maxdiscountp);
                      //console.log(_maxdiscountp);
                      var discountp = _maxdiscountp;
                      var discountspan = document.createElement('span');
                      if (_mindiscountp < _maxdiscountp) {
                        discountspan.innerHTML = _mindiscountp + '% - ' + discountp + '% OFF';
                      }
                      else {
                        discountspan.innerHTML = discountp + '% OFF';
                      }

                      discountspan.style.backgroundColor = '#000';
                      discountspan.style.padding = '5px';
                      discountspan.style.position = 'relative';
                      discountspan.style.color = '#fff';
                      discountspan.style.top = '0px';
                      discountspan.style.left = '0px';
                      discountspan.style.verticalAlign = 'middle';
                      discountspan.style.textAlign = 'center';
                      $(_aElement).append(discountspan);
                    }
                  }

                }


              }, function (error) {
                console.info('error', error);
              }, 99000);



            }
            else {
              //console.log('filter not applied');
              // Filter Not Applied
              if (buttonid == 'ca_paginationPrev') {
                var _pageNo = currentpageno - 1;
                $('#ca_filter_pagenospan').html('Page ' + _pageNo);
              }
              if (buttonid == 'ca_paginationNext') {
                var _pageNo = currentpageno + 1;
                var _urlstring = window.location.href;
                var urlstring = _urlstring.split('?')[0];
                $('#ca_filter_pagenospan').html('Page ' + _pageNo);

              }
              var newurl = window.location.href + '&page=' + _pageNo;
              newurl = newurl.replace('#', '');
              newurl = newurl.replace('&page=' + currentpageno, '');
              //console.log(newurl);
              window.history.pushState({ path: newurl }, '', newurl);
              //console.log(_pageNo);
              var newContainer;
              var containerElement;

              //var _pageNo = 1;
              var request = new XMLHttpRequest();

              request.onreadystatechange = function success(e) {
                if (this.readyState === 4 && this.status === 200) {

                  //console.log(e.currentTarget.responseURL);
                  // var _pageNostring = e.currentTarget.responseURL.split('?')[1];
                  //var _pageNo = _pageNostring.replace('sort_by=title-ascending&page=', '');
                  //_pageNo = _pageNo * 1;
                  newContainer = this.responseXML.querySelectorAll(appvariables.Filter_GridQuerySelector)[0];
                  containerElement = document.querySelectorAll(appvariables.Filter_GridQuerySelector)[0];

                  $(containerElement).html('');

                  // Color Swatches Code


                  // Discount Percentage
                  var productdivs = newContainer.querySelectorAll('[data-productid]');

                  for (var p = 0; p < productdivs.length; p++) {
                    var productid = productdivs[p].getAttribute('data-productid');

                    var _aElement = $(productdivs[p]).find('a')[0];
                    var discountinput = newContainer.querySelectorAll('input[name="ca_filterapp_input_' + productid + '"]')[0];
                    console.log(discountinput);
                    if (discountinput != null) {
                      var discountvaluestring = discountinput.value;

                      if (discountvaluestring != '') {
                        var discountsList = discountvaluestring.split('_');
                        var _mindiscountp = Math.min.apply(Math, discountsList);
                        var _maxdiscountp = Math.max.apply(Math, discountsList);
                        //console.log(_maxdiscountp);
                        //console.log(_maxdiscountp);
                        var discountp = _maxdiscountp;
                        var discountspan = document.createElement('span');
                        if (_mindiscountp < _maxdiscountp) {
                          discountspan.innerHTML = _mindiscountp + '% - ' + discountp + '% OFF';
                        }
                        else {
                          discountspan.innerHTML = discountp + '% OFF';
                        }

                        discountspan.style.backgroundColor = '#000';
                        discountspan.style.padding = '5px';
                        discountspan.style.position = 'relative';
                        discountspan.style.color = '#fff';
                        discountspan.style.top = '0px';
                        discountspan.style.left = '0px';
                        discountspan.style.verticalAlign = 'middle';
                        discountspan.style.textAlign = 'center';
                        $(_aElement).append(discountspan);
                      }
                    }

                  }
                  containerElement.insertAdjacentHTML('beforeend', newContainer.innerHTML);
                  containerElement.style.visibility = 'visible';

                  $('html, body').animate({
                    scrollTop: $(collectiondiv).offset().top
                  }, 2000);


                }

              };
              //console.log(collectionpageurl + '?sort_by=title-ascending&page=' + _pageNo);
              request.open('GET', collectionpageurl + '?sort_by=title-ascending&page=' + _pageNo);
              request.responseType = 'document';
              request.send();
            }


          });
          // Load Products JSON      
          /*var _allproductscount = document.getElementById('ca_filters_productscount').value * 1;
          var _allproductscountindex = Math.ceil(_allproductscount /250);
          var _ajaxproduct_urls = [];

          for(var p=1; p<=_allproductscountindex; p++)
          {
            //_parallelajax_collection_urls.push({ url:'https://' + domainName + '/collections/' + laststring + '?filters=Type-' + _producttype + ':Vendor-' + _vendor + _allvariantstring + '&view=ca_seo_filters_template&page=' + p + '&sort_by=title-ascending'});
            //_parallelajax_collection_urls.push({ url: 'https://' + domainName + '/collections/' + laststring + '?filters=Type-' + _producttype + ':Vendor-' + _vendor + _allvariantstring + '&view=ca_seo_filters_template&page=' + p + '&sort_by=title-ascending'});
            //ajaxSync('https://' + domainName + '/collections/' + laststring + '?filters=Type-' + _producttype + ':Vendor-' + _vendor + _allvariantstring + '&view=ca_seo_filters_template&page=' + p + '&sort_by=title-ascending');
            //_parallelajax_collection_urls_.push({ url: 'https://' + domainName + '/collections/' + laststring + '?view=cafiltersjson&page=' + p + '&sort_by=title-ascending'});
            _ajaxproduct_urls.push({ url: 'https://' + domainName + '/collections/' + laststring + '/products.json?page=' +  p + '&limit=250&sort_by=title-ascending'});
            var products_url = 'https://' + domainName + '/collections/' + laststring + '?view=cafiltersjson&page=' + p + '&sort_by=title-ascending';
            fetch(products_url)
            .then((response) => {
              //console.log(response.json());
              return response.json();
            })
            .then((data) => {
              console.log(data);
            });
          }


          var _products_json = [];
          var _products_response = '';
          $.parallelAjax(_ajaxproduct_urls, function (response) {
            console.log(response);
            _products_response = response;
            var _responseJSONString = '';
              var _filterElement = document.getElementById('shopify-section-ca_cfilters_section');
            var _filtertype = document.getElementById('ca_filter_typevalue').value;
            var _queryselector = '.grid--uniform';
            $('#shopify-section-ca_cfilters_section').show();
            if(_filtertype == 'Vertical')
            {
              $('#ca_filterdiv').show();
              //console.log(_queryselector);
              //console.log(_filterElement);
              var _gridselector = document.querySelector(_queryselector);

              _filterElement.style.width = '20%';
              _filterElement.style.float = 'left';
              _filterElement.style.display = 'block';
              _gridselector.style.width = '70%';
              _gridselector.style.float = 'right';
              //console.log(_gridselector);
              //console.log(_filterElement);
              $(_gridselector).before(_filterElement);

              // $('.ca_filters_skeletonbox').hide();

            }

            if(_filtertype == 'Horizontal')
            {
              var _gridselector = document.querySelectorAll(_queryselector)[0];

              //console.log(_gridselector);
              //_gridselector.style.width = '70%';
              //_gridselector.style.float = 'right';
              _filterElement.style.width = '100%';
              $('#ca_filterdiv').show();
              $(_gridselector).before(_filterElement);
            }

            for(var _r=0; _r<response.length; _r++)
            {
              var _productsJSON = response[_r].products;
              _products_json.push(_productsJSON);
            }

          }, function (error) {
            console.info('error', error);
          }, 99000);*/


          function _loadFiltersNew()
          {
            _products_json = window.actualjsonstring;
            //console.log(_products_json);

            var _producttype = document.getElementById('ca_filtervalue_producttype').value;
            var _vendor = document.getElementById('ca_filtervalue_vendor').value;
            //var _option1 = document.getElementById('ca_filtervalue_option1').value;
            //var _option2 = document.getElementById('ca_filtervalue_option2').value;
            //var _option3 = document.getElementById('ca_filtervalue_option3').value;
            //var _discount = document.getElementById('ca_filtervalue_discount').value;
            var _budget = document.getElementById('ca_filtervalue_budget').value;

            var _options_Values = document.querySelectorAll('.ca_filter_variant_option_inputs');
            var _optionsValues = '';
            for(var _oo=0; _oo<_options_Values.length; _oo++)
            {
              if(_options_Values[_oo] != '')
              {
                var _option_Name = _options_Values[_oo].id;
                if(_optionsValues == '')
                {
                  _optionsValues = _option_Name + '_' + _options_Values[_oo].value;
                }
                else
                {
                  _optionsValues = _optionsValues + '#' + _option_Name + '_' + _options_Values[_oo].value;
                }
              }

            }

            var _searchstring = laststring + ' *' + _producttype + '*';
            setTimeout(function () {
              var _collectionJSONurl = 'https://shopthelookdemo.myshopify.com/collections/all?view=cafiltersjson&page=1';


              //console.log(_iscollectionpage);
              if (_iscollectionpage == 'true') {
                //FilterCollection();
                //console.log(_selectedsortby);
                //_FilterCollectionProducts(1, _selectedsortby);

                var _parallelajax_searchurllist = [];
                var _parallelajax_collection_urls = [];

                var _allvariantoptions = document.querySelectorAll('.ca_filter_variant_option_inputs');
                var _allvariantstring = '';
                for(var x=0; x<_allvariantoptions.length; x++)
                {
                  var _option_name = _allvariantoptions[x].getAttribute('name');
                  var _option_values = _allvariantoptions[x].value;
                  if(_option_values != '')
                  {
                    if(_allvariantstring == '')
                    {
                      _allvariantstring = ':' + _option_name + '-' + _option_values;
                    }
                    else
                    {
                      _allvariantstring = _allvariantstring + ':' + _option_name + '-' + _option_values;
                    }
                  }
                }

                //_parallelajax_searchurllist.push({ url: 'https://shopthelookdemo.myshopify.com/search?q=' + _searchstring + '&view=cafiltersjsontitleasc&page=1' });

                $('#ca_filter_loaderspinner').show();
                /*var _allproductscount_ = document.getElementById('ca_filters_productscount').value * 1;
                var _allproductscountindex_ = Math.ceil(_allproductscount_ /250);
                var _noofpages = Math.ceil(_allproductscountindex_);

                var _allproductscount = document.getElementById('ca_filters_productscount').value * 1;
                var _allproductscountindex = Math.ceil(_allproductscount /250);

                for(var p=1; p<=_allproductscountindex; p++)
                {
                  //_parallelajax_collection_urls.push({ url:'https://' + domainName + '/collections/' + laststring + '?filters=Type-' + _producttype + ':Vendor-' + _vendor + _allvariantstring + '&view=ca_seo_filters_template&page=' + p + '&sort_by=title-ascending'});
                  _parallelajax_collection_urls.push({ url: 'https://' + domainName + '/collections/' + laststring + '?filters=Type-' + _producttype + ':Vendor-' + _vendor + _allvariantstring + '&view=ca_seo_filters_template&page=' + p + '&sort_by=title-ascending'});
                  //ajaxSync('https://' + domainName + '/collections/' + laststring + '?filters=Type-' + _producttype + ':Vendor-' + _vendor + _allvariantstring + '&view=ca_seo_filters_template&page=' + p + '&sort_by=title-ascending');
                  //_parallelajax_collection_urls_.push({ url: 'https://' + domainName + '/collections/' + laststring + '?view=cafiltersjson&page=' + p + '&sort_by=title-ascending'});
                }*/



                var _producttypeslist = [];              
                var _productvendorslist = [];
                var _budgetlist = [];
                if(_producttype != '')
                {
                  _producttypeslist = _producttype.split(',');     
                }
                if(_vendor != '')
                {

                  _productvendorslist = _vendor.split(',');
                }
                if(_budget != '')
                {

                  _budgetlist = _budget.split(',');
                }
                var _producttypesmatchedlist = [];
                var _productvendorsmatchedlist = [];
                var _pricerangematchedlist = [];
                var searchProducttypesResult = '';
                var searchProducttypesResultJSON = '';
                var searchProductvendorsResult = '';
                var result;
                var excludeisoutofstock = false;
                var _pricerangelist = [];
                var _productoptionslist = [];
                if(_optionsValues != '')
                {
                  _productoptionslist = _optionsValues.split('#');
                }
                console.log(_productoptionslist.length);
                var params = {
                  'array': _products_json,
                  '_producttypesarray': _producttypeslist,
                  '_productvendorsarray': _productvendorslist,
                  '_optionsarray': _productoptionslist,
                  '_pricerangearray': _budgetlist,
                  'excludeisoutofstock': excludeisoutofstock
                };

                /*var _allproductscount = document.getElementById('ca_filters_productscount').value * 1;
                var _allproductscountindex = Math.ceil(_allproductscount /250);
                var _ajaxproduct_urls = [];

                for(var p=1; p<=_allproductscountindex; p++)
                {
                  //_parallelajax_collection_urls.push({ url:'https://' + domainName + '/collections/' + laststring + '?filters=Type-' + _producttype + ':Vendor-' + _vendor + _allvariantstring + '&view=ca_seo_filters_template&page=' + p + '&sort_by=title-ascending'});
                  //_parallelajax_collection_urls.push({ url: 'https://' + domainName + '/collections/' + laststring + '?filters=Type-' + _producttype + ':Vendor-' + _vendor + _allvariantstring + '&view=ca_seo_filters_template&page=' + p + '&sort_by=title-ascending'});
                  //ajaxSync('https://' + domainName + '/collections/' + laststring + '?filters=Type-' + _producttype + ':Vendor-' + _vendor + _allvariantstring + '&view=ca_seo_filters_template&page=' + p + '&sort_by=title-ascending');
                  //_parallelajax_collection_urls_.push({ url: 'https://' + domainName + '/collections/' + laststring + '?view=cafiltersjson&page=' + p + '&sort_by=title-ascending'});
                  _ajaxproduct_urls.push({ url: 'https://' + domainName + '/collections/' + laststring + '/products.json?page=' +  p + '&limit=250&sort_by=title-ascending'});
                  var products_url = 'https://' + domainName + '/collections/' + laststring + '?view=cafiltersjson&page=' + p + '&sort_by=title-ascending';
                  fetch(products_url)
                  .then((response) => {
                    //console.log(response.json());
                    return response.json();
                  })
                  .then((data) => {
                    console.log(data);
                  });
                }*/

                hamsters.run(params, function () {
                  var arr = params.array;
                  var producttypesarray = params._producttypesarray;
                  var productvendorsarray = params._productvendorsarray;
                  var pricerangearray = params._pricerangearray;
                  var optionsarray = params._optionsarray;
                  var _isproducttypeAvailable = 'false';
                  var _isproductvendorAvailable = false;
                  var _isproductoptionsAvailable = false;
                  var _ispricerangeAvailable = false;
                  var _isoptionAvailable = 'false';
                  var _optionsAvailableArray = [];
                  //console.log(arr);
                  arr.forEach(function (item) {
                    var _optionsCount = optionsarray.length;

                    _isproducttypeAvailable = 'false';
                    _isproductvendorAvailable = 'false';
                    _ispricerangeAvailable = 'false';
                    _isoptionAvailable = 'false';
                    if(producttypesarray.length == 0)
                    {
                      _isproducttypeAvailable = 'true';
                    }
                    for(var pt=0; pt<producttypesarray.length; pt++)
                    {

                      if(producttypesarray[pt] == item.type)
                      {
                        //console.log(producttypesarray[pt] + ',' + item.type);
                        _isproducttypeAvailable = 'true';
                      }
                    }

                    // Product Vendors
                    if(productvendorsarray.length == 0)
                    {
                      _isproductvendorAvailable = 'true';
                    }
                    for(var ve=0; ve<productvendorsarray.length; ve++)
                    {

                      if(productvendorsarray[ve] == item.vendor)
                      {
                        _isproductvendorAvailable = 'true';
                        //console.log( item.handle + ':' + _isproducttypeAvailable + ',' + _isproductvendorAvailable);
                        //console.log(producttypesarray[pt] + ',' + item.vendor);

                      }
                    }
                    // Price Range
                    //console.log(pricerangearray.length);
                    if(pricerangearray.length == 0)
                    {
                      _ispricerangeAvailable = 'true';
                    }
                    else
                    {
                      var _budgetArray_ = pricerangearray[0].split('-');
                      var _minbudget = _budgetArray_[0];
                      var _maxbudget = _budgetArray_[1];
                      var item_minprice = item.minprice * 0.01 * 1;
                      var item_maxprice = item.maxprice * 0.01 * 1;
                      //console.log(item_minprice + '>=' + _minbudget + '&&' + item_minprice + '<=' + _maxbudget);
                      if(item_minprice >= _minbudget &&  item_minprice <= _maxbudget)
                      {

                        _ispricerangeAvailable = 'true';
                      }
                    }


                    // Options
                    if(optionsarray.length == 0)
                    {
                      _isoptionAvailable = 'true';
                    }
                    else
                    {
                      var _product_options = item.options;
                      var _temp__isoptionAvailable = 'false';
                      var _newoptionsarray = [];
                      for(var _O_=0; _O_<optionsarray.length; _O_++)
                      {
                        var _optionsSplitArray = optionsarray[_O_].split('_');
                        var _optionName = _optionsSplitArray[0];
                        var _optionsvaluesArray_ = _optionsSplitArray[1].split(',');
                        if(_optionsvaluesArray_ != '')
                        {
                          _newoptionsarray.push(optionsarray[_O_]);
                        }
                      }
                      //console.log(_newoptionsarray);
                      for(var _O=0; _O<_newoptionsarray.length; _O++)
                      {
                        var _optionsSplitArray = _newoptionsarray[_O].split('_');
                        var _optionName = _optionsSplitArray[0];
                        var _optionsvaluesArray_ = _optionsSplitArray[1].split(',');
                        if(_optionsvaluesArray_ != '')
                        {

                          for(var U=0; U<_optionsvaluesArray_.length; U++)
                          {

                            for(var _P=0; _P<_product_options.length; _P++)
                            {
                              if(_optionName == _product_options[_P].name)
                              {
                                //console.log(_optionName + ',' + _product_options[_P].name);
                                var _product_option_VALUES = _product_options[_P].values;
                                for(var _V=0; _V<_product_option_VALUES.length; _V++)
                                {
                                  if(_optionsvaluesArray_[U] == _product_option_VALUES[_V])
                                  {
                                    _temp__isoptionAvailable = 'true';
                                  }
                                }
                              }

                            }
                          }
                          _optionsAvailableArray[_O] = _temp__isoptionAvailable;
                        }

                      }
                    }
                    //console.log(_optionsAvailableArray);
                    if(_optionsAvailableArray.includes('false'))
                    {
                      _isoptionAvailable = 'false';
                    }
                    else
                    {
                      _isoptionAvailable = 'true';
                    }
                    //console.log('_isproducttypeAvailable == ' + _isproducttypeAvailable + ' && ' +  '_isproductvendorAvailable == ' + _isproductvendorAvailable + ' && ' + '_isoptionAvailable == ' + _isoptionAvailable + ' && ' + '_ispricerangeAvailable == ' + _ispricerangeAvailable);
                    //console.log('_isproducttypeAvailable == true' + ' && ' +  '_isproductvendorAvailable == true' + ' && ' + 
                    //  '_isoptionAvailable == true' + ' && ' + '_ispricerangeAvailable == true');
                    if(_isproducttypeAvailable == 'true' && _isproductvendorAvailable == 'true' && 
                       _isoptionAvailable == 'true' && _ispricerangeAvailable == 'true')
                    {

                      rtn.data.push(item);
                    }


                  });
                }, function (_result) {
                  console.log(_result);
                  var result = _result.data[0];
                  var _productstodisplaystring = '';
                  for(var _e=0; _e<result.length; _e++)
                  {
                    //console.log(result[_e].handle);
                    if(_productstodisplaystring == '')
                    {
                      _productstodisplaystring = result[_e].handle;
                    }
                    else
                    {
                      _productstodisplaystring = _productstodisplaystring + ',' + result[_e].handle;
                    }
                  }


                  //console.log(_productstodisplaystring);
                  var _productstodisplayArray = _productstodisplaystring.split(',');
                  var _urltoloadfilter = 'https://' + domainName + '/collections/' + laststring + '?sort_by=title-ascending&page=1?products=' + _productstodisplaystring;
                  //console.log(_urltoloadfilter);
                  //window.location = _urltoloadfilter;
                  $("#collectionsgrid").load(_urltoloadfilter +" #collectionsgrid>*","");
                  $('#ca_filter_loaderspinner').hide();
                });


                /* var options = {
                  caseSensitive: true,
                  shouldSort: true,
                  tokenize: true,
                  matchAllTokens: true,
                  findAllMatches: true,
                  includeScore: false,
                  threshold: 0,
                  location: 0,
                  distance: 0,
                  maxPatternLength: 500,
                  minMatchCharLength: 1,
                  keys: ["type"]
                };
                var fuse = new Fuse(_products_json, options);

                // Filtering Product Type
                for(var p=0; p<_producttypeslist.length; p++)
                {
                  searchProducttypesResult = fuse.search(_producttypeslist[p]);  


                  for(var _p=0; _p<searchProducttypesResult.length; _p++)
                  {
                    _producttypesmatchedlist.push(searchProducttypesResult[_p]);
                  }

                }
                //console.log(JSON.stringify(_producttypesmatchedlist));
                result = _producttypesmatchedlist;  


                var options_vendor = {
                  caseSensitive: true,
                  shouldSort: true,
                  tokenize: true,
                  matchAllTokens: true,
                  findAllMatches: true,
                  includeScore: false,
                  threshold: 0,
                  location: 0,
                  distance: 0,
                  maxPatternLength: 500,
                  minMatchCharLength: 1,
                  keys: ["vendor"]
                };
                var fuse_vendor = new Fuse(result, options_vendor);
                // Filtering Product Vendor
                if(_vendor != '')
                {
                  for(var v=0; v<_productvendorslist.length; v++)
                  {
                    //console.log(_productvendorslist[v]);
                    searchProductvendorsResult = fuse_vendor.search(_productvendorslist[v]);  

                    //console.log(searchProductvendorsResult);
                    for(var _v=0; _v<searchProductvendorsResult.length; _v++)
                    {
                      _productvendorsmatchedlist.push(searchProductvendorsResult[_v]);
                    }

                  }

                  result = _productvendorsmatchedlist;
                }



                var _productstodisplaystring = '';
                for(var _e=0; _e<result.length; _e++)
                {
                  //console.log(result[_e].handle);
                  if(_productstodisplaystring == '')
                  {
                    _productstodisplaystring = result[_e].handle;
                  }
                  else
                  {
                    _productstodisplaystring = _productstodisplaystring + ',' + result[_e].handle;
                  }
                }



                var _productstodisplayArray = _productstodisplaystring.split(',');
                var _urltoloadfilter = 'https://' + domainName + '/collections/' + laststring + '?sort_by=title-ascending&page=1?products=' + _productstodisplaystring;

                // window.location = _urltoloadfilter;
                //$("#collectionsgrid").load("https://" + domainName + "/collections/" + laststring + "?sort_by=best-selling&page=1?products=" + _productstodisplaystring +" #collectionsgrid>*","");
                $('#ca_filter_loaderspinner').hide();*/
              }
              if (_issearchpage == 'true') {
                var searchurl = window.location.href;
                var searchquerystring = searchurl.split('?')[1];
                var searchquery = searchquerystring.replace('q=', '');
                //FilterSearch(searchquery);
              }

            }, 100);
          }
          $('#ca_filterdiv').on('click', '.ca_filtery_checkbox', function (e) {
            //console.log(e);
            //$('#ca_filter_loaderspinner').show();
            //$('#collectionsgrid')[0].style.opacity = 0.5;
            var filterelement = e.currentTarget;
            var classname = filterelement.className;
            var ischecked = $(filterelement).is(':checked');
            var filtervalue = filterelement.id;
            var filteroptionName = filterelement.getAttribute('data-optionname');

            //$('#ca_filterdiv').find('*').prop('disabled', true);

            if (classname.includes('ca_filtery_btn')) {

              ischecked = filterelement.getAttribute('data-ischecked');
              if (ischecked == 'true') {
                filterelement.setAttribute('data-ischecked', 'false');
                var innerhtmlstring = filterelement.innerHTML;
                innerhtmlstring = innerhtmlstring.replace('✓', '');
                filterelement.innerHTML = innerhtmlstring;
                //filterelement.style.backgroundColor = '#fff';
                //filterelement.style.color = '#000';
                //filterelement.style.fontSize = '10px';
                ischecked = false;
              }
              else {
                filterelement.setAttribute('data-ischecked', 'true');
                filterelement.innerHTML = '✓' + filterelement.innerHTML;
                /*filterelement.style.backgroundColor = '#EAEAEA';*/
                //filterelement.style.backgroundColor = '#436076';
                //filterelement.style.color = '#fff';
                //filterelement.style.fontSize = '10px';
                ischecked = true;
              }

              if (classname.includes('ca_filtery_color_btn')) {
                filterelement.style.color = '#fff';
                filterelement.style.fontSize = '11px';
              }
            }
            if (classname.includes('ca_filtery_colorbtn')) {

              ischecked = filterelement.getAttribute('data-ischecked');
              if (ischecked == 'true') {
                filterelement.setAttribute('data-ischecked', 'false');
                var innerhtmlstring = filterelement.innerHTML;
                filterelement.innerHTML = '';
                filterelement.style.border = '';
                ischecked = false;
              }
              else {
                filterelement.setAttribute('data-ischecked', 'true');
                filterelement.innerHTML = '✓';
                filterelement.style.border = '1px solid #EAEAEA';
                ischecked = true;
              }
            }

            var selectedfiltername = filterelement.id;
            var filtername = filterelement.getAttribute('data-filtername');
            // Product Type
            if (filtername == 'ca_filter_producttype') {
              var oldproducttype = document.getElementById('ca_filtervalue_producttype').value;
              var typeValue = filterelement.value;
              //typeValue = typeValue.replace(' ', '-');
              if (ischecked == true) {
                if (oldproducttype == '') {
                  document.getElementById('ca_filtervalue_producttype').value = typeValue;
                }
                else {
                  document.getElementById('ca_filtervalue_producttype').value = oldproducttype + ',' + typeValue;
                }
              }
              else {
                var oldproducttypeList = oldproducttype.split(',');

                var newproducttypeList = oldproducttypeList.removeByVal(selectedfiltername);

                var newproducttypestring = '';
                for (var v = 0; v < newproducttypeList.length; v++) {
                  var newTypeValue = newproducttypeList[v];
                  //newTypeValue = newTypeValue.replace(' ', '-');
                  if (newproducttypestring == '') {
                    newproducttypestring = newTypeValue;
                  }
                  else {
                    newproducttypestring = newproducttypestring + "," + newTypeValue;
                  }
                }

                document.getElementById('ca_filtervalue_producttype').value = newproducttypestring;
              }


            }
            // Vendor
            console.log(filtername);
            if (filtername == 'ca_filter_vendor') {
              var oldproductvendor = document.getElementById('ca_filtervalue_vendor').value;
              var vendorValue = filterelement.value;
              //vendorValue = vendorValue.replace(' ', '-');
              if (ischecked == true) {
                if (oldproductvendor == '') {
                  document.getElementById('ca_filtervalue_vendor').value = vendorValue;
                }
                else {
                  document.getElementById('ca_filtervalue_vendor').value = oldproductvendor + ',' + vendorValue;
                }
              }
              else {
                var oldproductvendorList = oldproductvendor.split(',');
                var newproductvendorList = oldproductvendorList.removeByVal(selectedfiltername);

                var newproductvendorstring = '';
                for (var v = 0; v < newproductvendorList.length; v++) {
                  var newVendorValue = newproductvendorList[v];
                  //newVendorValue = newVendorValue.replace(' ', '-');
                  if (newproductvendorstring == '') {
                    newproductvendorstring = newVendorValue;
                  }
                  else {
                    newproductvendorstring = newproductvendorstring + "," + newVendorValue;
                  }
                }

                document.getElementById('ca_filtervalue_vendor').value = newproductvendorstring;
              }


            }

            // Option Click
            if (filteroptionName != '' && filteroptionName != null) {
              var oldoption = document.getElementById(filteroptionName).value;

              var optionValue = filterelement.id;
              //optionValue = option1Value.replace(' ', '-');

              if (ischecked == true) {
                if (oldoption == '') {
                  document.getElementById(filteroptionName).value = optionValue;
                }
                else {
                  document.getElementById(filteroptionName).value = oldoption + ',' + optionValue;
                }
              }
              else {
                var oldoptionList = oldoption.split(',');
                var newoptionList = oldoptionList.removeByVal(selectedfiltername);

                var newoptionstring = '';
                for (var v = 0; v < newoptionList.length; v++) {
                  var newoption = newoptionList[v];
                  //newoption = newoption.replace(' ', '-');
                  if (newoptionstring == '') {
                    newoptionstring = newoption;
                  }
                  else {
                    newoptionstring = newoptionstring + "," + newoption;
                  }
                }

                document.getElementById(filteroptionName).value = newoptionstring;
              }


            }

            // Option1
            if (filtername == 'ca_filter_option1') {
              var oldoption1 = document.getElementById('ca_filtervalue_option1').value;

              var option1Value = filterelement.id;
              //option1Value = option1Value.replace(' ', '-');

              if (ischecked == true) {
                if (oldoption1 == '') {
                  document.getElementById('ca_filtervalue_option1').value = option1Value;
                }
                else {
                  document.getElementById('ca_filtervalue_option1').value = oldoption1 + ',' + option1Value;
                }
              }
              else {
                var oldoption1List = oldoption1.split(',');
                var newoption1List = oldoption1List.removeByVal(selectedfiltername);

                var newoption1string = '';
                for (var v = 0; v < newoption1List.length; v++) {
                  var newoption1 = newoption1List[v];
                  //newoption1 = newoption1.replace(' ', '-');
                  if (newoption1string == '') {
                    newoption1string = newoption1;
                  }
                  else {
                    newoption1string = newoption1string + "," + newoption1;
                  }
                }

                document.getElementById('ca_filtervalue_option1').value = newoption1string;
              }


            }

            // Option 2        
            if (filtername == 'ca_filter_option2') {
              var oldoption2 = document.getElementById('ca_filtervalue_option2').value;
              //console.log(ischecked);
              var option2Value = filterelement.id;
              //option2Value = option2Value.replace(' ', '-');
              if (ischecked == true) {
                if (oldoption2 == '') {
                  document.getElementById('ca_filtervalue_option2').value = option2Value;
                }
                else {
                  document.getElementById('ca_filtervalue_option2').value = oldoption2 + ',' + option2Value;
                }
              }
              else {
                var oldoption2List = oldoption2.split(',');
                var newoption2List = oldoption2List.removeByVal(selectedfiltername);

                var newoption2string = '';
                for (var v = 0; v < newoption2List.length; v++) {
                  var newoption2 = newoption2List[v];
                  //newoption2 = newoption2.replace(' ', '-');
                  if (newoption2string == '') {
                    newoption2string = newoption2;
                  }
                  else {
                    newoption2string = newoption2string + "," + newoption2;
                  }
                }

                document.getElementById('ca_filtervalue_option2').value = newoption2string;
              }


            }
            // Option 3
            //console.log(filtername);
            if (filtername == 'ca_filter_option3') {

              var oldoption3 = document.getElementById('ca_filtervalue_option3').value;
              var option3Value = filterelement.id;
              //option3Value = option3Value.replace(' ', '-');

              if (ischecked == true) {
                if (oldoption3 == '') {
                  document.getElementById('ca_filtervalue_option3').value = option3Value;
                }
                else {
                  document.getElementById('ca_filtervalue_option3').value = oldoption3 + ',' + option3Value;
                }
              }
              else {
                var oldoption3List = oldoption3.split(',');
                var newoption3List = oldoption3List.removeByVal(selectedfiltername);

                var newoption3string = '';
                for (var v = 0; v < newoption3List.length; v++) {
                  var newoption3 = newoption3List[v];
                  //newoption3 = newoption3.replace(' ', '-');
                  if (newoption3string == '') {
                    newoption3string = newoption3;
                  }
                  else {
                    newoption3string = newoption3string + "," + newoption3;
                  }
                }

                document.getElementById('ca_filtervalue_option3').value = newoption3string;
              }


            }

            // Discount      
            if (filtername == 'ca_filter_discount') {

              var olddiscount = document.getElementById('ca_filtervalue_discount').value;

              var discountStringValue = filterelement.id.replace(/\%/g, '');
              discountStringValue = discountStringValue.replace(/\ /g, '');
              if (ischecked == true) {
                if (olddiscount == '') {

                  document.getElementById('ca_filtervalue_discount').value = discountStringValue;
                }
                else {
                  document.getElementById('ca_filtervalue_discount').value = olddiscount + ',' + discountStringValue;
                }
              }
              else {
                var olddiscountList = olddiscount.split(',');
                var newdiscountList = olddiscountList.removeByVal(selectedfiltername);

                var newdiscountstring = '';
                for (var v = 0; v < newdiscountList.length; v++) {
                  var discountString = newdiscountList[v].replace(/\%/g, '');
                  discountString = discountString.replace(/\ /g, '');
                  if (newdiscountstring == '') {
                    newdiscountstring = discountString;
                  }
                  else {
                    newdiscountstring = newdiscountstring + "," + discountString;
                  }
                }

                document.getElementById('ca_filtervalue_discount').value = newdiscountstring;
              }

            }

            // Budget      
            if (filtername == 'ca_filter_budget') {
              var budgetElement = document.getElementById('ca_filtervalue_budget');
              var oldbudget = document.getElementById('ca_filtervalue_budget').value;
              var budgetfrom = filterelement.getAttribute('data-budget-from');
              var budgetto = filterelement.getAttribute('data-budget-to');
              var filtervalue = budgetfrom + "_" + budgetto;
              //console.log(filterelement);
              if (ischecked == true) {
                var budgetvaluefrom = filterelement.getAttribute('data-budget-from');
                var budgetvalueto = filterelement.getAttribute('data-budget-to');
                if (oldbudget == '') {
                  document.getElementById('ca_filtervalue_budget').value = budgetvaluefrom + '_' + budgetvalueto;
                }
                else {
                  document.getElementById('ca_filtervalue_budget').value = oldbudget + ',' + budgetvaluefrom + '_' + budgetvalueto;
                }
              }
              else {
                var oldbudgetList = oldbudget.split(',');
                var newbudgetList = oldbudgetList.removeByVal(filtervalue);

                var newbudgetstring = '';
                //console.log(newbudgetList);
                for (var v = 0; v < newbudgetList.length; v++) {
                  if (newbudgetstring == '') {
                    newbudgetstring = newbudgetList[v];
                  }
                  else {
                    newbudgetstring = newbudgetstring + "," + newbudgetList[v];
                  }
                }

                document.getElementById('ca_filtervalue_budget').value = newbudgetstring;
              }

            }

            _loadFiltersNew();


          });
          $('#ca_filterdiv').on('click', '#ca_filters_btn', function (e) {
            _loadFiltersNew();
          });
          $('#ca_searchfilterdiv').on('click', '.ca_searchfiltery_checkbox', function (e) {
            //alert('clicked');

            var filterelement = e.currentTarget;
            console.log(filterelement);
            //alert(filterelement);
            var classname = filterelement.className;
            var ischecked = $(filterelement).is(':checked');
            var filtervalue = filterelement.id;
            var filteroptionName = filterelement.getAttribute('data-optionname');

            $('#ca_searchfilterdiv').find('*').prop('disabled', true);
            if (classname.includes('ca_filtery_btn')) {

              ischecked = filterelement.getAttribute('data-ischecked');
              if (ischecked == 'true') {
                filterelement.setAttribute('data-ischecked', 'false');
                var innerhtmlstring = filterelement.innerHTML;
                innerhtmlstring = innerhtmlstring.replace('✓', '');
                filterelement.innerHTML = innerhtmlstring;
                //filterelement.style.backgroundColor = '#fff';
                //filterelement.style.color = '#000';
                //filterelement.style.fontSize = '10px';
                ischecked = false;
              }
              else {
                filterelement.setAttribute('data-ischecked', 'true');
                filterelement.innerHTML = '✓' + filterelement.innerHTML;
                //filterelement.style.backgroundColor = '#436076';
                //filterelement.style.color = '#fff';
                //filterelement.style.fontSize = '10px';
                ischecked = true;
              }

              if (classname.includes('ca_searchfiltery_color_btn')) {
                filterelement.style.color = '#fff';
                filterelement.style.fontSize = '11px';
              }
            }
            if (classname.includes('ca_searchfiltery_colorbtn')) {

              ischecked = filterelement.getAttribute('data-ischecked');
              if (ischecked == 'true') {
                filterelement.setAttribute('data-ischecked', 'false');
                var innerhtmlstring = filterelement.innerHTML;
                filterelement.innerHTML = '';
                filterelement.style.border = '';
                ischecked = false;
              }
              else {
                filterelement.setAttribute('data-ischecked', 'true');
                filterelement.innerHTML = '✓';
                filterelement.style.border = '1px solid #EAEAEA';
                ischecked = true;
              }
            }
            var selectedfiltername = filterelement.id;
            var filtername = filterelement.getAttribute('data-filtername');
            // Product Type
            if (filtername == 'ca_searchfilter_producttype') {
              var oldproducttype = document.getElementById('ca_filtervalue_producttype').value;
              var typeValue = filterelement.value;
              //typeValue = typeValue.replace(' ', '-');
              if (ischecked == true) {
                if (oldproducttype == '') {
                  document.getElementById('ca_filtervalue_producttype').value = typeValue;
                }
                else {
                  document.getElementById('ca_filtervalue_producttype').value = oldproducttype + ',' + typeValue;
                }
              }
              else {
                var oldproducttypeList = oldproducttype.split(',');

                var newproducttypeList = oldproducttypeList.removeByVal(selectedfiltername);

                var newproducttypestring = '';
                for (var v = 0; v < newproducttypeList.length; v++) {
                  var newTypeValue = newproducttypeList[v];
                  //newTypeValue = newTypeValue.replace(' ', '-');
                  if (newproducttypestring == '') {
                    newproducttypestring = newTypeValue;
                  }
                  else {
                    newproducttypestring = newproducttypestring + "," + newTypeValue;
                  }
                }

                document.getElementById('ca_filtervalue_producttype').value = newproducttypestring;
              }


            }
            // Vendor
            if (filtername == 'ca_filter_vendor') {
              var oldproductvendor = document.getElementById('ca_filtervalue_vendor').value;
              var vendorValue = filterelement.value;
              //vendorValue = vendorValue.replace(' ', '-');
              if (ischecked == true) {
                if (oldproductvendor == '') {
                  document.getElementById('ca_filtervalue_vendor').value = vendorValue;
                }
                else {
                  document.getElementById('ca_filtervalue_vendor').value = oldproductvendor + ',' + vendorValue;
                }
              }
              else {
                var oldproductvendorList = oldproductvendor.split(',');
                var newproductvendorList = oldproductvendorList.removeByVal(selectedfiltername);

                var newproductvendorstring = '';
                for (var v = 0; v < newproductvendorList.length; v++) {
                  var newVendorValue = newproductvendorList[v];
                  //newVendorValue = newVendorValue.replace(' ', '-');
                  if (newproductvendorstring == '') {
                    newproductvendorstring = newVendorValue;
                  }
                  else {
                    newproductvendorstring = newproductvendorstring + "," + newVendorValue;
                  }
                }

                document.getElementById('ca_filtervalue_vendor').value = newproductvendorstring;
              }


            }
            // Option Click
            if (filteroptionName != '' && filteroptionName != null) {
              var oldoption = document.getElementById(filteroptionName).value;

              var optionValue = filterelement.id;
              //optionValue = option1Value.replace(' ', '-');

              if (ischecked == true) {
                if (oldoption == '') {
                  document.getElementById(filteroptionName).value = optionValue;
                }
                else {
                  document.getElementById(filteroptionName).value = oldoption + ',' + optionValue;
                }
              }
              else {
                var oldoptionList = oldoption.split(',');
                var newoptionList = oldoptionList.removeByVal(selectedfiltername);

                var newoptionstring = '';
                for (var v = 0; v < newoptionList.length; v++) {
                  var newoption = newoptionList[v];
                  //newoption = newoption.replace(' ', '-');
                  if (newoptionstring == '') {
                    newoptionstring = newoption;
                  }
                  else {
                    newoptionstring = newoptionstring + "," + newoption;
                  }
                }

                document.getElementById(filteroptionName).value = newoptionstring;
              }


            }
            // Option1
            if (filtername == 'ca_filter_option1') {
              var oldoption1 = document.getElementById('ca_filtervalue_option1').value;

              var option1Value = filterelement.id;
              //option1Value = option1Value.replace(' ', '-');

              if (ischecked == true) {
                if (oldoption1 == '') {
                  document.getElementById('ca_filtervalue_option1').value = option1Value;
                }
                else {
                  document.getElementById('ca_filtervalue_option1').value = oldoption1 + ',' + option1Value;
                }
              }
              else {
                var oldoption1List = oldoption1.split(',');
                var newoption1List = oldoption1List.removeByVal(selectedfiltername);

                var newoption1string = '';
                for (var v = 0; v < newoption1List.length; v++) {
                  var newoption1 = newoption1List[v];
                  //newoption1 = newoption1.replace(' ', '-');
                  if (newoption1string == '') {
                    newoption1string = newoption1;
                  }
                  else {
                    newoption1string = newoption1string + "," + newoption1;
                  }
                }

                document.getElementById('ca_filtervalue_option1').value = newoption1string;
              }


            }
            // Option 2        
            if (filtername == 'ca_filter_option2') {
              var oldoption2 = document.getElementById('ca_filtervalue_option2').value;
              //console.log(ischecked);
              var option2Value = filterelement.id;
              //option2Value = option2Value.replace(' ', '-');
              if (ischecked == true) {
                if (oldoption2 == '') {
                  document.getElementById('ca_filtervalue_option2').value = option2Value;
                }
                else {
                  document.getElementById('ca_filtervalue_option2').value = oldoption2 + ',' + option2Value;
                }
              }
              else {
                var oldoption2List = oldoption2.split(',');
                var newoption2List = oldoption2List.removeByVal(selectedfiltername);

                var newoption2string = '';
                for (var v = 0; v < newoption2List.length; v++) {
                  var newoption2 = newoption2List[v];
                  //newoption2 = newoption2.replace(' ', '-');
                  if (newoption2string == '') {
                    newoption2string = newoption2;
                  }
                  else {
                    newoption2string = newoption2string + "," + newoption2;
                  }
                }

                document.getElementById('ca_filtervalue_option2').value = newoption2string;
              }


            }
            // Option 3
            //console.log(filtername);
            if (filtername == 'ca_filter_option3') {

              var oldoption3 = document.getElementById('ca_filtervalue_option3').value;
              var option3Value = filterelement.id;
              //option3Value = option3Value.replace(' ', '-');

              if (ischecked == true) {
                if (oldoption3 == '') {
                  document.getElementById('ca_filtervalue_option3').value = option3Value;
                }
                else {
                  document.getElementById('ca_filtervalue_option3').value = oldoption3 + ',' + option3Value;
                }
              }
              else {
                var oldoption3List = oldoption3.split(',');
                var newoption3List = oldoption3List.removeByVal(selectedfiltername);

                var newoption3string = '';
                for (var v = 0; v < newoption3List.length; v++) {
                  var newoption3 = newoption3List[v];
                  //newoption3 = newoption3.replace(' ', '-');
                  if (newoption3string == '') {
                    newoption3string = newoption3;
                  }
                  else {
                    newoption3string = newoption3string + "," + newoption3;
                  }
                }

                document.getElementById('ca_filtervalue_option3').value = newoption3string;
              }

            }
            // Discount      
            if (filtername == 'ca_filter_discount') {

              var olddiscount = document.getElementById('ca_filtervalue_discount').value;

              var discountStringValue = filterelement.id.replace(/\%/g, '');
              discountStringValue = discountStringValue.replace(/\ /g, '');
              if (ischecked == true) {
                if (olddiscount == '') {

                  document.getElementById('ca_filtervalue_discount').value = discountStringValue;
                }
                else {
                  document.getElementById('ca_filtervalue_discount').value = olddiscount + ',' + discountStringValue;
                }
              }
              else {
                var olddiscountList = olddiscount.split(',');
                var newdiscountList = olddiscountList.removeByVal(selectedfiltername);

                var newdiscountstring = '';
                for (var v = 0; v < newdiscountList.length; v++) {
                  var discountString = newdiscountList[v].replace(/\%/g, '');
                  discountString = discountString.replace(/\ /g, '');
                  if (newdiscountstring == '') {
                    newdiscountstring = discountString;
                  }
                  else {
                    newdiscountstring = newdiscountstring + "," + discountString;
                  }
                }

                document.getElementById('ca_filtervalue_discount').value = newdiscountstring;
              }

            }
            // Budget      
            if (filtername == 'ca_filter_budget') {
              var budgetElement = document.getElementById('ca_filtervalue_budget');
              var oldbudget = document.getElementById('ca_filtervalue_budget').value;
              var budgetfrom = filterelement.getAttribute('data-budget-from');
              var budgetto = filterelement.getAttribute('data-budget-to');
              var filtervalue = budgetfrom + "_" + budgetto;
              //console.log(filterelement);
              if (ischecked == true) {
                var budgetvaluefrom = filterelement.getAttribute('data-budget-from');
                var budgetvalueto = filterelement.getAttribute('data-budget-to');
                if (oldbudget == '') {
                  document.getElementById('ca_filtervalue_budget').value = budgetvaluefrom + '_' + budgetvalueto;
                }
                else {
                  document.getElementById('ca_filtervalue_budget').value = oldbudget + ',' + budgetvaluefrom + '_' + budgetvalueto;
                }
              }
              else {
                var oldbudgetList = oldbudget.split(',');
                var newbudgetList = oldbudgetList.removeByVal(filtervalue);

                var newbudgetstring = '';
                //console.log(newbudgetList);
                for (var v = 0; v < newbudgetList.length; v++) {
                  if (newbudgetstring == '') {
                    newbudgetstring = newbudgetList[v];
                  }
                  else {
                    newbudgetstring = newbudgetstring + "," + newbudgetList[v];
                  }
                }

                document.getElementById('ca_filtervalue_budget').value = newbudgetstring;
              }

            }
            var _producttype = document.getElementById('ca_filtervalue_producttype').value;
            var _vendor = document.getElementById('ca_filtervalue_vendor').value;
            var _option1 = document.getElementById('ca_filtervalue_option1').value;
            var _option2 = document.getElementById('ca_filtervalue_option2').value;
            var _option3 = document.getElementById('ca_filtervalue_option3').value;


            var _discount = document.getElementById('ca_filtervalue_discount').value;
            var _budget = document.getElementById('ca_filtervalue_budget').value;
            setTimeout(function () {
              //console.log(_iscollectionpage);
              if (_iscollectionpage == 'true') {
                //FilterCollection();
                console.log(_selectedsortby);
                _FilterCollectionProducts(1, _selectedsortby);
              }
              if (_issearchpage == 'true') {
                var searchurl = window.location.href;
                var searchquerystring = searchurl.split('?')[1];
                var searchquery = searchquerystring.replace('q=', '');
                //FilterSearch(searchquery);
              }

            }, 100);

          });
          $('body').on('click', '.ca_filtervalues_btn', function (e) {
            var button = e.currentTarget;
            //console.log(button.classList);
            // Removing filter
            if (button != null) {

              var datafiltername = button.getAttribute('data-btnfiltername');
              datafiltername = datafiltername.replace('filtervalue', 'filter');
              var datafiltervalue = button.id;
              datafiltervalue = datafiltervalue.replace('ca_filter_id_', '');
              var correctfiltercheckbox = document.getElementById(datafiltervalue);
              $(correctfiltercheckbox).trigger('click');
              button.style.display = 'none';
            }

          });
          /*$('body').on('click', '.swatchy_colordiv', function (e) {

            var swatchdiv = e.currentTarget;
            var parentElement = swatchdiv.parentElement;
            var allswatches = parentElement.children;
            //var allswatches = document.querySelectorAll('.swatchy_colordiv');
            for (var a = 0; a < allswatches.length; a++) {
              allswatches[a].style.border = 'none';
              allswatches[a].style.boxShadow = 'none';
              allswatches[a].style.width = (appvariables.Swatch_Size * 1) + 'px';
              allswatches[a].style.height = (appvariables.Swatch_Size * 1) + 'px';
              //allswatches[a].style.lineHeight = (appvariables.Swatch_Size * 1) + 'px';
              allswatches[a].style.padding = '0px';
            }
            swatchdiv.style.backgroundClip = 'content-box';
            swatchdiv.style.padding = '3px';
            swatchdiv.style.width = (appvariables.Swatch_Size * 1) - 3 + 'px';
            swatchdiv.style.height = (appvariables.Swatch_Size * 1) - 3 + 'px';
            swatchdiv.style.boxShadow = '0px 0px 0px ' + appvariables.Swatch_HighlightThickness + 'px #' + appvariables.Swatch_HighlightColor;
            var producturl = swatchdiv.getAttribute('swatchy-data-href');
            var imagesrc = swatchdiv.getAttribute('swatchy-data-variantimage');
            var producthandleList = producturl.split('/');
            var producthandle = producthandleList[2];
            swatchdiv.style.border = '1px solid #eaeaea';
            var allatags = document.querySelectorAll('a');
            var variantid = swatchdiv.getAttribute('swatchy-data-variantid');
            var productimagediv = '';
            var swatchParent = swatchdiv.parentElement;
            var prevElement = $(swatchParent).prev();

            var imageElements = $(prevElement[0]).find('img');
            //console.log(prevElement);
            //console.log(imageElements);
            var allimages = document.querySelectorAll('img');
            productimagediv = imageElements[0];


            if (productimagediv != '' && productimagediv != undefined) {

              productimagediv.setAttribute('data-srcset', '');
              productimagediv.setAttribute('srcset', '');
              var imageHeight = productimagediv.clientHeight;
              var imageWidth = productimagediv.clientWidth;
              var maxSize = Math.max(imageHeight, imageWidth);

              if (imagesrc != '') {
                productimagediv.src = imagesrc;
              }

              //productimagediv.style.width = maxSize + 'px';
              //productimagediv.style.height = maxSize + 'px';

            }
            else {
              console.log(prevElement);
              var prevparentElement = prevElement[0].parentElement;
              console.log(prevparentElement);
              var _imageElements = $(prevparentElement).find('img');
              console.log(_imageElements);
              var _productimagediv = _imageElements[0];

              if (_productimagediv != '' && _productimagediv != undefined) {

                _productimagediv.setAttribute('data-srcset', '');
                _productimagediv.setAttribute('srcset', '');
                var imageHeight = _productimagediv.clientHeight;
                var imageWidth = _productimagediv.clientWidth;
                var maxSize = Math.max(imageHeight, imageWidth);

                if (imagesrc != '') {
                  _productimagediv.src = imagesrc;
                }

                //productimagediv.style.width = maxSize + 'px';
                //productimagediv.style.height = maxSize + 'px';

              }
            }

          });*/      

          if (laststring == 'search') {
            var themename = Shopify.theme.name;
            var searchurl = window.location.href;
            var searchquerystring = searchurl.split('?')[1];
            var searchquery = searchquerystring.replace('q=', '');
            var collectionslistjson = $.getValues('https://' + window.location.hostname + '/collections.json');
            var paginationElements = document.querySelectorAll(appvariables.Search_PaginationElementQuerySelector);
            for (var p = 0; p < paginationElements.length; p++) {
              paginationElements[p].style.display = 'none';
            }

            // Loading Filters
            var _collectionsArray = [];
            var _searchedcollectionsArray = [];
            var _searchedstringList = searchquery.split(' ');
            var settings = {
              "async": true,
              "crossDomain": true,
              "url": "https://" + window.location.hostname + "/collections.json",
              "method": "GET",
              "headers": {
                "cache-control": "no-cache"
              }
            }

            $.ajax(settings).done(function (response) {
              console.log(response);
              console.log(_searchedstringList);
              var collections = response.collections;
              for (var c = 0; c < collections.length; c++) {
                _collectionsArray.push(collections[c]);
                var collectiontitle = collections[c].title;
                collectiontitle = collectiontitle.toLowerCase();
                collectiontitle = collectiontitle.replace(/ /g, '');

                for (var s = 0; s < _searchedstringList.length; s++) {
                  var searchedtitle = _searchedstringList[s];
                  searchedtitle = searchedtitle.toLowerCase();
                  searchedtitle = searchedtitle.replace(/ /g, '');
                  if (collectiontitle.includes(searchedtitle)) {
                    _searchedcollectionsArray.push(collections[c]);
                  }
                }
              }
              console.log(_searchedcollectionsArray);
              var _initialcollection = _searchedcollectionsArray[0];
              var _initialcollectionHandle = _initialcollection.handle;
              console.log(_initialcollection);
              var _collection_id = _initialcollection.id;
              var PageType = 'SearchPage';
              // Load Filters
              var settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://variantswatches.apphb.com/api/GetFilterMetafield/GetMetafield?DomainName=" + domainName + "&IsAdmin=true&CollectionId=" + _collection_id,
                "method": "GET",
                "headers": {
                  "cache-control": "no-cache"
                }
              }

              $.ajax(settings).done(function (response) {
                //console.log(response);
                /*var ca_filter_datajson = JSON.parse(response);
                                var ca_metafield = ca_filter_datajson[0].metafield;
                                var ca_productscount = ca_filter_datajson[0].ProductsCount;
                                var ca_themename = ca_filter_datajson[0].ThemeName;
                                var ca_collection_handle = ca_filter_datajson[0].CollectionHandle;
                                var _totalproductsincollection = ca_productscount * 1;*/

                var CollectionFilterType = appvariables.Filter_FilterType;
                var SearchFilterType = appvariables.Search_FilterType;
                /*var FilterValueInput = '<input type="hidden" class="ca_filter_hiddeninput" id="ca_filtervalue_producttype" name="ca_filtervalue_producttype" value="" />';
                var VendorInput = '<input type="hidden" class="ca_filter_hiddeninput" id="ca_filtervalue_vendor" name="ca_filtervalue_vendor" value="" />';
                var Option1Input = '<input type="hidden" class="ca_filter_hiddeninput" id="ca_filtervalue_option1" name="ca_filtervalue_option1" value="" />';
                var Option2Input = '<input type="hidden" class="ca_filter_hiddeninput" id="ca_filtervalue_option2" name="ca_filtervalue_option2" value="" />';
                var Option3Input = '<input type="hidden" class="ca_filter_hiddeninput" id="ca_filtervalue_option3" name="ca_filtervalue_option3" value="" />';
                var DiscountInput = '<input type="hidden" class="ca_filter_hiddeninput" id="ca_filtervalue_discount" name="ca_filtervalue_discount" value="" />';
                var BudgetInput = '<input type="hidden" class="ca_filter_hiddeninput" id="ca_filtervalue_budget" name="ca_filtervalue_budget" value="" />';
                $('body').append(FilterValueInput);
                $('body').append(VendorInput);
                $('body').append(Option1Input);
                $('body').append(Option2Input);
                $('body').append(Option3Input);
                $('body').append(DiscountInput);
                $('body').append(BudgetInput);*/
                //var FilterContainerDiv = '<div id="ca_filterdivcontainer">Filter Results</div>';
                var FilterDiv = '<div id="ca_filterdiv"></div>';
                var paginationDiv = '<div id="ca_filter_paginationdiv" class="ca_filter_pagination">' +
                    _paginationElementDiv +
                    '</div>';
                /*var paginationDiv = '<div id="ca_filter_paginationdiv" class="ca_filter_pagination">' +
                                      _paginationElementDiv +
                                      '<a href="#" id="ca_paginationPrev" class="ca_paginationPrevNextatag">❮</a>' +
                                      '<span id="ca_filter_pagenospan" value="1">Page 1</span>' +
                                      '<a href="#" id="ca_paginationNext" class="ca_paginationPrevNextatag">❯</a>' +
                                      '</div>';*/
                //$('body').append(FilterContainerDiv);
                $('body').append(FilterDiv);
                var productscountinput = document.createElement('input');
                productscountinput.id = 'ca_filter_productscount';
                productscountinput.type = 'hidden';
                $('body').append(productscountinput);
                //$('body').append(paginationDiv);
                var productpagesListInput = document.createElement('input');
                productpagesListInput.id = 'ca_filtery_pageslist';
                productpagesListInput.type = 'hidden';
                productpagesListInput.value = '1';
                $('body').append(productpagesListInput);
                var displayedproductpagesListInput = document.createElement('input');
                displayedproductpagesListInput.id = 'ca_filtery_displayedpageslist';
                displayedproductpagesListInput.type = 'hidden';
                displayedproductpagesListInput.value = '1';
                $('body').append(displayedproductpagesListInput);
                var displayedproductcountInput = document.createElement('input');
                displayedproductcountInput.id = 'ca_filtery_displayedproductcountlist';
                displayedproductcountInput.type = 'hidden';
                displayedproductcountInput.value = '16';
                $('body').append(displayedproductcountInput);
                var collectionProductsArray = [];
                var searchProductsArray = [];
                var ProductTypesArray = [];
                var VendorsArray = [];
                var Option1ValuesArray = [];
                var Option2ValuesArray = [];
                var Option3ValuesArray = [];
                var searchProductsArray = [];
                var buttonOptions = [];
                buttonOptions.push('Size');
                var ColorOptions = [];
                ColorOptions.push('Color');
                ColorOptions.push('Colour');
                ColorOptions.push('FabricColor');
                var ca_metafield = response;
                console.log(_initialcollection);
                var _totalproductsincollection = _initialcollection.products_count;
                //LoadCollectionFilters(ca_metafield, _initialcollectionHandle, _ismobiledevice, 1, CollectionFilterType, PageType, _totalproductsincollection);
              });


            });
          }

        }
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
