var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { logger, logInfo } from "../utils/common";
import CONFIG from "../config";
import { hookGetLocation, hookRequest } from "../utils/alipay";
import { getBasicInfo } from "../utils/alipay";
var actionEventTypes = ["tap", "longpress", "firstAppear", "appear", "submit"];
function actionListener(Mtr, t, e) {
    var mtrDebug = Mtr.mtrDebug;
    mtrDebug && logger("actionListener");
    if (t.trackered) {
        logInfo("actionListener trackered");
        return;
    }
    t.trackered = true;
    var dataset = t.currentTarget.dataset;
    var xpath = (t.id || "") + "#" + e;
    var obj = dataset.obj;
    var name = obj ? obj.seedName || obj.name || obj.icon_name || obj.text || obj.text_content || obj.mid_text_content : undefined;
    var seedName = dataset.seed || dataset.seedName || dataset.title || name || xpath;
    var globalData = {};
    if (dataset.mtrappdata) {
        // @ts-ignore
        var app = getApp();
        app.globalData && Object.keys(app.globalData).forEach(function (key) {
            if (dataset.mtrappdata.indexOf(key) > -1) {
                globalData["app-" + key] = app.globalData[key];
            }
        });
    }
    var pageData = {};
    if (dataset.mtrpagedata && this.data) {
        var data = this.data;
        Object.keys(data).forEach(function (key) {
            if (dataset.mtrpagedata.indexOf(key) > -1) {
                pageData['page-' + key] = data[key];
            }
        });
    }
    if ("tap" === t.type || "longpress" === t.type || "submit" === t.type) {
        mtrDebug && logInfo("Hook click", seedName);
        if (dataset.mtrignore) {
            mtrDebug && logInfo("Hook click mtrignore");
            return;
        }
        //var { url_type, url_path, url_data, url_remark } = obj || {};
        obj = obj || {};
        var _obj = obj,
            spmId = _obj.spmId,
            scm = _obj.scm,
            newChinfo = _obj.newChinfo,
            params = _obj.params;

        if (Mtr.Tracert) {
            if (!spmId) {
                spmId = dataset.spmId;
            }
            if (spmId) {
                var index = dataset.index || 0;
                if (spmId.indexOf("_N") > -1) {
                    spmId = spmId.replace("_N", "_" + index);
                }
                if (spmId.indexOf("${spmAPos}") > -1 && Mtr.Tracert.spmAPos) {
                    spmId = spmId.replace("${spmAPos}", Mtr.Tracert.spmAPos);
                }
                if (spmId.indexOf("${spmBPos}") > -1 && Mtr.Tracert.spmBPos) {
                    spmId = spmId.replace("${spmBPos}", Mtr.Tracert.spmBPos);
                }
            }
            if (!scm) {
                scm = dataset.scm;
            }
            if (scm) {
                if (scm.indexOf("${system}") > -1 && Mtr.Tracert.system) {
                    scm = scm.replace("${system}", Mtr.Tracert.system);
                }
                if (scm.indexOf("${subsystem}") > -1 && Mtr.Tracert.subsystem) {
                    scm = scm.replace("${subsystem}", Mtr.Tracert.subsystem);
                }
                if (scm.indexOf("${traceId}") > -1) {
                    var traceId = Mtr.traceId();
                    scm = scm.replace("${traceId}", traceId);
                }
                if (scm.indexOf("${id}") > -1 && obj.id) {
                    //${sellerId}
                    scm = scm.replace("${id}", obj.id);
                }
                if (scm.indexOf("${sellerId}") > -1 && obj.sellerId) {
                    //${sellerId}
                    scm = scm.replace("${sellerId}", obj.sellerId);
                }
                if (scm.indexOf("${goodsId}") > -1 && obj.goodsId) {
                    //${goodsId}
                    scm = scm.replace("${goodsId}", obj.goodsId);
                }
            }
        }
        Mtr.click(this.route, seedName, _extends({ xpath: xpath }, globalData, pageData, obj, { spmId: spmId,
            scm: scm, index: dataset.index || 0, group: dataset.group || "-" }));
        if (spmId) {
            Mtr.Tracert && Mtr.Tracert.clickContent(spmId, scm || "", newChinfo || "", params || "");
            Mtr.mtrDebug && logInfo("clickContent", spmId, scm);
        }
    } else if ("appear" === t.type || "firstAppear" === t.type) {
        Mtr.mtrDebug && logInfo("Hook expo", seedName);
        if (dataset.mtrignore) {
            mtrDebug && logInfo("Hook expo mtrignore");
            return;
        }
        obj = obj || {};
        var _obj2 = obj,
            _spmId = _obj2.spmId,
            _scm = _obj2.scm,
            _newChinfo = _obj2.newChinfo,
            _params = _obj2.params;

        if (Mtr.Tracert) {
            if (!_spmId) {
                _spmId = dataset.spmId;
            }
            if (_spmId) {
                var _index = dataset.index || 0;
                /**pmAPos:"a1" spmBPos:"b1" */
                if (_spmId.indexOf("_N") > -1) {
                    _spmId = _spmId.replace("_N", "_" + _index);
                }
                if (_spmId.indexOf("${spmAPos}") > -1 && Mtr.Tracert.spmAPos) {
                    _spmId = _spmId.replace("${spmAPos}", Mtr.Tracert.spmAPos);
                }
                if (_spmId.indexOf("${spmBPos}") > -1 && Mtr.Tracert.spmBPos) {
                    _spmId = _spmId.replace("${spmBPos}", Mtr.Tracert.spmBPos);
                }
            }
            if (!_scm) {
                _scm = dataset.scm;
            }
            //a1001.b1001.item.${itemId}.${traceId}
            if (_scm) {
                if (_scm.indexOf("${system}") > -1 && Mtr.Tracert.system) {
                    _scm = _scm.replace("${system}", Mtr.Tracert.system);
                }
                if (_scm.indexOf("${subsystem}") > -1 && Mtr.Tracert.subsystem) {
                    _scm = _scm.replace("${subsystem}", Mtr.Tracert.subsystem);
                }
                if (_scm.indexOf("${traceId}") > -1) {
                    var _traceId = Mtr.traceId();
                    _scm = _scm.replace("${traceId}", _traceId);
                }
                if (_scm.indexOf("${id}") > -1 && obj.id) {
                    //${sellerId}
                    _scm = _scm.replace("${id}", obj.id);
                }
                if (_scm.indexOf("${sellerId}") > -1 && obj.sellerId) {
                    //${sellerId}
                    _scm = _scm.replace("${sellerId}", obj.sellerId);
                }
                if (_scm.indexOf("${goodsId}") > -1 && obj.goodsId) {
                    //${goodsId}
                    _scm = _scm.replace("${goodsId}", obj.goodsId);
                }
            }
        }
        Mtr.expo(this.route, seedName, "-", _extends({ xpath: xpath }, globalData, pageData, obj, { spmId: _spmId,
            scm: _scm, index: dataset.index || 0, group: dataset.group || "-" }));
        if (_spmId) {
            Mtr.Tracert && Mtr.Tracert.expoContent(_spmId, _scm || "", _newChinfo || "", _params || "");
            Mtr.mtrDebug && logInfo("expoContent", _spmId, _scm);
        }
    }
    // ("tap" === t.type || "longpress" === t.type) &&  Mtr.click(t, e)
}
function hookComponent(Mtr, t, e) {
    return function () {
        var i = arguments ? arguments[0] : void 0;
        if (i && i.currentTarget && -1 !== actionEventTypes.indexOf(i.type)) try {
            actionListener.call(this, Mtr, i, t);
        } catch (t) {
            console.error(t);
        }
        return e.apply(this, arguments);
    };
}
function hookPage(Mtr, t, e) {
    return function () {
        var i = arguments ? arguments[0] : void 0;
        if (i && i.currentTarget && -1 !== actionEventTypes.indexOf(i.type)) try {
            actionListener.call(this, Mtr, i, t);
        } catch (t) {
            console.error(t);
        }
        return e.apply(this, arguments);
    };
}
export function Hook(obj, funName, hook) {
    var fun1 = obj[funName];
    obj[funName] = function (data) {
        hook.call(this, data);
        return fun1 && fun1.call(this, data);
    };
}

