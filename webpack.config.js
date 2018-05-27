var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: {
        img_js: [
            __dirname + '/app/common/imgCut/imgCut.js',
            __dirname + '/app/common/jquery-easyui-1.4/jquery.easyui.min.js',
            __dirname + '/app/common/jquery.msg/jquery.msg.js',
            __dirname + '/app/common/imgCut/jquery.corner.js',
            __dirname + '/app/common/imgCut/utils.js',
            __dirname + '/app/common/imgCut/grouponHotImgCut.js'
        ],
        img_css: [
            __dirname + '/app/mcommon/jquery-easyui-1.4/easyui.css',
            __dirname + '/app/common/jquery-easyui-1.4/icon.css',
            __dirname + '/app/common/jquery.msg/jquery.msg.css'
        ],
        work: __dirname + '/app/work.js'
    },
    output: {
        path: __dirname + '/build',
        filename: '[name].bundle.min.js',
        //chunkFilename: '[id].bundle.js'//chunkname我的理解是未被列在entry中，却又需要被打包出来的文件命名配置。什么场景需要呢？我们项目就遇到过，在按需加载（异步）模块的时候，这样的文件是没有被列在entry中的，如使用CommonJS的方式异步加载模块：
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './app/main.html',//相对于根目录
            filename: 'main.html',
            title: 'img location',
            inject: true,
            hash: true,
            chunks: ['img_css','img_js']
        }),
        new HtmlWebpackPlugin({
            template: './app/work.html',//相对于根目录
            filename: 'work.html',
            title: 'work title',
            inject: true,
            hash: true,
            chunks: ['work']
        }),
    ]
}