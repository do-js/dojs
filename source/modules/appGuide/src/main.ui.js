var dojs = require("dojs");
require("ext/stringExt");

// initialize
(function() {
	sm("do_Page").on("appCuideClose", function(){
		dojs.core.closePage({moduleType:"$$appGuide$$"});
	})
	var currentOption = sm("do_Page").getData();
	if (dojs.core.isNullData(currentOption) || 
			dojs.core.isNullData(currentOption.content))return;
	var content = currentOption.content;
	if (content.length <=0) return;
	if (content.length > 5){
		dojs.core.error("最多支持5页")
		ui("do_ALayout_index1").visible=false;
		ui("do_ALayout_index2").visible=false;
		ui("do_ALayout_index3").visible=false;
		ui("do_ALayout_index4").visible=false;
		ui("do_ALayout_index5").visible=false;
		return;
	}
	if (!currentOption.indexImage.visible){
		ui("do_ALayout_index").visible=false;
	}
	else{
		if (content.length==1){
			content[0].indexUI=ui("do_ALayout_index3");
			ui("do_ALayout_index1").visible=false;
			ui("do_ALayout_index2").visible=false;
			ui("do_ALayout_index4").visible=false;
			ui("do_ALayout_index5").visible=false;
		}
		if (content.length==2){
			ui("do_ALayout_index").x = 50;
			ui("do_ALayout_index").redraw();
			content[0].indexUI=ui("do_ALayout_index3");
			content[1].indexUI=ui("do_ALayout_index4");
			ui("do_ALayout_index1").visible=false;
			ui("do_ALayout_index2").visible=false;
			ui("do_ALayout_index5").visible=false;
		}
		if (content.length==3){
			content[0].indexUI=ui("do_ALayout_index2");
			content[1].indexUI=ui("do_ALayout_index3");
			content[2].indexUI=ui("do_ALayout_index4");
			ui("do_ALayout_index1").visible=false;
			ui("do_ALayout_index5").visible=false;
		}
		if (content.length==4){
			ui("do_ALayout_index").x = 50;
			ui("do_ALayout_index").redraw();
			content[0].indexUI=ui("do_ALayout_index2");
			content[1].indexUI=ui("do_ALayout_index3");
			content[2].indexUI=ui("do_ALayout_index4");
			content[3].indexUI=ui("do_ALayout_index5");
			ui("do_ALayout_index1").visible=false;
		}
		if (content.length==5){
			content[0].indexUI=ui("do_ALayout_index1");
			content[1].indexUI=ui("do_ALayout_index2");
			content[2].indexUI=ui("do_ALayout_index3");
			content[3].indexUI=ui("do_ALayout_index4");
			content[4].indexUI=ui("do_ALayout_index5");
		}
		ui("do_SlideView_content").on("indexChanged", function(_index){
			for (var i = 0; i < content.length; i++) {
				if (i==_index){
					content[i].indexUI.bgColor=currentOption.indexImage.selectedColor;
				}
				else{
					content[i].indexUI.bgColor=currentOption.indexImage.unSelectedColor;
				}
			}
		});
		ui("do_ALayout_index").y=currentOption.indexImage.y;
		ui("do_ALayout_index").redraw();
		ui("do_SlideView_content").fire("indexChanged", 0);
	}
	for (var i = 0; i < content.length; i++) {
		content[i].text=currentOption.closeButton.text;
		content[i].y=currentOption.closeButton.y;
		content[i].x=(750 -currentOption.closeButton.width)/2;
		content[i].width=currentOption.closeButton.width;
		content[i].bgColor=currentOption.closeButton.bgColor;
		content[i].fontColor=currentOption.closeButton.fontColor;
		if (content[i].path.endWith(".ui")){
			content[i].template=1;
		}
		else{
			content[i].template=0;
		}
	}
	var listdata = mm("do_ListData");
	listdata.addData(content);
	ui("do_SlideView_content").bindItems(listdata);
	ui("do_SlideView_content").refreshItems();
})();

