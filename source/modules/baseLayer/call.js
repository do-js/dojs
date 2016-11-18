var d1 = require("deviceone");
var dojs=require("dojs");

//---------------------------------------------------------------
/**
 * 基础视图层（一般用做应用最低层的ui）
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