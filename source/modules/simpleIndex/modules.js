var d1 = require("deviceone");
var dojs=require("dojs");

var module_inputTextField_callback=null;
//---------------------------------------------------------------
/**
 * 文本输入
 * @param _option 选项参数
 * @param _callback 回调函数
 */
module.exports.inputTextField = function(_option, _callback){
	module_inputTextField_callback=_callback;
	dojs.core.openPage({
		source:"source://modules/inputTextField/main.ui", 
		animationType:"push_r2l_1",
		data:_option,
		statusBarState:"transparent"
	});
};

var module_scanBarcode_callback=null;
//---------------------------------------------------------------
/**
 * 二维码扫描
 * @param _option 选项参数
 * @param _callback 回调函数
 */
module.exports.scanBarcode = function(_option, _callback){
	module_scanBarcode_callback=_callback;
	dojs.core.openPage({
		source:"source://modules/scanBarcode/main.ui", 
		animationType:"push_r2l_1",
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
	dojs.core.openPage({
		source:"source://modules/singleChoiceList/main.ui", 
		animationType:"push_r2l_1",
		data:_option,
		statusBarState:"transparent"
	});	
};

var modules_menus=null;
//---------------------------------------------------------------
/**
 * 弹出式菜单
 * @param _menus 选项参数
 */
module.exports.popupMenu = function(_menus){
	modules_menus=_menus;
	dojs.page.showView("source://modules/popupMenu/main.ui", _menus);
};

//---------------------------------------------------------------
/**
* 主页面
* @param _option 选项参数
*/
module.exports.mainFrame = function(_option){
	dojs.core.openPage({
		source:"source://modules/mainFrame/main.ui", 
		animationType:"fade",
		data:_option,
		statusBarState:"transparent"
	});
};

//---------------------------------------------------------------
/**
* 遮盖层
* @param _menus 
*/
module.exports.waittingLayer = function(_option){
	if (dojs.core.isNull(_option.close) || !_option.close){
		dojs.page.showView("source://modules/waittingLayer/main.ui", _option, 0, 0, {allowUserCloseView:false});
	}
	else{
		dojs.page.hideView("source://modules/waittingLayer/main.ui");
	}
};

var module_simpleIndex_model=null;
//---------------------------------------------------------------
/**
* 简单索引
* @param _definition 索引定义
* @param _option 选项参数
*/
module.exports.simpleIndex = function(_definition, _option){
	_option=_option||{};
	_definition=_definition||[];
	module_simpleIndex_model=_definition;
	dojs.core.openPage({
		source:"source://modules/singleChoiceList/main.ui", 
		animationType:"push_r2l_1",
		data:{model:_definition, 
			option:_option
		},
		statusBarState:"transparent"
	});	
};

//---------------------------------------------------------------
//所有返回内容在app.js里都无法获取
if (dojs.core.inPage()){
	//统一处理页面的回调
	d1.sm("do_Page").on("result", function(data){
		if (dojs.core.isNull(data) ||
				dojs.core.isNull(data.moduleType)) return;
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
		if (data.moduleType == "$$module_simpleIndex$$"){
			if (!module_simpleIndex_model ||
					!module_simpleIndex_model[data.result] ||
					!module_simpleIndex_model[data.result].callback) return;
			module_simpleIndex_model[data.result].callback.call(this);
			return;
		}		
	});

	//统一处理页面的内部消息
	d1.sm("do_Page").on("$$modules_internal_Event$$",function(data){
		if (dojs.core.isNull(data) ||
				dojs.core.isNull(data.moduleType)) return;
		if (data.moduleType == "$$popupMenu$$"){
			if (dojs.core.isNull(modules_menus)||!modules_menus[data.result.index].callback) return;
			modules_menus[data.result.index].callback.call(this);
			return;
		}	
	});
}