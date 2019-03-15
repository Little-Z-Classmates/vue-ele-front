import Vue from "vue"
import router from "./router/router"
import store from "./store/store"

// 导入字体
import "./assets/fonts/iconfont.css"

// 局部导入 Mui 的上拉 下拉加载
// import 'mint-ui/lib/style.css'
import { Loadmore } from 'mint-ui';
import { InfiniteScroll } from 'mint-ui';
import { Spinner } from 'mint-ui';
Vue.component(Spinner.name, Spinner);
Vue.use(InfiniteScroll);
Vue.component(Loadmore.name, Loadmore);
import { Button } from 'mint-ui';
Vue.component(Button.name, Button);

// 导入 ele-ui
import './plugins/element/element.js'

//  导入 swiper
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper)

// 导入 vue-resource
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
    store,
    mounted() {
        const s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = 'http://at.alicdn.com/t/font_1084448_h89bg5nnsv.js';
        document.body.appendChild(s);
    },
} )
