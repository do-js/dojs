module.exports.demo = function() {
	var register=require("source://modules/register/call");
	register.invoke({
		// 标题
		title:"会员注册",
		// 短信重复发送的间隔时间 （秒）
		sendSmsInterval : 60,
		// 手机号
		phoneNumber:{
			// 提示内容
			hint : "手机号",
			// 最大长度限制
			maxLength : 32
		},
		// 短信验证码
		smsCode:{
			// 提示内容
			hint : "输入短信验证码",
			// 最大长度限制
			maxLength : 6
		},
		// 新用户的密码
		password:{
			// 提示内容
			hint : "设置6-18位字母数字组合的新用户密码",
			// 最大长度限制
			maxLength : 18
		},
		// 回调的代码
		onCallback:"source://modules/register/sample/registerLogic"
		
	});
};
