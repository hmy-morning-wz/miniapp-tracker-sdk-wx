import { logger, logInfo } from "../utils/common"
import CONFIG from "../config";
import { MTR } from "./mtr";
import { hookGetLocation, hookRequest } from "../utils/alipay"
import { TrackerAppApi, TrackerPageApi, TrackerComponentApi } from "../interface"
import { getBasicInfo } from "../utils/alipay"
const actionEventTypes = ["tap", "longpress", "firstAppear", "appear", "submit"]
function actionListener(Mtr: MTR, t, e) {
  let mtrDebug = Mtr.mtrDebug
  mtrDebug && logger("actionListener");
  if (t.trackered) {
    logInfo("actionListener trackered");
    return;
  }
  t.trackered = true;
  var dataset = t.currentTarget.dataset;
  var xpath = `${t.id || ""}#${e}`;
  var obj = dataset.obj;
  var name = obj
    ? obj.seedName ||
    obj.name ||
    obj.icon_name ||
    obj.text ||
    obj.text_content ||
    obj.mid_text_content
    : undefined;
  var seedName =
    dataset.seed || dataset.seedName || dataset.title || name || xpath;
  let globalData = {}

  if (dataset.mtrappdata) {
    // @ts-ignore
    let app: any = getApp()
    app.globalData && Object.keys(app.globalData).forEach((key) => {
      if (dataset.mtrappdata.indexOf(key) > -1) {
        globalData["app-" + key] = app.globalData[key]
      }
    })
  }
  let pageData = {}
  if (dataset.mtrpagedata && this.data) {
    let data = this.data
    Object.keys(data).forEach((key) => {
      if (dataset.mtrpagedata.indexOf(key) > -1) {
        pageData['page-' + key] = data[key]
      }
    })
  }
  if ("tap" === t.type || "longpress" === t.type || "submit" === t.type) {
    mtrDebug && logInfo("Hook click", seedName);
    if (dataset.mtrignore) {
      mtrDebug && logInfo("Hook click mtrignore");
      return
    }
    //var { url_type, url_path, url_data, url_remark } = obj || {};
    obj = obj || {};
    let { spmId, scm, newChinfo, params } = obj
    if (Mtr.Tracert) {
      if (!spmId) {
        spmId = dataset.spmId
      }
      if (spmId) {
        let index = dataset.index || 0
        if (spmId.indexOf("_N") > -1) {
          spmId = spmId.replace("_N", "_" + index)
        }
        if (spmId.indexOf("${spmAPos}") > -1 && Mtr.Tracert.spmAPos) {
          spmId = spmId.replace("${spmAPos}", Mtr.Tracert.spmAPos)
        }
        if (spmId.indexOf("${spmBPos}") > -1 && Mtr.Tracert.spmBPos) {
          spmId = spmId.replace("${spmBPos}", Mtr.Tracert.spmBPos)
        }
      }
      if (!scm) {
        scm = dataset.scm
      }
      if (scm) {
        if (scm.indexOf("${system}") > -1 && Mtr.Tracert.system) {
          scm = scm.replace("${system}", Mtr.Tracert.system)
        }
        if (scm.indexOf("${subsystem}") > -1 && Mtr.Tracert.subsystem) {
          scm = scm.replace("${subsystem}", Mtr.Tracert.subsystem)
        }
        if (scm.indexOf("${traceId}") > -1) {
          let traceId = Mtr.traceId()
          scm = scm.replace("${traceId}", traceId)
        }
        if (scm.indexOf("${id}") > -1 && obj.id) {  //${sellerId}
        scm = scm.replace("${id}", obj.id)
       }
        if (scm.indexOf("${sellerId}") > -1 && obj.sellerId) {  //${sellerId}
          scm = scm.replace("${sellerId}", obj.sellerId)
        }       
        if (scm.indexOf("${goodsId}") > -1 && obj.goodsId) {  //${goodsId}
          scm = scm.replace("${goodsId}", obj.goodsId)
        }
      }
    }
    Mtr.click(this.route, seedName, {
      xpath: xpath,
      ...globalData,
      ...pageData,
      ...obj,
      spmId,
      scm,
      index: dataset.index || 0,
      group: dataset.group || "-"
    });

    if (spmId) {
      Mtr.Tracert && Mtr.Tracert.clickContent(spmId, scm || "", newChinfo || "", params || "");
      Mtr.mtrDebug && logInfo("clickContent", spmId, scm);
    }
  } else if ("appear" === t.type || "firstAppear" === t.type) {
    Mtr.mtrDebug && logInfo("Hook expo", seedName);
    if (dataset.mtrignore) {
      mtrDebug && logInfo("Hook expo mtrignore");
      return
    }
    obj = obj || {};
    let { spmId, scm, newChinfo, params } = obj
    if (Mtr.Tracert) {
      if (!spmId) {
        spmId = dataset.spmId
      }
      if (spmId) {
        let index = dataset.index || 0
        /**pmAPos:"a1" spmBPos:"b1" */
        if (spmId.indexOf("_N") > -1) {
          spmId = spmId.replace("_N", "_" + index)
        }
        if (spmId.indexOf("${spmAPos}") > -1 && Mtr.Tracert.spmAPos) {
          spmId = spmId.replace("${spmAPos}", Mtr.Tracert.spmAPos)
        }
        if (spmId.indexOf("${spmBPos}") > -1 && Mtr.Tracert.spmBPos) {
          spmId = spmId.replace("${spmBPos}", Mtr.Tracert.spmBPos)
        }
      }
      if (!scm) {
        scm = dataset.scm
      }
      //a1001.b1001.item.${itemId}.${traceId}
      if (scm) {
        if (scm.indexOf("${system}") > -1 && Mtr.Tracert.system) {
          scm = scm.replace("${system}", Mtr.Tracert.system)
        }
        if (scm.indexOf("${subsystem}") > -1 && Mtr.Tracert.subsystem) {
          scm = scm.replace("${subsystem}", Mtr.Tracert.subsystem)
        }
        if (scm.indexOf("${traceId}") > -1) {
          let traceId = Mtr.traceId()
          scm = scm.replace("${traceId}", traceId)
        }
        if (scm.indexOf("${id}") > -1 && obj.id) {  //${sellerId}
          scm = scm.replace("${id}", obj.id)
        }
        if (scm.indexOf("${sellerId}") > -1 && obj.sellerId) {  //${sellerId}
          scm = scm.replace("${sellerId}", obj.sellerId)
        }
        
        if (scm.indexOf("${goodsId}") > -1 && obj.goodsId) {  //${goodsId}
          scm = scm.replace("${goodsId}", obj.goodsId)
        }
      }
    }
    Mtr.expo(this.route, seedName, "-", {
      xpath: xpath,
      ...globalData,
      ...pageData,
      ...obj,
      spmId,
      scm,
      index: dataset.index || 0,
      group: dataset.group || "-"
    });

    if (spmId) {
      Mtr.Tracert && Mtr.Tracert.expoContent(spmId, scm || "", newChinfo || "", params || "");
      Mtr.mtrDebug && logInfo("expoContent", spmId, scm);
    }

  }
  // ("tap" === t.type || "longpress" === t.type) &&  Mtr.click(t, e)
}
function hookComponent(Mtr: MTR, t, e) {
  return function () {
    let i = arguments ? arguments[0] : void 0;
    if (
      i &&
      i.currentTarget &&
      -1 !== actionEventTypes.indexOf(i.type)
    )
      try {
        actionListener.call(this, Mtr, i, t);
      } catch (t) {
        console.error(t);
      }
    return e.apply(this, arguments);
  };
}
function hookPage(Mtr: MTR, t, e) {
  return function () {
    let i = arguments ? arguments[0] : void 0;
    if (
      i &&
      i.currentTarget &&
      -1 !== actionEventTypes.indexOf(i.type)
    )
      try {
        actionListener.call(this, Mtr, i, t);
      } catch (t) {
        console.error(t);
      }
    return e.apply(this, arguments);
  };
}


