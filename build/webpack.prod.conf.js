let path = require('path');
let utils = require('./utils');
let webpack = require('webpack');
let config = require('../config');
let merge = require('webpack-merge');
let baseWebpackConfig = require('./webpack.base.conf');
let CopyWebpackPlugin = require('copy-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
/*
extract-text-webpack-plugin插件，
 */
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

let env = config.build.env;
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
        // chunks排序
        if (d.chunksSortMode) {            
            data.chunksSortMode = d.chunksSortMode;
        } else {
            data.chunksSortMode = (c1, c2) => {
                let list = d.chunks,
                    o1 = list.indexOf(c1.names[0]),
                    o2 = list.indexOf(c2.names[0]);
                if (o1 > o2) {
                    return 1;
                } else if (o1 < o2) {
                    return -1;
                }
            };
        }
        pages.push(new HtmlWebpackPlugin(data));
    });
    return pages;
};
let webpackConfig = merge(baseWebpackConfig, {
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
        new webpack.DefinePlugin({
            'process.env': env
        }),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            comments: false,
            compress: {
                warnings: false,
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
        // 复制静态文件
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../src/static'),
            to: config.build.assetsSubDirectory,
            ignore: ['.*']
        }])
    ].concat(pagesFn())
});

if (config.build.productionGzip) {
    let CompressionWebpackPlugin = require('compression-webpack-plugin');

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
    );
}

if (config.build.bundleAnalyzerReport) {
    let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;