var TrackerApp = function () {
    function TrackerApp(Mtr) {
        _classCallCheck(this, TrackerApp);

        this.Mtr = Mtr;
    }

    _createClass(TrackerApp, [{
        key: "init",
        value: function init(config) {
            config && _extends(this.Mtr, config);
            console.warn("App.init() 已经不再使用,请删除代码,配置信息请放置 App({ mtrConfig:{ ... }})");
        }
    }, {
        key: "config",
        value: function config(_config) {
            _config && _extends(this.Mtr, _config);
        }
    }, {
        key: "onLaunch",
        value: function onLaunch() {
            var Mtr = this.Mtr;
            return function (option) {
                try {
                    if (option) {
                        var query = option.query,
                            scene = option.scene,
                            referrerInfo = option.referrerInfo;

                        Mtr.scene = scene || '';
                        scene && (scene = CONFIG.scene[scene] || scene);
                        var query_bizScenario = query && (query.bizScenario || query.bz);
                        var extraData_bizScenario = referrerInfo && referrerInfo.extraData && referrerInfo.extraData.bizScenario;
                        var referrerInfo_appId = referrerInfo && referrerInfo.appId;
                        if (!Mtr.bizScenario) {
                            Mtr.bizScenario = query_bizScenario || extraData_bizScenario || referrerInfo_appId || scene;
                        }
                        Mtr.referrerAppId = referrerInfo_appId || '';
                        Mtr.onLaunchOption = option;
                    }
                    getBasicInfo(function (baseInfo) {
                        _extends(Mtr, baseInfo);
                        Mtr.baseInfo = baseInfo;
                        Mtr.start();
                        Mtr.mtrDebug && logInfo("getBasicInfo  init start");
                    });
                } catch (b) {
                    Mtr.mtrDebug && console.error("Mtr", b);
                }
                Mtr.stat_app_launch && Mtr.appEvent("APP_ON_LAUNCH", {
                    option: JSON.stringify(option),
                    tzone: Mtr.timezoneOffset,
                    referrerAppId: Mtr.referrerAppId,
                    scene: Mtr.scene
                });
                Mtr.stat_location && hookGetLocation(Mtr);
                Mtr.stat_api && hookRequest(Mtr);
                Mtr.mtrDebug && logInfo("App onLaunch");
            };
        }
    }, {
        key: "onHide",
        value: function onHide() {
            var Mtr = this.Mtr;
            return function () {
                Mtr.mtrDebug && logInfo("app onHide");
                Mtr.onAppHide();
            };
        }
    }, {
        key: "onError",
        value: function onError() {
            var Mtr = this.Mtr;
            return function (e) {
                try {
                    Mtr.mtrDebug && logInfo("app onError");
                    Mtr.onAppError(e);
                } catch (err) {
                    console.error(err);
                }
            };
        }
    }, {
        key: "onShow",
        value: function onShow() {
            var Mtr = this.Mtr;
            return function (option) {
                try {
                    if (option) {
                        var query = option.query,
                            scene = option.scene,
                            referrerInfo = option.referrerInfo;

                        Mtr.scene = scene || '';
                        scene && (scene = CONFIG.scene[scene] || scene);
                        var query_bizScenario = query && (query.bizScenario || query.bz);
                        var extraData_bizScenario = referrerInfo && referrerInfo.extraData && referrerInfo.extraData.bizScenario;
                        var referrerInfo_appId = referrerInfo && referrerInfo.appId;
                        if (!Mtr.bizScenario) {
                            Mtr.bizScenario = query_bizScenario || extraData_bizScenario || referrerInfo_appId || scene;
                        }
                        Mtr.referrerAppId = referrerInfo_appId || '';
                    }
                } catch (b) {
                    Mtr.mtrDebug && console.error("Mtr", b);
                }
                Mtr.startTime = +Date.now();
                Mtr.stat_app_show && Mtr.appEvent("APP_ON_SHOW", {
                    option: JSON.stringify(option),
                    referrerAppId: Mtr.referrerAppId,
                    scene: Mtr.scene
                });
                Mtr.mtrDebug && logInfo("app onShow", option);
            };
        }
    }]);

    return TrackerApp;
}();

