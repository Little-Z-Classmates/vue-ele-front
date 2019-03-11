import Vue from "vue"
import router from "./router/router"
import store from "./store/store"

import './plugins/element/element.js'
import VueResource from "vue-resource"

Vue.use( VueResource )
Vue.http.options.root = "https://elm.cangdu.org"
Vue.http.options.emulateJSON = true;

import app from "./App.vue"
import "./config/rem.js"

new Vue ( {
    el : "#app",
    render : c => c ( app ),
    router,
    store
} )
