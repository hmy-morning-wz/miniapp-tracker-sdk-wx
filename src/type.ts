import "./global"
import {TrackerPageApi,TrackerComponentApi,TrackerAppApi} from "./interface"
export type API = { 
    api: string;
    success: boolean;
    time: number;
    code: string|undefined;
    msg: string;
    response: string;
    bizSuccess:boolean;
  }

export type TrackerData = {
    Mtr:any,
    App:TrackerAppApi,
    Page:TrackerPageApi,
    Component:TrackerComponentApi
}

export type RemoteLogType = {
      seedId: string|null,
      param1: string|null,
      param2: string|null,
      param3?: string|number|null,
      param4: any,
      sn?:number,
      timestamp?:number|Date
}