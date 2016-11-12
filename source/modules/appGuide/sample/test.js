var dojs = require("dojs");
var appGuide = require("source://modules/appGuide/call");
// 使用这个module，可以根据自己的要求，去修改template.ui里进入按钮的样式
module.exports.demo = function() {
	appGuide.invoke({
		// guide页的背景，可以是背景色，也可以是一个图片
		background : "FFFFFFFF",
		// 图片数据
		data : [ {
			bgImage : "http://img.zcool.cn/community/01efd35649945a32f87512f6c971f8.jpg"
		}, {
			bgImage : "http://img.zcool.cn/community/01add7564994616ac7251c94995731.jpg"
		}, {
			bgImage : "http://img.zcool.cn/community/014d955649946a6ac7251c94dcc55b.jpg"
		} ],
		openPageOption : {
			source : "source://modules/appGuide/sample/testMain.ui",
			animationType : "fade",
			statusBarState : "transparent"
		}
	});
};
