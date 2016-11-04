var dojs=require("dojs");

dojs.style.css(ui("do_ALayout_topbar"), "pageTopbar");

function dojs_test(){
	var _indexDefine = [ {
		name : "http",
		path : "source://samples/script/dojs/http/index"
	}, {
		name : "我的二维码",
		image : "source://modules/simpleIndex/sample/b.png",
		//打开指定的页面
		path : "source://modules/simpleIndex/sample/b.ui"
	}];
	var simpleIndex = require("source://modules/simpleIndex/call");
	simpleIndex.call(_indexDefine, {
		title : "dojs"
	});
}


var jsonData=[
              {id:"dojs", Name:"dojs", callback:dojs_test}
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
