var simpleIndex = require("source://modules/simpleIndex/call");
var dojs = require("dojs");

module.exports.call = function() {
	dojs.http.ajax({
		url:"http://www.baidu.com",
		success:function(data){
			dojs.core.alert(data);
		},
		error:function(data){
			core.error(data);
		}
	});
};
