<template>
    <section class="centerCard">
        <div class="title">食品监督安全公示 <span @tap="goSafe" v-if="flagDetailed" >企业认证详情 ></span></div>
        <div class="centerInfo">
            <div class="leftInfo">
                <svg class="icon" aria-hidden="true">
                    <use :xlink:href="shopDetailInfo.status?'#icon-smile':'#icon-kulian2'"></use>
                </svg>
            </div>
            <div class="rightInfo">
                <p class="checkStatus">监督检查结果 : <span>{{shopDetailInfo.status?'良':'差'}}</span></p>
                <p>检查日期 : <span>{{shopDetailInfo.order_lead_time}}</span></p>
            </div>
        </div>
    </section>
</template>

<script>
    // :to="'/shop/shopDetail/shopSafe/+ shopId"
    export default {
        data(){
           return {
           }
        },
        methods:{
            goSafe(){
                if (this.shopId){
                    this.$router.push({ path : `/shop/shopDetail/shopSafe/${this.shopId}`})
                }
            }
        },
        props:['shopDetailInfo','flagDetailed','shopId']
    }
</script>

<style lang="less" scoped>
    @mainColor: #3190E8;
    @bgcColor: #fff;
    @borderColor: #ccc;
    @fontColor: #787878;
    .centerCard{
        margin-top: .1rem;
        overflow: hidden;
        height: 1.35rem;
        background-color: #fff;
        .title{
            padding: 0 .1rem;
            font-size: .19rem;
            line-height: .45rem;
            height: .45rem;
            border-bottom: .01rem solid @borderColor;
            span{
                float: right;
                font-size: .16rem;
                color: #ccc;
            }
        }
        .centerInfo{
            height: .9rem;
            .leftInfo{
                padding: .1rem;
                float: left;
                height: 100%;
                .icon{
                    width: .45rem;
                    height: .45rem;
                }
            }
            .rightInfo{
                padding: .1rem 0 ;
                height: 100%;
                display: flex;
                justify-content: space-around;
                flex-direction: column;
            }
        }
    }
</style>