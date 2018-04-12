require('./dy-page.scss');
let templateUrl = require('./dy-page.html');
if (!window.DIR) {
    window.DIR = angular.module('DIR', []);
}
/**
 * @author linj
 * @description 
 * 分页组件
 * c.pageConfig = {
 * hideEnd: 是否隐藏最后两页
 * hideJump: 是否隐藏页面跳转
 * changeFn: 切换页面回调,
 * pageInfo: {
 *  pn: 页码
 *  ps: 每页数
 *  total: 总数
 * }页码信息,
 * showNum: 前面显示页码数,
 * };
 * c.pageConfig.init()可更新数据
 */
DIR.directive('dyPage', function($document) {
    return {
        template: templateUrl,
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            c: '=',
        },
        controller: function($scope, $element, $attrs) {
            let c = $scope.c;
            let d = $scope.d = {
                pageNum: 0,
            };
            let f = $scope.f = {
                countPageNum: () => {
                    if (!c.pageInfo.pn) {
                        console.log(c.pageInfo);
                        return;
                    }
                    d.pageNum = Math.ceil(c.pageInfo.total / c.pageInfo.ps);
                    d.pageList = [];
                    for (let i = 0; i < d.pageNum; i++) {
                        d.pageList[i] = i + 1;
                    }
                    d.pageStart = c.pageInfo.pn - 1 - Math.ceil((c.showNum - 1) / 2);
                    d.pageEnd = c.pageInfo.pn - 1 + Math.floor((c.showNum - 1) / 2);
                    if (c.pageInfo.pn <= Math.ceil((c.showNum - 1) / 2)) {
                        d.pageEnd = c.showNum - 1;
                    }
                    if (d.pageNum - c.pageInfo.pn < Math.floor((c.showNum - 1) / 2)) {
                        d.pageStart = d.pageNum - c.showNum;
                    }
                    if (!c.hideEnd && d.pageNum - d.pageEnd < 2 && d.pageNum > c.showNum) {
                        d.pageEnd = d.pageNum - 3;
                        d.pageStart = d.pageStart - 2;
                    }
                    if (!c.hideEnd && d.pageNum - d.pageEnd === 2 && d.pageNum > c.showNum) {
                        d.pageEnd = d.pageNum - 3;
                        d.pageStart = d.pageStart - 1;
                    }
                },
                changePage: (argNum) => {
                    if (argNum < 0) {
                        return;
                    }
                    c.pageInfo.pn = argNum;
                    if (c.changeFn) {
                        c.changeFn(f.countPageNum);
                    } else {
                        f.countPageNum();
                    }
                }
            }
            $scope.init = () => {
                // 显示页码数
                c.showNum = c.showNum || 5;
                d.pageStart = 0;
                d.pageEnd = c.showNum - 1;
                if (d.pageNum === c.showNum + 1) {
                    d.pageEnd = c.showNum - 2;
                }
                if (c.changeFn) {
                    c.changeFn(f.countPageNum);
                } else {
                    f.countPageNum();
                }
            }
            c.init = $scope.init;
            $scope.init();
            // destroy监听
            // $scope.$on('$destroy', function() {});
        }
    };
});