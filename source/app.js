var d1 = require("deviceone");
var dojs=require("dojs");
var mainFrame=require("source://modules/mainFrame/call");

d1.sm("do_App").on("loaded", function() {
	var buttons=[
		    	   {
		    		   name:"sripts",
		    		   path:"source://samples/script/main.ui",
		    		   image_on:"source://samples/img/a_2.png",
		    		   image_off:"source://samples/img/a_1.png",
		    		   fontColor_on:"55C5B9FF",
		    		   fontColor_off:"9E9E9EFF"
		    	   },
		    	   {
		    		   name:"modules",
		    		   path:"source://samples/modules/main.ui",
		    		   image_on:"source://samples/img/b_2.png",
		    		   image_off:"source://samples/img/b_1.png",
		    		   fontColor_on:"55C5B9FF",
		    		   fontColor_off:"9E9E9EFF"
		    	   },
		    	   {
		    		   name:"API",
		    		   path:"source://samples/api/main.ui",
		    		   image_on:"source://samples/img/c_2.png",
		    		   image_off:"source://samples/img/c_1.png",
		    		   fontColor_on:"55C5B9FF",
		    		   fontColor_off:"9E9E9EFF"
		    	   },
		    	   {
		    		   name:"examples",
		    		   path:"source://samples/others/main.ui",
		    		   image_on:"source://samples/img/d_2.png",
		    		   image_off:"source://samples/img/d_1.png",
		    		   fontColor_on:"55C5B9FF",
		    		   fontColor_off:"9E9E9EFF"
		    	   }
		    	];
	mainFrame.invoke(buttons);
});