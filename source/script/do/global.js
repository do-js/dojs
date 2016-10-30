//---------------------------------------------------------------
//封装一些常用的全局函数
//为了方便当前文件的升级，不建议直接修改该文件，如果需要修改相关的配置，请在globalSetting.js中修改
//version: 1.0.0
//---------------------------------------------------------------
var core=require("do/core");
var d1=require("deviceone");

/**
 * 当前是否为调试状态
 */
module.exports.isDebug = function(options){
	var d=core.getOptions(options, "do/defaultSetting/globalSetting");
	return d.isDebugStatus;
};

/**
 * 获取当前操作系统类型(可能的值包括：android，iPhone OS, iPad OS等
 */
module.exports.getOS = function(){
	var do_Device=d1.sm("do_Device");
	var dInfo=do_Device.getInfo().OS;
	return dInfo;
};

/**
 * 判断当前系统是否是IOS
 */
module.exports.isIOS = function(){
	var do_Device=d1.sm("do_Device");
	var dInfo=do_Device.getInfo().OS;
	return dInfo=="iPhone OS" || dInfo=="iPad OS" ;
};

/**
 * 判断当前系统是否是Android
 */
module.exports.isAndroid = function(){
	var do_Device=d1.sm("do_Device");
	var dInfo=do_Device.getInfo().OS;
	return dInfo=="android";
};

/**
 * 判断当前系统是否是Windows
 */
module.exports.isWindows = function(){
	var do_Device=d1.sm("do_Device");
	var dInfo=do_Device.getInfo().OS;
	return dInfo=="WINDOWS";
};

/**
 * 获取当前操作系统的版本
 */
module.exports.getOSVersion = function(){
	var do_Device=d1.sm("do_Device");
	var dInfo=do_Device.getInfo();
	return dInfo.OSVersion;
};

/**
 * 获取当前设备的ID
 */
module.exports.getDeviceID = function(){
	var do_Device=d1.sm("do_Device");
	var dInfo=do_Device.getInfo();
	return dInfo.deviceId;
};

/**
 * 获取当前设备的名称
 */
module.exports.getDeviceName = function(){
	var do_Device=d1.sm("do_Device");
	var dInfo=do_Device.getInfo();
	return dInfo.deviceName;
};

