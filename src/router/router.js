import Vue from "vue"
import VueRouter from "vue-router"
import { routerMode } from "../config/env.js"
Vue.use( VueRouter )

import home  from '../page/home/home.vue'
import city  from '../page/city/city.vue'
import msite  from '../page/msite/msite.vue'

const vueRouterObj = new VueRouter({
    mode: routerMode,
    routes:[
        { path : '/', redirect : '/home' },
        { path : '/home', component : home },
        { path : '/city/:id', component : city },
        { path : '/msite', component : msite },
    ],
    // linkActiveClass : "mui-active"
})
export default vueRouterObj