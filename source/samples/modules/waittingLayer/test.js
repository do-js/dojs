var dojs=require("dojs");

module.exports.demo = function(){
	dojs.modules.waittingLayer({hint:"请稍后，3秒后自动关闭"});
	dojs.page.setTimeout(function(){
		dojs.modules.waittingLayer({close:true});
	}, 3000);
};
