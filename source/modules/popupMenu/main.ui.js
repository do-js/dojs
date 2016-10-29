var d1 = require("deviceone");

var core=require("do/core");
var http=require("do/http");
var global=require("do/global");
var page=require("do/page");
var style=require("do/style");

var animHide;
function hideView(_func){
	if (!ui("$").visible) return;
	sm("do_Page").hideKeyboard();
	ui("do_ListView_index").animate(animHide, function(){
		ui("$").visible = false;
		if (_func){
			_func.call(this);
		}
	});
}
var json_data;
var do_ListData=mm("do_ListData");
page.allowHide(
	ui("$"), 
	function(data){
		var height=0;
		if (data){
			json_data=[];
			for(var i=0; i<data.length; i++){
				if (core.isNullData(data[i].name)){
					json_data.push({template:1});
					height+=10;
				}
				else{
					json_data.push({template:0, name:data[i].name});
					height+=110;
				}				
			}
			if (height <=0){
				ui("do_ListView_index").visible=false;
				return;
			}
			if (height > 900) height=900;
			ui("do_ListView_index").height=height;
			ui("do_ListView_index").y= 1334;
			ui("do_ListView_index").redraw();
			do_ListData.removeAll();
			do_ListData.addData(json_data);
			ui("do_ListView_index").bindItems(do_ListData);
			ui("$").visible=true;
			var animShow = mm("do_Animator");
			animHide = mm("do_Animator");
			animShow.append(300, {
			    "y" : 1334-height
			});
			animHide.append(100, {
				"y" :1334
			});
			ui("do_ListView_index").animate(animShow);
		}
		else{
			ui("do_ListView_index").visible=false;
			ui("$").visible=true;
		}
	},
	function(data){
		hideView();
	}
);

ui("do_ListView_index").on("touch", function(_index){
	var data = json_data[_index];
	if (data.template !=0) return;
	hideView(function(){
		d1.sm("do_Page").fire("$$modules_internal_Event$$", 
				{moduleType:"$$popupMenu$$", result:{index:_index}});
	});
});
