import { logger, logInfo, dateFormat, _encodeStr, _formatExinfoParam, getMainInfo, formatSeed, dealExtra,arrayBufferToBase64,hexToArray } from "../utils/common"
import { request, setStorage } from "../utils/alipay"
import { API, RemoteLogType } from "../type"
import { Event } from "../interface"
import unify from '../utils/unify'
function hashCode(str: string) {
  if (!str) return 0
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    let character = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + character;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash & 0x7fffffff;
}
export class MTR implements Event {
  cfg = {
    pageSeedId: "MINI_MTRACKER_AP_PAGE",
    clkSeedId: "MINI_MTRACKER_AP_CLK",
    calcSeedId: "MINI_MTRACKER_AP_CALC",
    expoSeedId: "MINI_MTRACKER_AP_EXPO",
    syslogSeedId: "MINI_MTRACKER_AP_SYSLOG",
    apiSeedId: "MINI_MTRACKER_AP_API"
  }
  data: any = {}
  userId: string = ""
  appVersion: string = "" // app version
  miniVersion: string = "" //mini app version
  mtrVer: string = "" // Tracker js versions
  mtrDebug: boolean = false
  mPageState: string = "" // m.mPageState,
  platformType: string = ""
  bizScenario: string = "" //m.bizScenario,
  autoStart: boolean = true
  autoError: boolean = true
  autoClick: boolean = true
  eventType: string = "touchstart"
  bizType: string = "MiniBehavior"
  expotTimeout: number = 300
  servers: any[] = []
  //this.expoType
  expoSection: any[] = [-0.3, 0.3]
  appId: string = ""
  url: string | null = null; //p.URL,
  _ready: boolean = false
  sendError: number = 0
  sendSuccess: number = 0
  sendCounter: number = 0
  timezoneOffset: number = +new Date().getTimezoneOffset()
  requestList: any[] = []
  batchSendList: any[] = []//stat_batch_send
  callList: any[] = []
  requestTimestamp: number = 0
  sendIng: number = 0
  sn: number = 0
  visitorList: any[] = []
  timezone: number = 8 //目标时区时间，东八区
  onLaunch: any
  sessionId: any = ""
  appName: any = ""
  mPlatformType: any = ""
  deviceModel: any = ""
  location: any = ""
  workspaceId: string = ""
  ref: string = ""
  os: string = ""
  osVersion: string = ""
  networkType: string = ""
  language: string = ""
  screen: any = {

  }
  cPageUrl: string = ""
  jumpPage: string = ""
  pageJumpTime: number = 0
  pageLoadTime: number = 0
  startTime: number = 0
  pageHideTime: number = 0
  isCollected: boolean = false
  prefix: string = 'mtr-'
  stat_share_app: boolean = !1
  stat_pull_down_fresh: boolean = !1
  stat_page_scroll: boolean = !1
  stat_hide: boolean = true
  stat_unload: boolean = !1
  stat_reach_bottom: boolean = !1
  stat_auto_click: boolean = true
  stat_api: boolean = true
  stat_api_success: boolean = true
  stat_api_long_time: number = 3000
  stat_api_fail: boolean = true
  stat_auto_apperr: boolean
  server: any
  baseInfo: any = {}
  code: string[] = []//request hook code 码
  msg: string[] = []//request hook msg 码
  refAction: string = ''
  scene: string = '-'
  referrerAppId: string = '-'
  stat_location: boolean
  refActionList: string[] = []
  stat_app_launch: boolean = false
  stat_app_show: boolean = false
  stat_auto_expo: boolean = false
  stat_sw: boolean = true
  stat_batch_send: boolean = false
  batchSendTimerId: number = 0
  onLaunchOption: any
  Tracert: any
  traceHashCode: string


  constructor(config: any) {
    Object.assign(this, config)
    console.debug("offset_GMT", this.timezoneOffset);
  }

  _start() {
    this._ready = true;
    logInfo("_start", this._ready, this.callList);
    while (this.callList && this.callList.length) {
      var send = this.callList.shift();
      send && this._remoteLog(send, { batchSend: true, time: 100 });
    }
  }

