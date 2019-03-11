import Vue from "vue"
import VueRouter from "vue-router"
import { routerMode } from "../config/env.js"
Vue.use( VueRouter )

import home  from '../page/home/home.vue'
import city  from '../page/city/city.vue'

const vueRouterObj = new VueRouter({
    mode: routerMode,
    routes:[
        { path : '/', redirect : '/home' },
        { path : '/home', component : home },
        { path : '/city/:id', component : city },
    ],
    // linkActiveClass : "mui-active"
})
export default vueRouterObj