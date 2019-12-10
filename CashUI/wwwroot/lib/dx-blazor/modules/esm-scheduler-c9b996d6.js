import { B as Browser } from './esm-chunk-f9104efc.js';
import { GetAbsoluteX, GetAbsoluteY, SetAbsoluteX, SetAbsoluteY, RemoveClassNameFromElement, AddClassNameToElement, GetDocumentScrollLeft, GetDocumentScrollTop, GetDocumentClientHeight, GetDocumentClientWidth, EnsureElement, AttachEventToElement, GetParentByClassName, ElementHasCssClass, subscribeElementContentWidth, PreventEventAndBubble, DetachEventFromElement } from './esm-dom-utils-d4fe413b.js';
import { D as DisposeEvents, R as RegisterDisposableEvents } from './esm-chunk-6ca2c4f2.js';
import { L as LongTabEventHelper, T as TouchUIHelper, h as hasUnforcedFunction, u as unforcedFunctionCall, c as clearUnforcedFunctionByKey } from './esm-chunk-2f760454.js';
import { T as Timer } from './esm-chunk-38c61c5f.js';

var dxHintClassNames = {
    sysClassName: "dx-hint",
    contentElementClassName: "dxh-content",
    calloutElementClassName: "arrow",
    titleElementClassName: "dxh-title"
};
var DefaultOptions = {
    showCallout: true,
    showTitle: false,
    position: "right",
    className: "",
    classNames: dxHintClassNames,
    allowFlip: true,
    allowShift: true,
    offset: 4
};
function ShowHint(targetElement, hintElement, options) {
    if (!options)
        options = DefaultOptions;
    hintElement.style.visibility = "hidden";
    hintElement.style.display = "block";
    togglePositionInCaseOfUndefinedHintSizes(targetElement, hintElement);
    RenderHelper.updatePosition(targetElement, hintElement, options);
    hintElement.style.visibility = "";
}
function togglePositionInCaseOfUndefinedHintSizes(targetElement, hintElement) {
    var x = GetAbsoluteX(targetElement);
    var y = GetAbsoluteY(targetElement);
    SetAbsoluteX(hintElement, x);
    SetAbsoluteY(hintElement, y);
}
var RenderHelper = (function () {
    function getPositionClassName(position) {
        return "bs-popover-" + position.toLowerCase();
    }
    function ensureCalloutPosition(mainElement, prevPosition, currentPosition) {
        var prevClassName = getPositionClassName(prevPosition);
        var currentClassName = getPositionClassName(currentPosition);
        RemoveClassNameFromElement(mainElement, prevClassName);
        AddClassNameToElement(mainElement, currentClassName);
    }
    function isPositionHorizontal(position) {
        return position === "left" || position === "right";
    }
    function ensureCalloutShift(mainElement, options, shift) {
        var calloutElement = RenderHelper.getCalloutElement(mainElement, options.classNames);
        if (!calloutElement) return;
        var isX = !isPositionHorizontal(options.position);
        var hintSize = isX ? mainElement.offsetWidth : mainElement.offsetHeight;
        var shiftSize = isX ? shift.x : shift.y;
        var calloutPos = hintSize / 2 - shiftSize;
        calloutPos = LimitCalloutPos(calloutPos, hintSize);
        var propName = isX ? "left" : "top";
        calloutElement.style[propName] = calloutPos;
    }
    function LimitCalloutPos(calloutPos, hintSize) {
        var padding = 15;
        var limits = { min: padding, max: hintSize - padding };
        var outsideMin = calloutPos < limits.min;
        var outsideMax = calloutPos > limits.max;
        if (outsideMax) calloutPos = limits.max;
        if (outsideMin) calloutPos = limits.min;
        calloutPos += "px";
        if (outsideMin && outsideMax) calloutPos = "50%";
        return calloutPos;
    }
    function getCalloutElement(mainElement, classNames) {
        return mainElement ? mainElement.getElementsByClassName(classNames.calloutElementClassName)[0] : null;
    }
    function updatePosition(targetElement, mainElement, options) {
        var maxSteps = 10;
        var hintChangesSizeDueMoving = false;
        do {
            var mainElementSize = { w: mainElement.offsetWidth, h: mainElement.offsetHeight };
            updatePositionStep(targetElement, mainElement, options);
            hintChangesSizeDueMoving = mainElementSize.w !== mainElement.offsetWidth || mainElementSize.h !== mainElement.offsetHeight;
            maxSteps--;
        } while (hintChangesSizeDueMoving && maxSteps > 0);
    }
    function updatePositionStep(targetElement, mainElement, options) {
        var changes = PositionHelper.set(targetElement, mainElement, options);
        ensureCalloutPosition(mainElement, options.position, changes.flipPosition);
        ensureCalloutShift(mainElement, options, changes.shift);
    }
    return {
        getCalloutElement: getCalloutElement,
        updatePosition: updatePosition,
    };
})();
function PositionCalcContext(targetElement, hintElement, options) {
    this.targetElement = targetElement;
    this.hintElement = hintElement;
    this.options = options;
    this.position = options.position;
    this.calloutSize = { width: 0, height: 0 };
    var calloutElement = RenderHelper.getCalloutElement(hintElement, options.classNames);
    if (calloutElement) {
        this.calloutSize.width = calloutElement.offsetWidth;
        this.calloutSize.height = calloutElement.offsetHeight;
    }
    this.horizontal = new SizeContent(targetElement, hintElement, options, this.calloutSize, true);
    this.vertical = new SizeContent(targetElement, hintElement, options, this.calloutSize, false);
    function SizeContent(targetElement, hintElement, options, calloutSize, isX) {
        this.location = 0;
        this.screen = { min: 0, max: 0 };
        this.screen.min = isX ? GetDocumentScrollLeft() : GetDocumentScrollTop();
        var viewPortWidth = Browser.WebKitTouchUI ? window.innerWidth : GetDocumentClientWidth();
        this.screen.max = this.screen.min + (isX ? viewPortWidth : GetDocumentClientHeight());
        this.target = { min: 0, max: 0 };
        this.target.min = isX ? GetAbsoluteX(targetElement) : GetAbsoluteY(targetElement);
        this.target.max = this.target.min + (isX ? targetElement.offsetWidth : targetElement.offsetHeight);
        this.hintSize = isX ? hintElement.offsetWidth : hintElement.offsetHeight;
    }
}
var PositionHelper = (function () {
    function calcPosition(targetElement, hintElement, options) {
        var context = new PositionCalcContext(targetElement, hintElement, options);
        var positionOrientation = getPositionOrienation(context.position);
        if (options.allowFlip) {
            if (positionOrientation.horizontal)
                context.position = FlipPositionToClientScreenHelper.flipPositionIfRequired(context.horizontal, context.position);
            else if (positionOrientation.vertical)
                context.position = FlipPositionToClientScreenHelper.flipPositionIfRequired(context.vertical, context.position);
        }
        var offsets = getNotShiftedOffset(context);
        var minTargetMargin = 0;
        var shift = {
            x: 0,
            y: 0
        };
        if (options.allowShift) {
            shift.x = ShiftPositionToClientScreenHelper.getShift(context.horizontal, positionOrientation, offsets.x, minTargetMargin, true);
            shift.y = ShiftPositionToClientScreenHelper.getShift(context.vertical, positionOrientation, offsets.y, minTargetMargin, false);
        }
        return {
            location: {
                x: offsets.x + shift.x,
                y: offsets.y + shift.y
            },
            shift: shift,
            flipPosition: context.position
        };
    }
    function getPositionOrienation(position) {
        var vertical = position === "bottom" || position === "top";
        var horizontal = position === "right" || position === "left";
        return {
            vertical: vertical,
            horizontal: horizontal
        };
    }
    function getNotShiftedOffset(context) {
        var targetSize = {
            width: context.horizontal.target.max - context.horizontal.target.min,
            height: context.vertical.target.max - context.vertical.target.min,
        };
        var hintSize = {
            width: context.horizontal.hintSize,
            height: context.vertical.hintSize,
        };
        return getNotShiftedOffsetCore(context.position, targetSize, hintSize, context.calloutSize);
    }
    function getNotShiftedOffsetCore(position, targetSize, hintSize, calloutSize) {
        var offset = { x: 0, y: 0 };
        if (position === "top")
            offset.y -= hintSize.height + calloutSize.height;
        else if (position === "bottom")
            offset.y += targetSize.height + calloutSize.height;
        else if (position === "left")
            offset.x -= hintSize.width + calloutSize.width;
        else if (position === "right")
            offset.x += targetSize.width + calloutSize.width;
        if (position === "top" || position === "bottom")
            offset.x += targetSize.width / 2 - hintSize.width / 2;
        if (position === "left" || position === "right")
            offset.y += targetSize.height / 2 - hintSize.height / 2;
        return offset;
    }
    function set(targetElement, windowElement, options) {
        var pos = calcPosition(targetElement, windowElement, options);
        var customOffsets = { x: 0, y: 0 };
        var positionOrientation = getPositionOrienation(pos.flipPosition);
        if (positionOrientation.horizontal)
            customOffsets.x = options.offset * pos.location.x / Math.abs(pos.location.x);
        if (positionOrientation.vertical)
            customOffsets.y = options.offset * pos.location.y / Math.abs(pos.location.y);
        var x = typeof options["x"] !== "undefined" ? options.x : GetAbsoluteX(targetElement) + pos.location.x + customOffsets.x;
        var y = typeof options["y"] !== "undefined" ? options.y : GetAbsoluteY(targetElement) + pos.location.y + customOffsets.y;
        SetAbsoluteX(windowElement, x);
        SetAbsoluteY(windowElement, y);
        return {
            flipPosition: pos.flipPosition,
            shift: {
                x: pos.shift.x,
                y: pos.shift.y
            }
        };
    }
    return {
        set: set,
        getNotShiftedOffsetCore: getNotShiftedOffsetCore,
    };
})();
var FlipPositionToClientScreenHelper = {
    flipPositionIfRequired: function (context, position) {
        return this.ensureFlipCore(context.screen, context.target, context.hintSize, position);
    },
    getFlipPosition: function (position) {
        if (position === "bottom")
            return "top";
        if (position === "top")
            return "bottom";
        if (position === "right")
            return "left";
        if (position === "left")
            return "right";
        return position;
    },
    ensureFlipCore: function (screen, target, hintSize, position) {
        var positionMax = position === "bottom" || position === "right";
        var positionMin = position === "top" || position === "left";
        var spaceToMin = (target.min - hintSize) - screen.min;
        if (target.min - hintSize > screen.max) spaceToMin = -1;
        var spaceToMax = screen.max - (target.max + hintSize);
        if (target.max + hintSize < screen.min) spaceToMax = -1;
        var enoughSpaceMin = spaceToMin >= 0;
        var enoughSpaceMax = spaceToMax >= 0;
        if (!enoughSpaceMin && !enoughSpaceMax)
            return position;
        var enoughSpaceToShowHintMinWithoutFlip = positionMin && enoughSpaceMin;
        if (enoughSpaceToShowHintMinWithoutFlip) {
            return position;
        }
        var enoughSpaceToShowHintMaxWithoutFlip = positionMax && enoughSpaceMax;
        if (enoughSpaceToShowHintMaxWithoutFlip) {
            return position;
        }
        var flipMinToMax = positionMin && !enoughSpaceMin && spaceToMin < spaceToMax;
        var flipMaxToMin = positionMax && !enoughSpaceMax && spaceToMax < spaceToMin;
        if (flipMinToMax) {
            return this.getFlipPosition(position);
        }
        if (flipMaxToMin) {
            return this.getFlipPosition(position);
        }
        return position;
    }
};
var ShiftPositionToClientScreenHelper = {
    getShift: function (context, positionOrientation, hintOffset, minTargetMargin, isX) {
        var hintShift = 0;
        var canShift = !(positionOrientation.horizontal && isX) &&
            !(positionOrientation.vertical && !isX);
        if (canShift)
            hintShift = this.getShiftCore(context.screen, context.target, context.hintSize, hintOffset, minTargetMargin);
        return hintShift;
    },
    getShiftCore: function (screen, target, hintSize, hintOffset, minTargetMargin) {
        var notShiftedPos = 0;
        var targetIsOutsideMin = target.max < screen.min + minTargetMargin;
        var targetIsOutsideMax = target.min > screen.max - minTargetMargin;
        if (targetIsOutsideMin || targetIsOutsideMax)
            return notShiftedPos;
        var hint = { min: target.min + hintOffset, max: target.min + hintOffset + hintSize };
        var targetPartiallyOutsideLeft = hint.min < screen.min && hint.max > screen.min;
        var targetPartiallyOutsideRight = hint.max > screen.max && hint.min < screen.max;
        if (targetPartiallyOutsideLeft && !targetPartiallyOutsideRight) {
            var newPos = screen.min;
            var shift = newPos - hint.min;
            return shift;
        }
        if (targetPartiallyOutsideRight && !targetPartiallyOutsideLeft) {
            var newPos = screen.max - hintSize;
            var shift = newPos - hint.min;
            return shift;
        }
        return notShiftedPos;
    }
};

