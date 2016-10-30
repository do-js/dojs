var dojs=require("dojs");

module.exports.demo = function(){
	var buttons=[
	    	   {
	    		   name:"首页",
	    		   path:"source://samples/modules/mainFrame/a.ui",
	    		   image_on:"source://samples/modules/mainFrame/img/a_2.png",
	    		   image_off:"source://samples/modules/mainFrame/img/a_1.png",
	    		   fontColor_on:"55C5B9FF",
	    		   fontColor_off:"9E9E9EFF"
	    	   },
	    	   {
	    		   name:"通讯录",
	    		   path:"source://samples/modules/mainFrame/b.ui",
	    		   image_on:"source://samples/modules/mainFrame/img/b_2.png",
	    		   image_off:"source://samples/modules/mainFrame/img/b_1.png",
	    		   fontColor_on:"55C5B9FF",
	    		   fontColor_off:"9E9E9EFF"
	    	   },
	    	   {
	    		   name:"周边",
	    		   path:"source://samples/modules/mainFrame/c.ui",
	    		   image_on:"source://samples/modules/mainFrame/img/c_2.png",
	    		   image_off:"source://samples/modules/mainFrame/img/c_1.png",
	    		   fontColor_on:"55C5B9FF",
	    		   fontColor_off:"9E9E9EFF"
	    	   },
	    	   {
	    		   name:"我",
	    		   path:"source://samples/modules/mainFrame/d.ui",
	    		   image_on:"source://samples/modules/mainFrame/img/d_2.png",
	    		   image_off:"source://samples/modules/mainFrame/img/d_1.png",
	    		   fontColor_on:"55C5B9FF",
	    		   fontColor_off:"9E9E9EFF"
	    	   }
	    	];
	dojs.modules.mainFrame(buttons);
};
