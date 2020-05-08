_dxBlazorInternal.define('cjs-chunk-9109506d.js', function(require, module, exports) {'use strict';

var __chunk_1 = require('./cjs-chunk-c43b3f7c.js');
var domUtils = require('./cjs-dom-utils-6a09eac3.js');

var unforcedFunctions = {};
function unforcedFunctionCall(func, key, timeout, resetTimer) {
    if(resetTimer && hasUnforcedFunction(key))
        { clearUnforcedFunctionByKey(key); }
    if(unforcedFunctions[key] === undefined) {
        unforcedFunctions[key] = setTimeout(function() {
            func();
            unforcedFunctions[key] = undefined;
        }, timeout);
    }
}
function hasUnforcedFunction(key) {
    return !!unforcedFunctions[key];
}
function clearUnforcedFunctionByKey(key) {
    clearTimeout(unforcedFunctions[key]);
    unforcedFunctions[key] = undefined;
}

var TouchUIHelper = {
    touchMouseDownEventName: __chunk_1.Browser.WebKitTouchUI ? "touchstart" : (__chunk_1.Browser.Edge && __chunk_1.Browser.MSTouchUI && window.PointerEvent ? "pointerdown" : "mousedown"),
    touchMouseUpEventName:   __chunk_1.Browser.WebKitTouchUI ? "touchend"   : (__chunk_1.Browser.Edge && __chunk_1.Browser.MSTouchUI && window.PointerEvent ? "pointerup"   : "mouseup"),
    touchMouseMoveEventName: __chunk_1.Browser.WebKitTouchUI ? "touchmove"  : (__chunk_1.Browser.Edge && __chunk_1.Browser.MSTouchUI && window.PointerEvent ? "pointermove" : "mousemove")
};
var LongTabEventHelper = (function() {
    var longTouchTimeout = 500;
    var longTabHandler;
    var touchCount = 0,
        lastTimeStamp;
    function attachLongTabEventToElement(element, handler) {
        longTabHandler = handler;
        attachEventToElement(element, "touchstart", onTouchStart, "ts");
        attachEventToElement(element, "touchend", onTouchEnd, "te");
        attachEventToElement(element, "touchmove", onTouchMove, "tm");
    }
    function attachEventToElement(element, eventName, handler, handlerName) {
        handlerName = handlerName ? handlerName : handler.name;
        if(!element[handlerName])
            { element[handlerName] = handler; }
        handler = element[handlerName];
        domUtils.DetachEventFromElement(element, eventName, handler);
        domUtils.AttachEventToElement(element, eventName, handler);
    }
    function onTouchStart(e) {
        if(!validEvent(e)) { return; }
        touchCount++;
        unforcedFunctionCall(function() { longTouchFireAsync(e); }, "longPress", longTouchTimeout, true);
    }
    function onTouchEnd(e) {
        if(!validEvent(e)) { return; }
        touchCount = 0;
        clearUnforcedFunctionByKey("longPress");
    }
    function onTouchMove(e) {
        if(hasUnforcedFunction("longPress")) {
            touchCount = 0;
            clearUnforcedFunctionByKey("longPress");
        }
    }
    function validEvent(e) {
        if(e.timeStamp === lastTimeStamp)
            { return false; }
        lastTimeStamp = e.timeStamp;
        return true;
    }
    function longTouchFireAsync(e) {
        if(touchCount === 1) {
            touchCount = 0;
            longTabHandler.call(this, e);
        }
    }
    return {
        attachEventToElement: attachEventToElement,
        attachLongTabEventToElement: attachLongTabEventToElement,
        longTouchTimeout: longTouchTimeout
    };
})();

exports.LongTabEventHelper = LongTabEventHelper;
exports.TouchUIHelper = TouchUIHelper;
exports.clearUnforcedFunctionByKey = clearUnforcedFunctionByKey;
exports.hasUnforcedFunction = hasUnforcedFunction;
exports.unforcedFunctionCall = unforcedFunctionCall;},["cjs-chunk-c43b3f7c.js","cjs-dom-utils-6a09eac3.js"]);
