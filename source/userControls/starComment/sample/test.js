var dojs = require("dojs");
var starComment = require("source://userControls/starComment/call");
/**
 * 五星评价
 */
module.exports.demo = function(alayout, id) {
	starComment.addToALayout(alayout, id, {
		// 加到ALayout上的坐标值
		x : 50,
		y : 140,
		// 标题ALayout上的宽高,建议宽度是高度的5倍
		width : 600,
		height : 120,
		// 初始选中的星数
		star : 2,
		onCallback : function(data) {
			// 处理选中几颗星的返回结果
			dojs.core.toast(data);
		}
	});
};
