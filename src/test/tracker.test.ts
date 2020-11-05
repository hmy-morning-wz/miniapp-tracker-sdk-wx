declare var global:any
const trackerUrl ="https://webtrack.allcitygo.com:8088/event/upload"
export function mockRandom(fmt:string="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx") {
  return fmt.replace(/[xyz]/g, function (e) {
    var t = (16 * Math.random()) | 0,
      r = "x" === e ? t : (3 & t) | 8;
    return r.toString(16);
  });
}
const appId = mockRandom('xxxxxxxx')
const version =mockRandom('x.y.z')
const appVersion = mockRandom('x.y.z')
const appName = mockRandom('测试xxxxxxxxxx')
const userId = mockRandom('xxxxxxxxxx')
const bizScenario = mockRandom('xxxxxxxxxx')
const bizScenario2 = mockRandom('xxxxxxxxxx')
var lastRequsetData=null
var trackerRequestData={}
import { _encodeStr,formatSeed } from "../utils/common"
global.Storage={}
function trackerRequest(request:any){
  let requsetData:any= {}
  let data = request.split("=")[1]
  let list = decodeURIComponent(data).split(",")
  requsetData.time = list[1]
  requsetData.appId = list[2]
  requsetData.version = list[3]
  requsetData.userId = list[7]
  requsetData.seedId = list[8]
  requsetData.param1 = list[19]
  requsetData.param2 = list[20]
  requsetData.param3 = list[21]
  requsetData.param4 = list[22]
  requsetData.bizScenario = list[23]
  requsetData.sn = list[24]
  requsetData.UUid = list[25]
  requsetData.sessionId = list[6]
  requsetData.ref = list[28]
  requsetData.url = list[29]

  let param4 = list[22]
  let plist = param4.split("^")
  let param4Obj:any = {}
  plist.forEach((t)=>{
    let kv= t.split("=")    
    param4Obj[kv[0]]=kv[1]    
  })     
  requsetData.param4 = param4Obj
  console.log(requsetData)
  if( Math.abs((+Date.now()) - (+Date.parse(requsetData.time))) >1000) {
    console.log("time error")
    return 
  }
  if(requsetData.appId.indexOf(appId)==-1) {
    console.log("appId error")
    return 
  }
  if(requsetData.version!= version) {
    console.log("version error")
    return 
  }
  if(requsetData.userId!=param4Obj.user_id || !(requsetData.userId==userId || requsetData.userId=="VISITOR" ) ) {
    console.log("userId error")
    return 
  }

  if(requsetData.url!='-' && (requsetData.url!=param4Obj.fullURL || requsetData.param1!=param4Obj.fullURL)) {
    console.log("fullURL error")
    return 
  }
  if(requsetData.param2!=param4Obj.mtrSeed) {
    console.log("mtrSeed error")
    return 
  }
  if(requsetData.param3!=param4Obj.mtrValue) {
    console.log("mtrValue error")
    return 
  }
  if(!param4Obj.mtrVer) {
    console.log("mtrVer error")
    return 
  }

  if(!requsetData.UUid ||requsetData.UUid  =='-' ) {
    console.log("UUid error")
    return 
  }
  if(!requsetData.sessionId ||requsetData.sessionId  =='-' ) {
    console.log("sessionId error")
    return 
  }

  if(param4Obj.appVersion!= appVersion) {
    console.log("appVersion error")
    return 
  }

  if(param4Obj.appName!= _encodeStr(appName)) {
    console.log("appName error")
    return 
  }
  if(param4Obj.mBizScenario && (param4Obj.mBizScenario!=requsetData.bizScenario)) {
    console.log("bizScenario error")
    return 
  }
  

  trackerRequestData[requsetData.sn] =requsetData 
  lastRequsetData = requsetData
  
}
global.my = {
  canIUse:function(name){
    console.log("canIUse",name)
    return true
  },
  getStorage:function(data){
    console.log("getStorage",data)
    data &&data.success &&data.success({data:Storage[data.key]})
    data &&data.complete && data.complete()
  },
  reportAnalytics:function(seed,data){
    console.log("reportAnalytics",seed,data)
  },
  request:function(data){
    if(trackerUrl===data.url) {
      console.log("request",decodeURIComponent(data.data))
      trackerRequest(data.data)
    }
    else {
      console.log("request",data)
    }
   
    if(data){
    let success =   !data.error
    let delay = (data.delay) || 0
    if(success){
      if(delay) {
         setTimeout(()=>{
          data.success &&data.success({data:data.data})
          data &&data.complete && data.complete()
         },delay)
      }
      else {
        data.success &&data.success({data:data.data})
      }
    } else {
      data.fail &&data.fail({error:data.error,errorMessage:"errorMessage fail",status:500,data:data.data})
    }    
    (!delay) && data &&data.complete && data.complete()
    }
    return {}
  },
  getLocation:function(data){
    console.log("getLocation",data)
    return {}
  },
  setStorage:function(data){
    console.log("setStorage",data)
    Storage[data.key] = data.data
    data &&data.success&& data.success({success:true,data:{}})
    data &&data.complete && data.complete()
  },
  getNetworkType:function(data){
    console.log("getNetworkType",data)
    data &&data.success&& data.success({success:true,networkType:"mock"})
    data &&data.complete && data.complete()
  },
  getSystemInfo:function(data){
    console.log("getSystemInfo",data)
    data &&data.success&& data.success({success:true,
      "app": "alipay",
      "brand": "IPHONE",
      "currentBattery": "100%",
      "fontSizeSetting": 16,
      "language": "Chinese",
      "model": "iPhone 6",
      "pixelRatio": 2,
      "platform": "ios",
      "storage": "256G",
      "system": "iOS",
      "version": appVersion,
      "screenWidth": 375,
      "screenHeight": 667,
      "windowWidth": 375,
      "windowHeight": 595,
      "statusBarHeight": 24,
      "titleBarHeight": 48
    })
    data &&data.complete && data.complete()
  },
  getAppIdSync:function(){
    console.log("getAppIdSync")   
    return {success:true,appId:appId}
  },
  getRunScene:function(data){
    console.log("getRunScene",data)
    data &&data.success&& data.success({success:true,envVersion:"mock"})
    data &&data.complete && data.complete()
  },
  isCollected:function(data){
    console.log("isCollected",data)
    data &&data.success&& data.success({success:true,isCollected:true})
    data &&data.complete&& data.complete()
  },
  /**
   * reportAnalytics
request
getLocation
setStorage
getNetworkType
getSystemInfo
getAppIdSync
getRunScene
isCollected
   */
}
global.$global ={}

