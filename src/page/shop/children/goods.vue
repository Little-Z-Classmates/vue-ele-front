<template>
    <div class="goods">
        <aside class="left-aside" ref="leftAside">
            <ul>
                <li v-for="(item,index) in shopGoodsMenu"
                    :key="item.id"
                    @tap="toggleLeftIndexAndMoveRight(index)"
                    :class="index == currentLeftMenuIndex ? 'active':''">
                    {{item.name}}
                    <span v-if="shopGoodsMenu[index].thisMenuSelectFoodsNum">{{shopGoodsMenu[index].thisMenuSelectFoodsNum}}</span>
                </li>
            </ul>
        </aside>
        <section class="goods-list" ref="goodsList">
            <div class="goods-list-inside">
                <div class="goods-group" v-for="(value,foodsMenuIndex) in shopGoodsMenu">
                    <div class="goods-title" >
                        <span>{{value.name}}</span>&nbsp;{{value.description}}
                        <i @tap="value.goodsTitleFlag = !value.goodsTitleFlag" class="tooltip">. . .
                        <transition name="fadeInOut">
                                <i v-if="value.goodsTitleFlag" class="tooltiptext">{{value.description}}</i>
                        </transition>
                        </i>
                    </div>
                    <div class="every-goods" @tap="showShopInfo(sonVal)" v-for="(sonVal,foodsIndex) in value.foods" >
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
                                <span v-if="sonVal.specifications.length">&nbsp;起</span>
                                <div v-if="!sonVal.specifications.length" class="counter">
                                    <transition name="toLeftJian">
                                        <span class="jian" @tap.stop ="reduceFoods(sonVal,foodsMenuIndex,foodsIndex)" v-if="sonVal.addAndReduceFlag">－</span>
                                    </transition>
                                    <transition name="toLeftNum">
                                        <span class="num"  v-if="sonVal.addAndReduceFlag">{{ sonVal.specfoods[0].currentBuyNum}}</span>
                                    </transition>
                                    <span class="jia" @tap.stop ="addFoods(sonVal,foodsMenuIndex,foodsIndex,$event)">+</span>
                                </div>
                                <el-button  v-if="sonVal.specifications.length && !sonVal.thisFoodsSelectNum"  class="buyStyle" size="mini" type="primary" @tap.native.stop ="showSpecifications(sonVal,foodsMenuIndex,foodsIndex)"><span>选规格</span></el-button>
                                <div v-if="sonVal.specifications.length && sonVal.thisFoodsSelectNum" class="counter">
                                    <span class="jian" :class="sonVal.thisFoodsSelectNum > 1?'gray':''" @tap.stop ="reduceFoods(sonVal,foodsMenuIndex,foodsIndex,sonVal.specfoods[0].food_id,sonVal.specifications[0].currentActiveClassIndex)">－</span>
                                    <span class="num">{{ sonVal.thisFoodsSelectNum}}</span>
                                    <span class="jia" @tap.stop ="toggleSpecAndMaskLayerFlag(false)">+</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- 球 -->
        <transition
                v-on:before-enter="beforeEnterBall"
                v-on:enter="enterBall"
                v-on:after-enter="afterEnterBall">
            <div  v-if="ballMove.flag"  style="z-index:1001" class="outBall">
                <span class="innerBall">+</span>
            </div>
        </transition>
        <!-- 蒙层 -->
        <transition name="el-fade-in-linear">
            <section class="mask-layer" v-if="MaskLayerFlag" @click="toggleSpecAndMaskLayerFlag(true)"></section>
        </transition>
        <!-- 商品信息 -->
        <transition name="el-zoom-in-bottom">
            <section class="shopGoodInfo" v-if="shopGoodInfoFlag">
                <i class="el-icon-close" @click="toggleShopGoodInfoAndMaskLayerFlag"></i>
                <div class="shopHeaderImg">
                    <img :src="baseImgUrl + shopGoodInfo.image_path" alt="">
                </div>
                <div class="info">
                    <div class="goodName">{{shopGoodInfo.name}}</div>
                    <div class="goodDescription">{{shopGoodInfo.description}}</div>
                    <div class="rating">评分
                        <el-rate
                            :value="shopGoodInfo.rating"
                            disabled
                            show-score
                            text-color="#ff9900"
                            score-template="{value}">
                        </el-rate>
                    </div>
                    <div class="month_sales">月售 {{shopGoodInfo.month_sales}}单 <span>售价 ￥{{shopGoodInfo.specfoods[0].price}} 起</span></div>
                    <div class="rating_count">评论数 {{shopGoodInfo.rating_count}} 好评率 {{shopGoodInfo.satisfy_rate}}%</div>
                </div>
            </section>
        </transition>
        <!-- 选项卡 -->
        <transition name="el-zoom-in-bottom">
            <section class="specifications" v-if="specificationsFlag">
                <i class="el-icon-close" @click="toggleSpecAndMaskLayerFlag(false)"></i>
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
                <el-button type="primary"  class="primary-btn" @click.native="addHaveStyleFoods"><span>选好了</span></el-button>
            </section>
        </transition>
    </div>
