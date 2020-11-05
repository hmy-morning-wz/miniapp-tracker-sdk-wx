# 概述 
### 适用于微信小程序和支付宝小程序



# 发布  
私有cnpm web:
http://10.0.0.122:7002



第一次 adduser 

cnpm adduser --registry=http://10.0.0.122:7001



第二次 login

cnpm login --registry=http://10.0.0.122:7001





发布

cnpm publish --registry=http://10.0.0.122:7001


# install

文件 .npmrc 配置
@tklc:registry=http://10.0.0.122:7001

### 只需app.js 引用和配置mtrConfig
npm install @tklc/miniapp-tracker-sdk --save  

app.js

```
import from '@tklc/miniapp-tracker-sdk'
App({
   mtrConfig{
     appId:'2019022763399300',// 区别不同小程序，可用小程序自己的appId
     server:['https://webtrack.allcitygo.com:8088/event/upload'],
     version:'1.0',//更新小程序请更新此版本  
     appName:"苏州小程序",
     //bizScenario:‘xxxxx’, 不传入此值会去自动从options取渠道字段   
     mtrDebug:false//log开关
   }


  onLaunch(options){
  //Tracker.App.init() 此方法已经弃用，不需要在此调用

....
  }

.....

```

page:（现版本不用在Page里面init）


```
const app = getApp();

Page({
  onLoad() {
    //app.Tracker.Page.init() 此方法已经弃用，不需要在此调用



  },

```
Tracker.App.init() 和 Tracker.Page.init() 已经弃用，不需调用 ，已经自动hook App 和  Page 生命周期和 Page的onTap响应方法

# userId

```
 app.getUserInfo().then(
      user => {
        this.setData({
          user,
        });
          app.Tracker.setUserId(user.userId)
      },
      () => {
        // 获取用户信息失败
      }
    );

```

# API

页面自动埋点

# 埋点说明
页面已自动埋点,埋点后管可以圈选事件。 但如有运营需求才需配置data-group  data-index 等参数

点击埋点 xml配置
~~~
<view class="service-item" a:for="{{my_service_icon.ele_icons}}" >
                <image class="icon-logo" src="{{item.icon_img}}" mode="widthFix"  
                data-seed="埋点seed名称"
                data-group="卡面" data-index="{{index}}"
                data-obj="{{item}}" 
                onTap="handleIconClick"/>
                <text class="text">{{item.icon_name}}</text>
            </view>
~~~
 data-obj  里要带 icon_name ，url_path，url_type，url_data，url_remark， 点击事件会传过去

注意事项： 需要配置data-group(板块) 和 data-index(位置， 有a:for的才有)
如
data-group="卡面" data-index="{{index}}"

### 其他字段
 data-mtrignore="1"  忽略自动埋点
 data-mtrpagedata="currentItemId,xxxx"  从this.data 上传字段 currentItemId ,xxxx
 data-mtrappdata="appId,xxxx"  getApp().globalData 上传字段 appId , xxxx







点击事件手动埋点  
 如 app.Tracker.click('seedName1',{a:1,b:2})  
错误日志上送：  
 app.Tracker.err('tag','error msg',{})  
一般日志上送  
 app.Tracker.log('test Log',{})  
上送有数值的埋点事件  
 app.Tracker.calc('seedNameCalc',10,{})

```
const app = getApp();

    app.Tracker.log('test Log')
    app.Tracker.calc('seedNameCalc',10)
    app.Tracker.err('tag','error msg')
    app.Tracker.click('seedName1',{a:1,b:2})
    app.Tracker.setUserId(user)
```

page 页面里面  
this.$mtr_click() 对应 app.Tracker.click()  
this.$mtr_calc() 对应 app.Tracker.calc()  
this.$mtr_expo() 对应 app.Tracker.expo()  



## 埋点功能

### 页面PV
### 自动Hook页面 点击和曝光等方法，onShow 生命周期
### 自动Hook 网络请求
### 配置内容 appId， appName，小程序版本
### 扩展4标准字段：group，index
### userId 从访客到获得userId 自动补发访客数据，记录userId
### 自动生成设备id
### 自动获得渠道信息

### SPM
Mtr.Tracert && Mtr.Tracert.expoContent('c100', '1.cdp.item.SKU1.291.3.20190809', '','');
Mtr.Tracert && Mtr.Tracert.clickContent('c100.d100', '', '', '');


data-spmId="${spmAPos}.${spmBPos}.c_N.d"  data-scm="${system}.${subsystem}.item.${sellerId}.${traceId}"  data-index="{{index}}"
