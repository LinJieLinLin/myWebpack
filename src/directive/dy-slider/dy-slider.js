require('./dy-slider.scss');
let templateUrl = require('./dy-slider.html');
if (!window.DIR) {
    window.DIR = angular.module('DIR', []);
}
/**
 * @author linj
 * @description 
 * 轮播组件
 * c:{
 * imgs: 轮播图片,
 * time：切换时间 s,
 * stayTime: 停留时间 s,
 * slideRight: true向右切换
 * }
 */
DIR.directive('dySlider', function($document) {
    return {
        template: templateUrl,
        restrict: 'E',
        replace: true,
        scope: {
            imgs: '=',
            c: '='
        },
        controller: function($scope, $element, $attrs, $timeout, $interval) {
            let timer = null;
            let d = $scope.d = {};
            let f = $scope.f = {
                // 上一张
                prev: function() {
                    if (!d.canClick) {
                        d.canClick = true;
                        $timeout(function() { d.canClick = false; }, c.time * 1000);
                        if (c.slideRight) {
                            f.slideLeft();
                        } else {
                            f.slideRight();
                        }
                    }
                },
                // 下一张
                next: function() {
                    if (!d.canClick) {
                        d.canClick = true;
                        $timeout(function() { d.canClick = false; }, c.time * 1000);
                        if (c.slideRight) {
                            f.slideRight();
                        } else {
                            f.slideLeft();
                        }
                    }
                },
                // 向右切换
                slideRight: function() {
                    d.styles = [];
                    d.styles[d.i] = {
                        'animation': 'slide-l1 ' + c.time + 's forwards',
                    };
                    if (d.i === 0) {
                        d.i = d.len - 1;
                    } else {
                        d.i--;
                    }
                    d.styles[d.i] = {
                        'animation': 'slide-r1 ' + c.time + 's forwards',
                    };
                },
                // 向左切换
                slideLeft: function() {
                    d.styles = [];
                    d.styles[d.i] = {
                        'animation': 'slide-l ' + c.time + 's forwards',
                    };
                    if (d.i === d.len - 1) {
                        d.i = 0;
                    } else {
                        d.i++;
                    }
                    d.styles[d.i] = {
                        'animation': 'slide-r ' + c.time + 's forwards',
                    };
                },
                // 自动播放
                autoPlay: function() {
                    timer = $interval(function() {
                        f.next();
                    }, c.stayTime * 1000);
                },
                /**
                 * argType 'stop'时暂停播放
                 */
                play: function(argType) {
                    if (!argType) {
                        f.autoPlay();
                    } else {
                        $interval.cancel(timer);
                    }
                }
            }
            let c = $scope.c;

            $scope.init = () => {
                if (!c.imgs || !angular.isArray(c.imgs)) {
                    console.log('图片数据有误！');
                    return;
                }
                c.stayTime = c.stayTime || 4;
                c.time = c.time || 1.5;
                d.i = d.i || 0;
                d.len = c.imgs.length;
                d.styles = [{ left: 0 }];
                f.autoPlay();
            }
            $scope.init();
            // destroy监听
            // $scope.$on('$destroy', function() {});
        }
    };
});