var dojs=require("dojs");

module.exports.demo = function(){
	dojs.modules.waittingLayer({close:false, hint:"请稍后，5秒后自动关闭"});
	dojs.page.setTimeout(function(){
		dojs.modules.waittingLayer({close:true});
	}, 5000);
};
