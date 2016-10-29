封装http相关服务，http.js是封装相关脚本逻辑的文件（考虑到未来的升级，不建议用户直接修改），httpSetting.js是全局配置文件，用户可以在此定义项目中常用的配置项；

http.js中只对外提供一个方法，即：
ajax = function( url, options)
第一个参数：url 是访问的url路径
第二个参数：options 是传入的选项内容，是json格式的数据，或者也可以是全局选项的名称；

我们提供这个方法的主要目的是想要让小伙伴们可以像使用jquery中的ajax函数那样方便，完成调用deviceone的do_Http组件的操作。（实际上这里封装的ajax比jquery中的ajax还要强大很多！请您耐心往下看）

首先说明http.ajax完全是线程安全的，大家尽管放心使用。

我们来看看options参数内容的完整定义：
{
	//上级选项名称（可继承选项内容）
	parent:null,
	//服务请求的根路径
	rootUrl:"",
	//服务请求的url（如果不是以http://或https://开始，则会自动加上httpRootUrl变量值的前缀）
	url:null,
	//请求的类型（GET,POST, PUT, DELETE）。
	type:"GET",
	//发送数据到服务器时所使用的内容类型。可以是："application/x-www-form-urlencoded", "application/json"
	contentType:"application/x-www-form-urlencoded; charset=UTF-8",
	//要发送到服务器的数据，发送前可以根据需要自动转换为请求字符串格式（例如：{a:"1", b:"2"}，对于GET请求可自动转换为&a=1&b=2）
	data:null,
	//返回内容的解码方式（utf-8或GBK）
	responseEncoding:"utf-8",
	//设置本地的请求超时时间（以毫秒计）
	timeout:30000,
	//发送请求前运行的函数:beforeSend(options, do_Http)
	beforeSend:null,
	//返回数据后的进行预处理的函数:dataFilter(data)
	dataFilter:null,
	//当请求成功时运行的函数success(data, status)
	success:null,
	//如果请求失败要运行的函数error(data, status)
	error:null,
	//请求完成时运行的函数（在请求成功或失败之后均调用，即在 success 和 error 函数之后）complete(data, status)
	complete:null,
	//是否缓存上次结果 （为true的时候，在返回服务结果之前会先返回上次结果，一般用于改善数据查询的交互体验）
	cacheLastResult:false,
	//是否使用测试数据
	useMockData:false,
	//测试数据
	mockData:null
}

这些参数都有什么用呢？
大家需要知道：url, type, contentType, data, timeout, beforeSend, dataFilter, success, error, complete这几个参数的含义，和jquery中的定义基本是完全一致的，详细含义的理解也可以参考：http://www.w3school.com.cn/jquery/ajax_ajax.asp
剩下的parent, rootUrl, responseEncoding, cacheLastResult, useMockData, mockData这几个参数是http.js所独有的，后续我们将通过详细实例逐个讲解其含义；

首先，在调用ajax函数之前，不要忘了引入http.js库：
//-----------------------------------------
//main.ui.js中的代码：
var http=require("do/http");
//-----------------------------------------

先来看看一个最简单的例子，我们来随便访问一个url服务并获取结果内容：
//-----------------------------------------
//main.ui.js中的代码：
var http=require("do/http");
http.ajax("http://www.baidu.com", {
	success:function(data){
		var do_Notification = sm("do_Notification");
		do_Notification.alert(data);
	}
});
//-----------------------------------------

上面例子中第一个参数url，也可以放在options中传入：
//-----------------------------------------
//main.ui.js中的代码：
var http=require("do/http");
http.ajax({
	url:"http://www.baidu.com",
	success:function(data){
		var do_Notification = sm("do_Notification");
		do_Notification.alert(data);
	}
});
//-----------------------------------------

