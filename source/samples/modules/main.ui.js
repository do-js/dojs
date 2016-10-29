var dojs=require("dojs");

dojs.style.css(ui("do_ALayout_topbar"), "pageTopbar");
dojs.style.css(ui("do_ALayout_back"), "dynamicButton");

dojs.page.allowClose(ui("do_ALayout_back"));

var jsonData=[
              {id:"inputTextField", Name:"接收单行文本的输入"},
              {id:"scanBarcode", Name:"扫描二维码"},
              {id:"popupMenu", Name:"弹出菜单"},
              {id:"singleChoiceList", Name:"弹出单选列表"}
];

var do_ListData=mm("do_ListData");
do_ListData.addData(jsonData);
ui("do_ListView_index").bindItems(do_ListData);

ui("do_ListView_index").on("touch", function(_index){
	var data=jsonData[_index];
	var _rq=require("source://samples/modules/" + data.id + "/test");
	_rq.demo();
});
