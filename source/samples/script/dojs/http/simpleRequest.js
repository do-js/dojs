var dojs = require("dojs");

module.exports.invoke = function() {
	dojs.http.ajax({
		url:"http://www.baidu.com",
		success:function(data){
			dojs.core.toast(data);
		},
		error:function(data){
			dojs.core.error(data);
		}
	});
};
