import Vue from "vue"
import VueRouter from "vue-router"
import { routerMode } from "../config/env.js"
Vue.use( VueRouter )

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
        { path : '/', redirect : '/home' },
        { path : '/home', component : home },
        { path : '/city/:id', component : city },
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
export default vueRouterObj