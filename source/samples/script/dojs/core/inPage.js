var dojs = require("dojs");

module.exports.call = function() {
	dojs.core.alert(dojs.core.inPage(), "只有在do.js中调用才会为false");
};
