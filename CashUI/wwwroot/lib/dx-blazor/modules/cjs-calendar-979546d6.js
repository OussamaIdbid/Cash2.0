_dxBlazorInternal.define('cjs-calendar-979546d6.js', function(require, module, exports) {'use strict';

require('./cjs-chunk-c43b3f7c.js');
var domUtils = require('./cjs-dom-utils-6a09eac3.js');
var __chunk_3 = require('./cjs-chunk-9109506d.js');
var __chunk_6 = require('./cjs-chunk-85e9b555.js');

function Init(calendar, dotnetHelper) {
    calendar = domUtils.EnsureElement(calendar);
    if(!calendar) { return; }
    calendar.dayCells = undefined;
    initEvents(calendar);
    function getDayCells() {
        if(!calendar.dayCells)
            { calendar.dayCells = calendar.querySelectorAll(".dxbs-day"); }
        return calendar.dayCells;
    }
    function findCellByPos(x, y) {
        var cells = getDayCells();
        for(var i = 0, cell; cell = cells[i]; i++) {
            var rect = cell.getBoundingClientRect();
            if(rect.top <= y && y < rect.bottom && rect.left <= x && x < rect.right)
                { return cell; }
        }
    }
    function initEvents(calendar) {
        __chunk_3.LongTabEventHelper.attachEventToElement(calendar, "touchstart", touchStartEventHandler);
        __chunk_3.LongTabEventHelper.attachEventToElement(calendar, "touchmove", touchMoveEventHandler);
        __chunk_3.LongTabEventHelper.attachEventToElement(calendar, "touchend", touchEndEventHandler);
        __chunk_3.LongTabEventHelper.attachLongTabEventToElement(calendar, longTabEventHandler);
        __chunk_3.LongTabEventHelper.attachEventToElement(calendar, "mousedown", mouseDownEventHandler);
        __chunk_3.LongTabEventHelper.attachEventToElement(calendar, "mousemove", mouseMoveEventHandler);
        __chunk_3.LongTabEventHelper.attachEventToElement(calendar, "mouseup", mouseUpEventHandler);
    }
    function mouseDownEventHandler(e) {
        if(__chunk_3.hasUnforcedFunction("TouchStart"))
            { return; }
        var cell = getDayCell(e.srcElement);
        if(cell) {
            calendar.inSelectionMode = true;
            calendar.firstDate = getDateAttrValue(cell);
        }
    }
    function mouseMoveEventHandler(e) {
        if(!calendar.inSelectionMode)
            { return; }
        if(!calendar.throttledDrag) {
            calendar.throttledDrag = __chunk_6.Timer.Throttle(function(e) {
                var cell = findCellByPos(e.clientX, e.clientY);
                if(cell) {
                    var date = getDateAttrValue(cell);
                    if(!date || !calendar.firstDate)
                        { return; }
                    if(!calendar.lastDate) {
                        dotnetHelper.invokeMethodAsync('StartSelectionRange', calendar.firstDate, !e.ctrlKey);
                        calendar.lastDate = date;
                    }
                    else
                        { dotnetHelper.invokeMethodAsync('ChangeSelectionRange', date); }
                }
            }, 20);
        }
        calendar.throttledDrag(e);
    }
    function mouseUpEventHandler(e) {
        if(calendar.inSelectionMode && calendar.lastDate)
            { dotnetHelper.invokeMethodAsync('EndSelectionRange', false); }
        calendar.firstDate = undefined;
        calendar.lastDate = undefined;
        calendar.inSelectionMode = false;
    }
    function touchStartEventHandler(e) {
        __chunk_3.unforcedFunctionCall(function() { }, "TouchStart", 300, true);
    }
    function longTabEventHandler(e) {
        var cell = getDayCell(e.srcElement);
        if(cell) {
            calendar.inSelectionMode = true;
            var date = getDateAttrValue(cell);
            calendar.lastDate = date;
            dotnetHelper.invokeMethodAsync('StartSelectionRange', date, false);
        }
    }
    function touchMoveEventHandler(e) {
        if(!calendar.inSelectionMode)
            { return; }
        var clientX = e.touches[0].clientX;
        var clientY = e.touches[0].clientY;
        var cell = findCellByPos(clientX, clientY);
        if(cell) {
            var date = getDateAttrValue(cell);
            if(date && (calendar.lastDate - date) !== 0)
                { dotnetHelper.invokeMethodAsync('ChangeSelectionRange', date); }
        }
        domUtils.PreventEventAndBubble(e);
    }
    function touchEndEventHandler(e) {
        if(calendar.inSelectionMode) {
            dotnetHelper.invokeMethodAsync('EndSelectionRange', true);
            domUtils.PreventEventAndBubble(e);
        }
        calendar.inSelectionMode = false;
    }
    return Promise.resolve("ok");
}
function getDateAttrValue(el) {
    return new Date(parseInt(el.getAttribute("data-date")));
}
function getDayCell(el) {
    return domUtils.GetParentByClassName(el, "dxbs-day");
}
function Dispose(calendar) {
    calendar = domUtils.EnsureElement(calendar);
    if(!calendar) { return; }
    DisposeEvents(calendar);
    return Promise.resolve("ok");
}
var calendar = { Init: Init, Dispose: Dispose };

exports.Dispose = Dispose;
exports.Init = Init;
exports.default = calendar;},["cjs-chunk-c43b3f7c.js","cjs-dom-utils-6a09eac3.js","cjs-chunk-9109506d.js","cjs-chunk-85e9b555.js"]);
