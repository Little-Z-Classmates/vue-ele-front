import Vue from "vue"
import VueRouter from "vue-router"
import { routerMode } from "../config/env.js"
Vue.use( VueRouter )

const error = () => import('../page/error/error.vue')
const home  = () => import('../page/home/home.vue')
const city  = () => import('../page/city/city.vue')
const msite = () => import('../page/msite/msite.vue')
const food  = () => import('../page/food/food.vue')
const shop  = () => import('../page/shop/shop.vue')
const shopDetail = () => import("../page/shop/children/shopDetail.vue")
const shopSafe = () => import("../page/shop/children/shopSafe.vue")

const vueRouterObj = new VueRouter({
    mode: routerMode,
    routes:[
        { path : '/error',component : error },
        { path : '/', redirect : '/home' },
        { path : '/home', component : home },
        { path : '/city/:id', component : city , meta: { requiresGeoHash: true }},
        { path : '/msite', component : msite },
        { path : '/food', component : food },
        {
            path : '/shop/:shopid',
            component : shop ,
            children:[
                { path:'/shop/shopDetail/:shopid',component : shopDetail },
                { path:'/shop/shopDetail/shopSafe/:shopid',component : shopSafe },
            ]
        }
    ],
})
// 导航守卫
vueRouterObj.beforeEach( (to, from, next) => {
    var geoHash = JSON.parse ( sessionStorage.getItem('currentGeoHash') )
    // 判断去的路由,如果不存在
    if ( !to.matched.length  ){
        next( { path : '/error'} )
        return false
    }
    // 判断 去的 路由 是否为 home
    if ( to.path == '/home'){
        next()
        return false
    }
    // 判断去的路由是否 是 /city/ 开头
    if ( /^\/city\//.test ( to.path ) ){
        next()
        return false
    }
    // 判断 是否有 经纬度
    if ( !geoHash ){
        next( { path : '/home'})
        return false
    }

    next()
})
export default vueRouterObj