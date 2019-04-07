<template>
    <div id="shop" :style="shopInfo.activities.length?{'padding-top': '1.8rem'}:''">
        <svg class="icon goback" @click="goback" aria-hidden="true"><use xlink:href="#icon-xiangyou-copy"></use></svg>
        <transition name="leftRight" mode="in-out">
            <router-view></router-view>
        </transition>
        <transition name="el-fade-in-linear">
             <section class="activityMask" v-if="activityMaskFlag" >
                  <div class="title">{{shopInfo.name}}</div>
                  <div class="preferential_title"><span>优惠信息</span></div>
                  <div class="preferential_info">
                      <div v-for="item in shopInfo.activities" :key="item.id"><span :style="'background-color:#'+ item.icon_color">{{item.icon_name}}</span> {{item.name}} : {{item.description}}</div>
                  </div>
                  <div class="promotion_title"><span>商家公告</span></div>
                  <div class="promotion_info">{{shopInfo.description}}</div>
                  <svg class="icon guanbi" @click="activityMaskFlag = false" aria-hidden="true"><use xlink:href="#icon-guanbi"></use></svg>
             </section>
        </transition>
        <section id="fixedTop">
            <div class="filterImg" :style="'background:url('+baseImgUrl+shopInfo.image_path+') no-repeat 0 0 / cover #000;'">
                <header id="header">
                    <div class="left">
                        <img :src="baseImgUrl+shopInfo.image_path" alt="" class="logo">
                    </div>
                    <div class="title">
                        <h2>{{shopInfo.name}}</h2>
                        <p>{{shopInfo.delivery_mode?shopInfo.delivery_mode.text+'/':''}}分钟送达{{shopInfo.piecewise_agent_fee?'/'+shopInfo.piecewise_agent_fee.tips:''}}</p>
                        <p>公告：{{shopInfo.promotion_info}}</p>
                    </div>
                    <div class="right">
                        <router-link tag="svg" :to="'/shop/shopDetail/'+$route.params.shopid" class="icon toinfo"aria-hidden="true"><use xlink:href="#icon-mjiantou-copy-copy"></use></router-link>
                    </div>
                </header>
                <section v-if="shopInfo.activities.length" id="center" @click="activityMaskFlag = true">
                    <i>{{shopInfo.activities[0].icon_name}}</i>
                    <span class="centerInfo">&nbsp;&nbsp;{{shopInfo.activities[0].description}}</span>
                    <span>{{shopInfo.activities.length}}个活动&nbsp;<svg class="icon "aria-hidden="true"><use xlink:href="#icon-mjiantou-copy-copy"></use></svg></span>
                </section>
            </div>
            <nav id="nav">
                <span class="left-nav active">商品</span>
                <span class="right-nav">评价</span>
            </nav>
        </section>
        <main id="main">
            <transition name="el-fade-in-linear">
                <keep-alive>
                    <component :is="currentMain"
                               @getShoppingCar="getShoppingCar"
                               :changeFoodsNum="changeFoodsNum"
                               :clearShopCarFlag="clearShopCarFlag">
                    </component>
                </keep-alive>
            </transition>
        </main>
        <footer id="footer" @click="thisShoppingCarFlag = !thisShoppingCarFlag">
             <div :class="['shop-car',thisShoppingCar.foodsInfoArr.length?'':'huise',shoppingCarAnimateFlag?'animated ':'',shoppingCarAnimateFlag?'heartBeat ':'']" v-if="thisShoppingCar">
                 <svg class="icon blue-car" aria-hidden="true">
                     <use :xlink:href="thisShoppingCar.foodsInfoArr.length?'#icon-chat-blue':'#icon-chat-blue-copy'"></use>
                 </svg>
                 <span v-if="thisShoppingCar.foodsInfoArr.length">{{thisShoppingCar.allNum}}</span>
             </div>
             <div class="money">
                 <div :class="{'allMoney': true ,'gray-color': !thisShoppingCar.foodsInfoArr.length}">{{ !thisShoppingCar.foodsInfoArr.length ? '还未选购商品': '￥'+thisShoppingCar.allPrice }}</div>
                 <div class="deliverMoney gray-color">配送费 ￥{{shopInfo.float_delivery_fee}}</div>
             </div>
            <el-button  :class="{'getMoney':true, 'noYet' :  thisShoppingCar.noYetFlag }" type="success">
                <span v-if="thisShoppingCar.gapPrice <= 0 && thisShoppingCar.times != 0 ">结算</span>
                <span class="gray-color" v-if="thisShoppingCar.gapPrice > 0">还差￥{{ thisShoppingCar.gapPrice }}起送</span>
            </el-button>
        </footer>
        <transition name="el-zoom-in-bottom">
            <section class="thisShopPingCar" v-show="thisShoppingCarFlag">
                <div class="title">
                    已选商品
                    <div @click="clearShopCar">
                        <svg class="icon" aria-hidden="true" ><use xlink:href="#icon-huishouzhan"></use></svg>
                        清空
                    </div>
                </div>
                <div ref="shoppingCarOuter" :style="thisShoppingCarScrollFlag? 'height:2.4rem' : ''">
                    <ul>
                       <li v-for="(shoppingCarItem,keyIndex) in thisShoppingCar.foodsInfoArr" :key="keyIndex">
                                <div class="foods-name">
                                    <span>{{shoppingCarItem.foodsName}}</span>
                                    <div v-if="shoppingCarItem.specs" >{{ guige(shoppingCarItem.specs) }}</div>
                                </div>
                                <div class="single-food-all-price">
                                    ￥{{shoppingCarItem.thisFoodAllPrice}}
                                </div>
                                <div class="inputNumber ">
                                    <span class="inputNumber-jian" @tap="subtractGoodsNum(shoppingCarItem)">－</span>
                                    <span class="inputNumber-num" >{{shoppingCarItem.buyNum}}</span>
                                    <span class="inputNumber-jia" @tap="addGoodsNum(shoppingCarItem)">+</span>
                                </div>
                            </li>
                    </ul>
                </div>
                <div class="all-packing_fee">
                    打包费
                    <div class="single-food-all-price">
                        ￥{{thisShoppingCar.allPackage_fee}}
                    </div>
                </div>
            </section>
        </transition>
        <transition name="el-fade-in-linear">
            <section class="main-mask-layer"  v-if="thisShoppingCarFlag" @click="thisShoppingCarFlag = false"></section>
        </transition>
    </div>
