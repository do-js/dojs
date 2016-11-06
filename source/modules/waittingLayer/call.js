var d1 = require("deviceone");
var dojs=require("dojs");

//---------------------------------------------------------------
/**
* 遮盖层
* @param _menus 
*/
module.exports.invoke = function(_option){
	if (dojs.core.isNull(_option.close) || !_option.close){
		dojs.page.showView("source://modules/waittingLayer/src/main.ui", _option, 0, 0, {allowUserCloseView:false});
	}
	else{
		dojs.page.hideView("source://modules/waittingLayer/src/main.ui");
	}
};
