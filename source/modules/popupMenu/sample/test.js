var dojs = require("dojs");

module.exports.demo = function() {
	var menus = [ {
		//菜单名
		name : "拍照",
		//回调函数
		callback : function() {
			dojs.core.alert("点击了拍照");
		}
	}, {
		//菜单名
		name : "相册",
		//回调函数
		callback : function() {
			dojs.core.alert("点击了相册");
		}
	}, {}, {
		//菜单名
		name : "取消",
		//回调函数
		callback : function() {
			//do nothing
		}
	} ];
	//弹出菜单
	var popupMenu = require("source://modules/popupMenu/call");
	popupMenu.invoke(menus);
};
