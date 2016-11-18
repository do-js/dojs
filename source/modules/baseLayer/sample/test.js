module.exports.demo = function() {
	var baseLayer=require("source://modules/baseLayer/call");
	baseLayer.invoke({
		// 背景颜色
		bgColor:"00000000",
		// 背景图片
		bgImage:"",
		// 回调的代码
		onCallback:"source://modules/baseLayer/sample/baseLayerCallback"
	});
};
