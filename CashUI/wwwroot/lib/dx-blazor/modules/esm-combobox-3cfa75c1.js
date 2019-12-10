import './esm-chunk-f9104efc.js';
import { EnsureElement, AttachEventToElement, elementIsInDOM, DetachEventFromElement } from './esm-dom-utils-d4fe413b.js';
import { D as DisposeEvents, R as RegisterDisposableEvents } from './esm-chunk-6ca2c4f2.js';
import { T as TouchUIHelper } from './esm-chunk-2f760454.js';
import { K as Key } from './esm-chunk-710198b6.js';
import { OnOutsideClick, IsDropDownVisible } from './esm-dropdowns-b8e38328.js';
import './esm-chunk-95f069f9.js';
import { ScrollToSelectedItem as ScrollToSelectedItem$1, HasParametersForVirtualScrollingRequest, GetParametersForVirtualScrollingRequest } from './esm-grid-91fdba30.js';

function KeyDown(evt) {
    if (KeyCodeDoesNotChangeText(evt.keyCode)) return;
    var input = evt.target;
    input.dataset.previousValue = evt.target.value;
}
function KeyUp(evt) {
    if (KeyCodeDoesNotChangeText(evt.keyCode)) return false;
    var input = evt.target;
    var inputValueHasNotBeenChanged = input && input.dataset["previousValue"] === evt.target.value;
    var needToProcessFiltration = !inputValueHasNotBeenChanged;
    return needToProcessFiltration;
}
function KeyCodeDoesNotChangeText(keyCode) {
    if (keyCode == Key.Tab) return true;
    if (16 <= keyCode && keyCode <= 20) return true;
    return false;
}

var BlurTimeout = 200;
var TimerToWaitForBlurAfterMouseDown = BlurTimeout / 2;
function ScrollToSelectedItem(mainElement) {
    var dropDownElement = GetDropDownElement(mainElement);
    ScrollToSelectedItem$1(dropDownElement);
}
function InputFocus(evt, dotnetHelper) {
    var input = evt.target;
    hideNullText(input);
    setFocusedCssClass(input);
}
function PrepareInputIfFocused(input) {
    input = EnsureElement(input);
    if (document.activeElement === input) {
        hideNullText(input);
        setFocusedCssClass(input);
    }
}
function hideNullText(input) {
    if (input && !input.readOnly && input.dataset.nullText && input.value === input.dataset.nullText)
        input.value = "";
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
        input.className = input.dataset.focusedClass;
}
function setBluredCssClass(input) {
    if (input && input.dataset.bluredClass)
        input.className = input.dataset.bluredClass;
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
        if(scrollElement && HasParametersForVirtualScrollingRequest(scrollElement)) {
            var tuple = GetParametersForVirtualScrollingRequest(scrollElement, false);
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
    var dropDownToggleShortCut = evt.altKey && (evt.keyCode == Key.Down || evt.keyCode == Key.Up);
    var navigationShortCut = isNavigationKey(evt);
    var enterCancelShortCut = evt.keyCode == Key.Esc || evt.keyCode == Key.Enter;
    return dropDownToggleShortCut || navigationShortCut || enterCancelShortCut;
}
function isNavigationKey(evt) {
    var a = evt.keyCode === Key.Down || evt.keyCode === Key.Up ||
        evt.keyCode === Key.PageUp || evt.keyCode === Key.PageDown ||
        (evt.ctrlKey && (evt.keyCode === Key.Home || evt.keyCode === Key.End));
    return a;
}
function needPreventDefault(evt) {
    return isNavigationKey(evt);
}
function CallLostFocusWithPreventDoubleCall(dotnetHelper, input, force) {
    if(!input) return;
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
    mainElement = EnsureElement(mainElement);
    return mainElement.querySelector("div.dxbs-dm.dropdown-menu");
}
function Init(mainElement, input, dotnetHelper, filteringEnabled, hasJustBeenShown) {
    mainElement = EnsureElement(mainElement);
    if (!mainElement) return;
    DisposeEvents(mainElement);
    filteringEnabled = filteringEnabled.toLowerCase() === "true";
    hasJustBeenShown = hasJustBeenShown.toLowerCase() === "true";
    input = EnsureElement(input);
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
    var documentMDown = function (evt) { return OnOutsideClick(evt, mainElement, function() {
        if(!elementIsInDOM(mainElement)) {
            DisposeEvents(mainElement);
        }
        var willBlur = document.activeElement === input;
        var isAboutToBlur = input.dataset.timerId > 0;
        var willBeClosed = dropDownElement && IsDropDownVisible(dropDownElement);
        clearBlurTimeout(input);
        if(willBlur || isAboutToBlur || willBeClosed)
            CallLostFocusWithPreventDoubleCall(dotnetHelper, input, true);
    });
    };
    AttachEventToElement(input, 'keydown', onKeyDown);
    AttachEventToElement(input, 'keyup',   onKeyUp);
    AttachEventToElement(input, 'focus',   onInputFocus);
    AttachEventToElement(input, 'blur', onInputBlur);
    AttachEventToElement(mainElement, 'mousedown', stopBlurTimer);
    AttachEventToElement(document, TouchUIHelper.touchMouseDownEventName, documentMDown);
    RegisterDisposableEvents(mainElement, function () {
        DetachEventFromElement(input, 'keydown', onKeyDown);
        DetachEventFromElement(input, 'keyup',   onKeyUp);
        DetachEventFromElement(input, 'focus',   onInputFocus);
        DetachEventFromElement(input, 'blur', onInputBlur);
        DetachEventFromElement(mainElement, 'mousedown', stopBlurTimer);
        DetachEventFromElement(document, TouchUIHelper.touchMouseDownEventName, documentMDown);
    });
    return Promise.resolve("ok");
}
function Dispose(mainElement) {
    mainElement = EnsureElement(mainElement);
    if (!mainElement) return;
    DisposeEvents(mainElement);
    return Promise.resolve("ok");
}
const combobox = { Init, Dispose, PrepareInputIfFocused, ScrollToSelectedItem };

export default combobox;
export { Dispose, Init, PrepareInputIfFocused, ScrollToSelectedItem };
