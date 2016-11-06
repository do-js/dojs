var singleChoiceList=require("source://modules/singleChoiceList/call");
var dojs=require("dojs");

module.exports.demo = function() {
	singleChoiceList.invoke({
		title : "性别",
		data : [ {
			text : "男",
			tag : "1"
		}, {
			text : "女",
			tag : "0"
		}, {
			text : "不详",
			tag : "2"
		} ],
		// selected表示初始选中的索引，不设置就是0
		selected : 1
	
	}, function(data) {
		// 显示输入结果,比如返回{"text":"女","tag":"0"}
		dojs.core.alert(data.value);

	});
};
