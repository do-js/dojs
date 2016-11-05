var dojs = require("dojs");

module.exports.call = function() {
	var _indexDefine = [ {
		name : "简单请求(simpleRequest)",
		path : "source://samples/script/dojs/http/simpleRequest"
	}, {
		name : "设置get参数(getPara)",
		path : "source://samples/script/dojs/http/getPara"
	}, {
		name : "设置post参数(postPara)",
		path : "source://samples/script/dojs/http/postPara"
	}, {
		name : "等待返回结果（needWaitting）",
		path : "source://samples/script/dojs/http/needWaitting"
	}, {
		name : "等待3秒超时（requestWithWatting）",
		path : "source://samples/script/dojs/http/requestWithWaiting"
	}, {
		name : "本地缓存（cacheLastResult）",
		path : "source://samples/script/dojs/http/cacheLastResult"
	}, {
		name : "本地调试数据（mockData）",
		path : "source://samples/script/dojs/http/mockData/index"
	}, {
		name : "完整参数的示例（fullOption）",
		path : "source://samples/script/dojs/http/fullOption"
	}];
	var simpleIndex = require("source://modules/simpleIndex/call");
	simpleIndex.call(_indexDefine, {
		title : "http使用示例"
	});
};
