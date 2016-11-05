var dojs = require("dojs");

module.exports.call = function() {
	dojs.http.ajax({
		url : "https://www.baidu.com/s",
		type : "POST",
		data : {
			key : "k1",
			name : "n1"
		},
		success : function(data) {
			dojs.core.alert(data);
		},
		error : function(data) {
			dojs.core.error(data);
		},
		// 是否使用调试数据
		useMockData : true,
		// 调试数据
		mockData : [
		// 提供多项数据，返回第一个满足适配条件的结果（包括：type, url两个适配条件）
		{
			type : "GET",
			url : "https://www.baidu.com/s?key=k1&name=n1",
			data : {
				name : "张鹏001",
				age : 33,
				address : "辽宁省沈阳市浑南区"
			}
		}, {
			type : "POST",
			url : "https://www.baidu.com/s?key=k2&name=n1",
			data : {
				name : "张鹏002",
				age : 33,
				address : "辽宁省沈阳市浑南区"
			}
		}, {
			type : "POST",
			url : "https://www.baidu.com/s?key=k1&name=n1",
			data : {
				name : "张鹏003",
				age : 33,
				address : "辽宁省沈阳市浑南区"
			}
		}, {
			//不限定任何条件
			data : {
				name : "张鹏004",
				age : 33,
				address : "辽宁省沈阳市浑南区"
			}
		} ]
	});
};
