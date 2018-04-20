require('./dy-tab.scss');
let templateUrl = require('./dy-tab.html');
if (!window.DIR) {
    window.DIR = angular.module('DIR', []);
}
/**
 * @author linj
 * @description 
 * tab组件
 * c.tabConfig = {
 *  type: line:线状tab btn：按钮状tab menu: 菜单tab
 *  numType: '默认为空，'ab':1000显示1k 10000显示1W'
 *  data: [
 *       name: 名称,
 *       isActive: 是否选中,
 *       unRead: 有未读数据（for 圈子）,
 *       msgNum: 消息数,
 *       hide：隐藏当前tab,
 *       icon: 图标 class,
 *       iconRight: 右边图标 class,
 *       disabled: true 禁用单个,不能点击,
 *   ] tab列表信息
 *   clickFn: tab点击回调事件
 * };
 */
DIR.directive('dyTab', function($document) {
    return {
        template: templateUrl,
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            c: '=',
        },
        controller: function($scope, $rootScope, $element, $attrs) {
            let c = $scope.c;
            let d = $scope.d = {};
            let f = $scope.f = {
                switchTab: (argIndex) => {
                    if (c.disabled || argIndex < 0) {
                        return;
                    }
                    if (c.data[argIndex].disabled) {
                        return;
                    }
                    let nowTab = null;
                    angular.forEach(c.data, (v, k) => {
                        v.isActive = false;
                        if (k === argIndex && !v.disabled) {
                            v.isActive = true;
                            nowTab = v;
                        }
                    });
                    if (c.clickFn) {
                        c.clickFn(nowTab);
                    }
                },
            };
            $scope.init = () => {
                d.isIE9 = $rootScope.G.isIE9;
            }
            $scope.init();
            // destroy监听
            // $scope.$on('$destroy', function() {});
        }
    };
});