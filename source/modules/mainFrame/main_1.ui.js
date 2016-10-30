var dojs=require("dojs");
dojs.style.css(ui("$"), "dynamicButton");

ui("$").setMapping({
	"do_ImageView_button.tag":"selected",
	"do_Label_button.tag":"data"
});

ui("$").on("dataRefreshed", function(){
	var data=JSON.parse(ui("do_Label_button").tag);
	ui("$").width = data.width;
	ui("do_Label_button").width = data.width;
	ui("do_ImageView_button").x = data.x;
	ui("$").redraw();
	ui("do_Label_button").text=data.name;
	if (ui("do_ImageView_button").tag =="1"){
		ui("do_ImageView_button").source=data.image_on;
		ui("do_Label_button").fontColor=data.fontColor_on;
	}
	else{
		ui("do_ImageView_button").source=data.image_off;
		ui("do_Label_button").fontColor=data.fontColor_off;
	}
});
