var dojs = require("dojs");
var radioButton = require("source://userControls/radioButton/call");

module.exports.demo = function(alayout, id) {
	radioButton.addToALayout(alayout, id, {
		// 加到ALayout上的坐标值
		x : 50,
		y : 140,
		// 标题ALayout上的宽高
		width : 600,
		height : 300,
		// 初始选中的索引
		selected : 0,
		content : [ {
			text : "男",
			tag : 0
		}, {
			text : "女",
			tag : 1
		}, {
			text : "不详",
			tag : 2
		} ],
		onCallback : function(data) {
			// 处理点击一个radio button返回结果
			dojs.core.toast(data.tag);
		}
	});
};
