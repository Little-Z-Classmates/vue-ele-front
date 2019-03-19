<template>
    <div id="food">
        <headerComponent :sellerName="$route.query.title"></headerComponent>
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
                                :navClassifyInfoList="navTabCurrentComponent === 'navClassifyComponent'? navClassifyInfoList : ''"
                                :is="navTabCurrentComponent"
                                v-if="navTabFlag" >
                        </component>
                    </keep-alive>
                </transition>
            </div>
        </nav>
        <div class="mainOut" >
            <main id="main">
                <!-- 蒙层 -->
                <oneSellerMsgCardComponent :restaurantsListInfo="currentShopList"></oneSellerMsgCardComponent>
                <transition name="opcityMaskLayer">
                    <section id="maskLayer" v-if="navTabFlag"></section>
                </transition>
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

    export default {
        data () {
            return {
                imgBaseUrl,
                navTabFlag : true,   // 在一个 nav tab 栏 切换时候, 隐藏和显示
                navTabCurrentComponent : "navClassifyComponent", // 当前的 tab栏组件
                navClassifyInfoList : [],
                currentShopList : []   // 当前的商铺列表
            }
        },
        computed : {
            navTitles () {
                return [ { titleName : this.navFirstTitle, navTabComponentName : "navClassifyComponent" },
                         { titleName : "排序", navTabComponentName : "navSortComponent" },
                         { titleName : "筛选", navTabComponentName : "navFilterComponent" } ]
            },
            navFirstTitle ( )  {     // 第一个 nav tab 栏的名字
               return ( this.$route.query.title )
            }
        },
        methods : {
            getAllSellerClassify,
            getRestaurants,

            // 切换 nav tab栏
            toggleNavTab( navTabComponentName ){
                // 1. 判断是否是同一个 tab栏切换
                if( this.navTabCurrentComponent === navTabComponentName ){
                    // 禁止滚动判断
                    if( !this.navTabFlag ){
                        this.stop()
                    }else{
                        this.move()
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
                var mo=function(e){e.preventDefault();};
                document.body.style.overflow='hidden';
                document.addEventListener("touchmove",mo,false);//禁止页面滑动
            },
            // 取消滑动限制
            move(){
                var mo=function(e){e.preventDefault();};
                document.body.style.overflow='';//出现滚动条
                document.removeEventListener("touchmove",mo,false);
            }
        },
        created(){
            this.getAllSellerClassify( this ).then( results =>{
                if ( results.status === 200 ){
                    this.navClassifyInfoList = results.body
                }
            })
            // 根据id 得到商铺列表
            var geohash = ( this.$route.query.geohash ).split(',')
            var restaurant_category_id = this.$route.query.restaurant_category_id
            this.getRestaurants( this,geohash[0],geohash[1],0,restaurant_category_id ).then( result =>{
                if ( result.status === 200){
                    this.currentShopList = result.body
                }
            })
        },
        mounted () {

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