  start() {
    if (typeof this.server === "string") {
      this.servers.push(this.server);
    } else if (Array.isArray(this.server)) {
      this.servers = this.servers.concat(this.server);
    }
    if ((!this.baseInfo.sn) || typeof this.baseInfo.sn != "number") {
      unify.getStorage({
        key: "mtr-sn",
        success: res => {
          this.baseInfo.sn = res.data || res.APDataStorage || 0;
          if (typeof this.baseInfo.sn != "number") {
            this.baseInfo.sn = 0;
          }
          logInfo("mtr-sn", this.baseInfo.sn);
        },
        complete: () => { }
      });
    }

    if (!this.userId) {
      unify.getStorage({
        key: "mtr-userId",
        success: res => {
          this.userId = res.data || res.APDataStorage;
          this.baseInfo.userId = this.userId
          if (this._ready) {
            setStorage("mtr-mdap-data", this.baseInfo);
          }
          logInfo("mtr-userId", this.userId);
        },
        complete: () => {
          this.autoStart && this._start();
        }
      });
    } else {
      this.autoStart && this._start();
    }
  }
  batchSend() {
    if (this.batchSendList.length) {
      let that = this;
      let msg = this.batchSendList/*.map((t)=>encodeURIComponent(t))*/.join('^next=')
      this.batchSendList = []
      this.servers && this.servers.forEach(function (s) {
        (s.indexOf("https://") > -1) && request(s, msg, that);
      })
    }
  }

  _send(msg: any, option: any = {}) {
    let that = this;
    if (this.stat_sw && this.servers) {
      // batchSendList:any[] = []//stat_batch_send
      if (this.stat_batch_send && option.batchSend) {
        this.batchSendList.push(msg)
        if (this.batchSendTimerId) {
          clearTimeout(this.batchSendTimerId)
        }
        if(option.time===0) {
          this.batchSendTimerId = 0
          this.batchSend()
        }else {
          this.batchSendTimerId = setTimeout(() => {
          this.batchSendTimerId = 0
          this.batchSend()
         }, option.time || 2000);
        }      

      } else {
        this.servers.forEach(function (s) {
          (s.indexOf("https://") > -1) && request(s, msg, that);
        })
      }
    }
  }

  _trueUserId() {
    return this.userId || "VISITOR";
  }

  _getSessionId() {
    return this.sessionId;
  }

  _getUUid() {
    return this.baseInfo.uid;
  }

  _formatRemoteParam(msg) {
    var param4: any = {
      ...this.data,
      user_id: this._trueUserId(),
      fullURL: this.url,
      txSuc: this.sendSuccess,
      txCnt: this.sendCounter,
      txErr: this.sendError
    };
    this.bizType && (param4.bizType = this.bizType);
    this.appVersion && (param4.appVersion = this.appVersion);
    this.appName && (param4.appName = this.appName);
    this.bizScenario && (param4.mBizScenario = this.bizScenario);
    this.mPageState && (param4.mPageState = this.mPageState);
    this.mPlatformType && (param4.mPlatformType = this.mPlatformType);
    this.deviceModel && (param4.deviceModel = this.deviceModel);
    if (this.location) {
      Object.assign(param4, this.location)
    }
    //this.lauchOpts && (param4.lauchOpts = JSON.stringify(this.lauchOpts))
    msg.param4 ? (msg.param4 = Object.assign(param4, msg.param4)) : (msg.param4 = param4);
    if ('next' in msg.param4) {
      delete msg.param4.next
    }
    return msg;
  }

