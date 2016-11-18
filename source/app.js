var d1 = require("deviceone");
var dojs = require("dojs");
var mainFrame = require("source://modules/mainFrame/call");

d1.sm("do_App").on("loaded", function() {
	var baseLayer=require("source://modules/baseLayer/call");
	baseLayer.invoke({
		// 背景颜色
		bgColor:"00000000",
		// 回调的代码
		onCallback:"source://baseLayerCallback"
	});	
});