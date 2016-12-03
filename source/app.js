var d1 = require("deviceone");
var dojs = require("dojs");

d1.sm("do_App").on("loaded", function() {
	var baseLayer=require("source://modules/baseLayer/call");
	baseLayer.invoke({
		// 背景颜色
		bgColor:"3299CCFF",
		// 背景图片
		bgImage:"",
		// 回调的代码
		onCallback:"source://baseLayerCallback"
	});	
});