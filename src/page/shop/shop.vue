<template>
    <div id="shop" :style="shopInfo.activities.length?{'padding-top': '1.8rem'}:''">
        <svg class="icon goback" @click="goback" aria-hidden="true"><use xlink:href="#icon-xiangyou-copy"></use></svg>
        <!--v-on:before-enter="beforeEnterAndAfterLeave"-->
        <!--v-on:enter="enterAndLeave"-->
        <!--v-on:after-enter="afterEnterAndBeforeLeave"-->
        <!--v-bind:css="false"-->
        <!--v-on:before-leave="afterEnterAndBeforeLeave"-->
        <!--v-on:leave="enterAndLeave"-->
        <!--v-on:after-leave="beforeEnterAndAfterLeave"-->
        <!--name="leftRight"-->
        <transition name="leftRight">
            <router-view></router-view>
        </transition>
        <section id="fixedTop">
            <div class="filterImg" :style="'background:url('+baseImgUrl+shopInfo.image_path+') no-repeat 0 0 / cover #000;'">
                <header id="header">
                    <div class="left">
                        <img :src="baseImgUrl+shopInfo.image_path" alt="" class="logo">
                    </div>
                    <div class="title">
                        <h2>{{shopInfo.name}}</h2>
                        <p>{{shopInfo.delivery_mode?shopInfo.delivery_mode.text+'/':''}}分钟送达{{shopInfo.piecewise_agent_fee?'/'+shopInfo.piecewise_agent_fee.tips:''}}</p>
                        <p>公告：{{shopInfo.promotion_info}}</p>
                    </div>
                    <div class="right">
                        <router-link tag="svg" :to="'/shop/shopDetail/'+$route.params.shopid+'/'+$route.params.geohash+''" class="icon toinfo"aria-hidden="true"><use xlink:href="#icon-mjiantou-copy-copy"></use></router-link>
                    </div>
                </header>
                <section v-if="shopInfo.activities.length" id="center">
                    <i>{{shopInfo.activities[0].icon_name}}</i>
                    <span class="centerInfo">&nbsp;&nbsp;{{shopInfo.activities[0].description}}</span>
                    <span>{{shopInfo.activities.length}}个活动&nbsp;<svg class="icon "aria-hidden="true"><use xlink:href="#icon-mjiantou-copy-copy"></use></svg></span>
                </section>
            </div>
            <nav id="nav">
                <span class="left-nav active">商品</span>
                <span class="right-nav">评价</span>
            </nav>
        </section>
        <main id="main">
            <transition name="el-fade-in-linear">
                <keep-alive>
                    <component :is="currentMain"></component>
                </keep-alive>
            </transition>
        </main>
        <footer id="footer">
             <div class="shop-car">
                 <svg class="icon blue-car" aria-hidden="true">
                     <use xlink:href="#icon-chat-blue"></use>
                 </svg>
             </div>
             <div class="money">
                 <div class="allMoney">￥20.00</div>
                 <div class="deliverMoney">配送费 ￥5</div>
             </div>
            <el-button  class="getMoney noYet" type="success"><span>还差￥20起送</span></el-button>
            <!--去结算 / 还差20元起送-->
        </footer>
    </div>
</template>

<script>
    import { getShopInformation } from "../../service/getData"
    import { baseImgUrl } from "../../config/env"
    import goods from "./children/goods"

    export default {
        data(){
          return {
              baseImgUrl,
              shopInfo : { activities:[] },  // 商铺详细信息
              currentMain:'goods'   // 当前显示的 main
          }
        },
        methods:{
            getShopInformation,
            goback(){
                var geohash = this.$route.params.geohash
                this.$router.push({ path: '/msite', query: { geohash: geohash }})
            },

            beforeEnterAndAfterLeave(el){
                el.style.transform = 'translateX(375px)'
                el.style.opacity = '0'
                // console.log ( "1" )
            },
            enterAndLeave( el,done ){
                el.offsetHeight;
                el.style.transition = 'all .5s'
                done()
                // console.log ( "2" )
            },
            afterEnterAndBeforeLeave( el ){
                el.style.transform = `translateX(0px)`
                el.style.opacity = '1'
                // console.log ( "3" )
            },
        },
        computed:{
            // 当前店铺的 Id
            shopId (){
                return this.$route.params.shopid
            },
        },
        created(){
            this.getShopInformation(this,this.shopId).then( result =>{
                if ( result.status == 200 ){
                    this.shopInfo = result.body
                }
            })
        },
        mounted(){
            this.$nextTick(function (  ) {
                // 当前 方法中需要的 DOM 元素
                this.currentDOM = {
                    htmlWidth(){
                        return parseFloat( window.getComputedStyle( document.querySelector('html') ).width)
                    }
                }
            })
        },
        components:{
            goods,
        }
    }
</script>

<style  lang="less"  scoped>
@import "../../assets/less/shop/shop";

* {
  touch-action: pan-y;
}

.leftRight-enter,.leftRight-leave-to{
    opacity: 0;
    transform: translateX(100vw);
}
.leftRight-enter-active, .leftRight-leave-active{
    transition: all .5s;
}
</style>