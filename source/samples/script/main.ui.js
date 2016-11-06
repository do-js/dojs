var dojs=require("dojs");

dojs.style.css(ui("do_ALayout_topbar"), "pageTopbar");

function dojs_test(){
	var _indexDefine = [ {
		name : "core",
		path : "source://samples/script/dojs/core/index"
	}, {
		name : "http",
		path : "source://samples/script/dojs/http/index"
	}, {
		name : "style",
		path : "source://samples/script/dojs/style/main.ui"
	}, {
		name : "page",
		path : "source://samples/script/dojs/page/index"
	}, {
		name : "global",
		path : "source://samples/script/dojs/global/index"
	}];
	var simpleIndex = require("source://modules/simpleIndex/call");
	simpleIndex.invoke(_indexDefine, {
		title : "dojs"
	});
}
function ext_test(){
	dojs.core.alert("todo");
}
function tools_test(){
	dojs.core.alert("todo");
}
var jsonData=[
              {Name:"dojs", callback:dojs_test},
              {Name:"ext", callback:ext_test},
              {Name:"tools", callback:tools_test}
];


var do_ListData=mm("do_ListData");
do_ListData.addData(jsonData);
ui("do_ListView_index").bindItems(do_ListData);

ui("do_ListView_index").on("touch", function(_index){
	var data=jsonData[_index];
	if (data.callback){
		data.callback.call(this);
	}

});
