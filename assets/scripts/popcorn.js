!function(t,e){function n(t){_.put.call(this,t)}function a(t){this.parent=t,this.byStart=[{start:-1,end:-1}],this.byEnd=[{start:-1,end:-1}],this.animating=[],this.startIndex=0,this.endIndex=0,this.previousUpdateTime=-1,this.count=1}function r(t,e,n){return t[e]&&t[e]===n}function i(t,e){var n={};for(var a in t)l.call(e,a)&&l.call(t,a)&&(n[a]=t[a]);return n}function o(t,e){return function(){if(T.plugin.debug)return t.apply(this,arguments);try{return t.apply(this,arguments)}catch(n){T.plugin.errors.push({plugin:e,thrown:n,source:t.toString()}),this.emit("pluginerror",T.plugin.errors)}}}if(e.addEventListener){var s=Array.prototype,d=Object.prototype,u=s.forEach,c=s.slice,l=d.hasOwnProperty,p=d.toString,f=t.Popcorn,h=[],v=!1,m=!1,g={events:{hash:{},apis:{}}},y=function(){return t.requestAnimationFrame||t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||t.oRequestAnimationFrame||t.msRequestAnimationFrame||function(e,n){t.setTimeout(e,16)}}(),E=function(t){return Object.keys?Object.keys(t):function(t){var e,n=[];for(e in t)l.call(t,e)&&n.push(e);return n}(t)},_={put:function(t){for(var e in t)t.hasOwnProperty(e)&&(this[e]=t[e])}},T=function(t,e){return new T.p.init(t,e||null)};T.version="@VERSION",T.isSupported=!0,T.instances=[],T.p=T.prototype={init:function(t,n){var r,i,o=this;{if("function"!=typeof t){if("string"==typeof t)try{r=e.querySelector(t)}catch(e){throw new Error("Popcorn.js Error: Invalid media element selector: "+t)}if(this.media=r||t,i=this.media.nodeName&&this.media.nodeName.toLowerCase()||"video",this[i]=this.media,this.options=T.extend({},n)||{},this.id=this.options.id||T.guid(i),T.byId(this.id))throw new Error("Popcorn.js Error: Cannot use duplicate ID ("+this.id+")");this.isDestroyed=!1,this.data={running:{cue:[]},timeUpdate:T.nop,disabled:{},events:{},hooks:{},history:[],state:{volume:this.media.volume},trackRefs:{},trackEvents:new a(this)},T.instances.push(this);var s=function(){o.media.currentTime<0&&(o.media.currentTime=0),o.media.removeEventListener("loadedmetadata",s,!1);var t,e,n,a,r,i;t=o.media.duration,e=t!=t?Number.MAX_VALUE:t+1,T.addTrackEvent(o,{start:e,end:e}),o.isDestroyed||(o.data.durationChange=function(){var t=o.media.duration,e=t+1,n=o.data.trackEvents.byStart,a=o.data.trackEvents.byEnd;n.pop(),a.pop();for(var r=a.length-1;r>0;r--)a[r].end>t&&o.removeTrackEvent(a[r]._id);for(var i=0;i<n.length;i++)n[i].end>t&&o.removeTrackEvent(n[i]._id);o.data.trackEvents.byEnd.push({start:e,end:e}),o.data.trackEvents.byStart.push({start:e,end:e})},o.media.addEventListener("durationchange",o.data.durationChange,!1)),o.options.frameAnimation?(o.data.timeUpdate=function(){T.timeUpdate(o,{}),T.forEach(T.manifest,function(t,e){if(n=o.data.running[e]){r=n.length;for(var s=0;s<r;s++)a=n[s],i=a._natives,i&&i.frame&&i.frame.call(o,{},a,o.currentTime())}}),o.emit("timeupdate"),!o.isDestroyed&&y(o.data.timeUpdate)},!o.isDestroyed&&y(o.data.timeUpdate)):(o.data.timeUpdate=function(t){T.timeUpdate(o,t)},o.isDestroyed||o.media.addEventListener("timeupdate",o.data.timeUpdate,!1))};return o.media.addEventListener("error",function(){o.error=o.media.error},!1),o.media.readyState>=1?s():o.media.addEventListener("loadedmetadata",s,!1),this}if("complete"===e.readyState)return void t(e,T);if(h.push(t),!v){v=!0;var d=function(){m=!0,e.removeEventListener("DOMContentLoaded",d,!1);for(var t=0,n=h.length;t<n;t++)h[t].call(e,T);h=null};e.addEventListener("DOMContentLoaded",d,!1)}}}},T.p.init.prototype=T.p,T.byId=function(t){for(var e=T.instances,n=e.length,a=0;a<n;a++)if(e[a].id===t)return e[a];return null},T.forEach=function(t,e,n){if(!t||!e)return{};n=n||this;var a,r;if(u&&t.forEach===u)return t.forEach(e,n);if("[object NodeList]"===p.call(t)){for(a=0,r=t.length;a<r;a++)e.call(n,t[a],a,t);return t}for(a in t)l.call(t,a)&&e.call(n,t[a],a,t);return t},T.extend=function(t){var e=t,n=c.call(arguments,1);return T.forEach(n,function(t){for(var n in t)e[n]=t[n]}),e},T.extend(T,{noConflict:function(e){return e&&(t.Popcorn=f),T},error:function(t){throw new Error(t)},guid:function(t){return T.guid.counter++,(t?t:"")+(+new Date+T.guid.counter)},sizeOf:function(t){var e=0;for(var n in t)e++;return e},isArray:Array.isArray||function(t){return"[object Array]"===p.call(t)},nop:function(){},position:function(n){if(!n.parentNode)return null;var a,r,i,o,s,d,u=n.getBoundingClientRect(),c={},l=(n.ownerDocument,e.documentElement),p=e.body;a=l.clientTop||p.clientTop||0,r=l.clientLeft||p.clientLeft||0,i=t.pageYOffset&&l.scrollTop||p.scrollTop,o=t.pageXOffset&&l.scrollLeft||p.scrollLeft,s=Math.ceil(u.top+i-a),d=Math.ceil(u.left+o-r);for(var f in u)c[f]=Math.round(u[f]);return T.extend({},c,{top:s,left:d})},disable:function(t,e){if(!t.data.disabled[e]){if(t.data.disabled[e]=!0,e in T.registryByName&&t.data.running[e])for(var n,a=t.data.running[e].length-1;a>=0;a--)n=t.data.running[e][a],n._natives.end.call(t,null,n),t.emit("trackend",T.extend({},n,{plugin:n.type,type:"trackend"}));return t}},enable:function(t,e){if(t.data.disabled[e]){if(t.data.disabled[e]=!1,e in T.registryByName&&t.data.running[e])for(var n,a=t.data.running[e].length-1;a>=0;a--)n=t.data.running[e][a],n._natives.start.call(t,null,n),t.emit("trackstart",T.extend({},n,{plugin:n.type,type:"trackstart",track:n}));return t}},destroy:function(t){var e,n,a,r,i=t.data.events,o=t.data.trackEvents;for(n in i){e=i[n];for(a in e)delete e[a];i[n]=null}for(r in T.registryByName)T.removePlugin(t,r);o.byStart.length=0,o.byEnd.length=0,t.isDestroyed||(t.data.timeUpdate&&t.media.removeEventListener("timeupdate",t.data.timeUpdate,!1),t.isDestroyed=!0),T.instances.splice(T.instances.indexOf(t),1)}}),T.guid.counter=1,T.extend(T.p,function(){var t="load play pause currentTime playbackRate volume duration preload playbackRate autoplay loop controls muted buffered readyState seeking paused played seekable ended",e={};return T.forEach(t.split(/\s+/g),function(t){e[t]=function(e){var n;return"function"==typeof this.media[t]?(null!=e&&/play|pause/.test(t)&&(this.media.currentTime=T.util.toSeconds(e)),this.media[t](),this):null!=e?(n=this.media[t],this.media[t]=e,n!==e&&this.emit("attrchange",{attribute:t,previousValue:n,currentValue:e}),this):this.media[t]}}),e}()),T.forEach("enable disable".split(" "),function(t){T.p[t]=function(e){return T[t](this,e)}}),T.extend(T.p,{roundTime:function(){return Math.round(this.media.currentTime)},exec:function(t,e,a){var r,i,o,s=arguments.length,d="trackadded";try{i=T.util.toSeconds(t)}catch(t){}if("number"==typeof i&&(t=i),"number"==typeof t&&2===s)a=e,e=t,t=T.guid("cue");else if(1===s)e=-1;else if(r=this.getTrackEvent(t))this.data.trackEvents.remove(t),n.end(this,r),T.removeTrackEvent.ref(this,t),d="cuechange","string"==typeof t&&2===s&&("number"==typeof e&&(a=r._natives.start),"function"==typeof e&&(a=e,e=r.start));else if(s>=2){if("string"==typeof e){try{i=T.util.toSeconds(e)}catch(t){}e=i}"number"==typeof e&&(a=a||T.nop()),"function"==typeof e&&(a=e,e=-1)}return o={id:t,start:e,end:e+1,_running:!1,_natives:{start:a||T.nop,end:T.nop,type:"cue"}},r&&(o=T.extend(r,o)),"cuechange"===d?(o._id=o.id||o._id||T.guid(o._natives.type),this.data.trackEvents.add(o),n.start(this,o),this.timeUpdate(this,null,!0),T.addTrackEvent.ref(this,o),this.emit(d,T.extend({},o,{id:t,type:d,previousValue:{time:r.start,fn:r._natives.start},currentValue:{time:e,fn:a||T.nop},track:r}))):T.addTrackEvent(this,o),this},mute:function(t){var e=null==t||t===!0?"muted":"unmuted";return"unmuted"===e&&(this.media.muted=!1,this.media.volume=this.data.state.volume),"muted"===e&&(this.data.state.volume=this.media.volume,this.media.muted=!0),this.emit(e),this},unmute:function(t){return this.mute(null!=t&&!t)},position:function(){return T.position(this.media)},toggle:function(t){return T[this.data.disabled[t]?"enable":"disable"](this,t)},defaults:function(t,e){return T.isArray(t)?(T.forEach(t,function(t){for(var e in t)this.defaults(e,t[e])},this),this):(this.options.defaults||(this.options.defaults={}),this.options.defaults[t]||(this.options.defaults[t]={}),T.extend(this.options.defaults[t],e),this)}}),T.Events={UIEvents:"blur focus focusin focusout load resize scroll unload",MouseEvents:"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave click dblclick",Events:"loadstart progress suspend emptied stalled play pause error loadedmetadata loadeddata waiting playing canplay canplaythrough seeking seeked timeupdate ended ratechange durationchange volumechange"},T.Events.Natives=T.Events.UIEvents+" "+T.Events.MouseEvents+" "+T.Events.Events,g.events.apiTypes=["UIEvents","MouseEvents","Events"],function(t,e){for(var n=g.events.apiTypes,a=t.Natives.split(/\s+/g),r=0,i=a.length;r<i;r++)e.hash[a[r]]=!0;n.forEach(function(n,a){e.apis[n]={};for(var r=t[n].split(/\s+/g),i=r.length,o=0;o<i;o++)e.apis[n][r[o]]=!0})}(T.Events,g.events),T.events={isNative:function(t){return!!g.events.hash[t]},getInterface:function(t){if(!T.events.isNative(t))return!1;for(var e,n,a=g.events,r=a.apiTypes,i=a.apis,o=0,s=r.length;o<s;o++)if(n=r[o],i[n][t]){e=n;break}return e},all:T.Events.Natives.split(/\s+/g),fn:{trigger:function(n,a){var r,i,o,s=this.data.events[n];if(s){if(r=T.events.getInterface(n))return i=e.createEvent(r),i.initEvent(n,!0,!0,t,1),this.media.dispatchEvent(i),this;for(o=s.slice();o.length;)o.shift().call(this,a)}return this},listen:function(t,e){var n,a,r=this,i=!0,o=T.events.hooks[t];if("function"!=typeof e)throw new Error("Popcorn.js Error: Listener is not a function");return this.data.events[t]||(this.data.events[t]=[],i=!1),o&&(o.add&&o.add.call(this,{},e),o.bind&&(t=o.bind),o.handler&&(a=e,e=function(t){o.handler.call(r,t,a)}),i=!0,this.data.events[t]||(this.data.events[t]=[],i=!1)),this.data.events[t].push(e),!i&&T.events.all.indexOf(t)>-1&&this.media.addEventListener(t,function(e){if(r.data.events[t])for(n=r.data.events[t].slice();n.length;)n.shift().call(r,e)},!1),this},unlisten:function(t,e){var n,a=this.data.events[t];if(a){if("string"==typeof e){for(var r=0;r<a.length;r++)a[r].name===e&&a.splice(r--,1);return this}if("function"==typeof e){for(;n!==-1;)n=a.indexOf(e),n!==-1&&a.splice(n,1);return this}return this.data.events[t]=null,this}}},hooks:{canplayall:{bind:"canplaythrough",add:function(t,e){var n=!1;this.media.readyState&&(setTimeout(function(){e.call(this,t)}.bind(this),0),n=!0),this.data.hooks.canplayall={fired:n}},handler:function(t,e){this.data.hooks.canplayall.fired||(e.call(this,t),this.data.hooks.canplayall.fired=!0)}}}},T.forEach([["trigger","emit"],["listen","on"],["unlisten","off"]],function(t){T.p[t[0]]=T.p[t[1]]=T.events.fn[t[0]]}),n.start=function(t,e){e.end>t.media.currentTime&&e.start<=t.media.currentTime&&!e._running&&(e._running=!0,t.data.running[e._natives.type].push(e),t.data.disabled[e._natives.type]||(e._natives.start.call(t,null,e),t.emit("trackstart",T.extend({},e,{plugin:e._natives.type,type:"trackstart",track:e}))))},n.end=function(t,e){var n;(e.end<=t.media.currentTime||e.start>t.media.currentTime)&&e._running&&(n=t.data.running[e._natives.type],e._running=!1,n.splice(n.indexOf(e),1),t.data.disabled[e._natives.type]||(e._natives.end.call(t,null,e),t.emit("trackend",T.extend({},e,{plugin:e._natives.type,type:"trackend",track:e}))))},a.prototype.where=function(t){return(this.parent.getTrackEvents()||[]).filter(function(e){var n,a;if(!t)return!0;for(n in t)if(a=t[n],r(e,n,a)||r(e._natives,n,a))return!0;return!1})},a.prototype.add=function(t){var e,n,a=this.byStart,r=this.byEnd;for(t&&t._id&&this.parent.data.history.push(t._id),t.start=T.util.toSeconds(t.start,this.parent.options.framerate),t.end=T.util.toSeconds(t.end,this.parent.options.framerate),e=a.length-1;e>=0;e--)if(t.start>=a[e].start){a.splice(e+1,0,t);break}for(n=r.length-1;n>=0;n--)if(t.end>r[n].end){r.splice(n+1,0,t);break}e<=this.parent.data.trackEvents.startIndex&&t.start<=this.parent.data.trackEvents.previousUpdateTime&&this.parent.data.trackEvents.startIndex++,n<=this.parent.data.trackEvents.endIndex&&t.end<this.parent.data.trackEvents.previousUpdateTime&&this.parent.data.trackEvents.endIndex++,this.count++},a.prototype.remove=function(t,e){if(t instanceof n&&(t=t.id),"object"==typeof t)return this.where(t).forEach(function(t){this.removeTrackEvent(t._id)},this.parent),this;var a,r,i,o,s,d=this.byStart.length,u=0,c=0,l=[],p=[],f=[],h=[];for(e=e||{};--d>-1;)a=this.byStart[u],r=this.byEnd[u],a._id||(l.push(a),p.push(r)),a._id&&(a._id!==t&&l.push(a),r._id!==t&&p.push(r),a._id===t&&(c=u,s=a)),u++;if(d=this.animating.length,u=0,d)for(;--d>-1;)i=this.animating[u],i._id||f.push(i),i._id&&i._id!==t&&f.push(i),u++;c<=this.startIndex&&this.startIndex--,c<=this.endIndex&&this.endIndex--,this.byStart=l,this.byEnd=p,this.animating=f,this.count--,o=this.parent.data.history.length;for(var v=0;v<o;v++)this.parent.data.history[v]!==t&&h.push(this.parent.data.history[v]);this.parent.data.history=h},T.addTrackEvent=function(t,e){var a;e instanceof n||(e=new n(e),e&&e._natives&&e._natives.type&&t.options.defaults&&t.options.defaults[e._natives.type]&&(a=T.extend({},e),T.extend(e,t.options.defaults[e._natives.type],a)),e._natives&&(e._id=e.id||e._id||T.guid(e._natives.type),e._natives._setup&&(e._natives._setup.call(t,e),t.emit("tracksetup",T.extend({},e,{plugin:e._natives.type,type:"tracksetup",track:e})))),t.data.trackEvents.add(e),n.start(t,e),this.timeUpdate(t,null,!0),e._id&&T.addTrackEvent.ref(t,e),t.emit("trackadded",T.extend({},e,e._natives?{plugin:e._natives.type}:{},{type:"trackadded",track:e})))},T.addTrackEvent.ref=function(t,e){return t.data.trackRefs[e._id]=e,t},T.removeTrackEvent=function(t,e){var n=t.getTrackEvent(e);n&&(n._natives._teardown&&n._natives._teardown.call(t,n),t.data.trackEvents.remove(e),T.removeTrackEvent.ref(t,e),n._natives&&t.emit("trackremoved",T.extend({},n,{plugin:n._natives.type,type:"trackremoved",track:n})))},T.removeTrackEvent.ref=function(t,e){return delete t.data.trackRefs[e],t},T.getTrackEvents=function(t){for(var e,n=[],a=t.data.trackEvents.byStart,r=a.length,i=0;i<r;i++)e=a[i],e._id&&n.push(e);return n},T.getTrackEvents.ref=function(t){return t.data.trackRefs},T.getTrackEvent=function(t,e){return t.data.trackRefs[e]},T.getTrackEvent.ref=function(t,e){return t.data.trackRefs[e]},T.getLastTrackEventId=function(t){return t.data.history[t.data.history.length-1]},T.timeUpdate=function(t,e){var n,a,r,i,o,s=t.media.currentTime,d=t.data.trackEvents.previousUpdateTime,u=t.data.trackEvents,c=u.endIndex,l=u.startIndex,p=u.byStart.length,f=u.byEnd.length,h=T.registryByName,v="trackstart",m="trackend";if(d<=s){for(;u.byEnd[c]&&u.byEnd[c].end<=s;){if(n=u.byEnd[c],r=n._natives,i=r&&r.type,r&&!h[i]&&!t[i])return void T.removeTrackEvent(t,n._id);n._running===!0&&(n._running=!1,o=t.data.running[i],o.splice(o.indexOf(n),1),t.data.disabled[i]||(r.end.call(t,e,n),t.emit(m,T.extend({},n,{plugin:i,type:m,track:n})))),c++}for(;u.byStart[l]&&u.byStart[l].start<=s;){if(a=u.byStart[l],r=a._natives,i=r&&r.type,r&&!h[i]&&!t[i])return void T.removeTrackEvent(t,a._id);a.end>s&&a._running===!1&&(a._running=!0,t.data.running[i].push(a),t.data.disabled[i]||(r.start.call(t,e,a),t.emit(v,T.extend({},a,{plugin:i,type:v,track:a})))),l++}}else if(d>s){for(;u.byStart[l]&&u.byStart[l].start>s;){if(a=u.byStart[l],r=a._natives,i=r&&r.type,r&&!h[i]&&!t[i])return void T.removeTrackEvent(t,a._id);a._running===!0&&(a._running=!1,o=t.data.running[i],o.splice(o.indexOf(a),1),t.data.disabled[i]||(r.end.call(t,e,a),t.emit(m,T.extend({},a,{plugin:i,type:m,track:a})))),l--}for(;u.byEnd[c]&&u.byEnd[c].end>s;){if(n=u.byEnd[c],r=n._natives,i=r&&r.type,r&&!h[i]&&!t[i])return void T.removeTrackEvent(t,n._id);n.start<=s&&n._running===!1&&(n._running=!0,t.data.running[i].push(n),t.data.disabled[i]||(r.start.call(t,e,n),t.emit(v,T.extend({},n,{plugin:i,type:v,track:n})))),c--}}u.endIndex=c,u.startIndex=l,u.previousUpdateTime=s,u.byStart.length<p&&u.startIndex--,u.byEnd.length<f&&u.endIndex--},T.extend(T.p,{getTrackEvents:function(){return T.getTrackEvents.call(null,this)},getTrackEvent:function(t){return T.getTrackEvent.call(null,this,t)},getLastTrackEventId:function(){return T.getLastTrackEventId.call(null,this)},removeTrackEvent:function(t){return T.removeTrackEvent.call(null,this,t),this},removePlugin:function(t){return T.removePlugin.call(null,this,t),this},timeUpdate:function(t){return T.timeUpdate.call(null,this,t),this},destroy:function(){return T.destroy.call(null,this),this}}),T.manifest={},T.registry=[],T.registryByName={},T.plugin=function(t,e,a){if(T.protect.natives.indexOf(t.toLowerCase())>=0)return void T.error("'"+t+"' is a protected function name");var r="function"==typeof e,s=["start","end","type","manifest"],d=["_setup","_teardown","start","end","frame"],u={},p=function(t,e){return t=t||T.nop,e=e||T.nop,function(){t.apply(this,arguments),e.apply(this,arguments)}};T.manifest[t]=a=a||e.manifest||{},d.forEach(function(n){e[n]=o(e[n]||T.nop,t)});var f=function(e,r){if(!r)return this;if(r.ranges&&T.isArray(r.ranges))return T.forEach(r.ranges,function(e){var n=T.extend({},r,e);delete n.ranges,this[t](n)},this),this;var i,o=r._natives={},u="";return T.extend(o,e),r._natives.type=r._natives.plugin=t,r._running=!1,o.start=o.start||o.in,o.end=o.end||o.out,r.once&&(o.end=p(o.end,function(){this.removeTrackEvent(r._id)})),o._teardown=p(function(){var t=c.call(arguments),e=this.data.running[o.type];t.unshift(null),t[1]._running&&e.splice(e.indexOf(r),1)&&o.end.apply(this,t),t[1]._running=!1,this.emit("trackend",T.extend({},r,{plugin:o.type,type:"trackend",track:T.getTrackEvent(this,r.id||r._id)}))},o._teardown),o._teardown=p(o._teardown,function(){this.emit("trackteardown",T.extend({},r,{plugin:t,type:"trackteardown",track:T.getTrackEvent(this,r.id||r._id)}))}),r.compose=r.compose||[],"string"==typeof r.compose&&(r.compose=r.compose.split(" ")),r.effect=r.effect||[],"string"==typeof r.effect&&(r.effect=r.effect.split(" ")),r.compose=r.compose.concat(r.effect),r.compose.forEach(function(t){u=T.compositions[t]||{},d.forEach(function(t){o[t]=p(o[t],u[t])})}),r._natives.manifest=a,"start"in r||(r.start=r.in||0),r.end||0===r.end||(r.end=r.out||Number.MAX_VALUE),l.call(r,"toString")||(r.toString=function(){var e=["start: "+r.start,"end: "+r.end,"id: "+(r.id||r._id)];return null!=r.target&&e.push("target: "+r.target),t+" ( "+e.join(", ")+" )"}),r.target||(i="options"in a&&a.options,r.target=i&&"target"in i&&i.target),!r._id&&r._natives&&(r._id=T.guid(r._natives.type)),r instanceof n?(r._natives&&(r._id=r.id||r._id||T.guid(r._natives.type),r._natives._setup&&(r._natives._setup.call(this,r),this.emit("tracksetup",T.extend({},r,{plugin:r._natives.type,type:"tracksetup",track:r})))),this.data.trackEvents.add(r),n.start(this,r),this.timeUpdate(this,null,!0),r._id&&T.addTrackEvent.ref(this,r)):T.addTrackEvent(this,r),T.forEach(e,function(t,e){s.indexOf(e)===-1&&this.on(e,t)},this),this};T.p[t]=u[t]=function(a,o){var s,d,u,c,p;arguments.length;if(a&&!o)o=a,a=null;else{if(s=this.getTrackEvent(a))return p=o,c=i(s,p),s._natives._update?(this.data.trackEvents.remove(s),l.call(o,"start")&&(s.start=o.start),l.call(o,"end")&&(s.end=o.end),n.end(this,s),r&&e.call(this,s),s._natives._update.call(this,s,o),this.data.trackEvents.add(s),n.start(this,s),"cue"!==s._natives.type&&this.emit("trackchange",{id:s.id,type:"trackchange",previousValue:c,currentValue:p,track:s}),this):(T.extend(s,o),this.data.trackEvents.remove(a),s._natives._teardown&&s._natives._teardown.call(this,s),T.removeTrackEvent.ref(this,a),r?f.call(this,e.call(this,s),s):(s._id=s.id||s._id||T.guid(s._natives.type),s._natives&&s._natives._setup&&(s._natives._setup.call(this,s),this.emit("tracksetup",T.extend({},s,{plugin:s._natives.type,type:"tracksetup",track:s}))),this.data.trackEvents.add(s),n.start(this,s),this.timeUpdate(this,null,!0),T.addTrackEvent.ref(this,s)),this.emit("trackchange",{id:s.id,type:"trackchange",previousValue:c,currentValue:s,track:s}),this);o.id=a}return this.data.running[t]=this.data.running[t]||[],d=this.options.defaults&&this.options.defaults[t]||{},u=T.extend({},d,o),f.call(this,r?e.call(this,u):e,u),this},a&&T.extend(e,{manifest:a});var h={fn:u[t],definition:e,base:e,parents:[],name:t};return T.registry.push(T.extend(u,h,{type:t})),T.registryByName[t]=h,u},T.plugin.errors=[],T.plugin.debug="@VERSION"===T.version,T.removePlugin=function(t,e){if(!e){if(e=t,t=T.p,T.protect.natives.indexOf(e.toLowerCase())>=0)return void T.error("'"+e+"' is a protected function name");var n,a=T.registry.length;for(n=0;n<a;n++)if(T.registry[n].name===e)return T.registry.splice(n,1),delete T.registryByName[e],delete T.manifest[e],void delete t[e]}var r,i,o=t.data.trackEvents.byStart,s=t.data.trackEvents.byEnd,d=t.data.trackEvents.animating;for(r=0,i=o.length;r<i;r++)o[r]&&o[r]._natives&&o[r]._natives.type===e&&(o[r]._natives._teardown&&o[r]._natives._teardown.call(t,o[r]),o.splice(r,1),r--,i--,t.data.trackEvents.startIndex<=r&&(t.data.trackEvents.startIndex--,t.data.trackEvents.endIndex--)),s[r]&&s[r]._natives&&s[r]._natives.type===e&&s.splice(r,1);for(r=0,i=d.length;r<i;r++)d[r]&&d[r]._natives&&d[r]._natives.type===e&&(d.splice(r,1),r--,i--)},T.compositions={},T.compose=function(t,e,n){T.manifest[t]=n=n||e.manifest||{},T.compositions[t]=e},T.plugin.effect=T.effect=T.compose;var k=/^(?:\.|#|\[)/;T.dom={debug:!1,find:function(t,n){var a=null;if(n=n||e,t){if(!k.test(t)&&(a=e.getElementById(t),null!==a))return a;try{a=n.querySelector(t)}catch(t){if(T.dom.debug)throw new Error(t)}}return a}};var b=/\?/,x={ajax:null,url:"",data:"",dataType:"",success:T.nop,type:"GET",async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8"};T.xhr=function(t){var e;return t.dataType=t.dataType&&t.dataType.toLowerCase()||null,!t.dataType||"jsonp"!==t.dataType&&"script"!==t.dataType?(e=T.extend({},x,t),e.ajax=new XMLHttpRequest,e.ajax?("GET"===e.type&&e.data&&(e.url+=(b.test(e.url)?"&":"?")+e.data,e.data=null),e.ajax.open(e.type,e.url,e.async),"POST"===e.type&&e.ajax.setRequestHeader("Content-Type",e.contentType),e.ajax.send(e.data||null),T.xhr.httpData(e)):void 0):void T.xhr.getJSONP(t.url,t.success,"script"===t.dataType)},T.xhr.httpData=function(t){var e,n,a=null,r=null;return t.ajax.onreadystatechange=function(){if(4===t.ajax.readyState){try{a=JSON.parse(t.ajax.responseText)}catch(t){}if(e={xml:t.ajax.responseXML,text:t.ajax.responseText,json:a},!e.xml||!e.xml.documentElement){e.xml=null;try{n=new DOMParser,r=n.parseFromString(t.ajax.responseText,"text/xml"),r.getElementsByTagName("parsererror").length||(e.xml=r)}catch(t){}}t.dataType&&(e=e[t.dataType]),t.success.call(t.ajax,e)}},e},T.xhr.getJSONP=function(t,n,a){var r,i,o,s=e.head||e.getElementsByTagName("head")[0]||e.documentElement,d=e.createElement("script"),u=!1,c=[],l=/(=)\?(?=&|$)|\?\?/;a||(o=t.match(/(callback=[^&]*)/),null!==o&&o.length?(r=o[1].split("=")[1],"?"===r&&(r="jsonp"),i=T.guid(r),t=t.replace(/(callback=[^&]*)/,"callback="+i)):(i=T.guid("jsonp"),l.test(t)&&(t=t.replace(l,"$1"+i)),c=t.split(/\?(.+)?/),t=c[0]+"?",c[1]&&(t+=c[1]+"&"),t+="callback="+i),window[i]=function(t){n&&n(t),u=!0}),d.addEventListener("load",function(){a&&n&&n(),u&&delete window[i],s.removeChild(d)},!1),d.addEventListener("error",function(t){n&&n({error:t}),a||delete window[i],s.removeChild(d)},!1),d.src=t,s.insertBefore(d,s.firstChild)},T.getJSONP=T.xhr.getJSONP,T.getScript=T.xhr.getScript=function(t,e){return T.xhr.getJSONP(t,e,!0)},T.util={toSeconds:function(t,e){var n,a,r,i,o,s,d=/^([0-9]+:){0,2}[0-9]+([.;][0-9]+)?$/,u="Invalid time format";return"number"==typeof t?t:("string"!=typeof t||d.test(t)||T.error(u),n=t.split(":"),a=n.length-1,r=n[a],r.indexOf(";")>-1&&(o=r.split(";"),s=0,e&&"number"==typeof e&&(s=parseFloat(o[1],10)/e),n[a]=parseInt(o[0],10)+s),i=n[0],{1:parseFloat(i,10),2:60*parseInt(i,10)+parseFloat(n[1],10),3:3600*parseInt(i,10)+60*parseInt(n[1],10)+parseFloat(n[2],10)}[n.length||1])}},T.p.cue=T.p.exec,T.protect={natives:E(T.p).map(function(t){return t.toLowerCase()})},T.forEach({listen:"on",unlisten:"off",trigger:"emit",exec:"cue"},function(t,e){var n=T.p[e];T.p[e]=function(){return"undefined"!=typeof console&&console.warn&&(T.p[e]=n),T.p[t].apply(this,[].slice.call(arguments))}}),t.Popcorn=T}else{t.Popcorn={isSupported:!1};for(var w="byId forEach extend effects error guid sizeOf isArray nop position disable enable destroyaddTrackEvent removeTrackEvent getTrackEvents getTrackEvent getLastTrackEventId timeUpdate plugin removePlugin compose effect xhr getJSONP getScript".split(/\s+/);w.length;)t.Popcorn[w.shift()]=function(){}}}(window,window.document),function(t){t.plugin("footnote",{manifest:{about:{name:"Popcorn Footnote Plugin",version:"0.2",author:"@annasob, @rwaldron",website:"annasob.wordpress.com"},options:{start:{elem:"input",type:"number",label:"Start"},end:{elem:"input",type:"number",label:"End"},text:{elem:"input",type:"text",label:"Text"},target:"footnote-container"}},_setup:function(e){var n=t.dom.find(e.target);e._container=document.createElement("div"),e._container.style.display="none",e._container.innerHTML=e.text,n.appendChild(e._container)},start:function(t,e){e._container.style.display="inline"},end:function(t,e){e._container.style.display="none"},_teardown:function(e){var n=t.dom.find(e.target);n&&n.removeChild(e._container)}})}(Popcorn),function(t,e){function n(t){for(var e=n.options,a=e.parser[e.strictMode?"strict":"loose"].exec(t),r={},i=14;i--;)r[e.key[i]]=a[i]||"";return r[e.q.name]={},r[e.key[12]].replace(e.q.parser,function(t,n,a){n&&(r[e.q.name][n]=a)}),r}function a(){var a,i={};return Object.prototype.__defineGetter__||(i=e.createElement("div")),i._util={type:"HTML5",TIMEUPDATE_MS:250,MIN_WIDTH:300,MIN_HEIGHT:150,isAttributeSet:function(t){return"string"==typeof t||t===!0},parseUri:n},i.addEventListener=function(t,n,a){e.addEventListener(this._eventNamespace+t,n,a)},i.removeEventListener=function(t,n,a){e.removeEventListener(this._eventNamespace+t,n,a)},i.dispatchEvent=function(t){var n=e.createEvent("CustomEvent"),a={type:t,target:this.parentNode,data:null};n.initCustomEvent(this._eventNamespace+t,!1,!1,a),e.dispatchEvent(n)},i.load=t.nop,i.canPlayType=function(t){return""},i.getBoundingClientRect=function(){return a.getBoundingClientRect()},i.NETWORK_EMPTY=0,i.NETWORK_IDLE=1,i.NETWORK_LOADING=2,i.NETWORK_NO_SOURCE=3,i.HAVE_NOTHING=0,i.HAVE_METADATA=1,i.HAVE_CURRENT_DATA=2,i.HAVE_FUTURE_DATA=3,i.HAVE_ENOUGH_DATA=4,Object.defineProperties(i,{currentSrc:{get:function(){return void 0!==this.src?this.src:""},configurable:!0},parentNode:{get:function(){return a},set:function(t){a=t},configurable:!0},preload:{get:function(){return"auto"},set:t.nop,configurable:!0},controls:{get:function(){return!0},set:t.nop,configurable:!0},poster:{get:function(){return""},set:t.nop,configurable:!0},crossorigin:{get:function(){return""},configurable:!0},played:{get:function(){return r},configurable:!0},seekable:{get:function(){return r},configurable:!0},buffered:{get:function(){return r},configurable:!0},defaultMuted:{get:function(){return!1},configurable:!0},defaultPlaybackRate:{get:function(){return 1},configurable:!0},style:{get:function(){return this.parentNode.style},configurable:!0},id:{get:function(){return this.parentNode.id},configurable:!0}}),i}n.options={strictMode:!1,key:["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],q:{name:"queryKey",parser:/(?:^|&)([^&=]*)=?([^&]*)/g},parser:{strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/}};var r={length:0,start:t.nop,end:t.nop};window.MediaError=window.MediaError||function(){function t(t,e){this.code=t||null,this.message=e||""}return t.MEDIA_ERR_NONE_ACTIVE=0,t.MEDIA_ERR_ABORTED=1,t.MEDIA_ERR_NETWORK=2,t.MEDIA_ERR_DECODE=3,t.MEDIA_ERR_NONE_SUPPORTED=4,t}(),t._MediaElementProto=a}(Popcorn,window.document),function(t,e,n){function a(){var t;if(YT.loaded)for(l=!0;f.length;)(t=f.shift())();else setTimeout(a,250)}function r(){var t;return p||(e.YT?a():(t=n.createElement("script"),t.addEventListener("load",a,!1),t.src="https://www.youtube.com/iframe_api",n.head.appendChild(t)),p=!0),l}function i(t){f.push(t)}function o(a){function o(t){X.push(t)}function l(){V.pauseVideo(),E("play",l),y("play",O)}function p(){y("pause",P),E("pause",p)}function f(t){var e=function(){V.isMuted()?(y("play",g),V.playVideo()):setTimeout(e,0)};G=!0,V.mute(),e()}function h(t){var e={name:"MediaError"};switch(t.data){case 2:e.message="Invalid video parameter.",e.code=MediaError.MEDIA_ERR_ABORTED;break;case 5:e.message="The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.",e.code=MediaError.MEDIA_ERR_DECODE;break;case 100:e.message="Video not found.",e.code=MediaError.MEDIA_ERR_NETWORK;break;case 101:case 150:e.message="Video not usable.",e.code=MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED;break;default:e.message="Unknown error.",e.code=5}B.error=e,Y.dispatchEvent("error")}function v(){for(y("play",O),y("pause",P),!B.autoplay&&B.paused||(E("play",v),B.paused=!1,o(function(){B.paused||O()})),B.muted||V.unMute(),B.readyState=Y.HAVE_METADATA,Y.dispatchEvent("loadedmetadata"),j=setInterval(w,s),Y.dispatchEvent("loadeddata"),B.readyState=Y.HAVE_FUTURE_DATA,Y.dispatchEvent("canplay"),K=!0,C=setInterval(S,50);X.length;)X[0](),X.shift();B.readyState=Y.HAVE_ENOUGH_DATA,Y.dispatchEvent("canplaythrough")}function m(){return E("pause",m),V.getCurrentTime()>0?void setTimeout(m,0):void(B.autoplay||!B.paused?(y("play",v),V.playVideo()):v())}function g(){return E("play",g),0===V.getCurrentTime()?void setTimeout(g,0):(y("pause",m),V.seekTo(0),void V.pauseVideo())}function y(t,e){Y.addEventListener("youtube-"+t,e,!1)}function E(t,e){Y.removeEventListener("youtube-"+t,e,!1)}function _(t){Y.dispatchEvent("youtube-"+t)}function T(){B.networkState=Y.NETWORK_LOADING;var t=V.getDuration();B.duration!==t&&(B.duration=t,Y.dispatchEvent("durationchange")),Y.dispatchEvent("waiting")}function k(t){switch(t.data){case YT.PlayerState.ENDED:_("ended");break;case YT.PlayerState.PLAYING:_("play");break;case YT.PlayerState.PAUSED:V.getDuration()!==V.getCurrentTime()&&_("pause");break;case YT.PlayerState.BUFFERING:_("buffering");break;case YT.PlayerState.CUED:}t.data!==YT.PlayerState.BUFFERING&&z===YT.PlayerState.BUFFERING&&A(),z=t.data}function b(){G&&V&&(E("buffering",T),E("ended",D),E("play",O),E("pause",P),P(),K=!1,W=!1,B.currentTime=0,X=[],clearInterval(j),clearInterval(C),V.stopVideo(),V.clearVideo(),V.destroy(),q=n.createElement("div"))}function x(t){if(!Y._canPlaySrc(t))return B.error={name:"MediaError",message:"Media Source Not Supported",code:MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED},void Y.dispatchEvent("error");if(B.src=t,!r())return void i(function(){x(t)});if(G){if(!K)return void o(function(){x(t)});b()}F.appendChild(q);var n=Y._util.parseUri(t).queryKey;delete n.v,B.autoplay="1"===n.autoplay||B.autoplay,delete n.autoplay,B.loop="1"===n.loop||B.loop,delete n.loop,n.rel=n.rel||0,n.modestbranding=n.modestbranding||1,n.iv_load_policy=n.iv_load_policy||3,n.disablekb=n.disablekb||1,n.showinfo=n.showinfo||0;var a="file:"===e.location.protocol?"*":e.location.protocol+"//"+e.location.host;n.origin=n.origin||a,n.controls=n.controls||0,B.controls=n.controls,n.wmode=n.wmode||"opaque",0!==n.html5&&(n.html5=1),t=u.exec(t)[1],V=new YT.Player(q,{width:"100%",height:"100%",wmode:n.wmode,videoId:t,playerVars:n,events:{onReady:f,onError:h,onStateChange:k}}),B.networkState=Y.NETWORK_LOADING,Y.dispatchEvent("loadstart"),Y.dispatchEvent("progress")}function w(){var t=V.getCurrentTime();B.seeking?c(t-B.currentTime)<1&&M():(c(B.currentTime-t)>s&&(R(),M()),B.currentTime=t)}function S(){var t=V.getVideoLoadedFraction();t&&$!==t&&($=t,A())}function I(t){if(t!==B.currentTime){if(B.currentTime=t,
!K)return void o(function(){R(),V.seekTo(t)});R(),V.seekTo(t)}}function N(){Y.dispatchEvent("timeupdate")}function R(){y("pause",p),E("pause",P),B.seeking=!0,Y.dispatchEvent("seeking")}function M(){B.ended=!1,B.seeking=!1,Y.dispatchEvent("timeupdate"),Y.dispatchEvent("seeked"),Y.dispatchEvent("canplay"),Y.dispatchEvent("canplaythrough")}function O(){B.ended&&(I(0),B.ended=!1),H=setInterval(N,Y._util.TIMEUPDATE_MS),B.paused=!1,J&&(J=!1,(B.loop&&!W||!B.loop)&&(W=!0,Y.dispatchEvent("play")),Y.dispatchEvent("playing"))}function A(){Y.dispatchEvent("progress")}function P(){B.paused=!0,J||(J=!0,clearInterval(H),Y.dispatchEvent("pause"))}function D(){B.loop?(I(0),Y.play()):(B.ended=!0,P(),y("play",l),E("play",O),Y.dispatchEvent("timeupdate"),Y.dispatchEvent("ended"))}function L(t){return B.muted=t,K?(V[t?"mute":"unMute"](),void Y.dispatchEvent("volumechange")):void o(function(){L(B.muted)})}function U(){return B.muted}if(!e.postMessage)throw"ERROR: HTMLYouTubeVideoElement requires window.postMessage";var V,C,j,H,Y=new t._MediaElementProto,F="string"==typeof a?n.querySelector(a):a,q=n.createElement("div"),B={src:d,networkState:Y.NETWORK_EMPTY,readyState:Y.HAVE_NOTHING,seeking:!1,autoplay:d,preload:d,controls:!1,loop:!1,poster:d,volume:1,muted:!1,currentTime:0,duration:NaN,ended:!1,paused:!0,error:null},G=!1,K=!1,W=!1,J=!0,X=[],z=-1,$=0;return Y._eventNamespace=t.guid("HTMLYouTubeVideoElement::"),Y.parentNode=F,Y._util.type="YouTube",y("buffering",T),y("ended",D),Y.play=function(){return B.paused=!1,K?void V.playVideo():void o(function(){Y.play()})},Y.pause=function(){return B.paused=!0,K?(p(),void V.pauseVideo()):void o(function(){Y.pause()})},Object.defineProperties(Y,{src:{get:function(){return B.src},set:function(t){t&&t!==B.src&&x(t)}},autoplay:{get:function(){return B.autoplay},set:function(t){B.autoplay=Y._util.isAttributeSet(t)}},loop:{get:function(){return B.loop},set:function(t){B.loop=Y._util.isAttributeSet(t)}},width:{get:function(){return Y.parentNode.offsetWidth}},height:{get:function(){return Y.parentNode.offsetHeight}},currentTime:{get:function(){return B.currentTime},set:function(t){I(t)}},duration:{get:function(){return B.duration}},ended:{get:function(){return B.ended}},paused:{get:function(){return B.paused}},seeking:{get:function(){return B.seeking}},readyState:{get:function(){return B.readyState}},networkState:{get:function(){return B.networkState}},volume:{get:function(){return B.volume},set:function(t){if(t<0||t>1)throw"Volume value must be between 0.0 and 1.0";return B.volume=t,K?(V.setVolume(100*B.volume),void Y.dispatchEvent("volumechange")):void o(function(){Y.volume=t})}},muted:{get:function(){return U()},set:function(t){L(Y._util.isAttributeSet(t))}},error:{get:function(){return B.error}},buffered:{get:function(){var t={start:function(t){if(0===t)return 0;throw"INDEX_SIZE_ERR: DOM Exception 1"},end:function(t){if(0===t)return B.duration?B.duration*$:0;throw"INDEX_SIZE_ERR: DOM Exception 1"},length:1};return t},configurable:!0}}),Y._canPlaySrc=t.HTMLYouTubeVideoElement._canPlaySrc,Y.canPlayType=t.HTMLYouTubeVideoElement.canPlayType,Y}var s=10,d="",u=/^.*(?:\/|v=)(.{11})/,c=Math.abs,l=!1,p=!1,f=[];t.HTMLYouTubeVideoElement=function(t){return new o(t)},t.HTMLYouTubeVideoElement._canPlaySrc=function(t){return/(?:http:\/\/www\.|http:\/\/|www\.|\.|^)(youtu).*(?:\/|v=)(.{11})/.test(t)?"probably":d},t.HTMLYouTubeVideoElement.canPlayType=function(t){return"video/x-youtube"===t?"probably":d}}(Popcorn,window,document);