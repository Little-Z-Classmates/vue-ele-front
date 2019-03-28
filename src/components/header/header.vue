<template>
    <header id="header">
        <svg class="icon" aria-hidden="true" @click="$emit('goToBack')">
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
        },
        props:[ 'sellerName' ]
    }
</script>

<style lang="less" scoped>
@import "../../assets/less/base/header2";

</style>