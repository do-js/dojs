var dojs = require("dojs");

dojs.style.css(ui("do_ALayout_topbar"), "pageTopbar");
dojs.style.css(ui("do_ALayout_back"), "dynamicButton");
dojs.page.allowClose(ui("do_ALayout_back"));
dojs.page.allowHideKeyboard();

var data = sm("do_Page").getData();

sm("do_Page").on("loaded", function(){
	var _rq=require("source://userControls/" + data.id + "/sample/test");
	_rq.demo(ui("do_ALayout_content"));
});
