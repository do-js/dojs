var d1 = require("deviceone");
var dojs=require("dojs");

//---------------------------------------------------------------
/**
 * 用户注册
 * @param _option 选项参数
 */
module.exports.invoke = function(_option){
	dojs.core.openPage({
		source:"source://modules/register/src/main.ui", 
		animationType:"push_r2l_1",
		data:_option,
		statusBarState:"transparent"
	});
};