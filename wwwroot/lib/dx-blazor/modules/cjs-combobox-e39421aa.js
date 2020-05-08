_dxBlazorInternal.define('cjs-combobox-e39421aa.js', function(require, module, exports) {'use strict';

require('./cjs-chunk-c43b3f7c.js');
var domUtils = require('./cjs-dom-utils-6a09eac3.js');
var __chunk_2 = require('./cjs-chunk-509db829.js');
var __chunk_3 = require('./cjs-chunk-9109506d.js');
var __chunk_4 = require('./cjs-chunk-7aa0d757.js');
var dropdowns = require('./cjs-dropdowns-5546f970.js');
require('./cjs-chunk-e26655d2.js');
var grid = require('./cjs-grid-b52f8083.js');

function KeyDown(evt) {
    if (KeyCodeDoesNotChangeText(evt.keyCode)) { return; }
    var input = evt.target;
    input.dataset.previousValue = evt.target.value;
}
function KeyUp(evt) {
    if (KeyCodeDoesNotChangeText(evt.keyCode)) { return false; }
    var input = evt.target;
    var inputValueHasNotBeenChanged = input && input.dataset["previousValue"] === evt.target.value;
    var needToProcessFiltration = !inputValueHasNotBeenChanged;
    return needToProcessFiltration;
}
function KeyCodeDoesNotChangeText(keyCode) {
    if (keyCode == __chunk_4.Key.Tab) { return true; }
    if (16 <= keyCode && keyCode <= 20) { return true; }
    return false;
}

var BlurTimeout = 200;
var TimerToWaitForBlurAfterMouseDown = BlurTimeout / 2;
function ScrollToSelectedItem(mainElement) {
    var dropDownElement = GetDropDownElement(mainElement);
    grid.ScrollToSelectedItem(dropDownElement);
}
function InputFocus(evt, dotnetHelper) {
    var input = evt.target;
    hideNullText(input);
    setFocusedCssClass(input);
}
function PrepareInputIfFocused(input) {
    input = domUtils.EnsureElement(input);
    if (document.activeElement === input) {
        hideNullText(input);
        setFocusedCssClass(input);
    }
}
function hideNullText(input) {
    if (input && !input.readOnly && input.dataset.nullText && input.value === input.dataset.nullText)
        { input.value = ""; }
}
function InputBlur(evt, dotnetHelper) {
    var input = evt.target;
    clearBlurTimeout(input, true);
    input.dataset.timerId = window.setTimeout(function () {
        delete input.dataset.timerId;
        setBluredCssClass(input);
        if (document.activeElement !== input) {
            try {
                CallLostFocusWithPreventDoubleCall(dotnetHelper, input);
            } catch(e) { }        }
    }, BlurTimeout);
}
function clearBlurTimeout(input, preventRepeat) {
    if(input.dataset.timerId) {
        clearTimeout(input.dataset.timerId);
        delete input.dataset.timerId;
    }
    if(!preventRepeat) {
        window.setTimeout(function() { clearBlurTimeout(input, true); }, TimerToWaitForBlurAfterMouseDown);
    }
}
function setFocusedCssClass(input) {
    if (input && input.dataset.focusedClass)
        { input.className = input.dataset.focusedClass; }
}
function setBluredCssClass(input) {
    if (input && input.dataset.bluredClass)
        { input.className = input.dataset.bluredClass; }
}
function InputKeyDown(evt, filteringEnabled) {
    if (filteringEnabled) {
        KeyDown(evt);
    }
    if (needPreventDefault(evt)) {
        evt.stopPropagation();
        evt.preventDefault();
    }
    return false;
}
function InputKeyUp(evt, dotnetHelper, scrollElement, filteringEnabled) {
    var needToSendEventToServer = false;
    if (filteringEnabled) {
        needToSendEventToServer = needToSendEventToServer || KeyUp(evt);
    }
    needToSendEventToServer = needToSendEventToServer || isKeyBoardSupport(evt);
    if (needToSendEventToServer) {
        var newText = evt.target.value;
        if(scrollElement && grid.HasParametersForVirtualScrollingRequest(scrollElement)) {
            var tuple = grid.GetParametersForVirtualScrollingRequest(scrollElement, false);
            var itemHeight = tuple.itemHeight;
            var scrollTopForRequest = tuple.scrollTopForRequest;
            var scrollHeightForRequest = tuple.scrollHeightForRequest;
            dotnetHelper.invokeMethodAsync('OnComboBoxListBoxKeyUp', newText, evt.keyCode, evt.altKey, evt.ctrlKey, itemHeight, scrollTopForRequest, scrollHeightForRequest);
        } else {
            dotnetHelper.invokeMethodAsync('OnComboBoxKeyUp', newText, evt.keyCode, evt.altKey, evt.ctrlKey);
        }
    }
}
function isKeyBoardSupport(evt) {
    var dropDownToggleShortCut = evt.altKey && (evt.keyCode == __chunk_4.Key.Down || evt.keyCode == __chunk_4.Key.Up);
    var navigationShortCut = isNavigationKey(evt);
    var enterCancelShortCut = evt.keyCode == __chunk_4.Key.Esc || evt.keyCode == __chunk_4.Key.Enter;
    return dropDownToggleShortCut || navigationShortCut || enterCancelShortCut;
}
function isNavigationKey(evt) {
    var a = evt.keyCode === __chunk_4.Key.Down || evt.keyCode === __chunk_4.Key.Up ||
        evt.keyCode === __chunk_4.Key.PageUp || evt.keyCode === __chunk_4.Key.PageDown ||
        (evt.ctrlKey && (evt.keyCode === __chunk_4.Key.Home || evt.keyCode === __chunk_4.Key.End));
    return a;
}
function needPreventDefault(evt) {
    return isNavigationKey(evt);
}
function CallLostFocusWithPreventDoubleCall(dotnetHelper, input, force) {
    if(!input) { return; }
    var now = (new Date()).getTime();
    var sameTime = input.dataset.lastLostFocusTime && now - input.dataset.lastLostFocusTime < (BlurTimeout + 100);
    var doubleCallDetected = sameTime;
    if(doubleCallDetected && !force) {
        return;
    }
    input.dataset.lastLostFocusTime = (new Date()).getTime();
    dotnetHelper.invokeMethodAsync('OnComboBoxLostFocus', input.value);
}
function GetDropDownElement(mainElement) {
    mainElement = domUtils.EnsureElement(mainElement);
    return mainElement.querySelector("div.dxbs-dm.dropdown-menu");
}
function Init(mainElement, input, dotnetHelper, filteringEnabled, hasJustBeenShown) {
    mainElement = domUtils.EnsureElement(mainElement);
    if (!mainElement) { return; }
    __chunk_2.DisposeEvents(mainElement);
    filteringEnabled = filteringEnabled.toLowerCase() === "true";
    hasJustBeenShown = hasJustBeenShown.toLowerCase() === "true";
    input = domUtils.EnsureElement(input);
    var dropDownElement = GetDropDownElement(mainElement);
    var scrollElement = dropDownElement;
    if (hasJustBeenShown) {
        ScrollToSelectedItem(mainElement);
    }
    var onKeyDown     = function (evt) { return InputKeyDown(evt, filteringEnabled); };
    var onKeyUp       = function (evt) { return InputKeyUp(evt, dotnetHelper, scrollElement, filteringEnabled); };
    var onInputFocus  = function (evt) { return InputFocus(evt); };
    var onInputBlur   = function (evt) { return InputBlur(evt, dotnetHelper); };
    var stopBlurTimer = function (evt) { return clearBlurTimeout(input); };
    var documentMDown = function (evt) { return dropdowns.OnOutsideClick(evt, mainElement, function() {
        if(!domUtils.elementIsInDOM(mainElement)) {
            __chunk_2.DisposeEvents(mainElement);
        }
        var willBlur = document.activeElement === input;
        var isAboutToBlur = input.dataset.timerId > 0;
        var willBeClosed = dropDownElement && dropdowns.IsDropDownVisible(dropDownElement);
        clearBlurTimeout(input);
        if(willBlur || isAboutToBlur || willBeClosed)
            { CallLostFocusWithPreventDoubleCall(dotnetHelper, input, true); }
    });
    };
    domUtils.AttachEventToElement(input, 'keydown', onKeyDown);
    domUtils.AttachEventToElement(input, 'keyup',   onKeyUp);
    domUtils.AttachEventToElement(input, 'focus',   onInputFocus);
    domUtils.AttachEventToElement(input, 'blur', onInputBlur);
    domUtils.AttachEventToElement(mainElement, 'mousedown', stopBlurTimer);
    domUtils.AttachEventToElement(document, __chunk_3.TouchUIHelper.touchMouseDownEventName, documentMDown);
    __chunk_2.RegisterDisposableEvents(mainElement, function () {
        domUtils.DetachEventFromElement(input, 'keydown', onKeyDown);
        domUtils.DetachEventFromElement(input, 'keyup',   onKeyUp);
        domUtils.DetachEventFromElement(input, 'focus',   onInputFocus);
        domUtils.DetachEventFromElement(input, 'blur', onInputBlur);
        domUtils.DetachEventFromElement(mainElement, 'mousedown', stopBlurTimer);
        domUtils.DetachEventFromElement(document, __chunk_3.TouchUIHelper.touchMouseDownEventName, documentMDown);
    });
    return Promise.resolve("ok");
}
function Dispose(mainElement) {
    mainElement = domUtils.EnsureElement(mainElement);
    if (!mainElement) { return; }
    __chunk_2.DisposeEvents(mainElement);
    return Promise.resolve("ok");
}
var combobox = { Init: Init, Dispose: Dispose, PrepareInputIfFocused: PrepareInputIfFocused, ScrollToSelectedItem: ScrollToSelectedItem };

exports.Dispose = Dispose;
exports.Init = Init;
exports.PrepareInputIfFocused = PrepareInputIfFocused;
exports.ScrollToSelectedItem = ScrollToSelectedItem;
exports.default = combobox;},["cjs-chunk-c43b3f7c.js","cjs-dom-utils-6a09eac3.js","cjs-chunk-509db829.js","cjs-chunk-9109506d.js","cjs-chunk-7aa0d757.js","cjs-dropdowns-5546f970.js","cjs-chunk-e26655d2.js","cjs-grid-b52f8083.js"]);
