/**
 * related to template.ui
 * 
 * @Author : zxhuizhi@126.com
 * @Timestamp : 2016-11-12
 */
var dojs = require("dojs");
ui("$").setMapping({
	"bgImageView.source" : "bgImage",
	"entryButton.visible" : "isLast"
})
dojs.style.css(ui("entryButton"), "dynamicButton");

ui("entryButton").on("touch", function() {
	sm("do_App").closePage();
})