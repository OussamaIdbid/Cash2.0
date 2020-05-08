import './esm-dom-utils-d4fe413b.js';

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
        Disposable[element.dataset.disposeId]();
    delete Disposable[element.dataset.disposeId];
    delete element.dataset.disposeId;
}
function RegisterDisposableEvents(element, dispose) {
    if (!element.dataset.disposeId)
        element.dataset.disposeId = generateDisposeId();
    Disposable[element.dataset.disposeId] = dispose;
}
var Disposable = [];

export { DisposeEvents as D, RegisterDisposableEvents as R };
