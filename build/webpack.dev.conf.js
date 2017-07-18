var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
/*
extract-text-webpack-plugin插件，
有了它就可以将你的样式提取到单独的css文件里，
妈妈再也不用担心样式会被打包到js文件里了。
 */
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function(name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
    },
    // cheap-module-eval-source-map is faster for development
    devtool: '#cheap-module-eval-source-map',
    plugins: [
        // 加载jq
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),
        new webpack.optimize.CommonsChunkPlugin({
            // 将公共模块提取，生成名为`vendors`的chunk
            name: 'vendors',
            //提取哪些模块共有的部分
            chunks: ['index'],
            // 提取至少3个模块共有的部分
            minChunks: 3
        }),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        //HtmlWebpackPlugin，模板生成相关的配置，每个对于一个页面的配置，有几个写几个
        //根据模板插入css/js等生成最终HTML
        new HtmlWebpackPlugin({
            //favicon路径，通过webpack引入同时可以生成hash值
            favicon: './src/img/favicon.ico',
            //生成的html存放路径，相对于path
            filename: './index.html',
            //html模板路径
            template: './src/view/index.html',
            //js插入的位置，true/'head'/'body'/false
            inject: 'body',
            //为静态资源生成hash值
            hash: true,
            //需要引入的chunk，不配置就会引入所有页面的资源
            chunks: ['vendors', 'index', 'jquery'],
            //压缩HTML文件  
            minify: {
                //移除HTML中的注释
                removeComments: true,
                //删除空白符与换行符
                collapseWhitespace: false
            }
        }),
        //根据模板插入css/js等生成最终HTML
        new HtmlWebpackPlugin({
            favicon: './src/img/favicon.ico',
            filename: './list.html',
            template: './src/view/list.html',
            inject: true,
            hash: true,
            chunks: ['vendors', 'index'],
            minify: {
                removeComments: true,
                collapseWhitespace: false
            }
        }),
        new HtmlWebpackPlugin({
            favicon: './src/img/favicon.ico',
            filename: './about.html',
            template: './src/view/about.html',
            inject: true,
            hash: true,
            chunks: ['vendors', 'index'],
            minify: {
                removeComments: true,
                collapseWhitespace: false
            }
        }),
        new FriendlyErrorsPlugin()
    ]
})
