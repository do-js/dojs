var dojs=require("dojs");

dojs.style.css(ui("do_ALayout_topbar"), "pageTopbar");

var jsonData=[
              {id:"inputTextField", Name:"文本输入"},
              {id:"scanBarcode", Name:"二维码扫描"},
              {id:"popupMenu", Name:"弹出式菜单"},
              {id:"singleChoiceList", Name:"单选列表"},
              {id:"mainFrame", Name:"主页面"},
              {id:"waittingLayer", Name:"遮盖层"}
];

var do_ListData=mm("do_ListData");
do_ListData.addData(jsonData);
ui("do_ListView_index").bindItems(do_ListData);

ui("do_ListView_index").on("touch", function(_index){
	var data=jsonData[_index];
	var _rq=require("source://modules/" + data.id + "/sample/test");
	_rq.demo();
});
