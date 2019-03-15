<template>
    <div id="app">
        <transition name="fade" mode="out-in" >
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    export default {

    }
</script>

<style lang="less">
    @import "assets/less/base/base";
    .fade-enter,.fade-leave-to{
        opacity: 0;
    }
    .fade-enter-active,.fade-leave-active{
        transition : all .3s ;
    }
</style>
