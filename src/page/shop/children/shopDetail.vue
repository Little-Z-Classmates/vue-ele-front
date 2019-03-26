<template>
    <div id="shopDetail">
        <myHeader :sellerName="'商家详情'"></myHeader>
        <section class="topCard">
            <div class="title">活动与属性</div>

        </section>
        <section class="centerCard">
            <div class="title">食品监督安全公示 <span>企业认证详情 ></span></div>
            <div class="centerInfo">
                <div class="left"></div>
                <div class="right">
                    <div class="checkStatus"></div>
                    <p>监督检查结果 : <span></span></p>
                    <p>检查日期 : <span></span></p>
                </div>
            </div>
        </section>
        <section class="bottomCard">
            <div class="title">商家信息</div>
            <p>名字</p>
            <p>地址 : </p>
            <p>营业时间 : [ 06:30 / 09:00 ]</p>
            <p>营业执照</p>

        </section>
    </div>
</template>

<script>
    import myHeader  from "../../../components/header/header"
    import { getShopInformation } from "../../../service/getData"

    export default {
        data(){
           return {
           }
        },
        methods:{
            getShopInformation
        },
        components:{
            myHeader
        }
    }
</script>

<style lang="less" scoped>
@import "../../../assets/less/shop/children/shopDetail";

</style>