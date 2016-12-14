/**
 * related to main.ui
 * 
 * @Author : and
 * @Timestamp : 2016-10-03
 */

// variable
var do_Page = sm("do_Page");
var root = ui("$");
// event
root.on("usreControlInit", function(_option) {
	root.visible = false;
	root.width = _option.width;
	root.height = _option.height;
	var _w = root.width / 5;
	var _h = root.height;
	for (var i = 0; i < 5; i++) {
		var star = ui("star" + (i + 1))
		star.width = _w;
		star.height = _h;
		star.x = i * _w;
		star.on("touch", (i + 1), function(d, e) {
			comment(d, e);
		})
	}
	root.redraw();
	if (_option["star"]) {
		comment(null, {
			data : _option["star"]
		})
	}
	root.visible = true;

});

// private function
function comment(d, e) {
	var i = parseInt(e.data);
	for (var j = 0; j < i; j++) {
		ui("star" + (j + 1)).source = "source://userControls/starComment/src/star.png"
	}
	for (var j = i; j < 5; j++) {
		ui("star" + (j + 1)).source = "source://userControls/starComment/src/starep.png"
	}
	root.fire("onStarTouch", i);
}