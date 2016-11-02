var dojs=require("dojs");

dojs.style.css(ui("do_ALayout_topbar"), "pageTopbar");

var jsonData=[
              {id:"dojs", Name:"dojs"}
];

var do_ListData=mm("do_ListData");
do_ListData.addData(jsonData);
ui("do_ListView_index").bindItems(do_ListData);

ui("do_ListView_index").on("touch", function(_index){
	var data=jsonData[_index];
	var _rq=require("source://samples/script/" + data.id + "/test");
	_rq.demo();
});
