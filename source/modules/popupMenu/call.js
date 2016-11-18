var d1 = require("deviceone");
var dojs=require("dojs");

//---------------------------------------------------------------
/**
 * 弹出式菜单
 * @param _option 选项参数
 */
module.exports.invoke = function(_option){
	modules_menus=_option;
	dojs.page.showView("source://modules/popupMenu/src/main.ui", _option);
};

if (!dojs.core.inPage()){
	dojs.core.error("不允许在app.js中调用 popupMenu 模块");
}
else{
	d1.sm("do_Page").on("$$modules_internal_Event$$",function(data){
		if (dojs.core.isNull(data) ||
				dojs.core.isNull(data.moduleType) ||
				data.moduleType != "$$popupMenu$$" ||
				dojs.core.isNull(modules_menus)||
				dojs.core.isNullData(modules_menus[data.result.index].callback)) return;
		dojs.core.callFunction(modules_menus[data.result.index].callback);	
	});
}