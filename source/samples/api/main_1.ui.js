var dojs = require("dojs");

ui("$").setMapping({
	"do_Label_name.text" : "name",
	"do_Label_id.text" : "id"
});
var imageview = ui("do_ImageView_1");

dojs.style.css(ui("do_ALayout_2"), "dynamicButton");
dojs.style.css(ui("$"), "navigatorCell");

var data = null;
var entry = null;
ui("$").on("dataRefreshed", function(d) {
	var size = d.size;
	if (size >= (1024 * 1024))
		size = (size / (1024 * 1024)).toFixed(2) + "M";
	else if (size >= 1024)
		size = (size / 1024).toFixed(2) + "K";
	else
		size = size + "B";
	ui("do_Label_size").text = size;
	if (!d.newmd5 || (d.newmd5 && d.newmd5 != d.md5)) {
		ui("do_ALayout_flag").visible = true;
		imageview.source = "source://image/samples/api/update.png";
		data = d;
		entry = null;
	} else {
		ui("do_ALayout_flag").visible = false;
		imageview.source = "source://image/samples/api/arrow.png";
		entry = d.entry;
		data = null;
	}
}).on("touch", function() {
	if (entry) {
		sm("do_App").openPage({
			source : entry,
			statusBarState : "transparent"
		});
	}
})
ui("do_ALayout_2").on("touch", function() {
	if (data == null)
		return;
	var http = mm("do_Http");
	// 显示等待窗口
	var waittingLayer = require("source://modules/waittingLayer/call");
	waittingLayer.invoke({
		hint : "请稍后"
	});
	var src = "data://" + data.id + ".zip";
	http.url = data.url;
	http.on("result", function(d) {
		sm("do_Storage").unzip(src, "data://temp/" + data.id, function(_d, e) {
			var updatesrc = "data://temp/" + data.id + "/source/view/" + data.type;
			dojs.core.p(updatesrc + "/" + data.id + "/main.ui");
			dojs.core.p("xxx" + sm("do_Storage").fileExist(updatesrc + "/" + data.id + "/main.ui"));
			sm("do_App").update([ updatesrc ], "source://view", function() {
				sm("do_Page").fire("installed", data.id);
				// 隐藏等待窗口
				var waittingLayer = require("source://modules/waittingLayer/call");
				waittingLayer.invoke({
					close : true
				});
			})
		})

	})
	http.download(src);
})