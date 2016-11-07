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
		//TODO:提交后台完成注册功能
		
		dojs.core.closePage();
		return;
	}
	
	if (data.type=="sendSms"){
		//发送短信的操作
		if (dojs.core.isNullData(data.phone)){
			dojs.core.toast("手机号不允许空");
			return;
		}		
		//TODO：调用发送短信的程序
		
		//通知UI，短信已经来时发送
		d1.sm("do_Page").fire("smsStartSending");
				
		return;
	}
};