</template>

<script>
    import { getShopInformation } from "../../service/getData"
    import { baseImgUrl } from "../../config/env"
    import goods from "./children/goods"
    import {deepCopy} from "../../config/jsTools"
    import BScroll from 'better-scroll'

    export default {
        data(){
          return {
              baseImgUrl,
              shopInfo : { activities:[] },  // 商铺详细信息
              currentMain:'goods',           // 当前显示的 main
              activityMaskFlag : false,     // 点击活动 的 蒙层 标识符
              thisShoppingCarFlag: false,   // 商店购物车标识符 加 蒙层标识符
              thisShoppingCar: {            // 这个店的购物车
                  allNum : 0,
                  foodsInfoArr:[],
                  allPrice: 0,
                  allPackage_fee:0,
                  gapPrice:0,
                  times:0,
                  noYetFlag:true,
                  specsInfo:''
              },
              shoppingCarAnimateFlag : false,          // 购物车动画标识符
              thisShoppingCarScrollFlag : false,       // 滚动标识符
              changeFoodsNum:{                         // 传入 goods.vue 的数据
                  foodsId:null,
                  foodsMenuIndex:null,
                  foodsIndex:null,
                  status: 'false',                   // 状态false 为 减 , true 为 加
              },
              clearShopCarFlag : true                 // 清空标识符每次清空都修改它,goods监听
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
            goback(){
                this.$router.push({ path: '/msite' })
            },
            // 深拷贝
            deepCopy,
            // 此方法 去 goods.vue 拿到 购物车 信息
            getShoppingCar(shoppingCarInfo){
                var thisObj = deepCopy(shoppingCarInfo)
                var oldNum = this.thisShoppingCar.allNum
                this.thisShoppingCar = thisObj
                this.countPrice()
                var newNum = this.thisShoppingCar.allNum
                if ( oldNum < newNum ){
                    this.shoppingCarAnimateFlag = true
                    setTimeout( ()=>{
                        this.shoppingCarAnimateFlag = false
                    },400)
                }
            },
            // 此方法计算 每个食物的 总价, 打包价格总价 , 全部食物 + 打包价格
            countPrice(){
                this.thisShoppingCar.allPrice = 0
                this.thisShoppingCar.allPackage_fee = 0
                this.thisShoppingCar.foodsInfoArr.forEach( item =>{
                    item.thisFoodAllPrice = item.buyNum * parseFloat(item.onePrice)
                    this.thisShoppingCar.allPackage_fee +=  item.buyNum * parseFloat(item.packing_fee)
                    this.thisShoppingCar.allPrice += item.buyNum * parseFloat(item.onePrice)
                })
                this.thisShoppingCar.allPrice += this.thisShoppingCar.allPackage_fee
                this.thisShoppingCar.gapPrice = this.shopInfo.float_minimum_order_amount - this.thisShoppingCar.allPrice
                if ( this.thisShoppingCar.gapPrice <= 0 ) {
                    this.thisShoppingCar.noYetFlag = false
                }else{
                    this.thisShoppingCar.noYetFlag = true
                }
                // 判断种类个数 ,多余5个开启滚动,设置高度 60 * n
                if( this.thisShoppingCar.foodsInfoArr.length > 4 ){
                    this.thisShoppingCarScrollFlag = true
                }else{
                    this.thisShoppingCarScrollFlag = false
                }
            },
            // 得到规格,并且拼接
            guige(item){
                var  str = ''
                item.forEach( (values,key) =>{
                    if ( key == 0 ){
                        str += values.value
                    }else{
                        str += '\\'+ values.value
                    }
                })
                return str
            },
            // 点击 - 号 , 减少相应的数量
            subtractGoodsNum(shoppingCarItem){
                this.changeFoodsNum = {
                    foodsId : shoppingCarItem.foodsId,
                    foodsMenuIndex : shoppingCarItem.foodsMenuIndex,
                    foodsIndex : shoppingCarItem.foodsIndex,
                    status : 'false',  // 状态false 为 减 , true 为 加
                }
                shoppingCarItem.buyNum--
                this.thisShoppingCar.allNum--
                if ( !shoppingCarItem.buyNum ){
                    var index =  this.thisShoppingCar.foodsInfoArr.findIndex( item =>{
                        return ( item.foodsId == shoppingCarItem.foodsId )
                     })
                    this.thisShoppingCar.foodsInfoArr.splice(index,1)
                }
                this.countPrice()
                this.shoppingCarScroll.refresh()
            },
            // 点击 + 号 , 减少相应的数量
            addGoodsNum(shoppingCarItem){
                console.log ( shoppingCarItem )
                this.changeFoodsNum = {
                    foodsId : shoppingCarItem.foodsId,
                    foodsMenuIndex : shoppingCarItem.foodsMenuIndex,
                    foodsIndex : shoppingCarItem.foodsIndex,
                    status : 'true'  // 状态false 为 减 , true 为 加
                }
                shoppingCarItem.buyNum++
                this.thisShoppingCar.allNum++
                this.countPrice()
                this.shoppingCarScroll.refresh()
            },
            // 清空购物车
            clearShopCar(){
                this.thisShoppingCar = {            // 这个店的购物车
                    allNum : 0,
                    foodsInfoArr:[],
                    allPrice: 0,
                    allPackage_fee:0,
                    gapPrice:0,
                    times:0,
                    noYetFlag:true,
                    specsInfo:''
                }
                this.countPrice()
                this.clearShopCarFlag = !this.clearShopCarFlag
            }
        },
        computed:{
            // 当前店铺的 Id
            shopId (){
                return this.$route.params.shopid
            },
            // 购物车的滚动
            shoppingCarScroll(){
              return new BScroll( this.$refs.shoppingCarOuter ,{
                  tap:true
              })
            }
        },
        watch:{
            // 滚动挂载
            thisShoppingCarFlag(newValue){
                if( newValue ){
                    this.$nextTick(function () {
                        this.shoppingCarScroll
                        this.shoppingCarScroll.refresh()
                    })
                }
            }
        },
        created(){
            this.getVuexGeoHash()
            if ( !this.$store.getters.getGeoHash ){
                return false
            }
            this.getShopInformation(this,this.shopId).then( result =>{
                if ( result.status == 200 ){
                    this.$store.commit('setCurrentVisitShopInfoToSS',result.body)
                    if ( !result.body ){
                        this.$router.push({path:'/msite'})
                    }else if ( result.body.message ){
                        this.$router.push({path:'/msite'})
                    }else{
                        this.shopInfo = result.body
                        this.thisShoppingCar.gapPrice = this.shopInfo.float_minimum_order_amount
                        this.thisShoppingCar.times++
                    }
                }
            })
        },
        mounted(){
            this.$nextTick(function (  ) {
                // 当前 方法中需要的 DOM 元素
                this.currentDOM = {
                    htmlWidth(){
                        return parseFloat( window.getComputedStyle( document.querySelector('html') ).width)
                    }
                }
            })
        },
        components:{
            goods,
        }
    }
</script>

<style  lang="less"  scoped>
@import "../../assets/less/shop/shop";

* {
  touch-action: pan-y;
}

.leftRight-enter,.leftRight-leave-to{
    opacity: 0;
    transform: translateX(100vw);
}

.leftRight-enter-active, .leftRight-leave-active{
    transition: all .5s;
}

</style>