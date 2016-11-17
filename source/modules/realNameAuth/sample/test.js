module.exports.demo = function() {
	var realNameAuth=require("source://modules/realNameAuth/call");
	realNameAuth.invoke({
		// 标题
		title:"实名认证",
		// 真实姓名
		name:{
			// 提示内容
			hint : "真实姓名",
			// 最大长度限制
			maxLength : 10
		},
		// 身份证号
		id:{
			// 提示内容
			hint : "身份证号",
			// 最大长度限制
			maxLength : 18
		},
		// 回调的代码
		onCallback:"source://modules/realNameAuth/sample/realNameAuthLogic"
		
	});
};
