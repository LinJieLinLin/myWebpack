let utils = require('./utils');
let webpack = require('webpack');
let config = require('../config');
let merge = require('webpack-merge');
let baseWebpackConfig = require('./webpack.base.conf');
/*
extract-text-webpack-plugin插件，
将的样式提取到单独的css文件里，
 */
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');

// 按模板生成html
let pagesFn = () => {
    let pages = [];
    config.dev.pages.map((d) => {
        if (!d.filename || !d.template) {
            return;
        }
        let data = {
            //生成的html存放路径，相对于path
            filename: d.filename,
            //html模板路径
            template: d.template,
            //js插入的位置，true/'head'/'body'/false
            inject: d.inject || 'body',
            //为静态资源生成hash值
            hash: d.hash || true,


            //压缩HTML文件  
            minify: d.minify || {
                //移除HTML中的注释
                removeComments: true,
                //删除空白符与换行符
                collapseWhitespace: false
            }
        };
        if (d.favicon) {
            //favicon路径，通过webpack引入同时可以生成hash值
            data.favicon = d.favicon;
        }
        if (d.chunks) {
            //需要引入的chunk，不配置就会引入所有页面的资源
            data.chunks = d.chunks;
        }
        pages.push(new HtmlWebpackPlugin(data));
    });
    return pages;
};

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function(name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name]);
});

module.exports = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
    },
    // cheap-module-eval-source-map is faster for development
    devtool: '#cheap-module-eval-source-map',
    plugins: [        
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     // 将公共模块提取，生成名为`vendors`的chunk
        //     name: 'vendors',
        //     //提取哪些模块共有的部分不填默认提取全部
        //     chunks: ['index', 'list', 'about'],
        //     // 提取至少3个模块共有的部分不填默认提取所有公共的部分
        //     minChunks: 4
        // }),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new FriendlyErrorsPlugin(),
    ].concat(pagesFn())
});