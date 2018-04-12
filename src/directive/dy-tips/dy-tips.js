require('./dy-tips.scss');
let templateUrl = require('./dy-tips.html');
if (!window.DIR) {
    window.DIR = angular.module('DIR', []);
}
/**
 * @author linj
 * @description 
 * tips组件
 * c:{
 * cancelAuto: true:关闭自动适应,
 * }
 */
DIR.directive('dyTips', function($document) {
    return {
        template: templateUrl,
        restrict: 'AE',
        replace: true,
        transclude: true,
        scope: {
            c: '=',
        },
        link: function($scope, $element, $attrs) {
            let c = $scope.c || {};
            let d = $scope.d = {};
            let f = $scope.f = {
                hover: () => {
                    if (c.cancelAuto) {
                        return;
                    }
                    let e = $element[0],
                        temE = e,
                        // 窗口高度，当parent有时，为parent元素高度
                        winHeight = window.innerHeight,
                        // 窗口高度
                        winWidth = window.innerWidth,
                        // select元素高度
                        eHeight = e.offsetHeight,
                        // select元素宽度
                        eWidth = e.offsetWidth,
                        // select元素上偏移
                        eTop = rcpAid.getElementPosition(e).top,
                        // select元素左偏移
                        eLeft = rcpAid.getElementPosition(e).left,
                        // tip元素
                        tip = e.querySelector('.tip'),
                        // tip元素的默认高度
                        tipHeight = tip.offsetHeight,
                        tipWidth = tip.offsetWidth,
                        check = {
                            top: null,
                            bottom: null,
                            left: null,
                            right: null,
                        };
                    while (temE !== null && rcpAid.getStyle(temE, 'position') !== 'absolute' && rcpAid.getStyle(temE, 'position') !== 'fixed') {
                        winHeight = temE.offsetHeight;
                        winWidth = temE.offsetWidth;
                        temE = temE.parentElement;
                        if (temE) {
                            winHeight = temE.offsetHeight;
                            winWidth = temE.offsetWidth;
                        }
                    }
                    // 上不够
                    if (tipHeight > eTop) {
                        check.top = true;
                    }
                    // 下不够
                    if (tipHeight > winHeight - eHeight - eTop) {
                        check.bottom = true;
                    }
                    // 左不够
                    if (tipWidth > eLeft) {
                        check.left = true;
                    }
                    // 右不够
                    if (tipWidth > winWidth - eWidth - eLeft) {
                        check.right = true;
                    }
                    if (rcpAid.hasClass(tip, 'l-t')) {
                        if (check.left) {
                            rcpAid.rmClass(tip, 'l-t');
                            if (check.bottom) {
                                rcpAid.addClass(tip, 'r-b');
                            } else {
                                rcpAid.addClass(tip, 'r-t');
                            }
                        } else if (check.bottom) {
                            rcpAid.addClass(tip, 'l-b');
                        } else {
                            rcpAid.addClass(tip, 'l-t');
                        }
                    } else if (rcpAid.hasClass(tip, 'l-b')) {
                        if (check.left) {
                            rcpAid.rmClass(tip, 'l-t');
                            if (check.top) {
                                rcpAid.addClass(tip, 'r-t');
                            } else {
                                rcpAid.addClass(tip, 'r-b');
                            }
                        } else if (check.top) {
                            rcpAid.addClass(tip, 'l-t');
                        } else {
                            rcpAid.addClass(tip, 'l-b');
                        }
                    } else if (rcpAid.hasClass(tip, 'r-t')) {
                        if (check.right) {
                            rcpAid.rmClass(tip, 'r-t');
                            if (check.bottom) {
                                rcpAid.addClass(tip, 'l-b');
                            } else {
                                rcpAid.addClass(tip, 'l-t');
                            }
                        } else if (check.bottom) {
                            rcpAid.addClass(tip, 'r-b');
                        } else {
                            rcpAid.addClass(tip, 'r-t');
                        }
                    } else if (rcpAid.hasClass(tip, 'r-b')) {
                        if (check.right) {
                            rcpAid.rmClass(tip, 'r-b');
                            if (check.top) {
                                rcpAid.addClass(tip, 'l-t');
                            } else {
                                rcpAid.addClass(tip, 'l-b');
                            }
                        } else if (check.top) {
                            rcpAid.addClass(tip, 'r-t');
                        } else {
                            rcpAid.addClass(tip, 'r-b');
                        }
                    } else if (rcpAid.hasClass(tip, 't-l')) {
                        if (check.top) {
                            rcpAid.rmClass(tip, 't-l');
                            if (check.right) {
                                rcpAid.addClass(tip, 'b-r');
                            } else {
                                rcpAid.addClass(tip, 'b-l');
                            }
                        } else if (check.right) {
                            rcpAid.addClass(tip, 't-r');
                        } else {
                            rcpAid.addClass(tip, 't-l');
                        }
                    } else if (rcpAid.hasClass(tip, 't-r')) {
                        if (check.top) {
                            rcpAid.rmClass(tip, 't-r');
                            if (check.left) {
                                rcpAid.addClass(tip, 'b-l');
                            } else {
                                rcpAid.addClass(tip, 'b-r');
                            }
                        } else if (check.left) {
                            rcpAid.addClass(tip, 't-l');
                        } else {
                            rcpAid.addClass(tip, 't-r');
                        }
                    } else if (rcpAid.hasClass(tip, 'b-l')) {
                        if (check.bottom) {
                            rcpAid.rmClass(tip, 'b-l');
                            if (check.right) {
                                rcpAid.addClass(tip, 't-r');
                            } else {
                                rcpAid.addClass(tip, 't-l');
                            }
                        } else if (check.right) {
                            rcpAid.addClass(tip, 'b-r');
                        } else {
                            rcpAid.addClass(tip, 'b-l');
                        }
                    } else if (rcpAid.hasClass(tip, 'b-r')) {
                        if (check.bottom) {
                            rcpAid.rmClass(tip, 'b-r');
                            if (check.left) {
                                rcpAid.addClass(tip, 't-l');
                            } else {
                                rcpAid.addClass(tip, 't-r');
                            }
                        } else if (check.left) {
                            rcpAid.addClass(tip, 'b-l');
                        } else {
                            rcpAid.addClass(tip, 'b-r');
                        }
                    } else {
                        if (check.top) {
                            rcpAid.rmClass(tip, 't-l');
                            if (check.right) {
                                rcpAid.addClass(tip, 'b-r');
                            } else {
                                rcpAid.addClass(tip, 'b-l');
                            }
                        } else if (check.right) {
                            rcpAid.addClass(tip, 't-r');
                        } else {
                            rcpAid.addClass(tip, 't-l');
                        }
                    }
                    // console.log(check);
                    // console.log(winHeight, winWidth, eHeight, eWidth, eTop, eLeft, tipHeight, tipWidth);
                }
            };
            $scope.init = () => {

            };
            $scope.init();
            // destroy监听
            $scope.$on('$destroy', function() {});
        }
    };
});