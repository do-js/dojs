var dojs = require("dojs");
require("ext/stringExt")

dojs.style.css(ui("do_ALayout_topbar"), "pageTopbar");
dojs.style.css(ui("do_ALayout_back"), "dynamicButton");

dojs.page.allowClose(ui("do_ALayout_back"));

var data = sm("do_Page").getData();
if (dojs.core.isNullData(data)) data={};
if (dojs.core.isNullData(data.option)) data.option={};
if (!dojs.core.isNullData(data.option.title)) {
	ui("do_Label_title").text = data.option.title;
}
if (dojs.core.isNullData(data.model)) data.model=[];
var json_data=[];
var do_ListData=mm("do_ListData");
for(var i=0; i<data.model.length; i++){
	if (dojs.core.isNullData(data.model[i].name)){
		json_data.push({template:2});
	}
	else{
		if (dojs.core.isNullData(data.model[i].image)){
			json_data.push({template:0, name:data.model[i].name, path:data.model[i].path});
		}
		else{
			json_data.push({template:1, name:data.model[i].name, path:data.model[i].path, image:data.model[i].image});
		}
	}	
}
do_ListData.removeAll();
do_ListData.addData(json_data);
ui("do_ListView_index").bindItems(do_ListData);

ui("do_ListView_index").on("touch", function(_index){
	if (_index <0) return;
	var data = json_data[_index];
	if (data.template ==2) return;
	if (dojs.core.isNull(data.path)) return;
	if (data.path.endWith(".ui")){
		dojs.core.openPage({source:data.path});
	}
	else{
		var _jsFile=require(data.path);
		_jsFile.invoke();
	}
});
