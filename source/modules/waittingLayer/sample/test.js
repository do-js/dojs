module.exports.demo = function() {
	// 打开等待层
	var waittingLayer=require("source://modules/waittingLayer/call");
	waittingLayer.invoke({
		hint : "请稍后，3秒后自动关闭"
	});
	var dojs = require("dojs");
	dojs.page.setTimeout(function() {
		// 关闭等待层
		waittingLayer.invoke({
			close : true
		});
	}, 3000);
};
