<template>
    <div id="shopDetail">
        <myHeader :sellerName="'商家详情'" @goToBack="goToBack"></myHeader>
        <main ref="mainOut">
           <div class="mainInner">
               <section class="topCard">
                   <div class="title">活动与属性</div>
                   <div class="centerInfo">
                       <ul v-if="shopDetailInfo.attributes">
                           <li v-for="item in shopDetailInfo.attributes" :key="item._id"><span :style="'background-color:#'+item.icon_color">{{item.icon_name}}</span>&nbsp;&nbsp;{{item.description}}</li>
                       </ul>
                   </div>
               </section>
               <foodSupervise :shopDetailInfo="shopDetailInfo" :shopId="shopId" :flagDetailed="true"></foodSupervise>
               <section class="bottomCard">
                   <div class="title">商家信息</div>
                   <div class="shopMsgInfo">
                       <div class="shopName">名字(详细) : {{shopDetailInfo.description}} </div>
                       <div class="place">地址 : {{shopDetailInfo.address}}</div>
                       <div class="openCloseTime">营业时间 : [ {{shopDetailInfo.opening_hours[0]}} ]</div>
                       <div class="licence" @tap="toggleJobImg(shopDetailInfo.license.business_license_image)">营业执照 <span>></span></div>
                       <div class="fuwulicence" @tap="toggleJobImg(shopDetailInfo.license.catering_service_license_image)">餐饮服务许可证 <span>></span></div>
                   </div>
               </section>
           </div>
        </main>
        <transition name="fadeInAndOut">
            <section @click="toggleJobImg" class="dust-layer" v-if="flagImg"><img :src="currentImg" alt=""></section>
        </transition>
    </div>
</template>

<script>
    import myHeader  from "../../../components/header/header"
    import { getShopInformation } from "../../../service/getData"
    import BScroll from "better-scroll"
    import { baseImgUrl } from "../../../config/env"
    import foodSupervise from "./children/foodSupervise"

    export default {
        data(){
           return {
               shopDetailInfo : {},
               baseImgUrl,
               flagImg:false ,        // 点击图片出现隐藏的 标识符
               currentImg:'',         // 当前显示的图片
           }
        },
        computed:{
            shopId(){
              return this.$route.params.shopid
            },
            // 滚动
            scroll(){
                if( this.$refs.mainOut ){
                    return new BScroll( this.$refs.mainOut,{
                        tap:true
                    })
                }
            }
        },
        methods:{
            getShopInformation,
            // 根据 Vuex 得到经纬度
            getVuexGeoHash(){
                if ( this.$store.getters.getGeoHash ){
                    return this.$store.getters.getGeoHash
                }else{
                    this.$router.push({ path : '/home'})
                }
            },
            // 返回商家
            goToBack(){
                this.$router.push({ path : `/shop/${this.shopId}`})
            },
            // 显示对应的图片
            toggleJobImg(imgUrl){
                if(!this.flagImg){
                    this.flagImg = !this.flagImg
                    this.currentImg = this.baseImgUrl + imgUrl
                }else{
                    this.flagImg = !this.flagImg
                }
            }
        },
        created(){
            console.log("1111111111111111")
            // 判断有无经纬度, 没有 则跳转
            this.getVuexGeoHash()
            if ( !this.$store.getters.getGeoHash ){
                return false
            }
            // 判断当前访问路由的Id 是不是从商家页面跳过来的, 返回1, 则可以该页面可以访问, 返回0 打回到 msite 页面 选择商家
            if ( !parseInt(this.$store.getters.judgeShopDetailId(this.shopId)) ){
                this.$router.push( { path : '/msite' } )
                return false
            }
            // 从 vuex 中得到 shopDetailInfo
            this.shopDetailInfo = this.$store.getters.getShopDetailInfo
        },
        mounted(){
          this.$nextTick( ()=>{
              this.scroll
          })
        },
        beforeDestroy(){
            console.log("2222222222222222")
            this.scroll.destroy()
        },
        components:{
            myHeader,
            foodSupervise
        }
    }
</script>

<style lang="less" scoped>
@import "../../../assets/less/shop/children/shopDetail";

.fadeInAndOut-enter,.fadeInAndOut-leave-to{
    opacity: 0;
}

.fadeInAndOut-enter-active,.fadeInAndOut-leave-active{
      transition: all .5s;
}
</style>