var d1 = require("deviceone");
var dojs = require("dojs");
var controlName = "topBar";
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
	var _address = _parent.add(_id, "source://userControls/" + controlName + "/src/main.ui", 0, 0);
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
	if (_option.onCallback1)
		d1.sm("do_Page").on(controlName + "onCallback1", _option.onCallback1);
	if (_option.onCallback2)
		d1.sm("do_Page").on(controlName + "onCallback2", _option.onCallback2);
	d1.ui(_address).fire("initialize", _option);
}