var dojs = require("dojs");

module.exports.call = function() {
	dojs.http.ajax({
		url:"http://www.deviceone.net",
		success:function(data){
			dojs.core.toast(data, "success:成功时返回的结果");
		},
		error:function(data){
			dojs.core.error(data);
		},
		//是否缓存上次结果 （为true的时候，在返回服务结果之前会先返回上次结果，一般用于改善数据查询的交互体验）
		cacheLastResult:true,
		//缓存失效时长（单位为毫秒，-1表示永远使用缓存，0表示每次都先用缓存后刷新）
		cacheExpires:0
	});
};
