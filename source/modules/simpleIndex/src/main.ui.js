var dojs = require("dojs");

dojs.style.css(ui("do_ALayout_topbar"), "pageTopbar");
dojs.style.css(ui("do_ALayout_back"), "dynamicButton");
dojs.style.css(ui("do_Button_ok"), "dynamicButton");
dojs.style.css(ui("do_ALayout_close"), "dynamicButton");

dojs.page.allowClose(ui("do_ALayout_back"));

var initValue = "";

function returnResult() {
	sm("do_Page").hideKeyboard();
	sm("do_App").closePage({
		moduleType : "$$inputTextField$$",
		result : {
			value : ui("do_TextField_Data").text
		}
	});
}

dojs.page.onTouch(ui("do_Button_ok"), function() {
	returnResult();
});

ui("do_TextField_Data").on("enter", function() {
	returnResult();
});

ui("do_TextField_Data").on("textChanged", function() {
	if (ui("do_TextField_Data").text == initValue) {
		ui("do_ALayout_close").visible = false;
	} else {
		ui("do_ALayout_close").visible = true;
	}
});

ui("do_ALayout_close").on("touch", function() {
	ui("do_TextField_Data").text = "";
});
ui("do_ALayout_close").visible = false;

var data = sm("do_Page").getData();
if (!dojs.core.isNullData(data)) {
	if (!dojs.core.isNullData(data.title)) {
		ui("do_Label_title").text = data.title;
	}
	
}