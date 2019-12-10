import './esm-chunk-f9104efc.js';
import { EnsureElement, AttachEventToElement, GetParentByClassName, changeDom, elementIsInDOM, DetachEventFromElement } from './esm-dom-utils-d4fe413b.js';
import { D as DisposeEvents, R as RegisterDisposableEvents } from './esm-chunk-6ca2c4f2.js';
import { T as TouchUIHelper } from './esm-chunk-2f760454.js';
import { K as Key } from './esm-chunk-710198b6.js';

const targetNode = document.body;
const observableElements = {}, observableElementsCallbacks = [];
const config = { subtree: true, childList: true };
const callback = function(mutationsList, observer) {
    for (let index = 0; index < mutationsList.length; index++) {
        let mutation = mutationsList[index];
        mutation.removedNodes.forEach(function(r) {
            observableElementsCallbacks.filter(x => r === x.element).map(x => x.callback).forEach(x => x());
        });
    }
};
const observer = new MutationObserver(callback);
function registerCallback(element, callback) {
    var callbackInfo = {
        element: element,
        callback: function() {
            observableElementsCallbacks.splice(observableElementsCallbacks.indexOf(callbackInfo), 1);
            delete observableElements[element];
            if(observableElementsCallbacks.length === 0)
                observer.disconnect();
            callback();
        }
    };
    observableElementsCallbacks.push(callbackInfo);
}
function whenDeleted(element) {
    return observableElements[element] || (observableElements[element] = new Promise((resolve, _) => {
        if(observableElementsCallbacks.length === 0)
            observer.observe(targetNode, config);
        registerCallback(element, resolve);
    }));
}

const DialogType = {
    Popup: 0,
    Modal: 1
};
function OnOutsideClick(evt, mainElement, onOutsireClick) {
    var element = evt.target;
    while (element) {
            if(element === mainElement) return false;
        element = element.parentElement;
    }
    if(onOutsireClick)
        onOutsireClick();
}
function IsDropDownVisible(el) {
    return (el.style.display !== 'none')
}
function Init(mainElement, input, dropDownElement, dotnetHelper) {
    mainElement = EnsureElement(mainElement);
    input = EnsureElement(input);
    dropDownElement = EnsureElement(dropDownElement);
    if (!mainElement) return;
    DisposeEvents(mainElement);
    if(dropDownElement) {
        var documentMDown = function (evt) { return OnOutsideClick(evt, mainElement, function() {
            if(!elementIsInDOM(mainElement)) {
                DisposeEvents(mainElement);
            }
            var willBlur = document.activeElement === input;
            var willBeClosed = dropDownElement && IsDropDownVisible(dropDownElement);
            if(willBlur || willBeClosed)
                dotnetHelper.invokeMethodAsync('OnDropDownLostFocus', input.value);
        });
        };
        AttachEventToElement(document, TouchUIHelper.touchMouseDownEventName, documentMDown);
        RegisterDisposableEvents(mainElement, function () {
            DetachEventFromElement(document, TouchUIHelper.touchMouseDownEventName, documentMDown);
        });
    }
    return Promise.resolve("ok");
}
function Dispose(mainElement) {
    mainElement = EnsureElement(mainElement);
    if (mainElement)
        DisposeEvents(mainElement);
    return Promise.resolve("ok");
}
const focusableSelector = "a[href], input:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex='-1'])";
function findFirstFocusableElement(container) {
    return container.querySelector(focusableSelector);
}
function findLastFocusableElement(container) {
    var elements = container.querySelectorAll(focusableSelector);
    return elements[elements.length - 1];
}
function ShowAdaptiveDropdown(mainElement, dialogType, containerElementCssClass, focusableExternalElementCssClass, dotnetHelper) {
    mainElement = EnsureElement(mainElement);
    var containerElement = GetParentByClassName(mainElement, containerElementCssClass);
    var inputElement = containerElement.querySelector("." + focusableExternalElementCssClass);
    var documentElement = document.documentElement;
    var isClosed = false;
    function onGlobalClick(e) {
        if(!mainElement.contains(e.srcElement) || (dialogType === DialogType.Modal && mainElement === e.srcElement))
            closeDropdown();
    }
    function onGotFocus(e) {
        documentElement.removeEventListener("focusin", onGotFocus);
        if(e.relatedTarget === null && e.target && mainElement.contains(e.target))
            e.target.focus();
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
        if (e.keyCode === Key.Esc)
            closeDropdown();
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
            focusLast();
        else if(pos & Node.DOCUMENT_POSITION_FOLLOWING)
            focusFirst();
    }
    function cleanEnvironment() {
        documentElement.removeEventListener(TouchUIHelper.touchMouseDownEventName, onGlobalClick);
    }
    function focusFirst() {
        var elementToFocus = findFirstFocusableElement(mainElement);
        if (elementToFocus)
            elementToFocus.focus();
    }
    function focusLast() {
        var elementToFocus = findLastFocusableElement(mainElement);
        if (elementToFocus)
            elementToFocus.focus();
    }
    documentElement.addEventListener(TouchUIHelper.touchMouseDownEventName, onGlobalClick);
    mainElement.addEventListener("keydown", onKeyDown);
    mainElement.addEventListener("focusout", onLoseFocus);
    if (dialogType === DialogType.Modal) {
        mainElement.addEventListener("touchmove", (e) => {
            if (e.srcElement === mainElement)
                e.preventDefault();
        });
    }
    whenDeleted(mainElement).then(() => {
        cleanEnvironment();
    });
    changeDom(focusFirst);
    return Promise.resolve();
}
const dropdowns = { Init, Dispose, ShowAdaptiveDropdown };

export default dropdowns;
export { IsDropDownVisible, OnOutsideClick };
