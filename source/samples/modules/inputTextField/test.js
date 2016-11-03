var core = require("do/core");
var dojs = require("dojs");

module.exports.demo = function() {
	dojs.modules.inputTextField({
		title : "请输入内容",
		text : "测试",
		hint : "请输入内容",
		// maxLength:默认值是16
		maxLength : 10,
		// initValue:默认值是""
		initValue : "",
		// inputType支持：ENG, PHONENUMBER, DECIMAL, ASC, URL; 默认是ENG
		inputType : "ASC"
	}, function(data) {
		// 显示输入结果
		core.toast(data.value);
	});
};
