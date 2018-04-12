// 编译html代码
DYC.filter('html', function($sce) {
    return function(text) {
        return $sce.trustAsHtml(text);
    };
});
// 过滤html代码
DYC.filter('text', function($sce) {
    return function(text) {
        return text.replace(/<\/?[^>]*>/g, '');
    };
});
// 加粗匹配文本
DYC.filter('matchText', function($sce) {
    return function(text, argKey) {
        let tmpl = '<b>' + argKey + '</b>';
        let reg = /([[\](){}*?+^$.|\\])/ig;
        let str = argKey.replace(reg, '\\$1');
        text = text.replace(new RegExp(str, 'ig'), tmpl);
        return $sce.trustAsHtml(text);
    };
});