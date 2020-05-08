_dxBlazorInternal.define('cjs-dx-blazor-119001d1.js', function(require, module, exports) {'use strict';

function createInvoker(resolveImporter) {
    return function invoke(name, args) {
        args = Array.prototype.slice.call(args);
        return resolveImporter().then(function(m) { return m.default[name].apply(m, args); });
    }
}

var invoke = createInvoker(function() { return new Promise(function (resolve) { resolve(require('./cjs-dropdowns-5546f970.js')); }); });
function Init(){ return invoke("Init", arguments); }
function Dispose(){ return invoke("Dispose", arguments); }
function ShowAdaptiveDropdown(){ return invoke("ShowAdaptiveDropdown", arguments); }
var DropDown = { Init: Init, Dispose: Dispose, ShowAdaptiveDropdown: ShowAdaptiveDropdown };

var invoke$1 = createInvoker(function() { return new Promise(function (resolve) { resolve(require('./cjs-combobox-e39421aa.js')); }); });
function Init$1(){ return invoke$1("Init", arguments); }
function Dispose$1(){ return invoke$1("Dispose", arguments); }
function PrepareInputIfFocused(){ return invoke$1("PrepareInputIfFocused", arguments); }
function ScrollToSelectedItem(){ return invoke$1("ScrollToSelectedItem", arguments); }
var ComboBox = { Init: Init$1, Dispose: Dispose$1, PrepareInputIfFocused: PrepareInputIfFocused, ScrollToSelectedItem: ScrollToSelectedItem };

var invoke$2 = createInvoker(function() { return new Promise(function (resolve) { resolve(require('./cjs-form-layout-af98150e.js')); }); });
function Init$2(){ return invoke$2("Init", arguments); }
var FormLayout = { Init: Init$2 };

var invoke$3 = createInvoker(function() { return new Promise(function (resolve) { resolve(require('./cjs-dom-utils-6a09eac3.js')); }); });
function FocusElement(){ return invoke$3("FocusElement", arguments); }
function SetInputAttribute(){ return invoke$3("SetInputAttribute", arguments); }
function SetCheckInputIndeterminate(){ return invoke$3("SetCheckInputIndeterminate", arguments); }
var Dom = { FocusElement: FocusElement, SetInputAttribute: SetInputAttribute, SetCheckInputIndeterminate: SetCheckInputIndeterminate };

var invoke$4 = createInvoker(function() { return new Promise(function (resolve) { resolve(require('./cjs-grid-b52f8083.js')); }); });
function Init$3(){ return invoke$4("Init", arguments); }
function Dispose$2(){ return invoke$4("Dispose", arguments); }
var Grid = { Init: Init$3, Dispose: Dispose$2 };

var invoke$5 = createInvoker(function() { return new Promise(function (resolve) { resolve(require('./cjs-scheduler-329eb609.js')); }); });
function Init$4(){ return invoke$5("Init", arguments); }
function Dispose$3(){ return invoke$5("Dispose", arguments); }
var Scheduler = { Init: Init$4, Dispose: Dispose$3 };

var invoke$6 = createInvoker(function() { return new Promise(function (resolve) { resolve(require('./cjs-charts-4ce696f7.js')); }); });
function Init$5(){ return invoke$6("Init", arguments); }
function Dispose$4(){ return invoke$6("Dispose", arguments); }
function OnSeriesLegendElementReceived(){ return invoke$6("OnSeriesLegendElementReceived", arguments); }
function OnSeriesVisibleChanged(){ return invoke$6("OnSeriesVisibleChanged", arguments); }
function DestroyTooltips(){ return invoke$6("DestroyTooltips", arguments); }
var Charts = { Init: Init$5, Dispose: Dispose$4, OnSeriesLegendElementReceived: OnSeriesLegendElementReceived, OnSeriesVisibleChanged: OnSeriesVisibleChanged, DestroyTooltips: DestroyTooltips };

var invoke$7 = createInvoker(function() { return new Promise(function (resolve) { resolve(require('./cjs-calendar-979546d6.js')); }); });
function Init$6(){ return invoke$7("Init", arguments); }
function Dispose$5(){ return invoke$7("Dispose", arguments); }
var Calendar = { Init: Init$6, Dispose: Dispose$5 };

var invoke$8 = createInvoker(function() { return new Promise(function (resolve) { resolve(require('./cjs-roller-ea2375fb.js')); }); });
function InitializeDateRoller(){ return invoke$8("InitializeDateRoller", arguments); }
var Roller = { InitializeDateRoller: InitializeDateRoller };

var dxBlazor = {
    DropDown: DropDown,
    FormLayout: FormLayout,
    ComboBox: ComboBox,
    Dom: Dom,
    Charts: Charts,
    Grid: Grid,
    Scheduler: Scheduler,
    Calendar: Calendar,
    Roller: Roller
};

module.exports = dxBlazor;},[]);
