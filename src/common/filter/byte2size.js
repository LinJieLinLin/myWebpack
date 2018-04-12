/**
 * [byte 转成KB MB GB 显示]
 * @param  {Array}  sizes [description]
 * @return {[type]}       [description]
 */
DYC.filter('b2s', function() {
    return function(argByte) {
        if (!argByte) {
            return 0 + 'B';
        }
        let k = 1024,
            sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(argByte) / Math.log(k));
        return (argByte / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
    };
});