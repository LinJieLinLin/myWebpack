let HtmlWebpackPlugin = require('html-webpack-plugin');
// 页面配置obj
let pageObj = {},
    // 页面配置arr
    pageArr = [],
    // chunk列表
    entry = {
        'libs': './src/common/libs.js',
        'service': './src/common/service.js',
    };
pageObj = {
    // 首页 key为chunksName;
    'index': {
        main: './src/js/page/index.js',
        filename: './index.html',
        template: './src/view/index.html',
        chunks: ['vendors', 'index', 'jquery'],
    },
    // 登陆页
    'login': {
        main: './src/sso/login/login.js',
        filename: './login.html',
        template: './src/sso/index.html',
        chunks: ['libs', 'service', 'login'],
    },
    // 列表页
    'list': {
        main: './src/js/page/list.js',
        filename: './list.html',
        template: './src/view/list.html',
        chunks: ['vendors', 'list', 'jquery'],
    }
};
// 获取页面配置arr
Object.keys(pageObj).forEach(function(key) {
    pageArr.push(pageObj[key]);
});
let entryFn = (argPageList) => {
    if (argPageList.length) {
        pageArr = [];
        argPageList.forEach((v) => {
            if (pageObj[v]) {
                entry[v] = pageObj[v].main;
                pageArr.push(pageObj[v]);
            } else {
                console.log(v, '不匹配');
            }
        });
    } else {
        Object.keys(pageObj).forEach(function(key) {
            entry[key] = pageObj[key].main;
        });
    }
    console.log(argPageList, entry);
    return entry;
};
module.exports = {
    build: pageArr,
    dev: pageArr,
    getEntry: entryFn,
};