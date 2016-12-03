/**
 * related to template.ui
 * 
 * @Author : zxhuizhi@126.com
 * @Timestamp : 2016-11-12
 */
var dojs = require("dojs");
ui("$").setMapping({
	"bgImageView.source" : "path",
	"do_Button_close.visible" : "showCloseButton",
	"do_Button_close.x" : "x",
	"do_Button_close.y" : "y",
	"do_Button_close.text" : "text",
	"do_Button_close.width" : "width",
	"do_Button_close.bgColor" : "bgColor",
	"do_Button_close.fontColor" : "fontColor"
})
dojs.style.css(ui("do_Button_close"), "dynamicButton");

ui("do_Button_close").on("touch", function() {
	sm("do_Page").fire("appCuideClose");
})

ui("$").on("dataRefreshed", function(){
	ui("do_Button_close").redraw(); 
});