我们在同一个app项目中，options中的参数是可以设置全局默认值的，也就是说如果我们在调用ajax函数时，没传入的参数都会自动采用全局默认值。
options的默认值设置在httpSetting.js文件中名为dOption的选项中设置。例如：
//-----------------------------------------
//httpSetting.js中的代码：
//默认选项
module.exports.options ={
   dOption:{
	//服务请求的根路径
    	rootUrl:"http://202.103.155.22:8080/webapi"
   }
};

//main.ui.js中的代码：
var http=require("do/http");
http.ajax({
	url:"login",
	success:function(data){
		var do_Notification = sm("do_Notification");
		do_Notification.alert(data);
	}
});
//-----------------------------------------
上面示例中，因为我们在httpSetting.js中设置的全局的url前缀，所以在main.ui.js中http最终的实际url请求地址是：http://202.103.155.22:8080/webapi/login
通过设置这样的全局url前缀，实际项目中我们在每个页面里就不必再传入完整的url地址了，只需要传入相对的服务名部分即可，我们在切换按app项目的开发服务环境、集成服务环境和生产服务环境时只需轻松修改httpSetting.js中的配置即可（不必每个页面都修改）。


除了dOption默认配置外，你还可以在httpSetting.js中配置其它全局配置，然后在传入options的parent选项指定父配置项（相当于从父配置项中继承）。例如：
//-----------------------------------------
//httpSetting.js中的代码：
//默认选项
module.exports.options ={
   dOption:{
	//服务请求的根路径
    	rootUrl:"http://202.103.155.22:8080/webapi",
	responseEncoding:"utf-8"

   },
   myOption:{
	//服务请求的根路径
    	rootUrl:"http://202.103.155.23/webapi"
   }
};

//main.ui.js中的代码：
var http=require("do/http");
http.ajax({
	parent:"myOption",
	url:"login",
	success:function(data){
		var do_Notification = sm("do_Notification");
		do_Notification.alert(data);
	}
});
//-----------------------------------------
上面的示例中，最终调用http.ajax时传入的实际url参数是：http://202.103.155.23/webapi/login ，因为在myOption配置项中定义了rootUrl:"http://202.103.155.23/webapi"。
注意：parent参数是可以逐级向上递归查找的，当最终选项的parent参数无效时（定义为null或者没定义），它也是要从dOption默认配置项中继承的。
所以上面示例中，最终会找到dOption默认设置，设定responseEncoding参数为："utf-8"；（表示返回内容要用utf-8方式解码）；
所有配置项都是派生类的内容优先，例如：myOption中已经设定了rootUrl，所以在dOption中设定的rootUrl值就被覆盖了。


我们再来理解一下cacheLastResult参数，这个参数表示：是否缓存上次请求的结果。
我们在使用新浪微博app的时候，你可能会注意到这样种体验效果。每次当你重新打开新浪微博app时，无论网络状况如何，列表视图中会很快就装载显示出内容项。实际上这些内容是你上次浏览微博的列表结果，因为在它本地缓存了所以才加载这么快的。
在新浪微博显示本地缓存数据的同时，也会通过后台线程里向服务器发起一个获取最新数据的请求，如果新请求的列表数据成功返回，则会立即以此来替换刷新列表视图中的数据（同时会播放一个清脆的音效）。
这种先显示本地的缓存数据的方式，很好的规避了空白页面等待期，能给用户一种极佳的体验。
cacheLastResult参数就是为了完成以上这种效果的，当你把cacheLastResult参数设置为true时，http.ajax的请求将会自动实现“缓存上次结果”的功能。

