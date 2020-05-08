var Timer = {};
Timer.ClearTimer = function (timerID) {
    if (timerID > -1)
        window.clearTimeout(timerID);
    return -1;
};
Timer.ClearInterval = function (timerID) {
    if (timerID > -1)
        window.clearInterval(timerID);
    return -1;
};
Timer.Throttle = function (func, delay) {
    var isThrottled = false,
        savedArgs,
        savedThis = this;
    function wrapper() {
        if (isThrottled) {
            savedArgs = arguments;
            savedThis = this;
            return;
        }
        func.apply(this, arguments);
        isThrottled = true;
        setTimeout(function () {
            isThrottled = false;
            if (savedArgs) {
                wrapper.apply(savedThis, savedArgs);
                savedArgs = null;
            }
        }, delay);
    }
    wrapper.cancel = function () {
        clearTimeout(delay);
        delay = savedArgs = savedThis = null;
    };
    return wrapper;
};

export { Timer as T };
