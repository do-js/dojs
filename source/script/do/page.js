//---------------------------------------------------------------
//封装页面UI中常用的函数
//version: 1.0.0
//---------------------------------------------------------------
var core=require("do/core");
var d1=require("deviceone");

var lastShowedView=null;

//---------------------------------------------------------------
/**
 * 允许页面关闭，支持android的返回键关闭，IOS的滑动手势关闭
 * @param _buttons [可空] 指定可关闭功能的按钮，或者按钮列表；
 * @param _options [可空] 配置选项:
 		//支持ios手势关闭页面
    	supportPanClosePage:true
 */
module.exports.allowClose = function(_buttons, _options){
	var d=core.getOptions(_options, "do/defaultSetting/pageSetting", "mySetting/pageSetting");
	var do_App = d1.sm("do_App");
	var do_Page = d1.sm("do_Page");
	var startTime=0;
	//android返回按钮关闭页面;
	do_Page.on("back", function() {
		do_Page.hideKeyboard();
		//关闭上一层视图
		if (lastShowedView && lastShowedView.visible){
			lastShowedView.fire("onHideView", null);
			startTime=0;
			return;
		}
		//防止2秒内的重复点击
		if (startTime!=0 && parseInt((new Date()).getTime()) - startTime < 2000) {
			return;
		}
		startTime = parseInt((new Date()).getTime());
		do_App.closePage();
	});
	if (d.supportPanClosePage){
		//ios手势关闭页面
		do_Page.supportPanClosePage({support:"true"});
	}	
	if (_buttons){
		if (typeof(_buttons) == "object" && !isNaN(_buttons.length)){
			for(var i =0; i< _buttons.length;i++){
				var _btn= _buttons[i];
				_btn.on("touch", "", 2000, function(data) {
					do_Page.hideKeyboard();
					do_App.closePage();
				});
			}
		}
		else{
			_buttons.on("touch", "", 2000, function(data) {
				do_Page.hideKeyboard();
				do_App.closePage();
			});
		}
	}
};

//---------------------------------------------------------------
/**
 * 允许页面退出应用，支持android的返回键退出
 * @param _buttons [可空] 指定可退出功能的按钮，或者按钮列表；
 */
module.exports.allowExit = function(_buttons){
	var do_App = d1.sm("do_App");
	var do_Page = d1.sm("do_Page");
	var startTime=0;

	do_Page.on("back", function(){
		//关闭上一层视图
		if (lastShowedView && lastShowedView.visible){
			lastShowedView.fire("onHideView", null);
			return;
		}
		//设置3秒内连续点击则退出
		if (startTime==0 || parseInt((new Date()).getTime()) - startTime > 3000) {
			var do_Notification=d1.sm("do_Notification");
			do_Notification.toast("再次点击退出应用");
			startTime = parseInt((new Date()).getTime());
		} else {
			var do_Global = d1.sm("do_Global");
			do_Global.exit();
		}
	});
	//按钮关闭应用
	if (_buttons){
		if (typeof _buttons == "object" && !isNaN(_buttons.length)){
			for(var i =0; i< _buttons.length;i++){
				var _btn= _buttons[i];
				_btn.on("touch", "", 2000, function(data) {
					var do_Global = d1.sm("do_Global");
					do_Global.exit();
				});
			}
		}
		else{
			_buttons.on("touch", "", 2000, function(data) {
				var do_Global = d1.sm("do_Global");
				do_Global.exit();
			});
		}
	}
};

//---------------------------------------------------------------
/**
 * 允许视图隐藏（常在showView的目标视图内部调用）
 * @param _rootView 当前的根视图
 * @param _onShowView 显示视图的操作
 * @param _onHideView 关闭视图的操作
 * @param _options [可空] 配置选项:
 		//允许用户通过UI操作关闭OpenView的视图
    	allowUserCloseView:true
 */
module.exports.allowHide = function(_rootView, _onShowView, _onHideView, _options){
	var d=core.getOptions(_options, "do/defaultSetting/pageSetting", "mySetting/pageSetting");
	_rootView.visible = false;
	_rootView.on("onShowView", function(data){
		d1.sm("do_Page").hideKeyboard();
		core.callFunction(_onShowView, data);
	});
	_rootView.on("onHideView", function(data){
		d1.sm("do_Page").hideKeyboard();
		core.callFunction(_onHideView, data);
	});
	if (d.allowUserCloseView){
		_rootView.on("touch", function(){
			d1.sm("do_Page").hideKeyboard();
			core.callFunction(_onHideView);
		});
	}
	else{
		_rootView.on("touch", function(){
			//屏蔽touch事件穿透
		});
	}
};

//---------------------------------------------------------------
/**
 * 允许隐藏键盘 （点击最底层的空白处时，收起键盘）
 * @param _buttons [可空] 指定可隐藏键盘的按钮对象，或者按钮对象的列表；
 */
