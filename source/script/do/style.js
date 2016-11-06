//---------------------------------------------------------------
//设置ui的风格（包括：属性和事件）
//为了方便当前文件的升级，不建议直接修改该文件，如果需要修改相关的配置，请在styleSetting.js中修改
//version: 1.0.0
//---------------------------------------------------------------
var core=require("do/core");
var d1=require("deviceone");
var do_Global = d1.sm("do_Global");

//---------------------------------------------------------------
/**
 * 设置ui控件的风格（包括属性和事件）
 * @param ui 要设置的ui控件对象
 * @param options 是传入的选项内容，要求为json格式的数据。（用于设置ui的属性和事件）
 */
module.exports.css = function(ui, options){
	var d=core.getOptions(options, "mySetting/styleSetting");
	d=core.getOptions(d, "do/defaultSetting/styleSetting");
	var as=null;
	for(var k in d){
		var v=d[k];
		if (v.length > 1 && v.indexOf("@")==0){
			v=do_Global.getMemory(v.substr(1));
		}
		if (typeof(v)=="function"){
			ui.on(k,v);
			continue;
		}
		if (!as) as={};
		as[k]=v;
	}
	if (as) ui.set(as);
};

