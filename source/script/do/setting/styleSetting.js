var core=require("do/core");
var d1=require("deviceone");
module.exports.options ={
    dOption:{
    	//上级选项名称（可继承选项内容）
   		parent:null
    },
    //定义动感按钮的风格
    dynamicButton:{
	    touch:function(){
	    	//do nothing
	    },
    	touchDown: function(){
    		var _anim_button_down_style = d1.mm("do_Animation");
    		_anim_button_down_style.alpha({
    		  delay: 0,
    		  duration: 300,
    		  curve: "Linear",
    		  repeatCount: "",
    		  autoReverse: true,
    		  alphaFrom: 1,
    		  alphaTo: 0.5
    		}); 
    		_anim_button_down_style.scale({
    		  delay: 0,
    		  duration: 300,
    		  curve: "Linear",
    		  repeatCount: "",
    		  autoReverse: true,
    		  scaleFromX: 1,
    		  scaleFromY: 1,
    		  scaleToX: 0.9,
    		  scaleToY: 0.9,
    		  pivotX: 0.5,
    		  pivotY: 0.5
    		});
    		this.animate(_anim_button_down_style);
    	}
    },
	//定义导航栏的风格
    navigatorCell:{
	    touch:function(){
	    	//do nothing
	    },
    	touchDown: function(){
    		var _anim_button_down_style = d1.mm("do_Animation");
    		_anim_button_down_style.fillAfter=true;
    		_anim_button_down_style.alpha({
    		  delay: 0,
    		  duration: 300,
    		  curve: "Linear",
    		  repeatCount: "",
    		  autoReverse: true,
    		  alphaFrom: 1,
    		  alphaTo: 0.5
    		}); 
    		this.animate(_anim_button_down_style);
    	}
    },
	//定义页面的topbar风格 （参考值：）
    pageTopbar:{
	    bgColor: "3C3C3CFF"
    }
};