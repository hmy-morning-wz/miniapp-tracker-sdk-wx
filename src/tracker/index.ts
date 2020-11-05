import {logInfo } from "../utils/common"
import unify  from '../utils/unify'
// import {getBasicInfo } from "../utils/alipay"
import {MTR} from "./mtr";
import CONFIG from "../config";
import {TrackerApi ,TrackerAppApi,TrackerPageApi,TrackerComponentApi} from "../interface"
import {TrackerData,API} from "../type"
import {Hook,TrackerPage,TrackerComponent,TrackerApp} from "./miniapp"
class TrackerClass implements TrackerApi {
  data:TrackerData
  Mtr:MTR
  App:TrackerAppApi
  Page:TrackerPageApi
  Component:TrackerComponentApi
  constructor(data:TrackerData){
    this.data = data
    this.Mtr = data.Mtr
    this.App = data.App
    this.Page = data.Page
    this.Component =  data.Component
  }
  log(seed:string,p?:any) {
    return this.Mtr.log(seed,p);
  }
  err(r:string, seed:string|any,p?:any) {
    return this.Mtr.err(r, seed,p);
  }
  click(seed:string, param?:any) {
    return this.Mtr.click(null, seed, param);
  }
  calc(seed:string, n:number, p4?:any) {
    return this.Mtr.calc(null,seed, n, p4);
  }
  expo(seed:string, dir?:string, param?:any) {
    return this.Mtr.expo(null, seed, dir, param);
  }
  setUserId(userId:string) {
    this.Mtr.setUserId(userId);    
  }
  getUserId():string{
    return  this.Mtr.getUserId()
   }
  api(data:API) {
    return this.Mtr.api(data); 
  }
  setData(key:string,value:string){
    return this.Mtr.setData(key,value);
  }
}
function initMtr():TrackerClass {
  var Mtr = new MTR(CONFIG);
  Mtr.startTime = +Date.now(); 
  if(Mtr.stat_sw) {// true = on 
 /* //移到 app onLaunch
 getBasicInfo(function (baseInfo:any) {
    Object.assign(Mtr, baseInfo);
    Mtr.baseInfo = baseInfo
    Mtr.start();
    Mtr.mtrDebug &&  logInfo("App init start");
  });
  */
 if(CONFIG.my) {
   if(unify.isIDE) {
    Mtr.workspaceId = "develop"
    
   }else {
  unify.canIUse("getRunScene") &&
    unify.getRunScene({
      success: res => {       
        Mtr.mtrDebug &&  logInfo("getRunScene", res);        
        if(res.envVersion === "release" || res.envVersion === "gray") {
          Mtr.mtrDebug = false 
        }else {
          Mtr.workspaceId = res.envVersion
        }
      }
    });
  }
 
}

}
  const tracker:TrackerData = {
    Mtr:Mtr,
    App: new TrackerApp(Mtr),
    Page:new TrackerPage(Mtr),
    Component:new TrackerComponent(Mtr),
  }

  return new TrackerClass(tracker)

}

const Tracker:TrackerClass = initMtr();


(function(){
  const _APP = App,
    _Page = Page,
    _Component = Component
    //Nn = {};
  App = function (app) {
    var Mtr:MTR = Tracker.Mtr;   
    Object.assign(
      Mtr,
      app.mtrConfig || {
       // appId: unify.canIUse("getAppIdSync")  && unify.getAppIdSync && unify.getAppIdSync().appId,
        server: ["https://webtrack.allcitygo.com:8088/event/upload"],
        //appName: "未配置",
        mtrDebug: false,
      }
    );
    if(app.mtrConfig && app.mtrConfig.version) { Mtr.miniVersion = app.mtrConfig.version } 
    Hook(app, "onLaunch", Tracker.App.onLaunch());
    Hook(app, "onShow", Tracker.App.onShow());
    Hook(app, "onHide", Tracker.App.onHide());
    Mtr.stat_auto_apperr &&  Hook(app, "onError", Tracker.App.onError());
    app.Tracker = Tracker;
    Mtr.Tracert = app.Tracert
    return _APP(app);
  };
  Page = function (page:any) {
    let Mtr = Tracker.Mtr;
    if(!('onTap' in page)) {
      page.onTap = ()=>{}
    }
    if(!('onAppear' in page)) {
      page.onAppear = ()=>{}
    }
    if(!('onNopAppear' in page)) {
      page.onNopAppear = ()=>{}
    }
    Hook(page, "onLoad", Tracker.Page.onLoad());
    Hook(page, "onShow", Tracker.Page.onShow());
    Hook(page, "onHide", Tracker.Page.onHide());
    Hook(page, "onUnload", Tracker.Page.onUnload());
    if (Mtr.stat_reach_bottom) {
      Hook(page, "onReachBottom", Tracker.Page.onReachBottom());
    }
    if (Mtr.stat_pull_down_fresh) {
      Hook(page, "onPullDownRefresh", Tracker.Page.onPullDownRefresh());
    }
    if (Mtr.stat_page_scroll) {
      Hook(page, "onPageScroll", Tracker.Page.onPageScroll());
    }
    

    if (Mtr.stat_auto_click) {
      Tracker.Page._hook(page);
    }
    page.$mtr_click = function (seed:string, param:any) {
      Mtr.click(page.route, seed, param);
    };
    page.$mtr_expo = function (seed:string, dir:string, param:any) {
      Mtr.expo(page.route, seed, dir, param);
    };
    page.$mtr_calc = function (r:string, n:number, p4:any) {
      Mtr.calc(page.route, r, n, p4);
    };

    return _Page(page);
  };

  Component = function (component) {
    if(component.methods) {
      if(!('onNopTap' in component.methods)) {
        component.methods.onNopTap = ()=>{}
      }
      if(!('onNopAppear' in component.methods)) {
        component.methods.onNopAppear = ()=>{}
      }   
    }
    Tracker.Component._hook(component);
    let Mtr = Tracker.Mtr;
    component.$mtr_click = function (seed:string, param:any) {
      Mtr.click(null, seed, param);
    };
    component.$mtr_expo = function (seed:string, dir:string, param:any) {
      Mtr.expo(null, seed, dir, param);
    };
    component.$mtr_calc = function (r:string, n:number, p4:any) {
      Mtr.calc(null, r, n, p4);
    };
    return _Component(component);
  };

 
})()
export default Tracker;
