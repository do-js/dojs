var core=require("do/core");
var dojs=require("dojs");

module.exports.demo = function(){

	dojs.modules.scanBarcode(
		{title:"扫描二维码", hint:"扫描二维码"},
			function(data){
				//显示输入结果
			core.alert(data.value, data.code);
		}
	);
};
