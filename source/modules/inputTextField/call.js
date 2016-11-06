var d1 = require("deviceone");
var dojs=require("dojs");

var module_inputTextField_callback=null;
//---------------------------------------------------------------
/**
 * 文本输入
 * @param _option 选项参数
 * @param _callback 回调函数
 */
module.exports.invoke = function(_option, _callback){
	module_inputTextField_callback=_callback;
	dojs.core.openPage({
		source:"source://modules/inputTextField/src/main.ui", 
		animationType:"push_r2l_1",
		data:_option,
		statusBarState:"transparent"
	});
};
d1.sm("do_Page").on("result", function(data){
	if (dojs.core.isNull(data) ||
			dojs.core.isNull(data.moduleType) ||
			data.moduleType != "$$inputTextField$$" ||
			!module_inputTextField_callback) return;
	module_inputTextField_callback.call(this, data.result);
});
