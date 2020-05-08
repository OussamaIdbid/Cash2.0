import { B as Browser } from './esm-chunk-f9104efc.js';
import { AttachEventToElement, DetachEventFromElement, findParentBySelector, getDocumentScrollTop, getDocumentScrollLeft, elementIsInDOM, QuerySelectorFromRoot, EnsureElement, GetLeftRightBordersAndPaddingsSummaryValue } from './esm-dom-utils-d4fe413b.js';
import { D as DisposeEvents, R as RegisterDisposableEvents } from './esm-chunk-6ca2c4f2.js';
import { T as TouchUIHelper } from './esm-chunk-2f760454.js';
import './esm-chunk-710198b6.js';
import { G as GetVerticalScrollBarWidth } from './esm-chunk-95f069f9.js';

var Selectors = {
    GridSelectedRowCell: ".dxbs-table td.table-active",
    ListBoxSelectedItem: ".dropdown-item.active",
};

function GetGraggableSelector(dragId) {
    return "[data-dxdg-draggable-id=" + dragId + "]";
}
function moveDragElement(dragElement, evt, offsetFromMouseWithDocScroll) {
    setElementTranslate(dragElement, (GetClientEventPos(evt, "clientX") - offsetFromMouseWithDocScroll.left), (GetClientEventPos(evt, "clientY") - offsetFromMouseWithDocScroll.top));
}
function setElementTranslate(element, x, y) {
    element.style.transform = ["translate(", Math.round(x), "px, ", Math.round(y), "px)"].join('');
}
var ColumnHeadTypes = { GroupPanelHead: "gph", ColumnHead: "ch" };
function GetClientEventPos(evt, method) {
    if (typeof (evt[method]) !== "undefined")
        return evt[method];
    if (typeof (evt.touches) !== "undefined")
        return evt.touches[0][method];
    return 0;
}
function MouseDown(evt, dragId, dotnetHelper) {
    var startX = GetClientEventPos(evt, "clientX");
    var startY = GetClientEventPos(evt, "clientY");
    var evtTarget = evt.target;
    var d = 10;
    var dragWasActivated = false;
    var mouseMove = function (evt) {
        var dx = Math.abs(startX - GetClientEventPos(evt, "clientX")) > d;
        var dy = Math.abs(startY - GetClientEventPos(evt, "clientY")) > d;
        if (dx || dy) {
            dragWasActivated = true;
            mouseUp();
            DragStart(evt, evtTarget, dragId, dotnetHelper);
        }
        evt.preventDefault();
        return false;
    };
    var mouseUp = function () {
        DetachEventFromElement(document, TouchUIHelper.touchMouseMoveEventName, mouseMove);
        DetachEventFromElement(document, TouchUIHelper.touchMouseUpEventName, mouseUp);
        if (!dragWasActivated && evtTarget && Browser.WebKitTouchUI)
            evtTarget.click();
    };
    AttachEventToElement(document, TouchUIHelper.touchMouseMoveEventName, mouseMove);
    AttachEventToElement(document, TouchUIHelper.touchMouseUpEventName, mouseUp);
    evt.preventDefault();
    return false;
}
function DragStart(evt, evtTarget, dragId, dotnetHelper) {
    var headSelector = GetGraggableSelector(dragId);
    var dragElementOrigin = findParentBySelector(evtTarget, headSelector);
    if (!dragElementOrigin) return;
    var dragDropStatus = dragElementOrigin.dataset.dxdgDraggable.split("|");
    var columnVisibleIndex = parseInt(dragDropStatus[0]);
    var groupVisibleIndex = parseInt(dragDropStatus[1]);
    var columnHeadType = dragDropStatus[3];
    var canBeGrouped = dragDropStatus[4] === "True";
    var startDocScrollLeft = getDocumentScrollLeft();
    var startDocScrollTop = getDocumentScrollTop();
    var docScrollDiff = { left: 0, top: 0 };
    var dragSource = {
        columnVisibleIndex: columnVisibleIndex,
        groupVisibleIndex: groupVisibleIndex,
        columnHeadType: columnHeadType,
        canBeGrouped: canBeGrouped
    };
    var targets = InitTargets(dragElementOrigin, dragId);
    var dragElementInfo = createDragElement(dragElementOrigin, evt);
    var dragElement = dragElementInfo.dragElement;
    var offsetFromMouse = dragElementInfo.offsetFromMouse;
    moveDragElement(dragElement, evt, offsetFromMouse);
    var firtsMove = true;
    var activeTarget = null;
    var mouseMove = function (evt) {
        if (firtsMove) {
            dragElement.style.visibility = "visible";
            firtsMove = false;
        }
        var offsetFromMouseWithDocScroll = {
            left: offsetFromMouse.left + docScrollDiff.left,
            top: offsetFromMouse.top + docScrollDiff.top
        };
        moveDragElement(dragElement, evt, offsetFromMouseWithDocScroll);
        activeTarget = processTargets(targets, dragId, dragSource, evt, docScrollDiff);
        evt.preventDefault();
        return false;
    };
    var mouseUp = function () {
        if (activeTarget) {
            var dragSourceVid = dragSource.columnHeadType == ColumnHeadTypes.GroupPanelHead ? dragSource.groupVisibleIndex : dragSource.columnVisibleIndex;
            var activeTargetVid = activeTarget.columnHeadType == ColumnHeadTypes.GroupPanelHead ? activeTarget.groupVisibleIndex : activeTarget.columnVisibleIndex;
            dotnetHelper.invokeMethodAsync('OnGridColumnHeadDragNDrop',
                dragSourceVid,
                dragSource.columnHeadType,
                activeTargetVid,
                activeTarget.columnHeadType,
                activeTarget.insertBefore
            );
            activeTarget.mark.parentNode.removeChild(activeTarget.mark);
        }
        DetachEventFromElement(document, TouchUIHelper.touchMouseMoveEventName, mouseMove);
        DetachEventFromElement(document, TouchUIHelper.touchMouseUpEventName, mouseUp);
        DetachEventFromElement(window, "scroll", scroll);
        dragElement.parentNode.removeChild(dragElement);
    };
    var scroll = function () {
        docScrollDiff = {
            left: startDocScrollLeft - getDocumentScrollLeft(),
            top: startDocScrollTop - getDocumentScrollTop()
        };
    };
    AttachEventToElement(document, TouchUIHelper.touchMouseMoveEventName, mouseMove);
    AttachEventToElement(document, TouchUIHelper.touchMouseUpEventName, mouseUp);
    AttachEventToElement(window, "scroll", scroll);
}
function createDragElement(dragElementOrigin, evt) {
    var dragElement = dragElementOrigin.cloneNode(true);
    var originDragElementBox = dragElementOrigin.getBoundingClientRect();
    var mousePointerOffset = {
        left: GetClientEventPos(evt, "clientX") - originDragElementBox.left,
        top: GetClientEventPos(evt, "clientY") - originDragElementBox.top
    };
    if (dragElement.tagName != "DIV") {
        var d = document.createElement("DIV");
        var styles = window.getComputedStyle(dragElementOrigin);
        d.innerHTML = dragElement.innerHTML;
        d.className = "card " + dragElementOrigin.className;
        d.style.width = dragElementOrigin.offsetWidth + "px";
        d.style.height = dragElementOrigin.offsetHeight + "px";
        d.style.paddingTop = styles.paddingTop;
        d.style.paddingBottom = styles.paddingBottom;
        d.style.paddingLeft = styles.paddingLeft;
        d.style.paddingRight = styles.paddingRight;
        dragElement = d;
    } else {
        dragElement.style.width = dragElementOrigin.offsetWidth + "px";
        dragElement.style.height = dragElementOrigin.offsetHeight + "px";
    }
    dragElement.className = dragElement.className + " dx-dragging-state";
    document.body.appendChild(dragElement);
    var cloneDragElementBox = dragElement.getBoundingClientRect();
    var dragElementFromMouseOffset = {
        left: cloneDragElementBox.left + mousePointerOffset.left,
        top: cloneDragElementBox.top + mousePointerOffset.top,
    };
    return {
        dragElement: dragElement,
        offsetFromMouse: dragElementFromMouseOffset,
    };
}
function InitTargets(dragElementOrigin, dragId) {
    var targets = [];
    var headSelector = GetGraggableSelector(dragId);
    var targetElements = document.querySelectorAll(headSelector);
    var groupPanelTargetFound = false;
    var columnHeadRowTargetFound = false;
    for (var i = 0; i < targetElements.length; i++) {
        var targetElement = targetElements[i];
        var box = targetElement.getBoundingClientRect();
        var dragDropStatus = targetElement.dataset.dxdgDraggable.split("|");
        var columnVisibleIndex = parseInt(dragDropStatus[0]);
        var groupVisibleIndex = parseInt(dragDropStatus[1]);
        var needInsertBeforeToo = dragDropStatus[2] === "True";
        var columnHeadType = dragDropStatus[3];
        if (columnHeadType == ColumnHeadTypes.GroupPanelHead)
            groupPanelTargetFound = true;
        else if (columnHeadType == ColumnHeadTypes.ColumnHead)
            columnHeadRowTargetFound = true;
        if (needInsertBeforeToo)
            targets.push(new target(targetElement, box.left, box.top, box.bottom, columnVisibleIndex, groupVisibleIndex, columnHeadType, true, false));
        targets.push(new target(targetElement, box.right, box.top, box.bottom, columnVisibleIndex, groupVisibleIndex, columnHeadType, false, false));
    }
    var hasTargets = groupPanelTargetFound || columnHeadRowTargetFound;
    if (hasTargets) {
        if (!groupPanelTargetFound) {
            var groupPanelElement = document.querySelector("[data-dxdg-drag-group-panel=" + dragId + "]");
            if (groupPanelElement) {
                var box = groupPanelElement.getBoundingClientRect();
                targets.push(new target(groupPanelElement, box.left, box.top, box.bottom, -1, 0, ColumnHeadTypes.GroupPanelHead, false, true, true));
            }
        }
        if (!columnHeadRowTargetFound) {
            var columnRowElement = document.querySelector("[data-dxdg-drag-head-row=" + dragId + "]");
            if (columnRowElement) {
                var box = columnRowElement.getBoundingClientRect();
                targets.push(new target(columnRowElement, box.right, box.top, box.bottom, 0, -1, ColumnHeadTypes.ColumnHead, false, true, true));
            }
        }
    }
    return targets;
}
function target(element, x, top, bottom, columnVisibleIndex, groupVisibleIndex, columnHeadType, insertBefore, wholeRowIsRarget) {
    this.element = element;
    this.x = x;
    this.top = top;
    this.bottom = bottom;
    this.columnVisibleIndex = columnVisibleIndex;
    this.groupVisibleIndex = groupVisibleIndex;
    this.columnHeadType = columnHeadType;
    this.insertBefore = insertBefore;
    this.wholeRowIsRarget = wholeRowIsRarget;
    this.docScrollTop = getDocumentScrollTop();
    this.docScrollLeft = getDocumentScrollLeft();
}
function dragDropToTheSameColumn(dragSource, target) {
    function groupIndicesCoinside(dragSource, target) {
        return target.groupVisibleIndex == dragSource.groupVisibleIndex ||
            target.groupVisibleIndex == dragSource.groupVisibleIndex - 1 && !target.insertBefore;
    }
    function ColumnIndicesCoinside(dragSource, target) {
        return target.columnVisibleIndex == dragSource.columnVisibleIndex ||
            target.columnVisibleIndex == dragSource.columnVisibleIndex - 1 && !target.insertBefore;
    }
    var reorderGroupToTheSameColumn = target.columnHeadType == dragSource.columnHeadType && dragSource.columnHeadType == ColumnHeadTypes.GroupPanelHead && groupIndicesCoinside(dragSource, target);
    if (reorderGroupToTheSameColumn) return true;
    var reordercolumnToTheSameColumn = target.columnHeadType == dragSource.columnHeadType && dragSource.columnHeadType == ColumnHeadTypes.ColumnHead && ColumnIndicesCoinside(dragSource, target);
    if (reordercolumnToTheSameColumn) return true;
    var ungroupToInself = dragSource.columnHeadType == ColumnHeadTypes.GroupPanelHead && target.columnHeadType == ColumnHeadTypes.ColumnHead && dragSource.columnVisibleIndex != -1 && ColumnIndicesCoinside(dragSource, target);
    if (ungroupToInself) return true;
    var groupToInself = dragSource.columnHeadType == ColumnHeadTypes.ColumnHead && target.columnHeadType == ColumnHeadTypes.GroupPanelHead && dragSource.groupVisibleIndex != -1 && groupIndicesCoinside(dragSource, target);
    if (groupToInself) return true;
    return false;
}
function processTargets(targets, dragId, dragSource, evt, docScrollDiff) {
    deactivateTarget(dragId);
    var activeTarget = null;
    var distances = [];
    var mouseX = GetClientEventPos(evt, "clientX");
    var mouseY = GetClientEventPos(evt, "clientY");
    for (var i = 0; i < targets.length; i++) {
        var target = targets[i];
        if (dragDropToTheSameColumn(dragSource, target)) continue;
        if (target.columnHeadType == ColumnHeadTypes.GroupPanelHead && !dragSource.canBeGrouped) continue;
        var mouseIsBetween = target.top + docScrollDiff.top <= mouseY && mouseY <= target.bottom + docScrollDiff.top;
        if (!mouseIsBetween) continue;
        if (target.wholeRowIsRarget) {
            activeTarget = target;
            break;
        } else {
            distances.push({ distance: Math.abs(Math.abs(target.x + docScrollDiff.left) - Math.abs(mouseX)), target: target });
        }
    }
    if (activeTarget == null) {
        var minDistance = 1000000;
        for (var i in distances) {
            if (minDistance > distances[i].distance) {
                minDistance = distances[i].distance;
                activeTarget = distances[i].target;
            }
        }
    }
    if (activeTarget != null)
        activateTarget(activeTarget, dragId);
    return activeTarget;
}
var dropTargetMarkClassName = "dxgv-target-marks";
function activateTarget(target, dragId) {
    var targetMark = document.createElement("DIV");
    var padding = 1;
    targetMark.className = dropTargetMarkClassName;
    targetMark.dataset.dxdgDraggableId = dragId;
    targetMark.style.top = target.top + (target.docScrollTop - getDocumentScrollTop()) + getDocumentScrollTop() - 1 - padding + "px";
    targetMark.style.height = (target.bottom - target.top) + 2 * padding + "px";
    targetMark.style.left = target.x + (target.docScrollLeft - getDocumentScrollLeft()) + getDocumentScrollLeft() + "px";
    targetMark.innerHTML =
        ["<span class='oi oi-arrow-bottom' aria-hidden='true'></span>",
            "<div style='height:", targetMark.style.height, "'></div>",
            "<span class='oi oi-arrow-top' aria-hidden='true'></span>"].join('');
    document.body.appendChild(targetMark);
    target.mark = targetMark;
}
function deactivateTarget(dragId) {
    var headSelector = GetGraggableSelector(dragId);
    var dropTargetMarksSelector = "div." + dropTargetMarkClassName + headSelector;
    var dropTargetMarks = document.querySelectorAll(dropTargetMarksSelector);
    for (var i = 0; i < dropTargetMarks.length; i++) {
        var targetMark = dropTargetMarks[i];
        targetMark.parentNode.removeChild(targetMark);
    }
}

