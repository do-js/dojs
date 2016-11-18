var d1 = require("deviceone");
var dojs=require("dojs");

//---------------------------------------------------------------
/**
 * 忘记密码
 * @param _option 选项参数
 */
module.exports.invoke = function(_option){
	dojs.core.openPage({
		source:"source://modules/forgetPassword/src/main.ui", 
		animationType:"push_r2l_1",
		data:_option,
		statusBarState:"transparent"
	});
};