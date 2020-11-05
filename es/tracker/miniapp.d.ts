import { MTR } from "./mtr";
import { TrackerAppApi, TrackerPageApi, TrackerComponentApi } from "../interface";
export declare function Hook(obj: any, funName: string, hook: any): void;
export declare class TrackerApp implements TrackerAppApi {
    Mtr: MTR;
    constructor(Mtr: MTR);
    init(config: any): void;
    config(config: any): void;
    onLaunch(): (option: any) => void;
    onHide(): () => void;
    onError(): (e: any) => void;
    onShow(): (option: any) => void;
}
export declare class TrackerPage implements TrackerPageApi {
    Mtr: MTR;
    constructor(Mtr: MTR);
    init(): void;
    onLoad(): (query: any) => void;
    onShow(): () => void;
    onPageScroll(): () => void;
    onReachBottom(): () => void;
    onHide(): () => void;
    onPullDownRefresh(): () => void;
    onUnload(): () => void;
    _hook(page: any): any;
}
export declare class TrackerComponent implements TrackerComponentApi {
    Mtr: MTR;
    constructor(Mtr: MTR);
    init(): void;
    _hook(c: any): any;
}
