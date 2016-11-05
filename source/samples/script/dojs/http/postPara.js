var dojs = require("dojs");

module.exports.call = function() {
	dojs.http.ajax({
		url:"https://www.baidu.com/s",
		//请求的类型
		type:"POST",
		//要发送到服务器的数据
		data:{
			ie:"utf-8",
			wd:"deviceone"
		},
		success:function(data){
			dojs.core.alert(data);
		},
		error:function(data){
			dojs.core.error(data);
		}
	});
};
