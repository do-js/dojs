var dojs = require("dojs");

// ---------------------------------------------------------------
/**
 * 应用的导览页
 * 
 * @param _option
 *            选项参数
 */
module.exports.invoke = function(_option) {
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
