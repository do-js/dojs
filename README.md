# dojs
deviceone提供了非常强大和基础底层的组件，可以很灵活的开发App。但是对于很多普通开发者还缺乏能快速搭建App的标准化框架。

这个项目就是官方为了解决这个问题提供的一个框架，封装一些项目中常用的方法和UI，进一步的把业务和功能分离，帮助deviceone开发者提高开发效率和代码质量。

> 这些库并不是强制性必须使用的，用户完全可以自己封装自己的框架

这部分代码内容后续会不断更新，欢迎小伙伴们能随时帮助我们修改和完善这些代码，或者贡献更多你们手中积累的高品质代码出来给大家一起分享（我们会不断选取更多优秀的代码进来，和让小伙伴们一起分享）。

## 概述
![](http://doc.deviceone.net/web/img/20161215/04726244a4a848e7b8a08dac13362695.png)

这个项目本身就是一个可以运行的App，用户可以很直观的看到这个框架运行的效果。里面的JS库包含三个部分：

#### 1. js基础库：这个库和ui无关，封装了一些常用的基础函数，包含一些工具函数，http的ajax形式的函数，样式框架，全局设置等。
  
#### 2. modules库：这个库基本上都是和ui相关的一些功能性模块。把ui和逻辑都封装起来，使用者无需了解里面的细节。

#### 3. userControl库：这个库也是和ui相关的模块，和modules的差别在于，它的使用是通过ALayout和Linearlayout的add方法使用；而modules是弹出一个page或者add一个全屏的遮盖层。

这些库的使用方法基本上就是用到那个拷贝那个到自己的项目目录下，但是注意目录结构不要随意修改。
同时，这个App也提供动态加载组件API的学习Sample。

## 目录结构

#### 1. js基础库

```
 [source/script]
        ├── [do]
        │     ├── core.js 
        │     ├── page.js
        │     ├── http.js
        │     ├── global 
        │     ├── style.js
        │     └── [defaultSetting]
        ├── [mySetting]
        ├── [ext]
        ├── [tools]
        └── do.js
```

    [do]            :最基础的js库，必须拷贝到你自己的项目里,里面包含5个最基础的js文件。
    [defaultSetting]:里面包含多个配置文件，用于设置一些缺省值    
    [mySetting]     :和do下面的defaultSetting想对应，以这个目录下的设置为优先，如果这个目录下没有对应的选项，则使用defaultSetting。      
    do.js           :基础js库的调用封装，必须拷贝到你自己的项目里
    [ext]           :对现有js对象：date，string ,array的功能扩展，建议拷贝到你自己的项目
    [tools]         :一些工具js库，不建议全部拷贝，用到那个拷贝那个
              

#### 2. modules库

```
[source/modules]
      ├── [img]    :所有目录都共享的一些图标，这个建议必须拷贝到你自己的项目
      ├── [...]    :每个module都是一个子目录，不建议全部拷贝，用到那个拷贝那个
```

#### 3. userControl库

```
[source/userControls]
      ├── [...]             :每个userControl都是一个子目录，不建议全部拷贝，用到那个拷贝那个
      ├── userControls.js   :所有userControl调用的入口，建议拷贝
```

## 使用方法示范

#### 1. js库使用详细参考[global](https://github.com/do-js/dojs/tree/master/source/samples/script/dojs/global),[core](https://github.com/do-js/dojs/tree/master/source/samples/script/dojs/core),[http](https://github.com/do-js/dojs/tree/master/source/samples/script/dojs/http),[page](https://github.com/do-js/dojs/tree/master/source/samples/script/dojs/page),[style](https://github.com/do-js/dojs/tree/master/source/samples/script/dojs/style)
基本使用类似如下：

```JavaScript
var dojs = require("do.js");
dojs.core.p(obj); //打印任何对象，取代deviceone.print方法
...
```

#### 2. module库使用详细参考[modules](https://github.com/do-js/dojs/tree/master/source/samples/modules)
基本使用类似如下：

```JavaScript
var inputTextField = require("source://modules/inputTextField/call");
//弹出一个新的page允许用户输入数据
inputTextField.invoke({
    // 标题
    title : "请输入内容",
    // 提示内容
    hint : "请输入内容",
    // 初始值
    text : "001",
    // 最大长度:默认值是16
    maxLength : 10,
    // 软键盘的类型，支持：ENG, PHONENUMBER, DECIMAL, ASC, URL; 默认是ASC
    inputType : "ASC"
}, function(data) {
    // 处理返回结果
    dojs.core.alert(data.value);
});

```

#### . userControl库使用详细参考[userControls](https://github.com/do-js/dojs/tree/master/source/samples/userControls)
基本使用类似如下：

```JavaScript
var userControl = require("source://userControls/userControl");
//导航栏的例子
userControl.addView(_parent, "topBar", {
    // 背景图片或颜色，如下为图片，也可以是FF0000FF这种颜色值
    background : "source://userControls/topBar/sample/background.jpg",
    // 包括系统状态栏，则高度为128，否则为88
    noSystemStatusBar : false,
    // 左边按钮是一个do_ImageView,可以设置这个组件的任何属性
    leftButton : {
      source : "source://userControls/topBar/sample/return.png",
    },
    // 右边按钮是一个do_ImageView,可以设置这个组件的任何属性
    rightButton : {
      source : "source://userControls/topBar/sample/add.png",
    },
    // 是否允许左边按钮点击的时候关闭当前page，缺省是false
    leftButtonAllowClose : true,
    // 中间的title是一个label，可以设置它的任意有效属性
    titleLabel : {
      text : "我是TopBar1"
    },
    // 点击左边按钮触发的回调
    onLeftButtonTouch : function() {
      dojs.core.toast("点击左边按钮");
    },
    // 点击右边边按钮触发的回调
    onRightButtonTouch : function() {
      dojs.core.toast("点击右边按钮");
    }
  });

```


