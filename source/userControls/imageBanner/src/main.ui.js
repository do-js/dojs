var dojs = require("dojs");
// variable
var do_Page = sm("do_Page");
var root = ui("$");
// event
root.on("initialize", function(_option) {
	if (_option["content"]) {
		var data = _option["content"];
		var listdata = mm("do_ListData");
		ui("slideview").bindItems(listdata);

		listdata.addData(data);
		ui("slideview").refreshItems();
		var l = data.length;
		for (var i = l; i < 6; i++) {
			ui("index" + i).visible = false;
		}

		ui("slideview").on("indexChanged", l, function(index, e) {
			var l = e.data;
			for (var i = 0; i < l; i++) {
				if (index == i) {
					ui("label" + i).bgColor = "48A4FFAA";
				} else {
					ui("label" + i).bgColor = "FFFFFFAA";
				}
			}
		});
	}
	if (_option["isLoop"]) {
		ui("slideview").looping = true;
	}
	if (_option["interval"]) {
		ui("slideview").startLoop(_option["interval"]);
	}
});
