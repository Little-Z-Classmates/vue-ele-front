<template>
    <div class="msite"
         v-infinite-scroll="loadMore"
         :infinite-scroll-disabled="banMoreLoading"
         infinite-scroll-distance="10"
         infinite-scroll-immediate-check="false">
        <header id="header">
            <i class="el-icon-search  searchPage" @click="goSearchPage"></i>
            <span class="title">{{ detailAddressInfo.name }}</span>
            <div>
                <a href="#">登录</a>
                <i> | </i>
                <a href="#">注册</a>
            </div>
        </header>
        <nav id="nav">
            <template>
                <swiper :options="swiperOption" v-if='FootEntryInfo.length'  ref="mySwiper" >
                    <!-- slides -->
                    <swiper-slide v-for="item in FootEntryInfo" :key="new Date().getTime()*Math.random()*Math.random()" class="swiperTab">
                        <ul>
                            <router-link tag="li" :to="'/food?title='+ value.title +'&restaurant_category_id='+ value.id" v-for="value in item " :key="value.id">
                                <img class="navImg" :src="imgBaseUrl + value.image_url">
                                <div class="navImgTitle">{{ value.title }}</div>
                            </router-link>
                        </ul>
                    </swiper-slide>
                    <!-- Optional controls -->
                    <div class="swiper-pagination"  slot="pagination"></div>
                </swiper>
            </template>
        </nav>
        <main id="main">
           <div class="title">
               <span class="iconfont">&#xe67b;</span>
               <span>附近商家</span>
           </div>
                <oneSellerMsgCard :restaurantsListInfo="restaurantsListInfo" :geohash="$store.getters.getGeoHash"></oneSellerMsgCard>
                <div class="spinnerBottom" v-if="!allLoaded">
                <mt-spinner class="dataStatusImg" type="fading-circle" color="#00ccff" :size="30" ></mt-spinner><span class="dataStatus">加载中...</span>
                </div>
                <div class="spinnerBottom" v-if="allLoaded">
                    <span class="dataStatus">数据已加载完毕</span>
                </div>
        </main>
        <footer id="footer">
            <div class="footerNav">
                <svg class="icon footerNavImg" aria-hidden="true">
                    <use xlink:href="#icon-eliaomo2"></use>
                </svg>
                <span class="footerNavTitle">外卖</span>
            </div>
            <div class="footerNav">
                <svg class="icon footerNavImg" aria-hidden="true">
                    <use xlink:href="#icon-zhinanzhen3"></use>
                </svg>
                <span class="footerNavTitle">搜索</span>
            </div>
            <div class="footerNav">
                <svg class="icon footerNavImg" aria-hidden="true">
                    <use xlink:href="#icon-wenzhang2"></use>
                </svg>
                <span class="footerNavTitle">订单</span>
            </div>
            <div class="footerNav">
                <svg class="icon footerNavImg" aria-hidden="true">
                    <use xlink:href="#icon-home"></use>
                </svg>
                <span class="footerNavTitle">我的</span>
            </div>
        </footer>
    </div>
</template>

