var dojs=require("dojs");

dojs.style.css(ui("do_ALayout_topbar"), "pageTopbar");

var jsonData=[
              {id:"appGuide", Name:"应用引导页"},
              {id:"login", Name:"登录页"},
              {id:"register", Name:"注册页"},
              {id:"forgetPassword", Name:"重置密码"},
              {id:"realNameAuth", Name:"实名认证页"},
              {id:"mainFrame", Name:"主框架页"},
              {id:"simpleIndex", Name:"简单索引页"},
              {id:"popupMenu", Name:"弹出式菜单"},
              {id:"inputTextField", Name:"文本输入页"},
              {id:"scanBarcode", Name:"二维码扫描页"},
              {id:"singleChoiceList", Name:"单选列表"},
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
