var d1 = require("deviceone");
var dojs=require("dojs");

//---------------------------------------------------------------
/**
 * 用户登录
 * @param _option 选项参数
 */
module.exports.call = function(_option){
	dojs.core.openPage({
		source:"source://modules/login/src/main.ui", 
		animationType:"push_r2l_1",
		data:_option,
		statusBarState:"transparent"
	});
};