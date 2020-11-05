import { MTR } from "./mtr";
import { TrackerApi, TrackerAppApi, TrackerPageApi, TrackerComponentApi } from "../interface";
import { TrackerData, API } from "../type";
declare class TrackerClass implements TrackerApi {
    data: TrackerData;
    Mtr: MTR;
    App: TrackerAppApi;
    Page: TrackerPageApi;
    Component: TrackerComponentApi;
    constructor(data: TrackerData);
    log(seed: string, p?: any): number;
    err(r: string, seed: string | any, p?: any): number;
    click(seed: string, param?: any): number;
    calc(seed: string, n: number, p4?: any): number;
    expo(seed: string, dir?: string, param?: any): number;
    setUserId(userId: string): void;
    getUserId(): string;
    api(data: API): number;
    setData(key: string, value: string): void;
}
declare const Tracker: TrackerClass;
export default Tracker;
