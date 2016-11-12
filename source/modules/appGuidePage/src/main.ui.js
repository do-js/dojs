var dojs = require("dojs");

// initialize
(function() {
	var data = sm("do_Page").getData();
	if (data.data) {
		var d = data.data;
		for (var i = 0; i < d.length; i++) {
			d[i].isLast = false;
			if (i == d.length - 1)
				d[i].isLast = true;
		}
		var listdata = mm("do_ListData");
		listdata.addData(d);
		ui("$").bindItems(listdata);
		ui("$").refreshItems();
	}
})();
