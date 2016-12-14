/**
 * related to template.ui
 * 
 * @Author : and
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
	sm("do_Page").fire("onAppGuideCloseButtonTouch", ui("$").tag);
})

ui("$").on("dataRefreshed", function(d) {
	if (d["closeButton"])
		ui("entryButton").set(d["closeButton"]);
})