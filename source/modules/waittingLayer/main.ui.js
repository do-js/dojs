var dojs=require("dojs");

function hideView(_func){
	sm("do_Page").hideKeyboard();
	ui("$").visible = false;
}
dojs.page.allowHide(
	ui("$"), 
	function(data){
		if (!dojs.core.isNullData(data.hint)){
			ui("do_Label_prompt").text = data.hint;
		}
		else{
			ui("do_Label_prompt").text = "请稍后";
		}
		ui("$").visible=true;
	},
	function(data){
		hideView();
	},
	{
		allowUserCloseView:false
	}
);

var do_ALayout_root=ui("do_ALayout_root");
var do_Label_prompt=ui("do_Label_prompt");
var do_ProgressBar2_show=ui("do_ProgressBar2_show");
do_ProgressBar2_show.progress = 50;


