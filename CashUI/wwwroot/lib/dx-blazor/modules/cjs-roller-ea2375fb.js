_dxBlazorInternal.define('cjs-roller-ea2375fb.js', function(require, module, exports) {'use strict';

require('./cjs-chunk-c43b3f7c.js');
var domUtils = require('./cjs-dom-utils-6a09eac3.js');
var __chunk_4 = require('./cjs-chunk-7aa0d757.js');

function easeOutQuad(t) { return t * (2 - t) }

var Subscription = function() {
    this.subscribers = [];
};
Subscription.prototype.subscribe = function (callback) {
    if(this.subscribers.indexOf(callback) === -1)
        { this.subscribers.push(callback); }
};
Subscription.prototype.unsubscribe = function (callback) {
    var index = this.subscribers.indexOf(callback);
    if(index !== -1)
        { this.subscribers.splice(index, 1); }
};
Subscription.Empty = new Subscription();
var Emitter = /*@__PURE__*/(function (Subscription) {
    function Emitter () {
        Subscription.apply(this, arguments);
    }

    if ( Subscription ) Emitter.__proto__ = Subscription;
    Emitter.prototype = Object.create( Subscription && Subscription.prototype );
    Emitter.prototype.constructor = Emitter;

    Emitter.prototype.emit = function (data) {
        this.subscribers.forEach(function (s) { return s(data); });
    };

    return Emitter;
}(Subscription));
var Subject = /*@__PURE__*/(function (Subscription) {
    function Subject(value) {
        Subscription.call(this);
        this.isInitialized = arguments.length === 1;
        this.value = value;
    }

    if ( Subscription ) Subject.__proto__ = Subscription;
    Subject.prototype = Object.create( Subscription && Subscription.prototype );
    Subject.prototype.constructor = Subject;
    Subject.prototype.update = function (newValue) {
        if(!this.isInitialized || newValue !== this.value) {
            this.isInitialized = true;
            this.value = newValue;
            this.subscribers.forEach(function (s) { return s(newValue); });
        }
    };
    Subject.prototype.subscribe = function (callback, skipInit) {
        if(this.isInitialized && !skipInit)
            { callback(this.value); }
        Subscription.prototype.subscribe.call(this, callback);
    };
    Subject.prototype.asTrigger = function (valuesOrFunc) {
        var result = new Subject();
        if(typeof valuesOrFunc !== "function")
            { this.subscribe(function (v) { return result.update(valuesOrFunc.indexOf(v) !== -1); }); }
        else
            { this.subscribe(function (v) { return result.update(valuesOrFunc(v)); }); }
        return result;
    };
    Subject.prototype.or = function (subj) {
        var this$1 = this;

        var result = new Subject();
        this.subscribe(function (v) { return result.update(v || subj.value); });
        subj.subscribe(function (v) { return result.update(this$1.value || v); });
        return result;
    };
    Subject.prototype.and = function (subj) {
        var this$1 = this;

        var result = new Subject();
        this.subscribe(function (v) { return result.update(v && subj.value); });
        subj.subscribe(function (v) { return result.update(this$1.value && v); });
        return result;
    };
    Subject.prototype.join = function (subj) {
        var this$1 = this;

        var result = new Subject();
        this.subscribe(function (v) { return result.update([v, subj.value]); });
        subj.subscribe(function (v) { return result.update([this$1.value, v]); });
        return result;
    };

    return Subject;
}(Subscription));
function getVisibleSibling(rollerItem, allowHidden, getter) {
    var prevItem = getter(rollerItem);
    if (!prevItem) { return null; }
    if (!allowHidden && !prevItem.visible.value) { return getVisibleSibling(prevItem, allowHidden, getter); }
    return prevItem;
}
function getGeneratedSibling(rollerGeneratedItem, deltaSign) {
    var cacheKey = deltaSign === -1 ? "prevItem" : "nextItem";
    if (!rollerGeneratedItem[cacheKey]) {
        return rollerGeneratedItem[cacheKey] = (function (collection) {
            var value = rollerGeneratedItem.value + deltaSign * collection.delta;
            if (deltaSign === -1 && collection.min !== -1 && value < collection.min) { return new RollerGeneratedItem(collection, collection.max, false, null, rollerGeneratedItem); }
            if (deltaSign === +1 && collection.max !== -1 && value > collection.max) { return new RollerGeneratedItem(collection, collection.min, false, rollerGeneratedItem, null); }
            return new RollerGeneratedItem(collection, value, false);
        })(rollerGeneratedItem.collection);
    } else
        { return rollerGeneratedItem[cacheKey]; }
}
var RollerItem = function(collection, value, visible, isSelected, prevItem, nextItem) {
    var this$1 = this;

    this.collection = collection;
    this.prevItem = prevItem;
    this.nextItem = nextItem;
    this.value = value;
    this.visible = visible || new Subject(true);
    this.selected = new Subject(!!isSelected);
    if (prevItem)
        { prevItem.nextItem = this; }
    if (nextItem)
        { nextItem.prevItem = this; }
    this.displayText = new Subject(value);
    var collectionSelection = this.collection.selectedItem;
    this.selected.subscribe(function (s) {
        if(s) {
            if(collectionSelection.value)
                { collectionSelection.value.selected.update(false); }
            collectionSelection.update(this$1);
        }
    });
    this.visible.subscribe(function (v) {
        if(!v && this$1.selected.value)
            { this$1.getPrevious().selected.update(true); }
        this$1.collection.visibleItemsChanged.emit();
    }, true);
};
RollerItem.prototype.getPrevious = function (allowHidden) { return getVisibleSibling(this, allowHidden, function (item) { return item.prevItem; }); };
RollerItem.prototype.getNext = function (allowHidden) { return getVisibleSibling(this, allowHidden, function (item) { return item.nextItem; }); };
RollerItem.prototype.getDisplayText = function () {
    return this.displayText.value || this.value;
};
var RollerGeneratedItem = /*@__PURE__*/(function (RollerItem) {
    function RollerGeneratedItem(collection, value, isSelected, prevItem, nextItem) {
        RollerItem.call(this, collection, value, null, isSelected, prevItem, nextItem);
    }

    if ( RollerItem ) RollerGeneratedItem.__proto__ = RollerItem;
    RollerGeneratedItem.prototype = Object.create( RollerItem && RollerItem.prototype );
    RollerGeneratedItem.prototype.constructor = RollerGeneratedItem;
    RollerGeneratedItem.prototype.getPrevious = function (allowHidden) { return getGeneratedSibling(this, -1); };
    RollerGeneratedItem.prototype.getNext = function (allowHidden) { return getGeneratedSibling(this, +1); };

    return RollerGeneratedItem;
}(RollerItem));
var RollerOriginGeneratedItem = /*@__PURE__*/(function (RollerGeneratedItem) {
    function RollerOriginGeneratedItem(collection, value) {
        RollerGeneratedItem.call(this, collection, value, true);
    }

    if ( RollerGeneratedItem ) RollerOriginGeneratedItem.__proto__ = RollerGeneratedItem;
    RollerOriginGeneratedItem.prototype = Object.create( RollerGeneratedItem && RollerGeneratedItem.prototype );
    RollerOriginGeneratedItem.prototype.constructor = RollerOriginGeneratedItem;

    return RollerOriginGeneratedItem;
}(RollerGeneratedItem));
var RollerItemCollection = function() {
    this.items = [];
    this.selectedItem = new Subject();
    this.visibleItemsChanged = new Emitter();
};
RollerItemCollection.createMonthCollection = function (selectedMonth, monthNames) {
    var result = new RollerItemCollection();
    for (var i = 0; i < monthNames.length; i++)
        { result.add(i + 1, null, i + 1 === selectedMonth).displayText.value = monthNames[i]; }
    result.initialize(selectedMonth);
    return result;
};
RollerItemCollection.createGenerator = function (selectedValue, min, max, delta) {
    var result = new RollerItemGenerator(min, max, delta);
    result.initialize(selectedValue);
    return result;
};
RollerItemCollection.prototype.initialize = function (value) {
    this.items[0].prevItem = this.items[this.items.length - 1];
    this.items[this.items.length - 1].nextItem = this.items[0];
    this.items.filter(function (i) { return i.value === value; })[0].selected.update(true);
};
RollerItemCollection.prototype.add = function (value, visible, selected) {
    var result = new RollerItem(this, value, visible, selected, this.items[this.items.length - 1]);
    this.items.push(result);
    return result;
};
var RollerItemGenerator = /*@__PURE__*/(function (RollerItemCollection) {
    function RollerItemGenerator(min, max, delta) {
        RollerItemCollection.call(this);
        this.min = min;
        this.max = max;
        this.delta = delta;
        this.originItem = null;
    }

    if ( RollerItemCollection ) RollerItemGenerator.__proto__ = RollerItemCollection;
    RollerItemGenerator.prototype = Object.create( RollerItemCollection && RollerItemCollection.prototype );
    RollerItemGenerator.prototype.constructor = RollerItemGenerator;
    RollerItemGenerator.prototype.initialize = function (value) {
        this.originItem = new RollerOriginGeneratedItem(this, value);
    };

    return RollerItemGenerator;
}(RollerItemCollection));
var RollerItemContainer = function(dataItem, index, roller, height, prevItem) {
    this.displayTextSubscription = this.displayTextSubscription.bind(this);
    this.roller = roller;
    this.prevItem = prevItem;
    this.nextItem = null;
    this.index = index;
    this.element = roller.createRollerItemElement();
    this.offset = index * height;
    this.height = height;
    this.position = 0;
    this.visibleItemCount = roller.visibleItemCount;
    if (prevItem)
        { prevItem.nextItem = this; }
    this.updateDataItem(dataItem);
    this.selectItem = this.selectItem.bind(this);
};
RollerItemContainer.prototype.initialize = function () {
        var this$1 = this;

    this.move(this.offset);
    this.element.addEventListener("click", function (e) {
        domUtils.RequestAnimationFrame(this$1.selectItem);
    });
};
RollerItemContainer.prototype.isSelected = function () {
    var selectedItemIndex = Math.floor(this.visibleItemCount / 2);
    return selectedItemIndex * this.height === Math.round(this.position);
};
RollerItemContainer.prototype.selectItem = function (timestamp) {
        var this$1 = this;

    var selectedItemIndex = Math.floor(this.visibleItemCount / 2);
    var baseOffset = (selectedItemIndex - this.index) * this.height;
    var realOffset = baseOffset - (this.position - this.offset);
    return this.roller.afterMove(animateValueContiniusChange(Subscription.Empty, function (d) { return this$1.roller.move(d); }, {
            divisor: this.roller.itemSize.height,
            startTimestamp: timestamp,
            endTimestamp: timestamp + 300,
            easing: easeOutQuad,
            frameCallback: domUtils.RequestAnimationFrame,
            value: realOffset
    }));
};
RollerItemContainer.prototype.move = function (offset) {
    this.updatePosition(offset);
    var transformOffset = this.position - this.offset;
    var ratio = Math.max(0, Math.min(1, (this.position + this.height / 2) / (this.visibleItemCount * this.height)));
    var opacityCoef = 0.3 + Math.sin(ratio * Math.PI) * 0.7;
    this.element.style.cssText = "transform: matrix(1, 0, 0, 1, 0, " + transformOffset + "); opacity: " + opacityCoef;
};
RollerItemContainer.prototype.updatePosition = function (pos) {
    this.position += pos;
    if (this.position > this.visibleItemCount * this.height) {
        this.position -= (this.visibleItemCount + 1) * this.height;
        this.updateDataItem(this.nextItem.dataItem.getPrevious());
    } else if (this.position < (-1 * this.height)) {
        this.position += (this.visibleItemCount + 1) * this.height;
        this.updateDataItem(this.prevItem.dataItem.getNext());
    }
};
RollerItemContainer.prototype.updateDataItem = function (dataItem) {
    if (this.dataItem !== dataItem) {
        if(this.dataItem)
            { this.dataItem.displayText.unsubscribe(this.displayTextSubscription); }
        this.dataItem = dataItem;
        this.dataItem.displayText.subscribe(this.displayTextSubscription);
    }
};
RollerItemContainer.prototype.displayTextSubscription = function (displayText) {
    updateRollerItemElementText(this.element, displayText);
};
RollerItemContainer.prototype.raiseChanges = function () {
    if (this.isSelected())
        { this.dataItem.selected.update(true); }
};
function updateRollerItemElementText(element, displayText) {
    element.innerText = displayText;
}
function getVisualRange(current, itemHeight, nextContainerGetter) {
    var nextContainer = nextContainerGetter(current);
    return Math.abs(Math.round(nextContainer.position - current.position)) === itemHeight ? [nextContainer].concat(getVisualRange(nextContainer, itemHeight, nextContainerGetter)) : [];
}
function updateDataItems(containers, dataItem, nextItemGetter) {
    if(containers.length === 0) { return; }
    containers.shift().updateDataItem(dataItem);
    updateDataItems(containers, nextItemGetter(dataItem), nextItemGetter);
}
var Roller = function(itemCollection, visibleItemCount, container, itemSize, caption, longestVisibleDisplayText) {
    this.itemCollection = itemCollection;
    this.visibleItemCount = visibleItemCount;
    this.itemContainers = [];
    this.itemSize = itemSize;
    this.caption = caption;
    this.longestVisibleDisplayText = longestVisibleDisplayText;
    this.container = container;
    this.rollerElement = null;
    this.rollerContainer = null;
    this.move = this.move.bind(this);
    this.afterMove = this.afterMove.bind(this);
};
Roller.prototype.initialize = function () {
        var this$1 = this;

    this.initializeRollerElements();
    var visibleRange = [this.itemCollection.selectedItem.value];
    while (visibleRange.length < this.visibleItemCount) {
        visibleRange.splice(0, 0, visibleRange[0].getPrevious());
        visibleRange.push(visibleRange[visibleRange.length - 1].getNext());
    }
    visibleRange.push(visibleRange[visibleRange.length - 1].getNext());
    for (var i = 0; i < visibleRange.length; i++)
        { this.itemContainers.push(new RollerItemContainer(visibleRange[i], i, this, this.itemSize.height, this.itemContainers[this.itemContainers.length - 1])); }
    this.itemContainers[0].prevItem = this.itemContainers[this.itemContainers.length - 1];
    this.itemContainers[this.itemContainers.length - 1].nextItem = this.itemContainers[0];
    for (var i = 0; i < this.itemContainers.length; i++)
        { this.itemContainers[i].initialize(); }
    this.itemCollection.selectedItem.subscribe(function () { return this$1.updateVisibleDataItems(); }, true);
    this.itemCollection.visibleItemsChanged.subscribe(function () { return this$1.updateVisibleDataItems(); }, true);
    if(this.longestVisibleDisplayText)
        { updateRollerItemElementText(this.createRollerItemElement("roller-item expander"), this.longestVisibleDisplayText); }
    this.createRollerItemElement("roller-after");
    attachScroll(this.rollerElement, this.itemSize.height, this.move, this.afterMove);
    attachVerticalSwipe(this.rollerElement, this.itemSize.height, this.move, this.afterMove);
    this.rollerContainer.addEventListener("keydown", function (e) {
        var elementToSelect =  null;
        if(e.keyCode === __chunk_4.Key.Up)
            { elementToSelect = this$1.itemCollection.selectedItem.value.getNext(); }
        else if(e.keyCode === __chunk_4.Key.Down)
            { elementToSelect = this$1.itemCollection.selectedItem.value.getPrevious(); }
        if(elementToSelect) {
            e.preventDefault();
            elementToSelect.selected.update(true);
        }
    });
};
Roller.prototype.initializeRollerElements = function () {
    var rollerContainer = this.rollerContainer = document.createElement("A");
    rollerContainer.className = "roller-container";
    rollerContainer.href = "javascript:;";
    rollerContainer.style.minWidth = this.itemSize.width;
    var rollerCaption = document.createElement("SPAN");
    rollerCaption.innerText = this.caption;
    rollerCaption.className = "roller-title";
    rollerContainer.appendChild(rollerCaption);
    var roller = this.rollerElement = document.createElement("SPAN");
    roller.className = "roller";
    rollerContainer.appendChild(roller);
    if (this.container)
        { this.container.appendChild(rollerContainer); }
};
Roller.prototype.updateVisibleDataItems = function () {
    var selectedItemContainer = this.itemContainers.filter(function (c) { return c.isSelected(); })[0];
    if(!selectedItemContainer) { return; }
    var prevContainers = getVisualRange(selectedItemContainer, this.itemSize.height, function (c) { return c.prevItem; });
    var nextContainers = getVisualRange(selectedItemContainer, this.itemSize.height, function (c) { return c.nextItem; });
    var selectedDataItem = this.itemCollection.selectedItem.value;
    selectedItemContainer.updateDataItem(selectedDataItem);
    updateDataItems(prevContainers.concat([]), selectedDataItem.getPrevious(), function (i) { return i.getPrevious(); });
    updateDataItems(nextContainers.concat([]), selectedDataItem.getNext(), function (i) { return i.getNext(); });
};
Roller.prototype.createRollerItemElement = function (customCssClass) {
    var element = document.createElement("SPAN");
    element.className = customCssClass || "roller-item";
    this.rollerElement.appendChild(element);
    return element;
};
Roller.prototype.move = function (pos) {
    if (pos === 0)
        { return; }
    var delta = Math.sign(pos);
    var maxIndex = this.itemContainers.length - 1,
        startIndex = delta === -1 ? maxIndex : 0,
        endIndex = (delta === -1 ? 0 : maxIndex) + delta;
    for (var i = startIndex; i !== endIndex; i += delta)
        { this.itemContainers[i].move(pos); }
};
Roller.prototype.afterMove = function (moveCompleted) {
        var this$1 = this;

    return moveCompleted.then(function () { return Promise.resolve(this$1.itemContainers.forEach(function (i) { return i.raiseChanges(); })); });
};
function animateValueContiniusChange(inputEmitter, handler, settings) {
    return new Promise(function (resolve, reject) {
        function processExternalInput() {
            inputEmitter.unsubscribe(processExternalInput);
            reject();
        }
        inputEmitter.subscribe(processExternalInput, true);
        var animatedValue = 0, frameCallback = settings.frameCallback;
        frameCallback(function animate(timestamp) {
            if(timestamp < settings.endTimestamp) {
                var coef = settings.easing((timestamp - settings.startTimestamp) / (settings.endTimestamp - settings.startTimestamp));
                var value = settings.value * coef - animatedValue;
                handler(value);
                animatedValue += value;
                frameCallback(animate);
            } else {
                inputEmitter.unsubscribe(processExternalInput);
                handler(settings.value - animatedValue);
                resolve();
            }
        });
    });
}
function attachInputSource(inputEmitter, inputFinishedEmitter, settings, handler, finishPromiseRegistrator, frameCallback) {
    var lastOffsetDelta, currentOffset, lastTimestap,
        acceleration = 1,
        isInputActive,
        accMaxTimeFrame = settings.accelerationTimeFrame || 300;
    function createAnimationParams(timestamp) {
        var d = Math.abs(currentOffset % settings.divisor);
        return {
            value: (settings.divisor - d) * Math.sign(currentOffset),
            endTimestamp: timestamp + 300,
            startTimestamp: timestamp,
            easing: easeOutQuad,
            frameCallback: frameCallback
        };
    }
    function calculateAcceleratedDelta(timestamp, delta) {
        delta = delta * acceleration;
        if((delta >= lastOffsetDelta) && (timestamp - lastTimestap <= accMaxTimeFrame)) {
            acceleration = Math.min(2, acceleration * 1.2);
        }
        currentOffset += delta;
        lastOffsetDelta = delta;
        lastTimestap = timestamp;
        return delta;
    }
    function resetGestureState(timestamp) {
        currentOffset = 0;
        lastTimestap = timestamp;
        acceleration = 1;
    }
    inputEmitter.subscribe(function inputProcess(delta) {
        frameCallback(function (timestamp) {
            if(!isInputActive) {
                isInputActive = true;
                resetGestureState(timestamp);
                finishPromiseRegistrator(new Promise(function (resolve, _) {
                    inputFinishedEmitter.subscribe(function inputFinish(finishStamp) {
                        inputFinishedEmitter.unsubscribe(inputFinish);
                        animateValueContiniusChange(inputEmitter, handler, createAnimationParams(finishStamp))
                            .then(function () {
                                isInputActive = false;
                                resolve();
                            })
                            .catch(function () { inputFinishedEmitter.subscribe(inputFinish); })
                            .finally(resetGestureState);
                    });
                }));
            }
            handler(calculateAcceleratedDelta(timestamp, delta));
        });
    });
}
function attachScroll(element, itemHeight, handler, registrator) {
    var inputEmitter = new Emitter();
    var inputFinishEmitter = new Emitter();
    var stopTimerId = -1;
    element.addEventListener("wheel", function (e) {
        clearTimeout(stopTimerId);
        stopTimerId = setTimeout(function () { return domUtils.RequestAnimationFrame(function (t) { return inputFinishEmitter.emit(t); }); }, 200);
        e.preventDefault();
        inputEmitter.emit(-e.deltaY);
    }, false);
    attachInputSource(inputEmitter, inputFinishEmitter, { divisor: itemHeight }, handler, registrator, domUtils.RequestAnimationFrame);
}
function attachVerticalSwipe(element, itemHeight, handler, registrator) {
    var inputEmmiter = new Emitter();
    var inputFinishEmmiter = new Emitter();
    var lastY = 0;
    element.addEventListener("touchstart", function (e) {
        lastY = e.touches[0].clientY;
    }, false);
    element.addEventListener("touchend", function (e) {
        lastY = 0;
        domUtils.RequestAnimationFrame(function (timespan) { return inputFinishEmmiter.emit(timespan); });
    }, false);
    element.addEventListener("touchmove", function (e) {
        e.preventDefault();
        var y = e.changedTouches[0].clientY;
        inputEmmiter.emit(y - lastY);
        lastY = y;
    }, false);
    attachInputSource(inputEmmiter, inputFinishEmmiter, { divisor: itemHeight }, handler, registrator, domUtils.RequestAnimationFrame);
}
function isLeapYear(item) {
    return item.value % 4 === 0;
}
function has30Days(item) {
    return item.value !== 2;
}
function has31Days(item) {
    return [1,3,5,7,8,10,12].indexOf(item.value) !== -1;
}
var RollerItemType = {
    Day: 0,
    DayWithShortName: 1,
    DayWithFullName: 2,
    MonthWithShortName: 3,
    MonthWithFullName: 4,
    Year: 5
};
function addDayRollerItem(dayCollection, dayValue, visibleSubject, isSelected, dayNames, monthAndYear) {
    var dayRollerItem = dayCollection.add(dayValue, visibleSubject, isSelected);
    if (dayNames.length > 0) {
        monthAndYear.subscribe(function (ref) {
            var month = ref[0];
            var year = ref[1];

            var dayOfWeekName = dayNames[getDayOfWeek(year.value, month.value, dayValue)];
            dayRollerItem.displayText.update(dayValue + " " + dayOfWeekName);
        });
    }
}
function getDayOfWeek(year, monthNumber, day) {
    return (new Date(year, monthNumber - 1, day)).getDay();
}
function getLongestPostfix(names) {
    return names && names.length ? " " + names.concat([]).sort(function (n1, n2) { return n2.length - n1.length; })[0] : "";
}
function InitializeDateRoller(container, settings, dotNetRef) {
    var minYear = -1, maxYear = -1, yearDelta = 1,
        dayValue = settings.items.filter(function (i) { return i.type === RollerItemType.DayWithShortName || i.type === RollerItemType.DayWithFullName || i.type === RollerItemType.Day; })[0].value,
        monthValue = settings.items.filter(function (i) { return i.type === RollerItemType.MonthWithShortName || i.type === RollerItemType.MonthWithFullName; })[0].value,
        yearValue = settings.items.filter(function (i) { return i.type === RollerItemType.Year; })[0].value,
        monthNames = settings.monthNames || [],
        dayNames = settings.dayNames || [],
        itemHeight = 36,
        visibleItemCount = 5;
    var yearCollection = RollerItemCollection.createGenerator(yearValue, minYear, maxYear, yearDelta);
    var monthCollection = RollerItemCollection.createMonthCollection(monthValue, monthNames);
    var isNotFebruary = monthCollection.selectedItem.asTrigger(has30Days);
    var visibleSubjects = {
        29: yearCollection.selectedItem.asTrigger(isLeapYear).or(isNotFebruary),
        30: isNotFebruary,
        31: monthCollection.selectedItem.asTrigger(has31Days)
    };
    var monthAndYear = monthCollection.selectedItem.join(yearCollection.selectedItem);
    var dayCollection = new RollerItemCollection();
    for (var i = 1; i <= 31; i++)
        { addDayRollerItem(dayCollection, i, visibleSubjects[i], i === dayValue, dayNames, monthAndYear); }
    dayCollection.initialize(dayValue);
    var docFragment = document.createDocumentFragment();
    var stylesForRoller = document.createElement("STYLE");
    stylesForRoller.type = "text/css";
    stylesForRoller.innerText = ".roller { height: " + (itemHeight * visibleItemCount)
        + "px; } .roller-item, .roller-after { height: " + itemHeight + "px; } .roller-item, .roller-title { color: " + getComputedStyle(container).color + " !important; }";
    docFragment.appendChild(stylesForRoller);
    settings.items.forEach(function (item) {
        switch (item.type) {
            case RollerItemType.Day:
            case RollerItemType.DayWithFullName:
            case RollerItemType.DayWithShortName:
                var dayRoller = new Roller(dayCollection, visibleItemCount, docFragment, { width: "", height: itemHeight }, "Day", "25" + getLongestPostfix(dayNames));
                dayRoller.initialize();
                break;
            case RollerItemType.MonthWithFullName:
            case RollerItemType.MonthWithShortName:
                var monthRoller = new Roller(monthCollection, visibleItemCount, docFragment, { width: "", height: itemHeight }, "Month", getLongestPostfix(monthNames));
                monthRoller.initialize();
                break;
            case RollerItemType.Year:
                var yearRoller = new Roller(yearCollection, visibleItemCount, docFragment, { width: "", height: itemHeight }, "Year", "0000");
                yearRoller.initialize();
                break;
        }
    });
    container.appendChild(docFragment);
    function getValueSubscription(valueUpdater) {
        return function valueSubscription(item) {
            valueUpdater(item);
            dotNetRef.invokeMethodAsync("UpdateDateTime", [dayValue, monthValue, yearValue]);
        };
    }
    dayCollection.selectedItem.subscribe(getValueSubscription(function (item) {
        dayValue = item.value;
    }));
    monthCollection.selectedItem.subscribe(getValueSubscription(function (item) {
        monthValue = item.value;
    }));
    yearCollection.selectedItem.subscribe(getValueSubscription(function (item) {
        yearValue = item.value;
    }));
    return Promise.resolve();
}
var roller = { InitializeDateRoller: InitializeDateRoller };

exports.Emitter = Emitter;
exports.Roller = Roller;
exports.RollerItem = RollerItem;
exports.RollerItemCollection = RollerItemCollection;
exports.Subject = Subject;
exports.attachInputSource = attachInputSource;
exports.default = roller;
exports.getDayOfWeek = getDayOfWeek;},["cjs-chunk-c43b3f7c.js","cjs-dom-utils-6a09eac3.js","cjs-chunk-7aa0d757.js"]);
