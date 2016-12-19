var dojs = require("dojs");

var listdata = mm("do_ListData");

(function() {
	dojs.style.css(ui("do_ALayout_topbar"), "pageTopbar");

	dojs.http.ajax("http://175.102.18.107:8088/APISampleBuilder/api", {
		parent : "needWaitting",
		success : function(_result) {
			if (sm("do_Storage").fileExist("data://api.json")) {
				update(_result);
			} else {
				save(_result);
				refresh(_result);
			}

		}
	});
})();

// private function
function save(_d) {
	sm("do_Storage").writeFile("data://api.json", _d, function() {

	})
}
function update(_result) {
	sm("do_Storage").readFile("data://api.json", function(d) {
		for (var i = 0; i < d.length; i++) {
			var id = d[i].id;
			var newmd5 = getMd5(_result, id);
			if (newmd5)
				d[i].newmd5 = newmd5;
		}
		refresh(d);
		save(d);
	})
}
function getMd5(_data, id) {
	for (var i = 0; i < _data.length; i++) {
		if (_data[i].id == id)
			return _data[i].md5;
	}
	return null;
}
function refresh(_result) {
	ui("do_ListView_index").bindItems(listdata);
	listdata.addData(_result);
	ui("do_ListView_index").refreshItems();
}