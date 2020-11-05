declare let api: {
    getStorage(data: {
        key: string;
        success: any;
        complete: any;
    }): void;
    setStorage({ key: key, data: data }: {
        key: any;
        data: any;
    }): void;
    getAppIdSync(): any;
    canIUse(api: string): boolean;
    reportAnalytics(seed: string, data: any): void;
    getStorageSync({ key: key }: {
        key: any;
    }): {
        data: any;
    };
    setStorageSync({ key: key, data: data }: {
        key: any;
        data: any;
    }): void;
    getSystemInfo(data: {
        success: any;
        complete: any;
    }): void;
    getNetworkType(data: {
        success: any;
        complete: any;
    }): void;
    request(data: any): void;
    getLocation(data: any): void;
    getRunScene(data: any): void;
    isCollected(data: any): void;
    isIDE: boolean;
};
export default api;
