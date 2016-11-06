var dojs = require("dojs");
var d1 = require("deviceone");

var data = {
	data1 : "数据1",
	data2 : "数据2",
	data3 : "数据3",
	data4 : "数据4",
	data5 : "数据5"
};

module.exports.invoke = function() {
	dojs.core.openPage({
		source : "source://samples//script/tools/twowaybinding/main.ui",
		animationType : "push_r2l_1",
		statusBarState : "transparent",
		data : data
	});
};
d1.sm("do_Page").on("result", function(d) {
	if (d)
		data = d;
})