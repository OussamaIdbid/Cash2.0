import './esm-chunk-f9104efc.js';
import { EnsureElement, ElementHasCssClass, changeDom, calculateStyles, GetCurrentStyle, AttachEventToElement, toggleCssClass } from './esm-dom-utils-d4fe413b.js';
import './esm-chunk-95f069f9.js';
import { parseTranslateInfo, translatePosition } from './esm-popup-utils-2e6d89cb.js';

var activeWidgets = [];
function disposeWidget(domEl, disposeDomEl) {
    domEl = EnsureElement(domEl);
    var index = activeWidgets.indexOf(domEl);
    if (index > -1) {
        activeWidgets[index + 1].then(function (widget) { widget.dispose(); });
        activeWidgets[index + 1] = null;
        if (disposeDomEl)
            activeWidgets[index] = null;
    }
    return Promise.resolve();
}
function findRelatedWidget(domEl) {
    var index = activeWidgets.indexOf(domEl);
    return index > -1 ? activeWidgets[index + 1] : Promise.reject();
}
function updateRelatedWidget(domEl, settings, setupFunc) {
    var index = activeWidgets.indexOf(domEl);
    if (index === -1)
        return createRelatedWidget(domEl, settings, setupFunc);
    return findRelatedWidget(domEl).then(function (chart) {
        return new Promise(function (resolve) {
            function updateChart(options) {
                options.animation = { enabled: false };
                chart.option(options);
                resolve("ok");
            }
            setupFunc(settings, updateChart);
        });
    }).catch(console.error);
}
function createWidgetBuilder(DxBlazorViz, hostElement, state, callback) {
    let category = state.series.map(x => x.category)[0];
    let widgetClass = category === "pie" || category === "donut" ? DxBlazorViz.viz.dxPieChart : DxBlazorViz.viz.dxChart;
    return function builder(options) {
        options.type = category;
        callback(new widgetClass(hostElement, options));
    };
}
function createRelatedWidget(domEl, state, setupFunc) {
    var widgetReady = new Promise(function (resolve) {
        import('./esm-devexpress.viz-5d8db4bd.js').then(function (DxBlazorViz) {
            let widgetBuilder = createWidgetBuilder(DxBlazorViz, domEl.querySelector(".dx-chart"), state, resolve);
            setupFunc(state, widgetBuilder);
        });
    });
    activeWidgets.push(domEl);
    activeWidgets.push(widgetReady);
    return widgetReady;
}
function proceedWithPalette(opt, initFunc) {
    if (opt.palette) return initFunc(opt.palette);
    var defaultColorClasses = ["bg-primary", "bg-success", "bg-danger", "bg-warning", "bg-info", "bg-secondary"];
    var container = document.createElement("DIV");
    container.className = "d-none position-absolute";
    for (var i = 0; i < defaultColorClasses.length; i++) {
        var colorContainer = document.createElement("DIV");
        colorContainer.className = defaultColorClasses[i];
        container.appendChild(colorContainer);
    }
    changeDom(function () {
        document.body.appendChild(container);
        calculateStyles(function () {
            var bsPalette = [];
            for (var i = 0; i < container.childNodes.length; i++) {
                bsPalette.push(GetCurrentStyle(container.childNodes[i]).backgroundColor);
            }
            changeDom(function () {
                document.body.removeChild(container);
                initFunc(bsPalette);
            });
        });
    });
}
function attachEventToLegendItem(el, chart, seriesIndex, pointId, evtNames, seriesAction) {
    evtNames.forEach(function (evtName) {
        AttachEventToElement(el, evtName, function (e) {
            var target = getLegendItemTarget(chart, seriesIndex, pointId);
            if (target)
                seriesAction(target);
        });
    });
}
function ensureSeriesLegendColor(mainElement, chart) {
    var legendElements = mainElement.querySelectorAll(".dx-chart-legend-item");
    for(var i = 0; i < legendElements.length; i++) {
        var legendElement = legendElements[i];
        var seriesIndex = +legendElement.getAttribute("data-series");
        var pointId = legendElement.getAttribute("data-point");
        syncLegendItemAndSeries(legendElement, chart, seriesIndex, pointId, true);
    }
}
function getLegendItemTarget(chart, seriesIndex, pointId) {
    var target = chart.getSeriesByPos(seriesIndex);
    if (pointId)
        target = target.getPoints().filter(function (p) { return p.tag === pointId; })[0];
    return target;
}
function syncLegendItemAndSeries(legendEl, chart, seriesIndex, pointId, skipAttachEvents) {
    var target = getLegendItemTarget(chart, seriesIndex, pointId);
    if (!target) return;
    var iconEl = legendEl.querySelector(".dx-chart-legend-icon");
    if (iconEl) {
        var color = target.getColor();
        if (ElementHasCssClass(iconEl, "dx-chart-def-icon"))
            iconEl.style.backgroundColor = color;
        iconEl.style.color = color;
    }
    if(skipAttachEvents) return;
    attachEventToLegendItem(legendEl, chart, seriesIndex, pointId, ["mouseover", "focusin"], function (t) { t.hover(chart.option("legend.hoverMode")); });
    attachEventToLegendItem(legendEl, chart, seriesIndex, pointId, ["mouseout", "focusout"], function (t) { t.clearHover(); });
}
function createTooltipContentPlaceholderHTML(elementRef, tag) {
    return calculateStyles(function () {
        var box = elementRef.getBoundingClientRect();
        return '<div id="_' + tag + '" class="dx-chart-tooltip-wrapper" style="width: ' + box.width + 'px; height: ' + box.height + 'px;"></div>';
    });
}
function setupTooltip(options, dotnetHelper) {
    var currentPoint = null, shownPoint = null, element = null, placeholderCache = {}, contentCache = {}, timerId = -1;
    function fetchContent(tag, showTooltip) {
        clearTimeout(timerId);
        timerId = setTimeout(function () {
            currentPoint = tag;
            dotnetHelper.invokeMethodAsync('GetTooltipTemplate', [tag])
                .then(function (elementRef) {
                    elementRef = EnsureElement(elementRef);
                    contentCache[tag] = elementRef;
                    return createTooltipContentPlaceholderHTML(elementRef, tag);
                })
                .then(function (html) {
                    placeholderCache[tag] = html;
                    if (currentPoint === tag)
                        showTooltip();
                })
                .catch(function (e) { console.error(e); });
        }, 100);
    }
    function onTooltipHidden(e) {
        shownPoint = null;
        if (element) {
            (function (_) {
                import('./esm-popup-utils-2e6d89cb.js').then(function (p) { p.hide(_); });
            })(element);
            element = null;
        }
    }
    function onTooltipShown(e) {
        if (!e.target) return;
        var tag = e.target.tag;
        if (placeholderCache[tag]) {
            shownPoint = tag;
            import('./esm-popup-utils-2e6d89cb.js').then(function (p) {
                if (shownPoint == tag)
                    p.show(element = contentCache[tag], document.getElementById("_" + tag), "top-sides left-sides");
            });
        }
    }
    function getPointRender(e) {
        if (!placeholderCache[e.point.tag]) {
            fetchContent(e.point.tag, function () { e.point.showTooltip(); });
            return { text: "" };
        } else
            return { html: placeholderCache[e.point.tag] };
    }    options.tooltip = { enabled: true, paddingLeftRight: 0, paddingTopBottom: 0, customizeTooltip: getPointRender };
    options.onTooltipHidden = onTooltipHidden;
    options.onTooltipShown = onTooltipShown;
}
function getValueAxisByPane(chart, pane) {
    return chart._valueAxes.filter(function(va) { return va.pane === pane.name; })[0];
}
function adjustLegend(mainElement, chart) {
    if (!chart.panes || chart.panes.filter(function(p) { return p.name !== "default"; }).length === 0)
        return;
    function translateY(style, offset) {
        changeDom(function() { translatePosition(style, 0, offset); });
    }
    function translatePaneParts(paneLegendElementStyle, axisGroupElementStyle, axisGridElementStyle, legendOffset, paneOffset) {
        translateY(paneLegendElementStyle, legendOffset);
        paneLegendElementStyle.marginTop = "-" + paneOffset + "px";
        translateY(axisGroupElementStyle, -paneOffset);
        translateY(axisGridElementStyle, -paneOffset);
    }
    calculateStyles(function() {
        var chartMarginTop = 0, defaultSpacing = 10;
        for(var i = chart.panes.length - 2; i >= 0; i--) {
            var pane = chart.panes[i];
            var paneLegendElement = mainElement.querySelector(".dx-chart-legend[data-pane='" + pane.name + "']");
            var paneOffset = paneLegendElement.offsetHeight + chartMarginTop;
            var valueAxis = getValueAxisByPane(chart, pane);
            var axisGroupElement = valueAxis._axisGroup.element;
            var axisGridElement = valueAxis._axisGridGroup.element;
            var gridBottom = axisGridElement.getBoundingClientRect().bottom + defaultSpacing;
            var existingTransform = parseTranslateInfo(paneLegendElement.style);
            var legendTop = paneLegendElement.getBoundingClientRect().top - existingTransform.top;
            chart.series.filter(function(s) { return s.pane === pane.name; }).forEach(function(series) {
                translateY(series._group.element.style, -paneOffset);
            });
            translatePaneParts(paneLegendElement.style, axisGroupElement.style, axisGridElement.style, gridBottom - legendTop, paneOffset);
            chartMarginTop += paneOffset;
        }
        changeDom(function() {
            chart.option("margin", { top: chartMarginTop });
        });
    });
}
function Init(mainElement, opt, dotnetHelper) {
    return updateRelatedWidget(mainElement, opt, function (opt, widgetBuilder) {
        proceedWithPalette(opt, function (palette) {
            var isDrawn = false;
            function ensureInitialized(sender) {
                if (!isDrawn) {
                    isDrawn = true;
                    ensureSeriesLegendColor(mainElement, sender.component);
                    adjustLegend(mainElement, sender.component);
                    toggleCssClass(mainElement, "dx-loading", false);
                }
            }
            var options = {
                tooltip: opt.tooltip,
                dataSource: opt.dataSource,
                palette: palette,
                commonAxisSettings: {
                    label: {
                        overlappingBehavior: "rotate",
                        rotationAngle: 45
                    }
                },
                dataPrepareSettings: {
                    sortingMethod: false
                },
                commonSeriesSettings: {
                    argumentField: "argument",
                    valueField: "value",
                    openValueField: "openValue",
                    highValueField: "highValue",
                    lowValueField: "lowValue",
                    closeValueField: "closeValue",
                    rangeValue1Field: "startValue",
                    rangeValue2Field: "endValue",
                    sizeField: "size",
                    type: "bar"
                },
                adaptiveLayout: {width:0,height:0},
                seriesTemplate: {
                    nameField: "seriesId",
                    customizeSeries: function (valueFromNameField) {
                        return opt.series.filter(function (s) { return s.seriesId === valueFromNameField; })[0];
                    }
                },
                customizeLabel: function (point) { return point.data.pointLabel; },
                customizePoint: function (point) { return point.data.pointAppearance; },
                legend: { visible: false, hoverMode: (opt.legend ? opt.legend.hoverMode : null) || "includepoints" },
                onDrawn: ensureInitialized,
                valueAxis: opt.valueAxis,
                panes: opt.panes,
                argumentAxis: opt.argumentAxis,
                pathModified: true
            };
            if (opt.hasTooltipCustomization)
                setupTooltip(options, dotnetHelper);
            else
                options.tooltip = opt.tooltip;
            widgetBuilder(options);
        });
    })
    .then(function () { return Promise.resolve("ok"); })
    .catch(function (r) { console.error(r); });
}
function OnSeriesLegendElementReceived(mainElement, seriesIndex, pointId, legendItemElement) {
    return findRelatedWidget(mainElement).then(function (chart) {
        syncLegendItemAndSeries(legendItemElement, chart, seriesIndex, pointId);
        return Promise.resolve();
    }).catch(function (r) {
        console.error(r);
    });
}
function OnSeriesVisibleChanged(mainElement, seriesIndex, pointId, visible) {
    return findRelatedWidget(mainElement).then(function (chart) {
        var target = getLegendItemTarget(chart, seriesIndex, pointId);
        if (visible)
            target.show();
        else
            target.hide();
        return Promise.resolve();
    }).catch(function (r) {
        console.error(r);
    });
}
function Dispose(mainElement) {
    return disposeWidget(mainElement, true);
}
function DestroyTooltips() {
    return new Promise(function (resolve, _) {
        var liveTooltipElements = Array.prototype.slice.call(document.querySelectorAll(".dxc-tooltip"));
        for (var i = 0; i < liveTooltipElements.length; i++) {
            var el = liveTooltipElements[i];
            el.parentNode.removeChild(el);
        }
        resolve(true);
    });
}
const charts = { Init, Dispose, OnSeriesLegendElementReceived, OnSeriesVisibleChanged, DestroyTooltips };

export default charts;
export { createWidgetBuilder };
