require('./dy-fixedbar.scss');
let templateUrl = require('./dy-fixedbar.html');
if (!window.DIR) {
    window.DIR = angular.module('DIR', []);
}
/**
 * @author linj
 * @description 
 * fixedbar组件
 * c:{
 * }
 */
DIR.directive('dyFixedbar', function() {
    return {
        template: templateUrl,
        restrict: 'E',
        replace: true,
        scope: {
            c: '='
        },
        controller: function($scope, $element, $rootScope, $timeout, service) {
            let timer;
            let c = $scope.c;
            let d = $scope.d = {
                // 客服列表
                customList: [],
            };
            let f = $scope.f = {
                /**
                 * 找客服聊天
                 * @param  {[type]} argData [客服信息]
                 * @return {[type]}         [description]
                 */
                consult: (argData) => {
                    var temUid = '';
                    if (argData) {
                        temUid = argData.id;
                    } else if ($scope.d.customList.length === 1) {
                        temUid = rcpAid.safe($scope.d.customList, '0.id');
                    }
                    if (temUid) {
                        service.chatGlobal.chatById(temUid);
                    }
                },
                scrollFn: () => {
                    // 显示隐藏回到顶部
                    function handler() {
                        var top = $(window).scrollTop();
                        if (top > 50) {
                            d.showTop = true;
                        } else {
                            d.showTop = false;
                        }
                    }
                    $timeout.cancel(timer);
                    timer = $timeout(handler, 200);
                }
            };
            let h = $scope.h = {
                // http
                /**
                 * 获取客服列表
                 * @return {[type]} [description]
                 */
                listCustomService: function() {
                    var data = {
                        count: 100,
                    };
                    service.common.listCustomService(data).then(function(rs) {
                        $scope.d.customList = [];
                        $scope.d.customList = rs.data;
                    }, function(e) {
                        service.dialog.showErrorTip(e, { moduleName: 'fixed-toolbar-dir', funcName: 'listCustomService' });
                    });
                },
            };

            $scope.init = () => {
                d.isIE9 = $rootScope.G.isIE9;
                if (!$scope.data) {
                    // 从localStorage读取
                    $timeout(function() {
                        var temData = angular.fromJson(localStorage.headerFooterData) || {};
                        $scope.d.qr = temData.qrAppDown || {};
                        $scope.d.qr.src = rcpAid.safe($scope.d, 'qr.img', '');
                        $scope.d.wx = rcpAid.safe(temData, 'twoDimensionCode', {});
                        $scope.d.wx.src = rcpAid.safe($scope.d, 'wx.img', '');
                    }, 500);
                }
                if (rcpAid.safe($scope.d, 'qr.name')) {
                    $scope.d.qr.name = decodeURI($scope.d.qr.name);
                }
                if (rcpAid.safe($scope.d, 'wx.name')) {
                    $scope.d.wx.name = decodeURI($scope.d.wx.name);
                }
                // 客服列表;
                h.listCustomService();
                $(window).on('scroll', f.scrollFn);
                // 将元素移到body下
                // $('body').append($element);
                document.getElementsByTagName('body')[0].appendChild($element[0]);
            };
            $scope.init();
            // destroy监听
            $scope.$on('$destroy', function() {
                $(window).off('scroll', f.scrollFn);
            });
        }
    };
});