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

    
    function unique(list) {
      var result = [];
      $.each(list, function (i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
      });
      return result;
    }
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
    $(document).ready(function() {
      $("head").append("<link rel='stylesheet' href='https://cdn.jsdelivr.net/gh/cupelapps/shopthelookdemo@latest/caswatchcollectioncss.css' media='screen'>");

      // Slider JS
var Slick=window.Slick||{};(Slick=function(){var i=0;return function(e,t){var o,s=this;s.defaults={accessibility:!0,adaptiveHeight:!1,appendArrows:$(e),appendDots:$(e),arrows:!0,asNavFor:null,prevArrow:'<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',nextArrow:'<button class="slick-next" aria-label="Next" type="button">Next</button>',autoplay:!1,autoplaySpeed:3e3,centerMode:!1,centerPadding:"50px",cssEase:"ease",customPaging:function(i,e){return $('<button type="button" />').text(e+1)},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",edgeFriction:.35,fade:!1,focusOnSelect:!1,focusOnChange:!1,infinite:!0,initialSlide:0,lazyLoad:"ondemand",mobileFirst:!1,pauseOnHover:!0,pauseOnFocus:!0,pauseOnDotsHover:!1,respondTo:"window",responsive:null,rows:1,rtl:!1,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:!0,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useCSS:!0,useTransform:!0,variableWidth:!1,vertical:!1,verticalSwiping:!1,waitForAnimate:!0,zIndex:1e3},s.initials={animating:!1,dragging:!1,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,scrolling:!1,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,swiping:!1,$list:null,touchObject:{},transformsEnabled:!1,unslicked:!1},$.extend(s,s.initials),s.activeBreakpoint=null,s.animType=null,s.animProp=null,s.breakpoints=[],s.breakpointSettings=[],s.cssTransitions=!1,s.focussed=!1,s.interrupted=!1,s.hidden="hidden",s.paused=!0,s.positionProp=null,s.respondTo=null,s.rowCount=1,s.shouldClick=!0,s.$slider=$(e),s.$slidesCache=null,s.transformType=null,s.transitionType=null,s.visibilityChange="visibilitychange",s.windowWidth=0,s.windowTimer=null,o=$(e).data("slick")||{},s.options=$.extend({},s.defaults,t,o),s.currentSlide=s.options.initialSlide,s.originalSettings=s.options,void 0!==document.mozHidden?(s.hidden="mozHidden",s.visibilityChange="mozvisibilitychange"):void 0!==document.webkitHidden&&(s.hidden="webkitHidden",s.visibilityChange="webkitvisibilitychange"),s.autoPlay=$.proxy(s.autoPlay,s),s.autoPlayClear=$.proxy(s.autoPlayClear,s),s.autoPlayIterator=$.proxy(s.autoPlayIterator,s),s.changeSlide=$.proxy(s.changeSlide,s),s.clickHandler=$.proxy(s.clickHandler,s),s.selectHandler=$.proxy(s.selectHandler,s),s.setPosition=$.proxy(s.setPosition,s),s.swipeHandler=$.proxy(s.swipeHandler,s),s.dragHandler=$.proxy(s.dragHandler,s),s.keyHandler=$.proxy(s.keyHandler,s),s.instanceUid=i++,s.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/,s.registerBreakpoints(),s.init(!0)}}()).prototype.activateADA=function(){this.$slideTrack.find(".slick-active").attr({"aria-hidden":"false"}).find("a, input, button, select").attr({tabindex:"0"})},Slick.prototype.addSlide=Slick.prototype.slickAdd=function(i,e,t){var o=this;if("boolean"==typeof e)t=e,e=null;else if(e<0||e>=o.slideCount)return!1;o.unload(),"number"==typeof e?0===e&&0===o.$slides.length?$(i).appendTo(o.$slideTrack):t?$(i).insertBefore(o.$slides.eq(e)):$(i).insertAfter(o.$slides.eq(e)):!0===t?$(i).prependTo(o.$slideTrack):$(i).appendTo(o.$slideTrack),o.$slides=o.$slideTrack.children(this.options.slide),o.$slideTrack.children(this.options.slide).detach(),o.$slideTrack.append(o.$slides),o.$slides.each(function(i,e){$(e).attr("data-slick-index",i)}),o.$slidesCache=o.$slides,o.reinit()},Slick.prototype.animateHeight=function(){var i=this;if(1===i.options.slidesToShow&&!0===i.options.adaptiveHeight&&!1===i.options.vertical){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.animate({height:e},i.options.speed)}},Slick.prototype.animateSlide=function(i,e){var t={},o=this;o.animateHeight(),!0===o.options.rtl&&!1===o.options.vertical&&(i=-i),!1===o.transformsEnabled?!1===o.options.vertical?o.$slideTrack.animate({left:i},o.options.speed,o.options.easing,e):o.$slideTrack.animate({top:i},o.options.speed,o.options.easing,e):!1===o.cssTransitions?(!0===o.options.rtl&&(o.currentLeft=-o.currentLeft),$({animStart:o.currentLeft}).animate({animStart:i},{duration:o.options.speed,easing:o.options.easing,step:function(i){i=Math.ceil(i),!1===o.options.vertical?(t[o.animType]="translate("+i+"px, 0px)",o.$slideTrack.css(t)):(t[o.animType]="translate(0px,"+i+"px)",o.$slideTrack.css(t))},complete:function(){e&&e.call()}})):(o.applyTransition(),i=Math.ceil(i),!1===o.options.vertical?t[o.animType]="translate3d("+i+"px, 0px, 0px)":t[o.animType]="translate3d(0px,"+i+"px, 0px)",o.$slideTrack.css(t),e&&setTimeout(function(){o.disableTransition(),e.call()},o.options.speed))},Slick.prototype.getNavTarget=function(){var i=this.options.asNavFor;return i&&null!==i&&(i=$(i).not(this.$slider)),i},Slick.prototype.asNavFor=function(i){var e=this.getNavTarget();null!==e&&"object"==typeof e&&e.each(function(){var e=$(this).slick("getSlick");e.unslicked||e.slideHandler(i,!0)})},Slick.prototype.applyTransition=function(i){var e=this,t={};!1===e.options.fade?t[e.transitionType]=e.transformType+" "+e.options.speed+"ms "+e.options.cssEase:t[e.transitionType]="opacity "+e.options.speed+"ms "+e.options.cssEase,!1===e.options.fade?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},Slick.prototype.autoPlay=function(){var i=this;i.autoPlayClear(),i.slideCount>i.options.slidesToShow&&(i.autoPlayTimer=setInterval(i.autoPlayIterator,i.options.autoplaySpeed))},Slick.prototype.autoPlayClear=function(){this.autoPlayTimer&&clearInterval(this.autoPlayTimer)},Slick.prototype.autoPlayIterator=function(){var i=this,e=i.currentSlide+i.options.slidesToScroll;i.paused||i.interrupted||i.focussed||(!1===i.options.infinite&&(1===i.direction&&i.currentSlide+1===i.slideCount-1?i.direction=0:0===i.direction&&(e=i.currentSlide-i.options.slidesToScroll,i.currentSlide-1==0&&(i.direction=1))),i.slideHandler(e))},Slick.prototype.buildArrows=function(){var i=this;!0===i.options.arrows&&(i.$prevArrow=$(i.options.prevArrow).addClass("slick-arrow"),i.$nextArrow=$(i.options.nextArrow).addClass("slick-arrow"),i.slideCount>i.options.slidesToShow?(i.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),i.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),i.htmlExpr.test(i.options.prevArrow)&&i.$prevArrow.prependTo(i.options.appendArrows),i.htmlExpr.test(i.options.nextArrow)&&i.$nextArrow.appendTo(i.options.appendArrows),!0!==i.options.infinite&&i.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true")):i.$prevArrow.add(i.$nextArrow).addClass("slick-hidden").attr({"aria-disabled":"true",tabindex:"-1"}))},Slick.prototype.buildDots=function(){var i,e,t=this;if(!0===t.options.dots&&t.slideCount>t.options.slidesToShow){for(t.$slider.addClass("slick-dotted"),e=$("<ul />").addClass(t.options.dotsClass),i=0;i<=t.getDotCount();i+=1)e.append($("<li />").append(t.options.customPaging.call(this,t,i)));t.$dots=e.appendTo(t.options.appendDots),t.$dots.find("li").first().addClass("slick-active")}},Slick.prototype.buildOut=function(){var i=this;i.$slides=i.$slider.children(i.options.slide+":not(.slick-cloned)").addClass("slick-slide"),i.slideCount=i.$slides.length,i.$slides.each(function(i,e){$(e).attr("data-slick-index",i).data("originalStyling",$(e).attr("style")||"")}),i.$slider.addClass("slick-slider"),i.$slideTrack=0===i.slideCount?$('<div class="slick-track"/>').appendTo(i.$slider):i.$slides.wrapAll('<div class="slick-track"/>').parent(),i.$list=i.$slideTrack.wrap('<div class="slick-list"/>').parent(),i.$slideTrack.css("opacity",0),!0!==i.options.centerMode&&!0!==i.options.swipeToSlide||(i.options.slidesToScroll=1),$("img[data-lazy]",i.$slider).not("[src]").addClass("slick-loading"),i.setupInfinite(),i.buildArrows(),i.buildDots(),i.updateDots(),i.setSlideClasses("number"==typeof i.currentSlide?i.currentSlide:0),!0===i.options.draggable&&i.$list.addClass("draggable")},Slick.prototype.buildRows=function(){var i,e,t,o,s,n,l,r=this;if(o=document.createDocumentFragment(),n=r.$slider.children(),r.options.rows>0){for(l=r.options.slidesPerRow*r.options.rows,s=Math.ceil(n.length/l),i=0;i<s;i++){var d=document.createElement("div");for(e=0;e<r.options.rows;e++){var a=document.createElement("div");for(t=0;t<r.options.slidesPerRow;t++){var c=i*l+(e*r.options.slidesPerRow+t);n.get(c)&&a.appendChild(n.get(c))}d.appendChild(a)}o.appendChild(d)}r.$slider.empty().append(o),r.$slider.children().children().children().css({width:100/r.options.slidesPerRow+"%",display:"inline-block"})}},Slick.prototype.checkResponsive=function(i,e){var t,o,s,n=this,l=!1,r=n.$slider.width(),d=window.innerWidth||$(window).width();if("window"===n.respondTo?s=d:"slider"===n.respondTo?s=r:"min"===n.respondTo&&(s=Math.min(d,r)),n.options.responsive&&n.options.responsive.length&&null!==n.options.responsive){for(t in o=null,n.breakpoints)n.breakpoints.hasOwnProperty(t)&&(!1===n.originalSettings.mobileFirst?s<n.breakpoints[t]&&(o=n.breakpoints[t]):s>n.breakpoints[t]&&(o=n.breakpoints[t]));null!==o?null!==n.activeBreakpoint?(o!==n.activeBreakpoint||e)&&(n.activeBreakpoint=o,"unslick"===n.breakpointSettings[o]?n.unslick(o):(n.options=$.extend({},n.originalSettings,n.breakpointSettings[o]),!0===i&&(n.currentSlide=n.options.initialSlide),n.refresh(i)),l=o):(n.activeBreakpoint=o,"unslick"===n.breakpointSettings[o]?n.unslick(o):(n.options=$.extend({},n.originalSettings,n.breakpointSettings[o]),!0===i&&(n.currentSlide=n.options.initialSlide),n.refresh(i)),l=o):null!==n.activeBreakpoint&&(n.activeBreakpoint=null,n.options=n.originalSettings,!0===i&&(n.currentSlide=n.options.initialSlide),n.refresh(i),l=o),i||!1===l||n.$slider.trigger("breakpoint",[n,l])}},Slick.prototype.changeSlide=function(i,e){var t,o,s=this,n=$(i.currentTarget);switch(n.is("a")&&i.preventDefault(),n.is("li")||(n=n.closest("li")),t=s.slideCount%s.options.slidesToScroll!=0?0:(s.slideCount-s.currentSlide)%s.options.slidesToScroll,i.data.message){case"previous":o=0===t?s.options.slidesToScroll:s.options.slidesToShow-t,s.slideCount>s.options.slidesToShow&&s.slideHandler(s.currentSlide-o,!1,e);break;case"next":o=0===t?s.options.slidesToScroll:t,s.slideCount>s.options.slidesToShow&&s.slideHandler(s.currentSlide+o,!1,e);break;case"index":var l=0===i.data.index?0:i.data.index||n.index()*s.options.slidesToScroll;s.slideHandler(s.checkNavigable(l),!1,e),n.children().trigger("focus");break;default:return}},Slick.prototype.checkNavigable=function(i){var e,t;if(t=0,i>(e=this.getNavigableIndexes())[e.length-1])i=e[e.length-1];else for(var o in e){if(i<e[o]){i=t;break}t=e[o]}return i},Slick.prototype.cleanUpEvents=function(){var i=this;i.options.dots&&null!==i.$dots&&($("li",i.$dots).off("click.slick",i.changeSlide).off("mouseenter.slick",$.proxy(i.interrupt,i,!0)).off("mouseleave.slick",$.proxy(i.interrupt,i,!1)),!0===i.options.accessibility&&i.$dots.off("keydown.slick",i.keyHandler)),i.$slider.off("focus.slick blur.slick"),!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow&&i.$prevArrow.off("click.slick",i.changeSlide),i.$nextArrow&&i.$nextArrow.off("click.slick",i.changeSlide),!0===i.options.accessibility&&(i.$prevArrow&&i.$prevArrow.off("keydown.slick",i.keyHandler),i.$nextArrow&&i.$nextArrow.off("keydown.slick",i.keyHandler))),i.$list.off("touchstart.slick mousedown.slick",i.swipeHandler),i.$list.off("touchmove.slick mousemove.slick",i.swipeHandler),i.$list.off("touchend.slick mouseup.slick",i.swipeHandler),i.$list.off("touchcancel.slick mouseleave.slick",i.swipeHandler),i.$list.off("click.slick",i.clickHandler),$(document).off(i.visibilityChange,i.visibility),i.cleanUpSlideEvents(),!0===i.options.accessibility&&i.$list.off("keydown.slick",i.keyHandler),!0===i.options.focusOnSelect&&$(i.$slideTrack).children().off("click.slick",i.selectHandler),$(window).off("orientationchange.slick.slick-"+i.instanceUid,i.orientationChange),$(window).off("resize.slick.slick-"+i.instanceUid,i.resize),$("[draggable!=true]",i.$slideTrack).off("dragstart",i.preventDefault),$(window).off("load.slick.slick-"+i.instanceUid,i.setPosition)},Slick.prototype.cleanUpSlideEvents=function(){var i=this;i.$list.off("mouseenter.slick",$.proxy(i.interrupt,i,!0)),i.$list.off("mouseleave.slick",$.proxy(i.interrupt,i,!1))},Slick.prototype.cleanUpRows=function(){var i,e=this;e.options.rows>0&&((i=e.$slides.children().children()).removeAttr("style"),e.$slider.empty().append(i))},Slick.prototype.clickHandler=function(i){!1===this.shouldClick&&(i.stopImmediatePropagation(),i.stopPropagation(),i.preventDefault())},Slick.prototype.destroy=function(i){var e=this;e.autoPlayClear(),e.touchObject={},e.cleanUpEvents(),$(".slick-cloned",e.$slider).detach(),e.$dots&&e.$dots.remove(),e.$prevArrow&&e.$prevArrow.length&&(e.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.remove()),e.$nextArrow&&e.$nextArrow.length&&(e.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.remove()),e.$slides&&(e.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){$(this).attr("style",$(this).data("originalStyling"))}),e.$slideTrack.children(this.options.slide).detach(),e.$slideTrack.detach(),e.$list.detach(),e.$slider.append(e.$slides)),e.cleanUpRows(),e.$slider.removeClass("slick-slider"),e.$slider.removeClass("slick-initialized"),e.$slider.removeClass("slick-dotted"),e.unslicked=!0,i||e.$slider.trigger("destroy",[e])},Slick.prototype.disableTransition=function(i){var e=this,t={};t[e.transitionType]="",!1===e.options.fade?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},Slick.prototype.fadeSlide=function(i,e){var t=this;!1===t.cssTransitions?(t.$slides.eq(i).css({zIndex:t.options.zIndex}),t.$slides.eq(i).animate({opacity:1},t.options.speed,t.options.easing,e)):(t.applyTransition(i),t.$slides.eq(i).css({opacity:1,zIndex:t.options.zIndex}),e&&setTimeout(function(){t.disableTransition(i),e.call()},t.options.speed))},Slick.prototype.fadeSlideOut=function(i){var e=this;!1===e.cssTransitions?e.$slides.eq(i).animate({opacity:0,zIndex:e.options.zIndex-2},e.options.speed,e.options.easing):(e.applyTransition(i),e.$slides.eq(i).css({opacity:0,zIndex:e.options.zIndex-2}))},Slick.prototype.filterSlides=Slick.prototype.slickFilter=function(i){var e=this;null!==i&&(e.$slidesCache=e.$slides,e.unload(),e.$slideTrack.children(this.options.slide).detach(),e.$slidesCache.filter(i).appendTo(e.$slideTrack),e.reinit())},Slick.prototype.focusHandler=function(){var i=this;i.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick","*",function(e){e.stopImmediatePropagation();var t=$(this);setTimeout(function(){i.options.pauseOnFocus&&(i.focussed=t.is(":focus"),i.autoPlay())},0)})},Slick.prototype.getCurrent=Slick.prototype.slickCurrentSlide=function(){return this.currentSlide},Slick.prototype.getDotCount=function(){var i=this,e=0,t=0,o=0;if(!0===i.options.infinite)if(i.slideCount<=i.options.slidesToShow)++o;else for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else if(!0===i.options.centerMode)o=i.slideCount;else if(i.options.asNavFor)for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else o=1+Math.ceil((i.slideCount-i.options.slidesToShow)/i.options.slidesToScroll);return o-1},Slick.prototype.getLeft=function(i){var e,t,o,s,n=this,l=0;return n.slideOffset=0,t=n.$slides.first().outerHeight(!0),!0===n.options.infinite?(n.slideCount>n.options.slidesToShow&&(n.slideOffset=n.slideWidth*n.options.slidesToShow*-1,s=-1,!0===n.options.vertical&&!0===n.options.centerMode&&(2===n.options.slidesToShow?s=-1.5:1===n.options.slidesToShow&&(s=-2)),l=t*n.options.slidesToShow*s),n.slideCount%n.options.slidesToScroll!=0&&i+n.options.slidesToScroll>n.slideCount&&n.slideCount>n.options.slidesToShow&&(i>n.slideCount?(n.slideOffset=(n.options.slidesToShow-(i-n.slideCount))*n.slideWidth*-1,l=(n.options.slidesToShow-(i-n.slideCount))*t*-1):(n.slideOffset=n.slideCount%n.options.slidesToScroll*n.slideWidth*-1,l=n.slideCount%n.options.slidesToScroll*t*-1))):i+n.options.slidesToShow>n.slideCount&&(n.slideOffset=(i+n.options.slidesToShow-n.slideCount)*n.slideWidth,l=(i+n.options.slidesToShow-n.slideCount)*t),n.slideCount<=n.options.slidesToShow&&(n.slideOffset=0,l=0),!0===n.options.centerMode&&n.slideCount<=n.options.slidesToShow?n.slideOffset=n.slideWidth*Math.floor(n.options.slidesToShow)/2-n.slideWidth*n.slideCount/2:!0===n.options.centerMode&&!0===n.options.infinite?n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)-n.slideWidth:!0===n.options.centerMode&&(n.slideOffset=0,n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)),e=!1===n.options.vertical?i*n.slideWidth*-1+n.slideOffset:i*t*-1+l,!0===n.options.variableWidth&&(o=n.slideCount<=n.options.slidesToShow||!1===n.options.infinite?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow),e=!0===n.options.rtl?o[0]?-1*(n.$slideTrack.width()-o[0].offsetLeft-o.width()):0:o[0]?-1*o[0].offsetLeft:0,!0===n.options.centerMode&&(o=n.slideCount<=n.options.slidesToShow||!1===n.options.infinite?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow+1),e=!0===n.options.rtl?o[0]?-1*(n.$slideTrack.width()-o[0].offsetLeft-o.width()):0:o[0]?-1*o[0].offsetLeft:0,e+=(n.$list.width()-o.outerWidth())/2)),e},Slick.prototype.getOption=Slick.prototype.slickGetOption=function(i){return this.options[i]},Slick.prototype.getNavigableIndexes=function(){var i,e=this,t=0,o=0,s=[];for(!1===e.options.infinite?i=e.slideCount:(t=-1*e.options.slidesToScroll,o=-1*e.options.slidesToScroll,i=2*e.slideCount);t<i;)s.push(t),t=o+e.options.slidesToScroll,o+=e.options.slidesToScroll<=e.options.slidesToShow?e.options.slidesToScroll:e.options.slidesToShow;return s},Slick.prototype.getSlick=function(){return this},Slick.prototype.getSlideCount=function(){var i,e,t=this;return e=!0===t.options.centerMode?t.slideWidth*Math.floor(t.options.slidesToShow/2):0,!0===t.options.swipeToSlide?(t.$slideTrack.find(".slick-slide").each(function(o,s){if(s.offsetLeft-e+$(s).outerWidth()/2>-1*t.swipeLeft)return i=s,!1}),Math.abs($(i).attr("data-slick-index")-t.currentSlide)||1):t.options.slidesToScroll},Slick.prototype.goTo=Slick.prototype.slickGoTo=function(i,e){this.changeSlide({data:{message:"index",index:parseInt(i)}},e)},Slick.prototype.init=function(i){var e=this;$(e.$slider).hasClass("slick-initialized")||($(e.$slider).addClass("slick-initialized"),e.buildRows(),e.buildOut(),e.setProps(),e.startLoad(),e.loadSlider(),e.initializeEvents(),e.updateArrows(),e.updateDots(),e.checkResponsive(!0),e.focusHandler()),i&&e.$slider.trigger("init",[e]),!0===e.options.accessibility&&e.initADA(),e.options.autoplay&&(e.paused=!1,e.autoPlay())},Slick.prototype.initADA=function(){var i=this,e=Math.ceil(i.slideCount/i.options.slidesToShow),t=i.getNavigableIndexes().filter(function(e){return e>=0&&e<i.slideCount});i.$slides.add(i.$slideTrack.find(".slick-cloned")).attr({"aria-hidden":"true",tabindex:"-1"}).find("a, input, button, select").attr({tabindex:"-1"}),null!==i.$dots&&(i.$slides.not(i.$slideTrack.find(".slick-cloned")).each(function(e){var o=t.indexOf(e);if($(this).attr({role:"tabpanel",id:"slick-slide"+i.instanceUid+e,tabindex:-1}),-1!==o){var s="slick-slide-control"+i.instanceUid+o;$("#"+s).length&&$(this).attr({"aria-describedby":s})}}),i.$dots.attr("role","tablist").find("li").each(function(o){var s=t[o];$(this).attr({role:"presentation"}),$(this).find("button").first().attr({role:"tab",id:"slick-slide-control"+i.instanceUid+o,"aria-controls":"slick-slide"+i.instanceUid+s,"aria-label":o+1+" of "+e,"aria-selected":null,tabindex:"-1"})}).eq(i.currentSlide).find("button").attr({"aria-selected":"true",tabindex:"0"}).end());for(var o=i.currentSlide,s=o+i.options.slidesToShow;o<s;o++)i.options.focusOnChange?i.$slides.eq(o).attr({tabindex:"0"}):i.$slides.eq(o).removeAttr("tabindex");i.activateADA()},Slick.prototype.initArrowEvents=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.off("click.slick").on("click.slick",{message:"previous"},i.changeSlide),i.$nextArrow.off("click.slick").on("click.slick",{message:"next"},i.changeSlide),!0===i.options.accessibility&&(i.$prevArrow.on("keydown.slick",i.keyHandler),i.$nextArrow.on("keydown.slick",i.keyHandler)))},Slick.prototype.initDotEvents=function(){var i=this;!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&($("li",i.$dots).on("click.slick",{message:"index"},i.changeSlide),!0===i.options.accessibility&&i.$dots.on("keydown.slick",i.keyHandler)),!0===i.options.dots&&!0===i.options.pauseOnDotsHover&&i.slideCount>i.options.slidesToShow&&$("li",i.$dots).on("mouseenter.slick",$.proxy(i.interrupt,i,!0)).on("mouseleave.slick",$.proxy(i.interrupt,i,!1))},Slick.prototype.initSlideEvents=function(){var i=this;i.options.pauseOnHover&&(i.$list.on("mouseenter.slick",$.proxy(i.interrupt,i,!0)),i.$list.on("mouseleave.slick",$.proxy(i.interrupt,i,!1)))},Slick.prototype.initializeEvents=function(){var i=this;i.initArrowEvents(),i.initDotEvents(),i.initSlideEvents(),i.$list.on("touchstart.slick mousedown.slick",{action:"start"},i.swipeHandler),i.$list.on("touchmove.slick mousemove.slick",{action:"move"},i.swipeHandler),i.$list.on("touchend.slick mouseup.slick",{action:"end"},i.swipeHandler),i.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},i.swipeHandler),i.$list.on("click.slick",i.clickHandler),$(document).on(i.visibilityChange,$.proxy(i.visibility,i)),!0===i.options.accessibility&&i.$list.on("keydown.slick",i.keyHandler),!0===i.options.focusOnSelect&&$(i.$slideTrack).children().on("click.slick",i.selectHandler),$(window).on("orientationchange.slick.slick-"+i.instanceUid,$.proxy(i.orientationChange,i)),$(window).on("resize.slick.slick-"+i.instanceUid,$.proxy(i.resize,i)),$("[draggable!=true]",i.$slideTrack).on("dragstart",i.preventDefault),$(window).on("load.slick.slick-"+i.instanceUid,i.setPosition),$(i.setPosition)},Slick.prototype.initUI=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.show(),i.$nextArrow.show()),!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&i.$dots.show()},Slick.prototype.keyHandler=function(i){var e=this;i.target.tagName.match("TEXTAREA|INPUT|SELECT")||(37===i.keyCode&&!0===e.options.accessibility?e.changeSlide({data:{message:!0===e.options.rtl?"next":"previous"}}):39===i.keyCode&&!0===e.options.accessibility&&e.changeSlide({data:{message:!0===e.options.rtl?"previous":"next"}}))},Slick.prototype.lazyLoad=function(){var i,e,t,o=this;function s(i){$("img[data-lazy]",i).each(function(){var i=$(this),e=$(this).attr("data-lazy"),t=$(this).attr("data-srcset"),s=$(this).attr("data-sizes")||o.$slider.attr("data-sizes"),n=document.createElement("img");n.onload=function(){i.animate({opacity:0},100,function(){t&&(i.attr("srcset",t),s&&i.attr("sizes",s)),i.attr("src",e).animate({opacity:1},200,function(){i.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")}),o.$slider.trigger("lazyLoaded",[o,i,e])})},n.onerror=function(){i.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),o.$slider.trigger("lazyLoadError",[o,i,e])},n.src=e})}if(!0===o.options.centerMode?!0===o.options.infinite?t=(e=o.currentSlide+(o.options.slidesToShow/2+1))+o.options.slidesToShow+2:(e=Math.max(0,o.currentSlide-(o.options.slidesToShow/2+1)),t=o.options.slidesToShow/2+1+2+o.currentSlide):(e=o.options.infinite?o.options.slidesToShow+o.currentSlide:o.currentSlide,t=Math.ceil(e+o.options.slidesToShow),!0===o.options.fade&&(e>0&&e--,t<=o.slideCount&&t++)),i=o.$slider.find(".slick-slide").slice(e,t),"anticipated"===o.options.lazyLoad)for(var n=e-1,l=t,r=o.$slider.find(".slick-slide"),d=0;d<o.options.slidesToScroll;d++)n<0&&(n=o.slideCount-1),i=(i=i.add(r.eq(n))).add(r.eq(l)),n--,l++;s(i),o.slideCount<=o.options.slidesToShow?s(o.$slider.find(".slick-slide")):o.currentSlide>=o.slideCount-o.options.slidesToShow?s(o.$slider.find(".slick-cloned").slice(0,o.options.slidesToShow)):0===o.currentSlide&&s(o.$slider.find(".slick-cloned").slice(-1*o.options.slidesToShow))},Slick.prototype.loadSlider=function(){var i=this;i.setPosition(),i.$slideTrack.css({opacity:1}),i.$slider.removeClass("slick-loading"),i.initUI(),"progressive"===i.options.lazyLoad&&i.progressiveLazyLoad()},Slick.prototype.next=Slick.prototype.slickNext=function(){this.changeSlide({data:{message:"next"}})},Slick.prototype.orientationChange=function(){this.checkResponsive(),this.setPosition()},Slick.prototype.pause=Slick.prototype.slickPause=function(){this.autoPlayClear(),this.paused=!0},Slick.prototype.play=Slick.prototype.slickPlay=function(){var i=this;i.autoPlay(),i.options.autoplay=!0,i.paused=!1,i.focussed=!1,i.interrupted=!1},Slick.prototype.postSlide=function(i){var e=this;e.unslicked||(e.$slider.trigger("afterChange",[e,i]),e.animating=!1,e.slideCount>e.options.slidesToShow&&e.setPosition(),e.swipeLeft=null,e.options.autoplay&&e.autoPlay(),!0===e.options.accessibility&&(e.initADA(),e.options.focusOnChange&&$(e.$slides.get(e.currentSlide)).attr("tabindex",0).focus()))},Slick.prototype.prev=Slick.prototype.slickPrev=function(){this.changeSlide({data:{message:"previous"}})},Slick.prototype.preventDefault=function(i){i.preventDefault()},Slick.prototype.progressiveLazyLoad=function(i){i=i||1;var e,t,o,s,n,l=this,r=$("img[data-lazy]",l.$slider);r.length?(e=r.first(),t=e.attr("data-lazy"),o=e.attr("data-srcset"),s=e.attr("data-sizes")||l.$slider.attr("data-sizes"),(n=document.createElement("img")).onload=function(){o&&(e.attr("srcset",o),s&&e.attr("sizes",s)),e.attr("src",t).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"),!0===l.options.adaptiveHeight&&l.setPosition(),l.$slider.trigger("lazyLoaded",[l,e,t]),l.progressiveLazyLoad()},n.onerror=function(){i<3?setTimeout(function(){l.progressiveLazyLoad(i+1)},500):(e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),l.$slider.trigger("lazyLoadError",[l,e,t]),l.progressiveLazyLoad())},n.src=t):l.$slider.trigger("allImagesLoaded",[l])},Slick.prototype.refresh=function(i){var e,t,o=this;t=o.slideCount-o.options.slidesToShow,!o.options.infinite&&o.currentSlide>t&&(o.currentSlide=t),o.slideCount<=o.options.slidesToShow&&(o.currentSlide=0),e=o.currentSlide,o.destroy(!0),$.extend(o,o.initials,{currentSlide:e}),o.init(),i||o.changeSlide({data:{message:"index",index:e}},!1)},Slick.prototype.registerBreakpoints=function(){var i,e,t,o=this,s=o.options.responsive||null;if("array"===$.type(s)&&s.length){for(i in o.respondTo=o.options.respondTo||"window",s)if(t=o.breakpoints.length-1,s.hasOwnProperty(i)){for(e=s[i].breakpoint;t>=0;)o.breakpoints[t]&&o.breakpoints[t]===e&&o.breakpoints.splice(t,1),t--;o.breakpoints.push(e),o.breakpointSettings[e]=s[i].settings}o.breakpoints.sort(function(i,e){return o.options.mobileFirst?i-e:e-i})}},Slick.prototype.reinit=function(){var i=this;i.$slides=i.$slideTrack.children(i.options.slide).addClass("slick-slide"),i.slideCount=i.$slides.length,i.currentSlide>=i.slideCount&&0!==i.currentSlide&&(i.currentSlide=i.currentSlide-i.options.slidesToScroll),i.slideCount<=i.options.slidesToShow&&(i.currentSlide=0),i.registerBreakpoints(),i.setProps(),i.setupInfinite(),i.buildArrows(),i.updateArrows(),i.initArrowEvents(),i.buildDots(),i.updateDots(),i.initDotEvents(),i.cleanUpSlideEvents(),i.initSlideEvents(),i.checkResponsive(!1,!0),!0===i.options.focusOnSelect&&$(i.$slideTrack).children().on("click.slick",i.selectHandler),i.setSlideClasses("number"==typeof i.currentSlide?i.currentSlide:0),i.setPosition(),i.focusHandler(),i.paused=!i.options.autoplay,i.autoPlay(),i.$slider.trigger("reInit",[i])},Slick.prototype.resize=function(){var i=this;$(window).width()!==i.windowWidth&&(clearTimeout(i.windowDelay),i.windowDelay=window.setTimeout(function(){i.windowWidth=$(window).width(),i.checkResponsive(),i.unslicked||i.setPosition()},50))},Slick.prototype.removeSlide=Slick.prototype.slickRemove=function(i,e,t){var o=this;if(i="boolean"==typeof i?!0===(e=i)?0:o.slideCount-1:!0===e?--i:i,o.slideCount<1||i<0||i>o.slideCount-1)return!1;o.unload(),!0===t?o.$slideTrack.children().remove():o.$slideTrack.children(this.options.slide).eq(i).remove(),o.$slides=o.$slideTrack.children(this.options.slide),o.$slideTrack.children(this.options.slide).detach(),o.$slideTrack.append(o.$slides),o.$slidesCache=o.$slides,o.reinit()},Slick.prototype.setCSS=function(i){var e,t,o=this,s={};!0===o.options.rtl&&(i=-i),e="left"==o.positionProp?Math.ceil(i)+"px":"0px",t="top"==o.positionProp?Math.ceil(i)+"px":"0px",s[o.positionProp]=i,!1===o.transformsEnabled?o.$slideTrack.css(s):(s={},!1===o.cssTransitions?(s[o.animType]="translate("+e+", "+t+")",o.$slideTrack.css(s)):(s[o.animType]="translate3d("+e+", "+t+", 0px)",o.$slideTrack.css(s)))},Slick.prototype.setDimensions=function(){var i=this;!1===i.options.vertical?!0===i.options.centerMode&&i.$list.css({padding:"0px "+i.options.centerPadding}):(i.$list.height(i.$slides.first().outerHeight(!0)*i.options.slidesToShow),!0===i.options.centerMode&&i.$list.css({padding:i.options.centerPadding+" 0px"})),i.listWidth=i.$list.width(),i.listHeight=i.$list.height(),!1===i.options.vertical&&!1===i.options.variableWidth?(i.slideWidth=Math.ceil(i.listWidth/i.options.slidesToShow),i.$slideTrack.width(Math.ceil(i.slideWidth*i.$slideTrack.children(".slick-slide").length))):!0===i.options.variableWidth?i.$slideTrack.width(5e3*i.slideCount):(i.slideWidth=Math.ceil(i.listWidth),i.$slideTrack.height(Math.ceil(i.$slides.first().outerHeight(!0)*i.$slideTrack.children(".slick-slide").length)));var e=i.$slides.first().outerWidth(!0)-i.$slides.first().width();!1===i.options.variableWidth&&i.$slideTrack.children(".slick-slide").width(i.slideWidth-e)},Slick.prototype.setFade=function(){var i,e=this;e.$slides.each(function(t,o){i=e.slideWidth*t*-1,!0===e.options.rtl?$(o).css({position:"relative",right:i,top:0,zIndex:e.options.zIndex-2,opacity:0}):$(o).css({position:"relative",left:i,top:0,zIndex:e.options.zIndex-2,opacity:0})}),e.$slides.eq(e.currentSlide).css({zIndex:e.options.zIndex-1,opacity:1})},Slick.prototype.setHeight=function(){var i=this;if(1===i.options.slidesToShow&&!0===i.options.adaptiveHeight&&!1===i.options.vertical){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.css("height",e)}},Slick.prototype.setOption=Slick.prototype.slickSetOption=function(){var i,e,t,o,s,n=this,l=!1;if("object"===$.type(arguments[0])?(t=arguments[0],l=arguments[1],s="multiple"):"string"===$.type(arguments[0])&&(t=arguments[0],o=arguments[1],l=arguments[2],"responsive"===arguments[0]&&"array"===$.type(arguments[1])?s="responsive":void 0!==arguments[1]&&(s="single")),"single"===s)n.options[t]=o;else if("multiple"===s)$.each(t,function(i,e){n.options[i]=e});else if("responsive"===s)for(e in o)if("array"!==$.type(n.options.responsive))n.options.responsive=[o[e]];else{for(i=n.options.responsive.length-1;i>=0;)n.options.responsive[i].breakpoint===o[e].breakpoint&&n.options.responsive.splice(i,1),i--;n.options.responsive.push(o[e])}l&&(n.unload(),n.reinit())},Slick.prototype.setPosition=function(){var i=this;i.setDimensions(),i.setHeight(),!1===i.options.fade?i.setCSS(i.getLeft(i.currentSlide)):i.setFade(),i.$slider.trigger("setPosition",[i])},Slick.prototype.setProps=function(){var i=this,e=document.body.style;i.positionProp=!0===i.options.vertical?"top":"left","top"===i.positionProp?i.$slider.addClass("slick-vertical"):i.$slider.removeClass("slick-vertical"),void 0===e.WebkitTransition&&void 0===e.MozTransition&&void 0===e.msTransition||!0===i.options.useCSS&&(i.cssTransitions=!0),i.options.fade&&("number"==typeof i.options.zIndex?i.options.zIndex<3&&(i.options.zIndex=3):i.options.zIndex=i.defaults.zIndex),void 0!==e.OTransform&&(i.animType="OTransform",i.transformType="-o-transform",i.transitionType="OTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.MozTransform&&(i.animType="MozTransform",i.transformType="-moz-transform",i.transitionType="MozTransition",void 0===e.perspectiveProperty&&void 0===e.MozPerspective&&(i.animType=!1)),void 0!==e.webkitTransform&&(i.animType="webkitTransform",i.transformType="-webkit-transform",i.transitionType="webkitTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.msTransform&&(i.animType="msTransform",i.transformType="-ms-transform",i.transitionType="msTransition",void 0===e.msTransform&&(i.animType=!1)),void 0!==e.transform&&!1!==i.animType&&(i.animType="transform",i.transformType="transform",i.transitionType="transition"),i.transformsEnabled=i.options.useTransform&&null!==i.animType&&!1!==i.animType},Slick.prototype.setSlideClasses=function(i){var e,t,o,s,n=this;if(t=n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true"),n.$slides.eq(i).addClass("slick-current"),!0===n.options.centerMode){var l=n.options.slidesToShow%2==0?1:0;e=Math.floor(n.options.slidesToShow/2),!0===n.options.infinite&&(i>=e&&i<=n.slideCount-1-e?n.$slides.slice(i-e+l,i+e+1).addClass("slick-active").attr("aria-hidden","false"):(o=n.options.slidesToShow+i,t.slice(o-e+1+l,o+e+2).addClass("slick-active").attr("aria-hidden","false")),0===i?t.eq(t.length-1-n.options.slidesToShow).addClass("slick-center"):i===n.slideCount-1&&t.eq(n.options.slidesToShow).addClass("slick-center")),n.$slides.eq(i).addClass("slick-center")}else i>=0&&i<=n.slideCount-n.options.slidesToShow?n.$slides.slice(i,i+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"):t.length<=n.options.slidesToShow?t.addClass("slick-active").attr("aria-hidden","false"):(s=n.slideCount%n.options.slidesToShow,o=!0===n.options.infinite?n.options.slidesToShow+i:i,n.options.slidesToShow==n.options.slidesToScroll&&n.slideCount-i<n.options.slidesToShow?t.slice(o-(n.options.slidesToShow-s),o+s).addClass("slick-active").attr("aria-hidden","false"):t.slice(o,o+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"));"ondemand"!==n.options.lazyLoad&&"anticipated"!==n.options.lazyLoad||n.lazyLoad()},Slick.prototype.setupInfinite=function(){var i,e,t,o=this;if(!0===o.options.fade&&(o.options.centerMode=!1),!0===o.options.infinite&&!1===o.options.fade&&(e=null,o.slideCount>o.options.slidesToShow)){for(t=!0===o.options.centerMode?o.options.slidesToShow+1:o.options.slidesToShow,i=o.slideCount;i>o.slideCount-t;i-=1)e=i-1,$(o.$slides[e]).clone(!0).attr("id","").attr("data-slick-index",e-o.slideCount).prependTo(o.$slideTrack).addClass("slick-cloned");for(i=0;i<t+o.slideCount;i+=1)e=i,$(o.$slides[e]).clone(!0).attr("id","").attr("data-slick-index",e+o.slideCount).appendTo(o.$slideTrack).addClass("slick-cloned");o.$slideTrack.find(".slick-cloned").find("[id]").each(function(){$(this).attr("id","")})}},Slick.prototype.interrupt=function(i){i||this.autoPlay(),this.interrupted=i},Slick.prototype.selectHandler=function(i){var e=this,t=$(i.target).is(".slick-slide")?$(i.target):$(i.target).parents(".slick-slide"),o=parseInt(t.attr("data-slick-index"));o||(o=0),e.slideCount<=e.options.slidesToShow?e.slideHandler(o,!1,!0):e.slideHandler(o)},Slick.prototype.slideHandler=function(i,e,t){var o,s,n,l,r,d,a=this;if(e=e||!1,!(!0===a.animating&&!0===a.options.waitForAnimate||!0===a.options.fade&&a.currentSlide===i))if(!1===e&&a.asNavFor(i),o=i,r=a.getLeft(o),l=a.getLeft(a.currentSlide),a.currentLeft=null===a.swipeLeft?l:a.swipeLeft,!1===a.options.infinite&&!1===a.options.centerMode&&(i<0||i>a.getDotCount()*a.options.slidesToScroll))!1===a.options.fade&&(o=a.currentSlide,!0!==t&&a.slideCount>a.options.slidesToShow?a.animateSlide(l,function(){a.postSlide(o)}):a.postSlide(o));else if(!1===a.options.infinite&&!0===a.options.centerMode&&(i<0||i>a.slideCount-a.options.slidesToScroll))!1===a.options.fade&&(o=a.currentSlide,!0!==t&&a.slideCount>a.options.slidesToShow?a.animateSlide(l,function(){a.postSlide(o)}):a.postSlide(o));else{if(a.options.autoplay&&clearInterval(a.autoPlayTimer),s=o<0?a.slideCount%a.options.slidesToScroll!=0?a.slideCount-a.slideCount%a.options.slidesToScroll:a.slideCount+o:o>=a.slideCount?a.slideCount%a.options.slidesToScroll!=0?0:o-a.slideCount:o,a.animating=!0,a.$slider.trigger("beforeChange",[a,a.currentSlide,s]),n=a.currentSlide,a.currentSlide=s,a.setSlideClasses(a.currentSlide),a.options.asNavFor&&(d=(d=a.getNavTarget()).slick("getSlick")).slideCount<=d.options.slidesToShow&&d.setSlideClasses(a.currentSlide),a.updateDots(),a.updateArrows(),!0===a.options.fade)return!0!==t?(a.fadeSlideOut(n),a.fadeSlide(s,function(){a.postSlide(s)})):a.postSlide(s),void a.animateHeight();!0!==t&&a.slideCount>a.options.slidesToShow?a.animateSlide(r,function(){a.postSlide(s)}):a.postSlide(s)}},Slick.prototype.startLoad=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.hide(),i.$nextArrow.hide()),!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&i.$dots.hide(),i.$slider.addClass("slick-loading")},Slick.prototype.swipeDirection=function(){var i,e,t,o,s=this;return i=s.touchObject.startX-s.touchObject.curX,e=s.touchObject.startY-s.touchObject.curY,t=Math.atan2(e,i),(o=Math.round(180*t/Math.PI))<0&&(o=360-Math.abs(o)),o<=45&&o>=0?!1===s.options.rtl?"left":"right":o<=360&&o>=315?!1===s.options.rtl?"left":"right":o>=135&&o<=225?!1===s.options.rtl?"right":"left":!0===s.options.verticalSwiping?o>=35&&o<=135?"down":"up":"vertical"},Slick.prototype.swipeEnd=function(i){var e,t,o=this;if(o.dragging=!1,o.swiping=!1,o.scrolling)return o.scrolling=!1,!1;if(o.interrupted=!1,o.shouldClick=!(o.touchObject.swipeLength>10),void 0===o.touchObject.curX)return!1;if(!0===o.touchObject.edgeHit&&o.$slider.trigger("edge",[o,o.swipeDirection()]),o.touchObject.swipeLength>=o.touchObject.minSwipe){switch(t=o.swipeDirection()){case"left":case"down":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide+o.getSlideCount()):o.currentSlide+o.getSlideCount(),o.currentDirection=0;break;case"right":case"up":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide-o.getSlideCount()):o.currentSlide-o.getSlideCount(),o.currentDirection=1}"vertical"!=t&&(o.slideHandler(e),o.touchObject={},o.$slider.trigger("swipe",[o,t]))}else o.touchObject.startX!==o.touchObject.curX&&(o.slideHandler(o.currentSlide),o.touchObject={})},Slick.prototype.swipeHandler=function(i){var e=this;if(!(!1===e.options.swipe||"ontouchend"in document&&!1===e.options.swipe||!1===e.options.draggable&&-1!==i.type.indexOf("mouse")))switch(e.touchObject.fingerCount=i.originalEvent&&void 0!==i.originalEvent.touches?i.originalEvent.touches.length:1,e.touchObject.minSwipe=e.listWidth/e.options.touchThreshold,!0===e.options.verticalSwiping&&(e.touchObject.minSwipe=e.listHeight/e.options.touchThreshold),i.data.action){case"start":e.swipeStart(i);break;case"move":e.swipeMove(i);break;case"end":e.swipeEnd(i)}},Slick.prototype.swipeMove=function(i){var e,t,o,s,n,l,r=this;return n=void 0!==i.originalEvent?i.originalEvent.touches:null,!(!r.dragging||r.scrolling||n&&1!==n.length)&&(e=r.getLeft(r.currentSlide),r.touchObject.curX=void 0!==n?n[0].pageX:i.clientX,r.touchObject.curY=void 0!==n?n[0].pageY:i.clientY,r.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(r.touchObject.curX-r.touchObject.startX,2))),l=Math.round(Math.sqrt(Math.pow(r.touchObject.curY-r.touchObject.startY,2))),!r.options.verticalSwiping&&!r.swiping&&l>4?(r.scrolling=!0,!1):(!0===r.options.verticalSwiping&&(r.touchObject.swipeLength=l),t=r.swipeDirection(),void 0!==i.originalEvent&&r.touchObject.swipeLength>4&&(r.swiping=!0,i.preventDefault()),s=(!1===r.options.rtl?1:-1)*(r.touchObject.curX>r.touchObject.startX?1:-1),!0===r.options.verticalSwiping&&(s=r.touchObject.curY>r.touchObject.startY?1:-1),o=r.touchObject.swipeLength,r.touchObject.edgeHit=!1,!1===r.options.infinite&&(0===r.currentSlide&&"right"===t||r.currentSlide>=r.getDotCount()&&"left"===t)&&(o=r.touchObject.swipeLength*r.options.edgeFriction,r.touchObject.edgeHit=!0),!1===r.options.vertical?r.swipeLeft=e+o*s:r.swipeLeft=e+o*(r.$list.height()/r.listWidth)*s,!0===r.options.verticalSwiping&&(r.swipeLeft=e+o*s),!0!==r.options.fade&&!1!==r.options.touchMove&&(!0===r.animating?(r.swipeLeft=null,!1):void r.setCSS(r.swipeLeft))))},Slick.prototype.swipeStart=function(i){var e,t=this;if(t.interrupted=!0,1!==t.touchObject.fingerCount||t.slideCount<=t.options.slidesToShow)return t.touchObject={},!1;void 0!==i.originalEvent&&void 0!==i.originalEvent.touches&&(e=i.originalEvent.touches[0]),t.touchObject.startX=t.touchObject.curX=void 0!==e?e.pageX:i.clientX,t.touchObject.startY=t.touchObject.curY=void 0!==e?e.pageY:i.clientY,t.dragging=!0},Slick.prototype.unfilterSlides=Slick.prototype.slickUnfilter=function(){var i=this;null!==i.$slidesCache&&(i.unload(),i.$slideTrack.children(this.options.slide).detach(),i.$slidesCache.appendTo(i.$slideTrack),i.reinit())},Slick.prototype.unload=function(){var i=this;$(".slick-cloned",i.$slider).remove(),i.$dots&&i.$dots.remove(),i.$prevArrow&&i.htmlExpr.test(i.options.prevArrow)&&i.$prevArrow.remove(),i.$nextArrow&&i.htmlExpr.test(i.options.nextArrow)&&i.$nextArrow.remove(),i.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")},Slick.prototype.unslick=function(i){var e=this;e.$slider.trigger("unslick",[e,i]),e.destroy()},Slick.prototype.updateArrows=function(){var i=this;Math.floor(i.options.slidesToShow/2),!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&!i.options.infinite&&(i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false"),i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false"),0===i.currentSlide?(i.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false")):i.currentSlide>=i.slideCount-i.options.slidesToShow&&!1===i.options.centerMode?(i.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")):i.currentSlide>=i.slideCount-1&&!0===i.options.centerMode&&(i.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")))},Slick.prototype.updateDots=function(){var i=this;null!==i.$dots&&(i.$dots.find("li").removeClass("slick-active").end(),i.$dots.find("li").eq(Math.floor(i.currentSlide/i.options.slidesToScroll)).addClass("slick-active"))},Slick.prototype.visibility=function(){var i=this;i.options.autoplay&&(document[i.hidden]?i.interrupted=!0:i.interrupted=!1)},$.fn.slick=function(){var i,e,t=this,o=arguments[0],s=Array.prototype.slice.call(arguments,1),n=t.length;for(i=0;i<n;i++)if("object"==typeof o||void 0===o?t[i].slick=new Slick(t[i],o):e=t[i].slick[o].apply(t[i].slick,s),void 0!==e)return e;return t};

      var DomainName = window.location.hostname;
      DomainName = DomainName.replace('www.', '');
      //DomainName = DomainName.replace('.com', '');
      //DomainName = 'mimishdesigns.com';
      var _shopname = Shopify.shop;
      _shopname = _shopname.replace('.myshopify.com', '');
      
      $.get("https://autocolorswatches.apphb.com/Api/SwatchAppVariables/GetVariables?ShopName=" + _shopname, function (appvariables) {

        console.log(appvariables);
        console.log(productstring);
        var _colornamesarray = 'Color,Colour,Fabric Color';   
        var _buttonnamesarray = 'Size';
        var colornamesarray = _colornamesarray;
        var buttonnamesarray = _buttonnamesarray;

        var _parameter = getParameterByName('testing', url);
        if(_parameter == 'true')
        {

          if(productstring == 'collections')
          {


            var _productsGridSelectors = document.querySelectorAll('.grid__item.grid-product');
            //_productsGridSelectors.style.overflow = 'hidden';
            var _collectionpageataghrefslist_ = [];
            var _collectionspageatags = [];
            f
          
            var _collectionspageatags = $(_productsGridSelectors).find('a');
            for(var c=0; c<_collectionspageatags.length; c++)
            {
              var _tagclass = _collectionspageatags[c].className;
              var _ataghref = _collectionspageatags[c].href;
              if(_ataghref != "")
              {
                if(_ataghref.indexOf('products') != -1 && _tagclass.includes('image') != true)
                {
                  _collectionpageataghrefslist_.push(_ataghref);               
                }

              }
            }


            var _collectionpageataghrefslist = unique(_collectionpageataghrefslist_);
            console.log(_collectionpageataghrefslist_);
            var _parallelajaxArray = [];
            //var _ca_product_urlsList_ = document.getElementById('__ca_product_urlsinput').value;
            //var _ca_product_urlsList = _ca_product_urlsList_.split(',');
            console.log(_collectionspageatags);
            for(var i=0; i<_collectionpageataghrefslist_.length; i++)
            {

              if(_collectionpageataghrefslist_[i] != '')
              {
                _parallelajaxArray.push({url: _collectionpageataghrefslist_[i] + '.json'});
              }

            }
            console.log(_parallelajaxArray);
            $.parallelAjax(_parallelajaxArray, function(response) {
              //console.info('success', response);
              var _productsjson = response;

              var swatchtype = 'imageswatch';
              for(var p=0; p<_productsjson.length; p++)
              {
                var _productelement = _productsjson[p].product;
                var _productvariants = _productelement.variants;
                var _productimages = _productelement.images;
                var _collectionswatchdiv = '';
                //var _collectionswatchdiv = '<div caf-data-template="collection" style="z-index: 50; display: inline-block; text-align: left;" id="caf_swatch_' +  _productelement.handle + '" class="caf_swatch_main_div" caf-handle="' +  _productelement.handle + '">' + 
                //   '</div>';
                var isColor = false;
                var _productoptions= _productelement.options;
                for(var o=0; o<_productoptions.length; o++)
                {
                  var optionname = _productoptions[o].name;
                  if(colornamesarray.indexOf(optionname) != -1)
                  {
                    isColor = true;
                  }
                  if(buttonnamesarray.indexOf(optionname) != -1)
                  {
                    isColor = false;
                  }  
                  //console.log(optionname + ',' + isColor);
                  if(isColor == true)
                  {

                    var _collectionswatch_div = '';
                    var _option_values = _productoptions[o].values;
                    var _variantoptionschilddiv = '';
                    for(var v=0; v<_option_values.length; v++)
                    {
                      var _variant = [];
                      var _product_value = _option_values[v];

                      _variant = getObjects(_productvariants, 'option1', _product_value);

                      if(_variant.length == 0)
                      {
                        var _variant = getObjects(_productvariants, 'option2', _product_value);
                      }
                      if(_variant.length == 0)
                      {
                        var _variant = getObjects(_productvariants, 'option3', _product_value);
                      }

                      var _variantimageid = _variant[0].image_id;
                      //console.log(_variantimageid);
                      var _variantimageElement = getObjects(_productimages, 'id', _variantimageid);
                      var _variantimageSrc = '';
                      if(_variantimageElement.length > 0)
                      {
                        _variantimageSrc = _variantimageElement[0].src;
                      }
                      //console.log(_variantimageSrc);
                      /*var _colleciton_swatch_child_div = '<div data-tippy-content="' +  _product_value + '" data-tlite="s" title="' + _product_value + '" class="caf_swatch_childdiv caf-slider" caf-swatch-handle="' + _productelement.handle + '" caf-swatch-productid="' + _productelement.id + '" style="background-clip: content-box; padding: 2px; position:realtive; margin:2px; width: 50px; height: 50px; line-height: 50px; background-position: center; background-repeat: no-repeat; display: inline-block; border: 1px solid #F4F4F4; background-size: contain; border-radius: 1%; object-fit: contain; background-image:url(' +_variantimageSrc + ')" caf-swatchvalue="' + _product_value + '"></div>';
                  _collectionswatch_div = '<div caf-index="' +  _productoptions[o].position + '" style="text-align: left; display: inline-block; cursor: pointer;" caf-swatchtype="color" caf-optionname="' +  _productoptions[o].name + '" class="caf_swatch_div caf-slider-contain">' + 
                    _colleciton_swatch_child_div +'</div>';
                  _variantoptionschilddiv = _variantoptionschilddiv + _collectionswatch_div;*/
                      var _colleciton_swatch_child_div = '<div caf-index="' +  _productoptions[o].position + '" caf-swatchtype="color" caf-optionname="' +  _productoptions[o].name + '" data-tippy-content="' +  _product_value + '" data-tlite="s" title="' + _product_value + '" class="caf_swatch_childdiv caf-slider caf_swatch_div caf-slider-contain" caf-swatch-handle="' + _productelement.handle + '" caf-swatch-productid="' + _productelement.id + '" style="pointer: cursor; background-clip: content-box; padding: 2px; position:realtive; margin:2px; width: 50px; height: 50px; line-height: 50px; background-position: center; background-repeat: no-repeat; display: inline-block; border: 1px solid #F4F4F4; background-size: contain; border-radius: 1%; object-fit: contain; background-image:url(' +_variantimageSrc + ')" caf-swatchvalue="' + _product_value + '"></div>';

                      //_collectionswatch_div = '<div  style="text-align: left; display: inline-block; cursor: pointer;"   class="">' + 
                      // _colleciton_swatch_child_div +'</div>';
                      _variantoptionschilddiv = _variantoptionschilddiv + _colleciton_swatch_child_div;
                    }

                    var _collectionswatchdiv = '<div caf-data-template="collection" style="z-index: 50; display: inline-block; width: 90%; text-align: center;" id="caf_swatch_' +  _productelement.handle + '" class="caf_swatch_main_div" caf-handle="' +  _productelement.handle + '">' + 
                        //'<div class="container">' +
                        //'<button class="slick-prev slick-arrow" aria-label="Previous" type="button" style="">Previous</button>' +
                        //'<button class="slick-next slick-arrow" aria-label="Next" type="button" style="">Next</button>' +
                        //'</div>' +
                        _variantoptionschilddiv + '</div>';
                    //$('body').append(_collectionswatchdiv);
                  }

                }
                var _product_handle = _productsjson[p].product.handle;

                //console.log(_collectionspageatags);
                for(var e=0; e<_collectionspageatags.length; e++)
                {
                  var _atagHREF = _collectionspageatags[e].href;
                  if(_atagHREF.indexOf(_product_handle) != -1)
                  {
                    var _parentElement = _collectionspageatags[e].parentElement;
                    $(_parentElement).after(_collectionswatchdiv);
                  }
                }

                var swatchcolorelements = document.querySelectorAll('.caf_swatch_div');
                for (s = 0; s < swatchcolorelements.length; s++) {
                  var _colorElement = swatchcolorelements[s];
                  _colorElement.style.width = appvariables.Swatch_Size + 'px';
                  _colorElement.style.height = appvariables.Swatch_Size + 'px';
                  _colorElement.style.lineHeight = appvariables.Swatch_Size + 'px';
                  _colorElement.style.marginRight = '7px';
                  _colorElement.style.verticalAlign = 'middle';
                  _colorElement.style.backgroundClip = 'content-box';
                  //swatchcolorelements[s].style.boxShadow = '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)';
                  if (appvariables.Swatch_IsCircular == "True") {
                    _colorElement.style.borderRadius = '50%';
                    //_parentElement.style.borderRadius = '50%';

                  }
                  else {
                    _colorElement.style.borderRadius = '2px';
                    //_parentElement.style.borderRadius = '2px';
                  }

                  //console.log(swatchyp_swatchtype);
                  if (appvariables.SwatchType == 'ImageSwatch') {
                    //swatchcolorelements[s].style.borderRadius = '50%';
                    _colorElement.style.backgroundSize = 'cover';
                    /*margin-right: 5px; object-fit: cover; width: 30px; height: 30px; display: inline-block; background-image: url('{{ VariantImageArray[indexvalue] }}'); background-repeat: no-repeat; background-position: 50% 50%;*/
                  }

                  if (appvariables.SwatchType == 'HexColorCode') {

                    var colorcodes = appvariables.Swatch_SolidColors;
                    var colorcodeslist = '';
                    // Special Case for Sierrasocks
                    colorcodeslist = colorcodes.split(',');
                    _colorElement.style.backgroundImage = '';
                    // var _childElement = swatchcolorelements[s].children[0];
                    var _colorname = _colorElement.getAttribute('title');

                    for (var c = 0; c < colorcodeslist.length; c++) {
                      var colorname = colorcodeslist[c].split('_')[0];
                      colorname = colorname.replace('andsymbol', '&');
                      colorname = colorname.replace('plussymbol', '+');
                      colorname = colorname.replace('commasymbol', ',');
                      colorname = colorname.replace('slashsymbol', '/');
                      //colorname = colorname.replace(/spacesymbol/g, ' ');
                      //colorname = colorname.replace(/hypensymbol/g, '-');
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
                          _colorElement.style.backgroundColor = '#' + colorvalue1;
                        }
                        if (colorvalue2 == 'FFFFFF' || colorvalue2 == undefined || colorvalue2 == '') {
                          _colorElement.style.backgroundColor = '#' + colorvalue1;
                        }
                        else {
                          if (colorvalue3 == 'FFFFFF' || colorvalue3 == undefined || colorvalue3 == '') {
                            //swatchcolorelements[s].style.borderBottom = swatchSizeTriple + 'px solid #' + colorvalue1;
                            //swatchcolorelements[s].style.backgroundColor = swatchSizeTriple + 'px solid #' + colorvalue2;
                            //swatchcolorelements[s].style.borderTop = swatchSizeTriple + 'px solid #' + colorvalue3;
                            //console.log('linear-gradient( -180deg, #' + colorvalue1 + ', #' + colorvalue1 + ' 49%, #' + colorvalue2 + ' 49%, #' + colorvalue2 + ' 51%, #' + colorvalue3 + ' 51% )');
                            _colorElement.style.background = 'linear-gradient(-180deg, #' + colorvalue1 + ', #' + colorvalue1 + ' 49%, #ffffff 49%, #ffffff 49%, #' + colorvalue2 + ' 51%)';

                          }
                          else {
                            //swatchcolorelements[s].style.borderBottom = swatchSizeDouble + 'px solid #' + colorvalue1;
                            //swatchcolorelements[s].style.backgroundColor = '#' + colorvalue2;
                            //swatchcolorelements[s].style.borderTop = '#' + colorvalue3;
                            _colorElement.style.background = 'linear-gradient(-180deg, ' + colorvalue1 + ', #' + colorvalue1 + ' 30%, #' + colorvalue2 + ' 25%, #' + colorvalue2 + ' 55%, #' + colorvalue3 + ' 55%)';

                          }
                        }

                        if (colorvalue3 == 'FFFFFF' || colorvalue3 == undefined || colorvalue3 == '') {

                        }
                        else {
                          //swatchcolorelements[s].style.borderBottom = swatchSizeTriple + 'px solid #' + colorvalue1;
                          //swatchcolorelements[s].style.backgroundColor = swatchSizeTriple + 'px solid #' + colorvalue2;
                          //swatchcolorelements[s].style.borderTop = swatchSizeTriple + 'px solid #' + colorvalue3;
                          //console.log('linear-gradient( -180deg, #' + colorvalue1 + ', #' + colorvalue1 + ' 49%, #' + colorvalue2 + ' 49%, #' + colorvalue2 + ' 51%, #' + colorvalue3 + ' 51% )');
                          _colorElement.style.background = 'linear-gradient(-180deg, #' + colorvalue1 + ', #' + colorvalue1 + ' 30%, #' + colorvalue2 + ' 25%, #' + colorvalue2 + ' 55%, #' + colorvalue3 + ' 55%)';
                        }


                      }
                    }

                  }


                }
              }
              $('.caf_swatch_main_div').slick({
                infinite: false,
                arrows: true,
                slidesToShow: 4,
                slidesToScroll: 4,
                autoplay: false,
                draggable: false,
                responsive: true
              });
              /*$(".caf_swatch_main_div").lightSlider({
              controls:false,
              pager: false,
              autoWidth: true
            }); */
            }, function(error) {
              console.info('error', error);
            }, 25000);
            $('.caf_swatch_childdiv').click(function (e) {
              var swatchdiv = e.currentTarget;
              console.log(swatchdiv);
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
              swatchdiv.style.width = (appvariables.Swatch_Size * 1) + 2 + 'px';
              swatchdiv.style.height = (appvariables.Swatch_Size * 1) + 2 + 'px';
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
              //console.log(swatchParent);

              if (DomainName == 'refinedwears.com') {


                var _prevElement1 = swatchParent.parentElement;
                //console.log(_prevElement1);
                var _prevElement2 = _prevElement1.parentElement;
                //console.log(_prevElement2);
                var _prevElement3 = _prevElement2.parentElement;
                prevElement = _prevElement3.parentElement;
                //console.log(prevElement);
                //var prevElement = $(swatchParent).prev();
                var imageElements = $(prevElement).find('img');
                //console.log(imageElements);
                var allimages = document.querySelectorAll('img');
                productimagediv = imageElements[0];
                //console.log(productimagediv);
                productimagediv.setAttribute('data-srcset', '');
                productimagediv.setAttribute('srcset', '');
                var imageHeight = productimagediv.clientHeight;
                var imageWidth = productimagediv.clientWidth;
                var maxSize = Math.max(imageHeight, imageWidth);

                if (imagesrc != '') {
                  productimagediv.src = imagesrc;
                }

              }
              else {
                var prevElement = $(swatchParent).prev();
                var imageElements = $(prevElement[0]).find('img');
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
                  //console.log(prevElement);
                  var prevparentElement = prevElement[0].parentElement;
                  //console.log(prevparentElement);
                  var _imageElements = $(prevparentElement).find('img');
                  //console.log(_imageElements);
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
              }

              //console.log(prevElement);
              //console.log(imageElements);

              /*for (var i = 0; i < allimages.length; i++) {
                    var _imgclassName = allimages[i].className;
                    if (_imgclassName.includes(producthandle)) {
                        var correctimage = allimages[i];
                        var imageHeight = correctimage.clientHeight;
                        var imageWidth = correctimage.clientWidth;
                        var maxSize = Math.max(imageHeight, imageWidth);
                        correctimage.src = imagesrc;
                        correctimage.style.width = maxSize + 'px';
                        correctimage.style.height = maxSize + 'px';

                        correctimage.setAttribute('data-srcset', '');
                        correctimage.setAttribute('srcset', '');
                        correctimage.src = imagesrc;

                    }
                }*/

              /*for (var a = 0; a < allatags.length; a++) {
                    var ataghref = allatags[a].href;
                    var imageElements = $(allatags[a]).find('img');
                    productimagediv = imageElements[0];
                    if (ataghref.includes(producturl)) {
                        //allatags[a].setAttribute('href', producturl + '?variant=' + variantid);
                        var children1 = allatags[a].children;
                        for (var a1 = 0; a1 < children1.length; a1++) {

                            if (children1[a1].tagName == 'IMG') {
                                productimagediv = children1[a1];

                            }
                            var children2 = children1[a1].children;
                            for (var a2 = 0; a2 < children2.length; a2++) {

                                if (children2[a2].tagName == 'IMG') {
                                    productimagediv = children2[a2];

                                }

                                var children3 = children2[a2].children;
                                for (var a3 = 0; a3 < children3.length; a3++) {

                                    if (children3[a3].tagName == 'IMG') {
                                        productimagediv = children3[a3];

                                    }
                                }
                            }
                        }
                    }
                }*/


            });
          }
        }
      });
      var evObj = document.createEvent("Event");
      evObj.initEvent("change", true, true);
      $(document).on("mouseenter", ".caf_swatch_p_childdiv", function(e) {
        /*var currentSwatch = e.currentTarget;
          var _allcurrentSwatches = document.querySelectorAll('.caf_swatch_p_childdiv');
          for(var l=0; l<_allcurrentSwatches.length; l++)
          {
            _allcurrentSwatches[l].style.border = '1px solid #EAEAEA';
          }
          currentSwatch.style.border = '1px solid #000';*/
      });

      $(document).on("click", ".caf_swatch_p_childdiv", function(e) {
        var currentSwatch = e.currentTarget;
        var _allcurrentSwatches = document.querySelectorAll('.caf_swatch_p_childdiv');
        var _positionindex = currentSwatch.getAttribute('caf-index');
        var _allcurrentSwatches = document.querySelectorAll('.caf_swatch_p_childdiv');
        for(var l=0; l<_allcurrentSwatches.length; l++)
        {
          var _positionindex_ = _allcurrentSwatches[l].getAttribute('caf-index');
          //console.log(_positionindex + ',' + _positionindex_);
          if(_positionindex == _positionindex_)
          {
            _allcurrentSwatches[l].style.border = '1px solid #F4F4F4';
          }
        }
        currentSwatch.style.border = '1px solid #000';
        var _currentoptionvalue = currentSwatch.getAttribute('caf-swatchvalue');
        var currentSwatchParent = currentSwatch.parentElement;
        var _currentoptionindex= currentSwatchParent.getAttribute('caf-index');
        var _addtocartform = $('form[action="/cart/add"]')[0];
        if(_addtocartform != null)
        {
          var _selects = $(_addtocartform).find('SELECT');
          var correctselects = [];
          for(var s=0; s<_selects.length; s++)
          {
            var _selectname = _selects[s].name;
            if(_selectname != 'id')
            {
              correctselects.push(_selects[s]);
            }
          }
          var _correctoptionselect = correctselects[_currentoptionindex - 1];
          $(_correctoptionselect).val(_currentoptionvalue).trigger('change');
          _correctoptionselect.dispatchEvent(evObj);
          //console.log(_correctoptionselect);
        }
      });
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
