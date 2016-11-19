var dojs = require("dojs");

module.exports.invoke = function(data) {
	if (data.type=="login_normal"){
		//用户名+密码登录
		if (dojs.core.isNullData(data.user)){
			dojs.core.toast("账户不允许空");
			return;
		}
		if (dojs.core.isNullData(data.password)){
			dojs.core.toast("密码不允许空");
			return;
		}
		//TODO:TODO:此处编写认证逻辑
		
		dojs.core.closePage();
		
		return;
	}
	
	if (data.type=="register"){
		//用户注册
		
		return;
	}
	
	if (data.type=="login_sina"){
		//第三方登录 - 新浪微博
		
		return;
	}
	
	if (data.type=="login_weixin"){
		//第三方登录 - 微信
		
		return;
	}
	
	if (data.type=="login_qq"){
		//第三方登录 - QQ
		
		return;
	}
	
	if (data.type=="fetchPassword"){
		//忘记密码
		
	}
	
};
