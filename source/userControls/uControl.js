var d1 = require("deviceone");
var dojs=require("dojs");

//---------------------------------------------------------------
module.exports.addView = function(_parent, _controlName, _option){
	_option.x=_option.x||0;
	_option.y=_option.y||0;
	if (dojs.core.isNull(_parent)){
		dojs.core.error("试图userControl加入到null对象上");
		return null;
	}
	if (_parent.getType() == "do_ALayout"){
		var _id=dojs.core.getUUID();
		var _address = _parent.add(_id, "source://userControls/" + _controlName + "/src/main.ui", _option.x, _option.y);
		var _view=d1.ui(_address);
		_view.fire("usreControlInit", _option);
		_view.visible=true;
		_view.fire("usreControlInitialized", _option);
		return _view;
	}
	if (_parent.getType() == "do_LinearLayout"){
		var _id=dojs.core.getUUID();
		var _address = _parent.add(_id, "source://userControls/" + _controlName + "/src/main.ui", _option.target);
		var _view=d1.ui(_address);
		_view.fire("usreControlInit", _option);
		_view.visible=true;
		_view.fire("usreControlInitialized", _option);
		return _view;
	}
	dojs.core.error("试图userControl加入到无效的" + _parent.getType() + "父视图上，目前父视图只支持do_ALayout和do_LinearLayout");
	return null;
};