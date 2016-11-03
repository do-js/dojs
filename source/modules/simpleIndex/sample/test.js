var simpleIndex=require("source://modules/simpleIndex/call");
var dojs=require("dojs");

module.exports.demo = function(){
	var menus=[
	    	   {name:"拍照", callback:function(){
	    		   dojs.core.alert("点击了拍照");
	    	   }},
	    	   {name:"相册", callback:function(){
	    		   dojs.core.alert("点击了相册");
	    	   }},
	    	   {},
	    	   {name:"取消", callback:function(){
	    		   
	    	   }}
	    	];
	simpleIndex.call(menus);
};