var MouseMoveHandlerState = {
    None: "none",
    Drag: "drag",
    ResizeTop: "resizeTop",
    ResizeBottom: "resizeBottom",
    ResizeSelection: "resizeSelection"
};
function Init(scheduler, dropDownDateNavigatorElement, appointmentToolTipElement, appointmentEditForm, dotnetHelper) {
    if(scheduler) {
        if(scheduler.appointmentToolTipElement)
            DisposeEvents(scheduler.appointmentToolTipElement);
        if(scheduler.dropDownDateNavigatorElement)
            DisposeEvents(scheduler.dropDownDateNavigatorElement);
    }
    scheduler = EnsureElement(scheduler);
    if(!scheduler) return;
    scheduler.dropDownDateNavigatorElement = EnsureElement(dropDownDateNavigatorElement);
    scheduler.appointmentToolTipElement = EnsureElement(appointmentToolTipElement);
    scheduler.appointmentEditForm = EnsureElement(appointmentEditForm);
    if(!scheduler.mouseMoveHandlerState)
        scheduler.mouseMoveHandlerState = MouseMoveHandlerState.None;
    if (scheduler.appointmentToolTipElement) {
        var apt = DomUtils.getSelectedAppointment(scheduler);
        if (apt) {
            var options = getToolTipOptions(scheduler, scheduler.appointmentToolTipElement, apt);
            ShowHint(apt, scheduler.appointmentToolTipElement, options);
        }
    }
    var hDateTimeViewLayout = new DateTimeViewLayout(scheduler, "dxbs-sc-all-day-area");
    var vDateTimeViewLayout = new DateTimeViewLayout(scheduler, "dxbs-sc-time-cell");
    var hApts = DomUtils.getHorizontalAppointments(scheduler);
    var vApts = DomUtils.getVerticalAppointments(scheduler);
    scheduler.appointmentInfos = AppointmentInfo.createItems(hApts, hDateTimeViewLayout, vDateTimeViewLayout);
    scheduler.appointmentInfos = scheduler.appointmentInfos.concat(AppointmentInfo.createItems(vApts, hDateTimeViewLayout, vDateTimeViewLayout));
    if(scheduler.skipCalculateAllAppointments) {
        var filter = function(apts) {
            var result = [];
            for(var i = 0, apt; apt = apts[i]; i++) {
                if(ElementHasCssClass(apt, "dxbs-apt-edited"))
                    result.push(apt);
            }
            return result;
        };
        hApts = filter(hApts);
        vApts = filter(vApts);
        calculateAppointments(hApts, vApts, false);
        return Promise.resolve("ok");
    }
    adjustControl();
    initEvents(scheduler, scheduler.dropDownDateNavigatorElement, scheduler.appointmentToolTipElement, dotnetHelper);
    function adjustControl() {
        calculateAppointments(hApts, vApts, true);
        calculateTimeMarker(scheduler, vDateTimeViewLayout.getTimeCells());
    }
    function calculateAppointments(hApts, vApts, allowCalculateCellsHeight) {
        hDateTimeViewLayout.clearObjects();
        prepareAppointments(hDateTimeViewLayout.getTimeCells(), hApts);
        prepareAppointments(vDateTimeViewLayout.getTimeCells(), vApts);
        calculateHorizontalAppointments(hApts);
        if (allowCalculateCellsHeight)
            calculateHorizontalCellsHeight(hDateTimeViewLayout.getTimeCells());
        calculateVerticalAppointments(vApts);
    }
    function initEvents(scheduler, dropDownDateNavigatorElement, appointmentToolTipElement, dotnetHelper) {
        LongTabEventHelper.attachEventToElement(scheduler, "mousedown", mouseDownEventHandler);
        LongTabEventHelper.attachEventToElement(scheduler, "mouseup", mouseUpEventHandler);
        LongTabEventHelper.attachEventToElement(scheduler, "mousemove", mouseMoveEventHandler);
        LongTabEventHelper.attachLongTabEventToElement(scheduler, getTouchLongPressEventHandler);
        LongTabEventHelper.attachEventToElement(scheduler, "touchstart", touchStartEventHandler);
        LongTabEventHelper.attachEventToElement(scheduler, "touchmove", touchMoveEventHandler);
        LongTabEventHelper.attachEventToElement(scheduler, "touchend", touchEndEventHandler);
        if (dropDownDateNavigatorElement) {
            dropDownDateNavigatorElement.dateNavigatorLostFocusHandler = function(evt) {
                return GetOutsideClickEventHandler(evt, dropDownDateNavigatorElement, 'OnDropDownDateNavigatorLostFocus', dotnetHelper);
            };
            AttachEventToElement(document, TouchUIHelper.touchMouseDownEventName, dropDownDateNavigatorElement.dateNavigatorLostFocusHandler);
            RegisterDisposableEvents(dropDownDateNavigatorElement, function () {
                DetachEventFromElement(document, TouchUIHelper.touchMouseDownEventName, dropDownDateNavigatorElement.dateNavigatorLostFocusHandler);
            });
        }
        if (appointmentToolTipElement) {
            appointmentToolTipElement.toolTipLostFocusHandler = function(evt) {
                var apt = DomUtils.getAppointmentContainer(evt.srcElement);
                if(apt && isAppointmentSelected(apt))
                    return;
                return GetOutsideClickEventHandler(evt, appointmentToolTipElement, 'OnAppointmentToolTipLostFocus', dotnetHelper);
            };
            AttachEventToElement(document, TouchUIHelper.touchMouseDownEventName, appointmentToolTipElement.toolTipLostFocusHandler);
            RegisterDisposableEvents(appointmentToolTipElement, function () {
                DetachEventFromElement(document, TouchUIHelper.touchMouseDownEventName, appointmentToolTipElement.toolTipLostFocusHandler);
            });
        }
        subscribeElementContentWidth(scheduler, adjustControl);
    }
    function selectAppointment(apt) {
        if (!apt)
            return;
        dotnetHelper.invokeMethodAsync('OnAppointmentSelect', DomUtils.Attr.getAppointmentKey(apt));
    }
    function getSelectedAppointmentInfo() {
        var apt = DomUtils.getSelectedAppointment(scheduler);
        return apt ? getAppointmentInfo(DomUtils.Attr.getAppointmentKey(apt)) : null;
    }
    function getAppointmentInfo(id) {
        return scheduler.appointmentInfos.filter(function(apt) {
            return apt.id === id;
        })[0];
    }
    function mouseDownEventHandler(e) {
        if(hasUnforcedFunction("TouchStart") || e.button === 2) {
            if(e.button === 2)
                PreventEventAndBubble(e);
            return;
        }
        var apt = DomUtils.getAppointmentContainer(e.srcElement);
        if (apt) {
            if(!isAppointmentSelected(apt))
                selectAppointment(apt);
            if (isTopHandleElement(e.srcElement) || isLeftHandleElement(e.srcElement))
                scheduler.mouseMoveHandlerState = MouseMoveHandlerState.ResizeTop;
            else if (isBottomHandleElement(e.srcElement) || isRightHandleElement(e.srcElement))
                scheduler.mouseMoveHandlerState = MouseMoveHandlerState.ResizeBottom;
            else
                unforcedFunctionCall(function() { scheduler.mouseMoveHandlerState = MouseMoveHandlerState.Drag; }, "drag", 50, true);
        }
        else if (!scheduler.appointmentToolTipElement) {
            if (isTimeCellElement(e.srcElement)) {
                scheduler.cellSelectionHelper = new CellSelectionHelper(scheduler, dotnetHelper);
                scheduler.cellSelectionHelper.start(e.srcElement);
                scheduler.mouseMoveHandlerState = MouseMoveHandlerState.ResizeSelection;
            }
        }
    }
    function mouseMoveEventHandler(e) {
        if (scheduler.mouseMoveHandlerState === MouseMoveHandlerState.None)
            return;
        if (!scheduler.throttledDrag) {
            scheduler.throttledDrag = Timer.Throttle(function (e) {
                var cell = vDateTimeViewLayout.findCellByPos(e.clientX, e.clientY) || hDateTimeViewLayout.findCellByPos(e.clientX, e.clientY);
                if (!cell)
                    return;
                if (scheduler.mouseMoveHandlerState === MouseMoveHandlerState.ResizeSelection && scheduler.cellSelectionHelper)
                    scheduler.cellSelectionHelper.resizeTo(cell);
                else {
                    var appointmentInfo = getSelectedAppointmentInfo();
                    if(appointmentInfo) {
                        if (scheduler.mouseMoveHandlerState === MouseMoveHandlerState.Drag || scheduler.mouseMoveHandlerState === MouseMoveHandlerState.ResizeTop || scheduler.mouseMoveHandlerState === MouseMoveHandlerState.ResizeBottom) {
                            if (!scheduler.dragHelper) {
                                scheduler.dragHelper = new DragHelper(scheduler, dotnetHelper);
                                scheduler.dragHelper.dragStart(appointmentInfo, cell);
                            }
                            scheduler.mouseMoveHandlerState === MouseMoveHandlerState.Drag ?
                                scheduler.dragHelper.drag(cell) :
                                scheduler.dragHelper.resize(cell, scheduler.mouseMoveHandlerState === MouseMoveHandlerState.ResizeTop);
                        }
                    }
                }
            }, 20);
        }
        scheduler.throttledDrag(e);
    }
    function mouseUpEventHandler(e) {
        if(hasUnforcedFunction("TouchEnd") || e.button === 2) {
            if(e.button === 2)
                PreventEventAndBubble(e);
            return;
        }
        if (scheduler.dragHelper || scheduler.cellSelectionHelper) {
            if (scheduler.dragHelper) {
                scheduler.dragHelper.dragEnd();
                scheduler.dragHelper = null;
            }
            else if (scheduler.cellSelectionHelper) {
                scheduler.cellSelectionHelper.end();
                scheduler.cellSelectionHelper = null;
            }
        }
        else if(DomUtils.getAppointmentContainer(e.srcElement) && !hasUnforcedFunction("skipToolTip")) {
            dotnetHelper.invokeMethodAsync('ShowAppointmentToolTip');
            unforcedFunctionCall(function() {}, "skipToolTip", 300);
        }
        clearUnforcedFunctionByKey("drag");
        scheduler.mouseMoveHandlerState = MouseMoveHandlerState.None;
    }
    function touchStartEventHandler(e) {
        unforcedFunctionCall(function() { }, "TouchStart", 300, true);
        var apt = DomUtils.getAppointmentContainer(e.srcElement);
        selectAppointment(apt);
    }
    function getTouchLongPressEventHandler(e) {
        var apt = DomUtils.getAppointmentContainer(e.srcElement);
        if (apt) {
            var clientX = e.touches[0].clientX;
            var clientY = e.touches[0].clientY;
            var cell = vDateTimeViewLayout.findCellByPos(clientX, clientY) || hDateTimeViewLayout.findCellByPos(clientX, clientY);
            var appointmentInfo = getAppointmentInfo(DomUtils.Attr.getAppointmentKey(apt));
            scheduler.dragHelper = new DragHelper(scheduler, dotnetHelper);
            scheduler.dragHelper.dragStart(appointmentInfo, cell);
        }
        else if (isTimeCellElement(e.srcElement) && !scheduler.appointmentToolTipElement){
            scheduler.cellSelectionHelper = new CellSelectionHelper(scheduler, dotnetHelper);
            scheduler.cellSelectionHelper.start(e.srcElement);
        }
    }
    function touchMoveEventHandler(e) {
        if (!scheduler.dragHelper && !scheduler.cellSelectionHelper)
            return;
        var clientX = e.touches[0].clientX;
        var clientY = e.touches[0].clientY;
        var cell = vDateTimeViewLayout.findCellByPos(clientX, clientY) || hDateTimeViewLayout.findCellByPos(clientX, clientY);
        if (cell) {
            if (scheduler.dragHelper)
                scheduler.dragHelper.drag(cell);
            else if (scheduler.cellSelectionHelper)
                scheduler.cellSelectionHelper.resizeTo(cell);
        }
        PreventEventAndBubble(e);
    }
    function touchEndEventHandler(e) {
        mouseUpEventHandler(e);
        unforcedFunctionCall(function() { }, "TouchEnd", 300, true);
    }
    return Promise.resolve("ok");
}
function getToolTipOptions(scheduler, toolTipElement, apt) {
    var scRect = scheduler.getBoundingClientRect();
    var aptRect = apt.getBoundingClientRect();
    if(ElementHasCssClass(toolTipElement, "dxsc-tooltip")) {
        if(scRect.right - aptRect.right > 370)
            DefaultOptions.position = "right";
        else if(aptRect.left - scRect.left > 370)
            DefaultOptions.position = "left";
        else if(aptRect.top - scRect.top > 370)
            DefaultOptions.position = "top";
        else
            DefaultOptions.position = "bottom";
    }
    else {
        if(scRect.right - aptRect.right > 450)
            DefaultOptions.position = "right";
        else if(aptRect.left - scRect.left > 450)
            DefaultOptions.position = "left";
        else
            DefaultOptions.position = "auto";
    }
    return DefaultOptions;
}
var DomUtils = (function () {
    function getVerticalAppointmentsContainer(container) {
        return container.querySelectorAll(".dxbs-sc-vertical-apts")[0];
    }
    function getHorizontalAppointmentsContainer(container) {
        return container.querySelectorAll(".dxbs-sc-horizontal-apts")[0];
    }
    function getHorizontalAppointments(container) {
        return container.querySelectorAll(".dxbs-sc-horizontal-apt");
    }
    function getVerticalAppointments(container) {
        return container.querySelectorAll(".dxbs-sc-vertical-apt");
    }
    function getTimeMarkerContainer(container) {
        return container.querySelectorAll(".dxbs-sc-time-marker")[0];
    }
    function getTimeIndicatorContainer(container) {
        return container.querySelectorAll(".dxbs-sc-time-indicator")[0];
    }
    function getAppointmentContainer(el) {
        return GetParentByClassName(el, "dxbs-sc-apt");
    }
    function getSelectedAppointment(container) {
        return container.querySelectorAll(".dxbs-apt-selected")[0];
    }
    function getEditedAppointment(container) {
        return container.querySelectorAll(".dxbs-apt-edited")[0];
    }
    function getCellSelectionContainer(container) {
        return container.querySelectorAll(".dxsc-cell-selection")[0];
    }
    function setElementDisplay(element, value) {
        element.style.display = value ? "" : "none";
    }
    var Attr = (function () {
        function getContainerIndex(el) {
            return el.getAttribute("data-container-index");
        }
        function getAppointmentFirstCellIndex(el) {
            return parseInt(el.getAttribute("data-first-cell-index"));
        }
        function getAppointmentLastCellIndex(el) {
            return parseInt(el.getAttribute("data-last-cell-index"));
        }
        function getAppointmentColumnsCount(el) {
            return parseInt(el.getAttribute("data-columns-count"));
        }
        function setAppointmentColumnsCount(el, value) {
            el.setAttribute("data-columns-count", value);
        }
        function getAppointmentColumn(el) {
            return parseInt(el.getAttribute("data-column"));
        }
        function setAppointmentColumn(el, value) {
            el.setAttribute("data-column", value);
        }
        function getAppointmentKey(el) {
            return el.getAttribute("data-key");
        }
        function getStart(el) {
            var time = new Date(parseInt(el.getAttribute("data-start")));
            var newLocalTime = time.getTime() + time.getTimezoneOffset() * 60000 + 0;
            return new Date(newLocalTime);
        }
        function getEnd(el) {
            var time = new Date(parseInt(el.getAttribute("data-end")));
            var newLocalTime = time.getTime() + time.getTimezoneOffset() * 60000 + 0;
            return new Date(newLocalTime);
        }
        function getDuration(el) {
            return parseInt(el.getAttribute("data-duration"));
        }
        function getAllDay(el) {
            return el.getAttribute("data-allday") === "";
        }
        return {
            getContainerIndex: getContainerIndex,
            getAppointmentFirstCellIndex: getAppointmentFirstCellIndex,
            getAppointmentLastCellIndex: getAppointmentLastCellIndex,
            getAppointmentColumnsCount: getAppointmentColumnsCount,
            setAppointmentColumnsCount: setAppointmentColumnsCount,
            getAppointmentColumn: getAppointmentColumn,
            setAppointmentColumn: setAppointmentColumn,
            getAppointmentKey: getAppointmentKey,
            getStart: getStart,
            getEnd: getEnd,
            getDuration: getDuration,
            getAllDay: getAllDay
        };
    })();
    return {
        getVerticalAppointmentsContainer: getVerticalAppointmentsContainer,
        getHorizontalAppointmentsContainer: getHorizontalAppointmentsContainer,
        getHorizontalAppointments: getHorizontalAppointments,
        getVerticalAppointments: getVerticalAppointments,
        getTimeMarkerContainer: getTimeMarkerContainer,
        getTimeIndicatorContainer: getTimeIndicatorContainer,
        getAppointmentContainer: getAppointmentContainer,
        getSelectedAppointment: getSelectedAppointment,
        getEditedAppointment: getEditedAppointment,
        getCellSelectionContainer: getCellSelectionContainer,
        setElementDisplay: setElementDisplay,
        Attr: Attr
    };
})();
function isTopHandleElement(el) {
    return ElementHasCssClass(el, "dxsc-top-handle");
}
function isBottomHandleElement(el) {
    return ElementHasCssClass(el, "dxsc-bottom-handle");
}
function isLeftHandleElement(el) {
    return ElementHasCssClass(el, "dxsc-left-handle");
}
function isRightHandleElement(el) {
    return ElementHasCssClass(el, "dxsc-right-handle");
}
function isTimeCellElement(el) {
    return ElementHasCssClass(el, "dxbs-sc-all-day-area") || ElementHasCssClass(el, "dxbs-sc-time-cell");
}
function isAllDayCell(el) {
    return ElementHasCssClass(el, "dxbs-sc-all-day-area");
}
function isAppointmentSelected(el) {
    return ElementHasCssClass(el, "dxbs-apt-selected");
}
function getAppointmentInterval(views) {
    var start = DomUtils.Attr.getStart(views[0]);
    var duration = DomUtils.Attr.getDuration(views[0]);
    return createInterval(start, duration);
}
function getCellInterval(cell) {
    var start = DomUtils.Attr.getStart(cell);
    var end = DomUtils.Attr.getEnd(cell);
    return createInterval(start, end - start);
}
function createInterval(start, duration) {
    return {
        start: start,
        duration: duration,
        isLongerOrEqualDay: duration >= DateTimeHelper.DaySpan
    };
}
var DateTimeViewLayout = function (table, cellClassName) {
    this.element = table;
    this.cellClassName = cellClassName;
};
DateTimeViewLayout.prototype = {
    getContainers: function() {
        if (!this.containers) {
            var timeCells = this.element.querySelectorAll("." + this.cellClassName);
            this.containers = {};
            for (var i = 0, cell; cell = timeCells[i]; i++) {
                var index = DomUtils.Attr.getContainerIndex(cell);
                if (!this.containers[index])
                    this.containers[index] = { cells: [] };
                this.containers[index].cells.push(cell);
            }
        }
        return this.containers;
    },
    clearObjects: function() {
        var cells = this.getTimeCells();
        for(var i = 0, cell; cell = cells[i]; i++) {
            this.clearObject(cell);
        }
    },
    clearObject: function(el) {
        el.lastAppointmentTop = undefined;
    },
    getTimeCells: function () {
        if (!this.timeCells)
            this.timeCells = this.element.querySelectorAll("." + this.cellClassName);
        return this.timeCells;
    },
    findCell: function (date) {
        var containers = this.getContainers();
        for (var index in containers) {
            if (!containers.hasOwnProperty(index))
                continue;
            for (var i = 0, cell; cell = containers[index].cells[i]; i++) {
                var start = DomUtils.Attr.getStart(cell);
                var end = DomUtils.Attr.getEnd(cell);
                if ((start - date) <= 0 && (date - end) < 0)
                    return cell;
            }
        }
        return null;
    },
    findStartCell: function (date) {
        var containers = this.getContainers();
        for (var index in containers) {
            if (!containers.hasOwnProperty(index))
                continue;
            for (var i = 0, cell; cell = containers[index].cells[i]; i++) {
                var start = DomUtils.Attr.getStart(cell);
                if ((date - start) <= 0)
                    return cell;
            }
        }
        return null;
    },
    findEndCell: function (date) {
        var containers = this.getContainers();
        for (var index in containers) {
            if (!containers.hasOwnProperty(index))
                continue;
            for (var i = 0, cell; cell = containers[index].cells[i]; i++) {
                var end = DomUtils.Attr.getEnd(cell);
                if ((date - end) <= 0)
                    return cell;
            }
        }
        return null;
    },
    findCellByPos: function (x, y) {
        var cells = this.getTimeCells();
        for (var i = 0, cell; cell = cells[i]; i++) {
            var rect = cell.getBoundingClientRect();
            if (rect.top <= y && y < rect.bottom && rect.left <= x && x < rect.right)
                return cell;
        }
    }
};
var AppointmentInfo = function (id, views, interval, dateTimeViewLayout) {
    this.id = id;
    this.views = views;
    this.interval = interval;
    this.allDay = DomUtils.Attr.getAllDay(views[0]);
    this.sourceView = null;
    this.aptCont = null;
    this.dateTimeViewLayout = dateTimeViewLayout;
    this.init();
};
AppointmentInfo.prototype = {
    init: function () {
        this.sourceView = this.views[0].cloneNode(true);
        this.aptCont = this.views[0].parentElement;
    },
    getStart: function () {
        return this.interval.start;
    },
    getDuration: function () {
        return this.interval.duration;
    },
    getEnd: function () {
        return DateTimeHelper.DateIncreaseWithUtcOffset(this.getStart(), this.getDuration());
    },
    clearViews: function () {
        this.views.forEach(function (view) {
            view.parentElement.removeChild(view);
        });
        this.views = [];
    }
};
AppointmentInfo.createItem = function (aptId, views, hDateTimeViewLayout, vDateTimeViewLayout) {
    var interval = getAppointmentInterval(views);
    var dateTimeViewLayout = interval.duration >= DateTimeHelper.DaySpan ? hDateTimeViewLayout : vDateTimeViewLayout;
    return new AppointmentInfo(aptId, views, interval, dateTimeViewLayout);
};
AppointmentInfo.createItems = function (views, hDateTimeViewLayout, vDateTimeViewLayout) {
    var apts = {};
    for (var i = 0, view; view = views[i]; i++) {
        var id = DomUtils.Attr.getAppointmentKey(view);
        if (!apts[id])
            apts[id] = [];
        apts[id].push(view);
    }
    var result = [];
    for (var id in apts) {
        if (!apts.hasOwnProperty(id))
            continue;
        result.push(AppointmentInfo.createItem(id, apts[id], hDateTimeViewLayout, vDateTimeViewLayout));
    }
    return result;
};
var DateTimeHelper = {
    HalfHourSpan: 30 * 60 * 1000,
    DaySpan: 24 * 60 * 60 * 1000,
    DateSubsWithTimezone: function (date1, date2) {
        return date1 - date2 + (date2.getTimezoneOffset() - date1.getTimezoneOffset()) * 60000;
    },
    TruncToDate: function (dateTime) {
        return new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate());
    },
    CalculateDaysDifference: function (date1, date2) {
        var snappedDate1 = DateTimeHelper.TruncToDate(date1);
        var snappedDate2 = DateTimeHelper.TruncToDate(date2);
        return DateTimeHelper.DateSubsWithTimezone(snappedDate2, snappedDate1) / DateTimeHelper.DaySpan;
    },
    DateIncreaseWithUtcOffset: function (date, spanInMilliseconds) {
        var result = DateTimeHelper.DateIncrease(date, spanInMilliseconds);
        var utcDiff = (result.getTimezoneOffset() - date.getTimezoneOffset()) * 60000;
        return DateTimeHelper.DateIncrease(result, utcDiff);
    },
    DateIncrease: function (date, spanInMilliseconds) {
        return new Date(date.valueOf() + spanInMilliseconds);
    },
    AddTimeSpan: function (date, timeSpan) {
        return new Date(date.valueOf() + timeSpan);
    },
    ToDayTime: function (dateTime) {
        return dateTime.valueOf() - DateTimeHelper.TruncToDate(dateTime).valueOf();
    }
};
function CellSelectionHelper(scheduler, dotnetHelper) {
    this.scheduler = scheduler;
    this.dotnetHelper = dotnetHelper;
    this.interval = null;
    this.start = function (startCell) {
        this.interval = getCellInterval(startCell);
        var start = this.interval.start;
        var end = DateTimeHelper.DateIncreaseWithUtcOffset(start, this.interval.duration);
        var utcDiff = start.getTimezoneOffset() * 60000 * -1;
        this.dotnetHelper.invokeMethodAsync('OnCellSelectionStart',
            DateTimeHelper.AddTimeSpan(start, utcDiff),
            DateTimeHelper.AddTimeSpan(end, utcDiff), isAllDayCell(startCell));
    };
    this.resizeTo = function (cell) {
        var interval = getCellInterval(cell);
        var duration = interval.start - this.interval.start;
        if (duration === 0 && this.interval.duration === interval.duration)
            return;
        if (duration < 0 && this.interval.duration === interval.duration)
            this.direction = "top";
        else if (duration > 0 && this.interval.duration === interval.duration)
            this.direction = "bottom";
        if (this.direction === "bottom") {
            this.interval.duration = duration + interval.duration;
        }
        else if (this.direction === "top") {
            this.interval.start = interval.start;
            this.interval.duration += duration * -1;
        }
        var start = this.interval.start;
        var end = DateTimeHelper.DateIncreaseWithUtcOffset(start, this.interval.duration);
        var utcDiff = start.getTimezoneOffset() * 60000 * -1;
        this.dotnetHelper.invokeMethodAsync('OnCellSelectionResize',
            DateTimeHelper.AddTimeSpan(start, utcDiff),
            DateTimeHelper.AddTimeSpan(end, utcDiff), isAllDayCell(cell));
    };
    this.end = function () {
        this.dotnetHelper.invokeMethodAsync('OnCellSelectionEnd', this.scheduler.offsetWidth < 500);
    };
}
function DragHelper(scheduler, dotnetHelper) {
    this.scheduler = scheduler;
    this.dotnetHelper = dotnetHelper;
    this.appointmentInfo = null;
    this.interval = null;
    this.dragStart = function(aptInfo, startCell) {
        this.appointmentInfo = aptInfo;
        this.sourceAppointmentInterval = createInterval(aptInfo.getStart(), aptInfo.getDuration());
        this.cellInterval = getCellInterval(startCell);
        this.dateDiff = aptInfo.getStart() - this.cellInterval.start;
        this.dotnetHelper.invokeMethodAsync('OnAppointmentDragStart');
        this.scheduler.skipCalculateAllAppointments = true;
    };
    this.drag = function (cell) {
        if (!this.cellInterval)
            return;
        var newInterval = getCellInterval(cell);
        if ((this.cellInterval.start - newInterval.start) === 0 && this.cellInterval.duration === newInterval.duration)
            return;
        if (newInterval.isLongerOrEqualDay) {
            if (this.sourceAppointmentInterval.isLongerOrEqualDay && this.cellInterval.isLongerOrEqualDay === newInterval.isLongerOrEqualDay) {
                this.appointmentInfo.interval = createInterval(DateTimeHelper.AddTimeSpan(newInterval.start, this.dateDiff), this.appointmentInfo.interval.duration);
            }
            else {
                this.appointmentInfo.interval = newInterval;
                this.appointmentInfo.allDay = true;
            }
        }
        else {
            if(this.appointmentInfo.interval.isLongerOrEqualDay)
                this.appointmentInfo.interval.duration = this.sourceAppointmentInterval.isLongerOrEqualDay ? newInterval.duration : this.sourceAppointmentInterval.duration;
            this.appointmentInfo.interval = createInterval(DateTimeHelper.AddTimeSpan(newInterval.start, this.dateDiff), this.appointmentInfo.interval.duration);
            this.appointmentInfo.allDay = false;
        }
        var utcDiff = newInterval.start.getTimezoneOffset() * 60000 * -1;
        this.dotnetHelper.invokeMethodAsync('OnAppointmentDrag',
            DateTimeHelper.AddTimeSpan(this.appointmentInfo.getStart(), utcDiff),
            DateTimeHelper.AddTimeSpan(this.appointmentInfo.getEnd(), utcDiff),
            this.appointmentInfo.allDay);
        this.cellInterval = newInterval;
    };
    this.resize = function (cell, top, bottom) {
        if (!this.cellInterval)
            return;
        var newInterval = getCellInterval(cell);
        if ((this.cellInterval.start - newInterval.start) === 0 && this.cellInterval.duration === newInterval.duration || this.cellInterval.isLongerOrEqualDay !== newInterval.isLongerOrEqualDay)
            return;
        var duration = this.cellInterval.start - newInterval.start;
        if (top) {
            this.appointmentInfo.interval = createInterval(DateTimeHelper.AddTimeSpan(newInterval.start, this.dateDiff), this.appointmentInfo.interval.duration + duration);
        }
        else {
            this.appointmentInfo.interval.duration -= duration;
        }
        var utcDiff = newInterval.start.getTimezoneOffset() * 60000 * -1;
        this.dotnetHelper.invokeMethodAsync('OnAppointmentDrag',
            DateTimeHelper.AddTimeSpan(this.appointmentInfo.getStart(), utcDiff),
            DateTimeHelper.AddTimeSpan(this.appointmentInfo.getEnd(), utcDiff),
            this.appointmentInfo.allDay);
        this.cellInterval = newInterval;
    };
    this.dragEnd = function () {
        this.dotnetHelper.invokeMethodAsync('OnAppointmentDragEnd');
        this.scheduler.skipCalculateAllAppointments = false;
    };
}
function prepareAppointments(cellList, apts) {
    var cells = {};
    for(var i = 0, item; item = cellList[i]; i++) {
        item.intersects = [];
        var index = DomUtils.Attr.getContainerIndex(item);
        if(!cells[index])
            cells[index] = [];
        cells[index].push(item);
    }
    for (var i = 0, apt; apt = apts[i]; i++) {
        var containerIndex = DomUtils.Attr.getContainerIndex(apt),
            firstCellIndex = DomUtils.Attr.getAppointmentFirstCellIndex(apt),
            lastCellIndex = DomUtils.Attr.getAppointmentLastCellIndex(apt);
        apt.firstCell = cells[containerIndex][firstCellIndex];
        apt.lastCell = cells[containerIndex][lastCellIndex];
    }
}
function calculateHorizontalAppointments(apts) {
    for (var i = 0, apt; apt = apts[i]; i++) {
        calculateHorizontalAppointment(apt);
    }
}
function calculateHorizontalAppointment(apt) {
    apt.style.height = "";
    addIntersect(apt.firstCell, apt);
    apt.style.left = apt.firstCell.offsetLeft + "px";
    if (apt.lastCell === apt.firstCell)
        apt.style.width = apt.firstCell.offsetWidth + "px";
    else
        apt.style.width = (apt.lastCell.offsetLeft - apt.firstCell.offsetLeft + apt.firstCell.offsetWidth) + "px";
    if(!apt.firstCell.lastAppointmentTop)
        apt.firstCell.lastAppointmentTop = apt.firstCell.offsetTop;
    apt.style.display = "";
    apt.style.top = apt.firstCell.lastAppointmentTop + "px";
    apt.firstCell.lastAppointmentTop += apt.offsetHeight;
}
function calculateHorizontalCellsHeight(cells) {
    var maxHeight = 0;
    for(var i = 0, cell; cell = cells[i]; i++) {
        var height = 0;
        cell.intersects.forEach(function(el) {
            height += el.offsetHeight;
        });
        if(height > maxHeight)
            maxHeight = height;
        cell.lastAppointmentTop = undefined;
    }
    cells[0].style.height = maxHeight + 15 + "px";
}
function calculateVerticalAppointments(apts) {
    for (var i = 0, apt; apt = apts[i]; i++) {
        calculateVerticalAppointment(apt);
    }
}
function calculateVerticalAppointment(apt) {
    var index = DomUtils.Attr.getAppointmentColumn(apt);
    var width = apt.firstCell.offsetWidth / DomUtils.Attr.getAppointmentColumnsCount(apt);
    apt.style.top = apt.firstCell.offsetTop + "px";
    apt.style.left = (apt.firstCell.offsetLeft + width * index) + "px";
    apt.style.width = (width - 10) + "px";
    apt.style.height = (apt.lastCell.offsetTop + apt.lastCell.offsetHeight - apt.firstCell.offsetTop) + "px";
    apt.style.display = "";
}
function addIntersect(el, apt) {
    if(el.intersects.findIndex(function(item) { return DomUtils.Attr.getAppointmentKey(item) === DomUtils.Attr.getAppointmentKey(apt); }) < 0)
        el.intersects.push(apt);
}
function GetOutsideClickEventHandler(evt, element, invokeMethodName, dotnetHelper) {
    return OnOutsideClick(evt, element, function () {
        var willBeClosed = element && typeof element !== 'string' && element.style.display !== 'none';
        if (willBeClosed)
            dotnetHelper.invokeMethodAsync(invokeMethodName);
    });
}
function calculateTimeMarker(scheduler, verticalTimeCells) {
    var time = getCurrentLocalTime();
    var date = truncToDate(time);
    var timeMarkerContainer = DomUtils.getTimeMarkerContainer(scheduler);
    var timeIndicatorContainer = DomUtils.getTimeIndicatorContainer(scheduler);
    if(!timeIndicatorContainer)
        return;
    var cell = findCellByTime(verticalTimeCells, time);
    if(!cell) {
        timeMarkerContainer.style.display = "none";
        timeIndicatorContainer.style.display = "none";
        return;
    }
    else {
        timeMarkerContainer.style.display = "";
        timeIndicatorContainer.style.display = "";
    }
    var top = Math.floor(calculateTop(time, cell, date));
    timeMarkerContainer.style.top = (top - timeMarkerContainer.offsetHeight / 2) + "px";
    timeMarkerContainer.style.width = (cell.offsetLeft + timeMarkerContainer.offsetHeight / 2) + 1 + "px";
    if(isElementDisplayed(timeIndicatorContainer)) {
        timeIndicatorContainer.style.top = top - 1 + "px";
        timeIndicatorContainer.style.width = cell.offsetWidth + "px";
        timeIndicatorContainer.style.left = cell.offsetLeft + "px";
    }
    function getAdaptedContainerTime(startCell, dateTime) {
        var start = startCell;
        var dayTimeDelta = dateSubsWithTimezone(dateTime, start);
        var dateTimeDuration = Math.abs(dayTimeDelta);
        var dayTime = dateTimeDuration % (24 * 60 * 60 * 1000);
        if(dayTimeDelta < 0)
            dayTime = 24 * 60 * 60 * 1000 - dayTime;
        return dateIncreaseWithUtcOffset(start, dayTime);
    }
    function calculateTop(time, currentTimeCell, startCell) {
        var adaptedContainerTime = getAdaptedContainerTime(startCell, time);
        var start = DomUtils.Attr.getStart(currentTimeCell);
        var end = DomUtils.Attr.getEnd(currentTimeCell);
        var remainderDuration = dateSubsWithTimezone(adaptedContainerTime, start);
        return currentTimeCell.offsetTop + currentTimeCell.offsetHeight * remainderDuration / (end - start);
    }
}
function findCellByTime(verticalTimeCells, time) {
    var result;
    for(var i = 0, el; el = verticalTimeCells[i]; i++) {
        if ((time - DomUtils.Attr.getStart(el)) >= 0 && DomUtils.Attr.getEnd(el) - time > 0)
            result = el;
    }
    return result;
}
function getCurrentLocalTime(clientUtcOffset) {
    var time = new Date();
    var newLocalTime = time.getTime();
    return new Date(newLocalTime);
}
function dateIncrease(date, spanInMilliseconds) {
    return new Date(date.valueOf() + spanInMilliseconds);
}
function dateIncreaseWithUtcOffset(date, spanInMilliseconds) {
    var result = dateIncrease(date, spanInMilliseconds);
    var utcDiff = (result.getTimezoneOffset() - date.getTimezoneOffset()) * 60000;
    return dateIncrease(result, utcDiff);
}
function dateSubsWithTimezone(date1, date2) {
    return date1 - date2 + (date2.getTimezoneOffset() - date1.getTimezoneOffset()) * 60000;
}
function truncToDate(dateTime) {
    return new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate());
}
function isElementDisplayed(element) {
    return element && element.style.display !== "none";
}
function OnOutsideClick(evt, element, onOutsireClick) {
    var targetElement = evt.target;
    while(targetElement) {
        if(targetElement === element) return false;
        targetElement = targetElement.parentElement;
    }
    if(onOutsireClick)
        onOutsireClick();
}
function Dispose(scheduler) {
    scheduler = EnsureElement(scheduler);
    if (scheduler)
        DisposeEvents(scheduler);
    return Promise.resolve("ok");
}
const scheduler = { Init, Dispose };

export default scheduler;
export { Dispose, Init };
