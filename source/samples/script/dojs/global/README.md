封装一些常用的全局函数

# 功能分类
global.js中目前对外提供了以下几个方法：

###1. 当前是否为调试状态
isDebug = function(options)

###2. 获取当前操作系统类型(可能的值包括：android，iPhone OS, iPad OS等
getOS = function()

###3. 获取当前操作系统的版本
getOSVersion = function()

###4. 获取当前设备的ID
getDeviceID = function()

###5. 获取当前设备的名称
getDeviceName = function()

#使用方法

###0. 首先，在调用这些函数之前，不要忘了引入dojs.js库：

```JavaScript
//main.ui.js中的代码：
var dojs=require("dojs");
```
