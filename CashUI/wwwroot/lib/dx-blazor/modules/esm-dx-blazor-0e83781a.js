function createInvoker(resolveImporter) {
    return function invoke(name, args) {
        args = Array.prototype.slice.call(args);
        return resolveImporter().then(function(m) { return m.default[name].apply(m, args); });
    }
}

const invoke = createInvoker(function() { return import('./esm-dropdowns-b8e38328.js'); });
function Init(){ return invoke("Init", arguments); }
function Dispose(){ return invoke("Dispose", arguments); }
function ShowAdaptiveDropdown(){ return invoke("ShowAdaptiveDropdown", arguments); }
const DropDown = { Init, Dispose, ShowAdaptiveDropdown };

const invoke$1 = createInvoker(function() { return import('./esm-combobox-3cfa75c1.js'); });
function Init$1(){ return invoke$1("Init", arguments); }
function Dispose$1(){ return invoke$1("Dispose", arguments); }
function PrepareInputIfFocused(){ return invoke$1("PrepareInputIfFocused", arguments); }
function ScrollToSelectedItem(){ return invoke$1("ScrollToSelectedItem", arguments); }
const ComboBox = { Init: Init$1, Dispose: Dispose$1, PrepareInputIfFocused, ScrollToSelectedItem };

const invoke$2 = createInvoker(function() { return import('./esm-form-layout-297a5a23.js'); });
function Init$2(){ return invoke$2("Init", arguments); }
const FormLayout = { Init: Init$2 };

const invoke$3 = createInvoker(function() { return import('./esm-dom-utils-d4fe413b.js'); });
function FocusElement(){ return invoke$3("FocusElement", arguments); }
function SetInputAttribute(){ return invoke$3("SetInputAttribute", arguments); }
function SetCheckInputIndeterminate(){ return invoke$3("SetCheckInputIndeterminate", arguments); }
const Dom = { FocusElement, SetInputAttribute, SetCheckInputIndeterminate };

const invoke$4 = createInvoker(function() { return import('./esm-grid-91fdba30.js'); });
function Init$3(){ return invoke$4("Init", arguments); }
function Dispose$2(){ return invoke$4("Dispose", arguments); }
const Grid = { Init: Init$3, Dispose: Dispose$2 };

const invoke$5 = createInvoker(function() { return import('./esm-scheduler-c9b996d6.js'); });
function Init$4(){ return invoke$5("Init", arguments); }
function Dispose$3(){ return invoke$5("Dispose", arguments); }
const Scheduler = { Init: Init$4, Dispose: Dispose$3 };

const invoke$6 = createInvoker(function() { return import('./esm-charts-a566e8f1.js'); });
function Init$5(){ return invoke$6("Init", arguments); }
function Dispose$4(){ return invoke$6("Dispose", arguments); }
function OnSeriesLegendElementReceived(){ return invoke$6("OnSeriesLegendElementReceived", arguments); }
function OnSeriesVisibleChanged(){ return invoke$6("OnSeriesVisibleChanged", arguments); }
function DestroyTooltips(){ return invoke$6("DestroyTooltips", arguments); }
const Charts = { Init: Init$5, Dispose: Dispose$4, OnSeriesLegendElementReceived, OnSeriesVisibleChanged, DestroyTooltips };

const invoke$7 = createInvoker(function() { return import('./esm-calendar-cc78ea4d.js'); });
function Init$6(){ return invoke$7("Init", arguments); }
function Dispose$5(){ return invoke$7("Dispose", arguments); }
const Calendar = { Init: Init$6, Dispose: Dispose$5 };

const invoke$8 = createInvoker(function() { return import('./esm-roller-bba4c22f.js'); });
function InitializeDateRoller(){ return invoke$8("InitializeDateRoller", arguments); }
const Roller = { InitializeDateRoller };

const dxBlazor = {
    DropDown,
    FormLayout,
    ComboBox,
    Dom,
    Charts,
    Grid,
    Scheduler,
    Calendar,
    Roller
};

export default dxBlazor;
