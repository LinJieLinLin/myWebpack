require('./dy-progress.scss');
let templateUrl = require('./dy-progress.html');
if (!window.DIR) {
    window.DIR = angular.module('DIR', []);
}
/**
 * @author linj
 * @description 
 * progress
 */
DIR.directive('dyProgress', function($document) {
    return {
        template: templateUrl,
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            data: '=',
            c: '=',
        },
        controller: function($scope, $rootScope, $element, $timeout) {
            let c = $scope.c;
            let d = $scope.d = {};
            let f = $scope.f = {
                /**
                 * 拖拽事件
                 * @param  {[type]} argThis     [click element this]
                 * @param  {[type]} argEvent    [event]
                 * @param  {[type]} argMove     [move element]
                 * @param  {[type]} argIsUp     [是否是上下结构]
                 * @return {[type]}             [description]
                 */
                drag: (argThis, argEvent, argMove, argIsUp) => {
                    // 竖音量条
                    if (argIsUp) {
                        let event = argEvent || window.event;
                        if (isMobile && event.changedTouches && event.changedTouches[0]) {
                            event = event.changedTouches[0];
                        }
                        let barHeight = +f.getCss(argThis, 'height').replace('px', '') - 5,
                            eleHeight = f.getElementPosition(argThis, 'y'),
                            topH = barHeight - event.clientY + eleHeight - 46;
                        if (topH > barHeight) {
                            topH = barHeight;
                        } else if (topH < 0) {
                            topH = 0;
                        }
                        if (eleHeight < 0) {
                            log('获取不到元素宽度！');
                            return;
                        }
                        $scope.data = Math.round(topH / barHeight * 100);
                        argMove.style.height = $scope.data + '%';
                        log('鼠标位置', event.clientY, 'this offsetTop', eleHeight, 'move', topH, 'barHeight', barHeight);
                    } else {
                        let event = argEvent || window.event;
                        if (isMobile && event.changedTouches && event.changedTouches[0]) {
                            event = event.changedTouches[0];
                        }
                        let barWidth = +f.getCss(argThis, 'width').replace('px', '') - 5,
                            eleLeft = f.getElementPosition(argThis),
                            leftW = event.clientX - eleLeft;

                        if (leftW > barWidth) {
                            leftW = barWidth;
                        } else if (leftW < 0) {
                            leftW = 0;
                        }
                        if (barWidth < 0) {
                            log('获取不到元素宽度！');
                            return;
                        }
                        $scope.data = Math.round(leftW / barWidth * 100);
                        argMove.style.width = $scope.data + '%';
                        log('鼠标位置', event.clientX, 'this offsetLeft', eleLeft, 'move', leftW, 'barWidth', barWidth);
                    }
                    $scope.$apply(() => {
                        $scope.data;
                    });
                },
                /**
                 * 获取元素绝对位置的坐标
                 * @param  {[type]} argE [element]
                 * @param  {[type]} argType [x横坐标，y纵坐标]
                 * @return {[type]}      [description]
                 */
                getElementPosition: (argE, argType = 'x') => {
                    if (argType === 'x') {
                        let actualLeft = argE.offsetLeft;
                        let current = argE.offsetParent;
                        while (current !== null) {
                            actualLeft += current.offsetLeft;
                            current = current.offsetParent;
                        }
                        return actualLeft;
                    } else if (argType === 'y') {
                        let actualTop = argE.offsetTop;
                        let current = argE.offsetParent;
                        while (current !== null) {
                            actualTop += current.offsetTop;
                            current = current.offsetParent;
                        }
                        return actualTop;
                    }
                },
                /**
                 * 获取相关CSS属性
                 * @param  {[type]} argE [element]
                 * @param  {[type]} key  [style name]
                 * @return {[type]}      [description]
                 */
                getCss: (argE, key) => {
                    return window.getComputedStyle(argE, false)[key] || '';
                },
            };
            let onmousedown = 'onmousedown',
                onmousemove = 'onmousemove',
                onmouseup = 'onmouseup',
                isMobile = false,
                ua = navigator.userAgent.toLowerCase();
            if (/mobile/i.test(ua)) {
                onmousedown = 'ontouchstart';
                onmousemove = 'ontouchmove';
                onmouseup = 'ontouchcancel';
                isMobile = true;
            }
            $scope.init = () => {
                d.id = (+new Date()) + 'progress';
                d.barId = d.id + '-bar';
                $timeout(function() {
                    d.progress = document.getElementById(d.id);
                    d.progressBar = document.getElementById(d.barId);
                    d.progressWidth = f.getCss(d.progress, 'width');
                    // 开始拖拽
                    d.progress[onmousedown] = function(argEvent) {
                        console.log('progress开始拖拽');
                        let temThis = this;
                        f.drag(temThis, argEvent, d.progressBar, c.type === 'y');
                        d.progress[onmousemove] = function(argEvent) {
                            let temThis = this;
                            f.drag(temThis, argEvent, d.progressBar, c.type === 'y');
                        };
                    };
                    // 停止拖拽
                    document[onmouseup] = () => {
                        console.log('progress停止拖拽');
                        let len = document.getElementsByClassName('dy-progress').length;
                        for (let i = 0; i < len; i++) {
                            document.getElementsByClassName('dy-progress')[i][onmousemove] = null;
                        }
                    };
                }, 0);
                $scope.$watch('data', (o, n) => {
                    console.log(o, n);
                    if (c.type === 'y') {
                        d.progressBar.style.height = $scope.data + '%';
                    } else {
                        d.progressBar.style.width = $scope.data + '%';
                    }
                });
            };
            $scope.init();
            // destroy监听
            // $scope.$on('$destroy', function() {});
        }
    };
});