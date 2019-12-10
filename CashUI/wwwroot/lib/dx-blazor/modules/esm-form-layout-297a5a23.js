import { B as Browser } from './esm-chunk-f9104efc.js';
import { GetCurrentStyle, GetCurrentStyleSheet, AddClassNameToElement, RemoveClassNameFromElement, RetrieveByPredicate, GetParentByClassName } from './esm-dom-utils-d4fe413b.js';

var BootstrapCore = {};
BootstrapCore.BootstrapMode = "Bootstrap4";
BootstrapCore.IsBootstrap3 = BootstrapCore.BootstrapMode == "Bootstrap3";
BootstrapCore.IsBootstrap4 = BootstrapCore.BootstrapMode == "Bootstrap4";
BootstrapCore.zIndexCategories = {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070
};
var BootstrapCssSelectorsPanel = BootstrapCore.IsBootstrap3 ? "panel" : "card";
var BootstrapCssSelectorsControlLabel = BootstrapCore.IsBootstrap3 ? "control-label" : "col-form-label";
var BootstrapCssSelectorsHelpBlock = BootstrapCore.IsBootstrap3 ? "help-block" : "form-text";
var mediaQueryScreenSizesCache = {};
function createCssRuleForScreenSizeMediaQuery(cssVarName, fallbackWidth, cssRule) {
    var cache = mediaQueryScreenSizesCache;
    var minWidth = cache[cssVarName] || (cache[cssVarName] = (GetCurrentStyle(document.body).getPropertyValue(cssVarName) || fallbackWidth));
    if (minWidth) {
        var styleSheet = GetCurrentStyleSheet();
        if (styleSheet)
            styleSheet.insertRule("@media (min-width: " + minWidth + ") {\n" + cssRule + "\n}\n", styleSheet.cssRules.length);
    }
}
function createCssRuleForLargeScreen(cssRule) {
    createCssRuleForScreenSizeMediaQuery("--breakpoint-lg", "992px", cssRule);
}

var FL_CLASS = "dxbs-fl",
    CALC_CLASS = "dxbs-fl-calc";
var patternRegex = /\./g;
function encodeDotsForMediaQuiery(value) {
    return value.replace(patternRegex, "\\$&");
}
function GetMainElement(mainElementId) { return document.getElementById(mainElementId); }
function createAdaptivityCssRules(mainElementId) {
    var mainElement = GetMainElement(mainElementId);
    if (!mainElement) return;
    var width = 0;
    AddClassNameToElement(mainElement, CALC_CLASS);
    width = getMaxCaptionWidth(mainElementId, mainElement, true);
    createAdaptivityCssRulesForElements(mainElementId, mainElement, width);
    RemoveClassNameFromElement(mainElement, CALC_CLASS);
}
function getFilteredElements(mainElementId, elements) {
    var mainElement = GetMainElement(mainElementId);
    return RetrieveByPredicate(elements, function (el) { return GetParentByClassName(el, FL_CLASS) == mainElement; });
}
function getMaxCaptionWidth(mainElementId, container, recursive) {
    var width = 0;
    var elements = getCaptionElements(mainElementId, container, recursive);
    for (var i = 0; i < elements.length; i++) {
        var captionWidth = elements[i].offsetWidth;
        if (captionWidth > width && captionWidth < elements[i].parentNode.offsetWidth)
            width = captionWidth;
    }
    return width > 0 ? (width + (Browser.HardwareAcceleration ? 1 : 0)) : 0;
}
function getAdaptivityCssRulesPrefix(mainElementId, container) {
    var mainElement = GetMainElement(mainElementId);
    var prefix = "#" + encodeDotsForMediaQuiery(mainElementId) + ".dxbs-fl.form-horizontal ";
    if (container != mainElement)
        prefix += "#" + encodeDotsForMediaQuiery(container.id) + " ";
    var flElement = mainElement;
    while (true) {
        flElement = GetParentByClassName(flElement.parentNode, FL_CLASS);
        if (flElement)
            prefix = "#" + encodeDotsForMediaQuiery(flElement.id) + " " + prefix;
        else
            break;
    }
    return prefix;
}
function createAdaptivityCssRulesForElements(mainElementId, container, width) {
    if (width === 0) return;
    if (!container.itemCaptionWidth || width > container.itemCaptionWidth) {
        container.itemCaptionWidth = width;
        var mediaRulePrefix = getAdaptivityCssRulesPrefix(mainElementId, container);
        var mediaRule = mediaRulePrefix + ".form-group > .dxbs-fl-cpt {\n width:" + width + "px;\n}\n";
        mediaRule += mediaRulePrefix + ".form-group > .dxbs-fl-ctrl:not(img):not(.dxbs-fl-ctrl-nc) {\n width: calc(100% - " + width + "px);\n}\n";
        mediaRule += mediaRulePrefix + ".form-group > .dxbs-textbox:not(img):not(.dxbs-fl-ctrl-nc) {\n width: calc(100% - " + width + "px);\n}\n";
        mediaRule += mediaRulePrefix + ".form-group > .dxbs-dropdown-edit:not(img):not(.dxbs-fl-ctrl-nc) {\n width: calc(100% - " + width + "px);\n}\n";
        mediaRule += mediaRulePrefix + ".form-group > .dxbs-spin-edit:not(img):not(.dxbs-fl-ctrl-nc) {\n width: calc(100% - " + width + "px);\n}\n";
        mediaRule += mediaRulePrefix + ".row > div > ." + BootstrapCssSelectorsHelpBlock + " {\n margin-left: " + width + "px;\n}\n";
        createCssRuleForLargeScreen(mediaRule);
    }
}
function getCaptionElements(mainElementId, container, recursive) {
    if (recursive)
        return getFilteredElements(mainElementId, container.querySelectorAll(".dxbs-fl-cpt." + BootstrapCssSelectorsControlLabel));
    return container.querySelectorAll("#" + container.id + " > .row > div:not(.dxbs-fl-g):not(.dxbs-fl-gd):not(.dxbs-fl-gt) > .form-group > ." + BootstrapCssSelectorsControlLabel + ", " +
        "#" + container.id + ".dxbs-fl-gd > ." + BootstrapCssSelectorsPanel + " > .row > div:not(.dxbs-fl-g):not(.dxbs-fl-gd):not(.dxbs-fl-gt) > .form-group > ." + BootstrapCssSelectorsControlLabel + ", " +
        "#" + container.id + ".dxbs-fl-gt > .dxbs-tabs > .tab-content > .tab-pane > .row > div:not(.dxbs-fl-g):not(.dxbs-fl-gd):not(.dxbs-fl-gt) > .form-group > ." + BootstrapCssSelectorsControlLabel);
}
function Init(mainElementId) {
    createAdaptivityCssRules(mainElementId);
}
const formLayout = { Init };

export default formLayout;
export { Init };
