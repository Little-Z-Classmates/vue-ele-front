import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

var geoHash = JSON.parse ( sessionStorage.getItem('currentGeoHash') ) // 获取当前的 经纬度
var currentVisitShopInfo = JSON.parse ( sessionStorage.getItem('currentVisitShopInfo') ) // 获取当前的 经纬度

export default new Vuex.Store({
  state: {
      userId:0,              // 用户Id, 0才 是游客状态
      geoHash:geoHash,             // 经纬度
      harvestAddress:[],        // 收获地址
      currentVisitShopInfo : currentVisitShopInfo,  // 当前访问的商家信息
      shoppingCar:[{            // 购物车
          restaurantId : null,      // 餐馆Id
          comments:'',              // 备注
          shoppingStatus: false ,   // 下单状态
          foodsInfo:[{                   // 商品信息
              foodsId : null,            // 商品id
              foodsName:'',              // 商品名
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
      // SS --> sessionStorage  ,  LS --> localStorage
      setGeoHashToSS(state,geohash){
          state.geoHash = geohash
          sessionStorage.setItem('currentGeoHash',JSON.stringify(geohash))
      },
      setCurrentVisitShopInfoToSS(state,sellerInfo){
          state.currentVisitShopInfo = {}
          for( let key in sellerInfo ){
              state.currentVisitShopInfo[key] = sellerInfo[key]
          }
          sessionStorage.setItem('currentVisitShopInfo',JSON.stringify( state.currentVisitShopInfo ))
      }
  },
  getters:{
      // 获取经纬度
      getGeoHash: function ( state ) {
          return state.geoHash
      },
      // 判断 商家详情页面的 id 和 当前存储的 id 是否一致; 用来判断 页面是不是从商家页面跳过来的,是就返回 1, 不是返回 0
      judgeShopDetailId : state => shopId => {
          var flagA = state.currentVisitShopInfo
              if ( flagA ) {
                  var flagB = ( state.currentVisitShopInfo.id == parseInt(shopId) )
                  if ( flagB ){ return '1' }else{ return '0' }
              }else{
                  return  '0'
              }
          },
      // shopDetail 页面得到相应的 商家信息
      getShopDetailInfo: state =>{
          var  shopDetailInfo = {
              attributes : state.currentVisitShopInfo.activities.concat(state.currentVisitShopInfo.supports),
              status : state.currentVisitShopInfo.status,
              order_lead_time : state.currentVisitShopInfo.order_lead_time,
              description : state.currentVisitShopInfo.description,
              address : state.currentVisitShopInfo.address,
              opening_hours : state.currentVisitShopInfo.opening_hours,
              license : state.currentVisitShopInfo.license,
          }
          return shopDetailInfo
      },
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
