_dxBlazorInternal.define('cjs-popup-utils-88c25c7c.js', function(require, module, exports) {'use strict';

require('./cjs-chunk-c43b3f7c.js');
var domUtils = require('./cjs-dom-utils-6a09eac3.js');
var __chunk_5 = require('./cjs-chunk-e26655d2.js');

var showCssClass = "show",
    matrixRegex = "\\s*matrix\\(\\s*" + ([0, 0, 0, 0, 0, 0].map(function () { return "(\\-?\\d+\\.?\\d*)"; }).join(",\\s*")) + "\\)\\s*";
function pxToNumber(px) {
    var result = 0;
    if (px != null && px != "") {
        try {
            var indexOfPx = px.indexOf("px");
            if (indexOfPx > -1)
                { result = parseFloat(px.substr(0, indexOfPx)); }
        } catch (e) { }
    }
    return Math.ceil(result);
}
function parseTranslateInfo(styles) {
    var m = new RegExp(matrixRegex).exec(styles.transform);
    return m ? { left: parseInt(m[5]), top: parseInt(m[6]) } : { left: 0, top: 0 };
}
function translatePosition(styles, x , y) {
    styles["transform"] = "matrix(1, 0, 0, 1, " + x + ", " + y + ")";
}
function getBoundingBox(x, y, w, h) { return { left: x, top: y, right: x + w, bottom: y + h, width: w, height: h }; }
function getSafeBoundingBox(element, roundLT, roundRB) {
    var box = element.getBoundingClientRect();
    var safeBox = { left: roundLT(box.left), top: roundLT(box.top), right: roundRB(box.right), bottom: roundRB(box.bottom) };
    safeBox.width = safeBox.right - safeBox.left;
    safeBox.height = safeBox.bottom - safeBox.top;
    return safeBox;
}
function getOuterBoundingBox(element) {
    return getSafeBoundingBox(element, Math.floor, Math.ceil);
}
function getInnerBoundingBox(element) {
    return getSafeBoundingBox(element, Math.ceil, Math.floor);
}
var DockPoint = function(key, info) {
    this.key = key;
    this.info = info;
};
DockPoint.prototype.checkMargin = function () { return true; };
DockPoint.prototype.allowScroll = function () { return this.info.size === "height"; };
DockPoint.prototype.canApplyToElement = function (element) { return domUtils.GetClassName(element).indexOf("dxbs-align-" + this.key) > -1; };
DockPoint.prototype.getRange = function (dockInfo) {
    var c1 = this.getTargetBox(dockInfo)[this.info.to];
    var c2 = c1 + this.info.sizeM * (dockInfo.elementBox[this.info.size] + (this.checkMargin() ? dockInfo.margin : 0));
    return {
        from: Math.min(c1, c2),
        to: Math.max(c1, c2),
        windowOverflow: 0
    };
};
DockPoint.prototype.getTargetBox = function (dockInfo) { return null; };
DockPoint.prototype.validate = function (range, windowInfo) {
    var windowSize = windowInfo[this.info.size];
    range.windowOverflow = Math.abs(Math.min(0, range.from - windowSize.from) + Math.min(0, windowSize.to - range.to));
    range.validTo = Math.min(range.to, windowSize.to);
    range.validFrom = Math.max(range.from, windowSize.from);
    return range.windowOverflow === 0;
};
DockPoint.prototype.applyRange = function (range, dockInfo) {
    dockInfo.appliedModifierKeys[this.info.size] = this.key;
    var side = this.info.size === "width" ? "left" : "top";
    var style = dockInfo.styles;
    var from = range.from;
    if (this.allowScroll() && range.windowOverflow > 0) {
        if (!dockInfo.limitBox.scroll.width) {
            dockInfo.limitBox.scroll.width = true;
            dockInfo.limitBox.width.to -= __chunk_5.GetVerticalScrollBarWidth();
        }
        if (dockInfo.isScrollable) {
            style["max-height"] = dockInfo.height - range.windowOverflow + "px";
            dockInfo.width += __chunk_5.GetVerticalScrollBarWidth();
            dockInfo.elementBox.width += __chunk_5.GetVerticalScrollBarWidth();
            from = range.validFrom;
        }
    }
    style.width = dockInfo.width + "px";
    if (this.checkMargin())
        { from += Math.max(0, this.info.sizeM) * dockInfo.margin; }
    dockInfo.elementBox[side] += from;
    translatePosition(style, dockInfo.elementBox.left, dockInfo.elementBox.top);
};
DockPoint.prototype.dockElementToTarget = function (dockInfo) {
    var range1 = this.getRange(dockInfo);
    if (!this.dockElementToTargetInternal(range1, dockInfo))
        { this.applyRange(range1, dockInfo); }
};
DockPoint.prototype.dockElementToTargetInternal = function (range1, dockInfo) { };
var OuterDockPoint = /*@__PURE__*/(function (DockPoint) {
    function OuterDockPoint(name, info, oppositePointName) {
        DockPoint.call(this, name, info, oppositePointName);
        this.oppositePointName = oppositePointName || null;
    }

    if ( DockPoint ) OuterDockPoint.__proto__ = DockPoint;
    OuterDockPoint.prototype = Object.create( DockPoint && DockPoint.prototype );
    OuterDockPoint.prototype.constructor = OuterDockPoint;
    OuterDockPoint.prototype.getTargetBox = function (dockInfo) { return dockInfo.targetBox.outer; };
    OuterDockPoint.prototype.getOppositePoint = function () {
        return this._oppositePoint || (this._oppositePoint = dockPoints.filter(function (d) {
            return d.key === this.oppositePointName;
        }.bind(this))[0]);
    };
    OuterDockPoint.prototype.dockElementToTargetInternal = function (range1, dockInfo) {
        if (this.validate(range1, dockInfo.limitBox))
            { this.applyRange(range1, dockInfo); }
        else {
            var oppositePoint = this.getOppositePoint();
            var range2 = oppositePoint.getRange(dockInfo);
            if (oppositePoint.validate(range2, dockInfo.limitBox) || range2.windowOverflow < range1.windowOverflow)
                { oppositePoint.applyRange(range2, dockInfo); }
            else
                { return false; }
        }
        return true;
    };

    return OuterDockPoint;
}(DockPoint));
var InnerDockPoint = /*@__PURE__*/(function (DockPoint) {
    function InnerDockPoint () {
        DockPoint.apply(this, arguments);
    }

    if ( DockPoint ) InnerDockPoint.__proto__ = DockPoint;
    InnerDockPoint.prototype = Object.create( DockPoint && DockPoint.prototype );
    InnerDockPoint.prototype.constructor = InnerDockPoint;

    InnerDockPoint.prototype.checkMargin = function () { return false; };
    InnerDockPoint.prototype.getTargetBox = function (dockInfo) { return dockInfo.targetBox.inner; };
    InnerDockPoint.prototype.dockElementToTargetInternal = function (range1, dockInfo) {
        this.validate(range1, dockInfo.limitBox);
        return false;
    };
    InnerDockPoint.prototype.validate = function (range, windowInfo) {
        var toOverflow = Math.min(range.from, Math.max(0, range.to - windowInfo[this.info.size].to));
        if (toOverflow > 0) {
            range.from -= toOverflow;
            range.to -= toOverflow;
        }
        return DockPoint.prototype.validate.call(this, range, windowInfo);
    };

    return InnerDockPoint;
}(DockPoint));
var dockPoints = [
    new OuterDockPoint("above", { to: "top", from: "bottom", size: "height", sizeM: -1 }, "below"),
    new OuterDockPoint("below", { to: "bottom", from: "top", size: "height", sizeM: 1 }, "above"),
    new InnerDockPoint("top-sides", { to: "top", from: "top", size: "height", sizeM: 1 }),
    new InnerDockPoint("bottom-sides", { to: "bottom", from: "bottom", size: "height", sizeM: -1 }),
    new OuterDockPoint("outside-left", { to: "left", from: "right", size: "width", sizeM: -1 }, "outside-right"),
    new OuterDockPoint("outside-right", { to: "right", from: "left", size: "width", sizeM: 1 }, "outside-left"),
    new InnerDockPoint("left-sides", { to: "left", from: "left", size: "width", sizeM: 1 }),
    new InnerDockPoint("right-sides", { to: "right", from: "right", size: "width", sizeM: -1 })
];
function getElementPopupInfo(element, targetElement, settings) {
    var elementStyle = domUtils.GetCurrentStyleSheet();
    var box = getOuterBoundingBox(element);
    var docEl = element.ownerDocument.documentElement;
    var result = {
        isScrollable: domUtils.ElementHasCssClass(element, "dxbs-scrollable"),
        specifiedOffsetModifiers: dockPoints.filter(function (m) { return m.canApplyToElement(element); }),
        margin: pxToNumber(elementStyle.marginTop),
        width: settings ? Math.max(settings.width, Math.ceil(element.offsetWidth)) : Math.ceil(element.offsetWidth),
        height: Math.ceil(element.offsetHeight),
        appliedModifierKeys: { height: null, width: null }
    };
    var styles = parseTranslateInfo(elementStyle);
    result.elementBox = getBoundingBox(styles.left - box.left, styles.top - box.top, box.width, box.height);
    result.targetBox = { outer: getOuterBoundingBox(targetElement), inner: getInnerBoundingBox(targetElement) };
    result.limitBox = {
        scroll: { width: docEl.clientWidth < window.innerWidth, height: docEl.clientHeight < window.innerHeight },
        width: { from: 0, to: docEl.clientWidth },
        height: { from: 0, to: docEl.clientHeight }
    };
    result.styles = {};
    var highPriorityModifiersData = element.getAttribute("data-popup-align") || settings && settings.align;
    var highPriorityModifiers = highPriorityModifiersData.split(/\s+/);
    result.offsetModifiers = dockPoints.filter(function (m) {
        return highPriorityModifiers.some(function (k) { return m.key === k; });
    });
    return result;
}
function preparePosition(element, targetElement, settings, onShow) {
    return domUtils.calculateStyles(function () {
        var dockInfo = getElementPopupInfo(element, targetElement, settings);
        for (var i = 0; i < dockInfo.offsetModifiers.length; i++)
            { dockInfo.offsetModifiers[i].dockElementToTarget(dockInfo); }
        domUtils.changeDom(function () { onShow(dockInfo); });
        domUtils.setStyles(element, dockInfo.styles);
    }.bind(this));
}
function hide(element) {
    if (domUtils.ElementHasCssClass(element, showCssClass)) {
        if (element.isDockedElementHidden)
            { delete element.isDockedElementHidden; }
        domUtils.clearStyles(element);
        domUtils.toggleCssClass(element, showCssClass, false);
    } else if (element.isDockedElementHidden)
        { delete element.isDockedElementHidden; }
}
function show(element, targetElement, align) {
    domUtils.clearStyles(element);
    domUtils.toggleCssClass(element, showCssClass, true);
    preparePosition(element, targetElement, { align: align }, function () { });
}

exports.hide = hide;
exports.parseTranslateInfo = parseTranslateInfo;
exports.show = show;
exports.translatePosition = translatePosition;},["cjs-chunk-c43b3f7c.js","cjs-dom-utils-6a09eac3.js","cjs-chunk-e26655d2.js"]);
