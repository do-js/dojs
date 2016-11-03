# dojs
deviceone提供了非常强大和基础底层的组件，可以很灵活的开发App。但是对于很多普通开发者还缺乏能快速搭建App的标准化框架。

这个项目就是官方为了解决这个问题提供的一个框架，封装一些项目中常用的方法和UI，进一步的把业务和功能分离，帮助deviceone开发者进一步提高开发效率和代码质量。

这部分代码内容后续会不断更新，欢迎小伙伴们能随时帮助我们修改和完善这些代码，或者贡献更多你们手中积累的高品质代码出来给大家一起分享（我们会不断选取更多优秀的代码进来，和让小伙伴们一起分享）。

##概述
这个项目本身就是一个可以运行的App，用户可以很直观的看到这个框架运行的效果。里面的框架包含二个部分：

####1. js基础库：这个库和ui无关，封装了一些常用的基础函数，包含一些工具函数，http的ajax形式的函数，样式框架，全局设置等
  
####2. modules库：这个库基本上都是和ui相关的一些功能性模块。把ui和逻辑都封装起来，使用者无需了解里面的细节。

##目录结构

####1. js库

[source/script]

              - [do]     :最基础的js库，必须拷贝到你自己的项目里              
              - do.js    :基础js库的调用封装，必须拷贝到你自己的项目里
              - [ext]    :对现有js对象：date，string ,array的功能扩展，建议拷贝到你自己的项目
              - [tools]  :一些工具js库，不建议全部拷贝，用到那个拷贝那个
              

####2. modules库

[source/modules]

              - [...]    :每个module都是一个子目录，不建议全部拷贝，用到那个拷贝那个
              
##使用方法
1. 安装上面的建议拷贝对应的文件和目录到你自己的项目中，目录结构不能改变。
2. 在用到的地方require do.js,然后调用对应的函数，
js库使用方法类似如下：

```JavaScript
   var dojs = require("do.js");
   dojs.core.fun1();
   ...
```

module库使用类似如下：

```JavaScript
   dojs.modules.inputTextField(
		{
			title:"请输入内容", 
			hint:"请输入内容", 
			//maxLength:默认值是16
			maxLength:10, 
			//initValue:默认值是""
			initValue:"", 
			//inputType支持：ENG, PHONENUMBER, DECIMAL, ASC, URL; 默认是ENG
			inputType:"ENG"
		},
			function(data){
				//显示输入结果
				dojs.core.alert(data.value);
		}
	);
```