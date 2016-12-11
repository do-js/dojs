//variable
var do_Page = sm("do_Page");
var root = ui("$");
// event
root.on("usreControlInit", function(_option) {
	if (_option.content) {
		var d = _option.content;
		for (var i = 0; i < d.length; i++) {
			d[i]["closeButton"] = _option.closeButton;
		}
		var listdata = mm("do_ListData");
		listdata.addData(d);
		ui("$").bindItems(listdata);
		ui("$").refreshItems();
	}
});