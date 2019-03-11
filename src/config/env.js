/**
 *@作者 : 小Z同学
 *@TheFileFunction ：
 *@CreatedDate : 2019/3/8
 **/
/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 *
 */
let routerMode = 'hash';
let baseUrl = '';
let imgBaseUrl = '';
// baseUrl 和 imgBaseUrl 做的事就是 vue-resource 的全局配置基础地址 https://elm.cangdu.org
// 我们用 vue-resource 的话 就不用

if (process.env.NODE_ENV == 'development') {
    imgBaseUrl = '/img/';
}else if(process.env.NODE_ENV == 'production'){
    baseUrl = '//elm.cangdu.org';
    imgBaseUrl = '//elm.cangdu.org/img/';
}

export {
    baseUrl,
    routerMode,
    imgBaseUrl,
}