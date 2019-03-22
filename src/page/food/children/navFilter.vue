<template>
    <div class="fold-drop-down" >
        <div class="top">
            <div class="mode">
                <div>配送方式</div>
                <span><svg class="icon" aria-hidden="true"><use xlink:href="#icon-fengniao"></use></svg>蜂鸟专送</span>
            </div>
            <div class="sellerAttribute">
                <div>商家属性 ( 可以多选 )</div>
                <div>
                    <ul>
                        <li @click="toggleStatus(key,item.id)"
                            :class="item.status?'clickColor':''"
                            v-for="(item,key) in sellerActivityAttributesList">
                            {{ item.name }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="bottom">
            <mt-button type="default" @click="clearPitch">清空</mt-button>
            <mt-button type="primary" @click="$emit('toggleFilter',vipIdArr)">确定{{currentPitchAttributesNum !=0 ? '('+currentPitchAttributesNum+')':''}}</mt-button>
        </div>

    </div>
</template>

<script>
    import  { getSellerActivityAttributes } from "../../../service/getData"
    export default {
        data () {
            return {
                sellerActivityAttributesList: [], // 商家属性
                vipIdArr :[]
            }
        },
        computed:{
            // 当前选中的属性个数
            currentPitchAttributesNum(){
                var num = 0
                this.sellerActivityAttributesList.forEach( item => {
                    if ( item.status ){
                        num++
                    }
                })
                return num
            }
        },
        methods:{
            getSellerActivityAttributes,
            // 切换 选中状态
            toggleStatus( key,id ){
                var index =  this.vipIdArr.findIndex( item =>{
                    return  ( item == id )
                })
                if ( index == -1 ){
                    this.vipIdArr.push( id )
                } else{
                    this.vipIdArr.splice(index,1)
                }
                this.sellerActivityAttributesList[key].status = !this.sellerActivityAttributesList[key].status
            },
            // 清空
            clearPitch(){
                this.vipIdArr = []
                this.sellerActivityAttributesList.forEach( item =>{
                    item.status = false
                })
            }
        },
        created(){
            this.getSellerActivityAttributes(this).then( result =>{
                if ( result.status == 200){
                    // 对商家属性进行 过滤
                    var arr = result.body
                    arr.forEach( item =>{
                       item.status  = false
                    })
                    this.sellerActivityAttributesList = arr
                }
            })
        }
    }
</script>

<style lang="less" scoped>
    @import "../../../assets/less/food/children/navFilter";
</style>