_dxBlazorInternal.define('cjs-dom-utils-6a09eac3.js', function(require, module, exports) {'use strict';

var __chunk_1 = require('./cjs-chunk-c43b3f7c.js');

function Trim(str) {
    return trimInternal(str, true, true);
}
var whiteSpaces = {
    0x0009: 1, 0x000a: 1, 0x000b: 1, 0x000c: 1, 0x000d: 1, 0x0020: 1, 0x0085: 1,
    0x00a0: 1, 0x1680: 1, 0x180e: 1, 0x2000: 1, 0x2001: 1, 0x2002: 1, 0x2003: 1,
    0x2004: 1, 0x2005: 1, 0x2006: 1, 0x2007: 1, 0x2008: 1, 0x2009: 1, 0x200a: 1,
    0x200b: 1, 0x2028: 1, 0x2029: 1, 0x202f: 1, 0x205f: 1, 0x3000: 1
};
function trimInternal(source, trimStart, trimEnd) {
    var len = source.length;
    if (!len)
        { return source; }
    if (len < 0xBABA1) {
        var result = source;
        if (trimStart) {
            result = result.replace(/^\s+/, "");
        }
        if (trimEnd) {
            result = result.replace(/\s+$/, "");
        }
        return result;
    } else {
        var start = 0;
        if (trimEnd) {
            while (len > 0 && whiteSpaces[source.charCodeAt(len - 1)]) {
                len--;
            }
        }
        if (trimStart && len > 0) {
            while (start < len && whiteSpaces[source.charCodeAt(start)]) {
                start++;
            }
        }
        return source.substring(start, len);
    }
}

function CloneObject(srcObject) {
    if (typeof (srcObject) != 'object' || srcObject == null)
        { return srcObject; }
    var newObject = {};
    for (var i in srcObject)
        { newObject[i] = srcObject[i]; }
    return newObject;
}function GetDocumentScrollLeft() {
    var isScrollBodyIE = __chunk_1.Browser.IE && GetCurrentStyle(document.body).overflow == "hidden" && document.body.scrollLeft > 0;
    if (__chunk_1.Browser.Edge || isScrollBodyIE)
        { return document.body ? document.body.scrollLeft : document.documentElement.scrollLeft; }
    if (__chunk_1.Browser.WebKitFamily)
        { return document.documentElement.scrollLeft || document.body.scrollLeft; }
    return document.documentElement.scrollLeft;
}function GetDocumentScrollTop() {
    var isScrollBodyIE = __chunk_1.Browser.IE && GetCurrentStyle(document.body).overflow == "hidden" && document.body.scrollTop > 0;
    if (__chunk_1.Browser.WebKitFamily || __chunk_1.Browser.Edge || isScrollBodyIE) {
        if (__chunk_1.Browser.MacOSMobilePlatform)
            { return window.pageYOffset; }
        if (__chunk_1.Browser.WebKitFamily)
            { return document.documentElement.scrollTop || document.body.scrollTop; }
        return document.body.scrollTop;
    }
    else
        { return document.documentElement.scrollTop; }
}function GetDocumentClientWidth() {
    if (document.documentElement.clientWidth == 0)
        { return document.body.clientWidth; }
    else
        { return document.documentElement.clientWidth; }
}function GetDocumentClientHeight() {
    if (__chunk_1.Browser.Firefox && window.innerHeight - document.documentElement.clientHeight > GetVerticalScrollBarWidth()) {
        return window.innerHeight;
    } else if (__chunk_1.Browser.Opera && __chunk_1.Browser.Version < 9.6 || document.documentElement.clientHeight == 0) {
        return document.body.clientHeight;
    }
    return document.documentElement.clientHeight;
}var verticalScrollBarWidth;
function GetVerticalScrollBarWidth() {
    if (typeof (verticalScrollBarWidth) == "undefined") {
        var container = document.createElement("DIV");
        container.style.cssText = "position: absolute; top: 0px; left: 0px; visibility: hidden; width: 200px; height: 150px; overflow: hidden; box-sizing: content-box";
        document.body.appendChild(container);
        var child = document.createElement("P");
        container.appendChild(child);
        child.style.cssText = "width: 100%; height: 200px;";
        var widthWithoutScrollBar = child.offsetWidth;
        container.style.overflow = "scroll";
        var widthWithScrollBar = child.offsetWidth;
        if (widthWithoutScrollBar == widthWithScrollBar)
            { widthWithScrollBar = container.clientWidth; }
        verticalScrollBarWidth = widthWithoutScrollBar - widthWithScrollBar;
        document.body.removeChild(container);
    }
    return verticalScrollBarWidth;
}function GetAbsoluteX(curEl) {
    return GetAbsolutePositionX(curEl);
}function GetAbsoluteY(curEl) {
    return GetAbsolutePositionY(curEl);
}function SetAbsoluteX(element, x) {
    element.style.left = PrepareClientPosForElement(x, element, true) + "px";
}function SetAbsoluteY(element, y) {
    element.style.top = PrepareClientPosForElement(y, element, false) + "px";
}function GetAbsolutePositionX(element) {
    if (__chunk_1.Browser.IE)
        { return getAbsolutePositionX_IE(element); }
    else if (__chunk_1.Browser.Firefox && __chunk_1.Browser.Version >= 3)
        { return getAbsolutePositionX_FF3(element); }
    else if (__chunk_1.Browser.WebKitFamily || __chunk_1.Browser.Edge)
        { return getAbsolutePositionX_FF3(element); }
    else
        { return getAbsolutePositionX_Other(element); }
}function getAbsolutePositionX_IE(element) {
    if (element == null || __chunk_1.Browser.IE && element.parentNode == null) { return 0; }
    return element.getBoundingClientRect().left + GetDocumentScrollLeft();
}
function getAbsolutePositionX_FF3(element) {
    if (element == null) { return 0; }
    var x = element.getBoundingClientRect().left + GetDocumentScrollLeft();
    return x;
}
function GetAbsolutePositionY(element){
    if(__chunk_1.Browser.IE)
        { return getAbsolutePositionY_IE(element); }
    else if(__chunk_1.Browser.Firefox && __chunk_1.Browser.Version >= 3)
        { return getAbsolutePositionY_FF3(element); }
    else if(__chunk_1.Browser.WebKitFamily || __chunk_1.Browser.Edge)
        { return getAbsolutePositionY_FF3(element); }
    else
        { return getAbsolutePositionY_Other(element); }
}function getAbsolutePositionY_IE(element){
    if(element == null || __chunk_1.Browser.IE && element.parentNode == null) { return 0; }
    return element.getBoundingClientRect().top + GetDocumentScrollTop();
}
function getAbsolutePositionY_FF3(element){
    if(element == null) { return 0; }
    var y = element.getBoundingClientRect().top + GetDocumentScrollTop();
    return y;
}
function PrepareClientPosForElement(pos, element, isX) {
    pos -= GetPositionElementOffset(element, isX);
    return pos;
}function createElementMock(element) {
    var div = document.createElement('DIV');
    div.style.top = "0px";
    div.style.left = "0px";
    div.visibility = "hidden";
    div.style.position = GetCurrentStyle(element).position;
    return div;
}
function getExperimentalPositionOffset(element, isX) {
    var div = createElementMock(element);
    if (div.style.position == "static")
        { div.style.position = "absolute"; }
    element.parentNode.appendChild(div);
    var realPos = isX ? GetAbsoluteX(div) : GetAbsoluteY(div);
    element.parentNode.removeChild(div);
    return realPos;
}
function GetPositionElementOffset(element, isX) {
    return getExperimentalPositionOffset(element, isX);
}function ElementHasCssClass(element, className) {
    try {
        var elementClasses;
        var classList = GetClassNameList(element);
        if (!classList) {
            var elementClassName = GetClassName(element);
            if (!elementClassName) {
                return false;
            }
            elementClasses = elementClassName.split(" ");
        }
        var classNames = className.split(" ");
        for (var i = classNames.length - 1; i >= 0; i--) {
            if (classList) {
                if (classList.indexOf(classNames[i]) === -1)
                    { return false; }
                continue;
            }
            if (Data.ArrayIndexOf(elementClasses, classNames[i]) < 0)
                { return false; }
        }
        return true;
    } catch (e) {
        return false;
    }
}function AddClassNameToElement(element, className) {
    if (!element || typeof (className) !== "string") { return; }
    className = className.trim();
    if (!ElementHasCssClass(element, className) && className !== "") {
        var oldClassName = GetClassName(element);
        SetClassName(element, (oldClassName === "") ? className : oldClassName + " " + className);
    }
}function RemoveClassNameFromElement(element, className) {
    if (!element) { return; }
    var elementClassName = GetClassName(element);
    var updClassName = " " + elementClassName + " ";
    var newClassName = updClassName.replace(" " + className + " ", " ");
    if (updClassName.length != newClassName.length)
        { SetClassName(element, Trim(newClassName)); }
}function GetClassNameList(element) {
    return element.classList ? [].slice.call(element.classList) : GetClassName(element).replace(/^\s+|\s+$/g, '').split(/\s+/);
}function GetClassName(element) {
    var elementClassName;
    if (element.tagName === "svg") {
        elementClassName = element.className.baseVal;
    }
    else {
        elementClassName = element.className;
    }
    return elementClassName;
}function SetClassName(element, className) {
    if (element.tagName === "svg") {
        element.className.baseVal = Trim(className);
    }
    else {
        element.className = Trim(className);
    }
}function getItemByIndex(collection, index) {
    if (!index) { index = 0; }
    if (collection != null && collection.length > index)
        { return collection[index]; }
    return null;
}
function GetNodesByTagName(element, tagName) {
    var tagNameToUpper = tagName.toUpperCase();
    var result = null;
    if (element) {
        if (element.getElementsByTagName) {
            result = element.getElementsByTagName(tagNameToUpper);
            if (result.length === 0) {
                result = element.getElementsByTagName(tagName);
            }
        }
        else if (element.all && element.all.tags !== undefined)
            { result = __chunk_1.Browser.Netscape ? element.all.tags[tagNameToUpper] : element.all.tags(tagNameToUpper); }
    }
    return result;
}function GetNodeByTagName(element, tagName, index) {
    if (element != null) {
        var collection = GetNodesByTagName(element, tagName);
        return getItemByIndex(collection, index);
    }
    return null;
}function GetCurrentStyle(element) {
    if (document.defaultView && document.defaultView.getComputedStyle) {
        var result = document.defaultView.getComputedStyle(element, null);
        if (!result && __chunk_1.Browser.Firefox && window.frameElement) {
            var changes = [];
            var curElement = window.frameElement;
            while (!(result = document.defaultView.getComputedStyle(element, null))) {
                changes.push([curElement, curElement.style.display]);
                SetStylesCore(curElement, "display", "block", true);
                curElement = curElement.tagName == "BODY" ? curElement.ownerDocument.defaultView.frameElement : curElement.parentNode;
            }
            result = CloneObject(result);
            for (var ch, i = 0; ch = changes[i]; i++)
                { SetStylesCore(ch[0], "display", ch[1]); }
        }
        if (__chunk_1.Browser.Firefox && __chunk_1.Browser.MajorVersion >= 62 && window.frameElement && result.length === 0) {
            result = CloneObject(result);
            result.display = element.style.display;
        }
        return result;
    }
    return window.getComputedStyle(element, null);
}function CreateStyleSheetInDocument(doc) {
    if (doc.createStyleSheet) {
        try {
            return doc.createStyleSheet();
        }
        catch (e) {
            var message = "The CSS link limit (31) has been exceeded. Please enable CSS merging or reduce the number of CSS files on the page. For details, see http://www.devexpress.com/Support/Center/p/K18487.aspx.";
            throw new Error(message);
        }
    }
    else {
        var styleSheet = doc.createElement("STYLE");
        GetNodeByTagName(doc, "HEAD", 0).appendChild(styleSheet);
        return styleSheet.sheet;
    }
}var currentStyleSheet = null;
function GetCurrentStyleSheet() {
    if (!currentStyleSheet)
        { currentStyleSheet = CreateStyleSheetInDocument(document); }
    return currentStyleSheet;
}function SetStylesCore(element, property, value, makeImportant) {
    if (makeImportant) {
        var index = property.search("[A-Z]");
        if (index != -1)
            { property = property.replace(property.charAt(index), "-" + property.charAt(index).toLowerCase()); }
        if (element.style.setProperty)
            { element.style.setProperty(property, value, "important"); }
        else
            { element.style.cssText += ";" + property + ":" + value + "!important"; }
    }
    else
        { element.style[property] = value; }
}function getParentByClassNameInternal(element, className, selector) {
    while (element != null) {
        if (element.tagName == "BODY" || element.nodeName == "#document")
            { return null; }
        if (selector(element, className))
            { return element; }
        element = element.parentNode;
    }
    return null;
}
function GetParentByClassName(element, className) {
    return getParentByClassNameInternal(element, className, ElementHasCssClass);
}
function RetrieveByPredicate(scourceCollection, predicate) {
    var result = [];
    for (var i = 0; i < scourceCollection.length; i++) {
        var element = scourceCollection[i];
        if (!predicate || predicate(element))
            { result.push(element); }
    }
    return result;
}function FocusElement(element) {
    if(typeof element === 'string') {
        element = document.querySelector(element);
    }
    if (element)
        { element.focus(); }
}
function SetAttribute(element, attrName, attrValue) {
    if (element)
        { element[attrName] = attrValue; }
}
function SetCheckInputIndeterminate(inputElement, value) {
    if (inputElement)
        { inputElement.indeterminate = value; }
}
function AttachEventToElement(element, eventName, func, onlyBubbling, passive) {
    if (element.addEventListener)
        { element.addEventListener(eventName, func,  { capture: !onlyBubbling, passive: !!passive } ); }
    else
        { element.attachEvent("on" + eventName, func); }
}function DetachEventFromElement(element, eventName, func) {
    if (element.removeEventListener)
        { element.removeEventListener(eventName, func, true); }
    else
        { element.detachEvent("on" + eventName, func); }
}function PreventEvent(evt) {
    if(evt.preventDefault)
        { evt.preventDefault(); }
    else
        { evt.returnValue = false; }
    return false;
}
function PreventEventAndBubble(evt) {
    PreventEvent(evt);
    if(evt.stopPropagation)
        { evt.stopPropagation(); }
    evt.cancelBubble = true;
    return false;
}
function Log(message) {  }
function EnsureElement(element) {
    if(!element) { return null; }
    var internalId = null;
    if(typeof element === 'string') {
        var elRef = JSON.parse(element);
        if(elRef && elRef.__internalId) {
            internalId = elRef.__internalId;
        }
    }
    if(!internalId && element["__internalId"])
        { internalId = element["__internalId"]; }
    if(internalId) {
        var blid = "_bl_" + internalId;
        element = document.querySelector('[' + blid + ']');
    }
    if(!element["tagName"])
        { element = null; }
    return element;
}
function SetInputAttribute(element, attrName, attrValue) {
    element = EnsureElement(element);
    if (element)
        { SetAttribute(element, attrName, attrValue); }
}
function QuerySelectorFromRoot(element, method) {
    element.dataset.tempUniqueId = "tempUniqueId";
    try {
        method("[data-temp-unique-id]");
    } catch(e) {}
    finally {
        delete element.dataset.tempUniqueId;
    }
}
function RemoveAttribute(obj, attrName) {
    if(obj.removeAttribute)
        { obj.removeAttribute(attrName); }
    else if(obj.removeProperty)
        { obj.removeProperty(attrName); }
}
function SetOrRemoveAttribute(obj, attrName, value) {
    if(!value)
        { RemoveAttribute(obj, attrName); }
    else
        { SetAttribute(obj, attrName, value); }
}
function GetLeftRightBordersAndPaddingsSummaryValue(element, currentStyle) {
    return GetLeftRightPaddings(element, currentStyle) + GetHorizontalBordersWidth(element, currentStyle);
}
function GetTopBottomBordersAndPaddingsSummaryValue(element, currentStyle) {
    return GetTopBottomPaddings(element, currentStyle) + GetVerticalBordersWidth(element, currentStyle);
}
function GetLeftRightPaddings(element, style) {
    var currentStyle = style ? style : GetCurrentStyle(element);
    return parseInt(currentStyle.paddingLeft) + parseInt(currentStyle.paddingRight);
}
function GetTopBottomPaddings(element, style) {
    var currentStyle = style ? style : GetCurrentStyle(element);
    return parseInt(currentStyle.paddingTop) + parseInt(currentStyle.paddingBottom);
}
function GetVerticalBordersWidth(element, style) {
    if(!style)
        { style = (__chunk_1.Browser.IE && __chunk_1.Browser.MajorVersion !== 9 && window.getComputedStyle) ? window.getComputedStyle(element) : GetCurrentStyle(element); }
    var res = 0;
    if(style.borderTopStyle !== "none") {
        res += parseFloat(style.borderTopWidth);
        if(__chunk_1.Browser.IE && __chunk_1.Browser.MajorVersion < 9)
            { res += getIe8BorderWidthFromText(style.borderTopWidth); }
    }
    if(style.borderBottomStyle !== "none") {
        res += parseFloat(style.borderBottomWidth);
        if(__chunk_1.Browser.IE && __chunk_1.Browser.MajorVersion < 9)
            { res += getIe8BorderWidthFromText(style.borderBottomWidth); }
    }
    return res;
}
function GetHorizontalBordersWidth(element, style) {
    if(!style)
        { style = (__chunk_1.Browser.IE && window.getComputedStyle) ? window.getComputedStyle(element) : GetCurrentStyle(element); }
    var res = 0;
    if(style.borderLeftStyle !== "none") {
        res += parseFloat(style.borderLeftWidth);
        if(__chunk_1.Browser.IE && __chunk_1.Browser.MajorVersion < 9)
            { res += getIe8BorderWidthFromText(style.borderLeftWidth); }
    }
    if(style.borderRightStyle !== "none") {
        res += parseFloat(style.borderRightWidth);
        if(__chunk_1.Browser.IE && __chunk_1.Browser.MajorVersion < 9)
            { res += getIe8BorderWidthFromText(style.borderRightWidth); }
    }
    return res;
}
var requestAnimationFrameFunc = window.requestAnimationFrame || function(callback) { callback(); };
var cancelAnimationFrameFunc = window.cancelAnimationFrame || function(id) { };
function CancelAnimationFrame(id) { cancelAnimationFrameFunc(id); }
function RequestAnimationFrame(callback) { return requestAnimationFrameFunc(callback); }
var FrameContext = function(requestFrame) {
    this.requestFrame = requestFrame;
    this.cache = [[]];
    this.isInFrame = false;
    this.frameTimestamp = null;
    this.isWaiting = false;
    this.getBuffer = function(order) {
        if(!order) { order = 0; }
        if(this.cache.length <= order) { this.cache[order] = []; }
        return this.cache[order];
    };
    this.execute = function(callback, order) {
        if(!this.isInFrame)
            { return false; }
        var buffer = this.cache[order || 0];
        if(buffer === null)
            { callback(requestFrameId, this.frameTimestamp); }
        else{ (buffer = this.getBuffer(order)).push(callback); }
        return true;
    };
    this.runAll = function(frameTimestamp) {
        this.isWaiting = false;
        this.isInFrame = true;
        this.frameTimestamp = frameTimestamp;
        for(var i = 0;i < this.cache.length;i++) {
            var buffer = this.cache[i];
            if(buffer) {
                this.cache[i] = null;
                while(buffer.length)
                    { buffer.shift()(requestFrameId, this.frameTimestamp); }
            }
        }
        this.waitNextFrame();
    };
    this.waitNextFrame = function() {
        this.cache = [[]];
        this.isInFrame = false;
        this.isWaiting = false;
    };
    this.requestExecution = function(func, order) {
        var that = this;
        return new Promise(function(resolve) {
            function callback(requestFrameId, frameTimestamp) {
                resolve(func(requestFrameId, frameTimestamp));
            }
            if(!that.execute(callback, order)) {
                that.getBuffer(order).push(callback);
                if(that.isWaiting === false) {
                    that.isWaiting = true;
                    that.requestFrame(that.runAll.bind(that));
                }
            }
        });
    };
};
var requestFrameId = null;
function requestAnimationFrame(callback) { return requestFrameId = RequestAnimationFrame(callback); }
function createAccumulator(requestFrame) {
    var context = new FrameContext(requestFrame);
    return context.requestExecution.bind(context);
}
var changeDomCore = createAccumulator(requestAnimationFrame);
var calculateStylesCore = createAccumulator(function(callback) { return changeDomCore(function() { setTimeout(callback); }); });
function changeDom(c) { return changeDomCore(c); }
function calculateStyles(c) { return calculateStylesCore(c); }
var observers = [], minimumIntervalBetweenChecks = 50;
function itemObserver(element, callback, width) {
    return function() {
        if(element.compareDocumentPosition(document.body) & Node.DOCUMENT_POSITION_DISCONNECTED)
            { return false; }
        var currentStyle = GetCurrentStyle(element);
        if(currentStyle.width === "auto")
            { return true; }
        var w = parseInt(currentStyle.width) - GetLeftRightBordersAndPaddingsSummaryValue(element);
        if(width !== w)
            { callback(width = w); }
        return true;
    };
}
function elementSizeObserver(element, callback, size) {
    return function() {
        if(element.compareDocumentPosition(document.body) & Node.DOCUMENT_POSITION_DISCONNECTED)
            { return false; }
        var currentStyle = GetCurrentStyle(element);
        if(currentStyle.width === "auto")
            { return true; }
        var elementWidth = parseInt(currentStyle.width) - GetLeftRightBordersAndPaddingsSummaryValue(element);
        var elementHeight = parseInt(currentStyle.height) - GetTopBottomBordersAndPaddingsSummaryValue(element);
        if(size.width !== elementWidth || size.height !== elementHeight) {
            size.width = elementWidth;
            size.height = elementHeight;
            callback(size);
        }
        return true;
    };
}
function elementDisconnectedObserver(element, onDisconnected) {
    return function() {
        if(element.compareDocumentPosition(document.body) & Node.DOCUMENT_POSITION_DISCONNECTED) {
            onDisconnected();
            return false;
        }
        return true;
    };
}
function subscribeElementContentWidth(el, callback) {
    subscribeElementObserver(itemObserver(el, callback, -1));
}
function subscribeElementContentSize(element, callback) {
    subscribeElementObserver(elementSizeObserver(element, callback, { width: -1, height: -1 }));
}
function subscribeElementDisconnected(element, onDisconnected) {
    subscribeElementObserver(elementDisconnectedObserver(element, onDisconnected));
}
function subscribeElementObserver(observer) {
    if(observers.length === 0) {
        observers.push(observer);
        calculateStyles(updateTrackedElements);
    } else
        { observers.push(observer); }
}
function updateTrackedElements() {
    observers = observers.filter(function(observer) { return observer(); });
    if(observers.length > 0) {
        setTimeout(function() {
            calculateStyles(updateTrackedElements);
        }, minimumIntervalBetweenChecks);
    }
}
function applyStyles(element, styles) {
    var stylesArr = [];
    for(var property in styles) {
        if(styles.hasOwnProperty(property))
            { stylesArr.push({ attr: property, value: styles[property] }); }
    }
    if(stylesArr.length === 1) {
        element.style[stylesArr[0].attr] = stylesArr[0].value;
    } else {
        var cssText = "";
        if(element.style.cssText) {
            var oldStylesArr = element.style.cssText.split(';').map(function(nvp) { return nvp.trim().split(':'); });
            for(var i = 0;i < oldStylesArr.length;i++) {
                var oldStyleArr = oldStylesArr[i];
                if(oldStyleArr.length === 2 && styles[oldStyleArr[0]] === undefined)
                    { cssText += oldStyleArr[0] + ":" + oldStyleArr[1].trim() + ";"; }
            }
        }
        for(var i = 0;i < stylesArr.length;i++) {
            var style = stylesArr[i];
            if(style.value !== "")
                { cssText += style.attr + ":" + style.value + ";"; }
        }
        SetOrRemoveAttribute(element, "style", cssText);
    }
}
function applyStateToElement(element, state) {
    if(state.inlineStyles === null)
        { RemoveAttribute(element, "style"); }
    else
        { applyStyles(element, state.inlineStyles); }
    for(var attrName in state.attributes) {
        if(state.attributes.hasOwnProperty(attrName))
            { SetOrRemoveAttribute(element, attrName, state.attributes[attrName]); }
    }
    var allCssClasses = GetClassNameList(state);
    if(allCssClasses) {
        var toggleInfo = state.cssClassToggleInfo;
        var cssClasses = allCssClasses.filter(function(c) { return toggleInfo[c] !== false; });
        for(var c in toggleInfo) {
            if(toggleInfo.hasOwnProperty(c) && toggleInfo[c] && cssClasses.indexOf(c) === -1)
                { cssClasses.push(c); }
        }
        var cssClass = cssClasses.join(" ");
        if(cssClass)
            { SetClassName(element, cssClass); }
        else
            { RemoveAttribute(element, "class"); }
    }
}
function createElementState(element) {
    return { inlineStyles: {}, cssClassToggleInfo: {}, className: GetClassName(element), attributes: {} };
}
function updateElementState(elementOrCollection, callback) {
    if(elementOrCollection.length !== undefined) {
        for(var i = 0;i < elementOrCollection.length;i++)
            { updateElementState(elementOrCollection[i], callback); }
        return;
    }
    var element = elementOrCollection;
    if(!element._dxCurrentFrameElementStateInfo) {
        callback(element._dxCurrentFrameElementStateInfo = createElementState(element));
        changeDom(function() {
            applyStateToElement(element, element._dxCurrentFrameElementStateInfo);
            element._dxCurrentFrameElementStateInfo = null;
        });
    } else
        { callback(element._dxCurrentFrameElementStateInfo); }
}
function setStyles(el, styles) {
    updateElementState(el, function(state) {
        if(state.inlineStyles === null)
            { state.inlineStyles = styles; }
        else {
            for(var i in styles) {
                if(styles.hasOwnProperty(i))
                    { state.inlineStyles[i] = styles[i]; }
            }
        }
    });
}
function clearStyles(el) {
    updateElementState(el, function(state) {
        state.inlineStyles = null;
    });
}
function toggleCssClass(el, cssClass, condition) {
    updateElementState(el, function(state) {
        state.cssClassToggleInfo[cssClass] = condition;
    });
}
function setCssClassName(el, className) {
    updateElementState(el, function(state) {
        state.cssClassToggleInfo = {};
        state.className = className;
    });
}
function updateAttribute(el, attrName, attrValue) {
    updateElementState(el, function(state) {
        state.attributes[attrName] = attrValue;
    });
}
function nextChangeDOM(callback) {
    changeDom(callback);
}
function elementIsInDOM(element) {
     return document.body.contains(element);
}
function findParentBySelector(element, selector) {
    if(!element) { return null; }
    if(element.closest) { return element.closest(selector); }
    do {
      var matches = element.matches || element.msMatchesSelector;
      if (matches.call(element, selector)) { return element; }
      element = element.parentElement || element.parentNode;
    } while (element && element.tagName !== "BODY");
	return null;
}
function getDocumentScrollLeft() {
    var isScrollBodyIE = false;
    if(__chunk_1.Browser.Edge || isScrollBodyIE)
        { return document.body ? document.body.scrollLeft : document.documentElement.scrollLeft; }
    if(__chunk_1.Browser.WebKitFamily)
        { return document.documentElement.scrollLeft || document.body.scrollLeft; }
    return document.documentElement.scrollLeft;
}
function getDocumentScrollTop() {
    var isScrollBodyIE = false;
    if(__chunk_1.Browser.WebKitFamily || __chunk_1.Browser.Edge || isScrollBodyIE) {
        if(__chunk_1.Browser.MacOSMobilePlatform)
            { return window.pageYOffset; }
        if(__chunk_1.Browser.WebKitFamily)
            { return document.documentElement.scrollTop || document.body.scrollTop; }
        return document.body.scrollTop;
    }
    else
        { return document.documentElement.scrollTop; }
}var domUtils = { FocusElement: FocusElement, SetInputAttribute: SetInputAttribute, SetCheckInputIndeterminate: SetCheckInputIndeterminate };

exports.AddClassNameToElement = AddClassNameToElement;
exports.AttachEventToElement = AttachEventToElement;
exports.CancelAnimationFrame = CancelAnimationFrame;
exports.CloneObject = CloneObject;
exports.CreateStyleSheetInDocument = CreateStyleSheetInDocument;
exports.DetachEventFromElement = DetachEventFromElement;
exports.ElementHasCssClass = ElementHasCssClass;
exports.EnsureElement = EnsureElement;
exports.FocusElement = FocusElement;
exports.GetAbsolutePositionX = GetAbsolutePositionX;
exports.GetAbsolutePositionY = GetAbsolutePositionY;
exports.GetAbsoluteX = GetAbsoluteX;
exports.GetAbsoluteY = GetAbsoluteY;
exports.GetClassName = GetClassName;
exports.GetClassNameList = GetClassNameList;
exports.GetCurrentStyle = GetCurrentStyle;
exports.GetCurrentStyleSheet = GetCurrentStyleSheet;
exports.GetDocumentClientHeight = GetDocumentClientHeight;
exports.GetDocumentClientWidth = GetDocumentClientWidth;
exports.GetDocumentScrollLeft = GetDocumentScrollLeft;
exports.GetDocumentScrollTop = GetDocumentScrollTop;
exports.GetHorizontalBordersWidth = GetHorizontalBordersWidth;
exports.GetLeftRightBordersAndPaddingsSummaryValue = GetLeftRightBordersAndPaddingsSummaryValue;
exports.GetLeftRightPaddings = GetLeftRightPaddings;
exports.GetNodeByTagName = GetNodeByTagName;
exports.GetNodesByTagName = GetNodesByTagName;
exports.GetParentByClassName = GetParentByClassName;
exports.GetPositionElementOffset = GetPositionElementOffset;
exports.GetTopBottomBordersAndPaddingsSummaryValue = GetTopBottomBordersAndPaddingsSummaryValue;
exports.GetTopBottomPaddings = GetTopBottomPaddings;
exports.GetVerticalBordersWidth = GetVerticalBordersWidth;
exports.GetVerticalScrollBarWidth = GetVerticalScrollBarWidth;
exports.Log = Log;
exports.PrepareClientPosForElement = PrepareClientPosForElement;
exports.PreventEvent = PreventEvent;
exports.PreventEventAndBubble = PreventEventAndBubble;
exports.QuerySelectorFromRoot = QuerySelectorFromRoot;
exports.RemoveClassNameFromElement = RemoveClassNameFromElement;
exports.RequestAnimationFrame = RequestAnimationFrame;
exports.RetrieveByPredicate = RetrieveByPredicate;
exports.SetAbsoluteX = SetAbsoluteX;
exports.SetAbsoluteY = SetAbsoluteY;
exports.SetAttribute = SetAttribute;
exports.SetCheckInputIndeterminate = SetCheckInputIndeterminate;
exports.SetClassName = SetClassName;
exports.SetInputAttribute = SetInputAttribute;
exports.SetStylesCore = SetStylesCore;
exports.applyStateToElement = applyStateToElement;
exports.applyStyles = applyStyles;
exports.calculateStyles = calculateStyles;
exports.changeDom = changeDom;
exports.clearStyles = clearStyles;
exports.createElementState = createElementState;
exports.default = domUtils;
exports.elementIsInDOM = elementIsInDOM;
exports.findParentBySelector = findParentBySelector;
exports.getDocumentScrollLeft = getDocumentScrollLeft;
exports.getDocumentScrollTop = getDocumentScrollTop;
exports.nextChangeDOM = nextChangeDOM;
exports.setCssClassName = setCssClassName;
exports.setStyles = setStyles;
exports.subscribeElementContentSize = subscribeElementContentSize;
exports.subscribeElementContentWidth = subscribeElementContentWidth;
exports.subscribeElementDisconnected = subscribeElementDisconnected;
exports.toggleCssClass = toggleCssClass;
exports.updateAttribute = updateAttribute;
exports.updateElementState = updateElementState;},["cjs-chunk-c43b3f7c.js"]);
