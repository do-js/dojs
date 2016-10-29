var d1 = require("deviceone");
var dojs=require("dojs");

d1.sm("do_App").on("loaded", function() {
	dojs.core.openPage("source://samples/modules/main.ui");
});