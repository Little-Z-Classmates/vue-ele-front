<template>
    <div class="goods">
        <aside class="left-aside" ref="leftAside">
            <ul>
                <li v-for="(item,index) in shopGoodsMenu"
                    :key="item.id"
                    @tap="toggleLeftIndexAndMoveRight(index)"
                    :class="index == currentLeftMenuIndex ? 'active':''">
                    {{item.name}}
                </li>
            </ul>
        </aside>
        <section class="goods-list" ref="goodsList">
            <div class="goods-list-inside">
                <div class="goods-group" v-for="value in shopGoodsMenu">
                    <div class="goods-title" >
                        <span>{{value.name}}</span>&nbsp;{{value.description}}
                        <i @tap="value.goodsTitleFlag = !value.goodsTitleFlag" class="tooltip">. . .
                        <transition name="fadeInOut">
                                <i v-if="value.goodsTitleFlag" class="tooltiptext">{{value.description}}</i>
                        </transition>
                        </i>
                    </div>
                    <div class="every-goods" v-for="sonVal in value.foods" >
                        <div v-if="judgeNewOrSign(sonVal.attributes,'新')" class="triangle-topright">
                            <div class="word">新品</div>
                        </div>
                        <span v-if="judgeNewOrSign(sonVal.attributes,'招牌')" class="sign">招牌</span>
                        <div class="goodsImg">
                            <img :src="baseImgUrl+sonVal.image_path" alt="">
                        </div>
                        <div class="content">
                            <div class="title">{{sonVal.name}}</div>
                            <div class="detailed">{{sonVal.description}}</div>
                            <div class="salesInfo">月售{{sonVal.month_sales}}份 好评率{{sonVal.satisfy_rate}}%</div>
                            <span :style="sonVal.activity?{'visibility': 'visible'}:{'visibility': 'hidden'}" class="preferentialInfo">&nbsp;{{sonVal.activity?sonVal.activity.image_text:''}}&nbsp;</span>
                            <div class="priceAndBuyStyle">
                                <span>￥20</span>
                                <span>&nbsp;起</span>
                                <div v-if="!sonVal.specifications.length" class="counter">
                                    <span class="jian">－</span>
                                    <span class="num">1</span>
                                    <span class="jia">+</span>
                                </div>
                                <el-button  v-if="sonVal.specifications.length" class="buyStyle" size="mini" type="primary"><span>选规格</span></el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import BScroll from 'better-scroll'
    import { baseImgUrl } from "../../../config/env"
    import { getShopGoodsMenu } from "../../../service/getData"

    export default {
        data(){
           return {
               baseImgUrl,                     // 图片基础路径
               shopGoodsMenu : [],             // 商店商品菜单
               currentLeftMenuIndex : 0 ,         // 当前左边菜单选中的index
               goodsTitleFlag: false,          // 标识符: 控制 tooltiptext 那三个点的 显示与关闭
           }
        },
        methods:{
            getShopGoodsMenu,
            // 判断 是否 商品 是否为 新品或者 招牌
            judgeNewOrSign( arr,flagStr ){
                return  arr.find( item =>{
                    var flag = item.icon_name.indexOf(flagStr) == -1 ?false:true
                    return flag
                } )
            },
            // 滑动限制
            stop(){
                var mo=function(e){ e.preventDefault(); };
                document.body.style.overflow='hidden';
                document.addEventListener( "touchmove",mo,false );//禁止页面滑动
            },
            // 点击菜单 切换 当前的 选中的index, 右边滚动到 相应的位置
            toggleLeftIndexAndMoveRight( index ){
                this.currentLeftMenuIndex = index
                var moveDistance = 0
                if ( index != 0 ){
                    for( let i = index-1 ; i > -1 ; i-- ){
                        var oneDistance = (this.shopGoodsMenu[ i ].foods.length * this.currentHeight.rightEveryGoods()) + this.currentHeight.rightGoodsTitle()
                        moveDistance +=oneDistance
                    }
                    moveDistance = - moveDistance
                }
                if ( Math.abs( moveDistance ) + this.currentHeight.rightGoodsList () > this.currentHeight.rightAllGoods() ){
                    moveDistance = - (this.currentHeight.rightAllGoods() - this.currentHeight.rightGoodsList ())
                }
                this.goodsListScroll.scrollTo(0,moveDistance,1000,)
            },
        },
        computed:{
            // 当前店铺的 Id
            shopId (){
                return this.$route.params.shopid
            },
            // better-scroll 对象1
            leftAsideScroll(){
                return new BScroll( this.$refs.leftAside ,{
                    tap:true
                })
            },
            // better-scroll 对象2
            goodsListScroll(){
                return new BScroll( this.$refs.goodsList ,{
                    tap:true,
                    probeType:2
                })
            },
            // 计算得到一个数组
            LeftMenuHeightStageArr(){
                var  arr = [0]
                var  num = 0
                this.shopGoodsMenu.forEach( item =>{
                    var heightNumber = item.foods.length * this.currentHeight.rightEveryGoods() + this.currentHeight.rightGoodsTitle()
                    num += heightNumber
                    arr.push( num )
                })
                return arr
            }
        },
        created(){
            this.stop()
            if (this.shopId){
                this.getShopGoodsMenu(this,this.shopId).then( result =>{
                    if ( result.status == 200){
                        var arr = result.body
                        arr.forEach( item =>{
                            item.goodsTitleFlag = false
                        })
                        this.shopGoodsMenu = arr
                    }
                })
            }
        },
        mounted(){
            this.$nextTick( function () {
                this.leftAsideScroll
                this.goodsListScroll
                // 当前 方法中需要的 DOM 元素高度
                this.currentHeight = {
                    // 当前右边 一个商品的高度 ( 单位:rem 转为 px )
                    rightEveryGoods(){
                        var everyGoods =  document.querySelector('.every-goods')
                        return parseFloat( window.getComputedStyle( everyGoods ).height)
                    } ,
                    // 当前右边 商品菜单title高度 ( 单位:rem 转为 px )
                    rightGoodsTitle(){
                        var goodsTitle =  document.querySelector('.goods-title')
                        return parseFloat(window.getComputedStyle( goodsTitle ).height)
                    },
                    // goods-list 的高度
                    rightGoodsList(){
                        var goodsList = document.querySelector('.goods-list')
                        return parseFloat(window.getComputedStyle( goodsList ).height)
                    },
                    // 右边所有商品的高度
                    rightAllGoods(){
                        var allGoods = document.querySelector('.goods-list-inside')
                        return parseFloat(window.getComputedStyle( allGoods ).height)
                    }
                }
                // 滚动事件, 右边滚动, 对应左右的 选中 active class
                this.goodsListScroll.on('scroll',( pos )=>{
                    var scrollY = -pos.y
                    var arr = this.LeftMenuHeightStageArr
                    var key = arr.findIndex( item =>{ return item > scrollY })- 1
                    key<0 ? this.currentLeftMenuIndex = 0 : this.currentLeftMenuIndex = key
                })
            })
        },
        beforeDestroy(){
            this.leftAsideScroll.destroy()
            this.goodsListScroll.destroy()
        }
    }
