var dojs = require("dojs");
/**
 * topBar宽固定是750，高固定为128或88，x，y固定为0，0
 */
module.exports.demo = function(_parent) {
	var userControl = require("source://userControls/userControl");
	userControl.addView(_parent, "topBar", {
		// 背景图片或颜色，如下为图片，也可以是FF0000FF这种颜色值
		background : "source://userControls/topBar/sample/background.jpg",
		// 包括系统状态栏，则高度为128，否则为88
		noSystemStatusBar : false,
		// 左边按钮是一个do_ImageView,可以设置这个组件的任何属性
		leftButton : {
			source : "source://userControls/topBar/sample/return.png",
		},
		// 右边按钮是一个do_ImageView,可以设置这个组件的任何属性
		rightButton : {
			source : "source://userControls/topBar/sample/add.png",
		},
		// 是否允许左边按钮点击的时候关闭当前page，缺省是false
		leftButtonAllowClose : true,
		// 中间的title是一个label，可以设置它的任意有效属性
		titleLabel : {
			text : "我是TopBar1"
		},
		// 点击左边按钮触发的回调
		onLeftButtonTouch : function() {
			dojs.core.toast("点击左边按钮");
		},
		// 点击右边边按钮触发的回调
		onRightButtonTouch : function() {
			dojs.core.toast("点击右边按钮");
		}
	});
}