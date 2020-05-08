import { B as Browser } from './esm-chunk-f9104efc.js';
import { DetachEventFromElement, AttachEventToElement } from './esm-dom-utils-d4fe413b.js';

var unforcedFunctions = {};
function unforcedFunctionCall(func, key, timeout, resetTimer) {
    if(resetTimer && hasUnforcedFunction(key))
        clearUnforcedFunctionByKey(key);
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
    touchMouseDownEventName: Browser.WebKitTouchUI ? "touchstart" : (Browser.Edge && Browser.MSTouchUI && window.PointerEvent ? "pointerdown" : "mousedown"),
    touchMouseUpEventName:   Browser.WebKitTouchUI ? "touchend"   : (Browser.Edge && Browser.MSTouchUI && window.PointerEvent ? "pointerup"   : "mouseup"),
    touchMouseMoveEventName: Browser.WebKitTouchUI ? "touchmove"  : (Browser.Edge && Browser.MSTouchUI && window.PointerEvent ? "pointermove" : "mousemove")
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
            element[handlerName] = handler;
        handler = element[handlerName];
        DetachEventFromElement(element, eventName, handler);
        AttachEventToElement(element, eventName, handler);
    }
    function onTouchStart(e) {
        if(!validEvent(e)) return;
        touchCount++;
        unforcedFunctionCall(function() { longTouchFireAsync(e); }, "longPress", longTouchTimeout, true);
    }
    function onTouchEnd(e) {
        if(!validEvent(e)) return;
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
            return false;
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

export { LongTabEventHelper as L, TouchUIHelper as T, clearUnforcedFunctionByKey as c, hasUnforcedFunction as h, unforcedFunctionCall as u };