export { TrackerApp };

export var TrackerPage = function () {
    function TrackerPage(Mtr) {
        _classCallCheck(this, TrackerPage);

        this.Mtr = Mtr;
    }

    _createClass(TrackerPage, [{
        key: "init",
        value: function init() {
            console.warn("Page.init() 已经不再使用,请删除代码");
        }
    }, {
        key: "onLoad",
        value: function onLoad() {
            var Mtr = this.Mtr;
            return function (query) {
                Mtr.mtrDebug && logInfo("Page onLoad ", this.route, query);
                if (query && ("bizScenario" in query || "bz" in query)) {
                    var bizScenario = query.bizScenario,
                        bz = query.bz;

                    bizScenario = bizScenario || bz;
                    Mtr.bizScenario = bizScenario;
                }
                this.$mtr_query = query || {};
            };
        }
    }, {
        key: "onShow",
        value: function onShow() {
            var Mtr = this.Mtr;
            return function () {
                Mtr.mtrDebug && logInfo("onShow", this.route);
                this.$mtr_time_show = +Date.now();
                Mtr.pagePv(this.route, this.$mtr_query);
                Mtr.Tracert && Mtr.Tracert.logPv(this.$mtr_query || {});
            };
        }
    }, {
        key: "onPageScroll",
        value: function onPageScroll() {
            var Mtr = this.Mtr;
            return function () {
                Mtr.mtrDebug && logInfo("onPageScroll", this.route);
                Mtr.click(this.route, "PAGE_SCROLL");
            };
        }
    }, {
        key: "onReachBottom",
        value: function onReachBottom() {
            var Mtr = this.Mtr;
            return function () {
                Mtr.mtrDebug && logInfo("onReachBottom", this.route);
                Mtr.click(this.route, "REACH_BOTTOM");
            };
        }
    }, {
        key: "onHide",
        value: function onHide() {
            var Mtr = this.Mtr;
            return function () {
                var now = +Date.now();
                var t0 = now - this.$mtr_time_show;
                Mtr.calc(this.route, "PAGE_STAY", t0, { action: "page_hide" }, true);
                Mtr.mtrDebug && logInfo("onHide", this.route);
                //Mtr.onPageHide(this.route);
            };
        }
    }, {
        key: "onPullDownRefresh",
        value: function onPullDownRefresh() {
            var Mtr = this.Mtr;
            return function () {
                Mtr.mtrDebug && logInfo("onPullDownRefresh ", this.route);
                Mtr.click(this.route, "PULL_DOWN_REFRESH");
            };
        }
    }, {
        key: "onUnload",
        value: function onUnload() {
            var Mtr = this.Mtr;
            return function () {
                Mtr.mtrDebug && logInfo("onUnload", this.route);
                //Mtr.onPageUnload(this.route);
            };
        }
    }, {
        key: "_hook",
        value: function _hook(page) {
            var lifeFunction = ["onShow", "onPageScroll", "onLoad", "onReachBottom", "onHide", "onPullDownRefresh", "onUnload", "setData", "dispatch", "register", "subscribeAction", "subscribe", "watch", "when", "getInstance"];
            if (this.Mtr.stat_auto_click) {
                for (var e in page) {
                    "function" === typeof page[e] && lifeFunction.indexOf(e) === -1 && e.indexOf("$") === -1 && (page[e] = hookPage(this.Mtr, e, page[e]));
                }
            }
            return page;
        }
    }]);

    return TrackerPage;
}();
export var TrackerComponent = function () {
    function TrackerComponent(Mtr) {
        _classCallCheck(this, TrackerComponent);

        this.Mtr = Mtr;
    }

    _createClass(TrackerComponent, [{
        key: "init",
        value: function init() {
            console.warn("Component.init() 已经不再使用,请删除代码");
        }
    }, {
        key: "_hook",
        value: function _hook(c) {
            if (this.Mtr.stat_auto_click) {
                var a = c.methods;
                for (var e in a) {
                    "function" === typeof a[e] && e.indexOf("$") === -1 && (a[e] = hookComponent(this.Mtr, e, a[e]));
                }
            }
            return c;
        }
    }]);

    return TrackerComponent;
}();