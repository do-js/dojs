var dojs = require("dojs");

dojs.style.css(ui("do_ALayout_topbar"), "pageTopbar");
dojs.style.css(ui("do_ALayout_back"), "dynamicButton");
dojs.style.css(ui("do_Button_ok"), "dynamicButton");
dojs.style.css(ui("do_ALayout_user_close"), "dynamicButton");
dojs.style.css(ui("do_ALayout_password_close"), "dynamicButton");
dojs.style.css(ui("do_ALayout_qq"), "dynamicButton");
dojs.style.css(ui("do_ALayout_weixin"), "dynamicButton");
dojs.style.css(ui("do_ALayout_sina"), "dynamicButton");
dojs.style.css(ui("do_ALayout_reg"), "dynamicButton");
dojs.style.css(ui("do_ALayout_fetchPwd"), "dynamicButton");

dojs.page.allowHideKeyboard();

var currentOption=null;

dojs.page.onTouch(ui("do_Button_ok"), function() {
	if (dojs.core.isNullData(currentOption.onCallback)) return;
	var _pwd=ui("do_TextField_password").text;
	if (currentOption.currentOption=="md5"){
		var md5=require("tools/crypt/md5");
		_pwd=md5.hex_md5(_pwd).toLowerCase();
	}
	if (currentOption.currentOption=="sha1"){
		var sha1=require("tools/crypt/sha1");
		_pwd=sha1.hex_sha1(_pwd).toLowerCase();
	}
	if (currentOption.currentOption=="sha256"){
		var sha256=require("tools/crypt/sha256");
		_pwd=sha256.hex_sha256(_pwd).toLowerCase();
	}
	sm("do_Page").hideKeyboard();
	var _jsFile=require(currentOption.onCallback);
	_jsFile.invoke({type:"login_normal",
		user:ui("do_TextField_user").text,
		password:_pwd});
});

dojs.page.onTouch(ui("do_ALayout_reg"), function() {
	if (dojs.core.isNullData(currentOption.onCallback)) return;
	sm("do_Page").hideKeyboard();
	var _jsFile=require(currentOption.onCallback);
	_jsFile.invoke({type:"register"});
});

dojs.page.onTouch(ui("do_ALayout_fetchPwd"), function() {
	if (dojs.core.isNullData(currentOption.onCallback)) return;
	sm("do_Page").hideKeyboard();
	var _jsFile=require(currentOption.onCallback);
	_jsFile.invoke({type:"fetchPassword"});
});

dojs.page.onTouch(ui("do_ALayout_sina"), function() {
	if (dojs.core.isNullData(currentOption.onCallback)) return;
	sm("do_Page").hideKeyboard();
	var _jsFile=require(currentOption.onCallback);
	_jsFile.invoke({type:"login_sina"});
});

dojs.page.onTouch(ui("do_ALayout_weixin"), function() {
	if (dojs.core.isNullData(currentOption.onCallback)) return;
	sm("do_Page").hideKeyboard();
	var _jsFile=require(currentOption.onCallback);
	_jsFile.invoke({type:"login_weixin"});
});

dojs.page.onTouch(ui("do_ALayout_qq"), function() {
	if (dojs.core.isNullData(currentOption.onCallback)) return;
	sm("do_Page").hideKeyboard();
	var _jsFile=require(currentOption.onCallback);
	_jsFile.invoke({type:"login_qq"});
});

ui("do_TextField_user").on("enter", function() {
	if (dojs.core.isNullData(ui("do_TextField_user").text)) return;
	ui("do_TextField_password").setFocus(true);
});

ui("do_TextField_password").on("enter", function() {
	if (dojs.core.isNullData(ui("do_TextField_password").text)) return;
	sm("do_Page").hideKeyboard();
	
});

function checkTextChange(){
	if (dojs.core.isNullData(ui("do_TextField_user").text)) {
		ui("do_ALayout_user_close").visible = false;
	} else {
		ui("do_ALayout_user_close").visible = true;
	}
	if (dojs.core.isNullData(ui("do_TextField_password").text)) {
		ui("do_ALayout_password_close").visible = false;
	} else {
		ui("do_ALayout_password_close").visible = true;
	}
	if (ui("do_ALayout_user_close").visible &&
			ui("do_ALayout_password_close").visible) {
		ui("do_Button_ok").fontColor="FFFFFFFF";
	} else {
		ui("do_Button_ok").fontColor="CCCCCCFF";
	}
}
ui("do_TextField_user").on("textChanged", function() {
	checkTextChange();
});

ui("do_TextField_password").on("textChanged", function() {
	checkTextChange();
});

ui("do_ALayout_user_close").on("touch", function() {
	ui("do_TextField_user").text = "";
	ui("do_TextField_user").setFocus(true);
});
ui("do_ALayout_password_close").on("touch", function() {
	ui("do_TextField_password").text = "";
	ui("do_TextField_password").setFocus(true);
});

var data = sm("do_Page").getData();
if (!dojs.core.isNullData(data)) {
	currentOption=data;
	if (!dojs.core.isNullData(data.title)) {
		ui("do_Label_title").text = data.title;
	}
	if (data.allowClose){
		ui("do_ALayout_back").visible=true;
		dojs.page.allowClose(ui("do_ALayout_back"));
	}
	else{
		ui("do_ALayout_back").visible=false;
		dojs.page.allowExit();
	}
	if (!data.allowRegister) {
		ui("do_ALayout_reg").visible = false;
	}
	if (!data.allowFetchPwd) {
		ui("do_ALayout_fetchPwd").visible = false;
	}
	if (!data.allowSinaLogin && !data.allowWeiXinLogin && !data.allowQQLogin) {
		ui("do_ALayout_thirdPart").visible = false;
	}
	else{
		if (!data.allowSinaLogin) {
			ui("do_ALayout_sina").visible = false;
		}
		if (!data.allowWeiXinLogin) {
			ui("do_ALayout_weixin").visible = false;
		}
		if (!data.allowQQLogin) {
			ui("do_ALayout_qq").visible = false;
		}
	}
	if (!dojs.core.isNull(data.user) && typeof(data.user)=="object"){
		if (!dojs.core.isNullData(data.user.hint)) {
			ui("do_TextField_user").hint = data.user.hint;
		}
		if (!dojs.core.isNullData(data.user.maxLength)) {
			ui("do_TextField_user").maxLength = data.user.maxLength;
		}
	}
	if (!dojs.core.isNull(data.password) && typeof(data.password)=="object"){
		if (!dojs.core.isNullData(data.password.hint)) {
			ui("do_TextField_password").hint = data.password.hint;
		}
		if (!dojs.core.isNullData(data.password.maxLength)) {
			ui("do_TextField_password").maxLength = data.password.maxLength;
		}		
	}
}
ui("do_TextField_user").fire("textChanged");
ui("do_TextField_password").fire("textChanged");

sm("do_Page").on("loaded", function(){
	ui("do_TextField_user").setFocus(true);
});
