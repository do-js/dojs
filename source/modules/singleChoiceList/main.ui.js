//require
var dojs = require("dojs");
// ui
var listview = ui("do_ListView_1");
// var
var listdata;
// init
(function() {
	dojs.style.css(ui("do_ALayout_topbar"), "pageTopbar");
	dojs.style.css(ui("do_ALayout_back"), "dynamicButton");

	dojs.page.allowClose(ui("do_ALayout_back"));

	initData();
})();

// event
function returnResult(index) {
	sm("do_App").closePage({
		moduleType : "$$singleChoiceList$$",
		result : {
			value : listdata.getOne(index)
		}
	});
}

dojs.page.onTouch(listview, function(index) {
	if (index == 0)
		return;
	for (var i = 1; i < listdata.getCount(); i++) {
		var d = listdata.getOne(i);
		if (i == index)
			d.selected = true;
		else
			d.selected = false;
		listdata.updateOne(i, d);
	}
	listview.refreshItems();
	returnResult(index);
});

// private function
function initData() {
	var data = sm("do_Page").getData();
	if (!dojs.core.isNullData(data) && !dojs.core.isNullData(data.title)) {
		ui("do_Label_title").text = data.title;
	}

	if (!dojs.core.isNullData(data) && !dojs.core.isNullData(data.data)) {
		listdata = mm("do_ListData");
		listview.bindItems(listdata);

		listdata.addOne({
			template : 1
		});
		var selected = 0;
		if (!dojs.core.isNullData(data.selected)) {
			selected = data.selected;
		}
		for (var i = 0; i < data.data.length; i++) {
			var d = data.data[i];
			if (i == selected) {
				d.selected = true;
			} else {
				d.selected = false;
			}
		}
		listdata.addData(data.data);
		listview.refreshItems();
	}
}