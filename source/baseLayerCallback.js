var d1 = require("deviceone");
var dojs = require("dojs");

var options = [ {
	name : "sripts",
	path : "source://samples/script/main.ui",
	image_on : "source://image/samples/a_2.png",
	image_off : "source://image/samples/a_1.png",
	fontColor_on : "55C5B9FF",
	fontColor_off : "9E9E9EFF"
}, {
	name : "modules",
	path : "source://samples/modules/main.ui",
	image_on : "source://image/samples/b_2.png",
	image_off : "source://image/samples/b_1.png",
	fontColor_on : "55C5B9FF",
	fontColor_off : "9E9E9EFF"
}, {
	name : "uControls",
	path : "source://samples/userControls/main.ui",
	image_on : "source://image/samples/b_2.png",
	image_off : "source://image/samples/b_1.png",
	fontColor_on : "55C5B9FF",
	fontColor_off : "9E9E9EFF"
}, {
	name : "API",
	path : "source://samples/api/main.ui",
	image_on : "source://image/samples/c_2.png",
	image_off : "source://image/samples/c_1.png",
	fontColor_on : "55C5B9FF",
	fontColor_off : "9E9E9EFF"
}, {
	name : "examples",
	path : "source://samples/others/main.ui",
	image_on : "source://image/samples/d_2.png",
	image_off : "source://image/samples/d_1.png",
	fontColor_on : "55C5B9FF",
	fontColor_off : "9E9E9EFF"
} ];

module.exports.invoke = function(data) {
	//此处baseLayer页面打开后的代码
	var appGuide = require("source://modules/appGuide/call");
	appGuide.invoke({
		// 定义每个导览页的内容(最多支持5页)
		content : [ {
			// 内容来源的路径（图片或自定义ui视图）
			path : "source://modules/appGuide/sample/image/1.JPG",
			// 是否显示关闭按钮
			showCloseButton : false
		}, {
			// 内容来源的路径（图片或自定义ui视图）
			path : "source://modules/appGuide/sample/image/2.JPG",
			// 是否显示关闭按钮
			showCloseButton : false
		}, {
			// 内容来源的路径（图片或自定义ui视图）
			path : "source://modules/appGuide/sample/image/3.JPG",
			// 是否显示关闭按钮
			showCloseButton : false
		}, {
			// 内容来源的路径（图片或自定义ui视图）
			path : "source://modules/appGuide/sample/image/4.JPG",
			// 是否显示关闭按钮
			showCloseButton : true
		} ],
		// 导览图片的索引图
		indexImage : {
			// 是否显示
			visible : true,
			// 当前索引的颜色
			selectedColor : "FF0000FF",
			// 其它非当前索引的颜色
			unSelectedColor : "9C9C9CFF",
			// 垂直方向的位置
			y : 1206
		},
		// 关闭按钮
		closeButton : {
			// 文本内容
			text : "进入应用",
			// 垂直方向的位置
			y : 1134,
			// 宽度
			width : 500,
			// 背景颜色
			bgColor : "FF000099",
			// 字体颜色
			fontColor : "FFFFFFFF"
		},
		// 回调事件
		onCallback : function(data) {
			var mainFrame=require("source://modules/mainFrame/call");
			mainFrame.invoke(options);
		}
	});
}

d1.sm("do_Page").on("result", function(data){
	//此处编写baseLayer上层页面关闭后的事件处理
	
});