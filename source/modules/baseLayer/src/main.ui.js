var currentOption = sm("do_Page").getData();

sm("do_Page").on("loaded", function(){
	var _jsFile=require(currentOption.onCallback);
	_jsFile.invoke();
});