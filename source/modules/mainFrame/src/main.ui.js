var dojs = require("dojs");

dojs.page.allowExit();

var viewShower_data;
var bottom_uis;

var data = sm("do_Page").getData();
var buttonCount = data.length;
if (buttonCount > 5) {
	dojs.core.error("mainFrame最多只能支持5个底部按钮");
} else {
	viewShower_data = [];
	bottom_uis = [];
	var width = Math.floor(750 / buttonCount);
	var x = 0;
	for (var i = 0; i < buttonCount; i++) {
		var addedUI = ui(ui("do_ALayout_bottom").add("addedUI" + i, "source://modules/mainFrame/src/main_1.ui", x, 0));
		x = x + width;
		data[i]["width"] = width;
		addedUI.fire("initWidth", data[i]);
		bottom_uis[i] = addedUI;
		viewShower_data.push({
			id : "b_" + i,
			path : data[i].path
		});
	}
	ui("do_ViewShower_index").addViews(viewShower_data);
	for (var i = 0; i < buttonCount; i++) {
		bottom_uis[i].on("touch", i, function(d, e) {
			var index = e.data;
			for (var j = 0; j < bottom_uis.length; j++) {

				if (j == index) {
					data[j]["selected"] = "1";
				} else {
					data[j]["selected"] = "0";
				}
				bottom_uis[j].fire("selected", data[j]);
			}
			ui("do_ViewShower_index").showView(viewShower_data[index].id);
		})
	}
	bottom_uis[0].fire("touch");
}
