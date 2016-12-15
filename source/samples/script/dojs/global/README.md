## global.js : 封装一些常用的全局函数

####对外提供了以下几个方法：

	isDebug(options) //当前是否为调试状态,调试状态设置在defaultSetting/globalSetting.js里的isDebugStatus属性
	getOS() //获取当前操作系统类型(可能的值包括：android，iPhone OS, iPad OS等)
	getOSVersion() //获取当前操作系统的版本
	getDeviceID() //获取当前设备的ID,可以作为设备的唯一标示
	getDeviceName() //获取当前设备的名称

#### 使用方法:

```JavaScript
var dojs = require("dojs");

var os = dojs.global.getOS();


```