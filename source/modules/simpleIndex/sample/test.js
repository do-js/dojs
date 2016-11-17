module.exports.demo = function() {
	var simpleIndex = require("source://modules/simpleIndex/call");
	var _indexDefine = [ {
		//列表名称
		name : "我的照片",
		//列表图标
		image : "source://modules/simpleIndex/sample/a.png",
		//调用指定的js文件中的call函数
		path : "source://modules/simpleIndex/sample/a"
	}, {
		name : "我的二维码",
		image : "source://modules/simpleIndex/sample/b.png",
		//打开指定的页面
		path : "source://modules/simpleIndex/sample/b.ui"
	}, {
		name : "我的团队",
		image : "source://modules/simpleIndex/sample/c.png",
		path : "source://modules/simpleIndex/sample/c.ui"
	}, {}, {
		name : "购物车",
		image : "source://modules/simpleIndex/sample/d.png",
		path : "source://modules/simpleIndex/sample/d.ui"
	}, {}, {
		name : "通用功能",
		path : "source://modules/simpleIndex/sample/e.ui"
	} ];
	simpleIndex.invoke(_indexDefine, {
		title : "个人信息"
	});
};
