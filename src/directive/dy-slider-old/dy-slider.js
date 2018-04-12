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
 * imgs: 轮播图片
 * time：切换时间 s
 * stayTime: 停留时间 s
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
                        if (d.slideLeft) {
                            d.slideLeft = false;
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
                        if (!d.slideLeft) {
                            d.slideLeft = true;
                            f.slideRight();
                        } else {
                            f.slideLeft();
                        }
                    }
                },
                // 右切换
                slideRight: function() {
                    if (d.i === 0) {
                        d.i = d.len - 1;
                        return;
                    } else {
                        d.i--;
                        return;
                    }
                },
                // 左切换
                slideLeft: function() {
                    if (d.i === d.len - 1) {
                        d.i = 0;
                        return;
                    } else {
                        d.i++;
                        return;
                    }
                },
                // 自动播放
                autoPlay: function() {
                    timer = $interval(function() {
                        f.next();
                    }, c.stayTime * 1000);
                },
                // 获取动画class
                getClass: function(argIndex) {
                    var a = 0;
                    var b = 1;
                    var c = '';
                    var name = 'slide-l-';
                    if (!d.slideLeft) {
                        name = 'slide-r-';
                        if (d.i === 0) {
                            if (argIndex === d.len - 1) {
                                c = name + b;
                            }
                        }
                        if (argIndex === d.i - 1) {
                            c = name + b;
                        }
                    } else {
                        if (d.i === d.len - 1) {
                            if (argIndex === 0) {
                                c = name + b;
                            }
                        }
                        if (argIndex === d.i + 1) {
                            c = name + b;
                        }
                    }
                    if (argIndex === d.i) {
                        c = name + a;
                    }
                    return c;
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
                d.i = d.i || 0;
                d.len = c.imgs.length;
                // d.width = $element[0].clientWidth;
                d.slideLeft = true;
                if (c.time) {
                    d.liStyle = {
                        '-webkit-animation-duration': c.time + 's',
                        '-moz-animation-duration': c.time + 's',
                        '-o-animation-duration': c.time + 's',
                        'animation-duration': c.time + 's'
                    };
                }
                f.autoPlay();
            }
            $scope.init();
            // destroy监听
            // $scope.$on('$destroy', function() {});
        }
    };
});