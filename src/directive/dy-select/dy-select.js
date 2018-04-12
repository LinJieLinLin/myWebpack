require('./dy-select.scss');
let templateUrl = require('./dy-select.html');
if (!window.DIR) {
    window.DIR = angular.module('DIR', []);
}
/**
 * @author linj
 * @description 
 * select组件 同 dropdown
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
parent: ''父级元素selector
type: 'link', link: a标签，连接，click：div标签，有点击事件
clickFn: null, 点击事件
hide: false, 是否隐藏
}
*/
DIR.directive('dySelect', function($document) {
    return {
        template: templateUrl,
        restrict: 'AE',
        replace: true,
        transclude: true,
        scope: {
            c: '=',
        },
        link: function($scope, $element) {
            let c = $scope.c;
            let d = $scope.d = {};
            let f = $scope.f = {
                showSelect: () => {
                    if (c.hide) {
                        let e = $element,
                            element = e[0],
                            // 窗口高度，当parent有时，为parent元素高度
                            winHeight = window.innerHeight,
                            // 窗口高度
                            winWidth = window.innerWidth,
                            // select元素高度
                            eHeight = e[0].offsetHeight,
                            // select元素宽度
                            eWidth = e[0].offsetWidth,
                            // select元素上偏移 当parent有时，为相对parent元素偏移
                            eTop = rcpAid.getElementPosition(e[0]).top,
                            // select元素左偏移 当parent有时，为相对parent元素偏移
                            eLeft = rcpAid.getElementPosition(e[0]).left,
                            // dropdown元素的可用高度
                            drHeight = null,
                            // dropdown元素的可用宽度度
                            drWidth = null,
                            // dropdown元素
                            dropdown = e.find('.dy-dropdown'),
                            // dropdown元素的默认高度
                            dropdownHeight = dropdown.innerHeight(),
                            dropdownWidth = dropdown.innerWidth();
                        while (element !== null && rcpAid.getStyle(element, 'position') !== 'absolute' && rcpAid.getStyle(element, 'position') !== 'fixed') {
                            winHeight = element.offsetHeight;
                            winWidth = element.offsetWidth;
                            element = element.parentElement;
                            if (element) {
                                winHeight = element.offsetHeight;
                                winWidth = element.offsetWidth;
                            }
                        }
                        drHeight = winHeight - eTop - eHeight;
                        drWidth = winWidth - eLeft - 4;
                        // 上方位置多于下方
                        if (drHeight < eTop) {
                            drHeight = eTop - 2;
                            dropdown.css({ top: 'auto', bottom: '100%' });
                        }
                        // 有滚动条
                        if (dropdownHeight > drHeight) {
                            e.find('.dy-dropdown').css({ height: drHeight + 'px' });
                        }
                        // 内容过长
                        if (dropdownWidth > drWidth) {
                            e.find('.dy-dropdown').css({ width: drWidth + 'px' });
                        }
                        setTimeout(() => {
                            c.hide = false;

                            $scope.$digest();
                        }, 10);
                    }
                }
            };
            $scope.init = () => {};
            $scope.init();
            // destroy监听
            $scope.$on('$destroy', function() {});
        }
    };
});