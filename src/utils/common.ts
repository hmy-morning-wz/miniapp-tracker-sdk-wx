import "../global"
export const getPagePath=()=>  {
  try {
    // var a = getCurrentPages()
    var a = getCurrentPages().pop()
    return a && a.route
  } catch (c) {
    console.warn('Tracker get current page path error:' + c)
  }
}
export const getMainInfo=()=> {
  var a = { url: getPagePath() }
  //console.log(a)
  return a
}

export const dateFormat=(t:number|Date, format:string ='yyyy-MM-dd hh:mm:ss.S')=> {
  var fmt = format //|| 'yyyy-MM-dd hh:mm:ss.S'
  if (typeof t !== 'object') {
    t = new Date(t)
  }
  var o = {
    'M+': t.getMonth() + 1, //月份
    'd+': t.getDate(), //日
    'h+': t.getHours(), //小时
    'm+': t.getMinutes(), //分
    's+': t.getSeconds(), //秒
    'q+': Math.floor((t.getMonth() + 3) / 3), //季度
    S: t.getMilliseconds() //毫秒
  }
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (t.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
  return fmt
}
export const dealExtra=(param:any):any=> {
  if(!param) return {}
  const prefix = "mtr-"
  let out = {};
  for (let n in param)
    if (param[n]!=undefined) {
      let a = (0 === n.indexOf(prefix)) ? n : prefix + n;
      out[a] = param[n];
    }
  return out;
}

export const  extend=(e, t) =>{
  for (var r in t) void 0 !== t[r] && (e[r] = t[r]);
  return e
}

export const _encodeStr=(e)=> {
  return 'string' == typeof e
    ? e.replace(/=|,|\^|\$\$/g, function(e) {
        switch (e) {
          case ',':
            return '%2C'
          case '^':
            return '%5E'
          case '$$':
            return '%24%24'
          case '=':
            return '%3D'
          default:
            return ' '
        }
      })
    : e
}

export const _formatExinfoParam=(e:any) =>{
  const t:string[] = []
  for (let r in e)
    {
      if(  e.hasOwnProperty(r) ) {
        let msg =""+ e[r]
        if('[object Object]'===msg) {
          msg = JSON.stringify(e[r])
          if(msg.length>=1024) {
            msg =  msg.substring(0,1024)
          }
        }
        t.push(r + '=' + _encodeStr(msg))
      }          
    }
  return t.join('^')
}

const TAG = 'Tracker'
export function logger(tag, ...payload) {
  console.debug(`%c [${TAG}]${tag}`, 'color: #649191; font-weight: bold', ...payload);
}
export function logInfo(tag, ...payload) {
  console.log(`%c [${TAG}]${tag}`, 'color: #b10ff7; font-weight: bold', ...payload);
}

//事件英文名称，可由小写字母、下划线、数字组成，并以小写字母开头，（长度为32个字符以内），不能重复，保存后不可修改
export const formatSeed=(seed:any)=>{
  let msg = ""+seed
  if(msg === '[object Object]') {
    msg = _formatExinfoParam(seed) //encodeURIComponent(JSON.stringify(seed))
  }
  msg = encodeURIComponent(msg)
  if(msg.indexOf('%')>-1) {
    let reg = new RegExp('%','g')
    msg=msg.replace(reg,"")
  }
  if(msg.length>=32) {
    msg =  msg.substring(0,32)
  }
  return msg.toLowerCase()
}



/**
 * 解析utf8字符串到16进制
 */
export function parseUtf8StringToHex(input) {
  input = unescape(encodeURIComponent(input))

  const length = input.length

  // 转换到字数组
  const words = []
  for (let i = 0; i < length; i++) {
    words[i >>> 2] |= (input.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8)
  }

  // 转换到16进制
  const hexChars = []
  for (let i = 0; i < length; i++) {
    const bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff
    hexChars.push((bite >>> 4).toString(16))
    hexChars.push((bite & 0x0f).toString(16))
  }

  return hexChars.join('')
}

/**
 * 解析arrayBuffer到16进制字符串
 */
export function parseArrayBufferToHex(input) {
  return Array.prototype.map.call(new Uint8Array(input), x => ('00' + x.toString(16)).slice(-2)).join('')
}

/**
 * 补全16进制字符串
 */
function leftPad(input, num) {
  if (input.length >= num) return input

  return (new Array(num - input.length + 1)).join('0') + input
}

/**
 * 转成16进制串
 */
export function arrayToHex(arr) {
  const words = []
  let j = 0
  for (let i = 0; i < arr.length * 2; i += 2) {
    words[i >>> 3] |= parseInt(arr[j], 10) << (24 - (i % 8) * 4)
    j++
  }

  // 转换到16进制
  const hexChars = []
  for (let i = 0; i < arr.length; i++) {
    const bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff
    hexChars.push((bite >>> 4).toString(16))
    hexChars.push((bite & 0x0f).toString(16))
  }

  return hexChars.join('')
}

/**
 * 转成utf8串
 */
export function arrayToUtf8(arr) {
  const words = []
  let j = 0
  for (let i = 0; i < arr.length * 2; i += 2) {
    words[i >>> 3] |= parseInt(arr[j], 10) << (24 - (i % 8) * 4)
    j++
  }

  try {
    const latin1Chars = []

    for (let i = 0; i < arr.length; i++) {
      const bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff
      latin1Chars.push(String.fromCharCode(bite))
    }

    return decodeURIComponent(escape(latin1Chars.join('')))
  } catch (e) {
    throw new Error('Malformed UTF-8 data')
  }
}

/**
 * 转成ascii码数组
 */
export function hexToArray(hexStr) {
  const words = []
  let hexStrLength = hexStr.length

  if (hexStrLength % 2 !== 0) {
    hexStr = leftPad(hexStr, hexStrLength + 1)
  }

  hexStrLength = hexStr.length

  for (let i = 0; i < hexStrLength; i += 2) {
    words.push(parseInt(hexStr.substr(i, 2), 16))
  }
  return words
}

export function arrayBufferToBase64(buffer) {
  let result = "";
  const uintArray = new Uint8Array(buffer);
  const byteLength = uintArray.byteLength;
  for (let i = 0; i < byteLength; i++) {
    result += String.fromCharCode(uintArray[i]);
  }
  return encode(result);
}

export function base64ToArrayBuffer(base64) {
  const string = decode(base64);
  const length = string.length;
  let uintArray = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    uintArray[i] = string.charCodeAt(i);
  }
  return uintArray.buffer;
}