</script>

<style lang="less" scoped>
* {
        touch-action: pan-y;
    }
@import "../../../assets/less/shop/children/goods";

// 工具提示 tooltip
.tooltip {
    position: relative;
    display: inline-block;
    .tooltiptext {
        background-color: black;
        color: #fff;
        text-align: center;
        border-radius: .06rem;
        padding: .05rem .1rem;
        position: absolute;
        z-index: 1;
        line-height: .14rem;
        top: .39rem;
        left: -1.04rem;
        width: 1.3rem;
        text-overflow: ellipsis;
        display: inline-block;
        &::after {
            content: "";
            position: absolute;
            top: -.12rem;
            right: .1rem;
            border: .07rem solid transparent;
            border-bottom-color: black;
        }
    }
}

// 三角形文字
.triangle-topright {
    width: 0;
    height: 0;
    float: right;
    font-size: xx-small;
    border-top: .4rem solid #00b570;
    border-right: .4rem solid transparent;
    position: absolute;
    z-index: 2;
    .word {
        text-align: center;
        margin: auto;
        position: absolute;
        display: inline-block;
        width: .45rem;
        top: -0.37rem;
        left: -0.03rem;
        color: #FFF;
        transform-origin: bottom center;
        transform: rotate(-45deg);
        font-size: .12rem;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
}

</style>