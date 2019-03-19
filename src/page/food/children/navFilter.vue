<template>
    <div class="fold-drop-down">
        <div class="top">
            <div class="mode">
                <div>配送方式</div>
                <span><svg class="icon" aria-hidden="true"><use xlink:href="#icon-fengniao"></use></svg>蜂鸟专送</span>
            </div>
            <div class="sellerAttribute">
                <div>商家属性 ( 可以多选 )</div>
                <div>
                    <ul>
                        <li>品牌商家</li>
                        <li>品牌商家</li>
                        <li>品牌商家</li>
                        <li>品牌商家</li>
                        <li>品牌商家</li>
                        <li>品牌商家</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="bottom">
            <mt-button  type="default">清空</mt-button>
            <mt-button  type="primary">确定</mt-button>
        </div>

    </div>
</template>

<script>
    export default {

    }
</script>

<style lang="less" scoped>
@import "../../../assets/less/food/children/navFilter";
</style>