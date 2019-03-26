<template>
    <div>
        <router-link :to="'/shop/'+item.id+'/'+geohash" tag="div" v-for="item in restaurantsListInfo " :key="new Date().getTime()*Math.random()*Math.random()" class="sellers" >
            <div class="seller">
                <img class="sellerHeadImg" :src=" baseImgUrl + item.image_path">
                <div class="leftInfo">
                    <div class="top">
                        <span class="brand">品牌</span>
                        <span class="sellerName">{{ item.name }}</span>
                    </div>
                    <div class="content">
                        <div class="start">
                            <svg class="icon footerNavImg" v-for="(start,index) in item.startArr" :key="index" aria-hidden="true">
                                <use  :xlink:href="start? '#icon-xingxing1':'#icon-xing-copy'"></use>
                            </svg>
                        </div>
                        <div class="scoreAndMonthSell">
                            <span class="score">{{ item.rating }}</span>
                            <span class="monthSell">月售{{ item.recent_order_num }}单</span>
                        </div>
                    </div>
                    <div class="bottom">
                        <span>￥{{ item.float_minimum_order_amount }}起送 / {{ item.piecewise_agent_fee.tips }}</span>
                    </div>
                </div>
                <div class="rightInfo">
                    <div class="top">
                        <div class="words">
                            <span v-for="supportsVal in item.supports" :key="supportsVal.id">{{ supportsVal.icon_name }}</span>
                        </div>
                    </div>
                    <div class="content">
                        <span>准时送</span>
                        <span>蜂鸟专送</span>
                    </div>
                    <div class="bottom">
                        <span>{{ item.order_lead_time }}</span><span>{{ item.distance }}/</span>
                    </div>
                </div>
            </div>
        </router-link>
    </div>
</template>

<script>
    import { imgBaseUrl } from "../../config/env.js"
    import { baseImgUrl } from "../../config/env.js"
    export default {
        data(){
            return{
                imgBaseUrl,
                baseImgUrl
            }
        },
        props:[ 'restaurantsListInfo','geohash']
    }
</script>

<style lang="less" scoped>
    @mainColor: #3190E8;
    @bgcColor: #fff;
    @borderColor: #ccc;
    @fontColor: #787878;
    .sellers {
        .seller {
            overflow: hidden;
            position: relative;
            height: 1rem;
            border-bottom: 0.01rem solid @borderColor;
            padding: .15rem .05rem;
            .sellerHeadImg {
                width: .6rem;
                height: .6rem;
                background-color: indianred;
                margin-right: .1rem;
                float: left;
            }
            .leftInfo {
                width: 1.45rem;
                height: 100%;
                float: left;
                display: flex;
                justify-content: space-between;
                flex-direction: column;
                .top {
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    width: 100%;
                    .brand {
                        background-color: orange;
                        font-size: .14rem;
                        margin-right: .1rem;
                    }
                    .sellerName {
                        font-size: .17rem;
                        font-weight: 600;
                    }
                }
                .content {
                    font-size: .12rem;
                    height: .24rem;
                    .orange{
                        background-color: orange;
                    }
                    .start {
                        float: left;
                        line-height: .24rem;
                        svg{
                            font-size: .12rem;
                            color: orange;
                            //background-color: orange;
                        }
                        >div{
                            color: orange;
                        }
                    }
                    .scoreAndMonthSell {
                        float: left;
                        transform: scale(.9);
                        .score {
                            color: orange;
                            margin-right: .05rem;
                        }
                    }
                }
                .bottom {
                    span {
                        color: @fontColor;
                        font-size: .12rem;
                    }
                }
            }
            .rightInfo {
                width: 1.45rem;
                display: flex;
                height: 100%;
                flex-direction: column;
                justify-content: space-between;
                float: right;
                .top {
                    .words {
                        float: right;
                        span {
                            display: inline-block;
                            transform: scale(.85);
                            color: @fontColor;
                            margin-right: 0.04rem;
                            border: 0.01rem solid @borderColor;
                        }
                    }
                }
                .content {
                    width: 112%;
                    transform: scale(.75);
                    font-size: .12rem;
                    span {
                        float: right;
                    }
                    :nth-child(1) {
                        border: .01rem solid @mainColor;
                        padding: 0 0.02rem;
                        border-radius: 0.02rem;
                        color: @mainColor;
                        margin-left: 0.04rem;
                    }
                    :nth-child(2) {
                        border: .01rem solid @mainColor;
                        background-color: @mainColor;
                        padding: 0 0.02rem;
                        border-radius: 0.02rem;
                        color: #fff;
                    }
                }
                .bottom {
                    width: 100%;
                    font-size: .12rem;
                    span {
                        color: @fontColor;
                        float: right;
                        & ~ span {
                            color: @mainColor;
                        }
                    }
                }
            }
        }
    }
</style>