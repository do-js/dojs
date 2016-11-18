var d1 = require("deviceone");
var dojs = require("dojs");

// ---------------------------------------------------------------
/**
 * 应用的导览页
 * 
 * @param _option
 *            选项参数
 */
var module_appGuide_callback=null;
module.exports.invoke = function(_option) {
	module_appGuide_callback=_option.onCallback;
	dojs.core.openPage({
		source : "source://modules/appGuide/src/main.ui",
		animationType : "fade",
		data : _option,
		statusBarState : "transparent"
	});
};
if (!dojs.core.inPage()){
	dojs.core.error("不允许在app.js中调用 appGuide 模块");
}
else{
	d1.sm("do_Page").on("result", function(data){
		if (dojs.core.isNull(data) ||
				dojs.core.isNull(data.moduleType) ||
				data.moduleType != "$$appGuide$$" ||
				dojs.core.isNullData(module_appGuide_callback)) return;
		dojs.core.callFunction(module_appGuide_callback, data);
	});	
}
