DYC.factory('common', function(request, loginModal) {
    try {
        var ssoUrl = DYCONFIG.sso.rUrl,
            pesUrl = DYCONFIG.pes2.rUrl,
            imsdUrl = DYCONFIG.chat.rUrl,
            countUrl = DYCONFIG.count.rUrl,
            rs = {
                // 获取用户信息
                uinfo: function(params, filter) {
                    var option = {
                        method: 'GET',
                        url: ssoUrl + 'sso/api/uinfo',
                        params: params
                    };
                    return request(angular.extend(option, filter || {}));
                },
                // 获取匿名用户信息
                anonymousLogin: function(params, filter) {
                    var option = {
                        method: 'GET',
                        url: ssoUrl + 'sso/api/createAnonymous',
                        params: params
                    };
                    return request(angular.extend(option, filter || {}));
                },
                // 获取头部尾部数据
                getHeaderFooterData: function(params, filter) {
                    var option = {
                        method: 'GET',
                        url: pesUrl + 'pub/api/loadPage',
                        params: params
                    };
                    return request(angular.extend(option, filter || {}));
                },
                // base64图片上传
                uploadBase: function(params, filter) {
                    var option = {
                        method: 'POST',
                        url: DYCONFIG.fs.upload,
                        params: params,
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    };
                    return request(angular.extend(option, filter || {}));
                },
                /**
                 * [toLogin 未登陆时的跳转]
                 * @param  {[type]} argJump [description]
                 * @return {[type]}         [description]
                 */
                toLogin: function(argJump) {
                    if (argJump) {
                        // 跳转到登陆页
                        var url = rcpAid.getNoTokenUrl();
                        url = rcpAid.getUrl('登录', {
                            url: encodeURIComponent(url)
                        });
                        location.href = url;
                    } else {
                        // 弹出登陆界面
                        loginModal.show();
                    }
                },
                /**
                 * [checkLogin 新登陆判断]
                 * @return {[type]} [description]
                 */
                checkLogin: function(argSuCb, argErrCb, argJump) {
                    var loginInfo = rcpAid.checkLogin();
                    if (loginInfo) {
                        if (loginInfo.urlToken) {
                            var data = {
                                token: loginInfo.urlToken,
                                selector: 'bandc,role,org',
                            };
                            rs.uinfo(data).then(function(rs) {
                                rcpAid.isLogin = 1;
                                UINFO = rs.data;
                                if (typeof argSuCb === 'function') {
                                    argSuCb(UINFO);
                                }
                            }, function(e) {
                                rcpAid.isLogin = 0;
                                if (typeof argErrCb === 'function') {
                                    argErrCb(e);
                                } else {
                                    rs.toLogin(argJump);
                                }
                            });
                            rcpAid.isLogin = 2;
                            return rcpAid.isLogin;
                        } else if (loginInfo.token) {
                            rcpAid.isLogin = 1;
                            if (typeof argSuCb === 'function') {
                                argSuCb(UINFO);
                            }
                        }
                    } else {
                        rcpAid.isLogin = 0;
                        if (!argErrCb) {
                            rs.toLogin(argJump);
                        } else {
                            argErrCb('');
                        }
                    }
                    return rcpAid.isLogin;
                },

                /**
                 * 智能搜索课程 api->https://api.gdy.io/#w_gdy_io_dyf_pes2_pesapiIntelSearch
                 * @author LouGaZen
                 * @param argParams
                 * @param argFilter
                 * @returns {*}
                 * @constructor
                 */
                IntelSearch: function(argParams, argFilter) {
                    var option = {
                        method: 'GET',
                        url: pesUrl + 'pub/api/intelSearch',
                        params: argParams,
                        //  禁止显示头部loading条->request.js
                        option: {
                            loading: false
                        }
                    };
                    return request(angular.extend(option, argFilter || {}));
                },
                listCustomService: function(params, filter) {
                    var option = {
                        method: 'GET',
                        url: imsdUrl + 'pub/api/listCustomService',
                        params: params
                    };
                    return request(angular.extend(option, filter || {}));
                },
                warningUnhand: function(argParams, argFilter) {
                    argParams.token = rcpAid.getToken();
                    return request(angular.extend({
                        method: 'GET',
                        url: countUrl + 'usr/api/warningUnhand',
                        params: argParams
                    }, argFilter || {}));
                },
                test: (argParams, argFilter) => {
                    argParams.token = rcpAid.getToken();
                    return request(angular.extend({
                        method: 'GET',
                        url: DYCONFIG.fs.rUrl + 'usr/api/listFile',
                        params: argParams,
                        timeout: 200,
                    }, argFilter || {}));
                },
            };
        return rs;
    } catch (e) {
        console.log('error!', e);
    }
});

DYC.run(function(service, common) {
    service.expand('common', function() {
        return common;
    });
});

/**
 * 处理重复请求
 */
DYC.factory('debounce', function($timeout, $q) {
    return function(func, wait, immediate) {
        var timeout;
        var deferred = $q.defer();
        return function() {
            var context = this,
                args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) {
                    deferred.resolve(func.apply(context, args));
                    deferred = $q.defer();
                }
            };
            var callNow = immediate && !timeout;
            if (timeout) {
                $timeout.cancel(timeout);
            }
            timeout = $timeout(later, wait);
            if (callNow) {
                deferred.resolve(func.apply(context, args));
                deferred = $q.defer();
            }
            return deferred.promise;
        };
    };
});

DYC.run(function(service, debounce) {
    service.expand('debounce', function() {
        return debounce;
    });
});

/**
 * 处理loading
 */
DYC.factory('load', function($timeout) {
    let rs = {
        timer: {},
        /**
         * 添加loading timer
         * argData：对象
         * argName：load名称
         * argTime: X毫秒后触发 默认500ms
         * 返回 timer 名称: timestamp+'-'+argName
         */
        add: (argData, argName, argTime) => {
            let name = (new Date()) + '-' + argName;
            if (typeof argData === 'object') {
                rs.timer[name] = $timeout(() => {
                    argData[argName] = true;
                }, argTime || 500);
            }
            return name;
        },
        /**
         * 设置loading字段为false
         * argData：对象
         * argName：timer 名称
         */
        rm: (argData, argName) => {
            if (!argData) {
                return;
            }
            $timeout.cancel(rs.timer[argName]);
            let name = argName.split('-')[1];
            rs.timer['tem'] = $timeout(() => {
                argData[name] = false;
                $timeout.cancel(rs.timer['tem']);
            }, 500);
        }
    };
    return rs;
});
DYC.run(function(service, load) {
    service.expand('load', function() {
        return load;
    });
});