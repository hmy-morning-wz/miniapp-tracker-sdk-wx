var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import "../global";
export var getPagePath = function getPagePath() {
    try {
        // var a = getCurrentPages()
        var a = getCurrentPages().pop();
        return a && a.route;
    } catch (c) {
        console.warn('Tracker get current page path error:' + c);
    }
};
export var getMainInfo = function getMainInfo() {
    var a = { url: getPagePath() };
    //console.log(a)
    return a;
};
export var dateFormat = function dateFormat(t) {
    var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'yyyy-MM-dd hh:mm:ss.S';

    var fmt = format; //|| 'yyyy-MM-dd hh:mm:ss.S'
    if ((typeof t === 'undefined' ? 'undefined' : _typeof(t)) !== 'object') {
        t = new Date(t);
    }
    var o = {
        'M+': t.getMonth() + 1,
        'd+': t.getDate(),
        'h+': t.getHours(),
        'm+': t.getMinutes(),
        's+': t.getSeconds(),
        'q+': Math.floor((t.getMonth() + 3) / 3),
        S: t.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (t.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }return fmt;
};
export var dealExtra = function dealExtra(param) {
    if (!param) return {};
    var prefix = "mtr-";
    var out = {};
    for (var n in param) {
        if (param[n] != undefined) {
            var a = 0 === n.indexOf(prefix) ? n : prefix + n;
            out[a] = param[n];
        }
    }return out;
};
export var extend = function extend(e, t) {
    for (var r in t) {
        void 0 !== t[r] && (e[r] = t[r]);
    }return e;
};
export var _encodeStr = function _encodeStr(e) {
    return 'string' == typeof e ? e.replace(/=|,|\^|\$\$/g, function (e) {
        switch (e) {
            case ',':
                return '%2C';
            case '^':
                return '%5E';
            case '$$':
                return '%24%24';
            case '=':
                return '%3D';
            default:
                return ' ';
        }
    }) : e;
};
export var _formatExinfoParam = function _formatExinfoParam(e) {
    var t = [];
    for (var r in e) {
        if (e.hasOwnProperty(r)) {
            var msg = "" + e[r];
            if ('[object Object]' === msg) {
                msg = JSON.stringify(e[r]);
                if (msg.length >= 1024) {
                    msg = msg.substring(0, 1024);
                }
            }
            t.push(r + '=' + _encodeStr(msg));
        }
    }
    return t.join('^');
};
var TAG = 'Tracker';
export function logger(tag) {
    var _console;

    for (var _len = arguments.length, payload = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        payload[_key - 1] = arguments[_key];
    }

    (_console = console).debug.apply(_console, ['%c [' + TAG + ']' + tag, 'color: #649191; font-weight: bold'].concat(payload));
}
export function logInfo(tag) {
    var _console2;

    for (var _len2 = arguments.length, payload = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        payload[_key2 - 1] = arguments[_key2];
    }

    (_console2 = console).log.apply(_console2, ['%c [' + TAG + ']' + tag, 'color: #b10ff7; font-weight: bold'].concat(payload));
}
//事件英文名称，可由小写字母、下划线、数字组成，并以小写字母开头，（长度为32个字符以内），不能重复，保存后不可修改
export var formatSeed = function formatSeed(seed) {
    var msg = "" + seed;
    if (msg === '[object Object]') {
        msg = _formatExinfoParam(seed); //encodeURIComponent(JSON.stringify(seed))
    }
    msg = encodeURIComponent(msg);
    if (msg.indexOf('%') > -1) {
        var reg = new RegExp('%', 'g');
        msg = msg.replace(reg, "");
    }
    if (msg.length >= 32) {
        msg = msg.substring(0, 32);
    }
    return msg.toLowerCase();
};
/**
 * 解析utf8字符串到16进制
 */
export function parseUtf8StringToHex(input) {
    input = unescape(encodeURIComponent(input));
    var length = input.length;
    // 转换到字数组
    var words = [];
    for (var i = 0; i < length; i++) {
        words[i >>> 2] |= (input.charCodeAt(i) & 0xff) << 24 - i % 4 * 8;
    }
    // 转换到16进制
    var hexChars = [];
    for (var _i = 0; _i < length; _i++) {
        var bite = words[_i >>> 2] >>> 24 - _i % 4 * 8 & 0xff;
        hexChars.push((bite >>> 4).toString(16));
        hexChars.push((bite & 0x0f).toString(16));
    }
    return hexChars.join('');
}
/**
 * 解析arrayBuffer到16进制字符串
 */
export function parseArrayBufferToHex(input) {
    return Array.prototype.map.call(new Uint8Array(input), function (x) {
        return ('00' + x.toString(16)).slice(-2);
    }).join('');
}
/**
 * 补全16进制字符串
 */
function leftPad(input, num) {
    if (input.length >= num) return input;
    return new Array(num - input.length + 1).join('0') + input;
}
/**
 * 转成16进制串
 */
export function arrayToHex(arr) {
    var words = [];
    var j = 0;
    for (var i = 0; i < arr.length * 2; i += 2) {
        words[i >>> 3] |= parseInt(arr[j], 10) << 24 - i % 8 * 4;
        j++;
    }
    // 转换到16进制
    var hexChars = [];
    for (var _i2 = 0; _i2 < arr.length; _i2++) {
        var bite = words[_i2 >>> 2] >>> 24 - _i2 % 4 * 8 & 0xff;
        hexChars.push((bite >>> 4).toString(16));
        hexChars.push((bite & 0x0f).toString(16));
    }
    return hexChars.join('');
}
/**
 * 转成utf8串
 */
export function arrayToUtf8(arr) {
    var words = [];
    var j = 0;
    for (var i = 0; i < arr.length * 2; i += 2) {
        words[i >>> 3] |= parseInt(arr[j], 10) << 24 - i % 8 * 4;
        j++;
    }
    try {
        var latin1Chars = [];
        for (var _i3 = 0; _i3 < arr.length; _i3++) {
            var bite = words[_i3 >>> 2] >>> 24 - _i3 % 4 * 8 & 0xff;
            latin1Chars.push(String.fromCharCode(bite));
        }
        return decodeURIComponent(escape(latin1Chars.join('')));
    } catch (e) {
        throw new Error('Malformed UTF-8 data');
    }
}
/**
 * 转成ascii码数组
 */
export function hexToArray(hexStr) {
    var words = [];
    var hexStrLength = hexStr.length;
    if (hexStrLength % 2 !== 0) {
        hexStr = leftPad(hexStr, hexStrLength + 1);
    }
    hexStrLength = hexStr.length;
    for (var i = 0; i < hexStrLength; i += 2) {
        words.push(parseInt(hexStr.substr(i, 2), 16));
    }
    return words;
}
export function arrayBufferToBase64(buffer) {
    var result = "";
    var uintArray = new Uint8Array(buffer);
    var byteLength = uintArray.byteLength;
    for (var i = 0; i < byteLength; i++) {
        result += String.fromCharCode(uintArray[i]);
    }
    return encode(result);
}
export function base64ToArrayBuffer(base64) {
    var string = decode(base64);
    var length = string.length;
    var uintArray = new Uint8Array(length);
    for (var i = 0; i < length; i++) {
        uintArray[i] = string.charCodeAt(i);
    }
    return uintArray.buffer;
}
function encode(str) {
    var encodings = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var string = String(str);
    var result = "";
    var currentIndex = 0;
    var sum = void 0;
    while (string.charAt(0 | currentIndex) || (encodings = "=", currentIndex % 1)) {
        currentIndex += 0.75; // 每次移动3/4个位置
        var currentCode = string.charCodeAt(currentIndex); // 获取code point
        if (currentCode > 255) {
            // 大于255无法处理
            throw new Error('"btoa" failed');
        }
        sum = sum << 8 | currentCode; // 每次在上次的基础上左移8位再加上当前code point
        var encodeIndex = 63 & sum >> 8 - currentIndex % 1 * 8; // 去除多余的位数，再去最后6位
        result += encodings.charAt(encodeIndex);
    }
    return result;
}
function decode(str) {
    var encodings = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var res = "";
    var string = String(str).replace(/=+$/, "");
    if (string.length % 4 === 1) {
        throw new Error('"atob" failed');
    }
    var o,
        r,
        i = 0,
        currentIndex = 0;
    while (r = string.charAt(currentIndex)) {
        currentIndex = currentIndex + 1;
        r = encodings.indexOf(r);
        if (~r) {
            o = i % 4 ? 64 * o + r : r;
            if (i++ % 4) {
                res += String.fromCharCode(255 & o >> (-2 * i & 6));
            }
        }
    }
    return res;
}
/*
export default {
  arrayBufferToBase64,
  base64ToArrayBuffer
};*/