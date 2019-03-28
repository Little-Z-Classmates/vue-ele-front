<template>
    <div id="food" >
        <headerComponent :sellerName="$route.query.title"  @goToBack="goToBack"></headerComponent>
        <nav id="nav">
            <div class="title"
                 v-for="item in navTitles"
                 @click="toggleNavTab(item.navTabComponentName)">
                <span :class="item.navTabComponentName == navTabCurrentComponent && navTabFlag ? 'title-active':''">
                {{ item.navTabComponentName == navTabCurrentComponent && navTabFlag ? '分类': item.titleName }}
                <svg :class="['icon',item.navTabComponentName == navTabCurrentComponent && navTabFlag ? 'title-move':'']"
                     aria-hidden="true">
                    <!-- 蓝色和白色图标 来回 替换-->
                    <use :xlink:href="item.navTabComponentName == navTabCurrentComponent && navTabFlag ? '#icon-xia-copy-copy':'#icon-xia-copy'"></use>
                </svg>
                </span>
            </div>
            <div class="sub">
                <transition name="fade" mode="out-in" >
                    <keep-alive>
                        <component
                                v-loading.fullscreen.lock="fullscreenLoading"
                                @toggleCategory="toggleCategory"
                                @toggleSort="toggleSort"
                                @toggleFilter="toggleFilter"
                                :navClassifyInfoList="navTabCurrentComponent === 'navClassifyComponent'? navClassifyInfoList : ''"
                                :is="navTabCurrentComponent"
                                v-if="navTabFlag" >
                        </component>
                    </keep-alive>
                </transition>
            </div>
        </nav>
        <div class="mainOut" ref="mainRef">
            <main id="main">
                <oneSellerMsgCardComponent :restaurantsListInfo="currentShopList"></oneSellerMsgCardComponent>
                <!-- 蒙层 -->
                <transition name="opcityMaskLayer">
                    <section id="maskLayer" v-if="navTabFlag" @click="disappearNav"></section>
                </transition>
                <div class="fading-circle" v-if="loadingDownStatus == 'beforeLoading'">
                    <mt-spinner  color="#3190E8" type="fading-circle"></mt-spinner>
                    <span>&nbsp;&nbsp;释放加载...</span>
                </div>
                <div class="fading-circle" v-if="loadingDownStatus == 'loading'">
                    <mt-spinner  color="#3190E8" type="fading-circle"></mt-spinner>
                    <span>&nbsp;&nbsp;加载中...</span>
                </div>
                <div class="fading-circle" v-if="loadingDownStatus == 'overLoading'">
                    <i class="el-icon-success"></i>
                    <span>&nbsp;&nbsp;加载完毕</span>
                </div>
                <div class="upScroll" v-if="loadingUpStatus == 'loading' ">
                    <i class="el-icon-loading"></i>
                    <span>&nbsp;&nbsp;加载中...</span>
                </div>
                <div class="upScroll" v-if="loadingUpStatus == 'overLoading' ">
                    <span>商家全部加载完毕</span>
                </div>
            </main>
        </div>
    </div>

</template>

