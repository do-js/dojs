module.exports.demo = function() {
	var scanBarcode=require("source://modules/scanBarcode/call");
	scanBarcode.invoke({
		//标题
		title : "扫描二维码",
		//提示内容
		hint : "扫描二维码",
		//回调事件
		onCallback:function(data){
			//此处可以编写回调代码
			var dojs=require("dojs");
			dojs.core.alert(data.value, data.code);
		}
	});
};
