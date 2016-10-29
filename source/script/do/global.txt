封装一些常用的全局函数

global.js中目前对外提供了以下几个方法：
//当前是否为调试状态
isDebug = function(options)
//获取当前操作系统类型(可能的值包括：android，iPhone OS, iPad OS等
getOS = function()
//获取当前操作系统的版本
getOSVersion = function()
//获取当前设备的ID
getDeviceID = function()
//获取当前设备的名称
getDeviceName = function()

首先，在调用这些函数之前，不要忘了引入global.js库：
//-----------------------------------------
//main.ui.js中的代码：
var global=require("do/global");
//-----------------------------------------
