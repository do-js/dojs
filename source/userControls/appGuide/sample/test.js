var dojs = require("dojs");
/**
 * 添加一个引导页，一般是3-5页，每一页一般是一个图片，最后一页有一个按钮，点击可以进入首页
 * 这个组件不支持自动缩放，x,y从0，0位置开始,width,height必须是750，1334
 */
module.exports.demo = function(_parent) {
	var userControl = require("source://userControls/userControl");
	userControl.addView(_parent, "appGuide", {
		content : [ {
			bgImage : "http://img.zcool.cn/community/01efd35649945a32f87512f6c971f8.jpg",
			showCloseButton : false,
			tag : 0
		}, {
			bgImage : "http://img.zcool.cn/community/01add7564994616ac7251c94995731.jpg",
			showCloseButton : false,
			tag : 1
		}, {
			bgImage : "http://img.zcool.cn/community/014d955649946a6ac7251c94dcc55b.jpg",
			showCloseButton : true,
			tag : 2
		} ],
		closeButton : {// 这是一个按钮，支持do_Button的所有属性
			text : "进入",
			fontColor : "FF0000FF",
			bgColor: "CCCCCCFF"
		},
		onCloseButtonTouch : function(data) {
			// 点击进入按钮，通常是把自己remove掉
			dojs.core.toast(data);
		}
	})
};
