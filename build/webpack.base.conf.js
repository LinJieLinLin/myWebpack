let path = require('path');
let webpack = require('webpack');
let utils = require('./utils');
let config = require('../config');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
let sprite = require('sprite-webpack-plugin');
let cssConfig = require('./css-loader.conf');
let minimist = require('minimist');
let argv = minimist(process.argv.slice(2));
let entryObj = config.getEntry(argv._);
console.log('cmd:', argv);

// 获取正确路径
function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

// console.log('---------------\n', JSON.stringify(cssConfig));
module.exports = {
    entry: entryObj,
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.json'],
        // 指定node_modules路径，防止向上查找
        modules: [resolve('node_modules')],
        // 配置路径映射
        alias: {
            '@': resolve('src'),
            'lib': resolve('node_modules'),
            'ui': resolve('src/ui/src')
        }
    },
    module: {
        // 不解析这些文件的依赖
        noParse: /node_modules\/(jquey|moment|chart\.js)/,
        rules: [{
            test: /\.js$/,
            use: [{
                loader: 'ng-annotate-loader',
                options: {
                    add: true,
                    map: false,
                }
            }, {
                // 开启 babel-loader 缓存
                loader: 'babel-loader?cacheDirectory',
            }, {
                loader: 'eslint-loader',
                options: {
                    formatter: require('eslint-friendly-formatter'),
                    // loaders: cssConfig.cssLoaders1
                }
            }],
            // 不包括目录
            // exclude: [],
            // 包括目录
            include: [resolve('src'), resolve('test')]
        }, {
            // html模板加载器，可以处理引用的静态资源，默认配置参数attrs=img:src，处理图片的src引用的资源
            // 比如你配置，attrs=img:src img:data-src就可以一并处理data-src引用的资源了，就像下面这样
            test: /\.html$/,
            use: [
                { loader: 'html-loader?attrs=img:src img:data-src' }
            ]
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
    },
    'plugins': [
        // 雪碧图
        new sprite({
            'source': resolve('src/static/sprite/common'),
            'imgPath': resolve('src/static/sprite'),
            'cssPath': resolve('src/static/sprite'),
            'baseName': 'common',
        }),
        // 加载jq
        new webpack.ProvidePlugin({
            $: 'jquery',
            'window.jQuery': 'jquery',
            jQuery: 'jquery',
            _: 'lodash'
        }),
        new LodashModuleReplacementPlugin({
            'collections': true,
            'paths': true
        })
    ]
};