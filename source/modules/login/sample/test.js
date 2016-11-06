var dojs = require("dojs");
var login=require("source://modules/login/call");

module.exports.demo = function() {
	login.call({
		// 标题
		title:"用户登录",
		// logo图片 (128*128)
		logo:"source://modules/login/sample/logo.png",
		// 是否允许关闭页面
		allowClose : true,
		user:{
			//提示内容
			hint : "请输入账户名或手机号",
			//最大长度的限制
			maxLength:32
		},
		password:{
			//加密算法:md5, sha1, sha256, none; 默认为：none 
			encryption: "md5",
			//提示内容
			hint : "请输入密码",
			//最大长度的限制
			maxLength:32
		},
		onConfirm:"source://modules/login/sample/loginCheck"
		
	});
};
