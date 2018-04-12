require('../libs/jswf/lib/jswf.js');
require('../libs/ars/ars.js');
if (!window.DYC) {
    window.DYC = angular.module('COM', []);
}
DYC.controller('mainCtrl', function($scope, $rootScope, service, $timeout) {
    let c, d, f, g, h, R;
    window.$ = $;
    c = $scope.c = {
        // 头部配置
        headerConfig: {
            headerData: {},
        },
        footerConfig: {
            footerData: {},
        }
    };
    d = $scope.d = {
        headerData: {},
        footerData: {},
    };
    // ctrl全局变量
    g = $rootScope.G = {
        // 当前用户信息
        currentUser: {},
        // 退出登录
        quitFn: () => {
            var url = rcpAid.getUrl('首页');
            location.href = rcpAid.getUrl('退出', {
                url: encodeURIComponent(url)
            });
        },
        // 是否是IE9
        isIE9: OSINFO.isIE === 9,
    };
    f = $scope.f = {
        loginSuCb: '已登陆',
        loginErrCb: '未登陆',
        setUserData: '设置用户信息'
    };

    f = $scope.f = {
        /**
         * [description]
         * @param  {[type]} argData [description]
         * @return {[type]}         [description]
         */
        loginSuCb: (argData) => {
            // 设置ars token
            R.url += '?token=' + rcpAid.getToken();
            f.setUserData(UINFO);
        },
        loginErrCb: (argErr) => {
            console.log('未登陆', argErr);
            // 修改首页学习中心连接
            if (location.pathname === '/' || location.pathname === '/index.html') {
                $('li.key.nav-side').find('a[href="/space/student-space.html"]').attr('href', rcpAid.getUrl('登录', {
                    url: encodeURIComponent(location.protocol + '//' + location.host + rcpAid.getUrl('学习中心'))
                }));
            }
            // 匿名登陆
            if (localStorage.anonymousUser) {
                console.log('从本地读取匿名用户');
                g.anonymousUser = angular.fromJson(localStorage.anonymousUser || {});
                return;
            } else {
                service.common.anonymousLogin({}).then(function(rs) {
                    console.log('创建匿名用户');
                    f.setUserData(rs.data, true);
                }, function(e) {
                    if (rcpAid.safe(e.data, 'data.code') === 3) {
                        service.dialog.alert('创建匿名用户过于频繁，请一小时后重试！');
                    } else {
                        service.dialog.showErrorTip(e, { moduleName: 'main-ctrl', funcName: 'anonymousLogin' });
                    }
                });
            }
            return;
        },
        /**
         * [description]
         * @param  {[type]} argUserData      [用户数据]
         * @param  {[type]} argAnonymous [是否是匿名用户]
         * @return {[type]}              [description]
         */
        setUserData: (argUserData, argAnonymous) => {
            let roleInfo,
                userInfo;
            if (!argUserData.uid && !argAnonymous) {
                console.error(argUserData);
                return;
            }
            roleInfo = rcpAid.getUserPermissionsInfo(argUserData.usr, { orgs: argUserData.orgs }) || {};
            userInfo = {
                // https://api.gdy.io/doc/html/selector
                // 用户token
                token: rcpAid.getToken(),
                // 用户ID
                uid: rcpAid.safe(argUserData, 'usr.id'),
                // 昵称
                nickName: rcpAid.safe(argUserData, 'usr.attrs.basic.nickName', ''),
                // 头像
                avatar: rcpAid.safe(argUserData, 'usr.attrs.basic.avatar', ''),
                // 描述
                desc: rcpAid.safe(argUserData, 'usr.attrs.basic.desc', ''),
                // 角色
                role: rcpAid.safe(argUserData, 'usr.attrs.role', ''),
                // 是否管理员
                isAdmin: roleInfo.isAdmin,
                // 角色类型
                roleType: roleInfo.roleType,
                // 最小的权限集
                minPermissions: roleInfo.minPermissions,
                // 拥有的权限
                hasPermissions: roleInfo.hasPermissions,
                // 拥有管理权限的机构, roleType === RoleTypes.ADMIN_ORG 时才有意义
                managedOrgs: roleInfo.managedOrgs,
                // 当前操作的机构 当角色类型为 RoleTypes.ADMIN_ORG 或 RoleTypes.ORG_CREATOR 时，会被设置
                currentManagedOrg: roleInfo.currentManagedOrg || {},
            };
            // 是否实名认证
            if (argUserData.usr.attrs.pass) {
                userInfo.certification = argUserData.usr.attrs.pass.certification;
            }

            if (!argAnonymous) {
                g.currentUser = userInfo;
            } else {
                userInfo.token = argUserData.token;
                g.anonymousUser = userInfo;
                g.currentUser = {};
                localStorage.anonymousUser = angular.toJson(userInfo);
            }
            console.log('login info', g.currentUser, g.anonymousUser);
        },
        /**
         * 获取头部尾部数据
         * @return {[type]} [description]
         */
    };
    h = $scope.h = {
        /**
         * 获取头部尾部数据
         * @return {[type]} [description]
         */
        getHeaderFooterData: () => {
            var data = {
                keys: 'p_basic,p_navigate,p_icp'
            };
            service.common.getHeaderFooterData(data).then(function(rs) {
                console.log(rs);
                localStorage.headerFooterData = '';
                if (!rs.data.page || !rs.data.page.items) {
                    return;
                }
                d.headerData = {
                    navList: rcpAid.safe(rs, 'data.page.items.p_navigate.data.root.childs', []),
                    logo: {
                        href: DYCONFIG.rcp.rUrl,
                        small: rcpAid.safe(rs, 'data.page.smallIcon', ''),
                    }
                };
                d.footerData = {
                    items: rcpAid.safe(rs, 'data.page.items.p_basic.data.items', []),
                    qrAppDown: rcpAid.safe(rs, 'data.page.attrs.qrAppDown', {}),
                    twoDimensionCode: rcpAid.safe(rs, 'data.page.attrs.twoDimensionCode', {}),
                }
                c.headerConfig.headerData = d.headerData;
                c.footerConfig.footerData = d.footerData;
                localStorage.headerFooterData = angular.toJson({
                    headerData: d.headerData,
                    footerData: d.footerData
                });
            }, function(e) {
                console.log(e);
            });
        }
    };
    $scope.init = () => {
        $('body').show();
        // 初始化 ars
        initARS();
        // 初始化 Highcharts
        initHighcharts();
        // 判断本地存储
        checkLocalFn();
        // 判断登陆
        service.common.checkLogin(f.loginSuCb, f.loginErrCb);
        h.getHeaderFooterData();
        let headerFooterData = angular.fromJson(localStorage.headerFooterData || {});
        c.headerConfig.headerData = headerFooterData.headerData;
        c.footerConfig.footerData = headerFooterData.footerData;
    };
    // 判断本地存储
    let checkLocalFn = () => {
        if (window.localStorage) {
            var hasUse = window.unescape(encodeURIComponent(JSON.stringify(localStorage))).length;
            // 超过4M清 _art结尾的localStorage变量
            var size = 4194304;
            if (hasUse > size) {
                console.log('本地存储快满了，正在清理');
                // 删除所有_art（课程内容）结尾的变量
                angular.forEach(localStorage, function(v, k) {
                    if (k.match('_art')) {
                        delete localStorage[k];
                    }
                });
            }
        }
    };
    /**
     * 初始化 ARS
     * @return {[type]} [description]
     */
    let initARS = () => {
        R = {
            args: {}
        };
        if (DYCONFIG && DYCONFIG.devMode && DYCONFIG.devMode.disabledARS) {
            return;
        }
        // 初始化页面记录
        try {
            R = new ars.ARS();
            // 额外参数记录对像
            R.args = { mouseMove: 0 };
            // 记录频率
            R.delay = 1000;
            // 提交频率
            R.pushDelay = 10000;
            // URL
            R.url = DYCONFIG.ars.rUrl + 'pub/api/record';

            let startRecord = () => {
                var RCount = setInterval(function() {
                    R.args.mouseMove = 0;
                }, R.pushDelay);

                function setMouseMove() {
                    R.args.mouseMove = 1;
                    clearInterval(RCount);
                    RCount = setInterval(function() {
                        R.args.mouseMove = 0;
                    }, R.pushDelay);
                }

                $('body').on({
                    'mousemove': function() {
                        // console.log('mousemove');
                        setMouseMove();
                    },
                    'keydown': function() {
                        // console.log('keydown');
                        setMouseMove();
                    },
                    'click': function() {
                        // console.log('click');
                        setMouseMove();
                    }
                });
            };

            startRecord();
            // 开始计时
            R.start();
            window.focus();
        } catch (e) {
            R = {};
        }
    };
    // 初始化 Highcharts 时区偏移,如果有
    let initHighcharts = () => {
        if (window.Highcharts) {
            window.Highcharts.setOptions({
                global: {
                    // 设置时区偏移
                    timezoneOffset: new Date().getTimezoneOffset()
                }
            });
        }
    };
    $scope.init();
});