接下来我们来看看useMockData, mockData这两个参数，我个人认为这两个参数所对应的功能，在实际项目中能带给我们的帮助最大。
useMockData表示：是否使用模拟数据；useMockData表示：模拟数据的定义
每当我们启动一个app开发工作时，一般情况下其交互设计、视觉设计和后台服务接口设计都已经完成了，但后台服务接口的开发实现工作往往需要同步进行。
从开发进度考虑，这个时候app的开发工作是不必等待后台接口开发的。问题是这个阶段开发的app工作毕竟没有调试接口，在真实的后台接口服务开发完成后，有多少工作量还需要重新调整？
比较理想的做法是：我们设定useMockData开关，在这个开关设定为true的时候，所有接口都按照接口定义返回mock数据（调试模拟数据）。每个接口相关的mock数据定义，完全在mockData中定义。
例如：
//-----------------------------------------
//httpSetting.js中的代码：
//默认选项
module.exports.options ={
   dOption:{
	//服务请求的根路径
    	rootUrl:"http://202.103.155.22:8080/webapi",
	responseEncoding:"utf-8",
	//是否使用模拟数据
	useMockData:true,
	//模拟数据
	mockData:
	[
		  {url:"framework/login?loginID=admin&pwd=123456", type:"GET", result:"framework/token.json", status:200},
		  {url:"framework/information", type:"GET", result:"framework/information.json", status:200},
		  {url:"framework/dept?parentID=0000000100010001", type:"GET", result:"succeed.json", status:200},
		  {url:"framework/user?deptID=00000001", type:"GET", result:"framework/users00000001.json", status:200}
	]

   }
};
//main.ui.js中的代码：
var http=require("do/http");
http.ajax({
	url:"framework/login",
	data:{
		loginID:"admin",
		pwd:"123456"
	},
	type:"GET",
	success:function(data){
		var do_Notification = sm("do_Notification");
		do_Notification.alert(data);
	}
});
//-----------------------------------------
由于useMockData开关已被打开，以上示例中的framework/login接口服务，会被重定向本地的一个mock数据文件的内容（内容要求是utf8格式）。
所有mock数据文件都要求放在initdata://mock目录下，所以result定义的“framework/token.json”值，实际指向以下的完整路径：initdata://mock/framework/token.json
url参数对应完整的url路径（包括get参数），但它也支持从左到右的部分内容匹配。
除了url要匹配外，这里的type参数要求与ajax选项中的type参数也要一致才算匹配成功。
最后一个参数status表示mock数据的http返回状态码；（一般用200表示成功返回）

有了这些本地的接口mock数据的定义，我们就可以完全按照真实的接口定义来构造每个app页面内容了，并可完成一个包含所有功能但完全离线版的app，或者称之为alpha版（可以给用户做为阶段工作的确认）。
其实这种方式开发出来的alpha版app，基本上已经完全具备beta版app集成调试的能力了。当真实的后台接口服务开发部署完毕后，你只需设置好rootUrl的值并关闭useMockData开关（设置为false）, 所有数据请求都将转向真实的服务地址。

useMockData, mockData两参数对应的功能，给我们app的项目开发过程带来了极大的方便。除此之外，在真实的项目中你一定还需要解决服务认证的问题。
一般情况，我们通过认证接口服务会获取数据存取的token认证字符串，后续所有的请求都需要用这个tocken串进行身份认证才行。
对于这种情况，建议你在把token串存到内存中，然后在httpSetting.js中，通过定义morning的beforeSend函数来统一处理ajax请求发送前的token加载认证工作，达到简化每个http.ajax的调用过程的效果。
例如：
//-----------------------------------------
//login.ui.js中的代码：
var do_Global = sm("do_Global");
var http=require("do/http");
http.ajax({
	url:"framework/login",
	data:{
		loginID:do_TextBox_userName.text,
		pwd:do_TextBox_password.text
	},
	type:"GET",
	success:function(data){
		do_Global.setMemory("accessToken", _result.accessToken);
	}
});
//httpSetting.js中的代码：
//默认选项
module.exports.options ={
   dOption:{
	//服务请求的根路径
    	rootUrl:"http://202.103.155.22:8080/webapi",
	responseEncoding:"utf-8",
	//发送请求前运行的函数:beforeSend(options, do_Http)
	beforeSend:function(options, do_Http){
		//设置登录的token
		var _token = do_Global.getMemory("accessToken");
		do_Http.setRequestHeader("Authorization", "Bearer " + _token);
	},
	//是否使用模拟数据
	useMockData:true,
	//模拟数据
	mockData:
	[
		  {url:"framework/login?loginID=admin&pwd=123456", type:"GET", result:"framework/token.json", status:200},
		  {url:"framework/information", type:"GET", result:"framework/information.json", status:200}
	]

   }
};
//main.ui.js中的代码：
var http=require("do/http");
http.ajax({
	url:"framework/information",
	type:"GET",
	success:function(data){
		var do_Notification = sm("do_Notification");
		do_Notification.alert(data);
	}
});
//-----------------------------------------
以上示例，在framework/login的请求成功返回时，将accessToken写入名为accessToken的内存中。并在httpSetting.js 中定义beforeSend的默认方法，在do_Http组件请求的header中增加Authorization项的内容。（这是一种rest服务的认证方式，您也可以根据实际项目的认证需要，在options的url或data中加上token的值）
这样一来，后续所有的http.ajax服务请求就都自动加载的认证token。例如：main.ui.js中的framework/information请求，就会通过统一传入的token认证，获取到当前用户的信息。


