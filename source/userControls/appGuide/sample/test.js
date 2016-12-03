var dojs = require("dojs");
var appGuide = require("source://userControls/appGuide/call");
/**
 * 添加一个引导页，一般是3-5页，每一页一般是一个图片，最后一页有一个按钮，点击可以进入首页
 * 缺省从0，0位置开始
 */
module.exports.demo = function(alayout, id) {
	appGuide.addToALayout(alayout, id, {
		// 图片数据
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
			fontColor : "FF0000FF"
		},
		onCallback : function(data) {
			// 点击进入按钮，通常是把自己remove掉
			dojs.core.toast(data);
		}
	})
};
