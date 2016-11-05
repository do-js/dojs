var dojs = require("dojs");

module.exports.call = function() {
	dojs.http.ajax({
		//上级选项名称（在defaultSetting/httpSetting.js中配置,可继承选项内容）
		parent:null,
		//服务请求的根路径
		rootUrl:"http://www.deviceone.net",
		//服务请求的url（如果不是以http://或https://开始，则会自动加上httpRootUrl变量值的前缀）
		url:"payment/index.html",
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
		beforeSend:function (options, do_Http){
			dojs.core.alert(options, "beforeSend:发送请求前运行");
		},
		//返回数据后的进行预处理的函数:dataFilter(data)
		dataFilter:function (data){
			dojs.core.alert(data, "dataFilter:返回数据后的进行预处理,只保留结果的前100个字符");
			return data.substr(0, 100);
		},
		//当请求成功时运行的函数success(data, status)
		success:function(data){
			dojs.core.alert(data, "success:成功时返回的结果");
		},
		//如果请求失败要运行的函数error(data, status)
		error:function(data){
			dojs.core.error(data);
		},
		//请求完成时运行的函数（在请求成功或失败之后均调用，即在 success 和 error 函数之后）complete(data, status)
		complete:function(data, status){
			dojs.core.alert(data, "complete:任何情况下都能返回的结果:" +status);
		},
		//是否缓存上次结果 （为true的时候，在返回服务结果之前会先返回上次结果，一般用于改善数据查询的交互体验）
		cacheLastResult:false,
		//缓存失效时长（单位为毫秒，-1表示永远使用缓存，0表示每次都先用缓存后刷新）
		cacheExpires:0,
		//是否使用调试数据
		useMockData:false,
		//调试数据
		mockData:null
	});
};
