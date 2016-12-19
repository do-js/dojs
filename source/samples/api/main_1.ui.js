var dojs = require("dojs");

ui("$").setMapping({
	"do_Label_name.text" : "name",
	"do_Label_id.text" : "id"
});
var imageview = ui("do_ImageView_1");

dojs.style.css(ui("do_ALayout_2"), "dynamicButton");
dojs.style.css(ui("$"), "navigatorCell");


ui("$").on("dataRefreshed", function(d) {
	var size = d.size;
	if (size >= (1024 * 1024))
		size = (size / (1024 * 1024)).toFixed(2) + "M";
	else if (size >= 1024)
		size = (size / 1024).toFixed(2) + "K";
	else
		size = size + "B";
	ui("do_Label_size").text = size;

	if (!d.newmd5 || (d.newmd5 && d.newmd5 != d.md5)) {
		ui("do_ALayout_flag").visible = true;
		imageview.source = "source://image/samples/api/update.png";
		imageview.enabled = true;
	} else {
		ui("do_ALayout_flag").visible = false;
		imageview.source = "source://image/samples/api/arrow.png";
		imageview.enabled = false;
	}
})
ui("do_ALayout_2").on("touch", function() {
	
})