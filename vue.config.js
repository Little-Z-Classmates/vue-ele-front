/**
 *@作者 : 小Z同学
 *@TheFileFunction ：
 *@CreatedDate : 2019/3/9
 **/
const path = require('path')
module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/172.20.179.1:3000'
        : '/',
    outputDir: path.join( __dirname , '/dist'),
    // assetsDir : path.join(__dirname , '/src/assets'),
    indexPath : path.join( __dirname , '/dist'),
    filenameHashing: true,
    pages: {
        index: {
            // page 的入口
            entry: path.join( __dirname , 'src/main.js'),
            // 模板来源
            template: 'public/index.html',
            // 在 dist/index.html 的输出
            filename: 'index.html',
            favicon: 'public/bitbug_favicon.ico',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: '宇宙无敌超级战舰',
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
    },
    devServer: {
        open: true,
        // host: '192.168.18.27',
        port: 3000,
        https: false,
        hotOnly: false,
    },
}