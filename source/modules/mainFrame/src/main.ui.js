var dojs=require("dojs");

dojs.page.allowExit();

var viewShower_data;
var gridView_data;
var do_ListData=mm("do_ListData");

var lastIndex=0;
ui("do_GridView_bottom").on("touch", function(_index){
	if (typeof(_index)=="string") _index=parseInt(_index);
	ui("do_ViewShower_index").showView(viewShower_data[_index].id);
	for(var i=0; i< gridView_data.length; i++){
		if (i==_index){
			if (gridView_data[i].selected!="1"){
				gridView_data[i].selected="1";
				do_ListData.updateOne(i, {
					data:gridView_data[i].data,
					selected:"1"
				});
			}
		}
		else{
			if (gridView_data[i].selected!="0"){
				gridView_data[i].selected="0";
				do_ListData.updateOne(i, {
					data:gridView_data[i].data,
					selected:"0"
				});
			}
		}
	}
	if (_index== lastIndex){
		ui("do_GridView_bottom").refreshItems([_index]);
	}
	else{
		ui("do_GridView_bottom").refreshItems([_index, lastIndex]);
	}	
	lastIndex=_index;
});

var data=sm("do_Page").getData();
var buttonCount=data.length;
if (buttonCount > 5){
	dojs.core.error("mainFrame最多只能支持5个底部按钮");
}
else{
	viewShower_data=[];
	gridView_data=[];
	var width=Math.floor(750/buttonCount);
	var x=Math.floor((width /2) -25);
	for(var i=0; i<buttonCount; i++){
		data[i].x=x;
		data[i].width=width;
		gridView_data.push({
			selected:"0",
			data:data[i]
		});
		viewShower_data.push({
			id:"b_" + i,
			path:data[i].path
		});
	}
	do_ListData.addData(gridView_data);
	ui("do_GridView_bottom").hSpacing=750/buttonCount -150;
	ui("do_GridView_bottom").numColumns=buttonCount;
	ui("do_GridView_bottom").bindItems(do_ListData);
	ui("do_ViewShower_index").addViews(viewShower_data);
	ui("do_GridView_bottom").fire("touch", 0);
}
