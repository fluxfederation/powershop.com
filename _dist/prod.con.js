!function(a){"use strict";function b(){}function c(a,b){if(e)return b.indexOf(a);for(var c=b.length;c--;)if(b[c]===a)return c;return-1}var d=b.prototype,e=Array.prototype.indexOf?!0:!1;d._getEvents=function(){return this._events||(this._events={})},d.getListeners=function(a){var b,c,d=this._getEvents();if("object"==typeof a){b={};for(c in d)d.hasOwnProperty(c)&&a.test(c)&&(b[c]=d[c])}else b=d[a]||(d[a]=[]);return b},d.getListenersAsObject=function(a){var b,c=this.getListeners(a);return c instanceof Array&&(b={},b[a]=c),b||c},d.addListener=function(a,b){var d,e=this.getListenersAsObject(a);for(d in e)e.hasOwnProperty(d)&&-1===c(b,e[d])&&e[d].push(b);return this},d.on=d.addListener,d.defineEvent=function(a){return this.getListeners(a),this},d.defineEvents=function(a){for(var b=0;b<a.length;b+=1)this.defineEvent(a[b]);return this},d.removeListener=function(a,b){var d,e,f=this.getListenersAsObject(a);for(e in f)f.hasOwnProperty(e)&&(d=c(b,f[e]),-1!==d&&f[e].splice(d,1));return this},d.off=d.removeListener,d.addListeners=function(a,b){return this.manipulateListeners(!1,a,b)},d.removeListeners=function(a,b){return this.manipulateListeners(!0,a,b)},d.manipulateListeners=function(a,b,c){var d,e,f=a?this.removeListener:this.addListener,g=a?this.removeListeners:this.addListeners;if("object"!=typeof b||b instanceof RegExp)for(d=c.length;d--;)f.call(this,b,c[d]);else for(d in b)b.hasOwnProperty(d)&&(e=b[d])&&("function"==typeof e?f.call(this,d,e):g.call(this,d,e));return this},d.removeEvent=function(a){var b,c=typeof a,d=this._getEvents();if("string"===c)delete d[a];else if("object"===c)for(b in d)d.hasOwnProperty(b)&&a.test(b)&&delete d[b];else delete this._events;return this},d.emitEvent=function(a,b){var c,d,e,f=this.getListenersAsObject(a);for(d in f)if(f.hasOwnProperty(d))for(c=f[d].length;c--;)e=b?f[d][c].apply(null,b):f[d][c](),e===!0&&this.removeListener(a,f[d][c]);return this},d.trigger=d.emitEvent,d.emit=function(a){var b=Array.prototype.slice.call(arguments,1);return this.emitEvent(a,b)},"function"==typeof define&&define.amd?define(function(){return b}):a.EventEmitter=b}(this),function(a){"use strict";var b=document.documentElement,c=function(){};b.addEventListener?c=function(a,b,c){a.addEventListener(b,c,!1)}:b.attachEvent&&(c=function(b,c,d){b[c+d]=d.handleEvent?function(){var b=a.event;b.target=b.target||b.srcElement,d.handleEvent.call(d,b)}:function(){var c=a.event;c.target=c.target||c.srcElement,d.call(b,c)},b.attachEvent("on"+c,b[c+d])});var d=function(){};b.removeEventListener?d=function(a,b,c){a.removeEventListener(b,c,!1)}:b.detachEvent&&(d=function(a,b,c){a.detachEvent("on"+b,a[b+c]);try{delete a[b+c]}catch(d){a[b+c]=void 0}});var e={bind:c,unbind:d};"function"==typeof define&&define.amd?define(e):a.eventie=e}(this),function(a){"use strict";function b(a,b){for(var c in b)a[c]=b[c];return a}function c(a){return"[object Array]"===i.call(a)}function d(a){var b=[];if(c(a))b=a;else if("number"==typeof a.length)for(var d=0,e=a.length;e>d;d++)b.push(a[d]);else b.push(a);return b}function e(a,c){function e(a,c,g){if(!(this instanceof e))return new e(a,c);"string"==typeof a&&(a=document.querySelectorAll(a)),this.elements=d(a),this.options=b({},this.options),"function"==typeof c?g=c:b(this.options,c),g&&this.on("always",g),this.getImages(),f&&(this.jqDeferred=new f.Deferred);var h=this;setTimeout(function(){h.check()})}function i(a){this.img=a}e.prototype=new a,e.prototype.options={},e.prototype.getImages=function(){this.images=[];for(var a=0,b=this.elements.length;b>a;a++){var c=this.elements[a];"IMG"===c.nodeName&&this.addImage(c);for(var d=c.querySelectorAll("img"),e=0,f=d.length;f>e;e++){var g=d[e];this.addImage(g)}}},e.prototype.addImage=function(a){var b=new i(a);this.images.push(b)},e.prototype.check=function(){function a(a,e){return b.options.debug&&h&&g.log("confirm",a,e),b.progress(a),c++,c===d&&b.complete(),!0}var b=this,c=0,d=this.images.length;if(this.hasAnyBroken=!1,!d)return this.complete(),void 0;for(var e=0;d>e;e++){var f=this.images[e];f.on("confirm",a),f.check()}},e.prototype.progress=function(a){this.hasAnyBroken=this.hasAnyBroken||!a.isLoaded,this.emit("progress",this,a),this.jqDeferred&&this.jqDeferred.notify(this,a)},e.prototype.complete=function(){var a=this.hasAnyBroken?"fail":"done";if(this.isComplete=!0,this.emit(a,this),this.emit("always",this),this.jqDeferred){var b=this.hasAnyBroken?"reject":"resolve";this.jqDeferred[b](this)}},f&&(f.fn.imagesLoaded=function(a,b){var c=new e(this,a,b);return c.jqDeferred.promise(f(this))});var j={};return i.prototype=new a,i.prototype.check=function(){var a=j[this.img.src];if(a)return this.useCached(a),void 0;if(j[this.img.src]=this,this.img.complete&&void 0!==this.img.naturalWidth)return this.confirm(0!==this.img.naturalWidth,"naturalWidth"),void 0;var b=this.proxyImage=new Image;c.bind(b,"load",this),c.bind(b,"error",this),b.src=this.img.src},i.prototype.useCached=function(a){if(a.isConfirmed)this.confirm(a.isLoaded,"cached was confirmed");else{var b=this;a.on("confirm",function(a){return b.confirm(a.isLoaded,"cache emitted confirmed"),!0})}},i.prototype.confirm=function(a,b){this.isConfirmed=!0,this.isLoaded=a,this.emit("confirm",this,b)},i.prototype.handleEvent=function(a){var b="on"+a.type;this[b]&&this[b](a)},i.prototype.onload=function(){this.confirm(!0,"onload"),this.unbindProxyEvents()},i.prototype.onerror=function(){this.confirm(!1,"onerror"),this.unbindProxyEvents()},i.prototype.unbindProxyEvents=function(){c.unbind(this.proxyImage,"load",this),c.unbind(this.proxyImage,"error",this)},e}var f=a.jQuery,g=a.console,h="undefined"!=typeof g,i=Object.prototype.toString;"function"==typeof define&&define.amd?define(["eventEmitter","eventie"],e):a.imagesLoaded=e(a.EventEmitter,a.eventie)}(window),function(a,b){var c=function(a,b,c){var d;return function(){function e(){c||a.apply(f,g),d=null}var f=this,g=arguments;d?clearTimeout(d):c&&a.apply(f,g),d=setTimeout(e,b||150)}};jQuery.fn[b]=function(a){return a?this.bind("resize",c(a)):this.trigger(b)}}(jQuery,"smartresize"),Object.keys||(Object.keys=function(a){var b,c=[];for(b in a)Object.prototype.hasOwnProperty.call(a,b)&&c.push(b);return c}),function(a){a.Nested=function(b,c){this.element=a(c),this._init(b)},a.Nested.settings={selector:".box",minWidth:50,minColumns:1,gutter:1,resizeToFit:!0,resizeToFitOptions:{resizeAny:!0},animate:!0,animationOptions:{speed:20,duration:100,queue:!0,complete:function(){}}},a.Nested.prototype={_init:function(b){var c=this;this.box=this.element,this.options=a.extend(!0,{},a.Nested.settings,b),this.elements=[],this._isResizing=!1,this._update=!0,this.maxy=new Array,a(window).smartresize(function(){c.resize()}),this._setBoxes()},_setBoxes:function(b,c){var d=this;this.idCounter=0,this.counter=0,this.t=0,this.maxHeight=0,this.total=this.box.find(this.options.selector),this.matrix={},this.gridrow=new Object,this.columns=Math.max(this.options.minColumns,parseInt(this.box.innerWidth()/(this.options.minWidth+this.options.gutter))+1);var e=this.options.minWidth,f=this.options.gutter,g="block";b=this.box.find(this.options.selector),a.each(b,function(){var b=parseInt(a(this).attr("class").replace(/^.*size([0-9]+).*$/,"$1")).toString().split(""),h="N"==b[0]?1:parseFloat(b[0]),i="a"==b[1]?1:parseFloat(b[1]),j=e*h+f*(h-1),k=e*i+f*(i-1);a(this).css({display:g,position:"absolute",width:j,height:k,top:a(this).offset().top,left:a(this).offset().left}).removeClass("nested-moved").attr("data-box",d.idCounter).attr("data-width",j),d.idCounter++,d._renderGrid(a(this),c)}),d.counter==d.total.length&&(d.options.resizeToFit&&(d.elements=d._fillGaps()),d._renderItems(d.elements),d.elements=[])},_addMatrixRow:function(a){if(this.matrix[a])return!1;this.matrix[a]={};for(var b=0;b<this.columns-1;b++){var c=b*(this.options.minWidth+this.options.gutter);this.matrix[a][c]="false"}},_updateMatrix:function(a){for(var b=parseInt(a.y)-this.box.offset().top,c=parseInt(a.x)-this.box.offset().left,d=0;d<a.height;d+=this.options.minWidth+this.options.gutter)for(var e=0;e<a.width;e+=this.options.minWidth+this.options.gutter){var f=c+e,g=b+d;this.matrix[g]||this._addMatrixRow(g),this.matrix[g][f]="true"}},_getObjectSize:function(b){var c=0;return a.each(b,function(){c++}),c},_fillGaps:function(){var b=this,c={};a.each(this.elements,function(a,c){b._updateMatrix(c)});var d=this.elements;d.sort(function(a,b){return a.y-b.y}),d.reverse();var e=d[0].y,f=0,g=this._getObjectSize(this.matrix);return a.each(this.matrix,function(h,i){g--,f=parseInt(h)+parseInt(b.box.offset().top),a.each(i,function(i,j){if("false"===j&&e>f){c.y||(c.y=h),c.x||(c.x=i),c.w||(c.w=0),c.h||(c.h=b.options.minWidth),c.w+=c.w?b.options.minWidth+b.options.gutter:b.options.minWidth;for(var k=0,l=1;g>l;l++){var m=parseInt(h)+parseInt(l*(b.options.minWidth+b.options.gutter));if(!b.matrix[m]||"false"!=b.matrix[m][i])break;k+=b.options.minWidth+b.options.gutter,b.matrix[m][i]="true"}c.h+(parseInt(k)/(b.options.minWidth+b.options.gutter)==g)?0:parseInt(k),c.ready=!0}else c.ready&&(a.each(d,function(e,f){return c.y<=d[e].y&&(b.options.resizeToFitOptions.resizeAny||c.w<=d[e].width&&c.h<=d[e].height)?(d.splice(e,1),a(f.$el).addClass("nested-moved"),b.elements.push({$el:a(f.$el),x:parseInt(c.x)+b.box.offset().left,y:parseInt(c.y)+b.box.offset().top,col:e,width:parseInt(c.w),height:parseInt(c.h)}),!1):void 0}),c={})})}),b.elements=d,b.elements},_renderGrid:function(a,b){this.counter++;var c,d=c=0,e=b?"prepend":"append",f=a.width(),g=a.height(),h=Math.ceil(f/(this.options.minWidth+this.options.gutter)),i=Math.ceil(g/(this.options.minWidth+this.options.gutter));for(h>this.options.minColumns&&(this.options.minColumns=h);;){for(var j=h;j>=0&&!this.gridrow[d+j];j--){this.gridrow[d+j]=new Object;for(var k=0;k<this.columns;k++)this.gridrow[d+j][k]=!1}for(var l=0;l<this.columns-h;l++){matrixY=d*(this.options.minWidth+this.options.gutter),this._addMatrixRow(matrixY);for(var m=!0,j=0;i>j;j++){for(var k=0;h>k&&this.gridrow[d+j];k++)if(this.gridrow[d+j][l+k]){m=!1;break}if(!m)break}if(m){for(var j=0;i>j;j++)for(var k=0;h>k&&this.gridrow[d+j];k++)this.gridrow[d+j][l+k]=!0;return this._pushItem(a,l*(this.options.minWidth+this.options.gutter),d*(this.options.minWidth+this.options.gutter),f,g,h,i,e),void 0}}d++}},_pushItem:function(a,b,c,d,e,f,g,h){"prepend"==h?this.elements.unshift({$el:a,x:b+this.box.offset().left,y:c+this.box.offset().top,width:d,height:e,cols:f,rows:g}):this.elements.push({$el:a,x:b+this.box.offset().left,y:c+this.box.offset().top,width:d,height:e,cols:f,rows:g})},_setHeight:function(b){var c=this;return a.each(b,function(a,b){var d=b.y+b.height-c.box.offset().top;d>c.maxHeight&&(c.maxHeight=d)}),c.maxHeight},_renderItems:function(b){this.box.css("height",this._setHeight(b)),b.reverse();var c=this.options.animationOptions.speed;this.options.animationOptions.effect;var d=this.options.animationOptions.duration,e=this.options.animationOptions.queue,f=this.options.animate,g=this.options.animationOptions.complete,h=0,i=0;a.each(b,function(j,k){$currLeft=a(k.$el).offset().left,$currTop=a(k.$el).offset().top,$currWidth=a(k.$el).width(),$currHeight=a(k.$el).width(),k.$el.attr("data-y",$currTop).attr("data-x",$currLeft),f&&e&&($currLeft!=k.x||$currTop!=k.y)&&(setTimeout(function(){k.$el.css({display:"block",width:k.width,height:k.height}).animate({left:k.x,top:k.y},d),i++,i==b.length&&g.call(void 0,b)},h*c),h++),!f||e||$currLeft==k.x&&$currTop==k.y||(setTimeout(function(){k.$el.css({display:"block",width:k.width,height:k.height}).animate({left:k.x,top:k.y},d),i++,i==b.length&&g.call(void 0,b)},h),h++),f||$currLeft==k.x&&$currTop==k.y||(k.$el.css({display:"block",width:k.width,height:k.height,left:k.x,top:k.y}),i++,i==b.length&&g.call(void 0,b))})},append:function(a){this._isResizing=!0,this._setBoxes(a,"append"),this._isResizing=!1},prepend:function(a){this._isResizing=!0,this._setBoxes(a,"prepend"),this._isResizing=!1},resize:function(){Object.keys(this.matrix[0]).length%Math.floor(this.element.width()/(this.options.minWidth+this.options.gutter))>0&&(this._isResizing=!0,this._setBoxes(this.box.find(this.options.selector)),this._isResizing=!1)}},a.fn.nested=function(b,c){return"string"==typeof b?this.each(function(){var d=a.data(this,"nested");d[b].apply(d,[c])}):this.each(function(){a.data(this,"nested",new a.Nested(b,this))}),this}}(jQuery),function(a){function b(a){return"object"==typeof a?a:{top:a,left:a}}var c=a.scrollTo=function(b,c,d){a(window).scrollTo(b,c,d)};c.defaults={axis:"xy",duration:parseFloat(a.fn.jquery)>=1.3?0:1,limit:!0},c.window=function(){return a(window)._scrollable()},a.fn._scrollable=function(){return this.map(function(){var b=this,c=!b.nodeName||-1!=a.inArray(b.nodeName.toLowerCase(),["iframe","#document","html","body"]);if(!c)return b;var d=(b.contentWindow||b).document||b.ownerDocument||b;return/webkit/i.test(navigator.userAgent)||"BackCompat"==d.compatMode?d.body:d.documentElement})},a.fn.scrollTo=function(d,e,f){return"object"==typeof e&&(f=e,e=0),"function"==typeof f&&(f={onAfter:f}),"max"==d&&(d=9e9),f=a.extend({},c.defaults,f),e=e||f.duration,f.queue=f.queue&&f.axis.length>1,f.queue&&(e/=2),f.offset=b(f.offset),f.over=b(f.over),this._scrollable().each(function(){function g(a){j.animate(l,e,f.easing,a&&function(){a.call(this,d,f)})}if(null!=d){var h,i=this,j=a(i),k=d,l={},m=j.is("html,body");switch(typeof k){case"number":case"string":if(/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(k)){k=b(k);break}if(k=a(k,this),!k.length)return;case"object":(k.is||k.style)&&(h=(k=a(k)).offset())}a.each(f.axis.split(""),function(a,b){var d="x"==b?"Left":"Top",e=d.toLowerCase(),n="scroll"+d,o=i[n],p=c.max(i,b);if(h)l[n]=h[e]+(m?0:o-j.offset()[e]),f.margin&&(l[n]-=parseInt(k.css("margin"+d))||0,l[n]-=parseInt(k.css("border"+d+"Width"))||0),l[n]+=f.offset[e]||0,f.over[e]&&(l[n]+=k["x"==b?"width":"height"]()*f.over[e]);else{var q=k[e];l[n]=q.slice&&"%"==q.slice(-1)?parseFloat(q)/100*p:q}f.limit&&/^\d+$/.test(l[n])&&(l[n]=l[n]<=0?0:Math.min(l[n],p)),!a&&f.queue&&(o!=l[n]&&g(f.onAfterFirst),delete l[n])}),g(f.onAfter)}}).end()},c.max=function(b,c){var d="x"==c?"Width":"Height",e="scroll"+d;if(!a(b).is("html,body"))return b[e]-a(b)[d.toLowerCase()]();var f="client"+d,g=b.ownerDocument.documentElement,h=b.ownerDocument.body;return Math.max(g[e],h[e])-Math.min(g[f],h[f])}}(jQuery),function(a){function b(b,c,d){var e=c.hash.slice(1),f=document.getElementById(e)||document.getElementsByName(e)[0];if(f){b&&b.preventDefault();var g=a(d.target);if(!(d.lock&&g.is(":animated")||d.onBefore&&d.onBefore.call(d,b,f,g)===!1)){if(d.stop&&g.stop(!0),d.hash){var h=f.id==e?"id":"name",i=a("<a> </a>").attr(h,e).css({position:"absolute",top:a(window).scrollTop(),left:a(window).scrollLeft()});f[h]="",a("body").prepend(i),location=c.hash,i.remove(),f[h]=e}g.scrollTo(f,d).trigger("notify.serialScroll",[f])}}}var c=location.href.replace(/#.*/,""),d=a.localScroll=function(b){a("body").localScroll(b)};d.defaults={duration:1e3,axis:"y",event:"click",stop:!0,target:window,reset:!0},d.hash=function(c){if(location.hash){if(c=a.extend({},d.defaults,c),c.hash=!1,c.reset){var e=c.duration;delete c.duration,a(c.target).scrollTo(0,c),c.duration=e}b(0,location,c)}},a.fn.localScroll=function(e){function f(){return!(!this.href||!this.hash||this.href.replace(this.hash,"")!=c||e.filter&&!a(this).is(e.filter))}return e=a.extend({},d.defaults,e),e.lazy?this.bind(e.event,function(c){var d=a([c.target,c.target.parentNode]).filter(f)[0];d&&b(c,d,e)}):this.find("a,area").filter(f).bind(e.event,function(a){b(a,this,e)}).end().end()}}(jQuery),function(a){"use strict";function b(b){return!b||void 0!==b.allowPageScroll||void 0===b.swipe&&void 0===b.swipeStatus||(b.allowPageScroll=j),void 0!==b.click&&void 0===b.tap&&(b.tap=b.click),b||(b={}),b=a.extend({},a.fn.swipe.defaults,b),this.each(function(){var d=a(this),e=d.data(z);e||(e=new c(this,b),d.data(z,e))})}function c(b,c){function A(b){if(!(hb()||a(b.target).closest(c.excludedElements,Qb).length>0)){var d,e=b.originalEvent?b.originalEvent:b,f=y?e.touches[0]:e;return Rb=u,y?Sb=e.touches.length:b.preventDefault(),Hb=0,Ib=null,Ob=null,Jb=0,Kb=0,Lb=0,Mb=1,Nb=0,Tb=mb(),Pb=pb(),fb(),!y||Sb===c.fingers||c.fingers===s||P()?(jb(0,f),Ub=yb(),2==Sb&&(jb(1,e.touches[1]),Kb=Lb=sb(Tb[0].start,Tb[1].start)),(c.swipeStatus||c.pinchStatus)&&(d=H(e,Rb))):d=!1,d===!1?(Rb=x,H(e,Rb),d):(ib(!0),void 0)}}function B(a){var b=a.originalEvent?a.originalEvent:a;if(Rb!==w&&Rb!==x&&!gb()){var d,e=y?b.touches[0]:b,f=kb(e);if(Vb=yb(),y&&(Sb=b.touches.length),Rb=v,2==Sb&&(0==Kb?(jb(1,b.touches[1]),Kb=Lb=sb(Tb[0].start,Tb[1].start)):(kb(b.touches[1]),Lb=sb(Tb[0].end,Tb[1].end),Ob=ub(Tb[0].end,Tb[1].end)),Mb=tb(Kb,Lb),Nb=Math.abs(Kb-Lb)),Sb===c.fingers||c.fingers===s||!y||P()){if(Ib=xb(f.start,f.end),N(a,Ib),Hb=vb(f.start,f.end),Jb=rb(),nb(Ib,Hb),(c.swipeStatus||c.pinchStatus)&&(d=H(b,Rb)),!c.triggerOnTouchEnd||c.triggerOnTouchLeave){var g=!0;if(c.triggerOnTouchLeave){var h=zb(this);g=Ab(f.end,h)}!c.triggerOnTouchEnd&&g?Rb=G(v):c.triggerOnTouchLeave&&!g&&(Rb=G(w)),(Rb==x||Rb==w)&&H(b,Rb)}}else Rb=x,H(b,Rb);d===!1&&(Rb=x,H(b,Rb))}}function C(a){var b=a.originalEvent;return y&&b.touches.length>0?(eb(),!0):(gb()&&(Sb=Xb),a.preventDefault(),Vb=yb(),Jb=rb(),K()?(Rb=x,H(b,Rb)):c.triggerOnTouchEnd||0==c.triggerOnTouchEnd&&Rb===v?(Rb=w,H(b,Rb)):!c.triggerOnTouchEnd&&W()?(Rb=w,I(b,Rb,n)):Rb===v&&(Rb=x,H(b,Rb)),ib(!1),void 0)}function D(){Sb=0,Vb=0,Ub=0,Kb=0,Lb=0,Mb=1,fb(),ib(!1)}function E(a){var b=a.originalEvent;c.triggerOnTouchLeave&&(Rb=G(w),H(b,Rb))}function F(){Qb.unbind(Cb,A),Qb.unbind(Gb,D),Qb.unbind(Db,B),Qb.unbind(Eb,C),Fb&&Qb.unbind(Fb,E),ib(!1)}function G(a){var b=a,d=M(),e=J(),f=K();return!d||f?b=x:!e||a!=v||c.triggerOnTouchEnd&&!c.triggerOnTouchLeave?!e&&a==w&&c.triggerOnTouchLeave&&(b=x):b=w,b}function H(a,b){var c=void 0;return T()||S()?c=I(a,b,l):(Q()||P())&&c!==!1&&(c=I(a,b,m)),cb()&&c!==!1?c=I(a,b,o):db()&&c!==!1?c=I(a,b,p):bb()&&c!==!1&&(c=I(a,b,n)),b===x&&D(a),b===w&&(y?0==a.touches.length&&D(a):D(a)),c}function I(b,j,k){var q=void 0;if(k==l){if(Qb.trigger("swipeStatus",[j,Ib||null,Hb||0,Jb||0,Sb]),c.swipeStatus&&(q=c.swipeStatus.call(Qb,b,j,Ib||null,Hb||0,Jb||0,Sb),q===!1))return!1;if(j==w&&R()){if(Qb.trigger("swipe",[Ib,Hb,Jb,Sb]),c.swipe&&(q=c.swipe.call(Qb,b,Ib,Hb,Jb,Sb),q===!1))return!1;switch(Ib){case d:Qb.trigger("swipeLeft",[Ib,Hb,Jb,Sb]),c.swipeLeft&&(q=c.swipeLeft.call(Qb,b,Ib,Hb,Jb,Sb));break;case e:Qb.trigger("swipeRight",[Ib,Hb,Jb,Sb]),c.swipeRight&&(q=c.swipeRight.call(Qb,b,Ib,Hb,Jb,Sb));break;case f:Qb.trigger("swipeUp",[Ib,Hb,Jb,Sb]),c.swipeUp&&(q=c.swipeUp.call(Qb,b,Ib,Hb,Jb,Sb));break;case g:Qb.trigger("swipeDown",[Ib,Hb,Jb,Sb]),c.swipeDown&&(q=c.swipeDown.call(Qb,b,Ib,Hb,Jb,Sb))}}}if(k==m){if(Qb.trigger("pinchStatus",[j,Ob||null,Nb||0,Jb||0,Sb,Mb]),c.pinchStatus&&(q=c.pinchStatus.call(Qb,b,j,Ob||null,Nb||0,Jb||0,Sb,Mb),q===!1))return!1;if(j==w&&O())switch(Ob){case h:Qb.trigger("pinchIn",[Ob||null,Nb||0,Jb||0,Sb,Mb]),c.pinchIn&&(q=c.pinchIn.call(Qb,b,Ob||null,Nb||0,Jb||0,Sb,Mb));break;case i:Qb.trigger("pinchOut",[Ob||null,Nb||0,Jb||0,Sb,Mb]),c.pinchOut&&(q=c.pinchOut.call(Qb,b,Ob||null,Nb||0,Jb||0,Sb,Mb))}}return k==n?(j===x||j===w)&&(clearTimeout(Zb),X()&&!$()?(Yb=yb(),Zb=setTimeout(a.proxy(function(){Yb=null,Qb.trigger("tap",[b.target]),c.tap&&(q=c.tap.call(Qb,b,b.target))},this),c.doubleTapThreshold)):(Yb=null,Qb.trigger("tap",[b.target]),c.tap&&(q=c.tap.call(Qb,b,b.target)))):k==o?(j===x||j===w)&&(clearTimeout(Zb),Yb=null,Qb.trigger("doubletap",[b.target]),c.doubleTap&&(q=c.doubleTap.call(Qb,b,b.target))):k==p&&(j===x||j===w)&&(clearTimeout(Zb),Yb=null,Qb.trigger("longtap",[b.target]),c.longTap&&(q=c.longTap.call(Qb,b,b.target))),q}function J(){var a=!0;return null!==c.threshold&&(a=Hb>=c.threshold),a}function K(){var a=!1;return null!==c.cancelThreshold&&null!==Ib&&(a=ob(Ib)-Hb>=c.cancelThreshold),a}function L(){return null!==c.pinchThreshold?Nb>=c.pinchThreshold:!0}function M(){var a;return a=c.maxTimeThreshold?Jb>=c.maxTimeThreshold?!1:!0:!0}function N(a,b){if(c.allowPageScroll===j||P())a.preventDefault();else{var h=c.allowPageScroll===k;switch(b){case d:(c.swipeLeft&&h||!h&&c.allowPageScroll!=q)&&a.preventDefault();break;case e:(c.swipeRight&&h||!h&&c.allowPageScroll!=q)&&a.preventDefault();break;case f:(c.swipeUp&&h||!h&&c.allowPageScroll!=r)&&a.preventDefault();break;case g:(c.swipeDown&&h||!h&&c.allowPageScroll!=r)&&a.preventDefault()}}}function O(){var a=U(),b=V(),c=L();return a&&b&&c}function P(){return!!(c.pinchStatus||c.pinchIn||c.pinchOut)}function Q(){return!(!O()||!P())}function R(){var a=M(),b=J(),c=U(),d=V(),e=K(),f=!e&&d&&c&&b&&a;return f}function S(){return!!(c.swipe||c.swipeStatus||c.swipeLeft||c.swipeRight||c.swipeUp||c.swipeDown)}function T(){return!(!R()||!S())}function U(){return Sb===c.fingers||c.fingers===s||!y}function V(){return 0!==Tb[0].end.x}function W(){return!!c.tap}function X(){return!!c.doubleTap}function Y(){return!!c.longTap}function Z(){if(null==Yb)return!1;var a=yb();return X()&&a-Yb<=c.doubleTapThreshold}function $(){return Z()}function _(){return!(1!==Sb&&y||!isNaN(Hb)&&0!==Hb)}function ab(){return Jb>c.longTapThreshold&&t>Hb}function bb(){return!(!_()||!W())}function cb(){return!(!Z()||!X())}function db(){return!(!ab()||!Y())}function eb(){Wb=yb(),Xb=event.touches.length+1}function fb(){Wb=0,Xb=0}function gb(){var a=!1;if(Wb){var b=yb()-Wb;b<=c.fingerReleaseThreshold&&(a=!0)}return a}function hb(){return!(Qb.data(z+"_intouch")!==!0)}function ib(a){a===!0?(Qb.bind(Db,B),Qb.bind(Eb,C),Fb&&Qb.bind(Fb,E)):(Qb.unbind(Db,B,!1),Qb.unbind(Eb,C,!1),Fb&&Qb.unbind(Fb,E,!1)),Qb.data(z+"_intouch",a===!0)}function jb(a,b){var c=void 0!==b.identifier?b.identifier:0;return Tb[a].identifier=c,Tb[a].start.x=Tb[a].end.x=b.pageX||b.clientX,Tb[a].start.y=Tb[a].end.y=b.pageY||b.clientY,Tb[a]}function kb(a){var b=void 0!==a.identifier?a.identifier:0,c=lb(b);return c.end.x=a.pageX||a.clientX,c.end.y=a.pageY||a.clientY,c}function lb(a){for(var b=0;b<Tb.length;b++)if(Tb[b].identifier==a)return Tb[b]}function mb(){for(var a=[],b=0;5>=b;b++)a.push({start:{x:0,y:0},end:{x:0,y:0},identifier:0});return a}function nb(a,b){b=Math.max(b,ob(a)),Pb[a].distance=b}function ob(a){return Pb[a].distance}function pb(){var a={};return a[d]=qb(d),a[e]=qb(e),a[f]=qb(f),a[g]=qb(g),a}function qb(a){return{direction:a,distance:0}}function rb(){return Vb-Ub}function sb(a,b){var c=Math.abs(a.x-b.x),d=Math.abs(a.y-b.y);return Math.round(Math.sqrt(c*c+d*d))}function tb(a,b){var c=1*(b/a);return c.toFixed(2)}function ub(){return 1>Mb?i:h}function vb(a,b){return Math.round(Math.sqrt(Math.pow(b.x-a.x,2)+Math.pow(b.y-a.y,2)))}function wb(a,b){var c=a.x-b.x,d=b.y-a.y,e=Math.atan2(d,c),f=Math.round(180*e/Math.PI);return 0>f&&(f=360-Math.abs(f)),f}function xb(a,b){var c=wb(a,b);return 45>=c&&c>=0?d:360>=c&&c>=315?d:c>=135&&225>=c?e:c>45&&135>c?g:f}function yb(){var a=new Date;return a.getTime()}function zb(b){b=a(b);var c=b.offset(),d={left:c.left,right:c.left+b.outerWidth(),top:c.top,bottom:c.top+b.outerHeight()};return d}function Ab(a,b){return a.x>b.left&&a.x<b.right&&a.y>b.top&&a.y<b.bottom}var Bb=y||!c.fallbackToMouseEvents,Cb=Bb?"touchstart":"mousedown",Db=Bb?"touchmove":"mousemove",Eb=Bb?"touchend":"mouseup",Fb=Bb?null:"mouseleave",Gb="touchcancel",Hb=0,Ib=null,Jb=0,Kb=0,Lb=0,Mb=1,Nb=0,Ob=0,Pb=null,Qb=a(b),Rb="start",Sb=0,Tb=null,Ub=0,Vb=0,Wb=0,Xb=0,Yb=0,Zb=null;try{Qb.bind(Cb,A),Qb.bind(Gb,D)}catch($b){a.error("events not supported "+Cb+","+Gb+" on jQuery.swipe")}this.enable=function(){return Qb.bind(Cb,A),Qb.bind(Gb,D),Qb},this.disable=function(){return F(),Qb},this.destroy=function(){return F(),Qb.data(z,null),Qb},this.option=function(b,d){if(void 0!==c[b]){if(void 0===d)return c[b];c[b]=d}else a.error("Option "+b+" does not exist on jQuery.swipe.options")}}var d="left",e="right",f="up",g="down",h="in",i="out",j="none",k="auto",l="swipe",m="pinch",n="tap",o="doubletap",p="longtap",q="horizontal",r="vertical",s="all",t=10,u="start",v="move",w="end",x="cancel",y="ontouchstart"in window,z="TouchSwipe",A={fingers:1,threshold:75,cancelThreshold:null,pinchThreshold:20,maxTimeThreshold:null,fingerReleaseThreshold:250,longTapThreshold:500,doubleTapThreshold:200,swipe:null,swipeLeft:null,swipeRight:null,swipeUp:null,swipeDown:null,swipeStatus:null,pinchIn:null,pinchOut:null,pinchStatus:null,click:null,tap:null,doubleTap:null,longTap:null,triggerOnTouchEnd:!0,triggerOnTouchLeave:!1,allowPageScroll:"auto",fallbackToMouseEvents:!0,excludedElements:"button, input, select, textarea, a, .noSwipe"};a.fn.swipe=function(c){var d=a(this),e=d.data(z);if(e&&"string"==typeof c){if(e[c])return e[c].apply(this,Array.prototype.slice.call(arguments,1));a.error("Method "+c+" does not exist on jQuery.swipe")}else if(!(e||"object"!=typeof c&&c))return b.apply(this,arguments);return d},a.fn.swipe.defaults=A,a.fn.swipe.phases={PHASE_START:u,PHASE_MOVE:v,PHASE_END:w,PHASE_CANCEL:x},a.fn.swipe.directions={LEFT:d,RIGHT:e,UP:f,DOWN:g,IN:h,OUT:i},a.fn.swipe.pageScroll={NONE:j,HORIZONTAL:q,VERTICAL:r,AUTO:k},a.fn.swipe.fingers={ONE:1,TWO:2,THREE:3,ALL:s}}(jQuery),function(a){a.belowthefold=function(b,c){var d=a(window).height()+a(window).scrollTop();return d<=a(b).offset().top-c.threshold},a.abovethetop=function(b,c){var d=a(window).scrollTop();return d>=a(b).offset().top+a(b).height()-c.threshold},a.rightofscreen=function(b,c){var d=a(window).width()+a(window).scrollLeft();return d<=a(b).offset().left-c.threshold},a.leftofscreen=function(b,c){var d=a(window).scrollLeft();return d>=a(b).offset().left+a(b).width()-c.threshold},a.inviewport=function(b,c){return!(a.rightofscreen(b,c)||a.leftofscreen(b,c)||a.belowthefold(b,c)||a.abovethetop(b,c))},a.extend(a.expr[":"],{"below-the-fold":function(b){return a.belowthefold(b,{threshold:0})},"above-the-top":function(b){return a.abovethetop(b,{threshold:0})},"left-of-screen":function(b){return a.leftofscreen(b,{threshold:0})},"right-of-screen":function(b){return a.rightofscreen(b,{threshold:0})},"in-viewport":function(b){return a.inviewport(b,{threshold:0})}})}(jQuery),function(){!function(a,b){return a(document).ready(function(){var c,d,e,f;return c=a("[data-parallax-speed]"),d=a(".parallax-height"),e=a(".parallax_intro"),f=function(){var f,g;return f=a(b).scrollTop(),g=a(b).height(),c.each(function(b,c){var d,e,g,h,i,j,k,l;return h=a(c).data("parallax-offset-y"),j=a(c).data("parallax-speed"),k=a(c).data("parallax-stop-y"),e=a(c).data("parallax-max-y"),d=a(c).data("debug"),g=a(c).data("parallax-min-y"),i=a(c).data("parallax-reverse-speed"),k&&f-1>=k?(null==i&&(i=1),a(c).addClass("stopped"),l=e-Math.abs(k-f)*i):(a(c).removeClass("stopped"),l=h?h-f*j:-(f*j)),null!=d&&(console.log("minY "+g),console.log("top "+l),console.log(k),console.log(f),console.log(e),console.log("speed reverse: "+i)),g&&g>l&&(l=g),a(c).css({top:l}).trigger("parallaxed",[{top:l,scrolledY:f}])}),d.each(function(c,d){var e,f,h,i,j,k,l,m,n,o,p;return h=a(d).data("parallax-destheight")||g,"%"===h.substr(-1)&&(h=parseInt(h.replace(/%/,""))/100*g),m=a(d).data("parallax-speed")||.3,o=a(d).position().top,l=a(b).scrollTop(),e=o-g,p=l+g>o,k=o+a(d).height()<l,f=!1,n=o-g,0>n&&(n=0),p&&!k?(i=l-n,1>o&&(i=h),j=(i-h)/2,i>h&&(i=h),a(d).css({height:Math.ceil(i)}).find(".parallax-background").css({top:j})):void 0}),e.each(function(b,c){var d,e,g,h,i;return e=a(c).data("last_scrolled"),e||(e=0),a(c).data("last_scrolled",f),i=e-f,d=parseInt(a(c).css("height").replace(/%/,"")),h=d/a(c).height(),g=d+i*h,a(c).siblings("section").first().css({paddingTop:g})})},a(".parallax-background").css({height:a(b).height(),width:a(b).width}),a(b).resize(function(){return a(".parallax-background").css({height:a(b).height(),width:a(b).width})}),a(b).scroll(function(){var a;return"undefined"!=typeof a&&null!==a&&(clearTimeout(a),a=null),f()}),f()})}(jQuery,window),function(a,b){return a(document).ready(function(){var c,d,e,f,g,h,i,j,k,l,m,n;return n=a(".section"),c=a("#content"),j=a("#nav"),f=a("#header"),m=a("html"),l=a("#office_photos"),g=!1,d=a(".fade-in"),d.css({opacity:0}),e=function(){var c,d;return d=a(b).scrollTop(),d>=140?"rgba(0, 0, 0, 0.2)":1>d?"rgba(0, 0, 0, 0)":(c=d/140/5,"rgba(0, 0, 0, "+c+")")},a(b).scroll(function(){var c,g,h;return h=a(b).scrollTop(),c=f.css("background"),g=e(),c!==g&&f.css({background:g}),d.each(function(b,c){return a(c).data("fade-in-at")>=h&&!a(c).data("showing")?a(c).data("showing",!0).animate({opacity:1}):void 0})}),a(".show_nav").click(function(b){return b.preventDefault(),m.css({overflow:"hidden"}),f.css({background:"rgba(0, 0, 0, 0.8)",height:"100%"}),a(this).fadeOut(function(){return a(".close_nav").fadeIn()})}),a(".close_nav").click(function(b){return b.preventDefault(),m.css({"overflow-y":"scroll"}),f.css({background:e(),height:"50px"}),a(this).fadeOut(),a(".show_nav").fadeIn()}),l.length>0&&(h=function(){return a("[data-image]",l).each(function(b,c){var d,e;if(a(c).data("img-loaded")!==!0&&!a(c).is(":right-of-screen")&&!a(c).is(":left-of-screen"))return a(c).data("img-loaded",!0),e=a(c).data("image"),d=a("<img />").attr("src",e).hide().on("dragstart",function(a){return a.preventDefault()}),setTimeout(function(){return a(c).append(d).imagesLoaded().always(function(){return a(c).animate({opacity:1}),d.fadeIn(),a(c).parents("li").animate({opacity:1})},80*Math.random())})})},i=!1,k=a("ul",l),k.swipe({swipe:function(c,d){var e,f,g,i,j;return j=a(b).width(),i=j/1.2,e=parseInt(k.css("marginLeft").replace(/px/,"")),f=-1*(j/2),g=j-k.width(),"right"===d?(e+i>f?k.animate({marginLeft:f+"px"}):k.animate({marginLeft:e+i+"px"}),h(),void 0):"left"===d?(g>e-i?k.animate({marginLeft:g+"px"}):k.animate({marginLeft:e-i+"px"}),h()):void 0}}),a(b).scroll(function(){return i?void 0:a(b).scrollTop()+a(b).height()>l.offset().top?(i=!0,h()):void 0})),a("#map").length>0?google.maps.event.addDomListener(b,"load",function(){var c,d,e,f;return f={center:new google.maps.LatLng(-41.287538,174.77601),zoom:16,disableDefaultUI:!0,draggable:!1,panControl:!1,mapTypeId:google.maps.MapTypeId.ROADMAP,styles:b.map_styles},d=new google.maps.Map(a("#map").get(0),f),c={url:"/img/face.png",size:new google.maps.Size(62,62),origin:new google.maps.Point(0,0),anchor:new google.maps.Point(0,0)},e=new google.maps.Marker({position:f.center,map:d,icon:c,animation:google.maps.Animation.DROP})}):void 0})}(jQuery,window),function(a){return a(document).ready(function(){var b,c,d;return c=!1,d=a("section.anchor"),b=function(b){var c;return a("#jumper li").removeClass("active"),c=a(b).attr("id"),c="[href=#"+c,c+="]",a("#jumper li").find(c).parents("li").addClass("active")},a.localScroll.hash({queue:!0,duration:700,onBefore:function(a,d){return c=!0,b(d)},onAfter:function(){return c=!1}}),a.localScroll({queue:!0,duration:700,hash:!0,onBefore:function(a,d){return c=!0,b(d)},onAfter:function(){return c=!1}}),a("#jumper").localScroll(),a(document).scroll(function(){var e,f,g,h;if(!c)return f=a("body").height(),h=a(document).scrollTop(),g=120,d.length>0?(e=d.first(),d.each(function(b,c){return a(c).position().top<h+g?e=a(c):void 0}),b(e)):void 0})})}(jQuery,window)}.call(this);