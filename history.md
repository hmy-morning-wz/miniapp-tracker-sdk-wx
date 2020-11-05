###  2020-7-5
 data-mtrignore="1"  忽略自动埋点
 data-mtrpagedata="currentItemId,xxxx"  从this.data 上传字段 currentItemId ,xxxx
 data-mtrappdata="appId,xxxx"  getApp().globalData 上传字段 appId , xxxx

### 2020-7-2
适配微信小程序

### 2020-5-6
#### 修改1
改成typescript
#### 修改2 
加入单元测试 
#### 修改3 
加入refAction ，用来跟踪路径

#### 修改4
其他修改，如onLaunch 事件，页面停留，Tracker.api( )



## 2020-4-30
request 加 traceId //todo

userId 放到globalData ，业务代码里实现


## 2020-4-29
#### 修改1
    app.Tracker.log( )
    app.Tracker.api( )  //回传api异常 埋点request 有noTracker: true, 自动，不会被hook
    app.Tracker.err( )
加上 my.reportAnalytics   seedName 最大32字节小写字母开头
 

#### 修改3
   埋点失败加 my.reportAnalytics   
