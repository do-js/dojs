var d1 = require("deviceone");
var dojs = require("dojs");

module.exports.invoke = function(data) {
	if (data.type=="register"){
		//用户注册的操作
		if (dojs.core.isNullData(data.phone)){
			dojs.core.toast("手机号不允许空");
			return;
		}
		if (dojs.core.isNullData(data.code)){
			dojs.core.toast("验证码不允许空");
			return;
		}
		if (dojs.core.isNullData(data.password)){
			dojs.core.toast("新用户的密码不允许空");
			return;
		}
		//TODO:提交服务端，完成注册功能
		
		dojs.core.closePage();
		return;
	}
	
	if (data.type=="sendSms"){
		//发送短信的操作
		if (dojs.core.isNullData(data.phone)){
			dojs.core.toast("手机号不允许空");
			return;
		}		
		//TODO：由服务端调用短信网关，发送验证码短信
		
		dojs.core.toast("验证码已经通过短信发送，请尽快查收");
		//通知UI，短信已经来时发送
		d1.sm("do_Page").fire("smsStartSending");
		
		return;
	}
};
