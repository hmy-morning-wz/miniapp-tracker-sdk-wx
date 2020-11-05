import {API} from "./type"
export interface Event {
    click(url:string|null, seed:string, param?:any):number
    expo(url:string|null, item:string, dir?:string|null, data?:any):number
    calc(url:string|null, seed:string, value:number, param?:any):number
    log(seed:string|any,param?:any):number
    err(tag:string, seed:string|any,param?:any):number
    api(api: API): number;
    setUserId(userId:string):void
    getUserId():string
 }

 export interface TrackerApi  {
    click(seed:string, param?:any):number
    expo(seed:string, dir?:string, data?:any):number
    calc(seed:string, value:number, param?:any):number
    log(seed:string|any,param?:any):number
    err(tag:string, seed:string|any,param?:any):number
    api(api: API): number;
    setUserId(userId:string):void
    getUserId():string
 }


 
export interface TrackerAppApi {
   init(config:any):void
   config(config:any):void
   onLaunch():void
   onHide():void
   onError():void
   onShow():void
}

export interface TrackerPageApi {
    init():void
    onLoad () :void
    onShow () :void
    onPageScroll ():void
    onReachBottom ():void
    onHide ():void
    onPullDownRefresh () :void
    onUnload () :void
    _hook(page:any):any
}

export interface TrackerComponentApi {
  _hook(c:any):any
}