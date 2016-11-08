var dojs = require("dojs");

dojs.style.css(ui("do_ALayout_topbar"), "pageTopbar");
dojs.style.css(ui("do_ALayout_back"), "dynamicButton");
dojs.style.css(ui("do_Button_ok"), "dynamicButton");
dojs.style.css(ui("do_ALayout_phone_close"), "dynamicButton");
dojs.style.css(ui("do_ALayout_password_close"), "dynamicButton");
dojs.style.css(ui("do_ALayout_code_close"), "dynamicButton");
dojs.style.css(ui("do_ALayout_applyCode"), "dynamicButton");

dojs.page.allowClose(ui("do_ALayout_back"));
dojs.page.allowHideKeyboard();

var currentOption=null;

dojs.page.onTouch(ui("do_Button_ok"), function() {
	if (dojs.core.isNullData(currentOption.onCallback)) return;
	sm("do_Page").hideKeyboard();
	var _jsFile=require(currentOption.onCallback);
	_jsFile.invoke({type:"register",
		phone:ui("do_TextField_phone").text,
		code:ui("do_TextField_code").text,
		password:ui("do_TextField_password").text});
});

var do_Timer_code = mm("do_Timer");
do_Timer_code.delay = 0;
do_Timer_code.interval = 1000;
var finishedTime=0;
do_Timer_code.on("tick", function(){
    if(finishedTime > 0){
    	ui("do_Label_applyCode").text = "("+finishedTime + "秒)重发";
    	finishedTime--;
    	return;
    }
    do_Timer_code.stop();
    ui("do_Label_applyCode").text = "获取验证码";
    ui("do_ALayout_applyCode").enabled = true;
    ui("do_TextField_phone").enabled = true;
    ui("do_ALayout_phone_close").visible = true;
    ui("do_Label_applyCode").fontColor="33BB33FF";    
});

sm("do_Page").on("smsStartSending", function(){
	ui("do_ALayout_applyCode").enabled = false;
	ui("do_TextField_phone").enabled = false;
	ui("do_ALayout_phone_close").visible = false;
	ui("do_Label_applyCode").fontColor="CCCCCCFF";
	
	
	finishedTime=currentOption.sendSmsInterval;
	do_Timer_code.start();
	ui("do_TextField_code").setFocus(true);
});
//获取验证码
dojs.page.onTouch(ui("do_ALayout_applyCode"), function() {
	if (dojs.core.isNullData(currentOption.onCallback)) return;
	if (dojs.core.isNullData(ui("do_TextField_phone").text)){
		dojs.core.toast("手机号无效！");
		return;
	}
	var _jsFile=require(currentOption.onCallback);
	_jsFile.invoke({type:"sendSms",
		phone:ui("do_TextField_phone").text});
});

ui("do_TextField_phone").on("enter", function() {
	if (dojs.core.isNullData(ui("do_TextField_phone").text)) return;
	ui("do_TextField_code").setFocus(true);
});

ui("do_TextField_code").on("enter", function() {
	if (dojs.core.isNullData(ui("do_TextField_code").text)) return;
	ui("do_TextField_password").setFocus(true);
});

ui("do_TextField_password").on("enter", function() {
	if (dojs.core.isNullData(ui("do_TextField_password").text)) return;
	sm("do_Page").hideKeyboard();
	
});

function checkTextChange(){	
	if (!dojs.core.isNullData(ui("do_TextField_phone").text) &&
			!dojs.core.isNullData(ui("do_TextField_code").text) &&
			!dojs.core.isNullData(ui("do_TextField_password").text)){
		ui("do_Button_ok").bgColor="33BB33FF";
		ui("do_Button_ok").enabled=true;
	} else {
		ui("do_Button_ok").bgColor="CCCCCCFF";
		ui("do_Button_ok").enabled=false;
	}
}
ui("do_TextField_phone").on("textChanged", function() {
	if (dojs.core.isNullData(ui("do_TextField_phone").text)) {
		ui("do_ALayout_phone_close").visible = false;
		ui("do_ALayout_applyCode").enabled=false;
		ui("do_Label_applyCode").fontColor="CCCCCCFF";
	} else {
		ui("do_ALayout_phone_close").visible = true;
		ui("do_ALayout_applyCode").enabled=true;
		ui("do_Label_applyCode").fontColor="33BB33FF";
	}
	checkTextChange();
});

ui("do_TextField_code").on("textChanged", function() {
	if (dojs.core.isNullData(ui("do_TextField_code").text)) {
		ui("do_ALayout_code_close").visible = false;
	} else {
		ui("do_ALayout_code_close").visible = true;
	}	
	checkTextChange();
});

ui("do_TextField_password").on("textChanged", function() {
	if (dojs.core.isNullData(ui("do_TextField_password").text)) {
		ui("do_ALayout_password_close").visible = false;
	} else {
		ui("do_ALayout_password_close").visible = true;
	}
	checkTextChange();
});

ui("do_ALayout_phone_close").on("touch", function() {
	ui("do_TextField_phone").text = "";
	ui("do_TextField_phone").setFocus(true);
});
ui("do_ALayout_code_close").on("touch", function() {
	ui("do_TextField_code").text = "";
	ui("do_TextField_code").setFocus(true);
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
	if (!dojs.core.isNull(data.phoneNumber) && typeof(data.phoneNumber)=="object"){
		if (!dojs.core.isNullData(data.phoneNumber.hint)) {
			ui("do_TextField_phone").hint = data.phoneNumber.hint;
		}
		if (!dojs.core.isNullData(data.phoneNumber.maxLength)) {
			ui("do_TextField_phone").maxLength = data.phoneNumber.maxLength;
		}
	}
	if (!dojs.core.isNull(data.smsCode) && typeof(data.smsCode)=="object"){
		if (!dojs.core.isNullData(data.smsCode.hint)) {
			ui("do_TextField_code").hint = data.smsCode.hint;
		}
		if (!dojs.core.isNullData(data.smsCode.maxLength)) {
			ui("do_TextField_code").maxLength = data.smsCode.maxLength;
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

ui("do_TextField_phone").fire("textChanged");
ui("do_TextField_code").fire("textChanged");
ui("do_TextField_password").fire("textChanged");
checkTextChange();

sm("do_Page").on("loaded", function(){
	ui("do_TextField_phone").setFocus(true);
});
