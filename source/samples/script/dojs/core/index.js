var dojs = require("dojs");

module.exports.call = function() {
	var _indexDefine = [ {
		name : "打印调试信息(print)",
		path : "source://samples/script/dojs/core/print"
	}, {
		name : "获取一个UUID(newUUID)",
		path : "source://samples/script/dojs/core/newUUID"
	}, {
		name : "判断是否在UI页面中（inPage）",
		path : "source://samples/script/dojs/core/inPage"
	} ];
	var simpleIndex = require("source://modules/simpleIndex/call");
	simpleIndex.invoke(_indexDefine, {
		title : "core示例"
	});
};
