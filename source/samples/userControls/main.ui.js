var dojs = require("dojs");

dojs.style.css(ui("do_ALayout_topbar"), "pageTopbar");

var jsonData = [ {
	id : "appGuide",
	Name : "应用引导视图"
}, {
	id : "imageBanner",
	Name : "轮播图"
}, {
	id : "radioButton",
	Name : "单选框"
}, {
	id : "starComment",
	Name : "五星评价"
}, {
	id : "topBar",
	Name : "顶部导航栏"
} ];

var do_ListData = mm("do_ListData");
do_ListData.addData(jsonData);
ui("do_ListView_index").bindItems(do_ListData);

ui("do_ListView_index").on("touch", function(_index) {
	var data = jsonData[_index];
	dojs.core.openPage({
		source : "source://samples/userControls/demo.ui",
		animationType : "push_r2l_1",
		data : data,
		statusBarState : "transparent"
	});
});
