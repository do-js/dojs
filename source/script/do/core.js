//---------------------------------------------------------------
//核心基础服务
//version: 1.0.0
//---------------------------------------------------------------
var d1 = require("deviceone");

//递归获取配置项内容
function getOptions(c, os, p){
	p=p||"dOption";
	var od=os[p];
	if (!od)return;
	if ("dOption"!=p && od.parent!=p) getOptions(c, os, od.parent);
	for(var k in od){
		if (od[k]!=null) c[k]=od[k];
	}
}

//将对象转换成可输出的字符串
function o2string(o, needFormat) {
	if (!o) {
		return o;
	}
	if (typeof(o) == "object") {		
		if (o["_do_uniqueN"]) {
			if (o.getType() == "do_ListData") {
				o = o.getRange(0);
			} else if (o.getType() == "do_HashData") {
				o = o.getAll();
			}
		}
		if (needFormat){
			return JSON.stringify(o, null, 4);
		}
		else{
			return JSON.stringify(o);
		}
	}
	return o;
}

//输出调试信息
function print(o, tag){
	if (!tag) tag = typeof(o);
	d1.print(o2string(o, true), tag);
}

//获取一个新的UUID的值
function newUUID(){
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});
	return uuid;
};
//---------------------------------------------------------------
/**
 * 引用js类库 （如果不存在，则打印错误提示）
 * @param o js的文件名称，不包括扩展名的部分
 * @returns 返回对象库的引用
 */
module.exports.require = function(o){
	var r=require(o);
	if (r==null && o!="deviceone") print("未找到js引用库：" + o + ".js");
	return r;	
};

//---------------------------------------------------------------
/**
 * 把对象转换成可读的字符串
 * @param data 指定的对象
 * @param needFormat [可空] 是否需要格式化，默认：true
 */
module.exports.toString = function(data, needFormat){
	if (needFormat ==undefined || needFormat==null) needFormat=true;
	return o2string(data, needFormat);
};

//---------------------------------------------------------------
/**
 * 调试状态下，在IDE中打印信息
 * @param data 要打印的内容，可以是字符串、数字、对象或数组对象等
 * @param tag [可空] 类型标签
 */
module.exports.p = function(data,tag){
	print(data,tag);
};

//---------------------------------------------------------------
/**
 * 弹出提示信息
 * @param text 提示的内容
 * @param title 可空 提示的标题
 * @param func 可空 确认后的回调函数
 */
module.exports.alert = function(text, title, func){
	if (title && typeof(title) === "function" ){
		func=title;
		title="";
	}
	if (!title) title="";
	if (text && typeof(text) === "object" ){
		text = JSON.stringify(text);
	}
	if (title && typeof(title) === "object" ){
		title = JSON.stringify(title);
	}
	var do_Notification=d1.sm("do_Notification");
	do_Notification.alert(text, title, func);
};

//---------------------------------------------------------------
/**
 * 弹出提示的临时信息
 * @param o 弹出的内容，可以是字符串、数字、对象或数组对象等
 */
module.exports.toast = function(o){
	var do_Notification=d1.sm("do_Notification");
	do_Notification.toast(o2string(o));
};

//---------------------------------------------------------------
/**
 * 显示错误提示 （弹出屏幕临时信息，同时打印调试信息） 
 * @param o 弹出的内容，可以是字符串、数字、对象或数组对象等
 */
module.exports.error = function(o){
	var s=o2string(o);
	var do_Notification=d1.sm("do_Notification");
	do_Notification.toast(s);
};

//---------------------------------------------------------------
/**
 * 弹出新的页面
 * @param _options 同do_App中openPage的参数
 */
module.exports.openPage = function(_options){
	if ( typeof(_options) === "string" ) {
		_options = {source:_options};
	}
	var d=module.exports.getOptions(_options, "do/setting/coreSetting");
	var do_App = d1.sm("do_App");
	do_App.openPage(d);
};

//---------------------------------------------------------------
/**
 * 关闭最上层页面
 * @param _options 同do_App中closePage的参数
 */
module.exports.closePage = function(_options){
	var d=module.exports.getOptions(_options, "do/setting/coreSetting");
	var do_App = d1.sm("do_App");
	do_App.closePage(d);
};

//---------------------------------------------------------------
/**
 * 判断值是否为空值
 * @param data 判断的值
 */
module.exports.isNull = function(data){
	if (data ==undefined || data==null) return true;
	return false;
};

//---------------------------------------------------------------
/**
 * 判断值是否为空数据
 * @param data 判断的值
 */
module.exports.isNullData = function(data){
	if (data ==undefined || data==null) return true;
	if (typeof(data)=="string" && data.length <=0) return true;
	if (typeof(data)=="object"){
		var n = 0;
        for(var o in data){
                n++;
        }
        if (n<=0) return true;
	}
	return false;
};

//---------------------------------------------------------------
/**
 * 获取选项的配置 (用于js配置项的获取)
 * @param options 传入的自定义选项内容(也可以是选项名称)
 * @param file 相关配置文件名称（ 不包括.js扩展名）
 */
module.exports.getOptions = function(options, file){
	options = options || {}
	if (typeof(options)=="string"){
		options={parent:options};
	}
	var st=require(file);
	if (st && st.options){
		var c={};
		getOptions(c, st.options, options.parent);
		for(var k in options){
			if (options[k]!=null) c[k]=options[k];
		}
		options=c;
	}
	return options;
};

//---------------------------------------------------------------
/**
 * 获取一个新的UUID的值
 */
module.exports.getUUID = function(){
	return newUUID();
};

//---------------------------------------------------------------
/**
 * 判断当前是否处于Page页面的环境下 (非app.js的入口环境)
 */
module.exports.inPage = function(){
	return __address !=undefined && __address!=null && __address.length >0;
};
