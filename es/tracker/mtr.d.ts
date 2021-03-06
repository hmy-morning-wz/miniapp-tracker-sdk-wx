import { API, RemoteLogType } from "../type";
import { Event } from "../interface";
export declare class MTR implements Event {
    cfg: {
        pageSeedId: string;
        clkSeedId: string;
        calcSeedId: string;
        expoSeedId: string;
        syslogSeedId: string;
        apiSeedId: string;
    };
    data: any;
    userId: string;
    appVersion: string;
    miniVersion: string;
    mtrVer: string;
    mtrDebug: boolean;
    mPageState: string;
    platformType: string;
    bizScenario: string;
    autoStart: boolean;
    autoError: boolean;
    autoClick: boolean;
    eventType: string;
    bizType: string;
    expotTimeout: number;
    servers: any[];
    expoSection: any[];
    appId: string;
    url: string | null;
    _ready: boolean;
    sendError: number;
    sendSuccess: number;
    sendCounter: number;
    timezoneOffset: number;
    requestList: any[];
    batchSendList: any[];
    callList: any[];
    requestTimestamp: number;
    sendIng: number;
    sn: number;
    visitorList: any[];
    timezone: number;
    onLaunch: any;
    sessionId: any;
    appName: any;
    mPlatformType: any;
    deviceModel: any;
    location: any;
    workspaceId: string;
    ref: string;
    os: string;
    osVersion: string;
    networkType: string;
    language: string;
    screen: any;
    cPageUrl: string;
    jumpPage: string;
    pageJumpTime: number;
    pageLoadTime: number;
    startTime: number;
    pageHideTime: number;
    isCollected: boolean;
    prefix: string;
    stat_share_app: boolean;
    stat_pull_down_fresh: boolean;
    stat_page_scroll: boolean;
    stat_hide: boolean;
    stat_unload: boolean;
    stat_reach_bottom: boolean;
    stat_auto_click: boolean;
    stat_api: boolean;
    stat_api_success: boolean;
    stat_api_long_time: number;
    stat_api_fail: boolean;
    stat_auto_apperr: boolean;
    server: any;
    baseInfo: any;
    code: string[];
    msg: string[];
    refAction: string;
    scene: string;
    referrerAppId: string;
    stat_location: boolean;
    refActionList: string[];
    stat_app_launch: boolean;
    stat_app_show: boolean;
    stat_auto_expo: boolean;
    stat_sw: boolean;
    stat_batch_send: boolean;
    batchSendTimerId: number;
    onLaunchOption: any;
    Tracert: any;
    traceHashCode: string;
    constructor(config: any);
    _start(): void;
    start(): void;
    batchSend(): void;
    _send(msg: any, option?: any): void;
    _trueUserId(): string;
    _getSessionId(): any;
    _getUUid(): any;
    _formatRemoteParam(msg: any): any;
    _now(): Date;
    _getSN(): number;
    traceId(): string;
    _packFinalData(data: RemoteLogType): string;
    _remoteLog(msg: RemoteLogType, option?: any): number;
    getUserId(): string;
    setUserId(userId: string): void;
    logJump(currentPage: string, to: string, param?: any): void;
    onAppHide(): void;
    onAppError(err: any): void;
    pagePv(t: string, param?: any): number;
    appEvent(event: string, param?: any): void;
    click(url: string | null, seed: string, param?: any, inter?: boolean): number;
    calc(url: string | null, r: string, n: number, param?: any, inter?: boolean): number;
    expo(url: string | null, item: string, dir?: string, data?: any): number;
    log(r: string, param?: any): number;
    err(r: string, n: string | any, param?: any): number;
    api(param: API): number;
    setData(key: string, value: string): void;
}
