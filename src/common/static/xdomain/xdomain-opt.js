/**
 * Created by Fox2081 on 2016/6/29.
 */

;(function () {
    var srvList = DYCONFIG.srvList;
    if (!srvList) {
        return;
    }
    var protocol = DYCONFIG.protocol || window.location.protocol;
    var obj = {};
    Object.keys(srvList).forEach(function (key) {
        var url = srvList[key];
        var arr = url.split('://');
        url = arr[1] || arr[0];
        url = url.split('/')[0];
        if (url) {
            url = protocol + '//' + url;
            obj[url] = '/proxy.html';
        }
    });

    xdomain.slaves(obj);
})();