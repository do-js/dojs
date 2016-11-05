var dojs = require("dojs");

module.exports.call = function() {
	var data={name:"张晓丹", age:32}
	dojs.core.p(data);
	dojs.core.toast("已在logger中打印");
};