  _now() {
    var nowDate = new Date().getTime(); // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
    var targetDate = new Date(
      nowDate + this.timezoneOffset * 60 * 1000 + this.timezone * 60 * 60 * 1000
    );
    return targetDate;
  }
  _getSN() {
    return this.baseInfo && this.baseInfo.sn++;
  }
  traceId() {
    let sn = this.baseInfo && this.baseInfo.sn || 0
    let traceHashCode: string
    if ((!this.traceHashCode) && this.userId && this.appId) {
      if (+this.appId && +this.userId) {
        this.traceHashCode = (+this.appId + +this.userId).toString(16)
      }
      else {
        this.traceHashCode =  hashCode(this.appId).toString(16) + hashCode(this.userId ).toString(16)
      }
    }
    traceHashCode = this.traceHashCode || hashCode(this.appId +this._getUUid()).toString(16)
    traceHashCode =  traceHashCode + (+Date.now()-1600000000000).toString(16) + (Math.floor(256 * Math.random())).toString(16) + sn.toString(16)
    traceHashCode =arrayBufferToBase64(hexToArray(traceHashCode)).replace(/=|\+|\/|$/g, "")
    return traceHashCode
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
  _packFinalData(data: RemoteLogType) {
    data.param4 = Object.assign(
      {
        mtrVer: this.mtrVer || "-",
        mtrSeed: data.param2 || "",
        mtrValue: data.param3 || ""
      },
      data.param4
    );
    //const type = "MINI";
    if (!this.appId && unify.canIUse("getAppIdSync") && unify.getAppIdSync) {
      this.appId = unify.getAppIdSync().appId || ""
    }
    const sendList = [
      "D-VM",
      dateFormat(data.timestamp || this._now()),
      this.appId + "_MINI-" + (this.workspaceId || "default"),
      this.miniVersion || "-",
      "2",
      "-",
      this._getSessionId() || "-",
      this._trueUserId() || "-",
      data.seedId || "-",
      "-",
      "-",
      "-",
      "-",
      "-",
      "-",
      data.seedId || "-",
      _encodeStr(this.url || "-"),
      this.bizType,
      "c",
      _encodeStr(data.param1 || "-"),
      data.param2 || "",
      data.param3 || "",
      _formatExinfoParam(data.param4) || "-",
      this.bizScenario || "-",
      data.sn || this._getSN() || "-",
      this._getUUid() || "-",
      "-",
      "-",
      _encodeStr(this.ref || "-"),
      _encodeStr(this.url || "-"),
      "-",
      "-",
      "-",
      this.os || "-",
      this.osVersion || "-",
      this.networkType || "-",
      "-",
      "-",
      this.language || "-",
      "-",
      "-",
      "-",
      "-",
      "-",
      "-",
      (this.screen && this.screen.width + "x" + this.screen.height) || "-",
      "-",
      "-"
    ];
    return this.mtrDebug && console.log(sendList), sendList.join();
  }

  _remoteLog(msg: RemoteLogType, option: any = {}) {
    let sn = msg.sn || this._getSN()
    msg.sn = sn
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
    return sn
  }

  getUserId(): string {
    return this._trueUserId()
  }
  setUserId(userId: string) {
    let resend =
      this._trueUserId() === "VISITOR" &&
      userId !== this.userId &&
      this.visitorList.length;
    this.userId = userId;
    this.baseInfo.userId = userId
    if (this._ready) { setStorage("mtr-mdap-data", this.baseInfo); }//  mtr-userId
    if (resend) {
      while (this.visitorList && this.visitorList.length) {
        let send = this.visitorList.shift();
        send =
          send &&
          send.replace("VISITOR", this.userId).replace("VISITOR", this.userId);
        send && this._send(send, { batchSend: true ,time:0});
      }
      this.mtrDebug && logInfo("VISITOR resended");
    }
  }


  logJump(currentPage: string, to: string, param: any = {}) {
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
    let param4 = param;
    if (currentPage && to && currentPage != to) {
      to = to || "-";
      param4 = param4 || {};
      Object.assign(param4, {
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
  onAppHide() {
    let t0 = (+Date.now()) - this.startTime;
    this.calc(null, "APP_HIDE", t0, {
      referrerAppId: this.referrerAppId, onLaunchOption: JSON.stringify(this.onLaunchOption),
      scene: this.scene /*isCollected: this.isCollected */
    }, true);
    //setStorage("mtr-sn", this.sn);
    if (this.batchSendTimerId) {
      clearTimeout(this.batchSendTimerId)
    }
    this.batchSend()
    setStorage("mtr-mdap-data", this.baseInfo);
  }

  onAppError(err: any) {
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


  pagePv(t: string, param: any = {}) {
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
    let param4 = dealExtra(param);
    if (this.refAction != 'PAGE_LOAD') { (param4.refAction = this.refAction) }
    this.refAction = 'PAGE_LOAD'
    this.refActionList = []
    return this._remoteLog({
      seedId: this.cfg.pageSeedId,
      param1: this.cPageUrl,
      param2: "PAGE_LOAD",
      param3: "",
      param4: param4
      //param4: t || {}
    });
  }

  appEvent(event: string, param: any = {}) {
    let timestamp = this._now()
    let send = () => {
      this.mtrDebug && logger("appEvent", param);
      let param4 = param;
      param4.refAction = this.refAction
      this.refAction = event
      return this._remoteLog({
        timestamp,
        seedId: this.cfg.clkSeedId,
        param1: "",
        param2: event,
        param3: "",
        param4: param4
      }, { batchSend: true });
    }
    if (this.userId) {
      send()
    } else {
      setTimeout(() => {
        send()
      }, 2000)
    }

  }



  click(url: string | null, seed: string, param: any = {}, inter: boolean = false) {
    this.mtrDebug && logger("click", seed);
    let myUrl = url || getMainInfo().url;
    this.url = myUrl;
    let param4 = inter ? param : dealExtra(param);
    let param2 = _encodeStr(seed)
    if (this.refActionList.indexOf(param2) != -1) {
      //param4.refAction = "["+this.refAction+"]"
    } else if (this.refAction != param2) {
      param4.refAction = this.refAction
    }
    var msg = {
      seedId: this.cfg.clkSeedId,
      param1: myUrl,
      param2,
      param3: '',
      param4
    };
    if (param.terminal != undefined && param.terminal) {
      this.refAction = ''
    } else {
      this.refAction = param2
      this.refActionList.push(this.refAction)
    }
    return this._remoteLog(msg, { batchSend: true, time: 0 });
  }



  calc(url: string | null, r: string, n: number, param: any = {}, inter: boolean = false) {
    this.mtrDebug && logger("calc");
    let myUrl = url || getMainInfo().url;
    this.url = myUrl;
    let param4 = inter ? param : dealExtra(param);
    param4.refAction = this.refAction
    var a = {
      seedId: this.cfg.calcSeedId,
      param1: myUrl,
      param2: _encodeStr(r),
      param3: n,
      param4: param4
    };
    return this._remoteLog(a, { batchSend: true });
  }

  expo(url: string | null, item: string, dir?: string, data?: any) {
    this.mtrDebug && logger("expo");
    if (!this.stat_auto_expo) {
      logger("expo disable");
      return -1
    }
    let myUrl = url || getMainInfo().url;
    this.url = myUrl;
    var param4 = dealExtra(data || {});
    param4.refAction = this.refAction
    return this._remoteLog({
      seedId: this.cfg.expoSeedId,
      param1: myUrl,
      param2: _encodeStr(item),
      param3: dir,
      param4
    }, { batchSend: true });
  }


  log(r: string, param: any = {}) {
    this.mtrDebug && logger("log");
    var info = getMainInfo();
    this.url = info.url;
    let param2 = formatSeed(r)
    let param4 = { mtrLogMsg: r, ...dealExtra(param) }
    param4.refAction = this.refAction
    unify.reportAnalytics(param2, param4);
    return this._remoteLog({
      seedId: this.cfg.syslogSeedId,
      param1: this.url,
      param2, //encodeURIComponent(JSON.stringify(r)),
      param3: "",
      param4
    }, { batchSend: true });
  }

  err(r: string, n: string | any, param: any = {}) {
    this.mtrDebug && console.warn("Tracker.err()", r, n);
    var info = getMainInfo();
    this.url = info.url;
    let param2 = formatSeed(n)
    let param4 = { mtrTag: r, mtrErrMsg: n, ...dealExtra(param) }
    param4.refAction = this.refAction
    unify.reportAnalytics(param2, param4);
    return this._remoteLog({
      seedId: "MTRERR_" + this.appId + "_" + r,
      param1: this.url,
      param2,
      param3: '',
      param4
    }, { batchSend: true });

  }


  api(param: API) {
    let { api, success, time, code, msg, response, bizSuccess } = param
    this.mtrDebug && logger("api", api, success, time, code, msg);
    let myUrl = getMainInfo().url; //API_NORMAL  API_UNUSUAL API_SLOW API_BIZ_FAIL API_FAIL
    let param2 = bizSuccess ? (time > 3000 ? "API_SLOW" : "API_NORMAL") : (success ? "API_BIZ_FAIL" : "API_FAIL") //this.formatSeed(api)    
    unify.reportAnalytics(param2.toLowerCase(), { api, success, bizSuccess, time, code, msg, response });
    if (time > this.stat_api_long_time) {
      return this._remoteLog({
        seedId: this.cfg.apiSeedId,
        param1: myUrl,
        param2: param2,//this._encodeStr(api),
        param3: time,
        param4: { api, success, bizSuccess, time, code, msg, response, refAction: this.refAction }
      }, { batchSend: true });
    } else
      return -1
  }

  setData(key: string, value: string) {
    this.data[key] = value
  }

}


