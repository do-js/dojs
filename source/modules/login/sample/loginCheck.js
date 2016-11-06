var dojs = require("dojs");

module.exports.invoke = function(user, password) {
	if (dojs.core.isNullData(user)){
		dojs.core.toast("账户不允许空");
		return false;
	}
	if (dojs.core.isNullData(password)){
		dojs.core.toast("密码不允许空");
		return false;
	}
	//TODO:此处编写密码认证的	
		
	dojs.core.alert(user + ":" + password);
	//认证成功后返回true
	return true;
};
