import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);



export default new Vuex.Store({
  state: {
      userId:0,              // 用户Id, 0才 是游客状态
      geoHash:null,             // 经纬度
      harvestAddress:[],        // 收获地址
      currentVisitSeller : {},  // 当前访问的商家信息
      shoppingCar:[{            // 购物车
          restaurantId : null,      // 餐馆Id
          comments:'',              // 备注
          shoppingStatus: false ,   // 下单状态
          foodsInfo:[{                   // 商品信息
              goodsId : null,            // 商品id
              goodsName:'',              // 商品名
              onePrice:0,                // 单价
              packing_fee:0,             // 打包费
              sku_id:null,               // 规格id
              specs:null,                // 规格
              stock:0,                   // 库存
              foodsStatus:false,         // 商品选中状态
          }]
      }]
  },
  mutations: {

  },
  getters:{
      // 总价
      allPrice: state =>{
      return state.userId
     },
      // 总件数
      allGoodsNum : state =>{
        return state.userId
      },
  },
  actions: {

  }
});