var ScrollFilteringTimeout = 200;
function ScrollToSelectedItem(mainElement) {
    if(!elementIsInDOM(mainElement)) return;
    var selectedRowElement = getListBoxSelectedItemElement(mainElement);
    if (!selectedRowElement)
        var selectedRowElement = getGridSelectedRowElement(mainElement);
    if (selectedRowElement) {
        var scrollElement = mainElement;
        var above = scrollElement.scrollTop > selectedRowElement.offsetTop;
        var below = scrollElement.scrollTop + scrollElement.clientHeight < selectedRowElement.offsetTop + selectedRowElement.offsetHeight;
        if (above) {
            scrollElement.scrollTop = selectedRowElement.offsetTop;
        }
        if (below) {
            scrollElement.scrollTop = selectedRowElement.offsetTop - (scrollElement.clientHeight - selectedRowElement.offsetHeight);
        }
    }
}
function getGridSelectedRowElement(dropDownElement) {
    var glLbElement = null;
    QuerySelectorFromRoot(dropDownElement, function(rootQuery) {
        glLbElement = dropDownElement.querySelector("*"+ rootQuery + " > *[id$='_LB']");
    });
    if(!glLbElement) {
        QuerySelectorFromRoot(dropDownElement.parentNode, function(rootQuery) {
            glLbElement = dropDownElement.parentNode.querySelector("*" + rootQuery + " > *[id$='_LB']");
        });
    }
    var firstSelectedCell = glLbElement ? glLbElement.querySelector(Selectors.GridSelectedRowCell) : null;
    return firstSelectedCell ? firstSelectedCell.parentNode : null;
}
function getListBoxSelectedItemElement(dropDownElement) {
    var lbIdSelector = dropDownElement.querySelector("*[id$='_LB']");
    if(!lbIdSelector)
        lbIdSelector = dropDownElement.parentNode.querySelector("*[id$='_LB']");
    if(!lbIdSelector)
        lbIdSelector = dropDownElement;
    if(lbIdSelector) {
        var lbSelectedItemElement = lbIdSelector.querySelector(Selectors.ListBoxSelectedItem);
        if (lbSelectedItemElement)
            return lbSelectedItemElement.parentNode;
    }
    return null;
}
function OnScroll(evt, dotnetHelper, options, scrollHeaderElement, virtualScrollSpacerTopElement, virtualScrollSpacerBottomElement) {
    var scrollElement = evt.target;
    OnScrollInstant(evt, dotnetHelper, options, scrollElement, scrollHeaderElement);
    if(scrollElement.dataset.InScrollRequest) return;
    ClearVirtualScrollingTimer(scrollElement);
    scrollElement.dataset.OnScrollTimerId = window.setTimeout(function() {
        OnScrollSmoothed(evt, dotnetHelper, options, scrollElement, scrollHeaderElement, virtualScrollSpacerTopElement, virtualScrollSpacerBottomElement);
    }, ScrollFilteringTimeout);
    window.setTimeout(function() {
        OnScrollInstant(evt, dotnetHelper, options, scrollElement, scrollHeaderElement);
    }, 0);
}
function OnScrollInstant(evt, dotnetHelper, options, scrollElement, scrollHeaderElement, virtualScrollSpacerTopElement, virtualScrollSpacerBottomElement) {
    if(options.isHorizontalScrolling)
        scrollHeaderElement.scrollLeft = scrollElement.scrollLeft;
}
function OnScrollSmoothed(evt, dotnetHelper, options, scrollElement, scrollHeaderElement, virtualScrollSpacerTopElement, virtualScrollSpacerBottomElement) {
    ClearVirtualScrollingTimer(scrollElement);
    var scrollVertical = true;
    if(!scrollElement.dataset.prevScrollTop)
        scrollElement.dataset.prevScrollTop = scrollElement.scrollTop;
    else
        scrollVertical = scrollElement.dataset.prevScrollTop != scrollElement.scrollTop.toString();
    if(scrollVertical && options.isVirtualScrolling)
        EnsureItemsVisible(dotnetHelper, scrollElement, virtualScrollSpacerTopElement, virtualScrollSpacerBottomElement, false);
    OnScrollInstant(evt, dotnetHelper, options, scrollElement, scrollHeaderElement);
}
function ClearVirtualScrollingTimer(scrollElement) {
    if(scrollElement.dataset.OnScrollTimerId) {
        clearTimeout(scrollElement.dataset.OnScrollTimerId);
        delete scrollElement.dataset.OnScrollTimerId;
    }
}
function GetDataElement(scrollElement) {
    var dataTable = scrollElement.querySelector("table.dxbs-table");
    var dataList = scrollElement.parentNode.querySelector("div.dxbs-listbox > ul");
    var dataElement = dataTable || dataList;
    return dataElement;
}
function InitScrollHeight(dotnetHelper, scrollElement, virtualScrollSpacerTopElement, virtualScrollSpacerBottomElement, options) {
    var dataElement = GetDataElement(scrollElement);
    var sizes = CalculateSizes(dataElement, options);
    virtualScrollSpacerTopElement.style.height = sizes.spacerTop + "px";
    virtualScrollSpacerBottomElement.style.height = sizes.spacerBelow + "px";
    InitScrollPosition(scrollElement, dataElement,  virtualScrollSpacerTopElement);
}
function InitScrollPosition(scrollElement, dataElement,  virtualScrollSpacerTopElement, virtualScrollSpacerBottomElement) {
    if(scrollElement.clientHeight > dataElement.offsetHeight) return;
    if(scrollElement.scrollTop < virtualScrollSpacerTopElement.clientHeight) {
        scrollElement.scrollTop = virtualScrollSpacerTopElement.clientHeight + 1;
    }
    if(scrollElement.scrollTop + scrollElement.clientHeight > virtualScrollSpacerTopElement.clientHeight + dataElement.offsetHeight) {
        scrollElement.scrollTop = virtualScrollSpacerTopElement.clientHeight + dataElement.offsetHeight - scrollElement.clientHeight - 1;
    }
}
function getItems(dataElement) {
    var items = [];
    dataElement.dataset.tempUniqueId = "tempUniqueId";
    if(dataElement.tagName === "TABLE") {
        items = dataElement.parentNode.querySelectorAll("TABLE[data-temp-unique-id] > TBODY > TR");
    } else if(dataElement.tagName === "UL") {
        items = dataElement.parentNode.querySelectorAll("ul[data-temp-unique-id] > li");
    }
    delete dataElement.dataset.tempUniqueId;
    return items;
}
function getItemHeight(dataElement) {
    var items = getItems(dataElement);
    var itemHeights = {};
    for(var i = 0; i < items.length; i++) {
        var item = items[i];
        itemHeights[item.offsetHeight] = itemHeights[item.offsetHeight] ? (itemHeights[item.offsetHeight] + 1) : 1;
    }
    var maxCountHeight = 0;
    var maxCount = 0;
    for(var height in itemHeights) {
        if(itemHeights[height] > maxCount) {
            maxCount = itemHeights[height];
            maxCountHeight = height;
        }
    }
    return Number.parseInt(maxCountHeight);
}
function CalculateSizes(dataElement, options) {
    var itemHeight = getItemHeight(dataElement);
    var spacerTop = options.VirtualScrollingOptions.ItemsAbove * itemHeight;
    var spacerBelow = options.VirtualScrollingOptions.ItemsBelow * itemHeight;
    return {
        itemHeight: itemHeight,
        spacerTop: spacerTop,
        spacerBelow: spacerBelow,
    };
}
function HasParametersForVirtualScrollingRequest(scrollElement) {
    var dataElement = GetDataElement(scrollElement);
    return dataElement !== null;
}
function GetParametersForVirtualScrollingRequest(scrollElement, doNotUseScrollPaddingForInitShow) {
    var scrollPaddingTop = 300;
    var scrollPaddingBottom = 300;
    if(doNotUseScrollPaddingForInitShow) {
        scrollPaddingTop = 0;
        scrollPaddingBottom = 0;
    }
    var dataElement = GetDataElement(scrollElement);
    var scrollTop = scrollElement.scrollTop - scrollPaddingTop;
    if(scrollTop < 0) scrollTop = 0;
    var scrollBottom = scrollElement.scrollTop + scrollElement.clientHeight + scrollPaddingBottom;
    var scrollTopForRequest = scrollTop - scrollPaddingTop;
    if(scrollTopForRequest < 0)
        scrollTopForRequest = 0;
    var scrollHeightForRequest = scrollBottom - scrollTopForRequest + scrollPaddingBottom;
    var itemHeight = getItemHeight(dataElement);
    return {
        itemHeight: itemHeight,
        scrollTop: scrollTop,
        scrollBottom: scrollBottom,
        scrollTopForRequest: scrollTopForRequest,
        scrollHeightForRequest: scrollHeightForRequest
    };
}
function EnsureItemsVisible(dotnetHelper, scrollElement, virtualScrollSpacerTopElement, virtualScrollSpacerBottomElement, doNotUseScrollPaddingForInitShow) {
    var dataElement = GetDataElement(scrollElement);
    var tuple = GetParametersForVirtualScrollingRequest(scrollElement, doNotUseScrollPaddingForInitShow);
    var itemHeight = tuple.itemHeight;
    var scrollTop = tuple.scrollTop;
    var scrollBottom = tuple.scrollBottom;
    var scrollTopForRequest = tuple.scrollTopForRequest;
    var scrollHeightForRequest = tuple.scrollHeightForRequest;
    var topSpacerVisible = virtualScrollSpacerTopElement.clientHeight > 0 && scrollTop < virtualScrollSpacerTopElement.offsetHeight;
    var bottomSpacerVisible = virtualScrollSpacerBottomElement.clientHeight > 0 && scrollBottom > virtualScrollSpacerTopElement.offsetHeight + dataElement.offsetHeight;
    if(topSpacerVisible || bottomSpacerVisible) {
        scrollElement.dataset.InScrollRequest = true;
        SendGridVirtualScroll(dotnetHelper, itemHeight, scrollTopForRequest, scrollHeightForRequest);
    }
}
function SendGridVirtualScroll(dotnetHelper, itemHeight, scrollTopForRequest, scrollHeightForRequest) {
    if(!dotnetHelper.dxScrollCache) {
        dotnetHelper.dxScrollCache = {
            itemHeight: itemHeight,
            scrollTopForRequest: scrollTopForRequest,
            scrollHeightForRequest: scrollHeightForRequest,
        };
    } else {
        if(dotnetHelper.dxScrollCache.itemHeight === itemHeight &&
            dotnetHelper.dxScrollCache.scrollTopForRequest === scrollTopForRequest &&
            dotnetHelper.dxScrollCache.scrollHeightForRequest === scrollHeightForRequest)
            return;
    }
    dotnetHelper.invokeMethodAsync('OnGridVirtualScroll',
        itemHeight,
        scrollTopForRequest,
        scrollHeightForRequest);
}
function InitScrollbarWidth(scrollElement, scrollHeaderElement, options) {
    if(!options.isVerticalScrolling && !options.isVirtualScrolling) return;
    if(!scrollHeaderElement) return;
    var scrollbarPaddingElements = [scrollHeaderElement];
    if(HasVerticalScrollBar(scrollElement, options)) {
        var defaulScrollBarWidth = 17;
        var scrollBarWidth = GetVerticalScrollBarWidth();
        if(scrollBarWidth !== defaulScrollBarWidth || options.isHorizontalScrolling) {
            var styleToZero = options.isHorizontalScrolling ? "paddingRight" : "marginRight";
            var styleToScrollBarSize = options.isHorizontalScrolling ? "marginRight" : "paddingRight";
            for (var i = 0, len = scrollbarPaddingElements.length; i < len; i++) {
                scrollbarPaddingElements[i].style[styleToZero] = "0";
                scrollbarPaddingElements[i].style[styleToScrollBarSize] = scrollBarWidth + "px";
            }
        } else {
            scrollElement.style["paddingRight"] = "";
            scrollElement.style["marginRight"] = "";
            scrollHeaderElement.style["paddingRight"] = "";
            scrollHeaderElement.style["marginRight"] = "";
        }
    } else {
        scrollElement.style["paddingRight"] = "0";
        scrollElement.style["marginRight"] = "0";
        scrollHeaderElement.style["paddingRight"] = "0";
        scrollHeaderElement.style["marginRight"] = "0";
    }
}
function AutoWidthCalculate(mainElement, scrollElement, scrollHeaderElement, virtualScrollSpacerTopElement, virtualScrollSpacerBottomElement, options) {
    if(scrollElement) {
        scrollElement.dataset.InScrollRequest = true;
        var scrollElementOverflowX_Backup = scrollElement.style.overflowX;
        scrollElement.style.overflowX = "hidden";
        scrollElement.style.width = "0";
    }
    if(scrollHeaderElement) {
        var scrollHeaderElementOverflowX_Backup = scrollHeaderElement.style.overflowX;
        scrollHeaderElement.style.overflowX = "hidden";
        scrollHeaderElement.style.width = "0";
    }
    var width = mainElement.clientWidth;
    if(scrollElement) {
        if(width)
            scrollElement.style.width = width + "px";
        scrollElement.style.overflowX = scrollElementOverflowX_Backup;
    }
    if(scrollHeaderElement) {
        var correction = HasVerticalScrollBar(scrollElement, options) ? GetVerticalScrollBarWidth() : 0;
        if(width)
            scrollHeaderElement.style.width = (width - correction) + "px";
        scrollHeaderElement.style.overflowX = scrollHeaderElementOverflowX_Backup;
    }
    if(scrollElement)
        delete scrollElement.dataset.InScrollRequest;
}
function HasVerticalScrollBar(scrollElement, options) {
    return (options.isVerticalScrolling || options.isVirtualScrolling) &&
        (scrollElement.clientHeight < scrollElement.scrollHeight || scrollElement.style.overflowY == "scroll");
}
function InitGroupButtonCellWidth(mainElement) {
    var groupColumnHeadButtons = mainElement.querySelectorAll("th.dxbs-header-indent>button.invisible");
    var width = 0;
    for(var i = 0; i < groupColumnHeadButtons.length; i++) {
        var groupColumnHeadButton = groupColumnHeadButtons[i];
        var buttonWidth = groupColumnHeadButton.offsetWidth + GetLeftRightBordersAndPaddingsSummaryValue(groupColumnHeadButton.parentNode);
        if(width < buttonWidth)
            width = buttonWidth;
    }
    for(var i = 0; i < groupColumnHeadButtons.length; i++) {
        var groupColumnHeadButton = groupColumnHeadButtons[i];
        groupColumnHeadButton.parentNode.style.width = width + "px";
    }
}
function AutoWidthRequired(options) {
    return options.isHorizontalScrolling || options.isVerticalScrolling;
}
function Init(mainElement, scrollElement, scrollHeaderElement, virtualScrollSpacerTopElement, virtualScrollSpacerBottomElement, options, dotnetHelper, scrollToSelectedItemRequested) {
    if(mainElement === null) return;
    options = JSON.parse(options);
    mainElement = EnsureElement(mainElement);
    DisposeEvents(mainElement);
    var onScroll = null;
    var onWindowResize = null;
    var columnHeadRowMouseDown = null;
    var groupRowMouseDown = null;
    scrollElement = EnsureElement(scrollElement);
    if(scrollElement) {
        scrollHeaderElement= EnsureElement(scrollHeaderElement);
        scrollElement.dataset.InScrollRequest = true;
        if(options.isVirtualScrolling) {
            virtualScrollSpacerTopElement = EnsureElement(virtualScrollSpacerTopElement);
            virtualScrollSpacerBottomElement = EnsureElement(virtualScrollSpacerBottomElement);
        }
        if(options.isVirtualScrolling || options.isVerticalScrolling)
            InitScrollbarWidth(scrollElement, scrollHeaderElement, options);
        if(options.isVirtualScrolling) {
            InitScrollHeight(dotnetHelper, scrollElement, virtualScrollSpacerTopElement, virtualScrollSpacerBottomElement, options);
            if(scrollToSelectedItemRequested)
                ScrollToSelectedItem(scrollElement);
        }
        InitGroupButtonCellWidth(mainElement);
        delete scrollElement.dataset.InScrollRequest;
        onScroll = function (evt) { return OnScroll(evt, dotnetHelper, options, scrollHeaderElement, virtualScrollSpacerTopElement, virtualScrollSpacerBottomElement); };
        AttachEventToElement(scrollElement, "scroll", onScroll);
        if(AutoWidthRequired(options)) {
            onWindowResize = function() { AutoWidthCalculate(mainElement, scrollElement, scrollHeaderElement, virtualScrollSpacerTopElement, virtualScrollSpacerBottomElement, options); };
            onWindowResize();
            AttachEventToElement(window, "resize", onWindowResize);
        }
    }
    var columnHeadRow = null;
    var groupPanel = null;
    if(options.isColumnDragEnabled) {
        var dragId = mainElement.dataset.dxdgId;
        if(dragId) {
            var firtsColumnHead = mainElement.querySelector("th" + GetGraggableSelector(dragId));
            columnHeadRow = firtsColumnHead ? firtsColumnHead.parentNode : null;
            if(columnHeadRow) {
                columnHeadRowMouseDown = function(evt) { return MouseDown(evt, dragId, dotnetHelper); };
                AttachEventToElement(columnHeadRow, TouchUIHelper.touchMouseDownEventName, columnHeadRowMouseDown);
            }
            var firtsGroupPanelHead = mainElement.querySelector("div" + GetGraggableSelector(dragId));
            groupPanel = firtsGroupPanelHead ? firtsGroupPanelHead.parentNode : null;
            if(groupPanel) {
                groupRowMouseDown = function(evt) { return MouseDown(evt, dragId, dotnetHelper); };
                AttachEventToElement(groupPanel, TouchUIHelper.touchMouseDownEventName, groupRowMouseDown);
            }
        }
    }
    RegisterDisposableEvents(mainElement, function () {
        if(onScroll)
            DetachEventFromElement(scrollElement, "scroll", onScroll);
        if(onWindowResize)
            DetachEventFromElement(window, "resize", onWindowResize);
        if(scrollElement)
            ClearVirtualScrollingTimer(scrollElement);
        if(columnHeadRowMouseDown && columnHeadRow)
            DetachEventFromElement(columnHeadRow, TouchUIHelper.touchMouseDownEventName, columnHeadRowMouseDown);
        if(groupRowMouseDown && groupPanel)
            DetachEventFromElement(groupPanel, TouchUIHelper.touchMouseDownEventName, groupRowMouseDown);
    });
    return Promise.resolve("ok");
}
function Dispose(mainElement) {
    mainElement = EnsureElement(mainElement);
    if (mainElement)
        DisposeEvents(mainElement);
    return Promise.resolve("ok");
}
const grid = { Init, Dispose };

export default grid;
export { Dispose, GetParametersForVirtualScrollingRequest, HasParametersForVirtualScrollingRequest, Init, ScrollToSelectedItem };
