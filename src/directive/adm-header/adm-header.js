require('./adm-header.scss');
let templateUrl = require('./adm-header.html');
if (!window.DIR) {
    window.DIR = angular.module('DIR', []);
}
/**
 * @author linj
 * @description 
 * 头部组件
 * c:{
 * headerData: {
 * navList: nav连接列表,
 logo: {
 href: 图标连接,
 small: 小图标,
}}
 * }
 */
DIR.directive('admHeader', function($document) {
    return {
        template: templateUrl,
        restrict: 'AE',
        replace: true,
        transclude: true,
        scope: {
            c: '=',
        },
        controller: function($scope, $rootScope, $element, $attrs, service) {
            let c = $scope.c;
            let d = $scope.d = {};
            let f = $scope.f = {
                logout: () => {
                    location.href = rcpAid.getUrl('退出', {
                        url: encodeURIComponent(location.protocol + '//' + location.host + '/login.html')
                    });
                }
            };
            $scope.init = () => {
                d.fromUrl = rcpAid.getUrl('url') || '';
                d.currentUser = $rootScope.G.currentUser;
            }
            $scope.init();
            // destroy监听
            // $scope.$on('$destroy', function() {});
        }
    };
});