var root = ui("$");

root.setMapping({
	"tag" : "tag",
	"source" : "bgImage"
});

root.on("touch", function() {
	sm("do_Page").fire("imageBanneronBannerTouch", this.tag);
});