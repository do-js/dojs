var d1 = require("deviceone");
var dojs=require("dojs");

var module_singleChoiceList_callback=null;
//---------------------------------------------------------------
/**
* 单选列表
* @param _option 选项参数
* @param _callback 回调函数
*/
module.exports.call = function(_option, _callback){
	module_singleChoiceList_callback=_callback;
	dojs.core.openPage({
		source:"source://modules/singleChoiceList/src/main.ui", 
		animationType:"push_r2l_1",
		data:_option,
		statusBarState:"transparent"
	});	
};

d1.sm("do_Page").on("result", function(data){
	if (dojs.core.isNull(data) ||
			dojs.core.isNull(data.moduleType) ||
			data.moduleType != "$$singleChoiceList$$" ||
			!module_singleChoiceList_callback) return;
	module_singleChoiceList_callback.call(this, data.result);
});

