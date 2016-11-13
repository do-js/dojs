var dojs = require("dojs");
ui("$").setMapping({
	"do_ALayout_body.tag" : "path",
	"do_Button_close.visible" : "showCloseButton",
	"do_Button_close.y" : "y",
	"do_Button_close.x" : "x",
	"do_Button_close.text" : "text",
	"do_Button_close.width" : "width",
	"do_Button_close.bgColor" : "bgColor",
	"do_Button_close.fontColor" : "fontColor"
	
});
dojs.style.css(ui("do_Button_close"), "dynamicButton");
ui("do_Button_close").on("touch", function() {
	sm("do_Page").fire("appCuideClose");
});

ui("$").on("dataRefreshed", function(){
	ui("do_ALayout_body").add("uipath", ui("do_ALayout_body").tag);
	ui("do_Button_close").redraw(); 
});
