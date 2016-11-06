var waittingLayer=require("source://modules/waittingLayer/call");
var dojs = require("dojs");

module.exports.demo = function() {
	// 打开等待层
	waittingLayer.invoke({
		hint : "请稍后，3秒后自动关闭"
	});
	dojs.page.setTimeout(function() {
		// 关闭等待层
		waittingLayer.invoke({
			close : true
		});
	}, 3000);
};
