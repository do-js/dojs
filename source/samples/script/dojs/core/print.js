var dojs = require("dojs");
var d1 = require("deviceone");

module.exports.call = function() {
	var data1 = {
		name : "张晓丹",
		age : 32
	}
	dojs.core.p(data1);
	
	var data2 = [ "张晓丹", "刘成伟" ];
	dojs.core.p(data2);
	
	var hashdata = d1.mm("do_HashData");
	hashdata.addData(data1)
	dojs.core.p(hashdata);
	
	var listdata = d1.mm("do_ListData");
	listdata.addData(data2);
	dojs.core.p(listdata);
	
	dojs.core.toast("已在logger中打印");
};
