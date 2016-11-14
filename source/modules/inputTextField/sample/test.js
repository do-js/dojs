var dojs = require("dojs");

module.exports.demo = function() {
	var inputTextField=require("source://modules/inputTextField/call");
	inputTextField.invoke({
		// 标题
		title : "请输入内容",
		// 提示内容
		hint : "请输入内容",
		// 初始值
		text : "001",
		// 最大长度:默认值是16
		maxLength : 10,
		// 软键盘的类型，支持：ENG, PHONENUMBER, DECIMAL, ASC, URL; 默认是ASC
		inputType : "ASC"
	}, function(data) {
		//处理返回结果
		dojs.core.alert(data.value);
	});
};
