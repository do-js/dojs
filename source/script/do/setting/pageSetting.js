//默认选项
module.exports.options ={
    dOption:{
    	//上级选项名称（可继承选项内容）
   		parent:null,
    	//支持ios手势关闭页面
    	supportPanClosePage:true,
    	//touch事件防止重复点击的时效（毫秒）
    	touchDelay:1500,
		//允许用户通过UI操作关闭OpenView的视图
		allowUserCloseView:true
    }
};