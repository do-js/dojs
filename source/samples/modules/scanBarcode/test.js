var core = require("do/core");
var dojs = require("dojs");

module.exports.demo = function() {

	dojs.modules.scanBarcode({
		//标题
		title : "扫描二维码",
		//提示内容
		hint : "扫描二维码"
	}, function(data) {
		// 处理返回结果
		core.alert(data.value, data.code);
	});
};
