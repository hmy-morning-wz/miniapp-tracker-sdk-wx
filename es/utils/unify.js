var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var api = {
    getStorage: function getStorage(data) {},
    setStorage: function setStorage(_ref) {
        var key = _ref.key,
            data = _ref.data;
    },
    getAppIdSync: function getAppIdSync() {
        return;
    },
    canIUse: function canIUse(api) {
        return;
    },
    reportAnalytics: function reportAnalytics(seed, data) {},
    getStorageSync: function getStorageSync(_ref2) {
        var key = _ref2.key;

        return;
    },
    setStorageSync: function setStorageSync(_ref3) {
        var key = _ref3.key,
            data = _ref3.data;
    },
    getSystemInfo: function getSystemInfo(data) {
        return;
    },
    getNetworkType: function getNetworkType(data) {},
    request: function request(data) {},
    getLocation: function getLocation(data) {},
    getRunScene: function getRunScene(data) {},
    isCollected: function isCollected(data) {},

    isIDE: false
};
var myApi = typeof my !== 'undefined';
//@ts-ignore
var wxApi = typeof wx !== 'undefined';
if (myApi) {
    api = _extends(api, my);
} else if (wxApi) {
    //@ts-ignore
    api = _extends(api, wx);
}
export default api;