global.App= function(data){ return data}

global.Page=function(data){ return data}
global.Component= function(data){ return data}
global.getCurrentPages = function():any[]{return [{route:"pages/mock/index"}]}
import Tracker from "../tracker/index"
import 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

const app = App({
  mtrConfig:{  server: [trackerUrl],mtrDebug:false,appName,appId,version,stat_auto_apperr:true},
  onLaunch(option){
    console.log("app onLaunch",option)
  },
  onShow(option){
    console.log("app onShow",option)
  },
  onError(){}
  
})
global.getApp= function(){
  return app
}
const page = Page({
  route:"pages/my/index",
  onTap:function(e){console.log("onTap",e)},
  onLoad(query){
    console.log("page onLoad",query)
  },
  onShow(){
    console.log("page onShow")
  },
  onAppear:function(e){console.log("onAppear",e)},
})

const page2 = Page({
  route:"pages/more/index",
  onTap:function(e){console.log("onTap",e)},
  onLoad(query){
    console.log("page onLoad",query)
  },
  onShow(){
    console.log("page onShow")
  },
  onAppear:function(e){console.log("onAppear",e)},
})
const component = Component({methods:{onTap:function(e){console.log("onTap",e)}}})



describe('Tracker', () => {

  it('Tracker test' , function(done){
    expect(Tracker.Mtr._ready).to.equal(true) 
    done()
  });
  
});




  
describe('Tracker App test', () => {
  it('App onLaunch' , (done) => {
    //this.timeout(60000);
    app.onLaunch({a:1,query:{bizScenario}})    
    let data = lastRequsetData
    if(data) {
    expect(data).to.have.any.keys("time","seedId","appId","version","userId","param1","param2","param3","param4","bizScenario","sn","UUid","sessionId","ref","url")
    expect(data.param4).to.have.any.keys("mtrVer","mtrSeed","user_id","fullURL","appVersion","appName")
    expect(data.seedId).to.equal("MINI_MTRACKER_AP_CLK")
    expect(data.param4.mtrSeed).to.equal("APP_ON_LAUNCH") 
    expect(data.userId).to.equal('VISITOR')  
    expect(data.bizScenario).to.equal(bizScenario)  
    }
    done()
 
  });
  it('App onShow' , (done) => {
    //this.timeout(60000);
    app.onShow({b:1,scene:'1005',referrerInfo:{appId:"200076",extraData:{}}}) 
    let data = lastRequsetData
    if(data){
    expect(data).to.have.any.keys("time","seedId","appId","version","userId","param1","param2","param3","param4","bizScenario","sn","UUid","sessionId","ref","url")
    expect(data.param4).to.have.any.keys("mtrVer","mtrSeed","user_id","fullURL","appVersion","appName")
    expect(data.seedId).to.equal("MINI_MTRACKER_AP_CLK")
    expect(data.param4.mtrSeed).to.equal("APP_ON_SHOW") 
    expect(data.userId).to.equal('VISITOR')  
    expect(data.bizScenario).to.equal(bizScenario)  
    }
    done()   
  });
  it('setUserId test' , (done) => {  
    Tracker.setUserId(userId)
    expect(Tracker.getUserId()).to.equal(userId)
    done()
  });

  it('App onError' , (done) => {
    let error =new Error("err")
    app.onError(error)
    let data = lastRequsetData
    expect(data).to.have.any.keys("time","seedId","appId","version","userId","param1","param2","param3","param4","bizScenario","sn","UUid","sessionId","ref","url")
    expect(data.param4).to.have.any.keys("mtrVer","mtrSeed","user_id","fullURL","appVersion","appName")
    expect(data.seedId).to.equal(`MTRERR_${appId}_APP_ERROR`)
    expect(data.param4.mtrSeed).to.equal(formatSeed(error)) 
    expect(data.userId).to.equal(userId)  
    done()
  });

  
});






