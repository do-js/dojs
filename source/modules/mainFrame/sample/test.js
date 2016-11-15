var mainFrame=require("source://modules/mainFrame/call");

module.exports.demo = function(){
	var options=[
	    	   {
	    		   name:"首页",
	    		   path:"source://modules/mainFrame/sample/a.ui",
	    		   image_on:"source://modules/mainFrame/sample/img/a_2.png",
	    		   image_off:"source://modules/mainFrame/sample/img/a_1.png",
	    		   fontColor_on:"55C5B9FF",
	    		   fontColor_off:"9E9E9EFF"
	    	   },
	    	   {
	    		   name:"通讯录",
	    		   path:"source://modules/mainFrame/sample/b.ui",
	    		   image_on:"source://modules/mainFrame/sample/img/b_2.png",
	    		   image_off:"source://modules/mainFrame/sample/img/b_1.png",
	    		   fontColor_on:"55C5B9FF",
	    		   fontColor_off:"9E9E9EFF"
	    	   },
	    	   {
	    		   name:"周边",
	    		   path:"source://modules/mainFrame/sample/c.ui",
	    		   image_on:"source://modules/mainFrame/sample/img/c_2.png",
	    		   image_off:"source://modules/mainFrame/sample/img/c_1.png",
	    		   fontColor_on:"55C5B9FF",
	    		   fontColor_off:"9E9E9EFF"
	    	   },
	    	   {
	    		   name:"我",
	    		   path:"source://modules/mainFrame/sample/d.ui",
	    		   image_on:"source://modules/mainFrame/sample/img/d_2.png",
	    		   image_off:"source://modules/mainFrame/sample/img/d_1.png",
	    		   fontColor_on:"55C5B9FF",
	    		   fontColor_off:"9E9E9EFF"
	    	   }
	    	];
	mainFrame.invoke(options);
};
