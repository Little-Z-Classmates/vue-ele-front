# vue2-elm

### 填坑 : ele-ui 字体文件失效
```
原因 : vue.config.js  写了  assetsDir : path.join(__dirname , '/src/assets') 这行代码
导致静态文件在全部在src 中加载,但是,ele-ui 的资源在node_modules 里面
```

### 填坑 : home.vue 组件中 异步获取数据 点语法 显示属性 未定义
```
异步获取的数据为  : 
  cityGuessInfo{ 
      body: { 
          name : '深圳'
      }  
   }
home.vue中的data 数据 :  cityGuessInfo : {}
页面中 :{{ cityGuessInfo.body.name }}
报错 : 页面 name 属性未定义
-----------------------------------------------------------------------
原因 : 因为在使用数据的时候, 最终点出来的 name 是body点来的,但是body自己就未定义,
undefined.name 就报错了, 点语法只允许出现一个 undefined
-----------------------------------------------------------------------
解决 : data 中定义的时候 需要把body 一起加上,body就可以点属性了,虽然是undefined,但是不报错 
       data 中 :  cityGuessInfo{ 
                      body: {  }  
                  }
```
### 填坑 : .vue 的 style 定义 lang='less',引入 .css 会覆盖样式会的 问题
```text
!!!  注意 : 
   css-loader 对 import 的文件会当做外部资源 , 是把 import 的 css文件 单独提取出来，
并没有把其中的样式放在<style scoped>中解析, 所以导入 css 文件,就相当于 全局的样式
---------------------------------------------------------------------------------------------------------------------------
1. <style scoped>
        @import '../../assets/css/home.css';  
    </style>
/*这样写的话 import 的 css文件 就会 跳过 <style scoped> 解析 , 被编译为全局样式，*/
-------------------------------------------------------------------------------------------------------------
1.<style src="../../assets/css/home.css" scoped>
    </style>
/*这样写的 css文件 中的样式只能在本组件中使用，而不会影响其他组件*/
-------------------------------------------------------------------------------------------------------------
2. <style lang='less' scoped>
        @import '../../assets/css/home.less';  
    </style>
/*这样写的话 import 的 less文件, 就会在 <style  lang='less' scoped> 中交给 less预处理器 解析 ( scoped 局部生效 ) */
-------------------------------------------------------------------------------------------------------------
2. <style lang='less' >
        @import '../../assets/css/home.less';  
    </style>
/*这样写的话 import 的 less文件, 就会在 <style scoped> 中解析 ( 全局生效 )  */
```
### 注意 : process.env.NODE_ENV 为 环境, 为开发环境,或者 生产环境
```text
在 package.json 中, script属性中 , 你要输入的指令, 后面定义 环境
例如 : 
  "scripts": {
    "serve": "vue-cli-service process.env.NODE_ENV=development serve",
  },
```
### 填坑 : msite.vue 使用 swiper ,  获取数据渲染 轮播 , 之后 loop : true ( 无限滚动失效 )
```text
在 swiper 标签中添加  v-if='FootEntryInfo.length' 判断渲染页面时候,判断数据是否为空,为空就不加载,等到有数据再加载
BUG原因猜想 : 渲染页面的时候, swiper 为空, 数据为异步获取, 异步渲染swiper
loop 原理是 为前后添加一样的 swiper-slide (滚动图片),才能 导致无限滚动, 但是 loop作用的时候, 是swiper 生效的时候, 但是那时数据还未渲染上去
解决思路 : 应该是没有数据就不渲染swiper, loop 自然就不作用 在空的 swiper-slide (滚动图片)上,等到数据获取完毕,渲染时再让 loop 生效 
```
### 技术 : 外链 远程 js 文件
```text
    mounted() {
        const s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = 'http://at.alicdn.com/t/font_1084448_z400ks7cxv.js';
        document.body.appendChild(s);
    },
```
### 问题 : vue 怎么实现 移动端tap事件
```text
自定义指令? 
怎么把自定义指令做封装
```
### 问题 : babel.config.js 中配置
```text
babel.config.js 配置 mint-ui
官网 : 
{
  "presets": [
    ["es2015", { "modules": false }]
  ],
  "plugins": [["component", [
    {
      "libraryName": "mint-ui",
      "style": true
    }
  ]]]
}
我们的自己的配置 : 
    plugins: [
        [ "component",
          {
            "libraryName": "mint-ui",
            "style": true
          }
        ]
    ]
```
### 问题 : msite.vue 中的 下滚无限加载, 一开始会自动加载一次
```text
Mint-UI 中的 Infinite scroll , 有个属性 : infinite-scroll-immediate-check
默认一开始自动加载一次, 需要手动设置为 false,就不会已绑定上去就自动执行
```
### 问题 : msite.vue 中的 滚动到底部会加载一次, 往上滚一点又会执行一次
```text
infinite-scroll-distance 默认为 10 , 小于 等于 10 就会触发
设为 0  , 为只有到底后才为0 ,才能触发 加载函数
```
### 问题 : 官网上的 infinite-scroll-disabled 的值 为true 的话就禁止加载, 但是在我项目中 写了true, 不起作用
```text
infinite-scroll-disabled : banMoreLoading( true ) ---- 失效
原因 : 
解决方法 : 
```
### 问题 : 每次滚到底部,加载下一页完毕, 滚动条 没有停留在原地不动, 而是自动滚到底部,又自动开始加载下一页
```text
原因 : 找不到
解决方法 : 现在自动又好了
```
### 问题 : 移动端, 页面自动放大问题
```text
在我的手机自带浏览器打开, 会自动方法页面
如果在微信打开,就不会放大
原因 : 用 js 来控制 html 的px
解决方法 : 用vw 来做
```
### 问题 : element-UI 中的样式无法设置
```text
解决方法 : 再写一个 style , 没有 scoped 的
生成新问题 : 样式污染了,如果我下一个需求使用折叠面板, 样式只能作用与这个类型
```
### 问题 : navClassify.vue title 的下箭头, 无法设置 transition : all .3s
```
原因: 因为在浏览器中看到了, 标签的重绘, v-for 加了 :key,因为每次内容改变了,都要重绘
解决方法 : 
```
### 问题 : food.vue 具有三个子组件, 组件切换,数据不缓存
```
解决 : <keep-alive>
每次切换组件的时候, Vue 都创建了一个新的 组件实例, 传入数据也被清空了
有时会我们希望那些标签的组件实例 能够被在它们第一次被创建的时候缓存下来
用一个 <keep-alive> 元素将其动态组件包裹起来
```
### 问题 : food.vue 导航栏头部, 动画没有过渡, 虽然我设置了,过渡
```text
原因 : 因为 v-for, 我加了 key, 每次切换都重新 刷新组件, vue 的 复用属性没用 生效
解决 : 去掉 key,让组件复用,每次切换都复用, 过渡属性生效 
```
### 需要学习的技术 : 
```text
1. vue 无限滚动 DOM回收, 避免数据量过大,造成页面卡顿 ( 性能优化 )
3. 图片懒加载 ( mint-ui组件 ),加强练习
```
### 注意 : 最好不要修改 父组件传递给子组件的 原始数据
```text
会造成不可预料的错误
```