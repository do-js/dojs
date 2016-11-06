var scanBarcode=require("source://modules/scanBarcode/call");
var dojs=require("dojs");

module.exports.demo = function() {

	scanBarcode.invoke({
		//标题
		title : "扫描二维码",
		//提示内容
		hint : "扫描二维码"
	}, function(data) {
		// 处理返回结果
		dojs.core.alert(data.value, data.code);
	});
};
