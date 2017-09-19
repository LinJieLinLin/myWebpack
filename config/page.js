var path = require('path');
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
    // UI库
    'ui': {
        main: './src/ui/src/index.js',
        filename: './index.html',
        template: './src/ui/src/index.html',
        chunks: ['libs', 'service', 'ui'],        
    },
    // test
    'test': {
        main: './src/directive/test.js',
        filename: './test.html',
        template: './src/directive/test.html',
        chunks: ['libs', 'service', 'test'],
    }
};
// 获取正确路径
function resolve(dir) {
    return path.join(__dirname, '..', dir);
}
// 获取页面配置arr
Object.keys(pageObj).forEach(function(key) {
    pageObj[key].main = resolve(pageObj[key].main);
    console.log(pageObj[key].main);
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