/**
 * [设置限定多少个字后显示...]
 */
DYC.filter('short', function() {
    return function(text, length) {
        if (text && text.length > length) {
            return text.substring(0, length) + '...';
        } else {
            return text;
        }
    };
});