最后我们再一个例子，有些情况下我们希望在http.ajax请求等待时，锁住页面显示等待状态；当数据返回时（包括返回成功数据或返回错误数据的情况），关闭等待状态。
对于这种情况，建议你可以在httpSetting.js中定义beforeSend和dataFilter（或者complete）函数，来统一实现在http.ajax请求过程中的等待视图加载和等待视图隐藏。
例如：
//-----------------------------------------
//login.ui.js中的代码：
var do_Global = sm("do_Global");
var http=require("do/http");
http.ajax({
	url:"framework/login",
	data:{
		loginID:do_TextBox_userName.text,
		pwd:do_TextBox_password.text
	},
	type:"GET",
	success:function(data){
		do_Global.setMemory("accessToken", _result.accessToken);
	}
});
//httpSetting.js中的代码：
var core=require("do/core");
var d1=require("deviceone");
var do_Global = d1.sm("do_Global");
//默认选项
module.exports.options ={
   dOption:{
	//服务请求的根路径
	rootUrl:"http://202.103.155.22:8080/webapi",
	responseEncoding:"utf-8",
	//发送请求前运行的函数:beforeSend(options, do_Http)
	beforeSend:function(options, do_Http){
		//设置登录的token
		var _token = do_Global.getMemory("accessToken");
		do_Http.setRequestHeader("Authorization", "Bearer " + _token);
	},
	//是否使用模拟数据
	useMockData:true,
	//模拟数据
	mockData:[
		  {url:"framework/login?loginID=admin&pwd=123456", type:"GET", result:"framework/token.json", status:200},
		  {url:"framework/information", type:"GET", result:"framework/information.json", status:200}
	]
   },
   needWaitting:{
	    //发送请求前运行的函数:beforeSend(options, do_Http)
	   beforeSend:function(options, do_Http){
		   	//设置登录的token
			var _token = do_Global.getMemory("accessToken");
			do_Http.setRequestHeader("Authorization", "Bearer " + _token);
	   		//显示等待窗口
			page.showView("source://script/do/view/waitting.ui");
		},
		//请求完成时运行的函数（在请求成功或失败之后均调用，即在 success 和 error 函数之后）
		complete:function(){
			//隐藏等待窗口
			page.hideView("source://script/do/view/waitting.ui");
		}
   }
};
//main.ui.js中的代码：
var http=require("do/http");
http.ajax({
	url:"framework/information",
	type:"GET",
	parent:"needWaitting",
	success:function(data){
		var do_Notification = sm("do_Notification");
		do_Notification.alert(data);
	}
});
//-----------------------------------------
以上代码的效果是，在main.ui.js中的framework/information请求过程中，自动加载和隐藏等待视图。

