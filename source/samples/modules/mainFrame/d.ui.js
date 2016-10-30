var dojs=require("dojs");
dojs.style.css(ui("do_ALayout_topbar"), "pageTopbar");

ui("do_ALayout_back").on("touch", function(){
	dojs.core.closePage();
});