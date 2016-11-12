var dojs = require("dojs");

// ---------------------------------------------------------------
/**
 * app第一次启动出现的引导页， 先打开guide这个页面，通过这个页面再打开main页面，main页面点击“进入”后关闭main页面
 * ，然后回到guide页面，从guide页面再真正进入首页 使用这个module， 可以根据自己的要求，去修改template.ui里进入按钮的样式
 * 
 * @param _option
 *            选项参数
 */
module.exports.invoke = function(_option) {
	dojs.core.openPage({
		source : "source://modules/appGuidePage/src/guide.ui",
		animationType : "fade",
		data : _option,
		statusBarState : "transparent"
	});
};
