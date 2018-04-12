require('./dy-header.scss');
let templateUrl = require('./dy-header.html');
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
DIR.directive('dyHeader', function($document) {
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
                // 搜索
                search: (argKey) => {
                    location.href = rcpAid.getUrl('搜索', {
                        query: encodeURIComponent(argKey || '')
                    });
                },
                // 实时搜索关键字
                searchChange: (argKey) => {
                    if (!argKey) {
                        d.searchConfig.matchList = [];
                        return;
                    }
                    let data = {
                        key: argKey,
                        courseType: 10,
                        limit: 10
                    }
                    service.common.IntelSearch(data).then((rs) => {
                        d.searchConfig.matchList = rcpAid.safe(rs, 'data.courses', []);
                    }, (argErr) => {
                        service.dialog.showErrorTip(argErr, {
                            moduleName: 'head-tail-dir',
                            funcName: 'headSearchCtrl',
                            text: '获取提示结果失败'
                        });
                    });
                },
                matchFn: (argItem) => {
                    console.log(argItem);
                    if (!rcpAid.safe(argItem, 'id')) {
                        return;
                    }
                    location.href = rcpAid.getUrl('课程详情', {
                        cid: argItem.id
                    });
                },
            };
            $scope.init = () => {
                console.warn(c);
                d.currentUser = $rootScope.G.currentUser;
                let adminPage = rcpAid.getUrl('管理中心', '?url=' + rcpAid.getHost().origin);
                if (d.currentUser.roleType === DYCONFIG.constants.userRole.ADMIN_RCP) {
                    adminPage = rcpAid.getUrl('超管管理中心', '?url=' + rcpAid.getHost().origin);
                }
                d.isIE9 = $rootScope.isIE9;

                // 搜索配置
                d.searchConfig = {
                    maxlength: 50,
                    key: '',
                    matchList: [],
                    matchFn: f.matchFn,
                    cb: f.search,
                    changeFn: f.searchChange,
                    lightStyle: false,
                };
                if (location.pathname === '/' || location.pathname === '/index.html') {
                    d.searchConfig.lightStyle = true;
                }
                // 用户菜单列表
                d.menuList = [{
                    name: '个人设置',
                    href: rcpAid.getUrl('个人设置', {
                        url: encodeURIComponent(rcpAid.getNoTokenUrl())
                    }),
                }, {
                    name: '学习中心',
                    href: rcpAid.getUrl('学习中心'),
                }, {
                    name: '实名认证',
                    href: rcpAid.getUrl('实名认证', { type: 10 }),
                }, {
                    name: '管理中心',
                    href: adminPage,
                }, {
                    name: '帮助',
                    href: rcpAid.getUrl('个人设置', {
                        url: encodeURIComponent(rcpAid.getNoTokenUrl())
                    }) + '#/help',
                }, {
                    name: '退出',
                    topLine: true,
                    href: rcpAid.getUrl('退出', {
                        url: encodeURIComponent(rcpAid.getUrl('首页'))
                    }),
                }];
                d.userDownConfig = {
                    data: d.menuList,
                    type: 'link',
                    clickFn: null,
                }
                d.teacherDownConfig = {
                    data: [{
                        name: '教学中心',
                        href: rcpAid.getUrl('教学中心'),
                        target: '',
                    }, {
                        name: '创建课程',
                        href: rcpAid.getUrl('创建课程'),
                        target: '_blank',
                    }],
                    type: 'link',
                    clickFn: null,
                    hide: false,
                };
            }
            $scope.init();
            // destroy监听
            // $scope.$on('$destroy', function() {});
        }
    };
});