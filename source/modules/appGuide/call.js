var d1 = require("deviceone");
var dojs = require("dojs");

// ---------------------------------------------------------------
/**
 * 应用的导览页
 * 
 * @param _option
 *            选项参数
 */
var module_appGuide_callbackFile=null;
module.exports.invoke = function(_option) {
	module_appGuide_callbackFile=_option.onCallback;
	if (!dojs.core.inPage()){
		//从app.js进入，需要先打开一个底层基础页，
		//防止关闭导览页时直接退出应用(IOS低版本容易出现这个问题)
		dojs.core.openPage({
			source : "source://modules/appGuide/src/base.ui",
			animationType : "fade",
			data : _option,
			statusBarState : "transparent"
		});
	}
	else{
		dojs.core.openPage({
			source : "source://modules/appGuide/src/main.ui",
			animationType : "fade",
			data : _option,
			statusBarState : "transparent"
		});
	}	
};
if (dojs.core.inPage()){
	d1.sm("do_Page").on("result", function(data){
		if (dojs.core.isNull(data) ||
				dojs.core.isNull(data.moduleType) ||
				data.moduleType != "$$appGuide$$" ||
				dojs.core.isNullData(module_appGuide_callbackFile)) return;
		var _jsFile=require(module_appGuide_callbackFile);
		_jsFile.invoke();
	});	
}
