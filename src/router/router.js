import Vue from "vue"
import VueRouter from "vue-router"
import { routerMode } from "../config/env.js"
Vue.use( VueRouter )

const home = () => import('../page/home/home.vue')
const city = () => import('../page/city/city.vue')
const msite = () => import('../page/msite/msite.vue')
const food = () => import('../page/food/food.vue')


const vueRouterObj = new VueRouter({
    mode: routerMode,
    routes:[
        { path : '/', redirect : '/home' },
        { path : '/home', component : home },
        { path : '/city/:id', component : city },
        { path : '/msite', component : msite },
        { path : '/food', component : food },
    ],
    // linkActiveClass : "mui-active"
})
export default vueRouterObj