<template>
    <div class="homeContainer">
        <header id="header">
            <span class="header_logo">小Z-ele</span>
            <div>
                <a href="#">登录</a>
                <i> | </i>
                <a href="#">注册</a>
            </div>
        </header>
        <nav id="nav">
            <div class="topNav">
                <span>当前定位城市 : </span>
                <span>定位不准时,请在城市列表中选择</span>
            </div>
            <router-link :to="'/city/'+cityGuessInfo.data.id" class="bottomNav">
                <span>{{ cityGuessInfo.data.name }}</span>
                <i class="el-icon-arrow-right"></i>
            </router-link>
        </nav>
        <section class="hotCity">
            <div>热门城市</div>
            <ul>
                <router-link tag="li" :to="'/city/'+ item.id" v-for="item in hotCityGuessInfo.data" :key="item.id">{{
                    item.name }}
                </router-link>
            </ul>
        </section>
        <main id="main">
            <div class="piece" v-for="( item,key ) in groupCityGuessInfo" :key="item.id">
                <div class="letter">{{ key }}<span>{{ key == "A" ? "(按字母排序)" : "" }}</span></div>
                <ul>
                    <router-link tag="li" :to="'/city/'+ val.id" v-for="val in item" :key="val.id">{{ val.name }}
                    </router-link>
                </ul>
            </div>
        </main>
    </div>
</template>

<script>
    import { cityGuess } from "../../service/getData"
    import { hotCityGuess } from "../../service/getData"
    import { groupCityGuess } from "../../service/getData"
    import  { fullScreen } from "../../config/jsTools"
    import  { judgeFullScreen } from "../../config/jsTools"
    export default {
        data () {
            return {
                cityGuessInfo : { data: {} },
                hotCityGuessInfo : { data : {} },
                groupCityGuessInfo : {},
                loading : '' ,
                loadingKey : 3,
                currentLoadingKey : 0
            }
        },
        created () {
            this.move()
            this.fullScreen ( this )
            this.cityGuess ( this ).then ( results => {
                this.cityGuessInfo = results;
                this.judgeFullScreen(this)
            } ).catch ( err => { console.log ( err ) } )
            this.hotCityGuess ( this ).then ( results => {
                this.hotCityGuessInfo = results ;
                this.judgeFullScreen( this )
            } ).catch ( err => {  console.log ( err )   } )
            this.groupCityGuess ( this ).then ( results => {
                this.sort ( results.data );
                this.judgeFullScreen( this )
            } ).catch ( err => {   console.log ( err )} )
        },
        methods : {
            cityGuess,
            hotCityGuess,
            groupCityGuess,
            fullScreen,
            judgeFullScreen,
            // 排序 字母
            sort ( oldObj ) {
                var infoObj = {}
                for ( var key in oldObj ) {
                    var num = 4 - ( oldObj[ key ].length % 4 )
                    if ( num != 4 ) {
                        for ( var i = 0 ; i < num ; i ++ ) {
                            var obj = { id : new Date ().getTime () * Math.random () * Math.random (), name : "" }
                            oldObj[ key ].push ( obj )
                        }
                    }
                }

                for ( var i = 65 ; i <= 90 ; i ++ ) {
                    for ( var key in  oldObj ) {
                        if ( key.toLocaleUpperCase ().charCodeAt () == i ) {
                            infoObj[ key ] = oldObj[ key ]
                        }
                    }
                }
                this.groupCityGuessInfo = infoObj
            },
            // 定义一个 可以滚动的方法
            move(){
                var mo=function(e){ e.preventDefault() }
                document.body.style.overflow='';
                document.removeEventListener("touchmove",mo,false);
            }
        },
        components : {}
    }
</script>

<style lang="less" scoped>
    @import "../../assets/less/home/home";
    @import "../../assets/less/base/header";
</style>