var dojs = require("dojs");
var currentOption = sm("do_Page").getData();

if (!dojs.core.isNullData(currentOption)) {
	if (!dojs.core.isNullData(currentOption.bgColor)) {
		ui("$").bgColor=currentOption.bgColor;
		ui("do_ImageView_body").bgColor = currentOption.bgColor;
	}
	if (!dojs.core.isNullData(currentOption.bgImage)) {
		ui("do_ImageView_body").source = currentOption.bgImage;
	}
}

sm("do_Page").on("loaded", function(){
	var _jsFile=require(currentOption.onCallback);
	_jsFile.invoke();
});