var dojs=require("dojs");

//---------------------------------------------------------------
/**
* 主页面
* @param _option 选项参数
*/
module.exports.invoke = function(_option){
	dojs.core.openPage({
		source:"source://modules/mainFrame/src/main.ui", 
		animationType:"fade",
		data:_option,
		statusBarState:"transparent"
	});
};
