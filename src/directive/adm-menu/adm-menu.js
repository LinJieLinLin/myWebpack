require('./adm-menu.scss');
let templateUrl = require('./adm-menu.html');
if (!window.DIR) {
    window.DIR = angular.module('DIR', []);
}
/**
 * @author linj
 * @description 
 * adm菜单组件
 */
DIR.directive('admMenu', function($document) {
    return {
        template: templateUrl,
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            c: '=',
        },
        controller: function($scope, $rootScope, $location) {
            let c = $scope.c;
            let d = $scope.d = {};
            let f = $scope.f = {
                switchTab: (argData, argIndex, argChildIndex, argNocb) => {
                    if (c.disabled || argIndex < 0) {
                        return;
                    }
                    if (argData[argIndex].disabled) {
                        return;
                    }
                    let nowTab = null;
                    angular.forEach(argData, (v, k) => {
                        v.isActive = false;
                        if (k !== argIndex && c.type === 'accordion') {
                            v.showChild = false;
                        }
                        v.style = {};
                        if (k === argIndex && !v.disabled) {
                            if (argChildIndex > -1) {
                                v.showChild = true;
                            } else {
                                v.showChild = !v.showChild;
                            }
                            if (v.showChild) {
                                let temChildLength = 0;
                                angular.forEach(v.children, (temV) => {
                                    if (temV.show) {
                                        temChildLength++;
                                    }
                                });
                                v.style = { height: 58 * temChildLength + 'px', opacity: 1 };
                            }
                            v.isActive = true;
                            nowTab = v;
                        }
                        // 选中子时清空其它子选择
                        if (argChildIndex > -1) {
                            // 设置子选中
                            angular.forEach(v.children, (v1, k1) => {
                                v1.isActive = false;
                                if (k === argIndex && !v.disabled && k1 === argChildIndex && !v1.disabled) {
                                    v1.isActive = true;
                                }
                            });
                        }
                    });
                    if (c.clickFn && !argNocb) {
                        c.clickFn(nowTab, argChildIndex);
                    }
                },
            };
            $scope.init = () => {
                $scope.c.switchTab = f.switchTab;
            }
            $scope.init();
            // destroy监听
            // $scope.$on('$destroy', function() {});
        }
    };
});