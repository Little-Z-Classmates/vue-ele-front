import Vue from "vue"
import router from "./router/router"
import store from "./store/store"
import  "./axios/my_axios"

// 导入字体图标
import "./assets/fonts/iconfont.css"

// 局部导入 mint
import { Loadmore } from 'mint-ui';
import { InfiniteScroll } from 'mint-ui';
import { Spinner } from 'mint-ui';
import { Button } from 'mint-ui';
Vue.component(Spinner.name, Spinner);
Vue.use(InfiniteScroll);
Vue.component(Loadmore.name, Loadmore);
Vue.component(Button.name, Button);

// 导入 animate.css
import animate from 'animate.css'
Vue.use(animate)

// 导入 ele-ui
import './plugins/element/element.js'

//  导入 swiper
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
Vue.use( VueAwesomeSwiper )


// 导入App
import app from "./App.vue"

new Vue ( {
    el : "#app",
    render : c => c ( app ),
    router,
    store,
    mounted() {
        const s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = 'http://at.alicdn.com/t/font_1084448_bjboisdo695.js';
        document.body.appendChild(s);
    },
} )
