var dojs = require("dojs");

module.exports.invoke = function() {
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
		mockData : [ {
			data : {
				name : "张鹏",
				age : 33,
				address : "辽宁省沈阳市浑南区"
			}
		} ]
	});
};
