_dxBlazorInternal.define('cjs-dropdowns-5546f970.js', function(require, module, exports) {'use strict';

require('./cjs-chunk-c43b3f7c.js');
var domUtils = require('./cjs-dom-utils-6a09eac3.js');
var __chunk_2 = require('./cjs-chunk-509db829.js');
var __chunk_3 = require('./cjs-chunk-9109506d.js');
var __chunk_4 = require('./cjs-chunk-7aa0d757.js');

var targetNode = document.body;
var observableElements = {}, observableElementsCallbacks = [];
var config = { subtree: true, childList: true };
var callback = function(mutationsList, observer) {
    for (var index = 0; index < mutationsList.length; index++) {
        var mutation = mutationsList[index];
        mutation.removedNodes.forEach(function(r) {
            observableElementsCallbacks.filter(function (x) { return r === x.element; }).map(function (x) { return x.callback; }).forEach(function (x) { return x(); });
        });
    }
};
var observer = new MutationObserver(callback);
function registerCallback(element, callback) {
    var callbackInfo = {
        element: element,
        callback: function() {
            observableElementsCallbacks.splice(observableElementsCallbacks.indexOf(callbackInfo), 1);
            delete observableElements[element];
            if(observableElementsCallbacks.length === 0)
                { observer.disconnect(); }
            callback();
        }
    };
    observableElementsCallbacks.push(callbackInfo);
}
function whenDeleted(element) {
    return observableElements[element] || (observableElements[element] = new Promise(function (resolve, _) {
        if(observableElementsCallbacks.length === 0)
            { observer.observe(targetNode, config); }
        registerCallback(element, resolve);
    }));
}

var DialogType = {
    Popup: 0,
    Modal: 1
};
function OnOutsideClick(evt, mainElement, onOutsireClick) {
    var element = evt.target;
    while (element) {
            if(element === mainElement) { return false; }
        element = element.parentElement;
    }
    if(onOutsireClick)
        { onOutsireClick(); }
}
function IsDropDownVisible(el) {
    return (el.style.display !== 'none')
}
function Init(mainElement, input, dropDownElement, dotnetHelper) {
    mainElement = domUtils.EnsureElement(mainElement);
    input = domUtils.EnsureElement(input);
    dropDownElement = domUtils.EnsureElement(dropDownElement);
    if (!mainElement) { return; }
    __chunk_2.DisposeEvents(mainElement);
    if(dropDownElement) {
        var documentMDown = function (evt) { return OnOutsideClick(evt, mainElement, function() {
            if(!domUtils.elementIsInDOM(mainElement)) {
                __chunk_2.DisposeEvents(mainElement);
            }
            var willBlur = document.activeElement === input;
            var willBeClosed = dropDownElement && IsDropDownVisible(dropDownElement);
            if(willBlur || willBeClosed)
                { dotnetHelper.invokeMethodAsync('OnDropDownLostFocus', input.value); }
        });
        };
        domUtils.AttachEventToElement(document, __chunk_3.TouchUIHelper.touchMouseDownEventName, documentMDown);
        __chunk_2.RegisterDisposableEvents(mainElement, function () {
            domUtils.DetachEventFromElement(document, __chunk_3.TouchUIHelper.touchMouseDownEventName, documentMDown);
        });
    }
    return Promise.resolve("ok");
}
function Dispose(mainElement) {
    mainElement = domUtils.EnsureElement(mainElement);
    if (mainElement)
        { __chunk_2.DisposeEvents(mainElement); }
    return Promise.resolve("ok");
}
var focusableSelector = "a[href], input:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex='-1'])";
function findFirstFocusableElement(container) {
    return container.querySelector(focusableSelector);
}
function findLastFocusableElement(container) {
    var elements = container.querySelectorAll(focusableSelector);
    return elements[elements.length - 1];
}
function ShowAdaptiveDropdown(mainElement, dialogType, containerElementCssClass, focusableExternalElementCssClass, dotnetHelper) {
    mainElement = domUtils.EnsureElement(mainElement);
    var containerElement = domUtils.GetParentByClassName(mainElement, containerElementCssClass);
    var inputElement = containerElement.querySelector("." + focusableExternalElementCssClass);
    var documentElement = document.documentElement;
    var isClosed = false;
    function onGlobalClick(e) {
        if(!mainElement.contains(e.srcElement) || (dialogType === DialogType.Modal && mainElement === e.srcElement))
            { closeDropdown(); }
    }
    function onGotFocus(e) {
        documentElement.removeEventListener("focusin", onGotFocus);
        if(e.relatedTarget === null && e.target && mainElement.contains(e.target))
            { e.target.focus(); }
    }
    function onLoseFocus(e) {
        if(!isClosed) {
            if (e.relatedTarget !== null && !mainElement.contains(e.relatedTarget)) {
                refocusDropdownContent(e.relatedTarget);
            } else if(e.relatedTarget === null) {
                documentElement.addEventListener("focusin", onGotFocus);
            }
        }
    }
    function onKeyDown(e) {
        if (e.keyCode === __chunk_4.Key.Esc)
            { closeDropdown(); }
    }
    function closeDropdown() {
        if(!isClosed) {
            isClosed = true;
            cleanEnvironment();
            dotnetHelper.invokeMethodAsync('CloseDialog');
        }
    }
    function refocusDropdownContent(focusTarget) {
        var pos = mainElement.compareDocumentPosition(focusTarget);
        if(pos & Node.DOCUMENT_POSITION_PRECEDING)
            { focusLast(); }
        else if(pos & Node.DOCUMENT_POSITION_FOLLOWING)
            { focusFirst(); }
    }
    function cleanEnvironment() {
        documentElement.removeEventListener(__chunk_3.TouchUIHelper.touchMouseDownEventName, onGlobalClick);
    }
    function focusFirst() {
        var elementToFocus = findFirstFocusableElement(mainElement);
        if (elementToFocus)
            { elementToFocus.focus(); }
    }
    function focusLast() {
        var elementToFocus = findLastFocusableElement(mainElement);
        if (elementToFocus)
            { elementToFocus.focus(); }
    }
    documentElement.addEventListener(__chunk_3.TouchUIHelper.touchMouseDownEventName, onGlobalClick);
    mainElement.addEventListener("keydown", onKeyDown);
    mainElement.addEventListener("focusout", onLoseFocus);
    if (dialogType === DialogType.Modal) {
        mainElement.addEventListener("touchmove", function (e) {
            if (e.srcElement === mainElement)
                { e.preventDefault(); }
        });
    }
    whenDeleted(mainElement).then(function () {
        cleanEnvironment();
    });
    domUtils.changeDom(focusFirst);
    return Promise.resolve();
}
var dropdowns = { Init: Init, Dispose: Dispose, ShowAdaptiveDropdown: ShowAdaptiveDropdown };

exports.IsDropDownVisible = IsDropDownVisible;
exports.OnOutsideClick = OnOutsideClick;
exports.default = dropdowns;},["cjs-chunk-c43b3f7c.js","cjs-dom-utils-6a09eac3.js","cjs-chunk-509db829.js","cjs-chunk-9109506d.js","cjs-chunk-7aa0d757.js"]);