function encode(str) {
  let encodings =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  const string = String(str);
  let result = "";
  let currentIndex = 0;
  let sum;
  while (
    string.charAt(0 | currentIndex) ||
    ((encodings = "="), currentIndex % 1)
  ) {
    currentIndex += 0.75; // 每次移动3/4个位置
    let currentCode = string.charCodeAt(currentIndex); // 获取code point
    if (currentCode > 255) {
      // 大于255无法处理
      throw new Error('"btoa" failed');
    }
    sum = (sum << 8) | currentCode; // 每次在上次的基础上左移8位再加上当前code point
    const encodeIndex = 63 & (sum >> (8 - (currentIndex % 1) * 8)); // 去除多余的位数，再去最后6位
    result += encodings.charAt(encodeIndex);
  }

  return result;
}

function decode(str) {
  const encodings =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let res = "";
  const string = String(str).replace(/=+$/, "");
  if (string.length % 4 === 1) {
    throw new Error('"atob" failed');
  }
  var o,
    r,
    i = 0,
    currentIndex = 0;
  while ((r = string.charAt(currentIndex))) {
    currentIndex = currentIndex + 1;
    r = encodings.indexOf(r);
    if (~r) {
      o = i % 4 ? 64 * o + r : r;
      if (i++ % 4) {
        res += String.fromCharCode(255 & (o >> ((-2 * i) & 6)));
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