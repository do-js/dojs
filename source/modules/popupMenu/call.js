var d1 = require("deviceone");
var dojs=require("dojs");

//---------------------------------------------------------------
/**
 * 弹出式菜单
 * @param _menus 选项参数
 */
module.exports.call = function(_menus){
	modules_menus=_menus;
	dojs.page.showView("source://modules/popupMenu/src/main.ui", _menus);
};

d1.sm("do_Page").on("$$modules_internal_Event$$",function(data){
	if (dojs.core.isNull(data) ||
			dojs.core.isNull(data.moduleType) ||
			data.moduleType != "$$popupMenu$$" ||
			dojs.core.isNull(modules_menus)||
			!modules_menus[data.result.index].callback) return;
	modules_menus[data.result.index].callback.call(this);	
});
