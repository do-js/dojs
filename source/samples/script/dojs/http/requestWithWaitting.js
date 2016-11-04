var simpleIndex = require("source://modules/simpleIndex/call");
var dojs = require("dojs");

module.exports.call = function() {
	dojs.http.ajax({
		parent:"needWaitting",
		url:"http://www.sina.com.cn",
		success:function(data){
			dojs.core.alert(data);
		},
		error:function(data){
			core.error(data);
		}
	});
};
