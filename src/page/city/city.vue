<template>
    <div class="city">
        <header id="header">
            <i class="el-icon-arrow-left  backPage" @click="goBack"></i>
            <span class="title">{{ currentCity.name }}</span>
            <div class="toggle">
                <router-link to="/home">切换城市</router-link>
            </div>
        </header>
        <nav id="nav">
            <el-input clearable placeholder='输入学校、商务楼、地址' class="searchAddress"  v-model="searchAddressInfo"></el-input>
            <el-button type="primary" :plain="true" class="submitBtn" @click="getPlaceToKeyInfo">提交</el-button>
        </nav>
        <main id="main">
          <section class="history">
              <div class="historyTitle" v-if="flag">
                  搜索历史
              </div>
              <div class="historyInfo">
                  <ul class="historyList"  v-if="flag">
                      <router-link tag="li" :to="'/msite?geohash='+item.geohash" v-for="item in historyPlace" :key="item.geohash">
                          <div class="listTitle">{{ item.name }}</div>
                          <div class="listInfo">{{ item.address }}</div>
                      </router-link>
                  </ul>
                  <ul class="historyList"  v-if="!flag">
                      <li  v-for="item in PlaceToKeyInfo" @click="goNextAndSetHistoryInfo(id,item.geohash,item.address,item.name )"  :key="item.geohash">
                          <div class="listTitle">{{ item.name }}</div>
                          <div class="listInfo">{{ item.address }}</div>
                      </li>
                  </ul>
                  <div class="clearList" @click="clearThisHistoryInfo( id )" v-if="flag" >
                      清空所有
                  </div>
              </div>
          </section>
        </main>
    </div>
</template>

<script>
    import { currentCityGuess } from '../../service/getData'
    import { getPlaceToKey } from '../../service/getData'
    import  { fullScreen } from "../../config/jsTools"
    import  { judgeFullScreen } from "../../config/jsTools"

    export default {
        data(){
           return {
               loading : '' ,
               loadingKey : 2,
               currentLoadingKey : 0,  // 遮罩层 3 属性
               flag : true , //  显示搜索历史的 标识符
               id : this.$route.params.id,  // 城市id
               historyPlace : [],    // 历史 地址
               currentCity : {},           // 当前城市信息
               searchAddressInfo : '',   // input search 的 value 值
               PlaceToKeyInfo : [],   // 根据 id , searchAddressInfo 查询得到的 地址
               historyPlaceInfo : [],     // 历史地名 信息
           }
        },
        created(){
          this.fullScreen( this )
          this.currentCityGuess( this ,this.id ).then( result =>{
                if ( result.status == 200){
                    this.judgeFullScreen(this)
                    this.currentCity =  result.body
                }
            } ).catch( err =>{
                throw err
            })
          this.getHistoryInfoToLocalStorage( this.id )
        },
        methods:{
            fullScreen,
            judgeFullScreen,
            currentCityGuess,
            getPlaceToKey,
            goBack(){
                this.$router.go(-1)
            },
            // 根据id , 得到 localStorage 信息, 把历史地址 渲染到对应的位置
            getHistoryInfoToLocalStorage(id){
                var arr = JSON.parse( localStorage.getItem('historyPlaceInfo') ) || []
                if ( arr.find( function ( value ) {  return ( value.id == id ) })  ){
                    arr = arr.find( function ( value ) {  return ( value.id == id ) }).info
                    if ( arr ){
                        this.historyPlace =  arr
                    }
                }
                setTimeout(  () => {
                    this.judgeFullScreen(this)
                },1000)
            },
            //  根据id , 清除 这个id 的历史记录
            clearThisHistoryInfo( id ){
                var arr = JSON.parse( localStorage.getItem('historyPlaceInfo') ) || []
                if ( arr ){
                    var index = arr.findIndex( item =>{
                        return ( item.id == id )
                    })
                    arr.splice(index,1)
                    localStorage.setItem('historyPlaceInfo',JSON.stringify( arr ))
                    this.flag = false
                }
            },
            // 根据 searchAddressInfo ( input search 的 value 值 ) 得到 地址信息
            getPlaceToKeyInfo(){
                if ( this.searchAddressInfo == ''){
                    this.$message({
                        message: '内容不能为空',
                        type: 'warning',
                    });
                }else{
                    this.getPlaceToKey( this,this.id,this.searchAddressInfo )
                    .then( result =>{
                        if ( result.status === 200 ){
                            this.flag = false
                            this.PlaceToKeyInfo = result.body
                        }
                    })
                }
            },
            // 点击列表, 把数据存到 localStorage 里面 , 再跳转到 下个路由
            goNextAndSetHistoryInfo(id ,geohash,address,name){
                var arr = JSON.parse( localStorage.getItem('historyPlaceInfo') ) || []
                if ( arr == [] ){
                    var infosObj =  {
                        id: id,
                        info : [
                            { address : address , geohash : geohash , name : name  }
                        ]
                    }
                    arr.push( infosObj )
                }
                else{
                    var flag = arr.findIndex( function( value ) { return  ( value.id == id ) } )
                    if ( flag == -1 ){
                        var infosObj =  {
                            id: id,
                            info : [
                                { address : address , geohash : geohash , name : name  }
                            ]
                        }
                        arr.push( infosObj )
                    }
                    else{
                        arr.some( item  => {
                            if ( item.id  == this.id ){
                                var key = true
                                item.info.some( value => {
                                   if( value.address == address && value.geohash == geohash && value.name == name  ){
                                       key = false
                                       return true
                                   }
                                })
                                if ( key ){
                                    var infoObj = { address : address , geohash : geohash , name : name }
                                    item.info.push ( infoObj )
                                }
                                return true
                            }
                        })
                    }
                }
                localStorage.setItem('historyPlaceInfo',JSON.stringify(arr))
                // 带着 geohash 去到下个路由
                this.$router.push({ path: '/msite', query: { geohash: geohash }})
            }
        },
    }
</script>

<style lang="less" scoped>
    @import "../../assets/less/base/header";
    @import "../../assets/less/city/city";
</style>