export function Hook(obj: any, funName: string, hook: any) {
  var fun1 = obj[funName];
  obj[funName] = function (data: any) {
    hook.call(this, data);
    return fun1 && fun1.call(this, data);
  };
}

export class TrackerApp implements TrackerAppApi {
  Mtr: MTR
  constructor(Mtr: MTR) {
    this.Mtr = Mtr
  }
  init(config) {
    config && Object.assign(this.Mtr, config);
    console.warn("App.init() 已经不再使用,请删除代码,配置信息请放置 App({ mtrConfig:{ ... }})");
  }
  config(config) {
    config && Object.assign(this.Mtr, config);
  }
  onLaunch() {
    let Mtr = this.Mtr
    return function (option: any) {
      try {
        if (option) {
          let { query, scene, referrerInfo } = option;
          Mtr.scene = scene || ''
          scene && (scene = CONFIG.scene[scene] || scene);
          let query_bizScenario = query && (query.bizScenario || query.bz)
          let extraData_bizScenario = referrerInfo && referrerInfo.extraData && referrerInfo.extraData.bizScenario
          let referrerInfo_appId = referrerInfo && referrerInfo.appId
          if (!Mtr.bizScenario) {
            Mtr.bizScenario = query_bizScenario || extraData_bizScenario || referrerInfo_appId || scene
          }
          Mtr.referrerAppId = referrerInfo_appId || ''
          Mtr.onLaunchOption = option
        }
        getBasicInfo(function (baseInfo: any) {
          Object.assign(Mtr, baseInfo);
          Mtr.baseInfo = baseInfo
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
      Mtr.stat_location && hookGetLocation(Mtr)
      Mtr.stat_api && hookRequest(Mtr)
      Mtr.mtrDebug && logInfo("App onLaunch");
    }
  }
  onHide() {
    let Mtr = this.Mtr
    return function () {
      Mtr.mtrDebug && logInfo("app onHide");
      Mtr.onAppHide();
    }
  }
  onError() {
    let Mtr = this.Mtr
    return function (e: any) {
      try {
        Mtr.mtrDebug && logInfo("app onError");
        Mtr.onAppError(e);
      } catch (err) {
        console.error(err)
      }
    }
  }
  onShow() {
    let Mtr = this.Mtr
    return function (option: any) {
      try {
        if (option) {
          let { query, scene, referrerInfo } = option;
          Mtr.scene = scene || ''
          scene && (scene = CONFIG.scene[scene] || scene);
          let query_bizScenario = query && (query.bizScenario || query.bz)
          let extraData_bizScenario = referrerInfo && referrerInfo.extraData && referrerInfo.extraData.bizScenario
          let referrerInfo_appId = referrerInfo && referrerInfo.appId
          if (!Mtr.bizScenario) {
            Mtr.bizScenario = query_bizScenario || extraData_bizScenario || referrerInfo_appId || scene
          }
          Mtr.referrerAppId = referrerInfo_appId || ''
        }
      } catch (b) {
        Mtr.mtrDebug && console.error("Mtr", b);
      }
      Mtr.startTime = +Date.now()
      Mtr.stat_app_show && Mtr.appEvent("APP_ON_SHOW", {
        option: JSON.stringify(option),
        referrerAppId: Mtr.referrerAppId,
        scene: Mtr.scene
      });
      Mtr.mtrDebug && logInfo("app onShow", option);
    }
  }
}

export class TrackerPage implements TrackerPageApi {
  Mtr: MTR
  constructor(Mtr: MTR) {
    this.Mtr = Mtr
  }
  init() {
    console.warn("Page.init() 已经不再使用,请删除代码");
  }
  onLoad() {
    let Mtr = this.Mtr
    return function (query: any) {
      Mtr.mtrDebug && logInfo("Page onLoad ", this.route, query);
      if (query && ("bizScenario" in query || "bz" in query)) {
        let { bizScenario, bz } = query;
        bizScenario = bizScenario || bz;
        Mtr.bizScenario = bizScenario;
      }
      this.$mtr_query = query || {}
    }
  }
  onShow() {
    let Mtr = this.Mtr
    return function () {
      Mtr.mtrDebug && logInfo("onShow", this.route);
      this.$mtr_time_show = +Date.now();
      Mtr.pagePv(this.route, this.$mtr_query);
      Mtr.Tracert && Mtr.Tracert.logPv(this.$mtr_query || {})

    }
  }

  onPageScroll() {
    let Mtr = this.Mtr
    return function () {
      Mtr.mtrDebug && logInfo("onPageScroll", this.route);
      Mtr.click(this.route, "PAGE_SCROLL");
    }
  }

  onReachBottom() {
    let Mtr = this.Mtr
    return function () {
      Mtr.mtrDebug && logInfo("onReachBottom", this.route);
      Mtr.click(this.route, "REACH_BOTTOM");
    }
  }

  onHide() {
    let Mtr = this.Mtr
    return function () {
      var now = +Date.now();
      var t0 = now - this.$mtr_time_show;
      Mtr.calc(this.route, "PAGE_STAY", t0, { action: "page_hide" }, true);
      Mtr.mtrDebug && logInfo("onHide", this.route);
      //Mtr.onPageHide(this.route);
    }
  }

  onPullDownRefresh() {
    let Mtr = this.Mtr
    return function () {
      Mtr.mtrDebug && logInfo("onPullDownRefresh ", this.route);
      Mtr.click(this.route, "PULL_DOWN_REFRESH");
    }
  }

  onUnload() {
    let Mtr = this.Mtr
    return function () {
      Mtr.mtrDebug && logInfo("onUnload", this.route);
      //Mtr.onPageUnload(this.route);
    }
  }
  _hook(page) {
    const lifeFunction = [
      "onShow",
      "onPageScroll",
      "onLoad",
      "onReachBottom",
      "onHide",
      "onPullDownRefresh",
      "onUnload",
      "setData",
      "dispatch",
      "register",
      "subscribeAction",
      "subscribe",
      "watch",
      "when",
      "getInstance"
    ]
    if (this.Mtr.stat_auto_click) {
      for (var e in page) {
        "function" === typeof page[e] &&
          lifeFunction.indexOf(e) === -1 &&
          e.indexOf("$") === -1 &&
          (page[e] = hookPage(this.Mtr, e, page[e]));
      }
    }
    return page;
  }
}

export class TrackerComponent implements TrackerComponentApi {
  Mtr: MTR
  constructor(Mtr: MTR) {
    this.Mtr = Mtr
  }
  init() {
    console.warn("Component.init() 已经不再使用,请删除代码");
  }
  _hook(c) {
    if (this.Mtr.stat_auto_click) {
      let a = c.methods;
      for (var e in a)
        "function" === typeof a[e] &&
          e.indexOf("$") === -1 &&
          (a[e] = hookComponent(this.Mtr, e, a[e]));
    }
    return c;
  }
}