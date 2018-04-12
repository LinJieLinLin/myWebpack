require('./dy-search.scss');
let templateUrl = require('./dy-search.html');
if (!window.DIR) {
    window.DIR = angular.module('DIR', []);
}
/**
 * @author linj
 * @description 
 * 搜索组件
 * d.searchConfig = {
 *  maxlength: 50, 字数
 *  key: '', 搜索内容
 *  placeholder: ''placeholder显示内容
 *  matchList: [], 匹配列表
 *  matchFn: f.matchFn, 匹配函数
 *  cb: f.search, 搜索回调
 *  changeFn: f.searchChange, 搜索内容改变回调
 *  lightStyle: 搜索框是否使用主题色
 * };
 */
DIR.directive('dySearch', function($document) {
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