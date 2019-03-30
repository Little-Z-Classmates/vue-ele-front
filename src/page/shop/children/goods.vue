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
                                <span>￥{{sonVal.specfoods[0].price}}</span>
                                <span>&nbsp;起</span>
                                <div v-if="!sonVal.specifications.length" class="counter">
                                    <transition name="toLeftJian">
                                        <span class="jian" @tap="reduceFoods(sonVal)" v-if="sonVal.addAndReduceFlag">－</span>
                                    </transition>
                                    <transition name="toLeftNum">
                                        <span class="num"  v-if="sonVal.addAndReduceFlag">{{ sonVal.specfoods[0].currentBuyNum}}</span>
                                    </transition>
                                    <span class="jia" @tap="addFoods(sonVal)">+</span>
                                </div>
                                <el-button  v-if="sonVal.specifications.length"  class="buyStyle" size="mini" type="primary" @tap.native="showSpecifications(sonVal)"><span>选规格</span></el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <transition name="el-fade-in-linear">
            <section class="mask-layer" v-if="specificationsFlag" @click="specificationsFlag = false"></section>
        </transition>
        <transition name="el-zoom-in-bottom">
            <section class="specifications" v-if="specificationsFlag">
                <i class="el-icon-close" @click="specificationsFlag = false"></i>
                <div class="foods-header-info">
                    <div class="left-info">
                        <img :src="currentSpecificationInfo.image_path" alt="">
                    </div>
                    <div class="right-info">
                        <div class="foods-style-name">{{currentSpecificationInfo.name}}</div>
                        <div v-if="FoodStyleSelectStrAndMoney" class="all-foods-style">已选: {{FoodStyleSelectStrAndMoney.selectStr}}</div>
                        <div v-if="FoodStyleSelectStrAndMoney" class="price">￥{{FoodStyleSelectStrAndMoney.money}}</div>
                    </div>
                </div>
                <div class="foods-style-info">
                    <div v-if="currentSpecificationInfo" v-for="(item,key) in currentSpecificationInfo.specifications" :key="key">
                        <div class="title">{{item.name}}</div>
                        <ul>
                            <li  v-for="(value,index) in item.values" :key="index" @click="toggleFoodStyle(item,index)" :class="index==item.currentActiveClassIndex?'active':''">{{value.specs_name}}</li>
                        </ul>
                    </div>
                </div>
                <el-button type="primary"  class="primary-btn"><span>选好了</span></el-button>
            </section>
        </transition>
    </div>
</template>

<script>
    import BScroll from 'better-scroll'
    import { baseImgUrl } from "../../../config/env"
    import { getShopGoodsMenu } from "../../../service/getData"
    import {deepCopy} from "../../../config/jsTools"

    export default {
        data(){
           return {
               baseImgUrl,                    // 图片基础路径
               shopGoodsMenu : [],            // 商店商品菜单
               currentLeftMenuIndex : 0 ,     // 当前左边菜单选中的index
               goodsTitleFlag: false,         // 标识符: 控制 tooltiptext 那三个点的 显示与关闭
               specificationsFlag:false,      // 标识符: 控制 点击规格的 页面出现
               currentSpecificationInfo:{},   // 当前的规格卡信息
               FoodStyleSelectStrAndMoney:{}, //规格卡里面的 '已选',金钱额度
           }
        },
        methods:{
            getShopGoodsMenu,
            // 深拷贝
            deepCopy,
            // 库存警告弹窗, 参数1 是库存数量, 参数二是 有无规格选择, true/false
            warning(num,isMore){
                if ( !isMore ){
                    this.$message({
                        center: true,
                        message: `库存只有${num}件,亲请另外选择商品哦`,
                        type: 'warning'
                    })
                }else{

                }
            },
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
            // 点击 + , 添加货物
            addFoods(foods){
                if( foods.specfoods[0].currentBuyNum == 0 ){
                    foods.addAndReduceFlag = true
                }
                if (  foods.specfoods[0].currentBuyNum < foods.specfoods[0].stock ){
                      foods.specfoods[0].currentBuyNum++
                }else{
                  this.warning(foods.specfoods[0].currentBuyNum,false)
                }
            },
            // 点击 - , 添加货物
            reduceFoods(foods){
                foods.specfoods[0].currentBuyNum--
                if( foods.specfoods[0].currentBuyNum == 0 ){
                    foods.addAndReduceFlag = false
                }
            },
            // 计算 规格卡里面的 '已选',金钱额度
            countFoodStyleSelectStrAndMoney( specifications ){
                let Obj = {
                    selectStr: '',
                    money:0
                }
                specifications.forEach( (item,key) =>{
                    var index = item.currentActiveClassIndex
                    if ( key != 0 ){
                        Obj.selectStr += '/'+ item.values[index].specs_name
                    }else{
                        Obj.selectStr += item.values[index].specs_name
                    }
                    Obj.money += parseFloat(item.values[index].price)
                })
                this.FoodStyleSelectStrAndMoney = Obj
            },
            // 点击规格 显示方法,传入信息
            showSpecifications(sonVal){
                this.currentSpecificationInfo ={
                    image_path : this.baseImgUrl+sonVal.image_path,
                    name : sonVal.name,
                    specifications : sonVal.specifications
                }
                //计算 规格卡里面的 '已选',金钱额度
                this.countFoodStyleSelectStrAndMoney(sonVal.specifications)
                // 蒙层显示
                this.specificationsFlag = true;
            },
            // 点击 规格卡里面的 样式类型, 切换类 和 信息
            toggleFoodStyle(item,index){
                item.currentActiveClassIndex = index
                this.countFoodStyleSelectStrAndMoney(this.currentSpecificationInfo.specifications)
            }
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
            },
        },
        created(){
            this.stop()
            if (this.shopId){
                this.getShopGoodsMenu( this,this.shopId ).then( result =>{
                    if ( result.status == 200){
                        var arr = result.body
                        arr.forEach( item =>{
                            item.goodsTitleFlag = false
                            item.foods.forEach( sonItem => {
                                //---------------------对食物样式类型筛选过滤---------------
                                let specificationStyle = [] // 几种规格样式
                                sonItem.specifications.forEach( sonSpeItem =>{
                                    let everyStyleTitleName = sonSpeItem.name  // 每种食物种类每个样式名
                                    let everyStyleValueArr = []         // 数组
                                    sonSpeItem.values.forEach( sonSpeValue => {
                                        let everyStyleFoodName = sonSpeValue   // 每种食物种类每个样式名
                                        let everyStyleFoodIndex = sonItem.specfoods.findIndex( speValue =>{  // 由于数据是数组没分类,需要我们给每个食物种类的样式做筛选
                                            if( speValue.specs[0].name == everyStyleTitleName && speValue.specs_name == everyStyleFoodName  ){
                                                return true
                                            }
                                        })
                                        everyStyleValueArr.push( sonItem.specfoods[everyStyleFoodIndex] )
                                    })
                                    sonSpeItem.values = everyStyleValueArr
                                    sonSpeItem.currentActiveClassIndex = 0
                                    specificationStyle.push(sonSpeItem)
                                })
                                sonItem.specifications = specificationStyle
                                //------------------------------------
                                sonItem.addAndReduceFlag = false
                                sonItem.specfoods.forEach( sonSonItem =>{
                                    sonSonItem.currentBuyNum = 0
                                })
                            })
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