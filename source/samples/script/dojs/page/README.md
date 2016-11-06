封装页面中常用的函数，这些函数在UI代码中使用的频率比较高，调用起来非常方便；

#方法分类：

###1. 允许当前页面关闭，支持android的返回键关闭，IOS的滑动手势关闭
allowClose = function(_buttons)

###2. 允许当前页面退出应用，支持android的返回键退出
allowExit = function(_buttons)

###3. 允许当前隐藏键盘 （点击最底层的空白处时，收起键盘）
allowHideKeyboard = function(_buttons)

###4. 指定的毫秒数后的回调
setTimeout = function(code, millisec)

###5. 取消由 setTimeout() 方法设置的 timeout
clearTimeout = function(id_of_settimeout)

###6. 按照指定的周期（以毫秒计）进行回调
setInterval = function(code, millisec)

###7. 取消由 setInterval() 设置的 timeout
clearTimeout = function(id_of_setinterval)

#使用方法

###0.首先，在调用这些函数之前，不要忘了引入dojs.js库：

```JavaScript
//main.ui.js中的代码：
var dojs=require("dojs");
```

###1. allowClose函数：
很多情况下你需要支持返回按键（适用于安卓和windowsPhone的手机）关闭页面的能力，或者通过滑动手势关闭页面的能力（适用于IOS手机）；
这个时候你只需在相关页面的代码中，执行一次allowClose函数即可；

```JavaScript
//page1.ui.js中的代码：
dojs.page.allowClose();
```

allowClose函数的_buttons参数，允许你定义一个或多个具有关闭页面功能的按键。例如：

```JavaScript
//page1.ui.js中的代码：指定一个关闭按键
var do_Button_1=ui("do_Button_1"); 
dojs.page.allowClose(do_Button_1);

//page2.ui.js中的代码：指定多个关闭按键
var do_Button_1=ui("do_Button_1"); 
var do_Button_2=ui("do_Button_2"); 
var do_Button_3=ui("do_Button_3"); 
dojs.page.allowClose([do_Button_1, do_Button_2, do_Button_3]);
//-----------------------------------------
```

###2. allowExit函数：
对于主UI页面，你一般需要支持以下的方式退出应用：
点击一次返回按键（适用于安卓和windowsPhone的手机），给出toast提示,支持3秒之内连续点击两次返回按钮则对出应用；
这个时候你只需在相关页面的代码中，执行一次allowExit函数即可。

```JavaScript
//page1.ui.js中的代码：
dojs.page.allowExit();
```
allowExit函数的_buttons参数，允许你定义一个或多个具有退出应用功能的按键。具体用法可以参见上面的allowClose方法。

###3. allowHideKeyboard函数：
当页面上有textBox或textField这样的输入控件时，当这类控件获取焦点时，系统会自动弹出软键盘。
软键盘经常会遮盖住一些重要的交互区域，如果你希望点击当前页面其它的空白处能自动隐藏软键盘，那么你只需要执行一次allowHideKeyboard函数即可。

```JavaScript
//page1.ui.js中的代码：
dojs.page.allowHideKeyboard();
```

allowHideKeyboard函数的_buttons参数，允许你定义一个或多个具备可隐藏软件盘功能的按键。具体用法可以参见上面的allowClose方法。



###4. setTimeout,clearTimeout,setInterval,clearTimeout这四个函数的定义和javascript DOM Window定义的函数使用方式一致，这里就不详细讲解了。具体用法可以参考：
http://www.w3school.com.cn/jsref/dom_obj_window.asp
