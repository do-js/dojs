var dojs = require("dojs");

module.exports.call = function() {
	var _indexDefine = [ {
		name : "简单请求(simpleRequest)",
		path : "source://samples/script/dojs/http/simpleRequest"
	}, {
		name : "等待返回结果（requestWithWatting）",
		image : "source://samples/script/dojs/http/requestWithWatting",
		path : "source://modules/simpleIndex/sample/b.ui"
	}];
	var simpleIndex = require("source://modules/simpleIndex/call");
	simpleIndex.call(_indexDefine, {
		title : "个人信息"
	});
};
