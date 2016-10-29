//---------------------------------------------------------------
//提供Date类的常用扩展函数
//version: 1.0.0
//---------------------------------------------------------------

//---------------------------------------------------------------
/**
 * 格式化输出字符串
 * @param _format 指定的转换格式，默认为:yyyy-MM-dd
 */
Date.prototype.format = function (_format) { 
	_format=_format||"yyyy-MM-dd";
	var o = { 
		"M{1,2}": this.getMonth() + 1, 
		"d{1,2}": this.getDate(), 
		"h{1,2}": this.getHours(), 
		"m{1,2}": this.getMinutes(), 
		"s{1,2}": this.getSeconds(), 
		"q{1,2}": Math.floor((this.getMonth() + 3) / 3), 
		"S": this.getMilliseconds() 
	} 
	if (/(y{2,4})/.test(_format)) { 
		_format = _format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)); 
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(_format)) {
			_format = _format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)); 
		}
	}
	return _format; 
}

//---------------------------------------------------------------
/**
 * 按照毫秒数设定时间,并返回设定后的时间（方便函数的链式操作）
 */
Date.prototype.loadTime = function (millisec) { 
	this.setTime(millisec);
	return this;
}

//---------------------------------------------------------------
/**
 * 按照毫秒数设定时间,并返回设定后的时间（方便函数的链式操作）
 */
Date.prototype.loadTime = function (millisec) { 
	this.setTime(millisec);
	return this;
}

//---------------------------------------------------------------
/**
 * 返回所在日期的起始时间 （00:00:00 0)
 */
Date.prototype.firstTimeOfDay = function () { 
	var _result = new Date(this);
	_result.setHours(0,0,0,0);
	return _result;
}

//---------------------------------------------------------------
/**
 * 返回所在日期的结束时间 （23:59:59 999)
 */
Date.prototype.lastTimeOfDay = function () { 
	var _result = new Date(this);
	_result.setHours(23,59,59,999);
	return _result;
}

//---------------------------------------------------------------
/**
 * 返回所在周的第一天 （周一）
 */
Date.prototype.firstDayOfWeek = function () { 
	var _result = new Date(this);
	var sub = _result.getDay() -1;
	if (sub <0) sub= 6;
	_result.setDate(_result.getDate() - sub);
	return _result;
}

//---------------------------------------------------------------
/**
 * 返回所在周的最后一天  （周日）
 */
Date.prototype.lastDayOfWeek = function () { 
	var _result = new Date(this);
	var sub = 7-_result.getDay();
	if (sub > 6) return _result;
	_result.setDate(_result.getDate() + sub);
	return _result;
}

//---------------------------------------------------------------
/**
 * 返回所在月份的第一天
 */
Date.prototype.firstDayOfMonth = function () { 
	var _result = new Date(this);
	_result.setDate(1);
	return _result;
}

//---------------------------------------------------------------
/**
 * 返回所在月份的最后一天
 */
Date.prototype.lastDayOfMonth = function () { 
	var _result = new Date(this);
	_result.setMonth(_result.getMonth() + 1);
	_result.setDate(0);
	return _result;
}

//---------------------------------------------------------------
/**
 * 返回增加指定年份数后的结果
 * @param value 增加的年份数 (可以是负值)
 */
Date.prototype.addYears = function (value) {
    if (!value || isNaN(value)) value = 0;
    this.setFullYear(this.getFullYear() + value);
    return this;
};

//---------------------------------------------------------------
/**
 * 返回增加指定月份数后的结果
 * @param value 增加的月份数 (可以是负值)
 */
Date.prototype.addMonths = function (value) {
    if (!value || isNaN(value)) value = 0;
    this.setMonth(this.getMonth() + value);
    return this;
};

//---------------------------------------------------------------
/**
 * 返回增加指定天数后的结果
 * @param value 增加的天数 (可以是负值)
 */
Date.prototype.addDays = function (value) {
    if (!value || isNaN(value)) value = 0;
    this.setDate(this.getDate() + value);
    return this;
};

//---------------------------------------------------------------
/**
 * 返回增加指定小时数后的结果
 * @param value 增加的小时数 (可以是负值)
 */
Date.prototype.addHours = function (value) {
    if (!value || isNaN(value)) value = 0;
    this.setHours(this.getHours() + value);
    return this;
};

//---------------------------------------------------------------
/**
 * 返回增加指定分钟数后的结果
 * @param value 增加的分钟数 (可以是负值)
 */
Date.prototype.addMinutes = function (value) {
    if (!value || isNaN(value)) value = 0;
    this.setMinutes(this.getMinutes() + value);
    return this;
};

//---------------------------------------------------------------
/**
 * 返回增加指定秒数后的结果
 * @param value 增加的秒数 (可以是负值)
 */
Date.prototype.addSeconds = function (value) {
    if (!value || isNaN(value)) value = 0;
    this.setSeconds(this.getSeconds() + value);
    return this;
};

//---------------------------------------------------------------
/**
 * 返回增加指定毫秒数后的结果
 * @param value 增加的毫秒数 (可以是负值)
 */
Date.prototype.addMilliseconds = function (value) {
    if (!value || isNaN(value)) value = 0;
    this.setMilliseconds(this.getMilliseconds() + value);
    return this;
};

