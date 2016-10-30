var d1 = require("deviceone");
var dojs=require("dojs");

dojs.page.allowExit();

sm("do_Page").on("loaded",function(){
	
	var data=sm("do_Page").getData();
	var buttonCount=data.length;
	ui("do_GridView_bottom").numColumns=buttonCount;
	var do_ListData=d1.mm("do_ListData");
	do_ListData.add(data);
	ui("do_GridView_bottom").bindItems(data);
	
});

/*
//绑定ViewShower的4个子页面
var viewShower_data = [ 
	{
		id : "home",
		imageUI:ui("do_ImageView_home"),
		labelUI:ui("do_Label_home"),
		buttonUI:ui("do_ALayout_home"),
		path : "source://view/home/main.ui"
	}, 
	{
		id : "match",
		imageUI:ui("do_ImageView_match"),
		labelUI:ui("do_Label_match"),
		buttonUI:ui("do_ALayout_match"),
		path : "source://view/match/main.ui"
	}, 
	{
		id : "train",
		imageUI:ui("do_ImageView_train"),
		labelUI:ui("do_Label_train"),
		buttonUI:ui("do_ALayout_train"),
		path : "source://view/train/main.ui"
	}, 
	{
		id : "my",
		imageUI:ui("do_ImageView_my"),
		labelUI:ui("do_Label_my"),
		buttonUI:ui("do_ALayout_my"),
		path : "source://view/my/main.ui"
	}
];
ui("do_ViewShower_main").addViews(viewShower_data);

//定义按钮点击事件的处理方法
for(var i=0; i<viewShower_data.length; i++){
	dojs.style.css(viewShower_data[i].buttonUI, "dynamicButton");
	viewShower_data[i].buttonUI.on("touch", i, function(_data, _para){
		var _index = _para.data;
		ui("do_ViewShower_main").showView(viewShower_data[_index].id);
		for(var j=0; j<viewShower_data.length; j++){
			if (_index==j){
				viewShower_data[j].imageUI.source="source://image/" + 
					viewShower_data[j].id + "_on.png";
				viewShower_data[j].labelUI.fontColor="55C5B9FF";
				if (j == 0) sm("do_Page").fire("home_refresh");
				if (j == 1) sm("do_Page").fire("train_refresh");
			}
			else{
				viewShower_data[j].imageUI.source="source://image/" + 
					viewShower_data[j].id + "_off.png";
				viewShower_data[j].labelUI.fontColor="9E9E9EFF";
			}
		}
	});
}
ui("do_ALayout_home").fire("touch");

*/