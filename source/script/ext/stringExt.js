//---------------------------------------------------------------
//提供String类的常用扩展函数
//version: 1.0.0
//---------------------------------------------------------------

//---------------------------------------------------------------
/**
 * 判断是否开始于指定的字符串
 * @param compareValue    指定的字符串值
 * @param ignoreCase      [可空] 是否忽略大小写，默认为false
 */
String.prototype.startWith = function (compareValue, ignoreCase) {
	if (!compareValue) return false;
	if (ignoreCase) { 
		return this.toLowerCase().indexOf(compareValue.toLowerCase()) == 0; 
	} 
	return this.indexOf(compareValue) == 0 
}; 

//---------------------------------------------------------------
/**
 * 判断是否结束于指定的字符串
 * @param compareValue    指定的字符串值
 * @param ignoreCase      [可空] 是否忽略大小写，默认为false
 */
String.prototype.endWith = function (compareValue, ignoreCase) { 
	if (!compareValue) return false;
	if (ignoreCase) { 
		return this.toLowerCase().lastIndexOf(compareValue.toLowerCase()) == this.length - compareValue.length; 
	}
	return this.lastIndexOf(compareValue) == this.length - compareValue.length; 
};

//---------------------------------------------------------------
/**
 * 获取字符串内容翻转后的值
 */
String.prototype.reverse = function () { 
	var ret = ''; 
	for (var i = this.length - 1; i >= 0; i--) { 
		ret += this.charAt(i); 
	} 
	return ret; 
};

//---------------------------------------------------------------
/**
 * 获取字符串左右两侧去空格后的值
 */
String.prototype.trim = function () { 
	return this.replace(/^\s+/, '').replace(/\s+$/, ''); 
}; 
	
//---------------------------------------------------------------
/**
 * 获取字符串左侧去空格后的值
 */
String.prototype.trimLeft = function () { 
	return this.replace(/^\s+/, ''); 
}; 
	
//---------------------------------------------------------------
/**
 * 获取字符串右侧去空格后的值
 */
String.prototype.trimRight = function () { 
	return this.replace(/\s+$/, ''); 
};

//---------------------------------------------------------------
/**
 * 获取字符串左侧补全字符的值
 * @param padChar    要补全的字符
 * @param width      补全后的总宽度
 */
String.prototype.padLeft = function (padChar, width) { 
	var ret = this; 
	while (ret.length < width) {
		if (ret.length + padChar.length < width) {
			ret = padChar + ret;
		}
		else {
			ret = padChar.substring(0, width-ret.length) + ret; 
		} 
	} 
	return ret; 
};


//---------------------------------------------------------------
/**
 * 获取字符串右侧补全字符的值
 * @param padChar    要补全的字符
 * @param width      补全后的总宽度
 */
String.prototype.padRight = function (padChar, width) { 
	var ret = this; 
	while (ret.length < width) { 
		if (ret.length + padChar.length < width) { 
			ret += padChar; 
		} 
		else { 
			ret += padChar.substring(0, width - ret.length); 
		} 
	} 
	return ret; 
}; 

//---------------------------------------------------------------
/**
 * 获取字符串右侧指定长度的子串
 * @param len 指定的子串长度
 */
String.prototype.Right=function(len)  
{  
	if(isNaN(len)||lennull)  
	{  
		len=this.length;  
	}
	else  
	{  
        if(parseInt(len)<0||parseInt(len)>this.length)  
        {  
        	len=this.length;  
        }
	}
	return this.substring(this.length-len,this.length);  
}

//---------------------------------------------------------------
/**
 * 获取字符串左侧指定长度的子串
 * @param len    指定的子串长度
 */
String.prototype.Left = function(len)  
{  
	if(isNaN(len)||lennull)  
	{  
		len=this.length;  
	}
	else  
	{  
		if(parseInt(len)<0||parseInt(len)>this.length)  
		{  
			len=this.length;  
		}
	}
	return this.substr(0,len);  
}
