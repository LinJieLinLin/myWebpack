require('./dy-load.scss');
let templateUrl = require('./dy-load.html');
if (!window.DIR) {
    window.DIR = angular.module('DIR', []);
}
/**
 * [列表加载，加载中显示loading,加载完无数据显示默认无数据的图]
 * c:{
 * load: true显示loading
 * empty: true显示空数据
 * img: 背景图
 * tip: 无数据提示语
 * imgClass: 默认图class  img-0:无数据显示的图片垂直居中 img-1:无数据显示的图片水平居中 img-2:无数据显示的图片水平100%;
 * posClass: loading位置class，eg:c-fixed:浏览器垂直居中,c-absolute:加载位置为垂直居中,c-default:默认加载position top:10的位置
 * }
 * eg: <div dy-load c="c.loadData">
 */
DIR.directive('dyLoad', function() {
    return {
        template: templateUrl,
        restrict: 'A',
        replace: true,
        transclude: true,
        scope: {
            c: '=',
        },
        link: function($scope, $element) {},
    };
});