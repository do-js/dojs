/**
 * related to main.ui
 * 
 * @Author : and
 * @Timestamp : 2016-10-03
 */

// variable
var do_Page = sm("do_Page");
var tags = [ "radio1", "radio2", "radio3", "radio4", "radio5" ];
var radius = 25;
var root = ui("$");
// event
root.on("usreControlInit", function(_option) {
	root.visible = false;
	root.width = _option.width;
	root.height = _option.height;
	var count = _option.content.length;
	if (count > 5)
		count = 5;
	var _w = root.width / count;
	var _h = root.height;
	var zoom = 50 / 125;
	for (var i = 0; i < count; i++) {
		ui(tags[i]).width = _w;
		ui(tags[i]).height = _h;
		ui(tags[i]).x = _w * i;

		drawRound(ui(tags[i] + "_1"), ui(tags[i] + "_2"), _w * zoom, _h, (_option.selected == i));

		drawTitle(ui(tags[i] + "_3"), _w, _h, zoom, _option.content[i]);
	}
	for (var i = count; i < 5; i++) {
		ui(tags[i]).visible = false;
	}
	root.redraw();
	root.visible = true;
});
for (var i = 0; i < tags.length; i++) {
	var click = ui(tags[i]);
	click.on("touch", i, function(d, e) {
		send_type(d, e);
	})
}
// private Function

function drawTitle(v, _w, _h, zoom, data) {
	v.x = _w * zoom + 2;
	v.y = 2;
	v.width = _w * (1 - zoom) - 4;
	v.height = _h - 4;
	v.text = data.text;
	v.tag = data.tag;
}
function drawRound(v1, v2, w, h, isSelected) {
	var r = Math.min(w, h);
	v1.width = r - 4;
	v1.height = r - 4;
	v1.x = (w - v1.width) / 2;
	v1.y = (h - v1.height) / 2

	radius = v1.width / 2;
	if (isSelected)
		v1.border = "FF8000FF,1," + radius;
	else
		v1.border = "000000FF,1," + radius;

	v2.width = radius;
	v2.height = radius;
	v2.x = (v1.width - v2.width) / 2;
	v2.y = (v1.height - v2.height) / 2;

	if (isSelected)
		v2.bgColor = "FF8000FF";
	else
		v2.bgColor = "00000000";
}

function send_type(d, e) {
	var i = e.data;
	var d = {};
	var tagLabel = ui(tags[i] + "_3");
	d.text = tagLabel.text;
	d.tag = tagLabel.tag;
	root.fire("onSelected", d);

	for (var j = 0; j < tags.length; j++) {
		var border = ui(tags[j] + "_1");
		var bgcolor = ui(tags[j] + "_2");
		if (i == j) {
			border.border = "FF8000FF,1," + radius;
			bgcolor.bgColor = "FF8000FF";
		} else {
			border.border = "000000FF,1," + radius;
			bgcolor.bgColor = "00000000";
		}
	}
}