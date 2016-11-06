设置ui的风格（包括：属性和事件），style.js是封装相关脚本逻辑的文件（考虑到未来的升级，不建议用户直接修改），styleSetting.js是全局配置文件，用户可以在此定义项目中常用的配置项；

#功能分类
style.js中只对外提供一个方法，即：
css = function(ui, options)
第一个参数：ui 要设置的ui控件对象
第二个参数：options 是传入的选项内容，要求为json格式的数据，或者也可以是全局选项的名称；

我们提供这个方法的主要目的是想要让小伙伴们可以简单的实现ui风格的批量设置和重用能力，options中的参数需要传入ui组件能够支持。

#使用方法

###0. 首先，在调用css函数之前，不要忘了引入dojs.js库：

```JavaScript
//main.ui.js中的代码：
var dojs=require("dojs");
```

###1. 先来看看一个最简单的例子，我们来设定一个button的背景颜色为蓝色和字体颜色为红色：

```JavaScript
//main.ui.js中的代码：
var do_Button_1=ui("do_Button_1"); 
dojs.style.css(do_Button_1, {
	bgColor:"0000FFFF",
	fontColor:"FF0000FF"
});
```

###2. 我们在同一个app项目中，options中的参数是可以设置全局默认值的，也就是说如果我们在调用css函数时，没传入的参数都会自动采用全局默认值。
options的默认值设置在styleSetting.js文件中名为dOption的选项中设置。例如：

```JavaScript
//styleSetting.js中的代码：
module.exports.options ={
   dOption:{
	border:"00000000,1,10"
   }
};

//main.ui.js中的代码：
var do_Button_1=ui("do_Button_1"); 
dojs.style.css(do_Button_1, {
	bgColor:"0000FFFF",
	fontColor:"FF0000FF"
});
```

上面示例中，因为我们在styleSetting.js中设置的全局border属性，所以在main.ui.js中执行style.css的最终效果除了设置了背景色和字体色之外，还设置了值为10的圆角。

###3. 除了dOption默认配置外，你还可以在styleSetting.js中配置其它全局配置，然后在传入options的parent选项指定父配置项（相当于从父配置项中继承）。例如：

```JavaScript
//styleSetting.js中的代码：
module.exports.options ={
   dOption:{
	border:"00000000,1,10"
   },
   myOption:{
	fontSize:28
   }
};

//main.ui.js中的代码：
var do_Button_1=ui("do_Button_1"); 
dojs.style.css(do_Button_1,  {
	parent:"myOption",
	bgColor:"0000FFFF",
	fontColor:"FF0000FF"
});
```

注意：parent参数是可以逐级向上递归查找的，当最终选项的parent参数无效时（定义为null或者没定义），它也是要从dOption默认配置项中继承的。
所以上面示例中，执行style.css后，最终会设置背景色、字体色、字体大小和边框圆角。


###4. 其实style.css最重要的用途是把一些比较优秀比较常用的风格(包括属性和事件的定义)封装起来，以方便不同页面中随时使用，例如：

```JavaScript
//styleSetting.js中的代码：
module.exports.options ={
    dOption:{
		
    },
    //定义动感效果的按钮
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
    }
};

//main.ui.js中的代码：
var do_Button_1=ui("do_Button_1"); 
dojs.style.css(do_Button_1,  {
	parent:"dynamicButton",
	bgColor:"0000FFFF",
	fontColor:"FF0000FF"
});
```

在上面示例中，dynamicButton的全局选项定义了一套具备动感效果的按钮风格，你只需通过style.css简单调用，就可以轻松让指定的按钮对象具备这样的动感风格。
你要亲自体验一下上面这个示例，才能体会到style.css的妙用。


###5. 最后再举个动态修改全局ui风格例子，我们可以为所有页面的header区域设置一个全局的背景色配置，这个背景色值是可以在app中动态修改的，修改后所有页面header区域的背景风格将会立即改变。例如：

```JavaScript
//styleSetting.js中的代码：
module.exports.options ={
    dOption:{
		
    },
    //header 区域的风格
    headerArea:{
    	bgColor:"@headerViewBgColor"
    }
};

//app.js中的代码：
var d1=require("deviceone");
var do_Global = d1.sm("do_Global");
do_Global.setMemory("headerViewBgColor", "16AF9FFF");

//page1.ui.js中的代码：
var do_ALayout_header=ui("do_ALayout_header"); 
dojs.style.css(do_ALayout_header, "headerArea");

//setting.ui.js中的代码：
var d1=require("deviceone");
var do_ALayout_header=ui("do_ALayout_header"); 
dojs.style.css(do_ALayout_header, "headerArea");
var do_Button_1=ui("do_Button_1"); 
do_Button_1.on("touch", function(){
	var do_Global = d1.sm("do_Global");
	do_Global.setMemory("headerViewBgColor", "FF0000FF");
	dojs.style.css(do_ALayout_header, "headerArea");
});
```

从上面的代码中，大家可能已经注意到headerArea全局选项中配置的bgColor值，是以 @ 符号开头的，其含义是从全局内存中读取名为headerViewBgColor的变量值。
你在setting.ui.js中通过按下do_Button_1的事件，修改了全局内存中的headerViewBgColor变量值，其效果是所有新打开的页面头部背景色都将被改变。
这种方式可以帮助你轻松实现动态改变整个应用风格的能力。
