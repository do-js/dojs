var dojs = require("dojs");

module.exports.invoke = function() {
	dojs.http.ajax({
		//显示等待层 (详细参见script/do/defaultSetting/httpSetting.js中的配置)
		parent:"needWaitting",
		url:"202.106.2.333",
		//设置3秒超时
		timeout:3000,
		success:function(data){
			dojs.core.toast(data);
		},
		error:function(data){
			dojs.core.error(data);
		}
	});
};
