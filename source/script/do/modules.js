//---------------------------------------------------------------
//调用常用模块
//version: 1.0.0
//---------------------------------------------------------------
var d1 = require("deviceone");
var core=require("do/core");
var page=require("do/page");

var module_inputTextField_callback=null;
//---------------------------------------------------------------
/**
 * 接收单行文本的输入
 * @param _option 选项参数
 * @param _callback 回调函数
 */
module.exports.inputTextField = function(_option, _callback){
	module_inputTextField_callback=_callback;
	core.openPage({
		source:"source://modules/inputTextField/main.ui", 
		animationType:"fade",
		data:_option,
		statusBarState:"transparent"
	});
};

var module_scanBarcode_callback=null;
//---------------------------------------------------------------
/**
 * 扫描条码或二维码
 * @param _option 选项参数
 * @param _callback 回调函数
 */
module.exports.scanBarcode = function(_option, _callback){
	module_scanBarcode_callback=_callback;
	core.openPage({
		source:"source://modules/scanBarcode/main.ui", 
		animationType:"fade",
		data:_option,
		statusBarState:"transparent"
	});	
};

var module_singleChoiceList_callback=null;
//---------------------------------------------------------------
/**
* 单选列表
* @param _option 选项参数
* @param _callback 回调函数
*/
module.exports.singleChoiceList = function(_option, _callback){
	module_singleChoiceList_callback=_callback;
	core.openPage({
		source:"source://modules/singleChoiceList/main.ui", 
		animationType:"push_r2l_1",
		data:_option,
		statusBarState:"transparent"
	});	
};

var modules_menus=null;
//---------------------------------------------------------------
/**
 * 弹出菜单
 * @param _menus 选项参数
 */
module.exports.popupMenu = function(_menus){
	modules_menus=_menus;
	page.showView("source://modules/popupMenu/main.ui", _menus);
};

//---------------------------------------------------------------
/**
* 打开主视图
* @param _menus 自定义菜单
*/
module.exports.mainFrame = function(_option){
	core.openPage({
		source:"source://modules/mainFrame/main.ui", 
		animationType:"fade",
		data:_option,
		statusBarState:"transparent"
	});
};

//---------------------------------------------------------------
//所有返回内容在app.js里都无法获取
if (core.inPage()){
	//统一处理页面的回调
	d1.sm("do_Page").on("result", function(data){
		if (core.isNull(data) ||
				core.isNull(data.moduleType)) return;
		if (data.moduleType == "$$scanBarcode$$"){
			if (!module_scanBarcode_callback) return; 
			module_scanBarcode_callback.call(this, data.result);
			return;
		}
		if (data.moduleType == "$$inputTextField$$"){
			if (!module_inputTextField_callback) return;
			module_inputTextField_callback.call(this, data.result);
			return;
		}
		if (data.moduleType == "$$singleChoiceList$$"){
			if (!module_singleChoiceList_callback) return;
			module_singleChoiceList_callback.call(this, data.result);
			return;
		}
	});

	//统一处理页面的内部消息
	d1.sm("do_Page").on("$$modules_internal_Event$$",function(data){
		if (core.isNull(data) ||
				core.isNull(data.moduleType)) return;
		if (data.moduleType == "$$popupMenu$$"){
			if (core.isNull(modules_menus)||!modules_menus[data.result.index].callback) return;
			modules_menus[data.result.index].callback.call(this);
			return;
		}	
	});
}