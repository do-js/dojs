var d1 = require("deviceone");
var dojs=require("dojs");

var module_scanBarcode_callback=null;
//---------------------------------------------------------------
/**
 * 二维码扫描
 * @param _option 选项参数
 * @param _callback 回调函数
 */
module.exports.invoke = function(_option, _callback){
	module_scanBarcode_callback=_callback;
	dojs.core.openPage({
		source:"source://modules/scanBarcode/src/main.ui", 
		animationType:"push_r2l_1",
		data:_option,
		statusBarState:"transparent"
	});	
};

if (!dojs.core.inPage()){
	dojs.core.error("不允许在app.js中调用 scanBarcode 模块");
}
else{
	d1.sm("do_Page").on("result", function(data){
		if (dojs.core.isNull(data) ||
				dojs.core.isNull(data.moduleType) ||
				data.moduleType != "$$scanBarcode$$" ||
				!module_scanBarcode_callback) return;
		module_scanBarcode_callback.call(this, data.result);		
	});
}
