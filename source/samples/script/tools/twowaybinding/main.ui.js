/**
 * related to main.ui
 * 
 * @Author : and
 * @Timestamp : 2016-11-06
 */
// require
var twowaybinding = require("tools/twowayBinding");
var dojs = require("dojs");
// variable
var binding_id;
// initialize
(function() {
	dojs.page.allowClose(ui("back"));

	var data = sm("do_Page").getData();

	// 订阅映射关系
	binding_id = twowaybinding.define(ui("$"), {
		"do_TextField_1.text" : "data1",
		"do_TextField_2.text" : "data2",
		"do_TextField_3.text" : "data3",
		"do_TextField_4.text" : "data4",
		"do_TextField_5.text" : "data5",
	});
	// 第二条数据设置的时候经过一个函数转换
	twowaybinding.filter(binding_id, "do_TextField_2.text", function(d) {
		return "(" + d + ")";
	})
	// 设置数据
	twowaybinding.setData(binding_id, data);
})();

// event
ui("do_Button_commit").on("touch", function() {
	// 提交的时候获取所有数据，在close page的时候传递给下面的Page
	var data = twowaybinding.getData(binding_id);
	sm("do_App").closePage(data);
})