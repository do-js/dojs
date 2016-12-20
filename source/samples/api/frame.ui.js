/**
 * related to frame.ui
 * 
 * @Author : and
 * @Timestamp : 2016-12-20
 */
// require
var userControl = require("source://userControls/userControl");
// variable
var data = sm("do_Page").getData();
// initialize
(function() {
	initTopbar();
	ui("do_LinearLayout_1").add("id1", data.entry);
})();

// private function
function initTopbar() {
	userControl.addView(ui("$"), "topBar", {
		// 背景图片或颜色，如下为图片，也可以是FF0000FF这种颜色值
		background : "000000FF",
		// 包括系统状态栏，则高度为128，否则为88
		noSystemStatusBar : true,
		// 左边按钮是一个do_ImageView,可以设置这个组件的任何属性
		leftButton : {
			source : "source://userControls/topBar/sample/return.png",
		},
		// 右边按钮是一个do_ImageView,可以设置这个组件的任何属性

		// 是否允许左边按钮点击的时候关闭当前page，缺省是false
		leftButtonAllowClose : true,
		// 中间的title是一个label，可以设置它的任意有效属性
		titleLabel : {
			text : data.id
		},
		// 点击左边按钮触发的回调
		onLeftButtonTouch : function() {
			
		}
	});
}