var ChartTime =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 21);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MIN_VALUE = -Number.MAX_VALUE;
exports.MIN_VALUE = MIN_VALUE;
var MAX_VALUE = Number.MAX_VALUE;
exports.MAX_VALUE = MAX_VALUE;
var canvasTest = document.createElement("canvas");
var ctxTest = canvasTest.getContext("2d");
exports.ctxTest = ctxTest;
canvasTest.setAttribute("width", "200");
canvasTest.setAttribute("height", "200");
function createDOM(template) {
    var div = document.createElement("div");
    div.innerHTML = template;
    return div.children[0];
}
exports.createDOM = createDOM;
function mergeIf(to) {
    var from = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        from[_i - 1] = arguments[_i];
    }
    var i = 0;
    var ln = from.length;
    var object;
    for (; i < ln; ++i) {
        object = from[i];
        for (var key in object) {
            if (object.hasOwnProperty(key) && !to.hasOwnProperty(key)) {
                to[key] = object[key];
            }
        }
    }
    return to;
}
exports.mergeIf = mergeIf;
function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}
exports.isNumeric = isNumeric;
function leftPad(u) {
    return (u > 9 ? "" : "0") + u.toString();
}
function formatTime(date) {
    return leftPad(date.getHours()) + ":" + leftPad(date.getMinutes()) + ":" + leftPad(date.getSeconds());
}
exports.formatTime = formatTime;
function formatDate(date) {
    return leftPad(date.getDate()) + "." + leftPad(date.getMonth() + 1) + "." + (date.getFullYear() % 100);
}
exports.formatDate = formatDate;
function delay(t, callback) {
    var time = null;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (time !== null) {
            clearTimeout(time);
            time = null;
        }
        time = setTimeout(function () {
            time = null;
            callback.apply(null, args);
        }, t);
        return time;
    };
}
exports.delay = delay;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var printWarn = false;
function setEnablePrintWarn(enable) {
    printWarn = enable;
}
exports.setEnablePrintWarn = setEnablePrintWarn;
function isEnablePrintWarn() {
    return printWarn;
}
exports.isEnablePrintWarn = isEnablePrintWarn;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Component_1 = __webpack_require__(22);
var CacheEvent_1 = __webpack_require__(9);
var util_1 = __webpack_require__(0);
var Widget = (function (_super) {
    __extends(Widget, _super);
    function Widget(config) {
        var _this = _super.call(this) || this;
        _this.cacheEvent = new CacheEvent_1.CacheEvent();
        _this.init(_this.mergeConfig(config));
        return _this;
    }
    Widget.prototype.init = function (config) {
        this.className = config.className;
        this.isShow = config.show;
        this.events = config.events || {};
        this.width = config.width;
        this.height = config.height;
        if (config.bindTo) {
            this.bindTo(config.bindTo);
        }
        else {
            this.container = null;
        }
    };
    Widget.prototype.bindTo = function (bindTo) {
        this.container = util_1.createDOM(this.self().template);
        if (this.className) {
            this.addClass(this.container, this.className);
        }
        bindTo.appendChild(this.container);
        this.afterRender();
        this.show(this.isShow);
        this.setSize(this.width, this.height);
    };
    Widget.prototype.show = function (show) {
        this.isShow = show !== false;
        if (this.container) {
            this.showEl(this.container, this.isShow);
        }
    };
    Widget.prototype.hide = function (hide) {
        this.show(hide === false);
    };
    Widget.prototype.setSize = function (width, height) {
        if (this.container) {
            this.container.style.width = width === null ? "" : (width + "px");
            this.container.style.height = height === null ? "" : (height + "px");
        }
        this.width = width;
        this.height = height;
    };
    Widget.prototype.fire = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var eventName = args[0];
        if (!this.events || !this.events.hasOwnProperty(eventName)) {
            return;
        }
        args[0] = this;
        this.events[eventName].apply(null, args);
    };
    Widget.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.events = null;
        this.cacheEvent.off();
        this.cacheEvent = null;
        if (this.container !== null) {
            this.container.parentNode.removeChild(this.container);
            this.container = null;
        }
    };
    Widget.prototype.addClass = function (el, className) {
        if (!this.hasClass(el, className)) {
            el.classList.add(className);
        }
    };
    Widget.prototype.removeClass = function (el, className) {
        if (this.hasClass(el, className)) {
            el.classList.remove(className);
        }
    };
    Widget.prototype.hasClass = function (el, className) {
        return el.classList.contains(className);
    };
    Widget.prototype.showEl = function (el, show) {
        var className = Widget.prefixClass + "-hide";
        if (show) {
            this.removeClass(el, className);
        }
        else {
            this.addClass(el, className);
        }
    };
    Widget.prototype.mergeConfig = function (config) {
        var configs = [{}];
        if (config) {
            configs.push(config);
        }
        var ctor = this.self();
        while (ctor !== Object) {
            if (ctor.hasOwnProperty("config")) {
                configs.push(ctor.config);
            }
            ctor = ctor.prototype.self();
        }
        return util_1.mergeIf.apply(null, configs);
    };
    Widget.prefixClass = "chart-time";
    Widget.config = {
        bindTo: null,
        className: null,
        show: true,
        width: null,
        height: null,
    };
    return Widget;
}(Component_1.Component));
exports.Widget = Widget;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// алгоритм нагло спизжен из библиотеки d3. и чуть-чуть перепилен
Object.defineProperty(exports, "__esModule", { value: true });
var Bisector = (function () {
    function Bisector(accessor) {
        this.accessor = null;
        this.accessor = accessor ? accessor : function (item) {
            return item; // TODO
        };
    }
    Bisector.prototype.left = function (array, num) {
        var lo = 0;
        var hi = array.length;
        var mid;
        while (lo < hi) {
            mid = lo + hi >>> 1;
            if (this.ascending(this.accessor(array[mid]), num) < 0) {
                lo = mid + 1;
            }
            else {
                hi = mid;
            }
        }
        return lo;
    };
    Bisector.prototype.right = function (array, num) {
        var lo = 0;
        var hi = array.length;
        var mid;
        while (lo < hi) {
            mid = lo + hi >>> 1;
            if (this.ascending(this.accessor(array[mid]), num) > 0) {
                hi = mid;
            }
            else {
                lo = mid + 1;
            }
        }
        return lo;
    };
    Bisector.prototype.ascending = function (a, b) {
        return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    };
    return Bisector;
}());
exports.Bisector = Bisector;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var group_1 = __webpack_require__(17);
var Updater = (function () {
    function Updater(defType, create, update, clean) {
        this.defType = defType;
        this.cCreate = create;
        this.cUpdate = update;
        this.cClean = clean;
    }
    Updater.prototype.update = function (config, instacnes) {
        if (instacnes === void 0) { instacnes = []; }
        var result = [];
        var indexes = {};
        var ln = config.length;
        var defaultType;
        var group;
        if (this.defType) {
            defaultType = this.defType;
            group = group_1.toGroup(instacnes, "type");
        }
        else {
            defaultType = "unknown";
            group = (_a = {}, _a[defaultType] = instacnes, _a);
        }
        Object.keys(group).forEach(function (key) {
            indexes[key] = 0;
        });
        for (var i = 0, type = void 0, instance = void 0; i < ln; ++i) {
            type = config[i].type || defaultType;
            if (group.hasOwnProperty(type) && group[type].length > indexes[type]) {
                instance = group[type][indexes[type]++];
                this.cUpdate(instance, config[i]);
            }
            else {
                instance = this.cCreate(config[i]);
            }
            result.push(instance);
        }
        this.clean(group, indexes);
        return result;
        var _a;
    };
    Updater.prototype.clean = function (group, indexes) {
        var i;
        var ln;
        var list;
        for (var key in group) {
            if (group.hasOwnProperty(key)) {
                list = group[key];
                for (i = indexes[key], ln = list.length; i < ln; ++i) {
                    this.cClean(list[i]);
                }
            }
        }
    };
    return Updater;
}());
exports.Updater = Updater;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Widget_1 = __webpack_require__(2);
var Tooltip_1 = __webpack_require__(12);
var util_1 = __webpack_require__(0);
__webpack_require__(34);
var Button = (function (_super) {
    __extends(Button, _super);
    function Button() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Button.prototype.init = function (config) {
        var _this = this;
        _super.prototype.init.call(this, config);
        this.chartTime = config.chartTime;
        this.title = config.title;
        this.tooltip = new Tooltip_1.Tooltip(util_1.mergeIf({
            target: null,
            show: !!this.title,
            events: {
                onCreate: function (tooltip, event) {
                    _this.addClass(tooltip.container, "chart-time-button-tooltip");
                    tooltip.update([_this.title]);
                },
            },
        }, config.tooltip || {}, Button.config.tooltip));
    };
    Button.prototype.afterRender = function () {
        this.container.innerHTML = this.self().icon;
        this.tooltip.setTarget(this.container);
    };
    Button.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.chartTime = null;
        if (this.tooltip) {
            this.tooltip.destroy();
        }
    };
    Button.config = {
        chartTime: null,
        tooltip: {
            hideByClick: true,
            showDelay: 2000,
            hideDelay: 2000,
            saveDelay: 3000,
        },
    };
    Button.template = "<div class=\"chart-time-icon-wrap\"></div>";
    return Button;
}(Widget_1.Widget));
exports.Button = Button;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = __webpack_require__(0);
var BaseSeries = (function () {
    function BaseSeries() {
        this.id = (++BaseSeries.id).toString(36);
        this.type = Object.getPrototypeOf(this).constructor.type;
        this.point = {};
    }
    BaseSeries.prototype.update = function (config) {
        this.title = config.title;
        this.show = config.show !== false;
        this.source = config.source;
        this.color = config.color;
        this.opacity = util_1.isNumeric(config.opacity) ? config.opacity : 1;
        this.scale = config.scale;
    };
    BaseSeries.prototype.load = function (data, calc) {
        this.data = data;
        this.calc = calc;
        this.filterScale = -1;
    };
    BaseSeries.prototype.filterColander = function (quality, scale) {
        var _this = this;
        var filter = [];
        var keys = Object.keys(this.point).map(function (key) {
            return _this.point[key].key;
        });
        var lnI = this.calc.length;
        var lnJ = keys.length;
        var i;
        var j;
        var item;
        var isNum;
        for (i = 0; i < lnI; ++i) {
            item = this.calc[i];
            isNum = true;
            for (j = 0; j < lnJ; ++j) {
                if (item[keys[j]] === undefined) {
                    isNum = false;
                    break;
                }
            }
            if (isNum) {
                filter.push(item);
            }
        }
        this.filter = filter;
    };
    BaseSeries.prototype.filterBetween = function (coord, sizeBody) {
        this.start = 0;
        this.finish = this.filter.length - 1;
    };
    BaseSeries.prototype.destroy = function () {
        this.id = null;
        this.type = null;
        this.point = null;
        this.data = null;
        this.calc = null;
        this.filter = null;
    };
    BaseSeries.prototype.findValue = function (key, start, direction) {
        var ln = this.data.length;
        var i = start;
        var v;
        if (direction > 0) {
            for (; i < ln; ++i) {
                v = this.point[key].accessor(this.data[i]);
                if (util_1.isNumeric(v)) {
                    return v;
                }
            }
        }
        else {
            for (; i >= 0; --i) {
                v = this.point[key].accessor(this.data[i]);
                if (util_1.isNumeric(v)) {
                    return v;
                }
            }
        }
        return null;
    };
    BaseSeries.prototype.updatePoint = function (config, key, isX) {
        if (!this.point.hasOwnProperty(key) || this.point[key].path !== config[key]) {
            this.point[key] = {
                path: config[key],
                accessor: this.createAccessor(config[key], isX),
                isDate: isX,
            };
        }
    };
    BaseSeries.prototype.createAccessor = function (path, isDate) {
        if (isDate === void 0) { isDate = false; }
        var reg = /^\d+$/;
        path = "data[" + path.split(".").map(function (propName) {
            return reg.test(propName) ? propName : "\"" + propName + "\"";
        }).join("][") + "]";
        if (isDate) {
            path += ".getTime()";
        }
        return new Function("data", "try { return " + path + "; } catch (e) { return undefined; }");
    };
    BaseSeries.id = 0;
    return BaseSeries;
}());
exports.BaseSeries = BaseSeries;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var PrintWarn_1 = __webpack_require__(1);
var Legend_1 = __webpack_require__(23);
var Tooltip_1 = __webpack_require__(12);
var Widget_1 = __webpack_require__(2);
var XScale_1 = __webpack_require__(14);
var YScale_1 = __webpack_require__(15);
var index_1 = __webpack_require__(24);
var index_2 = __webpack_require__(30);
var Drag_1 = __webpack_require__(11);
var Coord_1 = __webpack_require__(10);
var group_1 = __webpack_require__(17);
var util_1 = __webpack_require__(0);
__webpack_require__(31);
var X_SCALE_NANE = "xscale_" + Math.random().toString(36).substr(2, 8);
var coordChartTime = new Coord_1.Coord(); // TODO !!!
var ChartTime = (function (_super) {
    __extends(ChartTime, _super);
    function ChartTime() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = "chartTime";
        return _this;
    }
    ChartTime.injectBtn = function (name, ctor) {
        ChartTime.buttons[name] = ctor;
    };
    ChartTime.prototype.init = function (config) {
        this.settings = util_1.mergeIf({}, config.settings || {}, ChartTime.settings);
        // legend and tooltip
        this.initLegend(util_1.mergeIf({}, config.legend || {}, ChartTime.config.legend));
        this.initTooltip(util_1.mergeIf({}, config.tooltip || {}, ChartTime.config.tooltip));
        // init: dirtyDraw, enableRedraw
        this.dirtyDraw = false;
        this.enableRedraw = config.disableRedraw;
        _super.prototype.init.call(this, config);
        // init scales
        var additionalScales = index_1.updateScales([{
                type: "xscale",
                key: X_SCALE_NANE,
            }, {
                key: "default",
                minValue: 0,
                maxValue: 1,
            }, {}], []);
        // init x scale
        this.xScalesToDraw = [additionalScales[0]];
        // init additional
        this.defaultScale = additionalScales[1];
        this.mirrorScale = additionalScales[2];
        this.series = [];
        // update source, series, y scales
        this.update(config);
    };
    ChartTime.prototype.bindTo = function (bindTo) {
        var dirtyDraw = this.dirtyDraw;
        var enableRedraw = this.enableRedraw;
        this.dirtyDraw = false;
        this.disableRedraw(true);
        _super.prototype.bindTo.call(this, bindTo);
        this.dirtyDraw = dirtyDraw;
        this.disableRedraw(enableRedraw);
    };
    ChartTime.prototype.afterRender = function () {
        this.content = this.container.querySelector(".chart-time-content");
        this.wrapEvent = this.content.querySelector(".chart-time-content-wrap-event");
        this.pointer = this.content.querySelector(".chart-time-line-pointer");
        this.timeLine = this.content.querySelector(".chart-time-line-time");
        this.canvas = this.content.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.legend.bindTo(this.container);
        this.tooltip.setTarget(this.wrapEvent);
        // events
        this.initEvent();
    };
    ChartTime.prototype.update = function (config) {
        if (!config.source) {
            config.source = {};
        }
        if (!config.series) {
            config.series = [];
        }
        if (!config.scales) {
            config.scales = [];
        }
        // установим смещение в 0, и масштаб 1
        this.offset = 0;
        this.scale = 1;
        this.updateSeries(config.series, this.updateScales(config.scales));
        this.legend.update(this.series);
        this.load(config.source);
    };
    ChartTime.prototype.updateScales = function (scales) {
        var ln = scales.length;
        var conf;
        var scaleDefault = false;
        var hasScales = {};
        if (ln === 0) {
            // если шкалы не заданы, то создадим свою "по умолчанию"
            scaleDefault = true;
            scales = [{ key: "default" }];
        }
        else {
            for (var i = 0; i < ln; ++i) {
                conf = scales[i];
                if (conf.type && conf.type !== "yscale") {
                    conf.type = "yscale";
                    if (PrintWarn_1.isEnablePrintWarn()) {
                        console.warn("\u0423 \u0441\u0435\u0440\u0438\u0438 \u0442\u0438\u043F \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E yscale");
                        console.warn(conf);
                    }
                }
                if (PrintWarn_1.isEnablePrintWarn()) {
                    if (!conf.key) {
                        console.warn("\u0423 \u0448\u043A\u0430\u043B\u044B \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u0437\u0430\u0434\u0430\u043D \u043A\u043B\u044E\u0447 <key>");
                        console.warn(conf);
                        continue;
                    }
                    if (hasScales.hasOwnProperty(conf.key)) {
                        console.warn("\u041D\u0430\u0439\u0434\u0435\u043D\u0430 \u0448\u043A\u0430\u043B\u0430 \u0441 \u043F\u043E\u0432\u0442\u043E\u0440\u044F\u044E\u0449\u0438\u043C\u0441\u044F \u043A\u043B\u044E\u0447\u043E\u043C " + conf.key);
                        console.warn(conf);
                        continue;
                    }
                    hasScales[conf.key] = true;
                }
            }
        }
        this.scales = index_1.updateScales(scales, this.scales);
        return scaleDefault;
    };
    ChartTime.prototype.updateSeries = function (series, scaleDefault) {
        var ln = series.length;
        var conf;
        var gen = 0;
        for (var i = 0; i < ln; ++i) {
            conf = series[i];
            if (!conf.title && PrintWarn_1.isEnablePrintWarn()) {
                conf.title = "auto title " + (++gen);
                console.warn("\u0423 \u0441\u0435\u0440\u0438\u0438 \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u0437\u0430\u0434\u0430\u043D \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A <title>");
                console.warn(conf);
            }
            if (!conf.scale && scaleDefault) {
                conf.scale = "default";
            }
        }
        this.series = index_2.updateSeries(series, this.series);
    };
    ChartTime.prototype.load = function (data) {
        this.eachGroupSeries(this.series, "source", data, this.loadDataToSeries);
        this.legend.load(this.series);
        this.xScalesToDraw[0].updateMinAndMax(this.series.filter(function (s) {
            return s.data;
        }), "minX", "maxX");
        this.rawTime = null;
        this.valTime = null;
        this.tooltip.remove();
        this.needCalculate = true;
        this.redraw();
    };
    ChartTime.prototype.setSize = function (width, height) {
        if (this.container) {
            var oldWidthContent = this.content.style.width ? parseInt(this.content.style.width, 10) : 0;
            var newWidthContent = width - (this.legend.isShow ? this.legend.width : 0);
            if (oldWidthContent !== 0) {
                this.offset *= newWidthContent / oldWidthContent;
            }
            this.content.style.width = newWidthContent + "px";
            this.canvas.setAttribute("width", newWidthContent.toString());
            this.canvas.setAttribute("height", height.toString());
            this.needCalculate = true;
            if (this.width !== width) {
                var ln = this.series.length;
                for (var i = 0; i < ln; ++i) {
                    this.series[i].filterScale = -1;
                }
            }
            var top_1 = this.settings.margin + "px";
            var hgt = (height - (this.settings.margin * 2)) + "px";
            this.pointer.style.top = top_1;
            this.timeLine.style.top = top_1;
            this.pointer.style.height = hgt;
            this.timeLine.style.height = hgt;
        }
        _super.prototype.setSize.call(this, width, height);
        this.redraw();
    };
    ChartTime.prototype.setScale = function (scale) {
        this._setScale(scale);
        this.redraw();
    };
    ChartTime.prototype.setOffset = function (offset) {
        this._setOffset(offset);
        this.redraw();
    };
    ChartTime.prototype.setTimeLine = function (date, isCenter) {
        var sizeBody = this.getSizeBody();
        this._setTimeLine(date);
        if (isCenter && this.valTime) {
            var xScale = this.xScalesToDraw[0];
            var percent = (this.valTime.getTime() - xScale.min) / (xScale.max - xScale.min);
            var bodyWidth = sizeBody[0];
            var offset = (bodyWidth / 2) - (bodyWidth * this.scale * percent);
            this.setOffset(offset);
        }
        else {
            this.updateTimeLine(sizeBody);
        }
    };
    ChartTime.prototype.setSetting = function (setting, value) {
        this.settings[setting] = value;
        this.redraw();
    };
    ChartTime.prototype.disableRedraw = function (disable) {
        this.enableRedraw = disable === false;
        if (this.enableRedraw && this.dirtyDraw) {
            this.redraw();
        }
    };
    ChartTime.prototype.show = function (show) {
        _super.prototype.show.call(this, show);
        if (this.isShow) {
            if (this.dirtyDraw) {
                this.redraw();
            }
        }
        else {
            this.tooltip.remove();
        }
    };
    ChartTime.prototype.destroy = function () {
        this.tooltip.destroy();
        this.tooltip = null;
        this.legend.destroy();
        this.legend = null;
        this.source = null;
        this.series = index_2.updateSeries([], this.series) && null;
        this.scales = index_1.updateScales([], this.scales) && null;
        this.xScalesToDraw = index_1.updateScales([], this.xScalesToDraw) && null;
        this.defaultScale.destroy();
        this.defaultScale = null;
        this.mirrorScale.destroy();
        this.mirrorScale = null;
        this.yScalesToDraw = null;
        this.settings = null;
        this.ctx = null;
        this.canvas = null;
        this.wrapEvent = null;
        this.content = null;
        _super.prototype.destroy.call(this);
    };
    ChartTime.prototype.getSeriesToDraw = function () {
        return this.series.filter(function (s) {
            return s.data && s.show;
        });
    };
    ChartTime.prototype.redraw = function (activeSeries) {
        if (this.container && this.enableRedraw && this.isShow) {
            // console.time("redraw");
            var sizeBody = this.getSizeBody();
            var series = this.getSeriesToDraw().sort(function (s1, s2) {
                return s2.priority - s1.priority;
            });
            if (this.needCalculate) {
                this.updateYScales(series, sizeBody);
                this.recalculate(series, sizeBody);
                this.needCalculate = false;
            }
            // coordChartTime - top const
            coordChartTime.update(this.offset, this.scale, this.settings.margin, sizeBody[0], sizeBody[1]);
            this.updateXScales(coordChartTime, sizeBody);
            this.filter(series, coordChartTime, sizeBody);
            this.updateTimeLine(sizeBody);
            this._redraw(series, coordChartTime, activeSeries);
            // console.timeEnd("redraw");
            this.dirtyDraw = false;
        }
        else {
            this.dirtyDraw = true;
        }
    };
    ChartTime.prototype._redraw = function (series, coord, activeSeries) {
        var sizeCanvas = this.getSizeCanvas();
        this.ctx.font = this.settings.sizeText + "px " + this.settings.font;
        this.crearCanvas(this.ctx, sizeCanvas);
        this.drawGrid(this.ctx, coord, sizeCanvas);
        this.drawSeries(this.ctx, series, coord, activeSeries);
        this.drawScales(this.ctx, coord, activeSeries);
    };
    ChartTime.prototype.crearCanvas = function (ctx, sizeCanvas) {
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.globalAlpha = 1;
        ctx.lineWidth = 1;
        ctx.fillRect(0, 0, sizeCanvas[0], sizeCanvas[1]);
        ctx.stroke();
    };
    ChartTime.prototype.drawGrid = function (ctx, coord, sizeCanvas) {
        var ln;
        var i;
        var a;
        var b;
        var coords;
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.fillStyle = "black";
        ctx.globalAlpha = 0.1;
        a = coord.getTop();
        b = this.xScalesToDraw[0].coord;
        coords = this.xScalesToDraw[0].coords;
        ln = coords.length;
        for (i = 0; i < ln; ++i) {
            ctx.moveTo(coords[i], a);
            ctx.lineTo(coords[i], b);
        }
        a = 0;
        b = sizeCanvas[0];
        coords = this.yScalesToDraw[0].coords;
        ln = coords.length;
        for (i = 0; i < ln; ++i) {
            ctx.moveTo(a, coords[i]);
            ctx.lineTo(b, coords[i]);
        }
        ctx.stroke();
    };
    ChartTime.prototype.drawSeries = function (ctx, series, coord, activeSeries) {
        var ln = series.length;
        var s;
        for (var i = 0; i < ln; ++i) {
            s = series[i];
            this.activeDraw(ctx, coord, s, activeSeries && activeSeries !== s);
        }
    };
    ChartTime.prototype.drawScales = function (ctx, coord, activeSeries) {
        var ln;
        var i;
        for (i = 0, ln = this.xScalesToDraw.length; i < ln; ++i) {
            this.xScalesToDraw[i].draw(ctx, coord);
        }
        var scale;
        for (i = 0, ln = this.yScalesToDraw.length; i < ln; ++i) {
            scale = this.yScalesToDraw[i];
            this.activeDraw(ctx, coord, scale, activeSeries && activeSeries.scale !== scale.key);
        }
    };
    ChartTime.prototype.activeDraw = function (ctx, coord, instance, hypersensitivity) {
        var opacity;
        if (hypersensitivity) {
            opacity = instance.opacity;
            instance.opacity = opacity / this.settings.hypersensitivity;
        }
        instance.draw(ctx, coord);
        if (hypersensitivity) {
            instance.opacity = opacity;
        }
    };
    ChartTime.prototype.findScalesToDrawAndUpdateMinAndMax = function (series) {
        var result = [];
        var scaleName;
        var scale;
        this.eachGroupSeries(series, "scale", group_1.toMap(this.scales, "key"), function (s, map) {
            scaleName = s[0].scale;
            if (map.hasOwnProperty(scaleName)) {
                scale = map[scaleName];
                scale.updateMinAndMax(s, "minY", "maxY");
                result.push(scale);
            }
        });
        if (result.length === 0) {
            this.defaultScale.updateMinAndMax([], "minY", "maxY");
            result.push(this.defaultScale);
        }
        return result;
    };
    ChartTime.prototype.updateYScales = function (series, sizeBody) {
        this.yScalesToDraw = this.findScalesToDrawAndUpdateMinAndMax(series);
        YScale_1.YScale.updateTicks(this.yScalesToDraw, sizeBody, this.settings, this.mirrorScale);
    };
    ChartTime.prototype.updateXScales = function (coord, sizeBody) {
        XScale_1.XScale.updateTicks(this.xScalesToDraw, sizeBody, this.settings, coord);
    };
    ChartTime.prototype.updateTimeLine = function (sizeBody) {
        if (this.settings.useTimeLine && this.valTime) {
            var xScale = this.xScalesToDraw[0];
            var percent = (this.valTime.getTime() - xScale.min) / (xScale.max - xScale.min);
            var bodyWidth = sizeBody[0];
            var x = bodyWidth * this.scale * percent + this.offset;
            if (x >= 0 && x <= bodyWidth) {
                this.timeLine.style.display = "block";
                this.timeLine.style.left = x + "px";
                return;
            }
        }
        this.timeLine.style.display = "none";
    };
    ChartTime.prototype.recalculate = function (series, sizeBody) {
        this.eachGroupSeries(series, "source", this.interpreter(sizeBody), this.calculate);
    };
    ChartTime.prototype.interpreter = function (sizeBody) {
        var result = {};
        var scale;
        scale = this.xScalesToDraw[0];
        result[scale.key] = scale.interpreter(sizeBody[0], false);
        var ln = this.yScalesToDraw.length;
        for (var i = 0; i < ln; ++i) {
            scale = this.yScalesToDraw[i];
            result[scale.key] = scale.interpreter(sizeBody[1], true);
        }
        return result;
    };
    ChartTime.prototype.calculate = function (series, interpritar) {
        var hasPoint = {};
        var accumulate = [];
        var lnI;
        var i;
        var point;
        var s;
        for (i = 0, lnI = series.length; i < lnI; ++i) {
            s = series[i];
            for (var key in s.point) {
                if (!s.point.hasOwnProperty(key)) {
                    continue;
                }
                point = s.point[key];
                point.key = (point.isDate ? X_SCALE_NANE : s.scale) + "_" + point.path;
                if (!hasPoint.hasOwnProperty(point.key)) {
                    hasPoint[point.key] = true;
                    accumulate.push({
                        calc: point.isDate ? interpritar[X_SCALE_NANE] : interpritar[s.scale],
                        point: point,
                    });
                }
            }
        }
        // -----------------
        var data = series[0].data;
        var calc = series[0].calc;
        var itemData;
        var itemCalc;
        var acc;
        var lnJ;
        var j;
        lnI = data.length;
        lnJ = accumulate.length;
        for (i = 0; i < lnI; ++i) {
            itemData = data[i];
            itemCalc = calc[i];
            for (j = 0; j < lnJ; ++j) {
                acc = accumulate[j];
                itemCalc[acc.point.key] = acc.calc(acc.point.accessor(itemData));
            }
        }
    };
    ChartTime.prototype.filter = function (series, coord, sizeBody) {
        var ln = series.length;
        var s;
        for (var i = 0; i < ln; ++i) {
            s = series[i];
            if (Math.abs(s.filterScale - this.scale) > 0.0001) {
                s.filterColander(this.settings.filterQuality, this.scale);
                s.filterScale = this.scale;
            }
            s.filterBetween(coord, sizeBody);
        }
    };
    ChartTime.prototype._setScale = function (scale) {
        var xScale = this.xScalesToDraw[0];
        if (xScale.max === null) {
            this.scale = 1;
            return;
        }
        var bodyWidth = this.getSizeBody()[0];
        var fullX = xScale.max - xScale.min;
        var maxCountTime = 2500; // TODO !!
        // scale * bodyWidth = fullX
        //             100px = msec
        //
        // сколько миллесекунд помещается в 100 пикселей
        //
        //  scale = scale
        //            100px * fullX
        //  msec = -------------------
        //          bodyWidth * scale
        //
        //
        //  msec = maxCountTime
        //            100px * fullX
        // scale = -------------------
        //          bodyWidth * msec
        //
        if ((100 * fullX) / (bodyWidth * scale) < maxCountTime) {
            scale = (100 * fullX) / (bodyWidth * maxCountTime);
        }
        if (scale < 1) {
            scale = 1;
        }
        this.scale = scale;
    };
    ChartTime.prototype._setOffset = function (offset) {
        var bodyWidth = this.getSizeBody()[0];
        if (offset > bodyWidth) {
            offset = bodyWidth;
        }
        if (-offset > this.scale * bodyWidth) {
            offset = -(this.scale * bodyWidth);
        }
        this.offset = offset;
    };
    ChartTime.prototype._setTimeLine = function (date) {
        var xScale = this.xScalesToDraw[0];
        if (date === null || xScale.min === null || xScale.max === null) {
            this.valTime = null;
            return;
        }
        var time = date.getTime();
        if (time < xScale.min) {
            date = new Date(xScale.min);
        }
        if (xScale.max < time) {
            date = new Date(xScale.max);
        }
        this.valTime = date;
    };
    ChartTime.prototype.initEvent = function () {
        var _this = this;
        var isDraged;
        this.dragDrop = new Drag_1.Drag(function (event, width, height) {
            isDraged = true;
            _this.onMove(event, width);
        }, function (event, width, height) {
            if (!isDraged) {
                // time-line
                _this.setTimeLine(_this.rawTime);
                _this.fire("onChangeTimeLine");
            }
        });
        this.cacheEvent.on(this.wrapEvent, {
            mousedown: function (event) {
                isDraged = false;
                _this.dragDrop.start(event, _this.offset, 0);
            },
            dblclick: function () {
                _this.fire("onDblClick");
            },
            wheel: function (event) {
                _this.onWheel(event);
            },
        });
    };
    ChartTime.prototype.onMove = function (event, offset) {
        this.setOffset(offset);
        this.fire("onChangeOffset");
    };
    ChartTime.prototype.onWheel = function (event) {
        event.stopPropagation();
        event.preventDefault();
        var bodyWidth = this.getSizeBody()[0];
        var scaleWidth = bodyWidth * this.scale;
        var scroll = event.deltaY || event.detail || event.wheelDelta;
        this._setScale((scroll > 0) ? (this.scale / 1.4) : (this.scale * 1.4));
        // x
        var x = event.clientX - event.target.getBoundingClientRect().left;
        // на каком участке графика произошло событие масштабирования. с учетом смещения, отступов
        var left = x - this.offset;
        // на каком участке графика произошло событие масштабирования в процентном соотношении
        var percent = left / scaleWidth;
        // ofs - на сколько пикселей нужно сместить график влево
        // т.е. мы берем новую ширину width * scale и вычитам старую ширину scaleWidth
        // получим, на сколько пикселей увеличился\уменьшился наш график
        // например, наш график был 100 пикселй.
        // увеличили его в 1.4 раза и он стал 140 пикселей
        // значит он увеличился на 40 пикселей (140 - 100)
        // далее умножаем на некий "процент смещения". т.е. когда график увеличивается
        // он "пухнет" (толстеет) и в какую сторону ему толстеть? влево или вправо?
        // этот коэффициент (процент) указывает куда графику расширяться. если например
        // percent равен 0.29, то влево он увеличится на 29%, а вправо 100% - 29% = 71% на 71 процент
        // т.е. график расширился на 40 пикселей. а именно
        // слева он вырос на 40 * 0.29 = 11.6 пикселей
        // а справа он вырос на 40 * 0.71 = 28.4 пикселей
        var ofs = (bodyWidth * this.scale - scaleWidth) * percent;
        this._setOffset(this.offset - ofs);
        this.redraw();
        this.fire("onChangeScale");
    };
    ChartTime.prototype.initLegend = function (config) {
        var _this = this;
        var me = this;
        var delayRedraw = util_1.delay(200, function () {
            if (_this.container) {
                _this.redraw();
            }
        });
        config.events = {
            onChangeWidth: function (legend) {
                var enableRedraw = me.enableRedraw;
                me.enableRedraw = false;
                me.setSize(me.width, me.height);
                me.enableRedraw = true;
                me.pointer.style.display = "none";
                me.timeLine.style.display = "none";
                me.fire("onChangeWidthLegend");
                delayRedraw();
            },
            onSelectSeries: function (legend) {
                me.redraw(legend.selected);
            },
            onHideSeries: function (legend) {
                me.needCalculate = true;
                me.redraw();
            },
        };
        this.legend = new Legend_1.Legend(config);
        if (config.buttons) {
            config.buttons.forEach(function (button) {
                button = typeof button === "string" ? { type: button } : button;
                var ctor = ChartTime.buttons[button.type];
                var btn = new ctor(util_1.mergeIf({
                    chartTime: _this,
                    tooltip: config.tooltip,
                }, button));
                _this.legend.addBtn(btn);
            });
        }
    };
    ChartTime.prototype.initTooltip = function (config) {
        var me = this;
        config.events = {
            onCreate: function (tooltip, event) {
                var markup = me.getSeriesToDraw().map(function (series) {
                    return "<tr data-series-id=\"" + series.id + "\">" +
                        "<td>" +
                        "<div" +
                        " class=\"chart-time-tooltip-data-color\"" +
                        " style=\"background-color: " + series.color + ";\"></div>" +
                        series.title +
                        "</td>" +
                        "<td class=\"value\">&nbsp;</td>" +
                        "</tr>";
                }).join("");
                tooltip.update([
                    "<table class=\"chart-time-tooltip-data\">",
                    "<tbody>",
                    "<tr>",
                    "<th colspan=\"2\">",
                    "<span>Время: </span>",
                    "<span class=\"time\"></span>",
                    "</th>",
                    "</tr>",
                    markup,
                    "</tbody>",
                    "</table>",
                ]);
            },
            onMove: function (tooltip, event) {
                var clientRect = me.wrapEvent.getBoundingClientRect();
                var x = event.clientX - clientRect.left;
                var y = event.clientY - clientRect.top;
                var sizeBody = me.getSizeBody();
                var bodyWidth = sizeBody[0];
                var bodyHeight = sizeBody[1];
                var scaleWidth = bodyWidth * me.scale;
                var xScale = me.xScalesToDraw[0];
                var isInside = y >= me.settings.margin && y <= bodyHeight + me.settings.margin;
                var isNotTime = xScale.min === null || xScale.max === null;
                var isUpdate = isInside && !isNotTime;
                var tTip = tooltip.container;
                if (me.settings.usePointerLine) {
                    if (isInside) {
                        me.pointer.style.display = "block";
                        me.pointer.style.left = x + "px";
                    }
                    else {
                        me.pointer.style.display = "none";
                    }
                }
                if (isUpdate) {
                    var trList_1 = tTip.children[0].children[0].children;
                    var fullX = xScale.max - xScale.min;
                    var left = x - me.offset;
                    //                       left * fullX
                    //  date = xScale.min + --------------
                    //                        scaleWidth
                    var date = new Date(xScale.min + left * fullX / scaleWidth);
                    trList_1[0].children[0].children[1].innerHTML = util_1.formatTime(date) + " " + util_1.formatDate(date);
                    // TODO !!
                    coordChartTime.update(me.offset, me.scale, me.settings.margin, sizeBody[0], sizeBody[1]);
                    var tr_1;
                    me.getSeriesToDraw().forEach(function (s, index) {
                        tr_1 = trList_1[index + 1];
                        s.tooltip(tr_1, tr_1.children[1], x, coordChartTime);
                    });
                    // time-line
                    me.rawTime = date;
                }
                else {
                    // time-line
                    me.rawTime = null;
                }
                me.fire("onChangeTooltip");
                return isUpdate;
            },
            onRemove: function (tooltip, event) {
                me.pointer.style.display = "none";
                me.fire("onChangeTooltip");
                // time-line
                me.rawTime = null;
            },
        };
        this.tooltip = new Tooltip_1.Tooltip(config);
    };
    ChartTime.prototype.eachGroupSeries = function (series, type, arg, callback) {
        var group = group_1.toGroup(series, type);
        for (var key in group) {
            if (group.hasOwnProperty(key)) {
                callback(group[key], arg);
            }
        }
    };
    ChartTime.prototype.loadDataToSeries = function (series, source) {
        var i;
        var ln;
        var data = null;
        var calc = null;
        for (i = 0, ln = series.length; i < ln; ++i) {
            if (source.hasOwnProperty(series[i].source)) {
                data = source[series[i].source];
                break;
            }
        }
        if (data !== null) {
            calc = new Array(data.length);
            for (i = 0, ln = data.length; i < ln; ++i) {
                calc[i] = { $index: i };
            }
        }
        for (i = 0, ln = series.length; i < ln; ++i) {
            series[i].load(data, calc);
        }
    };
    ChartTime.prototype.getSizeCanvas = function () {
        return [
            parseInt(this.canvas.getAttribute("width"), 10),
            parseInt(this.canvas.getAttribute("height"), 10),
        ];
    };
    ChartTime.prototype.getSizeBody = function () {
        var size = this.getSizeCanvas();
        size[1] = size[1] - this.settings.margin * 2; // высота икса
        return size;
    };
    ChartTime.config = {
        width: 400,
        height: 300,
        disableRedraw: false,
        legend: {
            buttons: ["damage", "full"],
            tooltip: {
                showDelay: 1000,
                hideDelay: 3000,
                saveDelay: 1000,
            },
        },
        tooltip: {},
    };
    ChartTime.settings = {
        margin: 20,
        sizeText: 10,
        font: "sans-serif",
        colorText: "black",
        minHeightTicks: 30,
        filterQuality: 1,
        hypersensitivity: 5,
        usePointerLine: true,
        useTimeLine: true,
    };
    ChartTime.template = [
        "<div class=\"chart-time\">",
        "<div class=\"chart-time-content\">",
        "<div class=\"chart-time-content-wrap\">",
        "<canvas></canvas>",
        "<div class=\"chart-time-line chart-time-line-pointer\"></div>",
        "<div class=\"chart-time-line chart-time-line-time\" style=\"display: none;\"></div>",
        "</div>",
        "<div class=\"chart-time-content-wrap chart-time-content-wrap-event\"></div>",
        "</div>",
        "</div>",
    ].join("");
    ChartTime.buttons = {};
    return ChartTime;
}(Widget_1.Widget));
exports.ChartTime = ChartTime;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Button_1 = __webpack_require__(5);
var event_1 = __webpack_require__(16);
__webpack_require__(35);
var isHot = false;
var captured = null;
event_1.on(document, {
    click: function () {
        if (captured) {
            if (isHot) {
                isHot = false;
            }
            else {
                captured.showEl(captured.context, false);
                captured = null;
            }
        }
    },
});
var Damage = (function (_super) {
    __extends(Damage, _super);
    function Damage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Damage.prototype.init = function (config) {
        _super.prototype.init.call(this, config);
        this.options = config.options;
    };
    Damage.prototype.afterRender = function () {
        var _this = this;
        _super.prototype.afterRender.call(this);
        this.context = this.container.children[0].children[0];
        this.context.innerHTML = this.options.map(function (option) {
            return _this.getMarkupItem(option);
        }).join("");
        this.select(this.chartTime.settings.filterQuality);
        this.cacheEvent.on(this.context, {
            click: function (event) {
                var target = event.target;
                var damage = parseInt(target.getAttribute("data-damage") || "0", 10);
                if (damage > 0) {
                    _this.select(damage);
                    _this.chartTime.settings.filterQuality = damage;
                    _this.chartTime.series.forEach(function (s) {
                        s.filterScale = -1;
                    });
                    _this.chartTime.redraw();
                    _this.chartTime.fire("onChangeSetting", "filterQuality", _this.chartTime.settings.filterQuality);
                }
            },
        });
        this.cacheEvent.on(this.container, {
            click: function () {
                if (captured && captured.id === _this.id) {
                    _this.showEl(_this.context, false);
                    captured = null;
                }
                else {
                    _this.showEl(_this.context, true);
                    captured = _this;
                    isHot = true;
                }
            },
        });
    };
    Damage.prototype.select = function (damage) {
        var deSelect = this.context.querySelector("." + Damage.classItemSelected);
        var toSelect = this.context.querySelector("div[data-damage=\"" + damage + "\"]");
        if (deSelect) {
            this.removeClass(deSelect, Damage.classItemSelected);
        }
        this.addClass(toSelect, Damage.classItemSelected);
    };
    Damage.prototype.destroy = function () {
        if (captured && captured.id === this.id) {
            captured = null;
        }
        this.context = null;
        this.options = null;
        _super.prototype.destroy.call(this);
    };
    Damage.prototype.getMarkupItem = function (option) {
        var className = Damage.classNameItem;
        className += option.damage === this.chartTime.settings.showBtnQuality ? " " + Damage.classItemSelected : "";
        return [
            "<div",
            " class=\"" + className + "\"",
            " data-damage=\"" + option.damage.toString() + "\">",
            option.text,
            "</div>",
        ].join("");
    };
    Damage.config = {
        title: "Качество фильрации точек",
        options: [{
                text: "Высокое качество",
                damage: 1,
            }, {
                text: "Среднее качество",
                damage: 2,
            }, {
                text: "Низкое качество",
                damage: 4,
            }],
    };
    Damage.icon = [
        "<div class=\"chart-time-icon chart-time-icon-spanner\">",
        "<div class=\"chart-time-icon-spanner-context chart-time-hide\"></div>",
        "</div>",
    ].join("");
    Damage.classNameItem = Button_1.Button.prefixClass + "-icon-spanner-context-item";
    Damage.classItemSelected = Damage.classNameItem + "-selected";
    return Damage;
}(Button_1.Button));
exports.Damage = Damage;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var event = __webpack_require__(16);
var CacheEvent = (function () {
    function CacheEvent() {
        this.cache = [];
    }
    CacheEvent.prototype.on = function (element, listeners) {
        this.cache.push({ element: element, listeners: listeners });
        event.on(element, listeners);
    };
    CacheEvent.prototype.off = function () {
        var ln = this.cache.length;
        var i = 0;
        var cache;
        for (; i < ln; ++i) {
            cache = this.cache[i];
            event.off(cache.element, cache.listeners);
            cache.element = null;
            cache.listeners = null;
        }
        this.cache = [];
    };
    CacheEvent.prototype.pop = function () {
        if (this.cache.length === 0) {
            return;
        }
        var cache = this.cache.pop();
        event.off(cache.element, cache.listeners);
        cache.element = null;
        cache.listeners = null;
    };
    return CacheEvent;
}());
exports.CacheEvent = CacheEvent;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Coord = (function () {
    function Coord() {
    }
    Coord.prototype.set = function (keyX, keyY) {
        this.keyX = keyX;
        this.keyY = keyY;
    };
    Coord.prototype.getX = function (item) {
        return this.offset + item[this.keyX] * this.scale;
    };
    Coord.prototype.getY = function (item) {
        return item[this.keyY] === null ? null : (this.top + item[this.keyY]);
    };
    Coord.prototype.getOffset = function () {
        return this.offset;
    };
    Coord.prototype.getScale = function () {
        return this.scale;
    };
    Coord.prototype.getTop = function () {
        return this.top;
    };
    Coord.prototype.getWidth = function () {
        return this.width;
    };
    Coord.prototype.getHeight = function () {
        return this.height;
    };
    Coord.prototype.update = function (offset, scale, top, width, height) {
        this.offset = offset;
        this.scale = scale;
        this.top = top;
        this.width = width;
        this.height = height;
    };
    Coord.prototype.copyProps = function (coord) {
        coord.update(this.offset, this.scale, this.top, this.width, this.height);
    };
    return Coord;
}());
exports.Coord = Coord;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CacheEvent_1 = __webpack_require__(9);
var cacheEvent = new CacheEvent_1.CacheEvent();
var captured = null;
var moved;
function onMoveEvent(event) {
    // в некоторых браузерах срабатывает событие mousemove даже если мышь
    // не перемещали. делаем хак, если координаты "e.clientX" и "x" оданаковые
    // то флаг isMoved в true не выставляем (как будто move небыло)
    if (moved || event.clientX !== captured.eventX || event.clientY !== captured.eventY) {
        moved = true;
        captured.onMove(event, captured.x + event.clientX - captured.eventX, captured.y + event.clientY - captured.eventY);
    }
}
function onUpEvent(event) {
    if (captured.onFinish) {
        captured.onFinish(event, captured.x + event.clientX - captured.eventX, captured.y + event.clientY - captured.eventY);
    }
    captured.finish();
}
var Drag = (function () {
    function Drag(onMove, onFinish) {
        if (onFinish === void 0) { onFinish = null; }
        this.dragging = false;
        this.onMove = onMove;
        this.onFinish = onFinish;
    }
    Drag.prototype.start = function (event, x, y) {
        if (this.dragging) {
            return;
        }
        this.clearSelection();
        cacheEvent.on(document, {
            mousemove: onMoveEvent,
            mouseup: onUpEvent,
        });
        this.eventX = event.clientX;
        this.eventY = event.clientY;
        this.x = x;
        this.y = y;
        captured = this;
        moved = false;
        this.dragging = true;
    };
    Drag.prototype.finish = function () {
        if (!this.dragging) {
            return;
        }
        captured = null;
        cacheEvent.off();
        this.dragging = false;
    };
    Drag.prototype.destroy = function () {
        this.finish();
        this.onMove = null;
        this.dragging = null;
    };
    Drag.prototype.clearSelection = function () {
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
        else {
            document.selection.empty();
        }
    };
    return Drag;
}());
exports.Drag = Drag;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Widget_1 = __webpack_require__(2);
__webpack_require__(37);
var time = 0;
var Tooltip = (function (_super) {
    __extends(Tooltip, _super);
    function Tooltip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Tooltip.prototype.init = function (config) {
        config.bindTo = null;
        _super.prototype.init.call(this, config);
        this.margin = config.margin;
        this.hideByClick = config.hideByClick;
        this.showDelay = config.showDelay;
        this.hideDelay = config.hideDelay;
        this.saveDelay = config.saveDelay;
        this.showDelayTime = null;
        this.hideDelayTime = null;
        this.blocking = false;
        if (config.target) {
            this.setTarget(config.target);
        }
    };
    Tooltip.prototype.afterRender = function () {
        // empty
    };
    Tooltip.prototype.update = function (html) {
        this.container.innerHTML = html.join("");
    };
    Tooltip.prototype.remove = function () {
        this.removeTooltip(null);
    };
    Tooltip.prototype.setTarget = function (target) {
        var _this = this;
        this.cacheEvent.on(target, {
            mousedown: function (event) {
                if (_this.hideByClick) {
                    _this.blocking = true;
                    _this.onMouseLeave(event);
                }
            },
            mousemove: function (event) {
                if (!_this.blocking) {
                    _this.onMouseMove(event);
                }
            },
            mouseleave: function (event) {
                time = _this.blocking ? 0 : (new Date()).getTime();
                _this.blocking = false;
                _this.onMouseLeave(event);
            },
        });
    };
    Tooltip.prototype.destroy = function () {
        this.onMouseLeave(null);
        _super.prototype.destroy.call(this);
    };
    // -----------------------
    Tooltip.prototype.onMouseMove = function (event) {
        this.lastEvent = event;
        if (this.container) {
            this.moveTooltip(event);
        }
        else {
            this.delayCreateTooltip(event);
        }
    };
    Tooltip.prototype.onMouseLeave = function (event) {
        this.delayCreateTooltipStop();
        this.delayRemoveTooltipStop();
        this.removeTooltip(event);
        this.lastEvent = null;
    };
    // -----------------------
    // отложенный вызов тултипа
    Tooltip.prototype.delayCreateTooltip = function (event) {
        var _this = this;
        if (this.showDelay === 0) {
            this.createTooltip(event);
            return;
        }
        if (this.saveDelay > 0 && (new Date()).getTime() - time <= this.saveDelay) {
            this.createTooltip(event);
            return;
        }
        if (this.showDelayTime === null) {
            this.showDelayTime = setTimeout(function () {
                _this.showDelayTime = null;
                _this.createTooltip(_this.lastEvent);
            }, this.showDelay);
        }
    };
    // остановка отложенного вызова тултипа
    Tooltip.prototype.delayCreateTooltipStop = function () {
        if (this.showDelayTime !== null) {
            clearTimeout(this.showDelayTime);
            this.showDelayTime = null;
        }
    };
    // отложенное закрытие тултипа
    Tooltip.prototype.delayRemoveTooltip = function () {
        var _this = this;
        if (this.hideDelay === 0) {
            return;
        }
        this.hideDelayTime = setTimeout(function () {
            _this.hideDelayTime = null;
            _this.removeTooltip(_this.lastEvent);
            _this.blocking = true;
        }, this.hideDelay);
    };
    // остановка отложенного закрытия тултипа
    Tooltip.prototype.delayRemoveTooltipStop = function () {
        if (this.hideDelayTime !== null) {
            clearTimeout(this.hideDelayTime);
            this.hideDelayTime = null;
        }
    };
    // -----------------------
    Tooltip.prototype.createTooltip = function (event) {
        this.bindTo(document.body);
        this.fire("onCreate", event);
        this.delayRemoveTooltip();
        this.moveTooltip(event);
    };
    Tooltip.prototype.moveTooltip = function (event) {
        this.fire("onMove", event);
        var newCoordinate = this.correction(event.clientX, event.clientY);
        this.container.style.left = newCoordinate.x + "px";
        this.container.style.top = newCoordinate.y + "px";
    };
    Tooltip.prototype.removeTooltip = function (event) {
        if (!this.container) {
            return;
        }
        this.fire("onRemove");
        this.container.parentNode.removeChild(this.container);
        this.container = null;
    };
    // -----------------------
    Tooltip.prototype.correction = function (x, y) {
        var clientRect = this.container.getBoundingClientRect();
        var bodyWidth = document.body.offsetWidth;
        var bodyHeight = document.body.offsetHeight;
        var endX = clientRect.width + x + this.margin;
        var endY = clientRect.height + y + this.margin;
        var needCorrectX = endX > bodyWidth;
        var needCorrectY = endY > bodyHeight;
        if (needCorrectX) {
            if (needCorrectY) {
                return {
                    x: x - clientRect.width - this.margin,
                    y: y - clientRect.height - this.margin,
                };
            }
            else {
                return {
                    x: x - (endX - bodyWidth),
                    y: y + this.margin,
                };
            }
        }
        else {
            if (needCorrectY) {
                return {
                    x: x + this.margin,
                    y: y - (endY - bodyHeight),
                };
            }
            else {
                return {
                    x: x + this.margin,
                    y: y + this.margin,
                };
            }
        }
    };
    Tooltip.config = {
        target: null,
        margin: 15,
        hideByClick: false,
        showDelay: 0,
        hideDelay: 0,
        saveDelay: 0,
    };
    Tooltip.template = "<div class=\"chart-time-tooltip\"></div>";
    return Tooltip;
}(Widget_1.Widget));
exports.Tooltip = Tooltip;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = __webpack_require__(0);
var BaseScale = (function () {
    function BaseScale() {
        this.type = Object.getPrototypeOf(this).constructor.type;
    }
    BaseScale.prototype.update = function (config) {
        this.key = config.key;
        this.color = config.color || "#000000"; // black
        this.opacity = util_1.isNumeric(config.opacity) ? config.opacity : 1;
        this.lineWidth = util_1.isNumeric(config.lineWidth) ? config.lineWidth : 1;
        this.minValue = config.minValue || null;
        this.maxValue = config.maxValue || null;
    };
    BaseScale.prototype.updateMinAndMax = function (series, min, max) {
        var ln = series.length;
        var value;
        var valMin = util_1.MAX_VALUE;
        var valMax = util_1.MIN_VALUE;
        var i;
        var s;
        for (i = 0; i < ln; ++i) {
            s = series[i];
            value = s[min];
            if (util_1.isNumeric(value) && value < valMin) {
                valMin = value;
            }
            value = s[max];
            if (util_1.isNumeric(value) && value > valMax) {
                valMax = value;
            }
        }
        if (this.minValue === null) {
            this.min = valMin === util_1.MAX_VALUE ? null : valMin;
        }
        else {
            this.min = this.minValue;
        }
        if (this.maxValue === null) {
            this.max = valMax === util_1.MIN_VALUE ? null : valMax;
        }
        else {
            this.max = this.maxValue;
        }
    };
    BaseScale.prototype.interpreter = function (size, invert) {
        // расчет
        // (max - min)   = size (100%)
        // (val - min) = x
        //
        //       val - min
        //  x = ----------- * size
        //       max - min
        //
        var _this = this;
        var forCalc = size / (this.max - this.min);
        if (invert) {
            return function (val) {
                return (val === undefined || val === null) ? val : (size - (val - _this.min) * forCalc);
            };
        }
        return function (val) {
            return (val === undefined || val === null) ? val : ((val - _this.min) * forCalc);
        };
    };
    BaseScale.prototype.destroy = function () {
        this.key = null;
    };
    return BaseScale;
}());
exports.BaseScale = BaseScale;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BaseScale_1 = __webpack_require__(13);
var d3_1 = __webpack_require__(3);
var util_1 = __webpack_require__(0);
// 10 сек, 1 мин, 5 мин, 15 мин, 30 мин, 1 час, 3 часа, 6 часов, 1 день, 3 дня, 10 дней
var intervals = [10, 60, 300, 900, 1800, 3600, 10800, 21600, 86400, 259200, 864000];
var bisect = new d3_1.Bisector();
var XScale = (function (_super) {
    __extends(XScale, _super);
    function XScale(config) {
        var _this = _super.call(this) || this;
        _this.update(config);
        return _this;
    }
    XScale.updateTicks = function (scales, sizeBody, settings, coord) {
        // шкала X будет одна
        var scale = scales[0];
        if (scale.min === null || scale.max === null) {
            scale.coord = null;
            scale.labels = null;
            scale.coords = [];
            return;
        }
        var widthBody = sizeBody[0]; // ширина графика
        var heightBody = sizeBody[1]; // высота графика
        scale.coord = heightBody + coord.getTop();
        scale.labels = [];
        scale.coords = [];
        // ширина текста (сколько пикселей занимает надпись). 10 - небольшой отступ взятый с потолка
        util_1.ctxTest.font = settings.sizeText + "px " + settings.font;
        var widthText = util_1.ctxTest.measureText("00:00:00").width + 10;
        // где min это начало времени,
        //   а max это конец времени.
        // тогда max - min = 100%
        var fullX = scale.max - scale.min;
        // ширина графика с учетом масштабирования
        // widthBody - ширина canvas
        // потребуется widthBody пикселей, чтобы нарисовать график полностью
        var widthScale = widthBody * coord.getScale();
        // fullX / 1000 - кол-во секунд в графике (т.е. преобразуем из миллисекунд в секунды)
        // fullX / 1000 / widthScale - количество секунд в одном пикселе
        // partTime - кол-во секунд в ширине текста
        var partTime = fullX / 1000 / widthScale * widthText;
        var index = bisect.left(intervals, partTime);
        // найдем нужный формат. выводить дату или время
        var format = index < 7 ? util_1.formatTime : util_1.formatDate;
        // найдем шаг с которым мы будем идти. (преобразуем обратно в миллисекунды)
        var step = intervals[index] * 1000;
        // узнаем какое время в координате 0
        //   как писалось выше: fullX миллисекунд помещается в widthScale пикселей
        //   значит widthScale пикселей равняется fullX миллисекунд!!
        //   offset - это смещение по оси x и задается в пикселях
        //
        //  widthScale - 1 или fullX (ширина одного графика или fullX)
        //  offset     - time (найдем отношение)
        //
        //            offset
        //  time = ------------ * fullX
        //          widthScale
        //
        // min - time; //время в нулевой координате
        //
        var time = scale.min - fullX * coord.getOffset() / widthScale;
        // округляем наше полученное время. делаем кратным шагу
        time = (Math.ceil(time / step) - 1) * step;
        var x;
        var max = 1000; // чтобы небыло бесконечного цикла (на всякий случай)
        while (--max) {
            time += step;
            // преобразовываем обратно из даты в пиксели
            //   t = time - this.minTime;
            //
            //   fullX - widthScale
            //   t     - x (найдем x)
            //
            //                   t
            //   x = offset + ------- * widthScale
            //                 fullX
            x = coord.getOffset() + ((time - scale.min) * widthScale / fullX);
            // вышли за пределы канваса
            if (widthBody < x) {
                break;
            }
            scale.coords.push(x);
            scale.labels.push(format(new Date(time)));
        }
    };
    XScale.prototype.update = function (config) {
        _super.prototype.update.call(this, config);
    };
    XScale.prototype.draw = function (ctx, coord) {
        if (this.coord === null) {
            return;
        }
        ctx.beginPath();
        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        ctx.textBaseline = "top";
        ctx.moveTo(0, this.coord);
        ctx.lineTo(coord.getWidth() - 1, this.coord);
        var ln = this.coords.length;
        var xCoord;
        for (var i = 0; i < ln; ++i) {
            xCoord = this.coords[i];
            ctx.moveTo(xCoord, this.coord + 1);
            ctx.lineTo(xCoord, this.coord + 5);
            ctx.fillText(this.labels[i], xCoord, this.coord + 4);
        }
        ctx.stroke();
    };
    XScale.type = "xscale";
    return XScale;
}(BaseScale_1.BaseScale));
exports.XScale = XScale;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BaseScale_1 = __webpack_require__(13);
var yLabel_1 = __webpack_require__(26);
var util_1 = __webpack_require__(0);
var YScale = (function (_super) {
    __extends(YScale, _super);
    function YScale(config) {
        var _this = _super.call(this) || this;
        _this.id = (++YScale.id).toString();
        _this.update(config);
        return _this;
    }
    YScale.updateTicks = function (scales, sizeBody, settings, mirror) {
        this.updateLabels(scales, sizeBody, settings);
        this.updateXCoords(scales, sizeBody, settings, mirror);
        this.updateYCoords(scales, sizeBody, settings);
    };
    YScale.updateXCoords = function (scales, sizeBody, settings, mirror) {
        util_1.ctxTest.font = settings.sizeText + "px " + settings.font;
        function sort(scale1, scale2) {
            return scale1.index - scale2.index;
        }
        var groupScalesLeft = scales.filter(function (scale) {
            return !scale.right;
        }).sort(sort);
        var groupScalesRigth = scales.filter(function (scale) {
            return scale.right;
        }).sort(sort);
        if (groupScalesLeft.length === 0) {
            this.setMirrorScale(mirror, groupScalesRigth[0]);
            groupScalesLeft = [mirror];
            scales.push(mirror);
        }
        else {
            if (groupScalesRigth.length === 0) {
                this.setMirrorScale(mirror, groupScalesLeft[0]);
                groupScalesRigth = [mirror];
                scales.push(mirror);
            }
        }
        this.updateGroupXCoords(groupScalesLeft, 1);
        this.updateGroupXCoords(groupScalesRigth, -sizeBody[0] + 1);
    };
    YScale.updateGroupXCoords = function (scales, margin) {
        var ln = scales.length;
        var scale;
        var i = 0;
        var label;
        var index;
        for (; i < ln; ++i) {
            scale = scales[i];
            scale.coord = Math.abs(margin);
            if (scale.title) {
                index = scale.labels.length - 1;
                label = scale.labels[index];
                scale.labels[index] = scale.right ? (scale.title + "  " + label) : (label + "  " + scale.title);
            }
            margin += util_1.ctxTest.measureText(scale.labels[scale.labels.length - 1]).width + 20;
        }
    };
    YScale.updateYCoords = function (scales, sizeBody, settings) {
        var countTicks = scales[0].labels.length;
        var bodyHeight = sizeBody[1];
        var coords = new Array(countTicks);
        var heightTick = bodyHeight / (countTicks - 1);
        var coord = bodyHeight + settings.margin;
        var ln;
        var i;
        for (i = 0, ln = countTicks; i < ln; ++i) {
            coords[i] = coord;
            coord -= heightTick;
        }
        for (i = 0, ln = scales.length; i < ln; ++i) {
            scales[i].coords = coords;
        }
    };
    YScale.updateLabels = function (scales, sizeBody, settings) {
        // минимальное расстояние между рисками
        var minHeightTicks = settings.minHeightTicks;
        // максимально допустимое кол-во рисок
        var maxCount = 50;
        // "сырое" значение кол-ва рисок (будем подбирать оптимальный вариант)
        var rawCount = Math.floor(sizeBody[1] / minHeightTicks);
        if (rawCount > maxCount) {
            rawCount = maxCount;
        }
        else if (rawCount < 2) {
            rawCount = 2;
        }
        yLabel_1.updateLabels(scales, rawCount);
    };
    YScale.setMirrorScale = function (mirror, scale) {
        mirror.key = scale.key;
        mirror.min = scale.min;
        mirror.max = scale.max;
        mirror.title = scale.title;
        mirror.right = !scale.right; // !!! opposite
        mirror.labels = scale.labels.map(function (label) {
            return label;
        });
    };
    YScale.prototype.update = function (config) {
        _super.prototype.update.call(this, config);
        this.right = config.right || false;
        this.title = config.title || null;
        this.index = config.index || 0;
        this.show = config.show !== false;
    };
    YScale.prototype.updateMinAndMax = function (series, min, max) {
        _super.prototype.updateMinAndMax.call(this, series, min, max);
        if (this.min === null) {
            this.min = 0;
            this.max = 1;
        }
        else {
            if (this.min === this.max) {
                if (this.min < 0) {
                    this.max = 0;
                }
                else if (this.min === 0) {
                    this.max = 1;
                }
                else {
                    this.min = 0;
                }
            }
        }
    };
    YScale.prototype.draw = function (ctx, coord) {
        ctx.beginPath();
        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.textAlign = this.right ? "end" : "start";
        ctx.fillStyle = "black";
        ctx.textBaseline = "bottom";
        ctx.moveTo(this.coord, this.coords[0]); // coord.getTop()
        ctx.lineTo(this.coord, this.coords[this.coords.length - 1]);
        var direction = (this.right ? -1 : 1) * 5;
        var ln = this.coords.length;
        var yCoord;
        for (var i = 0; i < ln; ++i) {
            yCoord = this.coords[i];
            ctx.moveTo(this.coord, yCoord);
            ctx.lineTo(this.coord + direction, yCoord);
            ctx.fillText(this.labels[i], this.coord + direction, yCoord - 4);
        }
        ctx.stroke();
    };
    YScale.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.title = null;
        this.id = null;
    };
    YScale.type = "yscale";
    YScale.id = 0;
    return YScale;
}(BaseScale_1.BaseScale));
exports.YScale = YScale;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function _on(element, type, handler) {
    if (type === "wheel") {
        if ("onwheel" in document) {
            // type = "wheel";
        }
        else if ("onmousewheel" in document) {
            type = "mousewheel";
        }
        else {
            type = "MozMousePixelScroll";
        }
    }
    if (element.addEventListener) {
        element.addEventListener(type, handler, false);
    }
    else if (element.attachEvent) {
        element.attachEvent("on" + type, handler);
    }
}
function _off(element, type, handler) {
    if (element.removeEventListener) {
        element.removeEventListener(type, handler, false);
    }
    else if (element.detachEvent) {
        element.detachEvent("on" + type, handler);
    }
}
function wrapEvent(action) {
    return (function each(element, listeners) {
        for (var eventName in listeners) {
            if (listeners.hasOwnProperty(eventName)) {
                action(element, eventName, listeners[eventName]);
            }
        }
    });
}
var on = wrapEvent(_on);
exports.on = on;
var off = wrapEvent(_off);
exports.off = off;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function toGroup(instacnes, key) {
    var result = {};
    var ln = instacnes.length;
    var instacne;
    var name;
    var i;
    for (i = 0; i < ln; ++i) {
        instacne = instacnes[i];
        name = instacne[key];
        if (result.hasOwnProperty(name)) {
            result[name].push(instacne);
        }
        else {
            result[name] = [instacne];
        }
    }
    return result;
}
exports.toGroup = toGroup;
function toMap(instacnes, key) {
    var result = {};
    var ln = instacnes.length;
    var instacne;
    var name;
    var i;
    for (i = 0; i < ln; ++i) {
        instacne = instacnes[i];
        name = instacne[key];
        result[name] = instacne;
    }
    return result;
}
exports.toMap = toMap;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ChartTime_1 = __webpack_require__(7);
var Widget_1 = __webpack_require__(2);
var Damage_1 = __webpack_require__(8);
var Updater_1 = __webpack_require__(4);
var util_1 = __webpack_require__(0);
var ChartGroup = (function (_super) {
    __extends(ChartGroup, _super);
    function ChartGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChartGroup.prototype.init = function (config) {
        var _this = this;
        this.charts = [];
        this.series = {};
        this.grouping = config.grouping !== false;
        this.marginChart = config.marginChart;
        this.indexBtn = null;
        this.config = {
            bindTo: null,
            source: {},
            series: null,
            scales: null,
            width: 300,
            height: 50,
            show: true,
            events: {
                onChangeScale: this.bindEvent("onChangeState"),
                onChangeOffset: this.bindEvent("onChangeState"),
                onChangeWidthLegend: this.bindEvent("onChangeWidthLegend"),
                onChangeTooltip: this.bindEvent("onChangeTooltip"),
                onChangeTimeLine: this.bindEvent("onChangeTimeLine"),
                onChangeSetting: this.bindEvent("onChangeSetting"),
                onDblClick: this.bindEvent("onDblClick"),
            },
            legend: util_1.mergeIf({}, config.legend, ChartGroup.config.legend),
            tooltip: util_1.mergeIf({}, config.tooltip, ChartGroup.config.tooltip),
            settings: util_1.mergeIf({}, config.settings, ChartGroup.config.settings),
            disableRedraw: true,
        };
        if (this.config.legend && this.config.legend.buttons) {
            this.config.legend.buttons = this.config.legend.buttons.map(function (type, index) {
                var info = { type: type };
                if (type === "group") {
                    info.chartGroup = _this;
                    _this.indexBtn = index;
                }
                return info;
            });
        }
        this.updater = new Updater_1.Updater(null, this._createChart.bind(this), this._updateChart.bind(this), this._removeChart.bind(this));
        _super.prototype.init.call(this, config);
        this.disableRedraw(config.disableRedraw);
        this.update(config);
    };
    ChartGroup.prototype.bindTo = function (bindTo) {
        _super.prototype.bindTo.call(this, bindTo);
        this.applyUpdate();
    };
    ChartGroup.prototype.afterRender = function () {
        var _this = this;
        this.charts.forEach(function (chartTime) {
            chartTime.disableRedraw(true);
            chartTime.bindTo(_this.container);
        });
    };
    ChartGroup.prototype.update = function (config) {
        var _this = this;
        if (!config.source) {
            config.source = {};
        }
        if (!config.charts) {
            config.charts = [];
        }
        if (!config.scales) {
            config.scales = [];
        }
        this.charts.forEach(function (chartTime) {
            chartTime.series = _this.series[chartTime.id];
        });
        this.series = {};
        this.defaultScale = ChartTime_1.ChartTime.prototype.updateScales.call(this, config.scales);
        this.charts = this.updater.update(config.charts, this.charts);
        this.load(config.source);
    };
    ChartGroup.prototype.load = function (data) {
        var _this = this;
        this.cleanSource();
        var minTime = util_1.MAX_VALUE;
        var maxTime = util_1.MIN_VALUE;
        var valTime;
        var scale;
        this.charts.forEach(function (chartTime) {
            _this.extendSource(chartTime.id, data);
            chartTime.scale = 1;
            chartTime.offset = 0;
            chartTime.series = _this.series[chartTime.id];
            chartTime.legend.update([]);
            chartTime.load(_this.config.source);
            scale = chartTime.xScalesToDraw[0];
            valTime = scale.min;
            if (valTime !== null && valTime < minTime) {
                minTime = valTime;
            }
            valTime = scale.max;
            if (valTime !== null && valTime > maxTime) {
                maxTime = valTime;
            }
        });
        minTime = minTime === util_1.MAX_VALUE ? null : minTime;
        maxTime = maxTime === util_1.MIN_VALUE ? null : maxTime;
        this.charts.forEach(function (chartTime) {
            scale = chartTime.xScalesToDraw[0];
            scale.min = minTime;
            scale.max = maxTime;
        });
        this.enableGrouping(this.grouping);
    };
    ChartGroup.prototype.setSize = function (width, height) {
        _super.prototype.setSize.call(this, width, height);
        var size = this.findChartSize();
        this.charts.forEach(function (chartTime) {
            if (chartTime.isShow) {
                chartTime.setSize(size[0], size[1]);
            }
        });
    };
    ChartGroup.prototype.setTimeLine = function (date, isCenter) {
        this.charts.forEach(function (chartTime) {
            chartTime.setTimeLine(date, isCenter);
        });
    };
    ChartGroup.prototype.disableRedraw = function (disable) {
        this.enableRedraw = disable === false;
        this.charts.forEach(function (chartTime) {
            chartTime.disableRedraw(disable);
        });
    };
    ChartGroup.prototype.enableGrouping = function (grouping) {
        var _this = this;
        this.grouping = grouping !== false;
        var classExpanded = "chart-time-icon-group-expanded";
        this.charts.forEach(function (chartTime) {
            if (_this.indexBtn !== null) {
                var btn = chartTime.legend.getBtn(_this.indexBtn);
                if (btn.container) {
                    if (_this.grouping) {
                        _this.addClass(btn.container.children[0], classExpanded);
                    }
                    else {
                        _this.removeClass(btn.container.children[0], classExpanded);
                    }
                }
                else {
                    if (_this.grouping) {
                        btn.className = _this.grouping ? classExpanded : null;
                    }
                }
            }
        });
        var instance = this.charts[0] || null;
        if (instance) {
            var series_1;
            if (this.grouping) {
                this.charts.forEach(function (chartTime) {
                    series_1 = _this.series[chartTime.id];
                    chartTime.series = series_1;
                    chartTime.legend.update(series_1);
                    chartTime.legend.load(series_1);
                });
            }
            else {
                series_1 = [];
                this.charts.forEach(function (chartTime) {
                    series_1 = series_1.concat(_this.series[chartTime.id]);
                    chartTime.series = [];
                });
                instance.series = series_1;
                instance.legend.update(series_1);
                instance.legend.load(series_1);
            }
        }
        this.applyUpdate(instance && instance.scale, instance && instance.offset);
    };
    ChartGroup.prototype.applyUpdate = function (scale, offset) {
        var _this = this;
        if (scale === void 0) { scale = 1; }
        if (offset === void 0) { offset = 0; }
        var countShow = 0;
        this.charts.forEach(function (chartTime) {
            chartTime.disableRedraw(true);
            if (chartTime.series.some(function (s) {
                return !!s.data;
            })) {
                chartTime.show(true);
                ++countShow;
            }
            else {
                chartTime.show(false);
            }
        });
        if (countShow === 0 && this.charts.length > 0) {
            this.charts[0].show(true);
        }
        var size = this.findChartSize();
        this.charts.forEach(function (chartTime) {
            if (chartTime.isShow) {
                chartTime.scale = scale;
                chartTime.offset = offset;
                chartTime.setSize(size[0], size[1]);
                chartTime.disableRedraw(!_this.enableRedraw);
            }
        });
    };
    ChartGroup.prototype.destroy = function () {
        this.update({});
        this.scales[0].destroy();
        this.scales = null;
        this.config = null;
        this.updater = null;
        this.source = null;
        this.series = null;
        this.events = null;
        _super.prototype.destroy.call(this);
    };
    ChartGroup.prototype.showBtn = function (show, index) {
        this.charts.forEach(function (chartTime) {
            chartTime.legend.showBtn(show, index);
        });
    };
    ChartGroup.prototype.findChartShow = function () {
        var ln = this.charts.length;
        var chartTime;
        for (var i = 0; i < ln; ++i) {
            chartTime = this.charts[i];
            if (chartTime.isShow) {
                return chartTime;
            }
        }
        return null;
    };
    ChartGroup.prototype.bindEvent = function (methodName) {
        var _this = this;
        return function (instance) {
            _this.charts.forEach(function (chartTime) {
                if (instance !== chartTime) {
                    _this[methodName](chartTime, instance);
                }
            });
            if (_this.events.hasOwnProperty(methodName)) {
                _this.events[methodName](_this);
            }
        };
    };
    // events
    ChartGroup.prototype.onChangeState = function (chartTime, instance) {
        chartTime.scale = instance.scale;
        chartTime.offset = instance.offset;
        chartTime.redraw();
    };
    ChartGroup.prototype.onChangeWidthLegend = function (chartTime, instance) {
        chartTime.legend.setWidth(instance.legend.width);
    };
    ChartGroup.prototype.onChangeTooltip = function (chartTime, instance) {
        var selector = "chart-time-line-pointer";
        var line1 = instance.container.querySelector("." + selector);
        var line2 = chartTime.container.querySelector("." + selector);
        line2.style.left = line1.style.left;
        line2.style.display = line1.style.display;
    };
    ChartGroup.prototype.onChangeTimeLine = function (chartTime, instance) {
        chartTime.setTimeLine(instance.valTime);
    };
    ChartGroup.prototype.onChangeSetting = function (chartTime, instance) {
        if (instance.settings.filterQuality === chartTime.settings.filterQuality) {
            return;
        }
        var damage = instance.settings.filterQuality;
        chartTime.settings.filterQuality = damage;
        chartTime.legend.buttons.forEach(function (btn) {
            if (btn instanceof Damage_1.Damage) {
                btn.select(damage);
            }
        });
        chartTime.series.forEach(function (s) {
            s.filterScale = -1;
        });
        chartTime.redraw();
    };
    ChartGroup.prototype.onDblClick = function (chartTime, instance) {
        // empty
    };
    // ------
    ChartGroup.prototype.findChartSize = function () {
        var countShow = 0;
        this.charts.forEach(function (chartTime) {
            if (chartTime.isShow) {
                ++countShow;
            }
        });
        if (countShow === 0) {
            countShow = 1;
        }
        return [
            this.width - 2 * this.marginChart,
            this.height / countShow - 2 * this.marginChart,
        ];
    };
    // ------
    ChartGroup.prototype._createChart = function (config) {
        this.config.series = null;
        this.config.scales = null;
        this.config.bindTo = this.container || null;
        var chartTime = new ChartTime_1.ChartTime(this.config);
        chartTime.scales[0].destroy();
        chartTime.scales = null;
        this.config.bindTo = null;
        if (chartTime.container) {
            chartTime.container.style.margin = this.marginChart + "px";
        }
        this._updateChart(chartTime, config);
        return chartTime;
    };
    ChartGroup.prototype._updateChart = function (chartTime, config) {
        var _this = this;
        chartTime.disableRedraw(true);
        if (!config.series) {
            config.series = [];
        }
        config.series.forEach(function (s) {
            if (!s.modifySource) {
                s.modifySource = true;
                s.source = _this.joinSourceName(config.name, s.source);
            }
        });
        chartTime.id = config.name;
        chartTime.scales = this.scales;
        chartTime.updateSeries(config.series, this.defaultScale);
        this.series[config.name] = chartTime.series;
    };
    ChartGroup.prototype._removeChart = function (chartTime) {
        chartTime.destroy();
    };
    // ------
    ChartGroup.prototype.joinSourceName = function (chartName, sourceName) {
        return chartName + "_%_" + sourceName;
    };
    ChartGroup.prototype.extendSource = function (chartName, source) {
        for (var sourceName in source) {
            if (source.hasOwnProperty(sourceName)) {
                this.config.source[this.joinSourceName(chartName, sourceName)] = source[sourceName];
            }
        }
    };
    ChartGroup.prototype.cleanSource = function () {
        for (var sourceName in this.config.source) {
            if (this.config.source.hasOwnProperty(sourceName)) {
                delete this.config.source[sourceName];
            }
        }
    };
    ChartGroup.config = {
        width: 400,
        height: 300,
        disableRedraw: false,
        grouping: true,
        marginChart: 5,
        legend: {
            minWidth: 105,
            buttons: ["damage", "full", "group"],
        },
        tooltip: {},
        settings: {},
    };
    ChartGroup.template = [
        "<div class=\"chart-time-group\"></div>",
    ].join("");
    return ChartGroup;
}(Widget_1.Widget));
exports.ChartGroup = ChartGroup;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Button_1 = __webpack_require__(5);
__webpack_require__(32);
var Full = (function (_super) {
    __extends(Full, _super);
    function Full() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Full.prototype.afterRender = function () {
        var _this = this;
        _super.prototype.afterRender.call(this);
        this.cacheEvent.on(this.container, {
            click: function () {
                _this.chartTime.scale = 1;
                _this.chartTime.offset = 0;
                _this.chartTime.redraw();
                _this.chartTime.fire("onChangeScale");
            },
        });
    };
    Full.config = {
        title: "Первоначальный вид графика",
    };
    Full.icon = [
        "<div class=\"chart-time-icon chart-time-icon-full\">",
        "<div class=\"chart-time-icon-full-square\"></div>",
        "</div>",
    ].join("");
    return Full;
}(Button_1.Button));
exports.Full = Full;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Button_1 = __webpack_require__(5);
__webpack_require__(33);
var Group = (function (_super) {
    __extends(Group, _super);
    function Group() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Group.prototype.init = function (config) {
        _super.prototype.init.call(this, config);
        this.chartGroup = config.chartGroup;
    };
    Group.prototype.afterRender = function () {
        var _this = this;
        _super.prototype.afterRender.call(this);
        this.cacheEvent.on(this.container, {
            click: function (event) {
                _this.chartGroup.enableGrouping(!_this.chartGroup.grouping);
            },
        });
    };
    Group.prototype.destroy = function () {
        this.chartGroup = null;
        _super.prototype.destroy.call(this);
    };
    Group.config = {
        title: "Вкл/Выкл группировку",
        chartGroup: null,
    };
    Group.icon = "<div class=\"chart-time-icon chart-time-icon-group\"></div>";
    return Group;
}(Button_1.Button));
exports.Group = Group;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ChartTime_1 = __webpack_require__(7);
var ChartGroup_1 = __webpack_require__(18);
var Damage_1 = __webpack_require__(8);
var Full_1 = __webpack_require__(19);
var Group_1 = __webpack_require__(20);
var PrintWarn_1 = __webpack_require__(1);
ChartTime_1.ChartTime.ChartGroup = ChartGroup_1.ChartGroup;
ChartTime_1.ChartTime.injectBtn("damage", Damage_1.Damage);
ChartTime_1.ChartTime.injectBtn("full", Full_1.Full);
ChartTime_1.ChartTime.injectBtn("group", Group_1.Group);
ChartTime_1.ChartTime.warn = {
    isEnable: PrintWarn_1.isEnablePrintWarn,
    setEnable: PrintWarn_1.setEnablePrintWarn,
};
module.exports = ChartTime_1.ChartTime;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PrintWarn_1 = __webpack_require__(1);
var Component = (function () {
    function Component() {
        this.id = (++Component.id).toString(36);
    }
    // TODO
    Component.prototype.self = function () {
        return Object.getPrototypeOf(this).constructor;
    };
    Component.prototype.destroy = function () {
        if (this.id === null) {
            if (PrintWarn_1.isEnablePrintWarn()) {
                console.warn("component destroyed!");
                console.warn(this);
            }
            return;
        }
        this.id = null;
    };
    Component.id = 0;
    return Component;
}());
exports.Component = Component;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Widget_1 = __webpack_require__(2);
var Drag_1 = __webpack_require__(11);
var util_1 = __webpack_require__(0);
__webpack_require__(36);
var Legend = (function (_super) {
    __extends(Legend, _super);
    function Legend() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Legend.prototype.init = function (config) {
        this.dragDrop = new Drag_1.Drag(this.onMove.bind(this));
        this.buttons = [];
        this.selected = null;
        this.minWidth = config.minWidth;
        this.maxWidth = config.maxWidth;
        this.isDraggable = config.draggable;
        _super.prototype.init.call(this, config);
    };
    Legend.prototype.afterRender = function () {
        var _this = this;
        this.content = this.container.querySelector(".chart-time-legend-content");
        this.tool = this.container.querySelector(".chart-time-legend-tool");
        this.drag = this.container.querySelector(".chart-time-legend-drag");
        if (this.buttons) {
            this.buttons.forEach(function (btn) {
                btn.bindTo(_this.tool);
            });
        }
        if (this.markup) {
            this.content.innerHTML = this.markup.join("");
            this.markup = null;
        }
        if (this.series) {
            this.load(this.series);
        }
        this.initEvent();
        this.daggable(this.isDraggable);
    };
    Legend.prototype.update = function (series) {
        var ln = series.length;
        var markup = [];
        for (var i = 0; i < ln; ++i) {
            markup.push(this.getMarkupItem(series[i]));
        }
        if (this.content) {
            this.content.innerHTML = markup.join("");
        }
        else {
            this.markup = markup;
        }
    };
    Legend.prototype.load = function (series) {
        if (this.content) {
            var children = this.content.children;
            var ln = children.length;
            var item = void 0;
            for (var i = 0; i < ln; ++i) {
                item = children[i];
                item.style.display = series[i].data ? "" : "none";
            }
        }
        this.series = series;
    };
    Legend.prototype.setWidth = function (width) {
        var w = this.width;
        this.setSize(width, null);
        if (w !== this.width) {
            this.fire("onChangeWidth", this.width);
        }
    };
    Legend.prototype.setSize = function (width, height) {
        var classSmall = "chart-time-legend-tool-small";
        var hide = false;
        if (width > this.maxWidth) {
            width = this.maxWidth;
        }
        if (width < this.minWidth) {
            hide = true;
            width = 10;
            if (this.isShowAnyBtn()) {
                width += 35;
            }
        }
        if (this.container) {
            this.showEl(this.content, !hide);
            hide ? this.addClass(this.tool, classSmall) : this.removeClass(this.tool, classSmall);
        }
        _super.prototype.setSize.call(this, width, null);
    };
    Legend.prototype.show = function (show) {
        var s = this.isShow;
        _super.prototype.show.call(this, show);
        if (s !== this.isShow) {
            this.fire("onChangeWidth", this.width);
        }
    };
    Legend.prototype.addBtn = function (btn) {
        this.buttons.push(btn);
        if (this.tool) {
            btn.bindTo(this.tool);
        }
    };
    Legend.prototype.getBtn = function (index) {
        return this.buttons[index];
    };
    Legend.prototype.showBtn = function (show, index) {
        show = show !== false;
        if (util_1.isNumeric(index)) {
            this.buttons[index].show(show);
            return;
        }
        var ln = this.buttons.length;
        for (index = 0; index < ln; ++index) {
            this.buttons[index].show(show);
        }
    };
    Legend.prototype.daggable = function (dragable) {
        this.isDraggable = dragable !== false;
        var classDrag = "chart-time-legend-drag-draggable";
        this.isDraggable ? this.addClass(this.drag, classDrag) : this.removeClass(this.drag, classDrag);
    };
    Legend.prototype.destroy = function () {
        this.dragDrop.destroy();
        this.dragDrop = null;
        this.buttons.forEach(function (btn) {
            btn.destroy();
        });
        this.buttons = null;
        this.series = null;
        this.selected = null;
        this.content = null;
        this.tool = null;
        this.drag = null;
        _super.prototype.destroy.call(this);
    };
    Legend.prototype.initEvent = function () {
        this.cacheEvent.on(this.drag, {
            mousedown: this.onStartDrag.bind(this),
        });
        this.cacheEvent.on(this.content, {
            click: this.onHideSeries.bind(this),
            mouseover: this.onSelectSeries.bind(this),
            mouseout: this.onDeselectSeries.bind(this),
        });
    };
    Legend.prototype.onStartDrag = function (event) {
        if (this.isDraggable) {
            this.dragDrop.start(event, -this.width, 0);
        }
    };
    Legend.prototype.onMove = function (event, width, height) {
        this.setWidth(-1 * width);
    };
    Legend.prototype.getMarkupItem = function (s) {
        var hideCls = s.show ? "" : "chart-time-legend-item-off";
        return "<div class=\"chart-time-legend-item " + hideCls + "\" data-key=\"" + s.id + "\">" +
            "<div class=\"chart-time-legend-item-color\"" +
            " style=\"background-color: " + s.color + ";opacity: " + s.opacity + "\">" +
            "&nbsp;</div>" +
            "<span class=\"chart-time-legend-item-text\">" + s.title + "</span>" +
            "</div>";
    };
    Legend.prototype.findDom = function (event, findClass, rootClass) {
        var div = event.target;
        do {
            if (div.classList.contains(findClass)) {
                return div;
            }
            if (div.classList.contains(rootClass)) {
                return null;
            }
            div = div.parentNode;
        } while (div);
        return null;
    };
    Legend.prototype.findSeries = function (div) {
        var id = div.getAttribute("data-key");
        var ln = this.series.length;
        for (var i = 0, s = void 0; i < ln; ++i) {
            s = this.series[i];
            if (s.id === id) {
                return s;
            }
        }
        return null; // !!!
    };
    Legend.prototype.onHideSeries = function (event) {
        var classItem = "chart-time-legend-item";
        var classContent = "chart-time-legend-content";
        var classItemOff = "chart-time-legend-item-off";
        var div = this.findDom(event, classItem, classContent);
        if (div) {
            var s = this.findSeries(div);
            s.show = s.show === false;
            s.show ? this.removeClass(div, classItemOff) : this.addClass(div, classItemOff);
            this.fire("onHideSeries");
        }
    };
    Legend.prototype.onSelectSeries = function (event) {
        var classItem = "chart-time-legend-item";
        var classContent = "chart-time-legend-content";
        var div = this.findDom(event, classItem, classContent);
        var selected = null;
        if (div) {
            var s = this.findSeries(div);
            if (s.show !== false) {
                selected = s;
            }
        }
        this.setSelected(selected);
    };
    Legend.prototype.onDeselectSeries = function (event) {
        this.setSelected(null);
    };
    Legend.prototype.setSelected = function (selected) {
        if (this.selected !== selected) {
            this.selected = selected;
            this.fire("onSelectSeries", selected);
        }
    };
    Legend.prototype.isShowAnyBtn = function () {
        var ln = this.buttons.length;
        for (var i = 0; i < ln; ++i) {
            if (this.buttons[i].isShow) {
                return true;
            }
        }
        return false;
    };
    Legend.config = {
        width: 250,
        minWidth: 80,
        maxWidth: 300,
        draggable: true,
    };
    Legend.template = [
        "<div class=\"chart-time-legend\">",
        "<div class=\"chart-time-legend-drag\"></div>",
        "<div class=\"chart-time-legend-tool\"></div>",
        "<div class=\"chart-time-legend-wrap\">",
        "<div class=\"chart-time-legend-content\"></div>",
        "</div>",
        "</div>",
    ].join("");
    return Legend;
}(Widget_1.Widget));
exports.Legend = Legend;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PrintWarn_1 = __webpack_require__(1);
var Updater_1 = __webpack_require__(4);
var XScale_1 = __webpack_require__(14);
var YScale_1 = __webpack_require__(15);
var map = (_a = {},
    _a[XScale_1.XScale.type] = XScale_1.XScale,
    _a[YScale_1.YScale.type] = YScale_1.YScale,
    _a);
