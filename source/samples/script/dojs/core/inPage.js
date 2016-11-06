var dojs = require("dojs");

module.exports.invoke = function() {
	dojs.core.alert(dojs.core.inPage(), "只有在app.js中调用才会为false");
};
