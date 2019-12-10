_dxBlazorInternal.define('cjs-chunk-509db829.js', function(require, module, exports) {'use strict';

require('./cjs-dom-utils-6a09eac3.js');

function generateDisposeIdCore() {
    var id = (62135596800000 + (new Date()).getTime()).toString() + getRandomInt(1,1000).toString();
    return id;
}
function generateDisposeId() {
    var id;
    do {
        id = generateDisposeIdCore();
    } while(Disposable[id])
    return id.toString();
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function DisposeEvents(element) {
    if (element.dataset.disposeId)
        { Disposable[element.dataset.disposeId](); }
    delete Disposable[element.dataset.disposeId];
    delete element.dataset.disposeId;
}
function RegisterDisposableEvents(element, dispose) {
    if (!element.dataset.disposeId)
        { element.dataset.disposeId = generateDisposeId(); }
    Disposable[element.dataset.disposeId] = dispose;
}
var Disposable = [];

exports.DisposeEvents = DisposeEvents;
exports.RegisterDisposableEvents = RegisterDisposableEvents;},["cjs-dom-utils-6a09eac3.js"]);
