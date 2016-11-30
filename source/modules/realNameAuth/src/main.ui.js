var dojs = require("dojs");

dojs.style.css(ui("do_ALayout_topbar"), "pageTopbar");
dojs.style.css(ui("do_ALayout_back"), "dynamicButton");
dojs.style.css(ui("do_Button_ok"), "dynamicButton");
dojs.style.css(ui("do_ALayout_name_close"), "dynamicButton");
dojs.style.css(ui("do_ALayout_id_close"), "dynamicButton");
dojs.style.css(ui("do_ImageView_realName1"), "dynamicButton");
dojs.style.css(ui("do_ImageView_realName2"), "dynamicButton");
dojs.style.css(ui("do_ImageView_realName3"), "dynamicButton");

dojs.page.allowClose(ui("do_ALayout_back"));
dojs.page.allowHideKeyboard();

var currentOption=null;
var realName1=null;
var realName2=null;
var realName3=null;
dojs.page.onTouch(ui("do_Button_ok"), function() {
	if (dojs.core.isNullData(currentOption.onCallback)) return;
	sm("do_Page").hideKeyboard();
	var _jsFile=require(currentOption.onCallback);
	_jsFile.invoke({
		id:ui("do_TextField_id").text,
		name:ui("do_TextField_name").text,
		realName1:realName1,
		realName2:realName2,
		realName3:realName3
	});
});


ui("do_TextField_name").on("enter", function() {
	if (dojs.core.isNullData(ui("do_TextField_name").text)) return;
	ui("do_TextField_id").setFocus(true);
});

ui("do_TextField_id").on("enter", function() {
	if (dojs.core.isNullData(ui("do_TextField_id").text)) return;
	
});

function checkTextChange(){	
	if (!dojs.core.isNullData(ui("do_TextField_name").text) &&
			!dojs.core.isNullData(ui("do_TextField_id").text) &&
			!dojs.core.isNullData(realName1),
			!dojs.core.isNullData(realName2),
			!dojs.core.isNullData(realName3)){
		ui("do_Button_ok").bgColor="33BB33FF";
		ui("do_Button_ok").enabled=true;
	} else {
		ui("do_Button_ok").bgColor="CCCCCCFF";
		ui("do_Button_ok").enabled=false;
	}
}
ui("do_TextField_name").on("textChanged", function() {
	if (dojs.core.isNullData(ui("do_TextField_name").text)) {
		ui("do_ALayout_name_close").visible = false;
	} else {
		ui("do_ALayout_name_close").visible = true;
	}
	checkTextChange();
});

ui("do_TextField_id").on("textChanged", function() {
	if (dojs.core.isNullData(ui("do_TextField_id").text)) {
		ui("do_ALayout_id_close").visible = false;
	} else {
		ui("do_ALayout_id_close").visible = true;
	}	
	checkTextChange();
});

ui("do_ALayout_name_close").on("touch", function() {
	ui("do_TextField_name").text = "";
	ui("do_TextField_name").setFocus(true);
});
ui("do_ALayout_id_close").on("touch", function() {
	ui("do_TextField_id").text = "";
	ui("do_TextField_id").setFocus(true);
});

var data = sm("do_Page").getData();
if (!dojs.core.isNullData(data)) {
	currentOption=data;
	if (!dojs.core.isNullData(data.title)) {
		ui("do_Label_title").text = data.title;
	}
	if (!dojs.core.isNull(data.name) && typeof(data.name)=="object"){
		if (!dojs.core.isNullData(data.name.hint)) {
			ui("do_TextField_name").hint = data.name.hint;
		}
		if (!dojs.core.isNullData(data.name.maxLength)) {
			ui("do_TextField_name").maxLength = data.name.maxLength;
		}
	}
	if (!dojs.core.isNull(data.id) && typeof(data.id)=="object"){
		if (!dojs.core.isNullData(data.id.hint)) {
			ui("do_TextField_id").hint = data.id.hint;
		}
		if (!dojs.core.isNullData(data.id.maxLength)) {
			ui("do_TextField_id").maxLength = data.id.maxLength;
		}
	}
	if (!dojs.core.isNullData(data.prompt)) {
		ui("do_Label_prompt").text = data.prompt;
	}
}

ui("do_TextField_name").fire("textChanged");
ui("do_TextField_id").fire("textChanged");
checkTextChange();

sm("do_Page").on("loaded", function(){
	ui("do_TextField_name").setFocus(true);
});

var popupMenu=require("source://modules/popupMenu/call");
dojs.page.onTouch(ui("do_ImageView_realName1"), function(){
	var menus=[
	    	   {name:"拍照", callback:function(){
	    		   sm("do_Camera").capture({
	    		        width: 200,
	    		        height:200,
	    		        quality: 100
	    		    }, function(data){
	    		    	realName1=data;
    					ui("do_ImageView_realName1").source=realName1;   
    					checkTextChange();
	    		    });
	    	   }},
	    	   {name:"相册", callback:function(){
	    		   sm("do_Album").select({
	    				maxCount:1,
	    				width:800, 
	    				height:800, 
	    				quality:100}, 
	    				function(data, e) {
	    					if (data!=null &&data.length==0) return;
	    					realName1=data[0];
	    					ui("do_ImageView_realName1").source=realName1;
	    					checkTextChange();
	    				});
	    	   }},
	    	   {},
	    	   {name:"取消", callback:function(){
	    		   
	    	   }}
	    	];
	popupMenu.invoke(menus);
});

dojs.page.onTouch(ui("do_ImageView_realName2"), function(){
	var menus=[
	    	   {name:"拍照", callback:function(){
	    		   sm("do_Camera").capture({
	    		        width: 200,
	    		        height:200,
	    		        quality: 100
	    		    }, function(data){
	    		    	realName2=data;
    					ui("do_ImageView_realName2").source=realName2;  
    					checkTextChange();
	    		    });
	    	   }},
	    	   {name:"相册", callback:function(){
	    		   sm("do_Album").select({
	    				maxCount:1,
	    				width:800, 
	    				height:800, 
	    				quality:100}, 
	    				function(data, e) {
	    					if (data!=null &&data.length==0) return;
	    					realName2=data[0];
	    					ui("do_ImageView_realName2").source=realName2;
	    					checkTextChange();
	    				});
	    	   }},
	    	   {},
	    	   {name:"取消", callback:function(){
	    		   
	    	   }}
	    	];
	popupMenu.invoke(menus);
});

dojs.page.onTouch(ui("do_ImageView_realName3"), function(){
	var menus=[
	    	   {name:"拍照", callback:function(){
	    		   sm("do_Camera").capture({
	    		        width: 200,
	    		        height:200,
	    		        quality: 100
	    		    }, function(data){
	    		    	realName3=data;
    					ui("do_ImageView_realName3").source=realName3; 
    					checkTextChange();
	    		    });
	    	   }},
	    	   {name:"相册", callback:function(){
	    		   sm("do_Album").select({
	    				maxCount:1,
	    				width:800, 
	    				height:800, 
	    				quality:100}, 
	    				function(data, e) {
	    					if (data!=null &&data.length==0) return;
	    					realName3=data[0];
	    					ui("do_ImageView_realName3").source=realName3;
	    					checkTextChange();
	    				});
	    	   }},
	    	   {},
	    	   {name:"取消", callback:function(){
	    		   
	    	   }}
	    	];
	popupMenu.invoke(menus);
});