function create(config) {
    var type = config.type || YScale_1.YScale.type;
    if (!map.hasOwnProperty(type)) {
        if (PrintWarn_1.isEnablePrintWarn()) {
            console.warn("Scale not found. type: " + type);
        }
        return null;
    }
    return new map[type](config);
}
exports.create = create;
function update(scale, config) {
    scale.update(config);
}
function destroy(scale) {
    scale.destroy();
}
var updater = new Updater_1.Updater(YScale_1.YScale.type, create, update, destroy);
function updateScales(configs, scales) {
    if (scales === void 0) { scales = []; }
    return updater.update(configs, scales);
}
exports.updateScales = updateScales;
var _a;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var INTEGER = "i";
var FLOAT = "f";
var EXPONENT = "e";
var minValue = 1000000; // 1'000'000
var minValueLn = minValue.toString().length; // 7
var symbol = {
    ".": FLOAT,
    "e": EXPONENT,
    "E": EXPONENT,
    "*": INTEGER,
};
function parseNumber(num) {
    var str = num.toString() + "*"; // * - конец строки
    var minus = str.charAt(0) === "-";
    var length = str.length;
    var zero = true;
    var index = 0;
    var char;
    var type = INTEGER;
    var result = {
        minus: (minus ? "-" : ""),
        i: "",
        e: "",
        f: "",
    };
    if (minus) {
        ++index;
    }
    while (index < length) {
        char = str.charAt(index++);
        if (symbol.hasOwnProperty(char)) {
            if (zero) {
                result[type] = "";
            }
            else {
                zero = true;
            }
            type = symbol[char];
        }
        else {
            if (char !== "0") {
                zero = false;
            }
            result[type] += char;
        }
    }
    return result;
}
// return [factor, exponent]
function findFactor(num) {
    if (num >= minValue && num < minValue * 10) {
        return [1, 0];
    }
    var parsedNumber = parseNumber(num);
    var strValue = parsedNumber[EXPONENT];
    var exponent = strValue === "" ? 0 : parseInt(strValue, 10);
    strValue = parsedNumber[INTEGER];
    if (strValue.length > minValueLn) {
        exponent += strValue.length - minValueLn;
    }
    else {
        exponent -= minValueLn - strValue.length;
    }
    return [Math.pow(10, exponent), exponent];
}
exports.findFactor = findFactor;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var d3_1 = __webpack_require__(3);
var number_1 = __webpack_require__(25);
var util_1 = __webpack_require__(0);
// набор "приятных" для глаз шагов
var niceDel = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 35, 40, 50, 60, 75, 80, 100,
    120, 150, 200, 250, 300, 350, 400, 500];
