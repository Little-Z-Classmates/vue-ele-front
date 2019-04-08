<template>
    <div class="error">
        <myheader :sellerName="sellerName" @goToBack="goToBack"></myheader>
        <img src="../../assets/image/404.jpg" alt="">
    </div>
</template>

<script>
    import myheader from "../../components/header/header.vue"
    export default {
        data(){
          return {
              sellerName : '页面丢失404...'
          }
        },
        components:{
            myheader : myheader
        },
        methods:{
            goToBack(){
                this.$router.go(-2)
            }
        }
    }
</script>

<style lang="less" scoped>
    .error{
        padding-top: .45rem;
        background-color: #000;
        height: 100vh;
    }
 img{
     position: absolute;
     top: 50%;
     transform: translateY(-50%);
     width: 100%;
 }
</style>