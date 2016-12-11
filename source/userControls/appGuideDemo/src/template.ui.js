/**
 * related to template.ui
 * 
 * @Author : zxhuizhi@126.com
 * @Timestamp : 2016-11-12
 */
var dojs = require("dojs");
ui("$").setMapping({
	"tag" : "tag",
	"bgImageView.source" : "bgImage",
	"entryButton.visible" : "showCloseButton"
})
dojs.style.css(ui("entryButton"), "dynamicButton");

ui("entryButton").on("touch", function() {
	sm("do_Page").fire("appGuideonCallback", ui("$").tag);
})

ui("$").on("dataRefreshed", function(d) {
	if (d["closeButton"])
		ui("entryButton").set(d["closeButton"]);
})