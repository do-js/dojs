var core=require("do/core");
var http=require("do/http");
var global=require("do/global");
var page=require("do/page");
var style=require("do/style");

style.css(ui("do_ALayout_topbar"), "pageTopbar");
style.css(ui("do_ALayout_back"), "dynamicButton");

page.allowClose(ui("do_ALayout_back"));

sm("do_Page").on("loaded",function(){
	var data=sm("do_Page").getData();
	if (core.isNullData(data) || core.isNullData(data.title)) return;
	ui("do_Label_title").text = data.title;
	
	if (!core.isNullData(data) && !core.isNullData(data.hint)){
		ui("do_Label_hint").text = data.hint;
	}
	
	ui("do_BarcodeView_Scaner").start(function(data){
		sm("do_Device").beep();
		sm("do_App").closePage({
			moduleType:"$$scanBarcode$$",
			result:{
				value:data.value, 
				code:data.code
			}
		});
	});
});
