var d1 = require("deviceone");

d1.sm("do_App").on("loaded", function() {
	d1.sm("do_App").openPage({
		source:"source://samples/script/main.ui",
		statusBarState:"transparent",
		animationType: "fade"
	});
});