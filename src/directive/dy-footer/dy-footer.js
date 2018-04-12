require('./dy-footer.scss');
let templateUrl = require('./dy-footer.html');
if (!window.DIR) {
    window.DIR = angular.module('DIR', []);
}
/**
 * @author linj
 * @description 
 * 底部组件
 * d.footerConfig = {};
 */
DIR.directive('dyFooter', function($document) {
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
            $scope.init = () => {
                d.isIE9 = $rootScope.G.isIE9;
                d.showMatchList = false;
            }
            $scope.init();
            // destroy监听
            // $scope.$on('$destroy', function() {});
        }
    };
});