var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { logger, logInfo, dateFormat, _encodeStr, _formatExinfoParam, getMainInfo, formatSeed, dealExtra, arrayBufferToBase64, hexToArray } from "../utils/common";
import { request, setStorage } from "../utils/alipay";
import unify from '../utils/unify';
function hashCode(str) {
    if (!str) return 0;
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        var character = str.charCodeAt(i);
        hash = (hash << 5) - hash + character;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash & 0x7fffffff;
}
export var MTR = function () {
    function MTR(config) {
        _classCallCheck(this, MTR);

        this.cfg = {
            pageSeedId: "MINI_MTRACKER_AP_PAGE",
            clkSeedId: "MINI_MTRACKER_AP_CLK",
            calcSeedId: "MINI_MTRACKER_AP_CALC",
            expoSeedId: "MINI_MTRACKER_AP_EXPO",
            syslogSeedId: "MINI_MTRACKER_AP_SYSLOG",
            apiSeedId: "MINI_MTRACKER_AP_API"
        };
        this.data = {};
        this.userId = "";
        this.appVersion = ""; // app version
        this.miniVersion = ""; //mini app version
        this.mtrVer = ""; // Tracker js versions
        this.mtrDebug = false;
        this.mPageState = ""; // m.mPageState,
        this.platformType = "";
        this.bizScenario = ""; //m.bizScenario,
        this.autoStart = true;
        this.autoError = true;
        this.autoClick = true;
        this.eventType = "touchstart";
        this.bizType = "MiniBehavior";
        this.expotTimeout = 300;
        this.servers = [];
        //this.expoType
        this.expoSection = [-0.3, 0.3];
        this.appId = "";
        this.url = null; //p.URL,
        this._ready = false;
        this.sendError = 0;
        this.sendSuccess = 0;
        this.sendCounter = 0;
        this.timezoneOffset = +new Date().getTimezoneOffset();
        this.requestList = [];
        this.batchSendList = []; //stat_batch_send
        this.callList = [];
        this.requestTimestamp = 0;
        this.sendIng = 0;
        this.sn = 0;
        this.visitorList = [];
        this.timezone = 8; //目标时区时间，东八区
        this.sessionId = "";
        this.appName = "";
        this.mPlatformType = "";
        this.deviceModel = "";
        this.location = "";
        this.workspaceId = "";
        this.ref = "";
        this.os = "";
        this.osVersion = "";
        this.networkType = "";
        this.language = "";
        this.screen = {};
        this.cPageUrl = "";
        this.jumpPage = "";
        this.pageJumpTime = 0;
        this.pageLoadTime = 0;
        this.startTime = 0;
        this.pageHideTime = 0;
        this.isCollected = false;
        this.prefix = 'mtr-';
        this.stat_share_app = !1;
        this.stat_pull_down_fresh = !1;
        this.stat_page_scroll = !1;
        this.stat_hide = true;
        this.stat_unload = !1;
        this.stat_reach_bottom = !1;
        this.stat_auto_click = true;
        this.stat_api = true;
        this.stat_api_success = true;
        this.stat_api_long_time = 3000;
        this.stat_api_fail = true;
        this.baseInfo = {};
        this.code = []; //request hook code 码
        this.msg = []; //request hook msg 码
        this.refAction = '';
        this.scene = '-';
        this.referrerAppId = '-';
        this.refActionList = [];
        this.stat_app_launch = false;
        this.stat_app_show = false;
        this.stat_auto_expo = false;
        this.stat_sw = true;
        this.stat_batch_send = false;
        this.batchSendTimerId = 0;
        _extends(this, config);
        console.debug("offset_GMT", this.timezoneOffset);
    }

    _createClass(MTR, [{
        key: "_start",
        value: function _start() {
            this._ready = true;
            logInfo("_start", this._ready, this.callList);
            while (this.callList && this.callList.length) {
                var send = this.callList.shift();
                send && this._remoteLog(send, { batchSend: true, time: 100 });
            }
        }
    }, {
        key: "start",
        value: function start() {
            var _this = this;

            if (typeof this.server === "string") {
                this.servers.push(this.server);
            } else if (Array.isArray(this.server)) {
                this.servers = this.servers.concat(this.server);
            }
            if (!this.baseInfo.sn || typeof this.baseInfo.sn != "number") {
                unify.getStorage({
                    key: "mtr-sn",
                    success: function success(res) {
                        _this.baseInfo.sn = res.data || res.APDataStorage || 0;
                        if (typeof _this.baseInfo.sn != "number") {
                            _this.baseInfo.sn = 0;
                        }
                        logInfo("mtr-sn", _this.baseInfo.sn);
                    },
                    complete: function complete() {}
                });
            }
            if (!this.userId) {
                unify.getStorage({
                    key: "mtr-userId",
                    success: function success(res) {
                        _this.userId = res.data || res.APDataStorage;
                        _this.baseInfo.userId = _this.userId;
                        if (_this._ready) {
                            setStorage("mtr-mdap-data", _this.baseInfo);
                        }
                        logInfo("mtr-userId", _this.userId);
                    },
                    complete: function complete() {
                        _this.autoStart && _this._start();
                    }
                });
            } else {
                this.autoStart && this._start();
            }
        }
    }, {
        key: "batchSend",
        value: function batchSend() {
            if (this.batchSendList.length) {
                var that = this;
                var msg = this.batchSendList /*.map((t)=>encodeURIComponent(t))*/.join('^next=');
                this.batchSendList = [];
                this.servers && this.servers.forEach(function (s) {
                    s.indexOf("https://") > -1 && request(s, msg, that);
                });
            }
        }
    }, {
        key: "_send",
        value: function _send(msg) {
            var _this2 = this;

            var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var that = this;
            if (this.stat_sw && this.servers) {
                // batchSendList:any[] = []//stat_batch_send
                if (this.stat_batch_send && option.batchSend) {
                    this.batchSendList.push(msg);
                    if (this.batchSendTimerId) {
                        clearTimeout(this.batchSendTimerId);
                    }
                    if (option.time === 0) {
                        this.batchSendTimerId = 0;
                        this.batchSend();
                    } else {
                        this.batchSendTimerId = setTimeout(function () {
                            _this2.batchSendTimerId = 0;
                            _this2.batchSend();
                        }, option.time || 2000);
                    }
                } else {
                    this.servers.forEach(function (s) {
                        s.indexOf("https://") > -1 && request(s, msg, that);
                    });
                }
            }
        }
    }, {
        key: "_trueUserId",
        value: function _trueUserId() {
            return this.userId || "VISITOR";
        }
    }, {
        key: "_getSessionId",
        value: function _getSessionId() {
            return this.sessionId;
        }
    }, {
        key: "_getUUid",
        value: function _getUUid() {
            return this.baseInfo.uid;
        }
    }, {
        key: "_formatRemoteParam",
        value: function _formatRemoteParam(msg) {
            var param4 = _extends({}, this.data, { user_id: this._trueUserId(), fullURL: this.url, txSuc: this.sendSuccess, txCnt: this.sendCounter, txErr: this.sendError });
            this.bizType && (param4.bizType = this.bizType);
            this.appVersion && (param4.appVersion = this.appVersion);
            this.appName && (param4.appName = this.appName);
            this.bizScenario && (param4.mBizScenario = this.bizScenario);
            this.mPageState && (param4.mPageState = this.mPageState);
            this.mPlatformType && (param4.mPlatformType = this.mPlatformType);
            this.deviceModel && (param4.deviceModel = this.deviceModel);
            if (this.location) {
                _extends(param4, this.location);
            }
            //this.lauchOpts && (param4.lauchOpts = JSON.stringify(this.lauchOpts))
            msg.param4 ? msg.param4 = _extends(param4, msg.param4) : msg.param4 = param4;
            if ('next' in msg.param4) {
                delete msg.param4.next;
            }
            return msg;
        }
    }, {
        key: "_now",
        value: function _now() {
            var nowDate = new Date().getTime(); // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
            var targetDate = new Date(nowDate + this.timezoneOffset * 60 * 1000 + this.timezone * 60 * 60 * 1000);
            return targetDate;
        }
    }, {
        key: "_getSN",
        value: function _getSN() {
            return this.baseInfo && this.baseInfo.sn++;
        }
    }, {
        key: "traceId",
        value: function traceId() {
            var sn = this.baseInfo && this.baseInfo.sn || 0;
            var traceHashCode = void 0;
            if (!this.traceHashCode && this.userId && this.appId) {
                if (+this.appId && +this.userId) {
                    this.traceHashCode = (+this.appId + +this.userId).toString(16);
                } else {
                    this.traceHashCode = hashCode(this.appId).toString(16) + hashCode(this.userId).toString(16);
                }
            }
            traceHashCode = this.traceHashCode || hashCode(this.appId + this._getUUid()).toString(16);
            traceHashCode = traceHashCode + (+Date.now() - 1600000000000).toString(16) + Math.floor(256 * Math.random()).toString(16) + sn.toString(16);
            traceHashCode = arrayBufferToBase64(hexToArray(traceHashCode)).replace(/=|\+|\/|$/g, "");
            return traceHashCode;
        }
        /*
        *
        *
        # 字段名称
        字段 01	日志头 D-VM
        字段 02	客户端日志时间
        字段 03	客户端 ID
        字段 04	客户端版本
        字段 05	日志版本
        字段 06	终端 ID
        字段 07	会话 ID
        字段 08	用户 ID
        字段 09	行为 ID
        字段 10	行为状态
        字段 11	行为状态消息
        字段 12	子应用 ID
        字段 13	子应用版本
        字段 14	视图 ID
        字段 15	自动化埋点的 contentId
        字段 16	埋点 ID
        字段 17	url
        字段 18	行为类型
        字段 19	日志类型
        字段 20	扩展 1
        字段 21	扩展 2
        字段 22	扩展 3
        字段 23	扩展 4
        字段 24	sourceId营销来源
        字段 25	页面流水号
        字段 26	utdid
        字段 27	ucid 用例编号
        字段 28	索引号
        字段 29	上一个 VIEWID
        字段 30	当前 VIEWID
        字段 31	当前 ACTIONID
        字段 32	当前 ACTIONTOKEN
        字段 33	当前 ACTIONDESC
        字段 34	手机型号
        字段 35	操作系统版本
        字段 36	网络类型
        字段 37	内部版本号
        字段 38	渠道号
        字段 39	语言
        字段 40	hotPatch 版本号
        字段 41	Android: CPU CoreNum
        字段 42	Android: CPU MaxFreq，单位 MHz
        字段 43	Android: TotalMem，单位 MB
        字段 44	基础额外字段
        字段 45	UserSessionId
        字段 46	分辨率
        *
        * */

    }, {
        key: "_packFinalData",
        value: function _packFinalData(data) {
            data.param4 = _extends({
                mtrVer: this.mtrVer || "-",
                mtrSeed: data.param2 || "",
                mtrValue: data.param3 || ""
            }, data.param4);
            //const type = "MINI";
            if (!this.appId && unify.canIUse("getAppIdSync") && unify.getAppIdSync) {
                this.appId = unify.getAppIdSync().appId || "";
            }
            var sendList = ["D-VM", dateFormat(data.timestamp || this._now()), this.appId + "_MINI-" + (this.workspaceId || "default"), this.miniVersion || "-", "2", "-", this._getSessionId() || "-", this._trueUserId() || "-", data.seedId || "-", "-", "-", "-", "-", "-", "-", data.seedId || "-", _encodeStr(this.url || "-"), this.bizType, "c", _encodeStr(data.param1 || "-"), data.param2 || "", data.param3 || "", _formatExinfoParam(data.param4) || "-", this.bizScenario || "-", data.sn || this._getSN() || "-", this._getUUid() || "-", "-", "-", _encodeStr(this.ref || "-"), _encodeStr(this.url || "-"), "-", "-", "-", this.os || "-", this.osVersion || "-", this.networkType || "-", "-", "-", this.language || "-", "-", "-", "-", "-", "-", "-", this.screen && this.screen.width + "x" + this.screen.height || "-", "-", "-"];
            return this.mtrDebug && console.log(sendList), sendList.join();
        }
    }, {
        key: "_remoteLog",
        value: function _remoteLog(msg) {
            var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var sn = msg.sn || this._getSN();
            msg.sn = sn;
            if (this._ready) {
                this._formatRemoteParam(msg);
                var r = this._packFinalData(msg);
                this._send(r, option);
                if (this._trueUserId() === "VISITOR") {
                    this.visitorList.push(r);
                }
                this.mtrDebug && logger("_remoteLog _send");
            } else {
                this.callList.push(msg);
                this.mtrDebug && logger("_remoteLog push");
            }
            return sn;
        }
    }, {
        key: "getUserId",
        value: function getUserId() {
            return this._trueUserId();
        }
    }, {
        key: "setUserId",
        value: function setUserId(userId) {
            var resend = this._trueUserId() === "VISITOR" && userId !== this.userId && this.visitorList.length;
            this.userId = userId;
            this.baseInfo.userId = userId;
            if (this._ready) {
                setStorage("mtr-mdap-data", this.baseInfo);
            } //  mtr-userId
            if (resend) {
                while (this.visitorList && this.visitorList.length) {
                    var send = this.visitorList.shift();
                    send = send && send.replace("VISITOR", this.userId).replace("VISITOR", this.userId);
                    send && this._send(send, { batchSend: true, time: 0 });
                }
                this.mtrDebug && logInfo("VISITOR resended");
            }
        }
    }, {
        key: "logJump",
        value: function logJump(currentPage, to) {
            var param = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            if (this.jumpPage && this.jumpPage === currentPage) {
                return;
            }
            this.mtrDebug && logger("logJump");
            //Mtr.st app init
            //this.ld page onShow
            //this.hd  page hide
            //this.jo  page jump
            //h5  this.ol || this.dr
            var jo = this.pageLoadTime || this.startTime;
            var now = +Date.now();
            var t0 = now - jo;
            this.pageJumpTime = now;
            var param4 = param;
            if (currentPage && to && currentPage != to) {
                to = to || "-";
                param4 = param4 || {};
                _extends(param4, {
                    currentPage: currentPage,
                    nextPage: to,
                    action: "page_jump"
                });
                this.calc(currentPage, "PAGE_JUMP", t0, param4, true);
            }
            this.jumpPage = currentPage;
        }
        /*
        onPageHide(currentPage:string) {
          this.pageHide(currentPage, { action: "page_hide" });
        }
            onPageUnload(currentPage:string) {
          this.pageHide(currentPage, { action: "page_unload" });
        }
        */

    }, {
        key: "onAppHide",
        value: function onAppHide() {
            var t0 = +Date.now() - this.startTime;
            this.calc(null, "APP_HIDE", t0, {
                referrerAppId: this.referrerAppId, onLaunchOption: JSON.stringify(this.onLaunchOption),
                scene: this.scene /*isCollected: this.isCollected */
            }, true);
            //setStorage("mtr-sn", this.sn);
            if (this.batchSendTimerId) {
                clearTimeout(this.batchSendTimerId);
            }
            this.batchSend();
            setStorage("mtr-mdap-data", this.baseInfo);
        }
    }, {
        key: "onAppError",
        value: function onAppError(err) {
            this.err("APP_ERROR", err);
        }
        /*
        pageHide(currentPage:string, p4:any={}) {
          this.mtrDebug && logger("pageHide");
          var jo = this.ld || this.st;
          var now = Date.now();
          var t0 = now - jo;
          this.hd = now;
          if (!this.jo) {
            p4 = p4 || {};
            Object.assign(p4, {
              currentPage: currentPage
            });
            this.calc(currentPage, "PAGE_STAY", t0, p4,true);
          }
        }*/

    }, {
        key: "pagePv",
        value: function pagePv(t) {
            var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            this.mtrDebug && logger("pagePv", this.cPageUrl);
            var currentPageUrl = t || getMainInfo().url;
            if (this.cPageUrl && this.cPageUrl !== currentPageUrl) {
                this.logJump(this.cPageUrl, currentPageUrl);
            }
            this.ref = this.cPageUrl;
            this.cPageUrl = currentPageUrl;
            this.url = this.cPageUrl;
            this.pageLoadTime = +Date.now();
            this.pageHideTime = 0;
            this.pageJumpTime = 0;
            var param4 = dealExtra(param);
            if (this.refAction != 'PAGE_LOAD') {
                param4.refAction = this.refAction;
            }
            this.refAction = 'PAGE_LOAD';
            this.refActionList = [];
            return this._remoteLog({
                seedId: this.cfg.pageSeedId,
                param1: this.cPageUrl,
                param2: "PAGE_LOAD",
                param3: "",
                param4: param4
                //param4: t || {}
            });
        }
    }, {
        key: "appEvent",
        value: function appEvent(event) {
            var _this3 = this;

            var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var timestamp = this._now();
            var send = function send() {
                _this3.mtrDebug && logger("appEvent", param);
                var param4 = param;
                param4.refAction = _this3.refAction;
                _this3.refAction = event;
                return _this3._remoteLog({
                    timestamp: timestamp,
                    seedId: _this3.cfg.clkSeedId,
                    param1: "",
                    param2: event,
                    param3: "",
                    param4: param4
                }, { batchSend: true });
            };
            if (this.userId) {
                send();
            } else {
                setTimeout(function () {
                    send();
                }, 2000);
            }
        }
    }, {
        key: "click",
        value: function click(url, seed) {
            var param = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
            var inter = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

            this.mtrDebug && logger("click", seed);
            var myUrl = url || getMainInfo().url;
            this.url = myUrl;
            var param4 = inter ? param : dealExtra(param);
            var param2 = _encodeStr(seed);
            if (this.refActionList.indexOf(param2) != -1) {
                //param4.refAction = "["+this.refAction+"]"
            } else if (this.refAction != param2) {
                param4.refAction = this.refAction;
            }
            var msg = {
                seedId: this.cfg.clkSeedId,
                param1: myUrl,
                param2: param2,
                param3: '',
                param4: param4
            };
            if (param.terminal != undefined && param.terminal) {
                this.refAction = '';
            } else {
                this.refAction = param2;
                this.refActionList.push(this.refAction);
            }
            return this._remoteLog(msg, { batchSend: true, time: 0 });
        }
    }, {
        key: "calc",
        value: function calc(url, r, n) {
            var param = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var inter = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

            this.mtrDebug && logger("calc");
            var myUrl = url || getMainInfo().url;
            this.url = myUrl;
            var param4 = inter ? param : dealExtra(param);
            param4.refAction = this.refAction;
            var a = {
                seedId: this.cfg.calcSeedId,
                param1: myUrl,
                param2: _encodeStr(r),
                param3: n,
                param4: param4
            };
            return this._remoteLog(a, { batchSend: true });
        }
    }, {
        key: "expo",
        value: function expo(url, item, dir, data) {
            this.mtrDebug && logger("expo");
            if (!this.stat_auto_expo) {
                logger("expo disable");
                return -1;
            }
            var myUrl = url || getMainInfo().url;
            this.url = myUrl;
            var param4 = dealExtra(data || {});
            param4.refAction = this.refAction;
            return this._remoteLog({
                seedId: this.cfg.expoSeedId,
                param1: myUrl,
                param2: _encodeStr(item),
                param3: dir,
                param4: param4
            }, { batchSend: true });
        }
    }, {
        key: "log",
        value: function log(r) {
            var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            this.mtrDebug && logger("log");
            var info = getMainInfo();
            this.url = info.url;
            var param2 = formatSeed(r);
            var param4 = _extends({ mtrLogMsg: r }, dealExtra(param));
            param4.refAction = this.refAction;
            unify.reportAnalytics(param2, param4);
            return this._remoteLog({
                seedId: this.cfg.syslogSeedId,
                param1: this.url,
                param2: param2,
                param3: "",
                param4: param4
            }, { batchSend: true });
        }
    }, {
        key: "err",
        value: function err(r, n) {
            var param = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            this.mtrDebug && console.warn("Tracker.err()", r, n);
            var info = getMainInfo();
            this.url = info.url;
            var param2 = formatSeed(n);
            var param4 = _extends({ mtrTag: r, mtrErrMsg: n }, dealExtra(param));
            param4.refAction = this.refAction;
            unify.reportAnalytics(param2, param4);
            return this._remoteLog({
                seedId: "MTRERR_" + this.appId + "_" + r,
                param1: this.url,
                param2: param2,
                param3: '',
                param4: param4
            }, { batchSend: true });
        }
    }, {
        key: "api",
        value: function api(param) {
            var api = param.api,
                success = param.success,
                time = param.time,
                code = param.code,
                msg = param.msg,
                response = param.response,
                bizSuccess = param.bizSuccess;

            this.mtrDebug && logger("api", api, success, time, code, msg);
            var myUrl = getMainInfo().url; //API_NORMAL  API_UNUSUAL API_SLOW API_BIZ_FAIL API_FAIL
            var param2 = bizSuccess ? time > 3000 ? "API_SLOW" : "API_NORMAL" : success ? "API_BIZ_FAIL" : "API_FAIL"; //this.formatSeed(api)    
            unify.reportAnalytics(param2.toLowerCase(), { api: api, success: success, bizSuccess: bizSuccess, time: time, code: code, msg: msg, response: response });
            if (time > this.stat_api_long_time) {
                return this._remoteLog({
                    seedId: this.cfg.apiSeedId,
                    param1: myUrl,
                    param2: param2,
                    param3: time,
                    param4: { api: api, success: success, bizSuccess: bizSuccess, time: time, code: code, msg: msg, response: response, refAction: this.refAction }
                }, { batchSend: true });
            } else return -1;
        }
    }, {
        key: "setData",
        value: function setData(key, value) {
            this.data[key] = value;
        }
    }]);

    return MTR;
}();