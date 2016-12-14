var dojs = require("dojs");
/**
 * 五星评价
 */
module.exports.demo = function(_parent) {
	var userControl = require("source://userControls/userControl");
	userControl.addView(_parent, "starComment", {
		// 加到ALayout上的坐标值
		x : 50,
		y : 340,
		// 标题ALayout上的宽高,建议宽度是高度的5倍
		width : 600,
		height : 120,
		// 初始选中的星数
		star : 2,
		onStarTouch : function(data) {
			// 处理选中几颗星的返回结果
			dojs.core.toast(data);
		}
	});
};
