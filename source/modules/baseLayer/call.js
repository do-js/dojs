var d1 = require("deviceone");
var dojs=require("dojs");

//---------------------------------------------------------------
/**
 * 用户登录
 * @param _option 选项参数
 */
module.exports.invoke = function(_option){
	dojs.core.openPage({
		source:"source://modules/baseLayer/src/main.ui", 
		animationType:"fade",
		data:_option,
		statusBarState:"transparent"
	});
};