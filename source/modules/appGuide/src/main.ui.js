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

// event
sm("do_Page").on("loaded", function() {
	dojs.core.openPage({
		source : "source://modules/appGuide/src/guide.ui",
		animationType : "fade",
		data : data,
		statusBarState : "transparent"
	});
	var background = data["background"];
	if (background) {
		if (background.indexOf("http") >= 0 || background.indexOf("source://") >= 0 || background.indexOf("data://") >= 0) {
			ui("$").bgImage = background;
		} else {
			ui("$").bgColor = background;
		}
	}
}).on("result", function() {
	dojs.core.openPage(data.openPageOption);
})