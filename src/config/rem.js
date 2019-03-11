/**
 *@作者 : 小Z同学
 *@TheFileFunction ：
 *@CreatedDate : 2019/3/8
 **/
(function ( document, window ) {
    var html = document.getElementsByTagName('html')[0]
    var htmlFontSize =  parseInt( window.getComputedStyle( html ).fontSize)
    var configWidth = 375
    var bili = htmlFontSize / configWidth
    window.onresize = function(){
        var RealHtmlFontSize =  ( document.documentElement.clientWidth ||  window.innerWidth|| document.body.clientWidth ) * bili
        html.style.fontSize= RealHtmlFontSize + 'px'
    }
})(document,window)