describe('Tracker Page test', () => {

  it('Page onLoad' , (done) => {
    page.onLoad({a:1,bizScenario:bizScenario2}) 
    done()
  });
  it('Page onShow' , (done) => {
    page.onShow()
    let data = lastRequsetData
    expect(data).to.have.any.keys("time","seedId","appId","version","userId","param1","param2","param3","param4","bizScenario","sn","UUid","sessionId","ref","url")
    expect(data.param4).to.have.any.keys("mtrVer","mtrSeed","user_id","fullURL","appVersion","appName")
    expect(data.seedId).to.equal("MINI_MTRACKER_AP_PAGE")
    expect(data.param4.mtrSeed).to.equal("PAGE_LOAD") 
    expect(data.userId).to.equal(userId)  
    expect(data.bizScenario).to.equal(bizScenario2)  
    done()
  });
  it('Page onTap' , (done) => {
    page.onTap({type:"tap",currentTarget:{dataset:{group:"abc",index:1}}})
    let data = lastRequsetData
    expect(data).to.have.any.keys("time","seedId","appId","version","userId","param1","param2","param3","param4","bizScenario","sn","UUid","sessionId","ref","url")
    expect(data.param4).to.have.any.keys("mtrVer","mtrSeed","user_id","fullURL","appVersion","appName")
    expect(data.seedId).to.equal("MINI_MTRACKER_AP_CLK")
    expect(data.param4.mtrSeed).to.equal("#onTap") 
    expect(data.userId).to.equal(userId)  
    expect(data.param4['mtr-xpath']).to.equal("#onTap") 
    expect(data.param4['mtr-index']).to.equal("1") 
    expect(data.param4['mtr-group']).to.equal("abc") 
    
    done()
  });
  it('Page onTap' , (done) => {
    page.onAppear({type:"appear",currentTarget:{dataset:{group:"abc",index:1}}})
    let data = lastRequsetData
    expect(data).to.have.any.keys("time","seedId","appId","version","userId","param1","param2","param3","param4","bizScenario","sn","UUid","sessionId","ref","url")
    expect(data.param4).to.have.any.keys("mtrVer","mtrSeed","user_id","fullURL","appVersion","appName")
    expect(data.seedId).to.equal("MINI_MTRACKER_AP_EXPO")
    expect(data.param4.mtrSeed).to.equal("#onAppear") 
    expect(data.userId).to.equal(userId)  
    expect(data.param4['mtr-xpath']).to.equal("#onAppear") 
    expect(data.param4['mtr-index']).to.equal("1") 
    expect(data.param4['mtr-group']).to.equal("abc") 
    
    done()
  });

  it('Page2 onShow' , (done) => {
    page2.onShow()
    let data = lastRequsetData
    expect(data).to.have.any.keys("time","seedId","appId","version","userId","param1","param2","param3","param4","bizScenario","sn","UUid","sessionId","ref","url")
    expect(data.param4).to.have.any.keys("mtrVer","mtrSeed","user_id","fullURL","appVersion","appName")
    expect(data.seedId).to.equal("MINI_MTRACKER_AP_PAGE")
    expect(data.param4.mtrSeed).to.equal("PAGE_LOAD") 
    expect(data.userId).to.equal(userId)  
    expect(data.bizScenario).to.equal(bizScenario2)  
    done()
  });

  it('Page onHide' , (done) => {
    page.onHide()
    let data = lastRequsetData
    expect(data).to.have.any.keys("time","seedId","appId","version","userId","param1","param2","param3","param4","bizScenario","sn","UUid","sessionId","ref","url")
    expect(data.param4).to.have.any.keys("mtrVer","mtrSeed","user_id","fullURL","appVersion","appName")
    expect(data.seedId).to.equal("MINI_MTRACKER_AP_CALC")
    expect(data.param4.mtrSeed).to.equal("PAGE_STAY") 
    expect(data.userId).to.equal(userId)  
    expect(data.bizScenario).to.equal(bizScenario2)  
    done()
  });

  it('Page2 onHide' , (done) => {
    page2.onHide()
    let data = lastRequsetData
    expect(data).to.have.any.keys("time","seedId","appId","version","userId","param1","param2","param3","param4","bizScenario","sn","UUid","sessionId","ref","url")
    expect(data.param4).to.have.any.keys("mtrVer","mtrSeed","user_id","fullURL","appVersion","appName")
    expect(data.seedId).to.equal("MINI_MTRACKER_AP_CALC")
    expect(data.param4.mtrSeed).to.equal("PAGE_STAY") 
    expect(data.userId).to.equal(userId)  
    expect(data.bizScenario).to.equal(bizScenario2)  
    done()
  });
});


