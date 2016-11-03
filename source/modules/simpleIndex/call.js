var d1 = require("deviceone");
var dojs=require("dojs");

var module_simpleIndex_model=null;
//---------------------------------------------------------------
/**
* 简单索引
* @param _definition 索引定义
* @param _option 选项参数
*/
module.exports.call = function(_definition, _option){
	_option=_option||{};
	_definition=_definition||[];
	module_simpleIndex_model=_definition;
	dojs.core.openPage({
		source:"source://modules/simpleIndex/src/main.ui", 
		animationType:"push_r2l_1",
		data:{model:_definition, 
			option:_option
		},
		statusBarState:"transparent"
	});	
};

d1.sm("do_Page").on("result", function(data){
	if (dojs.core.isNull(data) ||
			dojs.core.isNull(data.moduleType) ||
			data.moduleType != "$$module_simpleIndex$$" ||
			!module_simpleIndex_model ||
			!module_simpleIndex_model[data.result] ||
			!module_simpleIndex_model[data.result].callback) return;
	module_simpleIndex_model[data.result].callback.call(this);
});