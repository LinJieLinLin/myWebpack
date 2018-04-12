require('./dy-dialog.scss');
let templateUrl = require('./dy-dialog.html');
if (!window.DIR) {
    window.DIR = angular.module('DIR', []);
}
/**
 * @author linj
 * @description 
 * dialog组件
 * c =  {
 *  title: 标题，不填不显示 header栏目
 *  hideModal: true 隐藏模态背景
 *  hideBg: true 隐藏全局背景，dialog外可点击
 *  hideOk: true 隐藏确定
 *  hideCancel: true 隐藏取消
 *  hideFooter: true 隐藏底部
 *  modalCancel: true 点击模态背景不隐藏
 *  content: 内容，没有时使用标签内的内容
 *  posClass: 位置class l-t l-b r-t r-b 不填则默认居中
 *  okCb: 确定回调
 *  cancel: 取消回调
 *  cancelMove: 取消移动到body下,默认移动到body下，保持在最高层
 *  show: true时显示，false时隐藏
 * }
 */
DIR.directive('dyDialog', function() {
    return {
        template: templateUrl,
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            c: '='
        },
        controller: function($scope, $element, $timeout) {
            let c = $scope.c;
            let d = $scope.d = {};
            let f = $scope.f = {
                /**
                 * 关闭dialog
                 */
                close: (argData) => {
                    c.show = false;
                    if (argData !== 'modal') {
                        $timeout(function() {
                            $element.find('.d-main').attr('style', '');
                        }, 500);
                    }
                    switch (argData) {
                        case 'modal':
                            if (c.modalCancel) {
                                c.show = true;
                                return;
                            }
                            break;
                        case 'cancel':
                            if (typeof c.cancelCb === 'function') {
                                return c.cancelCb();
                            }
                            break;
                        case 'ok':
                            if (typeof c.okCb === 'function') {
                                return c.okCb();
                            }
                            break;
                    }
                },
                setCenter: () => {
                    let winHeight = $(document).innerHeight(),
                        winWidth = $(document).innerWidth(),
                        e = $element.find('.d-main'),
                        headerH = e.find('.d-header').innerHeight() || 0,
                        footerH = e.find('.d-footer').innerHeight() || 0,
                        bodyH = e.find('.d-body')[0].scrollHeight || 0,
                        eHeight = headerH + footerH + bodyH,
                        eWidth = e.innerWidth(),
                        eLeft,
                        eTop;
                    eLeft = (winWidth - eWidth) / 2;
                    eTop = (winHeight - eHeight) / 2;
                    console.log(eTop, winHeight, eHeight);
                    if (eTop < 0) {
                        eTop = 0;
                        e.css({ height: winHeight });
                        e.find('.d-body').css({ 'max-height': winHeight - headerH - footerH });
                    }
                    if (eLeft < 0) {
                        eLeft = 0;
                    }
                    e.css({ left: eLeft + 'px', top: eTop + 'px', transform: 'unset' });
                }
            };
            $scope.init = () => {
                d.id = 'dialog-' + (+new Date());
                // 设置dialog居中
                if (!c.posClass) {
                    $(window).resize(f.setCenter);
                    $scope.$watch('c.show', function(n, o) {
                        // c.show true时，初始化居中
                        if (n) {
                            $timeout(function() {
                                f.setCenter();
                            }, 0);
                        }
                    });
                }
                // 将dialog移到body下
                // $('body').append($element);
                if (!c.cancelMove) {
                    document.getElementsByTagName('body')[0].appendChild($element[0]);
                }
            };
            $scope.init();
            // destroy监听
            $scope.$on('$destroy', function() {
                if (!c.posClass) {
                    $(window).off('resize', f.setCenter);
                }
            });
        }
    }
});