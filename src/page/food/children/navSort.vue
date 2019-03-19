<template>
    <div class="fold-drop-down" ref="dropDown">
        <ul>
            <li><svg class="icon" aria-hidden="true"><use xlink:href="#icon-paixu"></use></svg>智能排序</li>
            <li><svg class="icon" aria-hidden="true"><use xlink:href="#icon-juli1"></use></svg>距离最近</li>
            <li><svg class="icon" aria-hidden="true"><use xlink:href="#icon-huo3"></use></svg>销量最高</li>
            <li><svg class="icon" aria-hidden="true"><use xlink:href="#icon-jinbi2"></use></svg>起送价最低</li>
            <li><svg class="icon" aria-hidden="true"><use xlink:href="#icon-shijian1"></use></svg>配送速度最快</li>
            <li><svg class="icon" aria-hidden="true"><use xlink:href="#icon-xing-copy"></use></svg>评分最高</li>
        </ul>
    </div>
</template>

<script>
    import BScroll from 'better-scroll'

    export default {
     mounted(){
         this.useBScroll()
     },
     methods:{
            useBScroll(){
                var dropDown = this.$refs.dropDown
                let scroll = new BScroll( dropDown )
            }
     },
     props:[]
    }
</script>

<style lang="less" scoped>
 @import "../../../assets/less/food/children/navSort";

</style>