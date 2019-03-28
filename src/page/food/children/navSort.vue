<template>
    <div class="fold-drop-down" ref="dropDown">
        <ul>
            <li @tap="$emit('toggleSort', item.old_id )" v-for="item in SortList" :key="item.old_id"><svg class="icon" aria-hidden="true"><use :xlink:href="item.icon"></use></svg>{{ item.name }}</li>
        </ul>
    </div>
</template>

<script>
    import BScroll from "better-scroll"

    export default {
        data(){
            return {
                currentSortName : '智能排序',
                SortList :[
                    { old_id : 4 , name : '智能排序',icon:'#icon-paixu'},
                    { old_id : 6 , name : '距离最近',icon:'#icon-juli1'},
                    { old_id : 5 , name : '销量最高',icon:'#icon-huo3'},
                    { old_id : 1 , name : '起送价最低', icon:'#icon-jinbi2'},
                    { old_id : 2 , name : '配送速度最快',icon:'#icon-shijian1'},
                    { old_id : 3 , name : '评分最高',icon:'#icon-xing-copy'},
                ]
            }
        },
        mounted () {
            this.useBScroll ()
        },
        beforeDestroy(){
            this.useBScroll ().destroy()
        },
        methods : {
            useBScroll () {
                return new BScroll ( this.$refs.dropDown,{
                    tap : 'tap'
                } )
            }
        },
        props : []
    }
</script>

<style lang="less" scoped>
    @import "../../../assets/less/food/children/navSort";

</style>