module.exports.allowHideKeyboard = function(_buttons){
	var do_Page = d1.sm("do_Page");
	var _rootView = d1.ui("$");
	_rootView.on("touch", "", 1000, function(){
		do_Page.hideKeyboard();
	});
	//按钮关闭应用
	if (_buttons){
		if (typeof _buttons == "object" && !isNaN(_buttons.length)){
			for(var i =0; i< _buttons.length;i++){
				var _btn= _buttons[i];
				_btn.on("touch", "", 1000, function(data) {
					do_Page.hideKeyboard();
				});
			}
		}
		else{
			_buttons.on("touch", "", 1000, function(data) {
				do_Page.hideKeyboard();
			});
		}
	}
};

var __addedviews={};
//---------------------------------------------------------------
/**
 * 在屏幕上显示指定路径的View，并对其发送onShowView事件
 * 需要在目标view的代码里订阅onShowView和onHideView事件
 * @param _path view的路径
 * @param [可空] 传入的参数
 * @param _x [可空] x坐标
 * @param _y [可空] y坐标
 * @param _options [可空] 配置选项:
 		//允许用户通过UI操作关闭OpenView的视图
    	allowUserCloseView:true
 */
module.exports.showView = function(_path, _data, _x, _y, _options){
	var d=core.getOptions(_options, "do/defaultSetting/pageSetting", "mySetting/pageSetting");
	var _rootView = d1.ui("$");	
	if (core.isNull(_rootView) || "do_ALayout" != _rootView.getType()) return;
	_x=_x||0;
	_y=_y||0;
	var _viewAddr=__addedviews[_path];
	if (core.isNull(_viewAddr)){
		_viewAddr=_rootView.add(core.getUUID(), _path, _x, _y);
		__addedviews[_path]=_viewAddr;
	}
	_view=d1.ui(_viewAddr);
	_view.fire("onShowView", _data);
	if (d.allowUserCloseView){
		lastShowedView=_view;
	}
	else {
		lastShowedView=null;
	}
};

//---------------------------------------------------------------
/**
 * 隐藏指定路径的View （针对于ShowView的功能），对其发送onHideView事件
 * 需要在目标view的代码里订阅onShowView和onHideView事件
 * @param _path view的路径
 * @param _data [可空] 传入的参数
 */
module.exports.hideView = function(_path, _data){
	var _viewAddr=__addedviews[_path];
	if (core.isNull(_viewAddr))return;
	_view=d1.ui(_viewAddr);
	_view.fire("onHideView", _data);
};

//---------------------------------------------------------------
/**
 * 常用的订阅touch事件 (可以有效的避免连续点击的问题)
 * @param _object 事件相关的对象
 * @param _func 订阅事件的回调函数
 * @param _options [可空] 配置选项:
 		//touch事件防止重复点击的时效（毫秒）
    	touchDelay:1500
 */
module.exports.onTouch = function(_object, _func, _options){
	var d=core.getOptions(_options, "do/defaultSetting/pageSetting", "mySetting/pageSetting");
	_object.on("touch", null, d.touchDelay, _func);
};

//---------------------------------------------------------------
/**
 * 指定的毫秒数后的回调
 * @param code 回调函数，或者要调用的函数或要执行的代码串
 * @param millisec 在执行代码前需等待的毫秒数
 */
module.exports.setTimeout = function(code, millisec){
	var _timer = d1.mm("do_Timer");
	_timer.interval=999999;
	_timer.delay = millisec;
	_timer.on("tick", function(){
		_timer.stop();
		if (typeof(code)=="function"){
			core.callFunction(code);
			return;
		}
		if (code && typeof(code) == "string" ){
			eval(code);
		}
	});
	_timer.start();
	return _timer;
};

//---------------------------------------------------------------
/**
 * 取消由 setTimeout() 方法设置的 timeout
 * @param id_of_settimeout 由 setTimeout() 返回的 ID 值。该值标识要取消的延迟执行代码块
 */
module.exports.clearTimeout = function(id_of_settimeout){
	if (!id_of_settimeout) return;
	id_of_settimeout.stop();
};

//---------------------------------------------------------------
/**
 * 按照指定的周期（以毫秒计）进行回调
 * @param code 回调函数，或者要调用的函数或要执行的代码串
 * @param millisec 重复执行代码周期的毫秒数
 */
module.exports.setInterval = function(code, millisec){
	var _timer = d1.mm("do_Timer");
	_timer.interval=millisec;
	_timer.delay = millisec;
	_timer.on("tick", function(){
		if (typeof(code)=="function"){
			core.callFunction(code);
			return;
		}
		if (code && typeof(code) == "string" ){
			eval(code);
		}
	});
	_timer.start();
	return _timer;
};

//---------------------------------------------------------------
/**
 * 取消由 setInterval() 设置的 timeout
 * @param id_of_setinterval 由 setInterval() 返回的 ID 值
 */
module.exports.clearTimeout = function(id_of_setinterval){
	if (!id_of_setinterval) return;
	id_of_setinterval.stop();
};
