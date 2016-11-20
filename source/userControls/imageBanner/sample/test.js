var dojs = require("dojs");
var imageBanner = require("source://userControls/imageBanner/call");
/**
 * 图片轮播图，最多6个图片
 */
module.exports.demo = function(alayout, id) {
	imageBanner.addToALayout(alayout, id, {
		// 加到ALayout上的坐标值
		x : 0,
		y : 0,
		// 是否循环轮播
		isLoop : true,
		// 自动轮播的间隙，如果没有设置这个值，则不会自动，只能手势滑动
		interval : 3000,
		content : [ {
			bgImage : "source://userControls/imageBanner/sample/banner1.jpg",
			tag : 0
		}, {
			bgImage : "source://userControls/imageBanner/sample/banner2.jpg",
			tag : 1
		}, {
			bgImage : "source://userControls/imageBanner/sample/banner3.jpg",
			tag : 2
		} ],
		onCallback : function(data) {
			// 点击轮播图任何一个页面触发的点击事件
			// data就是传递过去的tag值
			dojs.core.toast(data);
		}
	});
}