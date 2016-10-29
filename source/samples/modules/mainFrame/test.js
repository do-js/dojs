var core=require("do/core");
var dojs=require("dojs");

module.exports.demo = function(){
	var menus=[
	    	   {name:"拍照", callback:function(){
	    		   core.alert("点击了拍照");
	    	   }},
	    	   {name:"相册", callback:function(){
	    		   core.alert("点击了相册");
	    	   }},
	    	   {},
	    	   {name:"取消", callback:function(){
	    		   
	    	   }}
	    	];
	dojs.modules.mainFrame(menus);
};
