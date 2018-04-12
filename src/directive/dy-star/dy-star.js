require('./dy-star.scss');
let templateUrl = require('./dy-star.html');
if (!window.DIR) {
    window.DIR = angular.module('DIR', []);
}
/**
 * @author linj
 * @description 
 * 评分星星组件
 * data：数值变量
 * num: 星星总数
 */
DIR.directive('dyStar', function($document) {
    return {
        template: templateUrl,
        restrict: 'E',
        replace: true,
        scope: {
            data: '=',
            num: '@',
        },
        link: function($scope, $element, $attrs) {
            let d = $scope.d = {};
            let f = $scope.f = {
                // 设置星星数
                setData: (argData, argType) => {
                    if (argType === 'enter') {
                        d.data = $scope.data;
                        $scope.data = argData + 1;
                    } else if (argType === 'leave') {
                        $scope.data = d.data;
                    } else {
                        $scope.data = argData + 1;
                        d.data = $scope.data;
                    }
                },
            }
            $scope.init = () => {
                d.starList = new Array(+$scope.num || 5);
            }
            $scope.init();
            // destroy监听
            // $scope.$on('$destroy', function() {});
        }
    };
});