var dojs=require("dojs");

dojs.page.onTouch("do_Button_test1", function(){
	dojs.http.ajax("http://www.baidu.com", {
		success:function(data){
			var do_Notification = sm("do_Notification");
			do_Notification.alert(data);
		}
	});
});
