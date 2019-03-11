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

