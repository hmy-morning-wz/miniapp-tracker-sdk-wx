let api =  {
    getStorage(data:{ key: string,success:any ,complete:any}){
        
    },
    setStorage({ key: key, data: data }) {

    },
    getAppIdSync():any {
        return
    },
    canIUse(api:string):boolean {
        return
    },
    reportAnalytics(seed:string,data:any) {

    },
    getStorageSync({ key: key }):{data:any} {
        return
    },
    setStorageSync({ key: key, data: data }) {

    },
    getSystemInfo(data:{ success:any ,complete:any}) {
       return
    },
    getNetworkType(data:{ success:any,complete:any }) {
        
    },
    request(data:any) {

    },
    getLocation(data:any){},
    getRunScene(data:any){},
    isCollected(data:any) {},
    isIDE:false
}

let  myApi= typeof my!=='undefined'
//@ts-ignore
let  wxApi = typeof wx!=='undefined'
if(myApi) {
    api = Object.assign(api,my)
}else if(wxApi) {
    //@ts-ignore
    api = Object.assign(api,wx)
}
export default api