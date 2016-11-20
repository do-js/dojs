var d1 = require("deviceone");
var dojs = require("dojs");
var controlName = "starComment";
// ---------------------------------------------------------------
/**
 * 加到一个ALayout上
 * 
 * @param _parent:那个ALayout对象
 * @param _id:加到ALayout上新的id，id唯一
 * @param _option:选项参数
 */
module.exports.addToALayout = function(_parent, _id, _option) {
	if (dojs.core.isNull(_parent) || _parent.getType() != "do_ALayout")
		return;
	var _address = _parent.add(_id, "source://userControls/" + controlName + "/src/main.ui", _option.x, _option.y);
	initEvent(_option, _address);
};
/**
 * 加到一个LinearLayout上
 * 
 * @param _parent:那个LinearLayout对象
 * @param _id:加到LinearLayout上新的id，id唯一
 * @param _option:选项参数
 */
module.exports.addToLinearLayout = function(_parent, _id, _option) {
	if (dojs.core.isNull(_parent) || _parent.getType() != "do_LinearLayout")
		return;
	var _address = _parent.add(_id, "source://userControls/" + controlName + "/src/main.ui", _option.target);
	initEvent(_option, _address);
};

function initEvent(_option, _address) {
	if (_option.onCallback)
		d1.sm("do_Page").on(controlName + "onCallback", _option.onCallback);
	d1.ui(_address).fire("initialize", _option);
}