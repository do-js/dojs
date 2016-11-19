var d1 = require("deviceone");
var dojs = require("dojs");

module.exports.invoke = function(data) {
	//TODO:提交服务端，完成实名认证功能
	dojs.core.p(data)
	
	dojs.core.closePage();
	return;
};
