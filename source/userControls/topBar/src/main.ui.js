/**
 * related to main.ui
 * 
 * @Author : and
 * @Timestamp : 2016-10-03
 */

// variable
var dojs = require("dojs");
var do_Page = sm("do_Page");
var root = ui("$");
// event
root.on("usreControlInit", function(_option) {
	// 调整大小，如果不需要系统状态栏，则高度减少40
	if (_option["noSystemStatusBar"]) {
		root.height = root.height - 40;
		ui("leftButton").y = ui("leftButton").y - 40;
		ui("rightButton").y = ui("rightButton").y - 40;
		ui("title_label").y = ui("title_label").y - 40;
	}
	root.redraw();
	// 修改title
	if (_option["titleLabel"]) {
		ui("title_label").set(_option["titleLabel"]);
	}
	// 支持背景色或背景图片
	var background = _option["background"];
	if (background) {
		if (background.indexOf("source://") >= 0 || background.indexOf("data://") >= 0) {
			root.bgImage = background;
		} else {
			root.bgColor = background;
		}
	}
	//
	if (_option["leftButton"]) {
		ui("leftImage").set(_option["leftButton"]);
	}
	if (_option["rightButton"]) {
		ui("rightImage").set(_option["rightButton"]);
	}
	//
	ui("leftButton").on("touch", function() {
		root.fire("onLeftButtonTouch")
	});
	ui("rightButton").on("touch", function() {
		root.fire("onRightButtonTouch")
	});

	dojs.style.css(ui("leftImage"), "dynamicButton");
	dojs.style.css(ui("rightImage"), "dynamicButton");

	if (_option["leftButtonAllowClose"]) {
		dojs.page.allowClose(ui("leftButton"));
	}
});
// private Function