</template>

<script>
    import BScroll from 'better-scroll'
    import { baseImgUrl } from "../../../config/env"
    import { getShopGoodsMenu } from "../../../service/getData"
    import {deepCopy} from "../../../config/jsTools"
    import { Toast } from 'mint-ui';

    export default {
        data(){
           return {
               baseImgUrl,                    // 图片基础路径
               shopGoodsMenu : [],            // 商店商品菜单
               shopGoodsMenuCopy:[],          // 商店商品菜单复制
               currentLeftMenuIndex : 0 ,     // 当前左边菜单选中的index
               goodsTitleFlag: false,         // 标识符: 控制 tooltiptext 那三个点的 显示与关闭
               specificationsFlag:false,      // 标识符: 控制 点击规格的 页面出现
               MaskLayerFlag : false,         // 标识符 : 蒙层
               shopGoodInfoFlag : false,      // 标识符 : 商品信息
               currentSpecificationInfo:{},   // 当前的规格卡信息
               FoodStyleSelectStrAndMoney:{}, // 规格卡里面的 '已选',金钱额度
               currentShoppingCar:{              // 购物车
                       restaurantId : null,      // 餐馆Id
                       comments:'',              // 备注
                       allNum:0,                 // 所有已经选中的食物数量
                       shoppingStatus: false ,   // 下单状态
                       foodsInfoArr:[ ]          // 商品信息
               },
               ballMove:{                        // 小球过渡信息
                   flag : false,
                   bottom  : 0 ,
                   left : 0,
               },
               shopGoodInfo : {},              // 商品信息
               value5 : 3.7
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
            // 点击 + , 添加货物( 无规格的+ )
            addFoods(foods,foodsMenuIndex,foodsIndex,event){
                if ( event ){
                    // 把当前在 页面中的 left bottom 传入 这个对象中
                    this.ballMove.bottom  =  document.body.clientHeight - event.target.getBoundingClientRect().top
                    this.ballMove.left =  event.target.getBoundingClientRect().left

                    if ( this.ballMove.flag == false ){
                        if (  foods.specfoods[0].currentBuyNum < foods.specfoods[0].stock ){
                            if (  foods.specfoods[0].currentBuyNum == 0 ){
                                foods.addAndReduceFlag = true
                            }
                            foods.specfoods[0].currentBuyNum++
                        }else{
                            this.warning(foods.specfoods[0].currentBuyNum,false)
                            return false
                        }
                        // 小球move
                        this.ballMove.flag = true
                        // 这个食物当前的 数量+1
                        this.shopGoodsMenu[foodsMenuIndex].foods[foodsIndex].thisFoodsSelectNum++
                        // 菜单栏的 数量+1
                        this.shopGoodsMenu[foodsMenuIndex].thisMenuSelectFoodsNum++
                        // 查看这个商店的购物车是否存在 这个食物的 ID
                        let foods_index =  this.currentShoppingCar.foodsInfoArr.findIndex( item =>{
                            return ( foods.specfoods[0].food_id  == item.foodsId )
                        })
                        if ( foods_index == -1 ){
                            var foodsInfo = {
                                foodsId :foods.specfoods[0].food_id,         // 商品id
                                buyNum: foods.specfoods[0].currentBuyNum ,   // 商品购买的数量
                                foodsName:foods.specfoods[0].name,           // 商品名
                                onePrice:foods.specfoods[0].price,           // 单价
                                packing_fee:foods.specfoods[0].packing_fee,  // 打包费
                                sku_id:foods.specfoods[0].sku_id,            // 规格id
                                specs:foods.specfoods[0].specs,              // 规格
                                stock:foods.specfoods[0].stock,              // 库存
                                foodsStatus:true,                            // 商品选中状态
                                foodsMenuIndex,
                                foodsIndex
                            }
                            this.currentShoppingCar.foodsInfoArr.push(foodsInfo)
                        }else{
                            this.currentShoppingCar.foodsInfoArr[foods_index].buyNum++
                        }
                        // 购物车总数量 +1
                        this.currentShoppingCar.allNum++
                        // 把购物车信息传到 shop.vue 父组件
                        this.$emit('getShoppingCar',this.currentShoppingCar,this.ballMove.flag)
                    }
                }else{
                    if (  foods.specfoods[0].currentBuyNum < foods.specfoods[0].stock ){
                        if (  foods.specfoods[0].currentBuyNum == 0 ){
                            foods.addAndReduceFlag = true
                        }
                        foods.specfoods[0].currentBuyNum++
                    }else{
                        this.warning(foods.specfoods[0].currentBuyNum,false)
                        return false
                    }
                    // 这个食物当前的 数量+1
                    this.shopGoodsMenu[foodsMenuIndex].foods[foodsIndex].thisFoodsSelectNum++
                    // 菜单栏的 数量+1
                    this.shopGoodsMenu[foodsMenuIndex].thisMenuSelectFoodsNum++
                    // 查看这个商店的购物车是否存在 这个食物的 ID
                    let foods_index =  this.currentShoppingCar.foodsInfoArr.findIndex( item =>{
                        return ( foods.specfoods[0].food_id  == item.foodsId )
                    })
                    if ( foods_index == -1 ){
                        var foodsInfo = {
                            foodsId :foods.specfoods[0].food_id,         // 商品id
                            buyNum: foods.specfoods[0].currentBuyNum ,   // 商品购买的数量
                            foodsName:foods.specfoods[0].name,           // 商品名
                            onePrice:foods.specfoods[0].price,           // 单价
                            packing_fee:foods.specfoods[0].packing_fee,  // 打包费
                            sku_id:foods.specfoods[0].sku_id,            // 规格id
                            specs:foods.specfoods[0].specs,              // 规格
                            stock:foods.specfoods[0].stock,              // 库存
                            foodsStatus:true,                            // 商品选中状态
                            foodsMenuIndex,
                            foodsIndex
                        }
                        this.currentShoppingCar.foodsInfoArr.push(foodsInfo)
                    }else{
                        this.currentShoppingCar.foodsInfoArr[foods_index].buyNum++
                    }
                    // 购物车总数量 +1
                    this.currentShoppingCar.allNum++
                }
            },
            // 点击 - , 减少货物
            reduceFoods( foods,foodsMenuIndex,foodsIndex,food_id,currentActiveClassIndex,isFromShop ){
                if ( !food_id ){
                    foods.specfoods[0].currentBuyNum--
                    // 这个食物当前的 数量-1
                    this.shopGoodsMenu[foodsMenuIndex].foods[foodsIndex].thisFoodsSelectNum--
                    // 菜单栏的 数量-1
                    this.shopGoodsMenu[foodsMenuIndex].thisMenuSelectFoodsNum--
                    if( foods.specfoods[0].currentBuyNum == 0 ){
                        foods.addAndReduceFlag = false
                    }
                    // 查看这个商店的购物车这个食物的 ID
                    let foods_index =  this.currentShoppingCar.foodsInfoArr.findIndex( item =>{
                        return ( foods.specfoods[0].food_id  == item.foodsId )
                    })
                    this.currentShoppingCar.foodsInfoArr[foods_index].buyNum--
                    // 如果为0 , 在购物车中删除这个食物
                    if ( !this.currentShoppingCar.foodsInfoArr[foods_index].buyNum ){
                        this.currentShoppingCar.foodsInfoArr.splice(foods_index,1)
                    }
                }else{
                    if ( foods.thisFoodsSelectNum  > 1 && !isFromShop ){
                        Toast({
                            message: `多规格和带属性的商品
                                  只能去购物车删除哦`,
                            className: 'whiteColor'
                        });
                        return false
                    }else{
                        let foodsInfoArrIndex =  this.currentShoppingCar.foodsInfoArr.findIndex( item =>{
                            return ( item.foodsId == food_id )
                        })
                        // 这个食物当前的 数量-1
                        this.shopGoodsMenu[foodsMenuIndex].foods[foodsIndex].thisFoodsSelectNum--
                        // 菜单栏的 数量-1
                        this.shopGoodsMenu[foodsMenuIndex].thisMenuSelectFoodsNum--
                        // 相应的食物规格样式 -1
                        this.shopGoodsMenu[foodsMenuIndex].foods[foodsIndex].specifications[0].values[currentActiveClassIndex].currentBuyNum--
                        // 如果不来自 shop 组件
                        if ( !isFromShop ){
                            this.currentShoppingCar.foodsInfoArr.splice(foodsInfoArrIndex,1)
                        }else{
                        // 如果来自 shop 组件 , 查看 -- 了之后 是否等于 0 , 等于0 再splice
                            if( !this.shopGoodsMenu[foodsMenuIndex].foods[foodsIndex].specifications[0].values[currentActiveClassIndex].currentBuyNum ){
                                this.currentShoppingCar.foodsInfoArr.splice(foodsInfoArrIndex,1)
                            }
                        }
                    }
                }
                // 购物车总数量 -1
                this.currentShoppingCar.allNum--
                // 查看是否是 shop.vue 传过来的
                if ( !isFromShop ){
                    // 把购物车信息传到 shop.vue 父组件
                    this.$emit('getShoppingCar',this.currentShoppingCar)
                }
            },
            // 点击 + , 添加货物( 有规格的+ )
            addFoodsStyle(){
                let Obj = this.FoodStyleSelectStrAndMoney.currentFood
                // 查看这个商店的购物车是否存在 这个食物的 ID
                let foods_index =  this.currentShoppingCar.foodsInfoArr.findIndex( item =>{
                    return ( Obj.food_id  == item.foodsId && Obj.sku_id == item.sku_id )
                })
                if ( foods_index == -1 ){
                    var foodsInfo = {
                        foodsId :Obj.food_id,         // 商品id
                        buyNum: Obj.currentBuyNum ,   // 商品购买的数量
                        foodsName:Obj.name,           // 商品名
                        onePrice:Obj.price,           // 单价
                        packing_fee:Obj.packing_fee,  // 打包费
                        sku_id:Obj.sku_id,            // 规格id
                        specs:Obj.specs,              // 规格
                        stock:Obj.stock,              // 库存
                        foodsIndex: Obj.foodsIndex,
                        foodsMenuIndex: Obj.foodsMenuIndex,
                        foodsStatus:true,             // 商品选中状态
                    }
                    this.currentShoppingCar.foodsInfoArr.push(foodsInfo)
                }else{
                    this.currentShoppingCar.foodsInfoArr[foods_index].buyNum++
                }
                // 购物车总数量 +1
                this.currentShoppingCar.allNum++
                // 把购物车信息传到 shop.vue 父组件
                this.$emit('getShoppingCar',this.currentShoppingCar)
            },
            // shop.vue 添加货物 ( 有规格 )
            addFoodsStyleFromShop(foods,foodsMenuIndex,foodsIndex,currentActiveClassIndex){
                // 这个食物当前的 数量+1
                this.shopGoodsMenu[foodsMenuIndex].foods[foodsIndex].thisFoodsSelectNum++
                // 菜单栏的 数量+1
                this.shopGoodsMenu[foodsMenuIndex].thisMenuSelectFoodsNum++
                // 相应的食物规格样式 +1
                this.shopGoodsMenu[foodsMenuIndex].foods[foodsIndex].specifications[0].values[currentActiveClassIndex].currentBuyNum++
                // 购物车总数量 +1
                this.currentShoppingCar.allNum++
            },
            // 计算 规格卡里面的 '已选',金钱额度
            countFoodStyleSelectStrAndMoney( specifications ){
                let Obj = {
                    selectStr: '',
                    money:0,
                    currentFood:{},
                }
                specifications.forEach( (item,key) =>{
                    var index = item.currentActiveClassIndex
                    if ( key != 0 ){
                        Obj.selectStr += '/'+ item.values[index].specs_name
                    }else{
                        Obj.selectStr += item.values[index].specs_name
                    }
                    Obj.money += parseFloat(item.values[index].price)
                    Obj.currentFood = item.values[index]
                })
                this.FoodStyleSelectStrAndMoney = Obj
            },
            // 点击规格 显示方法,传入信息
            showSpecifications(sonVal,foodsMenuIndex,foodsIndex){
                this.currentSpecificationInfo ={
                    image_path : this.baseImgUrl+sonVal.image_path,
                    name : sonVal.name,
                    specifications : sonVal.specifications,
                    category_id : sonVal.category_id,
                    foodsMenuIndex : foodsMenuIndex,
                    foodsIndex: foodsIndex
                }
                // 放入两个属性
                sonVal.specifications.forEach( specVal =>{
                    specVal.values.forEach( specSonVal =>{
                        specSonVal.foodsMenuIndex = foodsMenuIndex
                        specSonVal.foodsIndex = foodsIndex
                    } )
                })
                //计算 规格卡里面的 '已选',金钱额度
                this.countFoodStyleSelectStrAndMoney(sonVal.specifications,foodsMenuIndex,foodsIndex)
                // 选项卡,蒙层显示
                this.toggleSpecAndMaskLayerFlag(false)
            },
            // 点击 规格卡里面的 样式类型, 切换类 和 信息
            toggleFoodStyle(item,index){
                item.currentActiveClassIndex = index
                this.countFoodStyleSelectStrAndMoney(this.currentSpecificationInfo.specifications)
            },
            // 点击 有规格卡的 食物的 '选好了' 按钮
            addHaveStyleFoods(){
                // 1. 判断库存是否为0,为0则弹出提示框;
                // 2. 拿到该食物的名字,该食物的价格, 当前数量库存 +1
                // 3. 页面上 '选规格' 按钮 变化成计数器;
                // 3.1 点击计数器减号 : 数量为1 可以减为0; 数量 > 1,减号变灰色,点击弹出提示框说去购物车更改
                // 4. 如果这个店铺原本购物车里面为0件商品,点击后, footer 中的 购物车图标变蓝色,有动效,有总件数右上角小图标
                // 5. 计算起送价格变化, 达到起送价格后,可以点击结算
                // 6. 左边的 菜单 一个类型的 件数 小图标
                // PS:(点击确定后, 刷新数据,由于后台接口不全;无法做;全部数据再发请求的话性能过载)
                if (this.FoodStyleSelectStrAndMoney.currentFood.stock < this.FoodStyleSelectStrAndMoney.currentFood.currentBuyNum){
                    this.$message({ message: '库存不够,请选择其他的商品', type: 'warning' });
                    return false
                }
                // 这个食物当前选择的这个样式 数量+1
                this.FoodStyleSelectStrAndMoney.currentFood.currentBuyNum++
                // 这个食物当前的 数量+1
                this.shopGoodsMenu[this.currentSpecificationInfo.foodsMenuIndex].foods[this.currentSpecificationInfo.foodsIndex].thisFoodsSelectNum++
                // 菜单栏的 数量+1
                this.shopGoodsMenu[this.currentSpecificationInfo.foodsMenuIndex].thisMenuSelectFoodsNum++
                // 添加 当前商店购物车
                this.addFoodsStyle()
                // 关闭规格卡,蒙层
                this.toggleSpecAndMaskLayerFlag(false)
            },
            // 过渡动画
            beforeEnterBall(el){
                el.style.bottom = this.ballMove.bottom  + 'px'
                el.style.left = this.ballMove.left + 'px'
            },
            enterBall(el, done){
                // 动画激活
                el.offsetLeft
                // 100/375   = 26.67vw
                // 26.67 * 页面宽度 * 6.1 = 真实的px
                let bottom = 2667 * document.body.clientWidth * 45 / 1000000
                let left = 2667 * document.body.clientWidth * 4 / 100000
                let transformBottom=  this.ballMove.bottom - bottom
                let transformLeft = - ( this.ballMove.left - left )
                el.style.transform =  `translate3d(${transformLeft}px,0,0)`
                let child = el.children[0]
                child.style.transform = `translate3d(0,${transformBottom}px,0)`
                el.addEventListener('transitionEnd', done)
                el.addEventListener('webkitTransitionEnd', done)
            },
            afterEnterBall(el){
                this.ballMove.flag = false
            },
            // 点击 展示商店的信息
            showShopInfo(sonVal){
                this.toggleShopGoodInfoAndMaskLayerFlag()
                this.shopGoodInfo = sonVal
            },
            // 切换蒙层 和 Spec
            toggleSpecAndMaskLayerFlag(maskFlag){
                if( !maskFlag ) {
                    this.specificationsFlag = !this.specificationsFlag
                    this.MaskLayerFlag = !this.MaskLayerFlag
                }else{
                    this.specificationsFlag = false
                    this.MaskLayerFlag = false
                    this.shopGoodInfoFlag = false
                }
            },
            // 切换蒙层 和 商品信息
            toggleShopGoodInfoAndMaskLayerFlag(){
                this.shopGoodInfoFlag = !this.shopGoodInfoFlag
                this.MaskLayerFlag = !this.MaskLayerFlag
            }
        },
        computed:{
            // 当前店铺的 Id
            shopId (){
                this.currentShoppingCar.restaurantId = this.$route.params.shopid
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
        watch:{
            changeFoodsNum: function ( newVal ) {
                var haveStyle = this.shopGoodsMenu[newVal.foodsMenuIndex].foods[newVal.foodsIndex].specifications.length
            // 判断是否有规格
                // 无规格
                if ( !haveStyle ){
                    // 如果是 减号 为 false
                    if ( newVal.status == 'false' ){
                        var foods = this.shopGoodsMenu[newVal.foodsMenuIndex].foods[newVal.foodsIndex]
                        this.reduceFoods( foods, newVal.foodsMenuIndex, newVal.foodsIndex, undefined, undefined,true )
                    }else{
                        var foods = this.shopGoodsMenu[newVal.foodsMenuIndex].foods[newVal.foodsIndex]
                        this.addFoods( foods, newVal.foodsMenuIndex, newVal.foodsIndex )
                    }
                }else{
                // 有规格
                    // 如果为 减号, false
                    if ( newVal.status == 'false' ){
                        var currentActiveClassIndex = 0
                        this.shopGoodsMenu[newVal.foodsMenuIndex].foods[newVal.foodsIndex].specifications.some(item =>{
                            currentActiveClassIndex =  item.values.findIndex( value =>{
                                return ( value.food_id  == newVal.foodsId )
                            })
                            if ( currentActiveClassIndex == -1 ){
                                return false
                            }else{
                                return true
                            }
                        })
                        var foods = this.shopGoodsMenu[newVal.foodsMenuIndex].foods[newVal.foodsIndex]
                        this.reduceFoods( foods, newVal.foodsMenuIndex, newVal.foodsIndex, newVal.foodsId ,currentActiveClassIndex,true )
                    }else{
                        var currentActiveClassIndex = 0
                        this.shopGoodsMenu[newVal.foodsMenuIndex].foods[newVal.foodsIndex].specifications.some(item =>{
                            currentActiveClassIndex =  item.values.findIndex( value =>{
                                return ( value.food_id  == newVal.foodsId )
                            })
                            if ( currentActiveClassIndex == -1 ){
                                return false
                            }else{
                                return true
                            }
                        })
                        var foods = this.shopGoodsMenu[newVal.foodsMenuIndex].foods[newVal.foodsIndex]
                        this.addFoodsStyleFromShop( foods,newVal.foodsMenuIndex,newVal.foodsIndex,currentActiveClassIndex )
                    }
                }
            },
            clearShopCarFlag: function () {
                var shopGoodsMenuCopyObj = this.shopGoodsMenuCopy
                this.shopGoodsMenu = deepCopy(shopGoodsMenuCopyObj)
                this.currentShoppingCar = {        // 购物车
                        restaurantId : null,      // 餐馆Id
                        comments:'',              // 备注
                        allNum:0,                 // 所有已经选中的食物数量
                        shoppingStatus: false ,   // 下单状态
                        foodsInfoArr:[ ]          // 商品信息
                }
            }
        },
        created(){
            this.stop()
            if (this.shopId){
                this.getShopGoodsMenu( this,this.shopId ).then( result =>{
                    if ( result.status == 200){
                        var arr = result.data
                        arr.forEach( item =>{
                            item.goodsTitleFlag = false
                            item.thisMenuSelectFoodsNum = 0
                            item.foods.forEach( sonItem => {
                                sonItem.addPositionTop  = 0
                                sonItem.addPositionLeft = 0
                                sonItem.thisFoodsSelectNum = 0
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
                        this.shopGoodsMenuCopy = deepCopy(arr)
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
        },
        props:['changeFoodsNum','clearShopCarFlag']
    }
</script>

<style lang="less" scoped>
* {
        touch-action: pan-y;
    }
@import "../../../assets/less/shop/children/goods";

.el-rate{
    display: inline-block;
}
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

// 球
.outBall{
    transition :0.4s all linear;
    width: .2rem;
    height: .2rem;
    position: fixed;
    .innerBall{
        width: .2rem;
        height: .2rem;
        text-align: center;
        border: .01rem solid @mainColor;
        line-height: .18rem;
        border-radius: 50%;
        display: block;
        color: #fff;
        background-color: @mainColor;
        transition: 0.4s all cubic-bezier(0.49, -0.29, 0.75, 0.41)
    }
}
</style>

<style>
    .mint-toast-text{
        color: #fff;
    }
</style>