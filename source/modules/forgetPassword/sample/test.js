var dojs = require("dojs");
var login=require("source://modules/register/call");

module.exports.demo = function() {
	login.invoke({
		// 标题
		title:"登录",
		// 短信重复发送的间隔时间 （秒）
		sendSmsInterval : 60,
		// 手机号的最大长度限制
		maxPhoneNumberLength : 32,
		// 短信验证码的最大长度限制
		maxSmsCodeLength : 6,
		// 手机号的最大长度限制
		maxPasswordLength : 16,
		// 回调的代码
		onCallback:"source://modules/register/sample/registerLogic"
		
	});
};
