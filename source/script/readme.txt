这部分代码是deviceone官方提供的javascript常用库函数，主要目的是封住一些项目中常用的方法，帮助deviceone开发者进一步提高开发效率和代码质量；
这部分代码内容后续会不断更新，欢迎小伙伴们能随时帮助我们修改和完善这些代码，或者贡献更多你们手中积累的高品质代码出来给大家一起分享（我们会不断选取更多优秀的代码进来，和让小伙伴们一起分享）。
官方维护源代码的地址为：https://github.com/do-js/do

deviceone常用javascript代码的使用方法：
1：将整个do目录全部拷贝到您项目下的source://script目录下。（在运行期间，所有*.txt文件是可以删除的）
2：在具体的*.ui.js 文件中引入相关的js文件，例如引入core.js文件的代码如下：var core=require("do/core");
3：然后即可直接调用引入文件下所有对外提供的函数。详细的内容可以参见每个js文件相关的txt说明文件（[相同的文件名].txt）；

下面代码将引用所有的javascript库：
var core=require("do/core");
var http=require("do/http");
var global=require("do/global");
var page=require("do/page");
var style=require("do/style");

注：在使用这些javascript函数库之前，请大家把组件都升级到最新版本，重新打包调试版app