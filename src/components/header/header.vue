<template>
    <header id="header">
        <svg class="icon" aria-hidden="true" @click="goBack">
            <use xlink:href="#icon-xiangyou"></use>
        </svg>
        <span class="title">{{ sellerName }}</span>
    </header>
</template>

<script>
    export default {
        data(){
            return {
            }
        },
        methods:{
            goBack(){
                this.$router.go(-1)
            }
        },
        props:[ 'sellerName' ]
    }
</script>

<style lang="less" scoped>
@import "../../assets/less/base/header2";

</style>