var bisect = new d3_1.Bisector();
var FACTOR = 10;
var MAX_EXPONENT = 5;
// return [start, finish, step];
function findNiceStep(minValue, maxValue, countSteps) {
    var sub = maxValue - minValue;
    var step = sub / countSteps; // raw step
    var start;
    var finish;
    var factor = 1;
    while (step >= 100) {
        step /= FACTOR;
        factor *= FACTOR;
    }
    var index = bisect.left(niceDel, step);
    do {
        // "приятный шаг"
        step = Math.round(niceDel[index++] * factor);
        // откуда будем начинать шагать. шагать будем снизу
        start = (minValue < 0 ? -1 : 1) * (Math.floor(Math.abs(minValue) / step) + (minValue < 0 ? 1 : 0)) * step;
        // каким числом закончим шаг
        finish = (countSteps * step) + start;
    } while (maxValue > finish);
    return [start, finish, step];
}
function getScaleModifed(scalesStub) {
    return scalesStub.map(function (scaleStub) {
        var factor = number_1.findFactor(scaleStub.max - scaleStub.min);
        var mMin = scaleStub.min / factor[0];
        var mMax = scaleStub.max / factor[0];
        return {
            factor: factor,
            sub: mMax - mMin,
            min: mMin,
            max: mMax,
            rawStep: null,
            step: null,
        };
    });
}
function updateInfo(scalesModifed, rawSteps) {
    var ln = scalesModifed.length;
    var i = 0;
    var scaleModifed;
    var lossPercentSub; // потеря полезного пространства
    var lossPercentSum;
    var lossPercentMin = util_1.MAX_VALUE;
    while (rawSteps > 1) {
        lossPercentSum = 0;
        for (i = 0; i < ln; ++i) {
            scaleModifed = scalesModifed[i];
            scaleModifed.rawStep = findNiceStep(scaleModifed.min, scaleModifed.max, rawSteps);
            lossPercentSub = scaleModifed.rawStep[1] - scaleModifed.rawStep[0];
            lossPercentSum += (lossPercentSub - scaleModifed.sub) / lossPercentSub; // процент "потери пространства"
        }
        // если текущий процент потери меньше предыдущего,
        // то перезапишем и продолжим искать еще более меньший процент
        // если процент больше предыдущего, то остановимся сохраненном варианте
        if (lossPercentSum < lossPercentMin) {
            lossPercentMin = lossPercentSum;
            for (i = 0; i < ln; ++i) {
                scaleModifed = scalesModifed[i];
                scaleModifed.step = scaleModifed.rawStep;
            }
        }
        else {
            break;
        }
        --rawSteps;
    }
    return scalesModifed;
}
function _updateLabels(scalesStub, scalesModifed) {
    var ln = scalesStub.length;
    for (var i = 0; i < ln; ++i) {
        targetUpdate(scalesStub[i], scalesModifed[i]);
    }
}
function targetUpdate(scaleStub, scaleModifed) {
    var start = scaleModifed.step[0];
    var finish = scaleModifed.step[1];
    var step = scaleModifed.step[2];
    var factor = scaleModifed.factor[0];
    var exponent = scaleModifed.factor[1];
    // установим реальное минимальное и максимальное значение
    scaleStub.min = start * factor;
    scaleStub.max = finish * factor;
    // обновим надписи
    var rStep = step;
    var zeros = 0;
    while (rStep % FACTOR === 0) {
        rStep /= FACTOR;
        ++zeros;
    }
    var toFixed = zeros + exponent;
    var expStr = "";
    if (Math.abs(toFixed) > MAX_EXPONENT) {
        expStr = "e" + (toFixed < 0 ? "-" : "+") + (Math.abs(toFixed) + 1);
        factor = Math.pow(FACTOR, zeros + 1);
        toFixed = 1;
    }
    toFixed = toFixed >= 0 ? 0 : Math.abs(toFixed);
    scaleStub.labels = [];
    for (; start <= finish; start += step) {
        scaleStub.labels.push((start < 0 ? "" : " ") + (start * factor).toFixed(toFixed) + expStr);
    }
}
function updateLabels(scalesStub, rawSteps) {
    _updateLabels(scalesStub, updateInfo(getScaleModifed(scalesStub), rawSteps));
}
exports.updateLabels = updateLabels;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = __webpack_require__(0);
var BaseSeries_1 = __webpack_require__(6);
var HLine = (function (_super) {
    __extends(HLine, _super);
    function HLine(config) {
        var _this = _super.call(this) || this;
        _this.priority = 0;
        _this.update(config);
        _this.minX = null;
        _this.maxX = null;
        return _this;
    }
    HLine.prototype.update = function (config) {
        _super.prototype.update.call(this, config);
        this.updatePoint(config, "y", false);
        this.lineWidth = util_1.isNumeric(config.lineWidth) ? config.lineWidth : 1;
        this.tooltipValue = HLine.tooltipValues.hasOwnProperty(config.tooltip) ? config.tooltip : "first";
    };
    HLine.prototype.load = function (data, calc) {
        _super.prototype.load.call(this, data, calc);
        if (data === null) {
            this.minY = null;
            this.maxY = null;
        }
        else {
            var val = void 0;
            var min = util_1.MAX_VALUE;
            var max = util_1.MIN_VALUE;
            for (var i = 0, ln = data.length; i < ln; ++i) {
                val = this.point.y.accessor(data[i]);
                if (util_1.isNumeric(val)) {
                    if (val > max) {
                        max = val;
                    }
                    if (val < min) {
                        min = val;
                    }
                }
            }
            this.minY = min === util_1.MAX_VALUE ? null : min;
            this.maxY = max === util_1.MIN_VALUE ? null : max;
        }
    };
    HLine.prototype.draw = function (ctx, coord) {
        coord.set("", this.point.y.key);
        ctx.globalAlpha = this.opacity;
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.color;
        var start = this.start;
        var finish = this.finish + 1;
        var y;
        var width = coord.getWidth();
        ctx.beginPath();
        for (start; start < finish; ++start) {
            y = coord.getY(this.filter[start]);
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
        }
        ctx.stroke();
    };
    HLine.prototype.tooltip = function (row, cell, x, coord) {
        var value = this.findTooltipValue();
        if (value === null) {
            row.style.display = "none";
        }
        else {
            row.style.display = "";
            cell.innerHTML = value.toString();
        }
    };
    HLine.prototype.findTooltipValue = function () {
        return HLine.tooltipValues[this.tooltipValue](this.filter, this.point.y.accessor);
    };
    HLine.tooltipValues = {
        first: function (list, accessor) {
            var value = accessor(list[0]);
            return value === null || value === undefined ? "" : value.toString();
        },
        last: function (list, accessor) {
            var value = accessor(list[list.length - 1]);
            return value === null || value === undefined ? "" : value.toString();
        },
        concat: function (list, accessor) {
            var values = [];
            list.forEach(function (item) {
                var value = accessor(item);
                if (value !== null && value !== undefined) {
                    values.push(value);
                }
            });
            return values.join(", ");
        },
    };
    HLine.type = "hline";
    return HLine;
}(BaseSeries_1.BaseSeries));
exports.HLine = HLine;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var d3_1 = __webpack_require__(3);
var util_1 = __webpack_require__(0);
var BaseSeries_1 = __webpack_require__(6);
var bisect = new d3_1.Bisector();
var Line = (function (_super) {
    __extends(Line, _super);
    function Line(config) {
        var _this = _super.call(this) || this;
        _this.update(config);
        return _this;
    }
    Line.prototype.update = function (config) {
        _super.prototype.update.call(this, config);
        this.updatePoint(config, "x", true);
        this.updatePoint(config, "y", false);
        this.lineWidth = util_1.isNumeric(config.lineWidth) ? config.lineWidth : 1;
        this.fill = config.fill || false;
        this.stair = config.stair || false;
        if (this.fill) {
            this.priority = 2;
        }
        else {
            this.priority = 1;
        }
    };
    Line.prototype.load = function (data, calc) {
        _super.prototype.load.call(this, data, calc);
        if (data === null) {
            this.minX = null;
            this.minY = null;
            this.maxX = null;
            this.maxY = null;
        }
        else {
            var val = void 0;
            var min = util_1.MAX_VALUE;
            var max = util_1.MIN_VALUE;
            for (var i = 0, ln = data.length; i < ln; ++i) {
                val = this.point.y.accessor(data[i]);
                if (util_1.isNumeric(val)) {
                    if (val > max) {
                        max = val;
                    }
                    if (val < min) {
                        min = val;
                    }
                }
            }
            this.minY = min === util_1.MAX_VALUE ? null : min;
            this.maxY = max === util_1.MIN_VALUE ? null : max;
            this.minX = this.findValue("x", 0, 1);
            this.maxX = this.findValue("x", data.length - 1, -1);
        }
    };
    Line.prototype.filterColander = function (quality, scale) {
        if (quality === 0) {
            _super.prototype.filterColander.call(this, quality, scale);
            return;
        }
        var filter = [];
        var calc = this.calc;
        var keyX = this.point.x.key;
        var keyY = this.point.y.key;
        var min = null;
        var max = null;
        var last = null;
        var item;
        var xValue = 0;
        var yValue = 0;
        var minValue;
        var maxValue;
        var firstX = util_1.MIN_VALUE;
        var ln = calc.length;
        var i = 0;
        for (; i < ln; ++i) {
            item = calc[i];
            xValue = item[keyX];
            yValue = item[keyY];
            if (xValue === undefined || yValue === undefined) {
                continue;
            }
            if (yValue === null || xValue * scale - firstX > quality) {
                if (min) {
                    filter.push(min);
                    min = null;
                }
                if (max) {
                    filter.push(max);
                    max = null;
                }
                if (last) {
                    filter.push(last);
                    last = null;
                }
                filter.push(item);
                if (yValue === null) {
                    for (++i; i < ln; ++i) {
                        item = calc[i];
                        xValue = item[keyX];
                        yValue = item[keyY];
                        if (xValue !== undefined && yValue !== undefined && yValue !== null) {
                            filter.push(item);
                            break;
                        }
                    }
                }
                firstX = Math.floor(xValue * scale);
                minValue = yValue;
                maxValue = yValue;
            }
            else {
                if (yValue < minValue) {
                    minValue = yValue;
                    min = item;
                    last = null;
                }
                else {
                    if (yValue > maxValue) {
                        maxValue = yValue;
                        max = item;
                        last = null;
                    }
                    else {
                        last = item;
                    }
                }
            }
        }
        if (min) {
            filter.push(min);
        }
        if (max) {
            filter.push(max);
        }
        if (last) {
            filter.push(last);
        }
        this.filter = filter;
    };
    Line.prototype.filterBetween = function (coord, sizeBody) {
        coord.set(this.point.x.key, this.point.y.key);
        bisect.accessor = coord.getX.bind(coord);
        var ln = this.filter.length;
        var value;
        // -1 потому что нужно взять один элемент за экраном
        value = bisect.left(this.filter, 0) - 1;
        this.start = value < 0 ? 0 : value;
        //  1 потому что нужно взять один элемент за экраном
        value = bisect.right(this.filter, sizeBody[0]) + 1;
        this.finish = value >= ln ? ln - 1 : value;
    };
    Line.prototype.draw = function (ctx, coord) {
        coord.set(this.point.x.key, this.point.y.key);
        ctx.globalAlpha = this.opacity;
        ctx.lineWidth = this.lineWidth;
        var start = this.start - 1;
        var finish = this.finish + 1;
        var first = null;
        var item;
        var x;
        var y0;
        var y1;
        while (++start < finish) {
            item = this.filter[start];
            y1 = coord.getY(item);
            if (y1 !== null) {
                first = item;
                y0 = y1;
                ctx.beginPath();
                ctx.moveTo(coord.getX(item), y1);
                break;
            }
        }
        for (++start; start < finish; ++start) {
            item = this.filter[start];
            y1 = coord.getY(item);
            if (y1 === null) {
                this.drawEnd(ctx, first, item, coord);
                first = null;
                while (++start < finish) {
                    item = this.filter[start];
                    y1 = coord.getY(item);
                    if (y1 !== null) {
                        first = item;
                        y0 = y1;
                        ctx.beginPath();
                        ctx.moveTo(coord.getX(item), y1);
                        break;
                    }
                }
            }
            else {
                if (this.stair) {
                    x = coord.getX(item);
                    ctx.lineTo(x, y0);
                    ctx.lineTo(x, y1);
                    y0 = y1;
                }
                else {
                    ctx.lineTo(coord.getX(item), y1);
                }
            }
        }
        this.drawEnd(ctx, first, item, coord);
    };
    Line.prototype.tooltip = function (row, cell, x, coord) {
        var value = this.findTooltipValue(x, coord);
        if (value === null) {
            row.style.display = "none";
        }
        else {
            row.style.display = "";
            cell.innerHTML = value.toString();
        }
    };
    Line.prototype.drawEnd = function (ctx, first, last, coord) {
        if (!first) {
            return;
        }
        if (this.fill) {
            var bottom = coord.getHeight() + coord.getTop();
            ctx.lineTo(coord.getX(last), bottom);
            ctx.lineTo(coord.getX(first), bottom);
            ctx.lineTo(coord.getX(first), coord.getY(first));
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        ctx.strokeStyle = this.color;
        ctx.stroke();
    };
    Line.prototype.findTooltipValue = function (x, coord) {
        coord.set(this.point.x.key, "");
        bisect.accessor = coord.getX.bind(coord);
        var indexLeft;
        var indexRight;
        var valueLeft;
        var valueRight;
        var itemLeft;
        var itemRight;
        var xLeft;
        var xRight;
        indexRight = bisect.left(this.filter, x);
        // если x выходит за пределы справа
        if (indexRight >= this.filter.length) {
            return null;
        }
        itemRight = this.filter[indexRight];
        valueRight = this.point.y.accessor(this.data[itemRight.$index]);
        if (valueRight === null) {
            return null;
        }
        xRight = coord.getX(itemRight);
        if (Math.floor(xRight) === x) {
            return valueRight;
        }
        indexLeft = indexRight - 1;
        // если x выходит за пределы слева
        if (indexLeft < 0) {
            return null;
        }
        itemLeft = this.filter[indexLeft];
        valueLeft = this.point.y.accessor(this.data[itemLeft.$index]);
        if (valueLeft === null) {
            return null;
        }
        xLeft = coord.getX(itemLeft);
        return Math.abs(xLeft - x) < Math.abs(xRight - x) ? valueLeft : valueRight;
    };
    Line.type = "line";
    return Line;
}(BaseSeries_1.BaseSeries));
exports.Line = Line;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var d3_1 = __webpack_require__(3);
var Coord_1 = __webpack_require__(10);
var BaseSeries_1 = __webpack_require__(6);
var bisect = new d3_1.Bisector();
var coordFinish = new Coord_1.Coord();
var X_SCALE_NANE = "yscale_" + Math.random().toString(36).substr(2, 8);
var Rect = (function (_super) {
    __extends(Rect, _super);
    function Rect(config) {
        var _this = _super.call(this) || this;
        _this.priority = 3;
        _this.update(config);
        _this.minY = null;
        _this.maxY = null;
        return _this;
    }
    Rect.prototype.update = function (config) {
        _super.prototype.update.call(this, config);
        this.updatePoint(config, "start", true);
        this.updatePoint(config, "finish", true);
        this.scale = X_SCALE_NANE;
    };
    Rect.prototype.load = function (data, calc) {
        _super.prototype.load.call(this, data, calc);
        if (data === null) {
            this.minX = null;
            this.maxX = null;
        }
        else {
            this.minX = this.findValue("start", 0, 1);
            this.maxX = this.findValue("finish", data.length - 1, -1);
        }
    };
    Rect.prototype.filterBetween = function (coord, sizeBody) {
        bisect.accessor = coord.getX.bind(coord);
        var ln = this.filter.length;
        var value;
        coord.set(this.point.finish.key, "");
        this.start = bisect.left(this.filter, 0);
        coord.set(this.point.start.key, "");
        value = bisect.right(this.filter, coord.getWidth());
        this.finish = value >= ln ? ln - 1 : value;
    };
    Rect.prototype.draw = function (ctx, coordStart) {
        coordStart.copyProps(coordFinish); //  TODO !!
        coordStart.set(this.point.start.key, "");
        coordFinish.set(this.point.finish.key, "");
        var start = this.start;
        var finish = this.finish + 1;
        var item;
        var valX1;
        var valX2;
        var top = coordStart.getTop();
        var bottom = coordStart.getHeight();
        ctx.beginPath();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        for (start; start < finish; ++start) {
            item = this.filter[start];
            valX1 = coordStart.getX(item);
            valX2 = coordFinish.getX(item);
            ctx.fillRect(valX1, top, valX2 - valX1, bottom);
        }
        ctx.stroke();
    };
    Rect.prototype.tooltip = function (row, cell, x, coord) {
        var value = this.findTooltipValue(x, coord);
        if (cell.style.display !== "none") {
            cell.style.display = "none";
            row.children[0].setAttribute("colspan", "2");
        }
        row.style.display = value ? "" : "none";
    };
    Rect.prototype.findTooltipValue = function (x, coord) {
        coord.set(this.point.finish.key, "");
        bisect.accessor = coord.getX.bind(coord);
        var index = bisect.left(this.filter, x);
        if (index >= this.filter.length) {
            return false;
        }
        coord.set(this.point.start.key, "");
        return coord.getX(this.filter[index]) <= x;
    };
    Rect.type = "rect";
    return Rect;
}(BaseSeries_1.BaseSeries));
exports.Rect = Rect;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PrintWarn_1 = __webpack_require__(1);
var Updater_1 = __webpack_require__(4);
var HLine_1 = __webpack_require__(27);
var Line_1 = __webpack_require__(28);
var Rect_1 = __webpack_require__(29);
var map = (_a = {},
    _a[Line_1.Line.type] = Line_1.Line,
    _a[Rect_1.Rect.type] = Rect_1.Rect,
    _a[HLine_1.HLine.type] = HLine_1.HLine,
    _a);
// export ???
function create(config) {
    var type = config.type || Line_1.Line.type;
    if (!map.hasOwnProperty(type)) {
        if (PrintWarn_1.isEnablePrintWarn()) {
            console.warn("Series not found. type: " + type);
        }
        return null;
    }
    return new map[type](config);
}
exports.create = create;
function update(series, config) {
    series.update(config);
}
function destroy(series) {
    series.destroy();
}
var updater = new Updater_1.Updater(Line_1.Line.type, create, update, destroy);
function updateSeries(configs, series) {
    if (series === void 0) { series = []; }
    return updater.update(configs, series);
}
exports.updateSeries = updateSeries;
var _a;


/***/ }),
/* 31 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 32 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 33 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 34 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 35 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 36 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 37 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);