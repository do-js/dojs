var d1 = require("deviceone");
var dojs=require("dojs");

var module_singleChoiceList_callback=null;
//---------------------------------------------------------------
/**
* 单选列表
* @param _option 选项参数
* @param _callback 回调函数
*/
module.exports.invoke = function(_option){
	module_singleChoiceList_callback=_option.onCallback;
	dojs.core.openPage({
		source:"source://modules/singleChoiceList/src/main.ui", 
		animationType:"push_r2l_1",
		data:_option,
		statusBarState:"transparent"
	});	
};

if (!dojs.core.inPage()){
	dojs.core.error("不允许在app.js中调用 singleChoiceList 模块");
}
else{
	d1.sm("do_Page").on("result", function(data){
		if (dojs.core.isNull(data) ||
				dojs.core.isNull(data.moduleType) ||
				data.moduleType != "$$singleChoiceList$$" ||
				dojs.core.isNullData(module_singleChoiceList_callback)) return;
		dojs.core.callFunction(module_singleChoiceList_callback, data.result);
	});
}

