/**
 * related to guide.ui
 * 
 * @Author : zxhuizhi@126.com
 * @Timestamp : 2016-11-12
 */
// 先打开这个页面，通过这个页面再打开main页面，main页面点击“进入”后关闭main页面
// ，然后回到guide页面，从guide页面再真正进入首页
var dojs = require("dojs");
var data = sm("do_Page").getData();

var currentOption=data;
// event
sm("do_Page").on("loaded", function() {
	dojs.core.openPage({
		source : "source://modules/appGuide/src/main.ui",
		animationType : "fade",
		data : currentOption,
		statusBarState : "transparent"
	});
});