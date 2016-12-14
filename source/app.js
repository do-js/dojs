var d1 = require("deviceone");
var dojs = require("dojs");

var options = [ {
	name : "scripts",
	path : "source://samples/script/main.ui",
	image_on : "source://image/samples/a_2.png",
	image_off : "source://image/samples/a_1.png",
	fontColor_on : "55C5B9FF",
	fontColor_off : "9E9E9EFF"
}, {
	name : "modules",
	path : "source://samples/modules/main.ui",
	image_on : "source://image/samples/b_2.png",
	image_off : "source://image/samples/b_1.png",
	fontColor_on : "55C5B9FF",
	fontColor_off : "9E9E9EFF"
}, {
	name : "uControls",
	path : "source://samples/userControls/main.ui",
	image_on : "source://image/samples/c_2.png",
	image_off : "source://image/samples/c_1.png",
	fontColor_on : "55C5B9FF",
	fontColor_off : "9E9E9EFF"
}, {
	name : "API",
	path : "source://samples/api/main.ui",
	image_on : "source://image/samples/d_2.png",
	image_off : "source://image/samples/d_1.png",
	fontColor_on : "55C5B9FF",
	fontColor_off : "9E9E9EFF"
}, {
	name : "examples",
	path : "source://samples/others/main.ui",
	image_on : "source://image/samples/e_2.png",
	image_off : "source://image/samples/e_1.png",
	fontColor_on : "55C5B9FF",
	fontColor_off : "9E9E9EFF"
} ];

d1.sm("do_App").on("loaded", function() {
	var mainFrame = require("source://modules/mainFrame/call");
	mainFrame.invoke(options);
});