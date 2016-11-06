var dojs = require("dojs");

module.exports.invoke = function(user, password) {
	if (dojs.core.isNullData(user)){
		dojs.core.toast("账户不允许空");
		return;
	}
	if (dojs.core.isNullData(password)){
		dojs.core.toast("密码不允许空");
		return;
	}
	//TODO:TODO:此处编写认证逻辑
		
	dojs.core.alert(user + ":" + password);
	dojs.core.closePage();
};
