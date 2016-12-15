## core.js 封装一些最基础的工具函数

####对外提供了以下几个方法：

	require(o);//引用js类库文件，和标准的require函数的差异是如果不存在，则打印错误提示）
	toString(data, needFormat);//把对象转换成可读的字符串
	valueEqual(obj1,obj2);//判断两个对象的值是否相等
	p(data,tag);//封装deviceone.print,能自动转换各种类型对象为字符串打印出来
	alert(text,title,func);//封装sm("do_Notification").alert()
	toast(o);//弹出提示的临时信息,封装sm("do_Notification").toast()
	error(o);//显示错误提示 （弹出屏幕临时信息，同时打印调试信息） 
	openPage(_options);//封装do_App的openPage，可以读取缺省设置coreSetting.js里的值
	closePage(_options);//封装do_App的closePage，可以读取缺省设置coreSetting.js里的值
 	isJSON(obj);//判断值是否为JSON 对象 {}
 	isArray(obj);//判断值是否为JSON Array []
 	isNull(data);//判断值是否为空值，undefined，null
 	isNullData(data);// 判断值是否为空数据,undefined,null,'',"",[],{}
 	getOptions(options, file1,  file2);// 获取选项的配置 (用于js配置项的获取)
 	getUUID();//获取一个新的UUID的值,唯一标示
 	isPage();//判断当前是否处于Page页面的环境下 (非app.js的入口环境)
	callFunction(_func, data1, data2, data3)//调用函数(一般多用于option中的函数)
	tryParseJson(_data);//尝试转为json数据

#### 使用方法:
所有函数的更详细使用参考samples/script/dojs/core

```JavaScript
var dojs = require("dojs");

dojs.core.p("要打印的值");//打印值

```