<script>
    import  { fullScreen } from "../../config/jsTools"
    import  { judgeFullScreen } from "../../config/jsTools"
    import { imgBaseUrl } from "../../config/env.js"
    import { baseImgUrl } from "../../config/env.js"
    import { getDetailedLocation } from "../../service/getData"
    import { getFootEntry } from "../../service/getData"
    import { getRestaurants } from "../../service/getData"
    import  oneSellerMsgCard from '../../components/sellerMsgCard/sellerMsgCard'

    export default {
        data () {
            return {
                // --------遮罩层 3 属性----------
                loading : '' ,
                loadingKey : 3,
                currentLoadingKey : 0,
                // --------遮罩层 3 属性----------
                detailAddressInfo : {},  // 详细的地址
                swiperOption: {
                    loop : true,
                    observer: true,//修改swiper自己或子元素时，自动初始化swiper
                    observeParents: true,//修改swiper的父元素时，自动初始化swiper
                    pagination: {
                        el: '.swiper-pagination',
                    }
                } ,    // 配置swiper
                FootEntryInfo : {},      // 食品列表
                imgBaseUrl : imgBaseUrl,
                baseImgUrl : baseImgUrl ,
                restaurantsListInfo : [], // 餐馆列表信息
                restaurantsListRealLength : 0 ,  // 餐馆还未筛选的数量
                // -----初始化无限加载相关参数-------
                banMoreLoading: false,     // 是否禁用 更多加载, true 就禁用, false 就不禁用
                allLoaded: false,         //  所有数据是否加载完成
                // -----初始化无限加载相关参数-------
            }
        },
        computed: {
            swiper() {
                return this.$refs.mySwiper.swiper
            }
        },
       created () {
            this.move()
            this.fullScreen( this ) // 遮罩层开启
            // 获取详细地址
            this.getDetailedLocation( this,this.getVuexGeoHash() ).then( results => {
               if ( results.status === 200 ){
                   this.detailAddressInfo = results.data
                   this.judgeFullScreen(this)  // 1
               }
           })
            // 获取食品分类列表
            this.getFootEntry( this ).then( results =>{
                if ( results.status === 200 ){
                    var arr = []
                    arr.push( results.data.slice(0,8) )
                    arr.push( results.data.slice(8,16))
                    this.FootEntryInfo = arr
                    this.judgeFullScreen(this)   // 2
                }
            })
            // 获取餐馆分类列表 进行数据 筛选与添加 操作
            var geohashArr =  this.$store.getters.getGeoHash.split(',')
            var filterFuc = this.filterShopRestaurants
            this.getRestaurants( this, geohashArr[0],geohashArr[1] ).then( results =>{
                if ( results.status === 200 ){
                    results.data.forEach( item =>{
                        var flag = false
                        var startArr = {}
                        var rating = item.rating
                        var gewei = Math.floor( ( rating * 10 ) / 10 )
                        var miaowei = Math.floor( ( rating * 10 ) %  10 )
                        if ( miaowei == 0 || miaowei < 5){
                            var allStart = gewei
                        }else if ( miaowei >= 5 ){
                            var allStart = gewei + 1
                        }
                        for(var i = 0 ;i< 5 ;i++){
                           if ( allStart > 0 ){
                               startArr[i] = !flag
                               allStart =  allStart - 1
                           }else{
                               startArr[i] = flag
                           }
                        }
                        item.startArr = startArr
                     })
                    this.restaurantsListRealLength = results.data.length
                    var filteredArray = results.data.filter( filterFuc )
                    this.restaurantsListInfo = filteredArray
                    setTimeout( () =>{
                        this.judgeFullScreen(this)   // 3
                    },1000)
                }
            })
        },
        methods : {
            goSearchPage(){
            },
            fullScreen,       // 遮罩层的两个方法
            judgeFullScreen, // 遮罩层的两个方法
            getRestaurants,
            getDetailedLocation,
            getFootEntry,    // 食品列表
            // 根据 Vuex 得到经纬度
            getVuexGeoHash(){
              return this.$store.getters.getGeoHash
            },
            // 筛选不符合营业时间的商家
            filterShopRestaurants( item ){
                var shopHoursArr =  ( item.opening_hours )[0].split('/')
                var openShop =  shopHoursArr[0].split(':')
                var closeShop = shopHoursArr[1].split(':')
                var openSec = parseInt(openShop[0])*60*60 + parseInt(openShop[1])*60
                var closeSec = parseInt(closeShop[0])*60*60 + parseInt(closeShop[1])*60
                var currentHSec = new Date().getHours()*60*60
                var currentMSec = new Date().getMinutes()*60
                var currentSSec = new Date().getSeconds()
                var allCurrentSec = currentHSec + currentMSec + currentSSec
                if ( allCurrentSec >= openSec && allCurrentSec <= closeSec ){
                    return true
                }
            },
            // 加载更多数据
            loadMore() {
                if( this.allLoaded ){
                    return false;
                }
                var geohashArr =  this.$store.getters.getGeoHash.split(',')
                var filterFuc = this.filterShopRestaurants
                this.getRestaurants( this,geohashArr[0],geohashArr[1],this.restaurantsListRealLength ).then( results =>{
                    if ( results.status === 200 ){
                        results.data.forEach( item =>{
                            var flag = false
                            var startArr = {}
                            var rating = item.rating
                            var gewei = Math.floor( ( rating * 10 ) / 10 )
                            var miaowei = Math.floor( ( rating * 10 ) %  10 )
                            if ( miaowei == 0 || miaowei < 5){
                                var allStart = gewei
                            }else if ( miaowei >= 5 ){
                                var allStart = gewei + 1
                            }
                            for(var i = 0 ;i< 5 ;i++){
                                if ( allStart > 0 ){
                                    startArr[i] = !flag
                                    allStart =  allStart - 1
                                }else{
                                    startArr[i] = flag
                                }
                            }
                            item.startArr = startArr
                        })
                        var oldRealLength = this.restaurantsListRealLength  // 得到更新之前的 数据量
                        this.restaurantsListRealLength = results.data.length + this.restaurantsListRealLength
                        var newRealLength = this.restaurantsListRealLength  // 得到更新之后的 数据量
                        if ( oldRealLength == newRealLength ){       // 判断更新之后 数据量 是否等于 更新之前 数据量
                            this.allLoaded = true                   //  如果等于 allLoaded 全部加载完毕 标识符为true
                            return false                           //  return false, 不往下执行
                        }
                        var filteredArray = results.data.filter( filterFuc )
                        var newRestaurantsList = this.restaurantsListInfo.concat(filteredArray)
                        this.restaurantsListInfo = newRestaurantsList
                    }
                })
            },
            // 定义一个 可以滚动的方法
            move(){
                var mo=function(e){ e.preventDefault() }
                document.body.style.overflow='';
                document.removeEventListener("touchmove",mo,false);
            }
        },
        components:{
            "oneSellerMsgCard" : oneSellerMsgCard
        }
    }
</script>

<style lang="less" scoped>
    * {
        touch-action: pan-y;
    }
    @import "../../assets/less/base/header";
    @import "../../assets/less/msite/msite";
</style>