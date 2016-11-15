var dojs = require("dojs");
var login=require("source://modules/login/call");

module.exports.demo = function() {
	login.invoke({
		// 标题
		title:"登录",
		// 是否允许关闭页面
		allowClose : true,
		// 是否允许"注册"
		allowRegister : true,
		// 是否允许"忘记密码"
		allowFetchPwd : true,
		// 是否允许第三方登录-新浪微博
		allowSinaLogin : true,
		// 是否允许第三方登录-微信
		allowWeiXinLogin : true,
		// 是否允许第三方登录-QQ
		allowQQLogin : true,
		// 用户配置项
		user:{
			//提示内容
			hint : "请输入账户名或手机号",
			//最大长度的限制
			maxLength:32
		},
		// 密码配置项
		password:{
			//加密算法:md5, sha1, sha256, none; 默认为：none 
			encryption: "md5",
			//提示内容
			hint : "请输入密码",
			//最大长度的限制
			maxLength:32
		},
		// 回调的代码
		onCallback:"source://modules/login/sample/loginCheck"
		
	});
};
