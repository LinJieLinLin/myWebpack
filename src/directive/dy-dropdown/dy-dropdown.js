require('./dy-dropdown.scss');
let templateUrl = require('./dy-dropdown.html');
if (!window.DIR) {
    window.DIR = angular.module('DIR', []);
}
/**
 * @author linj
 * @description 
 * dropdown组件
 * c:{
 * nowData: {
 *  name: ***
 * } 默认选中
 * data: [{
 name: '教学中心', 显示名称 1
 href: rcpAid.getUrl('教学中心'), 连接地址 0
 target: '', a标签的target link 0
 topLine: true, 是否显示上分割线 0
}],
type: 'link', link: a标签，连接，click：div标签，有点击事件
clickFn: null, 点击事件
hide: false, 是否隐藏
}
*/
DIR.directive('dyDropdown', function($document) {
    return {
        template: templateUrl,
        restrict: 'AE',
        replace: true,
        scope: {
            c: '=',
        },
        controller: function($scope, $element, $attrs, service, $timeout) {
            let c = $scope.c;
            let d = $scope.d = {};
            let f = $scope.f = {
                clickFn: (argItem) => {
                    c.nowData = argItem;
                    if (typeof c.clickFn === 'function') {
                        c.clickFn(argItem);
                    }
                },
                docClick: () => {
                    if (!$scope.c.hide) {
                        $timeout(() => {
                            console.error(3);
                            $scope.c.hide = true;
                        }, 0);
                    }
                },
            };
            $scope.init = () => {
                $(document).on('click', f.docClick);
            };
            $scope.init();
            // destroy监听
            $scope.$on('$destroy', function() {
                $(document).off('click', f.docClick);
            });
        }
    };
});