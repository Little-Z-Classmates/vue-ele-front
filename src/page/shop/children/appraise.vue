<template>
    <div class="appraise"
         v-infinite-scroll="loadMore"
         :infinite-scroll-disabled="isLoadMore"
         infinite-scroll-distance="10">
        <div class="ratingsScores" v-if="ratingsScores.food_score">
           <div class="ratingsScoresLeft">
               <span class="overallMeritNum">{{Math.round( ratingsScores.overall_score * 10 ) / 10}}</span>
               <span class="overallMeritWord">综合评价</span>
               <span class="compareWithOther">高于周边商家{{ Math.round( ratingsScores.compare_rating * 1000 )/10 }}%</span>
           </div>
           <div class="ratingsScoresRight">
               <div class="serviceAttitude">
                   <span>服务态度</span>
                   <el-rate
                           :value="Math.round( ratingsScores.service_score  * 10) / 10 "
                           disabled
                           show-score
                           text-color="#ff9900"
                           score-template="{value}">
                   </el-rate>
               </div>
               <div class="goodsAppraise">
                   <span>商品评价</span>
                   <el-rate
                           :value="Math.round( ratingsScores.food_score  * 10) / 10 "
                           disabled
                           show-score
                           text-color="#ff9900"
                           score-template="{value}">
                   </el-rate>
               </div>
               <div class="deliverTime">
                   <span>送达时间&nbsp;&nbsp;</span>
                   <span>{{ratingsScores.deliver_time}} 分钟</span>
               </div>
           </div>
        </div>
        <div class="ratingsTags" v-if="ratingsTags.length">
            <ul>
                <li v-for="(item,index) in ratingsTags"
                    :class="{'unsatisfied': item.unsatisfied,'active': index == ratingsTagsActiveIndex }"
                    :key="index">
                    {{item.name}}({{item.count}})
                </li>
            </ul>
        </div>
        <div class="userRatings" v-if="userRatings.length">
            <ul>
                <li v-for="( userItem,key ) in userRatings" :key="key">
                    <div class="userRatingsLeft">
                        <img v-if="userItem.avatar" :src="imgBaseUrl + userItem.avatar + '.jpeg'" alt="">
                        <img v-if="!userItem.avatar" src="../../../assets/image/default.jpg" alt="">
                    </div>
                    <div class="userRatingsCentre">
                        <div class="userName">{{ userItem.username }}</div>
                        <div class="userDesc">
                            <el-rate
                                :value="userItem.rating_star"
                                disabled
                                text-color="#ff9900"
                                score-template="{value}">
                             </el-rate>
                            {{ userItem.time_spent_desc }}
                        </div>
                        <div class="ratingsGoodImg" v-if="userItem.item_ratings.length">
                            <img v-for="(valueImg,valueImgKey) in userItem.item_ratings"
                                 :key="valueImgKey"
                                 v-if="valueImg.image_hash"
                                 :src="valueImg.image_hash?imgBaseUrl + valueImg.image_hash + '.jpeg':''"
                                 :preview="key"
                                 alt="">
                        </div>
                        <div class="ratingsGoodName" v-if="userItem.item_ratings.length">
                            <span v-for="(valueName,valueNameKey) in  userItem.item_ratings" :key="valueNameKey+100">{{valueName.food_name}}</span>
                        </div>
                    </div>
                    <div class="userRatingsDate">
                        <span>{{userItem.rated_at}}</span>
                    </div>
                </li>
                <li>全部评论加载完毕</li>
                <li>加载中&nbsp;<mt-spinner color="#88cdff" style="display: inline-block" type="triple-bounce"></mt-spinner></li>
            </ul>
        </div>
    </div>
</template>

<script>
    import  { getRatingsScores } from "../../../service/getData"
    import  { getRatingsTags } from "../../../service/getData"
    import  { getUserRatingsInfo } from "../../../service/getData"
    import  { imgBaseUrl } from "../../../config/env"

    export default {
         data(){
             return {
                 imgBaseUrl,
                 isLoadMore: false,
                 ratingsScores:{},
                 ratingsTags:[],
                 ratingsTagsActiveIndex : 0,   // 评价分类 当前选中的标识符的 index
                 userRatingsInfoObj:{          // 发请求的用户评价信息
                     tag_name: undefined,      // 评价类型，默认全部
                     offset  : undefined,      // 跳过数据条数
                     limit   : 10       // 单次获取数据条数
                 },
                 userRatings:[]   // 获取到的用户数据评价
             }
         },
        methods:{
            getRatingsScores,
            getRatingsTags,
            getUserRatingsInfo,
            // 获取更多评论
            loadMore(){

            }
        },
        computed:{
            // 当前店铺的 Id
            shopId (){
                return this.$route.params.shopid
            },
        },
        created(){
             this.getRatingsScores(this, this.shopId ).then( results =>{
                 if ( results.status == 200){
                    this.ratingsScores =  results.data
                 }
             })
             this.getRatingsTags(this,this.shopId ).then( results =>{
                 if ( results.status == 200){
                    this.ratingsTags =  results.data
                 }
             })
             this.getUserRatingsInfo(this,this.shopId,this.userRatingsInfoObj ).then( results =>{
                 if ( results.status == 200){
                     this.userRatings = results.data
                 }
             })
        }
    }
</script>

<style lang="less" scoped>
 @import "../../../assets/less/shop/children/appraise";
    .el-rate{
        display: inline-block;
    }
</style>
<style>
    .el-rate__icon {
        position: relative;
        display: inline-block;
        font-size: .12rem;
        color: #C0C4CC;
        -webkit-transition: .3s;
        transition: .3s;
        transform-origin: left center;
        transform: scale(0.8);
        margin-right: 0px;
    }
</style>