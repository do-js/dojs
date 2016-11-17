//---------------------------------------------------------------
//双向绑定
//这个不是真正的双向绑定，ui变化不会自动触发数据变化，反过来数据变化也不能自动触发ui的变化。
//只是提供了setData和getData方法来模拟。但是也很大的减少了多ui和数据的反复交互存取
//-----------------------------------------
/* 示例
 var twowayBinding = require("tools/twowayBinding");

 //1.定义多个ui和数据的隐射关系，返回绑定的唯一id 
 var binding_id = twowayBinding.define(ui("$"), {
 "do_TextField_1.text" : "ipaddress",
 "do_TextField_2.text" : "port"
 });

 //2. 给多个ui设置真实的值，自动把这些值设置到ui的属性上
 var data = {
 "ipaddress" : "192.168.1.100",
 "port" : "3333"
 }
 twowayBinding.setData(binding_id, data);

 //3. 通过别的手段修改ui的属性值后，最后根据绑定标示获取所有ui的属性值的集合
 var data = twowayBinding.getData(binding_id);
 */
//version: 1.0.1 2016-10-30
//---------------------------------------------------------------
var core = require("do/core");
var d1 = require("deviceone");

var cached = {};
/**
 * 定义一个绑定的映射关系
 * 
 * @param root:当前ui的根节点，通常就是ui("$")
 * @param mapping:多ui的多属性和数据键的映射关系
 * @returns 返回一个唯一标示
 */
module.exports.define = function(root, mapping) {
	var binding_id = core.getUUID();
	cached[binding_id] = {
		"root" : root.getAddress(),
		"mapping" : mapping
	};
	return binding_id;
};

/**
 * 给ui的属性设置数据
 * 
 * @param binding_id:定义的绑定关系的唯一标示
 * @param data:设置的真实数据，是一个JsonObject
 */
module.exports.setData = function(binding_id, data) {
	var bind = cached[binding_id];
	bind.data = data;// 这个值保持下来
	for ( var m in bind.mapping) {
		var ms = m.split(".");
		var prop;
		if (ms.length == 1) {
			prop = ms[0];
			var d = {};
			d[prop] = data[bind.mapping[m]];
			if (bind.filter && bind.filter.set && bind.filter.set[m])
				d[prop] = bind.filter.set[m](d[prop]);
			if (core.isNull(d[prop]))
				d[prop] = "";
			d1.ui(bind.root).set(d);
		} else {
			prop = ms[1];
			var d = {};
			d[prop] = data[bind.mapping[m]];
			if (bind.filter && bind.filter.set && bind.filter.set[m])
				d[prop] = bind.filter.set[m](d[prop]);
			if (core.isNull(d[prop]))
				d[prop] = "";
			d1.ui(bind.root + "." + ms[0]).set(d);
		}
	}
};

/**
 * 获取当前所有ui属性的值
 * 
 * @param binding_id:定义的绑定关系的唯一标示
 * @returns 返回修改后的属性的值，是一个json object
 */
module.exports.getData = function(binding_id) {
	var bind = cached[binding_id];
	for ( var m in bind.mapping) {
		var ms = m.split(".");
		var prop;
		if (!bind.data)
			bind.data = {};
		if (ms.length == 1) {
			prop = ms[0];
			var d = d1.ui(bind.root).get(prop);
			if (bind.filter && bind.filter.get && bind.filter.get[m])
				d = bind.filter.get[m](d);
			bind.data[bind.mapping[m]] = d;
		} else {
			prop = ms[1];
			var d = d1.ui(bind.root + "." + ms[0]).get(prop);
			if (bind.filter && bind.filter.get && bind.filter.get[m])
				d = bind.filter.get[m](d);
			bind.data[bind.mapping[m]] = d;
		}
	}
	return bind.data;
};
/**
 * 设置过滤函数，对某个具体的字段，在set和get的时候先调用过滤函数处理数据
 * 
 * @param binding_id:定义的绑定关系的唯一标示
 * @param id:需要处理的ui的id加属性，比如do_TextField_1.text
 * @param set:set的时候的过滤函数，必须是函数对象
 * @param get:get的时候的过滤函数，必须是函数对象
 */
module.exports.filter = function(binding_id, id, set, get) {
	if (typeof (set) != "function" && typeof (get) != "function")
		return;
	var bind = cached[binding_id];
	if (!bind.filter)
		bind.filter = {};
	if (!bind.filter.set)
		bind.filter.set = {};
	if (typeof (set) === "function") {
		bind.filter.set[id] = set;
	}

	if (!bind.filter.get)
		bind.filter.get = {};
	if (typeof (get) === "function") {
		bind.filter.get[id] = get;
	}
};