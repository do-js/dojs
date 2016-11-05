var dojs = require("dojs");

module.exports.call = function() {
	dojs.http.ajax({
		url : "https://www.baidu.com/s",
		type : "POST",
		data : {
			ie : "utf-8",
			wd : "deviceone"
		},
		success : function(data) {
			dojs.core.toast(data);
		},
		error : function(data) {
			dojs.core.error(data);
		},
		// 是否使用调试数据
		useMockData : true,
		// 调试数据
		mockData : [
		// 调试文件存放在 initdata://mock/ 目录下
		{
			result : "baidu/s_POST.json"
		} ]
	});
};
