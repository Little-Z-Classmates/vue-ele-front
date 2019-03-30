/**
 *@作者 : 小Z同学
 *@TheFileFunction ：封装常用的方法
 *@CreatedDate : 2019/3/8
 **/
// 遮罩层 属性
 /**
  *    loading : '' ,
  *    loadingKey : 3,
  *    currentLoadingKey : 0
  */
// 遮罩层
export var  fullScreen  =  function  ( theThis ) {
    theThis.loading =  theThis.$loading ( {
        lock : true,
        text : "Loading",
        spinner : "el-icon-loading",
        background : "rgba(0, 0, 0, 0.7)"
    } )
}

// 判断遮罩层
export var judgeFullScreen = function( theThis ){
    theThis.currentLoadingKey += 1
    if (theThis.currentLoadingKey == theThis.loadingKey ){
        theThis.loading.close()
    }
}
// --------------------------------------------------------------

// 深拷贝 ( typeof 检测 所有复杂类型都是 object)
export var deepCopy = function(obj) {
    var result = Array.isArray(obj) ? [] : {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object') {
                result[key] = deepCopy(obj[key]);   //递归复制
            } else {
                result[key] = obj[key];
            }
        }
    }
    return result;
}