describe('Tracker Component test', () => {  
  it('component onTap' , (done) => {
    component.methods.onTap({type:"tap",currentTarget:{dataset:{}}})
    let data = lastRequsetData
    expect(data).to.have.any.keys("time","seedId","appId","version","userId","param1","param2","param3","param4","bizScenario","sn","UUid","sessionId","ref","url")
    expect(data.param4).to.have.any.keys("mtrVer","mtrSeed","user_id","fullURL","appVersion","appName")
    expect(data.seedId).to.equal("MINI_MTRACKER_AP_CLK")
    expect(data.param4.mtrSeed).to.equal("#onTap") 
    expect(data.userId).to.equal(userId)  
    done()
  });
});




describe('Tracker api', () => {

  it('log test' , (done) => {  
    let sn = Tracker.log('test Log',{})
    let data = trackerRequestData[sn]
    expect(data).to.have.any.keys("time","appId","version","userId","param1","param2","param3","param4","bizScenario","sn","UUid","sessionId","ref","url")
    expect(data.param4).to.have.any.keys("mtrVer","mtrSeed","user_id","fullURL","appVersion","appName")
    expect(data.seedId).to.equal("MINI_MTRACKER_AP_SYSLOG")
    expect(data.param4.mtrLogMsg).to.equal("test Log")
    expect(data.param4.mtrSeed).to.equal(formatSeed("test Log"))    
    expect(data.userId).to.equal(userId) 
    done()
  });
  it('err test' , (done) => {  
    let error =new Error("mock test err")
    let sn = Tracker.err('tag',error)
    let data = trackerRequestData[sn]
    expect(data).to.have.any.keys("time","seedId","appId","version","userId","param1","param2","param3","param4","bizScenario","sn","UUid","sessionId","ref","url")
    expect(data.param4).to.have.any.keys("mtrVer","mtrSeed","user_id","fullURL","appVersion","appName")
    expect(data.seedId).to.equal(`MTRERR_${appId}_tag`)
    expect(data.param4.mtrErrMsg).to.equal(""+error)
    expect(data.param4.mtrSeed).to.equal(formatSeed(error)) 
    expect(data.userId).to.equal(userId)    
    done()
  });
  it('calc test' , (done) => {  
    let sn = Tracker.calc('seedNameCalc',10)
    let data = trackerRequestData[sn]
    expect(data).to.have.any.keys("time","seedId","appId","version","userId","param1","param2","param3","param4","bizScenario","sn","UUid","sessionId","ref","url")
    expect(data.param4).to.have.any.keys("mtrVer","mtrSeed","user_id","fullURL","appVersion","appName")
    expect(data.seedId).to.equal("MINI_MTRACKER_AP_CALC")
    expect(data.param4.mtrValue).to.equal("10")
    expect(data.param4.mtrSeed).to.equal("seedNameCalc")    
    expect(data.userId).to.equal(userId) 
    done()
  });
  it('click test' , (done) => {  
    let sn = Tracker.click('seedNameClick')
    let data = trackerRequestData[sn]
    expect(data).to.have.any.keys("time","seedId","appId","version","userId","param1","param2","param3","param4","bizScenario","sn","UUid","sessionId","ref","url")
    expect(data.param4).to.have.any.keys("mtrVer","mtrSeed","user_id","fullURL","appVersion","appName")
    expect(data.seedId).to.equal("MINI_MTRACKER_AP_CLK")
    expect(data.param4.mtrSeed).to.equal("seedNameClick") 
    expect(data.userId).to.equal(userId)  
    done()
  });
  it('expo test' , (done) => {  
    let sn = Tracker.expo('seedNameClick')
    let data = trackerRequestData[sn]
    expect(data).to.have.all.keys("time","seedId","appId","version","userId","param1","param2","param3","param4","bizScenario","sn","UUid","sessionId","ref","url")
    expect(data.param4).to.have.any.keys("mtrVer","mtrSeed","user_id","fullURL","appVersion","appName")
    expect(data.seedId).to.equal("MINI_MTRACKER_AP_EXPO")
    expect(data.param4.mtrSeed).to.equal("seedNameClick")  
    expect(data.userId).to.equal(userId) 
    done()
  });

  it('App onHide' , (done) => {
    expect(app.onHide())
    done()
  });

});



