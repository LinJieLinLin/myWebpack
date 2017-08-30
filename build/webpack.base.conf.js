var path = require('path')
var utils = require('./utils')
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var cssConfig = require('./css-loader.conf')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}
// console.log('---------------\n', JSON.stringify(cssConfig));
module.exports = {
    entry: {
        index: './src/js/page/index.js',
        about: './src/js/page/about.js',
        list: './src/js/page/list.js',
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            '@': resolve('src'),
        }
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'eslint-loader',
            enforce: "pre",
            include: [resolve('src'), resolve('test')],
            options: {
                formatter: require('eslint-friendly-formatter'),
                // loaders: cssConfig.cssLoaders1
            }
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            // 不包括目录
            // exclude: [],
            // 包括目录
            include: [resolve('src'), resolve('test')]
        }, {
            //html模板加载器，可以处理引用的静态资源，默认配置参数attrs=img:src，处理图片的src引用的资源
            //比如你配置，attrs=img:src img:data-src就可以一并处理data-src引用的资源了，就像下面这样
            test: /\.html$/,
            use: "html-loader?attrs=img:src img:data-src"
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader',
            //图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
            //如下配置，将小于18192byte的图片转成base64码
            query: {
                limit: 18192,
                name: utils.assetsPath('img/[name].[ext]')
            }
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            query: {
                limit: 10000,
                name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
            }
        }]
    }
};
