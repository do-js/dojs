var dojs = require("dojs");

module.exports.demo = function() {
	var appGuide = require("source://modules/appGuide/call");
	appGuide.invoke({
		// 定义每个导览页的内容(最多支持5页)
		content : [ {
			// 内容来源的路径（图片或自定义ui视图）
			path : "source://modules/appGuide/sample/image/1.JPG",
			// 是否显示关闭按钮
			showCloseButton:false
		}, {
			// 内容来源的路径（图片或自定义ui视图）
			path : "source://modules/appGuide/sample/image/2.JPG",
			// 是否显示关闭按钮
			showCloseButton:false
		}, {
			// 内容来源的路径（图片或自定义ui视图）
			path : "source://modules/appGuide/sample/image/3.JPG",
			// 是否显示关闭按钮
			showCloseButton:false
		} , {
			// 内容来源的路径（图片或自定义ui视图）
			path : "source://modules/appGuide/sample/image/4.JPG",
			// 是否显示关闭按钮
			showCloseButton:true
		} ],
		//导览图片的索引图
		indexImage : {
			//是否显示
			visible:true,
			//当前索引的颜色
			selectedColor:"FF0000FF",
			//其它非当前索引的颜色
			unSelectedColor:"9C9C9CFF",
			//垂直方向的位置
			y:1206
		},
		//关闭按钮
		closeButton : {
			//文本内容
			text:"进入应用",
			//垂直方向的位置
			y:1134,
			//宽度
			width:500,
			//背景颜色
			bgColor:"FF000099",
			//字体颜色
			fontColor:"FFFFFFFF"
		},
		//回调事件
		onCallback:function(data){
			//此处可以编写回调代码，例如：打开其它页面
			//dojs.core.openPage("");
		}
	});
};
