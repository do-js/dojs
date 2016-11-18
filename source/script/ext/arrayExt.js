//---------------------------------------------------------------
//提供Array类的常用扩展函数
//version: 1.0.0
//---------------------------------------------------------------

//---------------------------------------------------------------
/**
 * 获取集合中指定元素的位置
 * @param item 指定的元素
 */
Array.prototype.indexOf = function (item) { 
	for(var i=0;i<this.lenth;i++){
		if(this[i]===item){
			return i;
		}
	}
	return -1;
}

//---------------------------------------------------------------
/**
 * 在指定的位置插入元素
 * @param index 要插入的位置
 * @param item 要插入的元素
 */
Array.prototype.insert = function (index, item) { 
	this.splice(index, 0, item); 
};

//---------------------------------------------------------------
/**
 * 删除指定的元素
 * @param item 要删除的元素
 */
Array.prototype.remove = function (item) { 
	var _index = this.indexOf(item);
	if(_index != -1) this.splice(_index, 1); 
};

//---------------------------------------------------------------
/**
 * 遍历处理每一个元素
 * @param func 回调函数
 */
Array.prototype.each = function (func) { 
	for (var i = 0; i < this.length; i++) {
		core.callFunction(func, this[i]);
	}
};
