import './esm-chunk-f9104efc.js';
import { EnsureElement, GetParentByClassName, PreventEventAndBubble } from './esm-dom-utils-d4fe413b.js';
import { L as LongTabEventHelper, h as hasUnforcedFunction, u as unforcedFunctionCall } from './esm-chunk-2f760454.js';
import { T as Timer } from './esm-chunk-38c61c5f.js';

function Init(calendar, dotnetHelper) {
    calendar = EnsureElement(calendar);
    if(!calendar) return;
    calendar.dayCells = undefined;
    initEvents(calendar);
    function getDayCells() {
        if(!calendar.dayCells)
            calendar.dayCells = calendar.querySelectorAll(".dxbs-day");
        return calendar.dayCells;
    }
    function findCellByPos(x, y) {
        var cells = getDayCells();
        for(var i = 0, cell; cell = cells[i]; i++) {
            var rect = cell.getBoundingClientRect();
            if(rect.top <= y && y < rect.bottom && rect.left <= x && x < rect.right)
                return cell;
        }
    }
    function initEvents(calendar) {
        LongTabEventHelper.attachEventToElement(calendar, "touchstart", touchStartEventHandler);
        LongTabEventHelper.attachEventToElement(calendar, "touchmove", touchMoveEventHandler);
        LongTabEventHelper.attachEventToElement(calendar, "touchend", touchEndEventHandler);
        LongTabEventHelper.attachLongTabEventToElement(calendar, longTabEventHandler);
        LongTabEventHelper.attachEventToElement(calendar, "mousedown", mouseDownEventHandler);
        LongTabEventHelper.attachEventToElement(calendar, "mousemove", mouseMoveEventHandler);
        LongTabEventHelper.attachEventToElement(calendar, "mouseup", mouseUpEventHandler);
    }
    function mouseDownEventHandler(e) {
        if(hasUnforcedFunction("TouchStart"))
            return;
        var cell = getDayCell(e.srcElement);
        if(cell) {
            calendar.inSelectionMode = true;
            calendar.firstDate = getDateAttrValue(cell);
        }
    }
    function mouseMoveEventHandler(e) {
        if(!calendar.inSelectionMode)
            return;
        if(!calendar.throttledDrag) {
            calendar.throttledDrag = Timer.Throttle(function(e) {
                var cell = findCellByPos(e.clientX, e.clientY);
                if(cell) {
                    var date = getDateAttrValue(cell);
                    if(!date || !calendar.firstDate)
                        return;
                    if(!calendar.lastDate) {
                        dotnetHelper.invokeMethodAsync('StartSelectionRange', calendar.firstDate, !e.ctrlKey);
                        calendar.lastDate = date;
                    }
                    else
                        dotnetHelper.invokeMethodAsync('ChangeSelectionRange', date);
                }
            }, 20);
        }
        calendar.throttledDrag(e);
    }
    function mouseUpEventHandler(e) {
        if(calendar.inSelectionMode && calendar.lastDate)
            dotnetHelper.invokeMethodAsync('EndSelectionRange', false);
        calendar.firstDate = undefined;
        calendar.lastDate = undefined;
        calendar.inSelectionMode = false;
    }
    function touchStartEventHandler(e) {
        unforcedFunctionCall(function() { }, "TouchStart", 300, true);
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
            return;
        var clientX = e.touches[0].clientX;
        var clientY = e.touches[0].clientY;
        var cell = findCellByPos(clientX, clientY);
        if(cell) {
            var date = getDateAttrValue(cell);
            if(date && (calendar.lastDate - date) !== 0)
                dotnetHelper.invokeMethodAsync('ChangeSelectionRange', date);
        }
        PreventEventAndBubble(e);
    }
    function touchEndEventHandler(e) {
        if(calendar.inSelectionMode) {
            dotnetHelper.invokeMethodAsync('EndSelectionRange', true);
            PreventEventAndBubble(e);
        }
        calendar.inSelectionMode = false;
    }
    return Promise.resolve("ok");
}
function getDateAttrValue(el) {
    return new Date(parseInt(el.getAttribute("data-date")));
}
function getDayCell(el) {
    return GetParentByClassName(el, "dxbs-day");
}
function Dispose(calendar) {
    calendar = EnsureElement(calendar);
    if(!calendar) return;
    DisposeEvents(calendar);
    return Promise.resolve("ok");
}
const calendar = { Init, Dispose };

export default calendar;
export { Dispose, Init };
