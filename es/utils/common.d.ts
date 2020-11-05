import "../global";
export declare const getPagePath: () => any;
export declare const getMainInfo: () => {
    url: any;
};
export declare const dateFormat: (t: number | Date, format?: string) => string;
export declare const dealExtra: (param: any) => any;
export declare const extend: (e: any, t: any) => any;
export declare const _encodeStr: (e: any) => any;
export declare const _formatExinfoParam: (e: any) => string;
export declare function logger(tag: any, ...payload: any[]): void;
export declare function logInfo(tag: any, ...payload: any[]): void;
export declare const formatSeed: (seed: any) => string;
/**
 * 解析utf8字符串到16进制
 */
export declare function parseUtf8StringToHex(input: any): string;
/**
 * 解析arrayBuffer到16进制字符串
 */
export declare function parseArrayBufferToHex(input: any): any;
/**
 * 转成16进制串
 */
export declare function arrayToHex(arr: any): string;
/**
 * 转成utf8串
 */
export declare function arrayToUtf8(arr: any): string;
/**
 * 转成ascii码数组
 */
export declare function hexToArray(hexStr: any): never[];
export declare function arrayBufferToBase64(buffer: any): string;
export declare function base64ToArrayBuffer(base64: any): ArrayBuffer;