<script>
    import header from "../../components/header/header"
    import oneSellerMsgCard from "../../components/sellerMsgCard/sellerMsgCard"
    import navClassify from "./children/navClassify"
    import navSort from "./children/navSort"
    import navFilter from "./children/navFilter"
    import  { imgBaseUrl } from "../../config/env"
    import  { getAllSellerClassify } from "../../service/getData"
    import { getRestaurants } from "../../service/getData"
    import BScroll from 'better-scroll'

    export default {
        data () {
            return {
                imgBaseUrl,
                navTabFlag : true,   // 在一个 nav tab 栏 切换时候, 隐藏和显示
                navTabCurrentComponent : "navClassifyComponent", // 当前的 tab栏组件
                navClassifyInfoList : [],   // 分类列表信息
                currentShopList : [] ,     // 当前的商铺列表,
                currentShopListNum : 0,   // 当前的商铺列表数量
                currentCategoryId: 0,    // 当前商家的 分类的 id
                currentSort:'' ,        // 当前的排序方式
                currentVipIdArr:[],    // 当前的餐馆支持特权的id (数组)
                loadingDownStatus : 'beforeLoading' ,// 加载状态 beforeLoading / loading / overLoading
                loadingUpStatus : 'loading',    // 加载状态  / loading / overLoading
                fullscreenLoading: false,      // ele-ui 的全屏覆盖加载
                navFirstTitleName : '',       // 分类的 title
            }
        },
        computed : {
            navTitles () {
                return [ { titleName : this.navFirstTitle, navTabComponentName : "navClassifyComponent" },
                         { titleName : "排序", navTabComponentName : "navSortComponent" },
                         { titleName : "筛选", navTabComponentName : "navFilterComponent" } ]
            },
            navFirstTitle ( )  {     // 第一个 nav tab 栏的名字
               return ( this.navFirstTitleName || this.$route.query.title )
            },
            // 滚动 刷新 与 加载
            scroll(){
                if ( this.$refs.mainRef ){
                    return new BScroll( this.$refs.mainRef,{
                        pullDownRefresh: {
                            threshold: 50,  // 顶部下拉的距离（threshold）
                            stop: 40    // 刷新时机以及回弹停留的距离（stop）
                        },
                        pullUpLoad: {
                            threshold: 0 // 底部上拉的距离（threshold）
                        }
                    } )
                }
            },
        },
        methods : {
            getAllSellerClassify,
            getRestaurants,
            // 根据 Vuex 得到经纬度
            getVuexGeoHash(){
                if ( this.$store.getters.getGeoHash ){
                    return this.$store.getters.getGeoHash
                }else{
                    this.$router.push({ path : '/home'})
                }
            },
            // 返回上一页的方法
            goToBack(){
                this.$router.push({ path : '/msite'})
            },
            // 点击蒙层, nav栏 往上滑
            disappearNav(){
                this.navTabFlag = false
                console.log ( "1" )
                this.scroll.enable();
            },
            // 封装 getRestaurants
            getRestaurantsPackage( scrollObj ){
                // 根据id 得到商铺列表
                var geohash = ( this.$store.getters.getGeoHash ).split(',') ;
                var restaurant_category_id = this.$route.query.restaurant_category_id ;
                this.getRestaurants( this,geohash[0],geohash[1],0,restaurant_category_id ).then( result =>{
                    if ( result.status === 200){
                        if ( scrollObj ){
                           setTimeout( ()=>{
                                this.currentShopList = result.body;
                                this.currentShopListNum = result.body.length;
                                this.loadingUpStatus = 'loading';
                                scrollObj.finishPullDown();
                            },1500)
                            setTimeout( ()=>{
                                this.loadingDownStatus = 'beforeLoading';
                                this.scroll.refresh()
                            },2800)
                            setTimeout( () =>{
                                this.loadingDownStatus = 'overLoading' ;
                            },1000)
                        }else{
                             this.currentShopList = result.body;
                             this.currentShopListNum = result.body.length
                        }
                    }
                });
            },
            // 封装 getRestaurants , 下拉得到更多数据
            getMoreRestaurantsPackage( scrollObj ){
                var geohash = ( this.$store.getters.getGeoHash ).split(',') ;
                var restaurant_category_id = this.$route.query.restaurant_category_id ;
                this.getRestaurants( this,geohash[0],geohash[1],this.currentShopListNum,restaurant_category_id ).then( result => {
                    if ( result.status === 200 ) {
                        setTimeout( ()=>{
                            var currentNum = this.currentShopListNum
                            this.currentShopListNum += result.body.length
                            if ( currentNum  == this.currentShopListNum ){
                                this.loadingUpStatus = 'overLoading'
                            }else{
                                this.currentShopList = this.currentShopList.concat( result.body )
                            }
                            scrollObj.finishPullUp();
                        },2000 )  // 两秒变成 数据变的更多
                    }
                })
            },
            // 切换 nav tab栏
            toggleNavTab( navTabComponentName ){
                // 1. 判断是否是同一个 tab栏切换
                if( this.navTabCurrentComponent === navTabComponentName ){
                    // 禁止滚动判断
                    if( !this.navTabFlag ){
                        this.scroll.disable()
                        this.stop()
                    }else{
                        this.scroll.enable();
                    }
                    this.navTabFlag = !this.navTabFlag
                    return false
                }
                // 2 不是同一个tab栏, 就切换组件
                if ( !this.navTabFlag ){
                    this.navTabFlag = true
                }
                this.navTabCurrentComponent = navTabComponentName
            },
            // 滑动限制
            stop(){
                var mo=function(e){ e.preventDefault(); };
                document.body.style.overflow='hidden';
                document.addEventListener( "touchmove",mo,false );//禁止页面滑动
            },
            // 根据 分类id 切换 商家
            toggleCategory( categoryId,categoryName ){
                if ( this.navTabCurrentComponent != 'navClassifyComponent' ){
                    return false
                }
                this.fullscreenLoading = true
                var geohash = ( this.$store.getters.getGeoHash ).split(',') ;
                this.getRestaurants( this,geohash[0],geohash[1],0,categoryId ).then( result =>{
                    if ( result.status == 200){
                        this.currentCategoryId = categoryId
                        this.currentShopList   = result.body
                        this.navFirstTitleName = categoryName
                        this.fullscreenLoading = false
                        this.navTabFlag = false
                        this.scroll.enable();
                    }
                })
            },
            // 根据 排序方式 切换 商家
            toggleSort( order_by ){
              if ( this.navTabCurrentComponent != 'navSortComponent'){
                   return false
              }
                this.fullscreenLoading = true
                var geohash = ( this.$store.getters.getGeoHash ).split(',') ;
                this.getRestaurants( this,geohash[0],geohash[1],0,this.currentCategoryId,order_by ).then( result =>{
                    if ( result.status == 200){
                        this.currentSort = order_by
                        this.currentShopList   = result.body
                        this.fullscreenLoading = false
                        this.navTabFlag = false
                        this.scroll.enable();
                    }
                })
            },
            // 根据 餐馆支持特权的id 切换
            toggleFilter(vipIdArr){
                if ( this.navTabCurrentComponent != 'navFilterComponent'){
                     return false
                }
                if ( vipIdArr.length == 0 ){
                    this.$message({
                        message: '尚未选择商家属性',
                        type: 'warning',
                        center: true,
                        duration: 800
                    });
                    this.navTabFlag = false
                    return false
                }
                this.fullscreenLoading = true
                var geohash = ( this.$store.getters.getGeoHash ).split(',') ;
                this.getRestaurants( this,geohash[0],geohash[1],0,this.currentCategoryId,this.currentSort,vipIdArr )
                .then( result =>{
                    if ( result.status == 200){
                        this.currentVipIdArr = vipIdArr
                        this.currentShopList = result.body
                        this.fullscreenLoading = false
                        this.navTabFlag = false
                        this.scroll.enable();
                    }
                })
            }
        },
        created(){
            this.getVuexGeoHash()
            if ( !this.$store.getters.getGeoHash ){
                return false
            }
            this.getAllSellerClassify( this ).then( results =>{
                if ( results.status === 200 ){
                    this.navClassifyInfoList = results.body
                }
            })
            this.getRestaurantsPackage()
        },
        mounted () {
            this.$nextTick(() => {
                if ( this.scroll ){
                    this.scroll;
                    // 下拉 触发 事件
                    this.scroll.on('pullingDown', () => {
                        this.loadingDownStatus = 'loading' ;
                        this.getRestaurantsPackage( this.scroll );
                    });
                    // 上拉 触发 事件
                    this.scroll.on('pullingUp', () => {
                        if ( ! ( this.loadingUpStatus == 'overLoading' ) ){
                            this.getMoreRestaurantsPackage( this.scroll );
                        }
                    });
                    this.scroll.disable();
                    this.stop();
                }
            })
        },
        beforeDestroy(){
            if ( this.scroll ){
                this.scroll.destroy()
            }
        },
        components : {
            "headerComponent" : header,
            "oneSellerMsgCardComponent" : oneSellerMsgCard,
            "navClassifyComponent" : navClassify,
            "navSortComponent" : navSort,
            "navFilterComponent" : navFilter
        }
    }
</script>

<style lang="less" scoped>
    * { touch-action: pan-y; }
    @import "../../assets/less/food/food";
    /* 切换nav tab栏的过渡 */
    .fade-enter,.fade-leave-to{
        height: 0;
        opacity: 0;
    }
    .fade-enter-active,.fade-leave-active{
        transition : all .2s ;
    }
    /* 遮罩 蒙层 */
    .opcityMaskLayer-enter,.opcityMaskLayer-leave-to{
        opacity: 0;
    }
    .opcityMaskLayer-enter-active,.opcityMaskLayer-leave-active{
        transition : all .5s ;
    }
</style>
