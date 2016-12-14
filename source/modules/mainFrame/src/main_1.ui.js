var dojs = require("dojs");

var image_button = ui("do_ImageView_button");
var label_button = ui("do_Label_button");

ui("$").on("initWidth", function(data) {
	var _width = data["width"];
	if (this.width != _width) {
		this.width = _width;
		image_button.x = (_width - image_button.width) / 2;
		label_button.width = _width;
		this.redraw();
	}
	image_button.source = data.image_off;
	label_button.fontColor = data.fontColor_off;
	label_button.text = data.name;

}).on("selected", function(data) {
	if (data.selected == "1") {
		image_button.source = data.image_on;
		label_button.fontColor = data.fontColor_on;
	} else {
		image_button.source = data.image_off;
		label_button.fontColor = data.fontColor_off;
	}
});
