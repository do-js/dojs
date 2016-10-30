var dojs=require("dojs");

dojs.style.css(ui("do_ALayout_topbar"), "pageTopbar");
dojs.style.css(ui("do_ALayout_back"), "dynamicButton");

style.css(ui("do_ALayout_topbar"), "pageTopbar");
dojs.page.allowClose(ui("do_ALayout_back"));

sm("do_Page").on("loaded",function(){
	var data=sm("do_Page").getData();
	if (dojs.core.isNullData(data) || dojs.core.isNullData(data.title)) return;
	ui("do_Label_title").text = data.title;
	
	if (!dojs.core.isNullData(data) && !dojs.core.isNullData(data.hint)){
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
