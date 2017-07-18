var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
/*
extract-text-webpack-plugin插件，
有了它就可以将你的样式提取到单独的css文件里，
妈妈再也不用担心样式会被打包到js文件里了。
 */
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

var env = config.build.env

var webpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: true
        })
    },
    devtool: config.build.productionSourceMap ? '#source-map' : false,
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
    },
    plugins: [
        // 加载jq
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),
        new webpack.DefinePlugin({
            'process.env': env
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: true
        }),
        //单独使用link标签加载css并设置路径，相对于output配置中的publickPath
        new ExtractTextPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css')
        }),
        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        new OptimizeCSSPlugin({
            cssProcessor: require('autoprefixer'),
            cssProcessorOptions: {
                browsers: ['chrome > 35', 'ff > 10', 'opera > 10', 'ie > 8']
            },
        }),
        new webpack.optimize.CommonsChunkPlugin({
            // 将公共模块提取，生成名为`vendors`的chunk
            name: 'vendors',
            //提取哪些模块共有的部分
            chunks: ['index', 'list', 'about'],
            // 提取至少3个模块共有的部分
            minChunks: 3
        }),
        //HtmlWebpackPlugin，模板生成相关的配置，每个对于一个页面的配置，有几个写几个
        //根据模板插入css/js等生成最终HTML
        new HtmlWebpackPlugin({
            //favicon路径，通过webpack引入同时可以生成hash值
            favicon: './src/img/favicon.ico',
            //生成的html存放路径，相对于path
            filename: './view/index.html',
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
            filename: './view/list.html',
            template: './src/view/list.html',
            inject: true,
            hash: true,
            chunks: ['vendors', 'list'],
            minify: {
                removeComments: true,
                collapseWhitespace: false
            }
        }),
        new HtmlWebpackPlugin({
            favicon: './src/img/favicon.ico',
            filename: './view/about.html',
            template: './src/view/about.html',
            inject: true,
            hash: true,
            chunks: ['vendors', 'about'],
            minify: {
                removeComments: true,
                collapseWhitespace: false
            }
        }),
        // 复制静态文件
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../static'),
            to: config.build.assetsSubDirectory,
            ignore: ['.*']
        }])
    ]
})

if (config.build.productionGzip) {
    var CompressionWebpackPlugin = require('compression-webpack-plugin')

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' +
                config.build.productionGzipExtensions.join('|') +
                ')$'
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    )
}

if (config.build.bundleAnalyzerReport) {
    var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig