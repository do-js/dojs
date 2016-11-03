var simpleIndex=require("source://modules/simpleIndex/call");
var dojs=require("dojs");

module.exports.demo = function(){
	var _indexDefine=[
	    	   {name:"我的照片", callback:function(){
	    		   dojs.core.alert("点击了'我的照片'");
	    	   }},
	    	   {name:"我的地址", callback:function(){
	    		   dojs.core.alert("点击了'我的地址'");
	    	   }},
	    	   {},
	    	   {name:"取消", callback:function(){
	    		   
	    	   }}
	    	];
	simpleIndex.call(_indexDefine, {title:"操作索引"});
};
