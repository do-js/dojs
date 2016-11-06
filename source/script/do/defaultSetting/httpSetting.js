var core=require("do/core");
var page=require("do/page");
var d1=require("deviceone");
var do_Global = d1.sm("do_Global");
var dojs=require("dojs");
//默认选项
module.exports.options ={
   dOption:{
		//上级选项名称（可继承选项内容）
		parent:null,
		//服务请求的根路径
		rootUrl:"http://www.XXX.XXX:8080/webapi",
		//服务请求的url（如果不是以http://或https://开始，则会自动加上httpRootUrl变量值的前缀）
		url:null,
		//请求的类型（GET,POST, PUT, DELETE）。
		type:"GET",
		//发送数据到服务器时所使用的内容类型。可以是："application/x-www-form-urlencoded", "application/json"等
		contentType:"application/json; charset=UTF-8",
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
		//缓存失效时长（单位为毫秒，-1表示永远使用缓存，0表示每次都先用缓存后刷新）
		cacheExpires:0,
		//是否使用调试数据
		useMockData:false,
		//调试数据
		mockData:[]
   },
   needWaitting:{
	    //发送请求前运行的函数:beforeSend(options, do_Http)
	   beforeSend:function(options, do_Http){
		   	//设置登录的token
			var _token = do_Global.getMemory("accessToken");
			do_Http.setRequestHeader("Authorization", "Bearer " + _token);
	   		//显示等待窗口
			var waittingLayer=require("source://modules/waittingLayer/call");
			waittingLayer.invoke({hint:"请稍后"});
		},
		//请求完成时运行的函数（在请求成功或失败之后均调用，即在 success 和 error 函数之后）
		complete:function(){
			//隐藏等待窗口
			var waittingLayer=require("source://modules/waittingLayer/call");
			waittingLayer.invoke({close:true});
		}
   }
};

