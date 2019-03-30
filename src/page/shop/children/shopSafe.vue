<template>
    <div class="shopSafe">
        <myHeader :sellerName="'食品监督安全公示'" @goToBack="goToBack"></myHeader>
        <main class="mainOut" ref="mainOut">
            <section class="mainInner">
                <foodSupervise :shopDetailInfo="shopDetailInfo" :shopId="shopId" :flagDetailed="false"></foodSupervise>
                <div class="centerInfo">
                    <div class="title">工商登记信息</div>
                    <ul>
                        <li>企业名称</li>
                        <li>工商执照注册号</li>
                        <li>注册资本</li>
                        <li>注册地址</li>
                        <li>属地监管所</li>
                        <li>法定代表人</li>
                        <li>经营范围</li>
                    </ul>
                </div>
                <div class="centerInfo">
                    <div class="title">工商登记信息</div>
                    <ul>
                        <li>经营范围</li>
                        <li>许可证有效期</li>
                        <li>许可证号</li>
                        <li>发证时间</li>
                        <li>发证机关</li>
                    </ul>
                </div>
                <div class="centerInfo">
                    <div class="title">许可证书</div>
                    <ul>
                        <li class="okImg"><img src="" alt=""></li>
                        <li class="okImg"><img src="" alt=""></li>
                    </ul>
                </div>
            </section>
        </main>
    </div>
</template>

<script>
    import myHeader from "../../../components/header/header"
    import foodSupervise from "./children/foodSupervise"
    import BScroll from "better-scroll"

    export default {
        data () {
            return {
                shopDetailInfo:{}
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
            goToBack(){
                this.$router.push({ path : `/shop/shopDetail/${this.shopId}`})
            },
            // 根据 Vuex 得到经纬度
            getVuexGeoHash(){
                if ( this.$store.getters.getGeoHash ){
                    return this.$store.getters.getGeoHash
                }else{
                    this.$router.push({ path : '/home'})
                }
            },
        },
        created(){
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
            this.scroll.destroy()
        },
        components:{
            myHeader,
            foodSupervise
        }
    }
</script>

<style lang="less" scoped>
    @import "../../../assets/less/shop/children/shopSafe";
</style>