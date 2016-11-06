var dojs = require("dojs");

module.exports.invoke = function() {
	var _indexDefine = [ {
		name : "指定调试数据内容 (mockData)",
		path : "source://samples/script/dojs/http/mockData/mockData"
	}, {
		name : "指定调试数据文件 (mockResult)",
		path : "source://samples/script/dojs/http/mockData/mockResult"
	}, {
		name : "设置调试数据匹配条件(mockCondition)",
		path : "source://samples/script/dojs/http/mockData/mockCondition"
	} ];
	var simpleIndex = require("source://modules/simpleIndex/call");
	simpleIndex.invoke(_indexDefine, {
		title : "mockData使用示例"
	});
};
