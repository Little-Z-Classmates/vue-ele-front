<template>
    <div class="fold-drop-down">
        <div class="drop-down-left" >
            <div class="comprehensiveFood">综合美食<span>{{classifyCountAll}}</span></div>
            <div class="allFoodsList" ref="dropDownLeft">
                <ul>
                    <li v-for="item in navClassifyInfoList"
                        :class="item.name == currentActive? 'active':''"
                        :key="new Date().getTime()*Math.random()*Math.random()"
                        @leftTap="toggleFoodKinds(item.name)">
                        <img src="https://fuss10.elemecdn.com/b/ff/533cf9617bd57fe1dfb05603bebcfpng.png" alt="">
                        {{ item.name }}
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-mjiantou-copy"></use>
                        </svg>
                        <span>{{ item.count }}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="drop-down-right" ref="dropDownRight">
            <ul>
                <li v-for="value in currentFoodKindSub"
                    :key="new Date().getTime()*Math.random()*Math.random()"
                    @rightTap="$emit('toggleCategory', value.id,value.name )">
                    <span>{{ value.name }}</span>
                    <span>{{ value.count }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import BScroll from 'better-scroll'  // 引入滚动
    import  { imgBaseUrl } from "../../../config/env"

    export default {
        data(){
            return {
                imgBaseUrl,
                currentFoodKindSub : [],
                allFoodKindsSub : [],
                classifyCountAll : '',
                currentActive: '异国料理',
            }
        },
        watch:{
            navClassifyInfoList( newVal ){
                var foodKindsSub = []
                var count = 0
                this.currentFoodKindSub = newVal[0].sub_categories
                newVal.forEach( item =>{
                    count += item.count
                    var subCount = 0
                    if ( item.sub_categories.length ){
                        item.sub_categories.forEach( item =>{ subCount += item.count} )
                        item.sub_categories[0].count = subCount
                    }
                    var obj = { name : item.name, sub_categories : item.sub_categories }
                    foodKindsSub.push(obj)
                })
                this.classifyCountAll = count
                this.allFoodKindsSub = foodKindsSub
            }
        },
        methods:{
            navScrollLeft(){
                return new BScroll(this.$refs.dropDownLeft,{
                    tap : 'leftTap'
                })

            },
            navScrollRight(){
                return new BScroll(this.$refs.dropDownRight,{
                    tap : 'rightTap'
                })
            },
            // 切换食物种类
            toggleFoodKinds( kindName ){
               if ( this.allFoodKindsSub ){
                   this.currentActive = kindName
                   this.allFoodKindsSub.some( item => {
                        if( item.name == kindName ) {
                            this.currentFoodKindSub = item.sub_categories
                            return true
                        }
                   })
               }
            },
        },
        mounted(){
            this.navScrollLeft()
            this.navScrollRight()
        },
        beforeDestroy(){
            this.navScrollLeft().destroy()
            this.navScrollRight().destroy()
        },
        props:['navClassifyInfoList']
    }
</script>

<style lang="less" scoped>
@import "../../../assets/less/food/children/navClassify";

</style>