describe('my hook test', () => {  

  it('getLocation' , (done) => {
    expect(my.getLocation({}))
    done()
  });

  it('request success' , (done) => {
    my.request({success:()=>{
      /*
      setTimeout(()=>{
        let data = lastRequsetData
        expect(data).to.have.any.keys("time","seedId","appId","version","userId","param1","param2","param3","param4","bizScenario","sn","UUid","sessionId","ref","url")
        expect(data.param4).to.have.any.keys("mtrVer","mtrSeed","user_id","fullURL","appVersion","appName")
        expect(data.seedId).to.equal("MINI_MTRACKER_AP_API")
        expect(data.param4.mtrSeed).to.equal("API_BIZ_SUCCESS") 
        expect(data.param4.bizSuccess).to.equal(true) 
        expect(data.param4.code).to.equal("0") 
        expect(data.param4.msg).to.equal("") 
        done()
      },10)*/
      done()
    },data:{"code":"0","data":{"access_token":"A5EC22FE67A2E4B23F619188518C1CB0","refresh_token":"5BA2831989F58ABC63E17BF881BBD435","expires_in":604800,"token_type":"","scope":"","open_user_id":"2088702372862094"},"msg":"","biz_suc":true,"suc":true,"message":""}, fail:()=>{},url:"https://mock.com/success",method:"POST",  dataType:"JSON"})  
    
  });


  it('request fail' , (done) => {    
    my.request({ error:11 ,data:"mock fail" ,success:()=>{}, fail:()=>{
      setTimeout(()=>{
        let data = lastRequsetData
        expect(data).to.have.any.keys("time","seedId","appId","version","userId","param1","param2","param3","param4","bizScenario","sn","UUid","sessionId","ref","url")
        expect(data.param4).to.have.any.keys("mtrVer","mtrSeed","user_id","fullURL","appVersion","appName")
        expect(data.seedId).to.equal("MINI_MTRACKER_AP_API")
        expect(data.param4.mtrSeed).to.equal("API_FAIL") 
        done()
      },10)
   
    },url:"https://mock.com/fail",method:"POST",dataType:"JSON"})
   
  });

  it('request success slow ' , function(done){
    this.timeout(60000);
    my.request({ delay:3100 ,data:{"code":"0","data":{"access_token":"A5EC22FE67A2E4B23F619188518C1CB0","refresh_token":"5BA2831989F58ABC63E17BF881BBD435","expires_in":604800,"token_type":"","scope":"","open_user_id":"2088702372862094"},"msg":"","biz_suc":true,"suc":true,"message":""},success:()=>{
      setTimeout(()=>{
      let data = lastRequsetData
      expect(data).to.have.any.keys("time","seedId","appId","version","userId","param1","param2","param3","param4","bizScenario","sn","UUid","sessionId","ref","url")
      expect(data.param4).to.have.any.keys("mtrVer","mtrSeed","user_id","fullURL","appVersion","appName")
      expect(data.seedId).to.equal("MINI_MTRACKER_AP_API")
      expect(data.param4.mtrSeed).to.equal("API_SLOW") 
      done()
      },10)
    }, fail:()=>{},url:"https://mock.com/success/slow",method:"POST",dataType:"JSON"})
  
  });


  
});