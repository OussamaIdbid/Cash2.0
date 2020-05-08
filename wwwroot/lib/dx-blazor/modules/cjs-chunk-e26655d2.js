_dxBlazorInternal.define('cjs-chunk-e26655d2.js', function(require, module, exports) {'use strict';

var verticalScrollBarWidth;
function GetVerticalScrollBarWidth() {
    if(typeof(verticalScrollBarWidth) == "undefined") {
        var container = document.createElement("DIV");
        container.style.cssText = "position: absolute; top: 0px; left: 0px; visibility: hidden; width: 200px; height: 150px; overflow: hidden; box-sizing: content-box";
        document.body.appendChild(container);
        var child = document.createElement("P");
        container.appendChild(child);
        child.style.cssText = "width: 100%; height: 200px;";
        var widthWithoutScrollBar = child.offsetWidth;
        container.style.overflow = "scroll";
        var widthWithScrollBar = child.offsetWidth;
        if(widthWithoutScrollBar == widthWithScrollBar)
            { widthWithScrollBar = container.clientWidth; }
        verticalScrollBarWidth = widthWithoutScrollBar - widthWithScrollBar;
        document.body.removeChild(container);
    }
    return verticalScrollBarWidth;
}

exports.GetVerticalScrollBarWidth = GetVerticalScrollBarWidth;},[]);
