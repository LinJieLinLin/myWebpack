// rcpAid
import COM from '../libs/com/com.js';
(function(win) {
    win.DYCONFIG = win.DYCONFIG || {
        domain: '',
        srvList: {},
        rcp: {},
    };
    DYCONFIG.domain = DYCONFIG.domain || {};
    // 不需要登陆也可以访问的页面
    DYCONFIG.noLoginPage = [
        '/',
        '/index.html',
        '/search.html',
        '/course/course-detail.html',
        '/discuss-detail.html',
        '/study-circle/study-circle-detail.html',
        '/assessment-detail.html'
    ];
    // 文件服务相关
    if (!DYCONFIG.fs) {
        DYCONFIG.fs = {};
    }
    $.extend(DYCONFIG.fs, {
        rUrl: DYCONFIG.srvList.fs,
        upload: DYCONFIG.srvList.fs + 'usr/api/uload',
        down: DYCONFIG.srvList.fs + 'usr/api/dload',
        info: DYCONFIG.srvList.fs + 'pub/api/info',
        listInfo: DYCONFIG.srvList.fs + 'pub/api/listInfo',
    });
    // 聊天相关
    $.extend(DYCONFIG.chat, {
        rUrl: DYCONFIG.srvList.chat,
        upload: DYCONFIG.srvList.fs + 'usr/api/uload',
        qryUsr: DYCONFIG.srvList.course + 'usr/api',
    });
    // 登陆相关
    $.extend(DYCONFIG.sso, {
        srv: DYCONFIG.srvList.sso,
        rUrl: DYCONFIG.srvList.sso,
        my: DYCONFIG.srvList.sso + 'sso/my.html',
        login: DYCONFIG.srvList.sso + 'sso/index.html',
        loginDialog: DYCONFIG.srvList.sso + 'sso/login-dialog.html',
        register: DYCONFIG.srvList.sso + 'sso/register.html',
        logout: DYCONFIG.srvList.sso + 'sso/logout.html',
        manage: DYCONFIG.srvList.sso + 'sso/management-center.html',
        wxSrv: 'https://api.weixin.qq.com/sns/oauth2/access_token',
    });
    DYCONFIG.rcp.rUrl = location.protocol + '//' + location.host + '/';
    /**
     * 添加权限
     * @param rolePermissionsConf 角色权限配置 (后端的角色类型对应拥有的权限)
     * @param {Array} permissions 已有权限列表
     * @param {string} name 后台的角色权限名
     * @param {string=} scene 适用场景 {'': permissions, 'rcp':rcpPermissions, 'org': org: orgPermissions}
     */
    function addPermissionsByRoleName(rolePermissionsConf, permissions, name, scene) {
        permissions = permissions || [];
        var c = rolePermissionsConf[name] || {};

        //  添加适用于所有场景scene的权限
        c.permissions && permissions.push.apply(permissions, c.permissions);

        //  添加对应场景的权限
        var added = '';
        switch (scene) {
            case 'rcp':
                added = c.rcpPermissions;
                break;
            case 'org':
                added = c.orgPermissions;
                break;
            case 'akx':
                added = c.akxPermissions;
                break;
            case 'orgRecruit':
                added = c.orgRecruitPermissions;
                break;
            default:
                break;
        }

        if (added) {
            permissions.push.apply(permissions, added);
        }

        return permissions;
    }
    // rcpAid
    win.OSINFO = COM.checkOS();
    win.rcpAid = {
        hideLog: COM.hideLog,
        changeTime: COM.changeTime,
        encodeHtml: COM.encodeHtml,
        decodeHtml: COM.decodeHtml,
        getRegexp: COM.getRegexp,
        urlParam: COM.urlParam,
        getCookie: COM.getCookie,
        setCookie: COM.setCookie,
        checkOS: COM.checkOS,
        clearFile: COM.clearFile,
        safe: COM.safe,
        closePage: COM.closePage,
        getElementPosition: COM.getElementPosition,
        getStyle: COM.getStyle,
        hasClass: COM.hasClass,
        addClass: COM.addClass,
        rmClass: COM.rmClass,
        tips: COM.tips,
        // 以下为旧函数
        isLogin: false,
        /**
         * 隐藏微信 
         * @param argHost [要隐藏的域名]
         */
        hideWeixin: (argHost) => {
            if (!argHost) {
                argHost = 'kjds';
            }
            if (rcpAid.urlParam('url').match(argHost) || location.host.match(argHost)) {
                return true;
            }
            return false;
        },
        /**
         * 获取文件类型对应的后缀
         * @return {[type]} [description]
         */
        getFileType: () => {
            return {
                // 需要转码的格式类型
                needTrans: ['3gp', 'avi', 'flv', 'mp4', 'm3u8', 'mpg', 'asf', 'wmv', 'mkv', 'mov', 'ts', 'webm', 'doc', 'docx', 'xps', 'rtf', 'jpg', 'jpeg', 'png', 'bmp', 'gif', 'ppt', 'pptx', 'pdf', 'amr', 'flac', 'wav', 'ape'],
                // 要转码文档
                doc: ['doc', 'docx', 'pdf', 'ppt', 'pptx'],
                // 不需要转码的文档
                txt: ['go', 'h', 'hpp', 'c', 'cpp', 'java', 'js', 'cs', 'm', 'sh', 'swift', 'xml', 'properties', 'ini', 'html', 'json', 'sql', 'txt'],
                image: ['png', 'jpg', 'bmp', 'gif', 'jpeg'],
                // 阿里云支持格式
                video: ['3gp', 'avi', 'flv', 'mp4', 'm3u8', 'mpg', 'asf', 'wmv', 'mkv', 'mov', 'ts', 'webm'],
                audio: ['mp3', 'amr', 'flac', 'wav', 'ape'],
                flash: ['swf'],
            };
        },
        /**
         * 判断后缀是否属于某类型或返回所在类型
         * @param  {[type]} argExt  [后缀 必]
         * @param  {[type]} argType [类型 非]
         * @return {[type]}         [description]
         */
        checkFileType: (argExt, argType) => {
            argExt = ',' + argExt.replace('.', '');
            var fileType = rcpAid.getFileType(),
                k;
            if (argType && (',' + fileType[argType].join(',')).match(argExt)) {
                return argType;
            } else {
                for (k in fileType) {
                    if ((',' + fileType[k].join(',')).match(argExt)) {
                        return k;
                    }
                }
            }
            return false;
        },
        /**
         * 网站页面名称统一管理
         * @param  {String}  argName  是要拿的页面中文名称
         * @return {String}        返回实际页面名称
         */
        getPage: (argName) => {
            if (typeof argName !== 'string') {
                return '';
            }
            var url = '';
            var index = DYCONFIG.rcp.rUrl;
            switch (argName) {
                case '首页':
                    url = index;
                    break;
                case '登录':
                    url = DYCONFIG.sso.login;
                    break;
                case '退出':
                    url = DYCONFIG.sso.logout;
                    break;
                case '注册':
                    url = DYCONFIG.sso.register;
                    break;
                case '微信绑定':
                    url = DYCONFIG.sso.rUrl + 'sso/bind.html';
                    break;
                case '第三方登录':
                    url = DYCONFIG.sso.rUrl + 'sso/third-login.html';
                    break;
                case '信息完善':
                    url = DYCONFIG.sso.rUrl + 'sso/user-info.html';
                    break;
                case '搜索':
                    url = index + 'search.html';
                    break;
                case '分类':
                    url = '/search.html';
                    break;
                case '个人设置':
                    url = '/space/my.html';
                    break;
                case '机构认证':
                    // url = DYCONFIG.sso.rUrl + 'sso/organisation-auth.html';
                    url = '/space/organisation-auth.html';
                    break;
                case '学习中心':
                    url = '/space/student-space.html';
                    break;
                case '教学中心':
                    url = '/space/teacher-space.html';
                    break;
                case '下载报表':
                    url = DYCONFIG.course.rUrl + 'usr/api/downReport';
                    break;
                case '导学中心':
                    url = '/space/guide-study.html';
                    break;
                case '助学中心':
                    url = '/guidance-space.html';
                    break;
                case '实名认证':
                    url = '/space/real-name-certification.html';
                    break;
                case '实名认证引导':
                    url = '/space/guide-certification.html';
                    break;
                case '家长空间':
                    url = '/parentSpace.html';
                    break;
                case '班级空间':
                    url = '/classSpace.html';
                    break;
                case '学校空间':
                    url = '/schoolSpace.html';
                    break;
                case '机构空间':
                    url = '/organizationSpace.html';
                    break;
                case '用户管理':
                    url = '/userManager.html';
                    break;
                case '课程详情':
                    url = '/course/course-detail.html';
                    break;
                case '题库详情':
                    url = '/course/course-detail.html';
                    break;
                case '创建课程':
                    url = '/course/course-edit.html';
                    break;
                case '创建题库':
                    url = '/course/course-edit.html';
                    break;
                case '学习页':
                    url = '/course/pc-course-learning.html';
                    break;
                case '圈子详情':
                    url = '/study-circle/study-circle-detail.html';
                    break;
                case '全部圈子':
                    url = '/study-circle/study-circle-total.html';
                    break;
                case '做题页':
                    url = '/course/exam.html';
                    break;
                case '解析页':
                    url = '/course/exam-resolve-view.html';
                    break;
                case '批改页':
                    url = '/course/correct-paper.html';
                    break;
                case '评测编辑页':
                    url = '/course/edit-paper.html';
                    break;
                case '管理中心':
                    url = '/space/management-center.html#/jump';
                    break;
                case '超管管理中心':
                    url = DYCONFIG.admin.rUrl + 'space/management-center.html#/jump';
                    break;
                case '我要吐槽':
                    // url = '/discuss-page.html';
                    url = 'http://bbs.kuxiao.cn/viewforum.php?f=22';
                    break;
                case '吐槽帖子详情':
                    url = '/discuss-detail.html';
                    break;
                case '课程评价':
                    url = '/assessment-detail.html';
                    break;
                case '学习痕迹':
                    url = '/course/learning-record-new.html';
                    break;
                case '确认订单':
                    url = '/order/confirm-order.html';
                    break;
                case '已售订单':
                    // 这里的已售订单指代 卖出的课程
                    url = '/order/trading.html#/course/sold';
                    break;
                case '我的订单':
                    // 这里的我的订单指代 买到的课程
                    url = '/order/trading.html#/course/bought';
                    break;
                case '订单详情':
                    url = '/order/order-detail.html';
                    break;
                case '支付结果':
                    url = '/order/pay-result.html';
                    break;
                case '课程管理':
                    url = '/course/course-management.html';
                    break;
                case '编辑试卷':
                    url = '/course/exam-edit.html';
                    break;
                case '知识地图':
                    url = '/course/knowledge-map.html';
                    break;
                case '直播室':
                    url = '/course/live-play.html';
                    break;
                case '警报中心':
                    url = '/space/alarm-center.html';
                    break;
                case '移动端历史备注':
                    url = '/space/mobile-remark-list.html';
                    break;
                case '人才招聘':
                    url = '/space/recruit.html';
                    break;
                case '职位详情':
                    url = '/space/recruit-detail.html';
                    break;
                case '招聘机构首页':
                    url = '/space/company.html';
                    break;
                case '简历预览':
                    url = '/space/my-resume-preview.html';
                    break;
                case '招聘套餐支付':
                    url = '/space/resume-pay.html';
                    break;
                case '招聘支付结果':
                    url = '/space/resume-pay-result.html';
                    break;
                case '合同预览':
                    url = '/space/contract-preview.html';
                    break;
                case '职位全部面试评价':
                    url = '/space/post-evaluation.html';
                    break;
                case '公司全部面试评价':
                    url = '/space/company-interview-experiences.html';
                    break;
                case '微信支付':
                    url = '/order/wechat-pay.html';
                    break;
                case '简历微信支付':
                    url = '/space/resume-wechat-pay.html';
                    break;
                case '交易中心':
                    url = '/order/trading.html';
                    break;
                case '钱包账户充值':
                    url = '/order/wallet-recharge.html';
                    break;
                case '钱包账户充值微信支付':
                    url = '/order/wallet-recharge-we.html';
                    break;
                case '钱包账户充值结果':
                    url = '/order/wallet-recharge-result.html';
                    break;
                case '购买课程-钱包支付':
                    url = '/order/buy-course-wallet.html';
                    break;
            }
            return url;
        },
        /**
         * 获取链接，从配置里拿到页面名称把链接串起来
         * @param  {String}          argName   是要拿的页面中文名称
         * @param  {Object||String}  argParam  {Object}是地址GET的传参 ||  {String} 是用在地址的哈希值
         * @return {String}                 返回实际Url地址
         */
        getUrl: (argName, argParam) => {
            var _this = win.rcpAid;
            var originUrl = _this.getPage(argName);
            if (!originUrl) {
                return '';
            }

            var i = originUrl.indexOf('#');
            (i === -1) && (i = originUrl.length);
            var url = originUrl.slice(0, i);
            var hash = originUrl.slice(i);

            var type = typeof argParam;
            switch (type) {
                case 'object':
                    var search = '';
                    for (var key in argParam) {
                        if (!argParam.hasOwnProperty(key)) {
                            continue;
                        }
                        search += '&' + key + '=' + (argParam[key] || '');
                    }
                    if (search) {
                        url += '?' + search.slice(1);
                    }
                    break;
                case 'string':
                    url += argParam;
                    break;
            }
            if (hash && url.indexOf('#') === -1) {
                url += hash;
            }
            return url;
        },
        /**
         * 获取平台域名信息http:// or https://
         * @param  {string} [argType]                       ['url':读取页面url参数]
         * @return {{host: string, origin: string}}         [host:域名，origin:域名含http]
         */
        getHost: (argType) => {
            var hostInfo = {
                host: rcpAid.urlParam('devHost') || DYCONFIG.devHost,
                origin: '',
            };
            if (DYCONFIG.devHost || rcpAid.urlParam('devHost')) {
                hostInfo.host = rcpAid.urlParam('devHost') || DYCONFIG.devHost;
            } else if (argType === 'url') {
                var temHost = rcpAid.urlParam('url').split('/');
                hostInfo.host = temHost[2] || location.host;
            } else {
                hostInfo.host = location.host;
            }
            if (hostInfo.host) {
                hostInfo.origin = DYCONFIG.protocol + '//' + hostInfo.host + '/';
            }
            return hostInfo;
        },
        /**
         * 遍历array、json
         * @param  {object}    object
         * @param  {Function}  callback  回调函数(value,key)
         */
        each: (argObject, argCallback) => {
            if (typeof argObject !== 'object') {
                return;
            }
            for (var member in argObject) {
                if (!argObject.hasOwnProperty(member)) {
                    continue;
                }
                if (typeof argCallback === 'function') {
                    argCallback(argObject[member], member);
                }
            }
        },
        /**
         * [getToken 获取token]
         * @return {string} [description]
         */
        getToken: () => {
            var token = win.UINFO && win.UINFO.token;
            return token || rcpAid.urlParam('token') || rcpAid.getCookie('token');
        },
        /**
         * [loginStatus 获取登陆状态MOBILE页面用]
         * @return {[type]} [返回登陆用户token或URL中的token，移动端页面登陆用]
         */
        loginStatus: () => {
            return rcpAid.getToken();
        },
        /**
         * [checkLogin 检查用户是否登陆]
         * @return {[type]} [未登陆返回false，已登陆返回用户信息]
         */
        checkLogin: () => {
            try {
                console.log(UINFO);
                if (!UINFO || !UINFO.uid) {
                    var token = rcpAid.urlParam('token');
                    if (token) {
                        return { urlToken: token };
                    }
                    return 0;
                }
                return UINFO;
            } catch (e) {
                window.UINFO = {};
                if (rcpAid.urlParam('token')) {
                    console.log('urlToken');
                    return { urlToken: rcpAid.urlParam('token') };
                }
                console.log('读取用户信息出错！');
                return 0;
            }
        },
        /**
         * [getNoTokenUrl 获取不带TOKEN的当前页面URL]
         * @return {[type]} [description]
         */
        getNoTokenUrl: () => {
            var url = location.href;
            var reg = /[?&]token=([^&]+)/gi;
            url = url.replace(reg, '');
            return url;
        },
        /**
         * 获取用户当前使用的平台类型
         * @returns {*}     'kuxiao'  酷校，'aikexue'  爱科学，'gzmooc'   广州慕课
         */
        getPlatformType: (argHost) => {
            var host = argHost || rcpAid.getHost('url').host;
            var temHost = DYCONFIG.domain[host] || {};
            return temHost.type || 'kuxiao';
        },
        /**
         * 获取平台名称
         * @param argHost. 域名
         * @returns {string}
         */
        getPlatformName: (argHost) => {
            var host = argHost || rcpAid.getHost('url').host;
            var temHost = DYCONFIG.domain[host] || {};
            return temHost.name || '';
        },
        /**
         * 获取平台列表
         * @param domain.
         * @returns {Array}
         */
        getPlatformList: (domain) => {
            domain = domain || DYCONFIG.domain || {};
            var l = [];
            var h;
            for (h in domain) {
                if (domain.hasOwnProperty(h) && domain[h].name) {
                    var d = domain[h];
                    l.push({
                        name: d.name,
                        host: h,
                        type: d.type,
                        //  非数字 顺序为无穷大
                        order: (typeof d.order === 'number' && !isNaN(d.order)) ? d.order : Infinity
                    });
                }
            }

            //  按 order 升序排序
            return l.sort(function(a, b) {
                return a.order - b.order;
            });
        },
        /**
         * 获取服务器现在的时间
         */
        getServerCurrentTime: () => {
            var s = win.SRV_TIME == null ? new Date().getTime() : win.SRV_TIME;
            var onload = win.ONLOAD_TIME == null ? s : win.ONLOAD_TIME;
            return new Date(new Date().getTime() - onload + s);
        },
        /**
         * 获取用户呢称. 根据 id 从 users map 获取昵称
         * @param {object} users
         * @param {string} uid
         * @returns {string}
         */
        getUserNickNameOnMapById: (users, uid) => {
            var nickName = '';
            if (users && users[uid]) {
                try {
                    nickName = users[uid].attrs.basic.nickName;
                } catch (e) {
                    console.log('[aid] getUserNickNameOnMapById error', users, uid);
                }
            }
            return nickName;
        },
        /**
         * 获得用户权限信息
         * @param usr
         * @param options . {orgs: '机构信息'}
         */
        getUserPermissionsInfo: (usr, options) => {
            options = options || {};
            var orgs = options.orgs || {};
            var _self = rcpAid;

            //  角色类型
            var constants = DYCONFIG.constants;
            var RoleTypes = constants.userRole;
            var rolePermissionsConf = constants.rolePermissionsConf;
            var permissionsType = constants.permissions;

            var roleInfo = {
                //  是否管理员
                isAdmin: false,
                //  角色类型
                roleType: RoleTypes.GENERAL,
                //  最小的权限集 保存固定的最小的权限列表
                minPermissions: [],
                //  拥有的权限
                hasPermissions: [],
                //  拥有管理权限的机构
                managedOrgs: [],
                currentManagedOrg: {}
            };

            try {
                //  100 正常权限
                var normalCode = 100;

                //  role type
                var rt = RoleTypes.GENERAL;
                var permissions = [];
                var managedOrgs = [];
                var currentManagedOrg = {};

                //  角色
                var role = usr.attrs.role;
                //  机构信息
                var orgInfo = usr.attrs.orgInfo || {};

                //  当前平台: 'kuxiao' 酷校，'aikexue' 爱科学，'gzmooc' 广州慕课
                var platformType = _self.getPlatformType();
                var isAikexue = platformType === 'aikexue';
                var isAikexueTeacher = false;

                //  判断权限
                if (!role) {
                    rt = RoleTypes.GENERAL;
                } else {
                    if (role['RCP_ADMIN'] === normalCode) {
                        //  平台管理员 超管
                        rt = RoleTypes.ADMIN_RCP;

                        permissions = addPermissionsByRoleName(rolePermissionsConf, permissions, 'RCP_ADMIN', 'rcp');
                    } else if (role['ORG_ADMIN'] === normalCode) {
                        //  机构账号 机构创始人
                        rt = RoleTypes.ORG_CREATOR;
                        permissions = addPermissionsByRoleName(rolePermissionsConf, permissions, 'ORG_ADMIN', 'org');

                        //  机构具有招聘权限
                        if (role['RECRUIT_ADMIN'] === normalCode) {
                            permissions = addPermissionsByRoleName(rolePermissionsConf, permissions, 'ORG_ADMIN', 'orgRecruit');
                        }

                        var _t = {};
                        _t[usr.id] = usr;
                        currentManagedOrg = {
                            orgid: usr.id,
                            name: _self.getUserNickNameOnMapById(_t, usr.id),
                            orgInfo: orgInfo,
                            _org: usr
                        }
                    } else if (role.org) {
                        //  机构管理员 (普通用户被机构账号授权)
                        var _orgs = role.org;

                        //  多个机构
                        for (var i = 0, il = _orgs.length; i < il; i++) {
                            var _o = _orgs[i];

                            //  爱科学目前只判断是否教师身份 只要属于其中一个机构的教师，那么就是教师身份 160927
                            if (isAikexue) {
                                if (_o['AKX_TEACHER'] === normalCode) {
                                    isAikexueTeacher = true;
                                    break;
                                }
                                continue;
                            }

                            var list = [];
                            for (var _p in _o) {
                                if (_o.hasOwnProperty(_p) && _o[_p] === normalCode) {
                                    list = addPermissionsByRoleName(rolePermissionsConf, list, _p, 'org');
                                }
                            }

                            if (list.length) {
                                managedOrgs.push({
                                    orgid: _o.orgid,
                                    name: _self.getUserNickNameOnMapById(orgs, _o.orgid),
                                    _org: orgs[_o.orgid],
                                    permissions: list
                                });
                            }
                        }

                        if (managedOrgs.length) {
                            rt = RoleTypes.ADMIN_ORG;
                        }
                    } else {
                        var _has = false;
                        //  其他管理员
                        for (var r in role) {
                            if (role.hasOwnProperty(r) && role[r] === normalCode) {
                                permissions = addPermissionsByRoleName(rolePermissionsConf, permissions, r, 'rcp');
                                _has = true;
                            }
                        }

                        rt = _has && permissions.length ? RoleTypes.ADMIN_GENERAL : RoleTypes.GENERAL;
                    }
                }

                if (isAikexueTeacher) {
                    permissions.push(permissionsType.AIKEXUE_TEACHER);
                }

                //  判断管理员
                switch (rt) {
                    case RoleTypes.ADMIN_RCP:
                    case RoleTypes.ORG_CREATOR:
                    case RoleTypes.ADMIN_ORG:
                    case RoleTypes.ADMIN_GENERAL:
                        roleInfo.isAdmin = true;
                        break;
                    default:
                        roleInfo.isAdmin = false;
                }
                roleInfo.roleType = rt;
                roleInfo.minPermissions = permissions;
                roleInfo.hasPermissions = permissions.concat();
                roleInfo.managedOrgs = managedOrgs;
                roleInfo.currentManagedOrg = currentManagedOrg;
            } catch (e) {
                console.log('[aid] 角色权限检查出错', usr, options, e);
            }
            return roleInfo;
        },
        /**
         * 活动时间处理函数
         * @type {{duringTimeFn, seTimeFn}}
         */
        getActivityTime: (function() {
            var dayTimestamp = 24 * 3.6e3 * 1e3;

            var day2name = ['日', '一', '二', '三', '四', '五', '六'];

            //  时长可选的单位
            //  name: 显示文本, factor: 系数(乘数)
            var durationUnits = [
                { name: '天', factor: dayTimestamp },
                { name: '周', factor: 7 * dayTimestamp },
                { name: '月', factor: 30 * dayTimestamp },
                { name: '年', factor: 365 * dayTimestamp }
            ];

            //  格式化活动时长
            function formatActivityDuration(duration) {
                if (!duration && duration !== 0) return '--';
                duration = +duration;

                if (isNaN(duration) || duration === 0) {
                    return '无限期';
                }

                //  时长数目
                var num;
                //  时长单位信息
                var unit;

                var units = durationUnits;
                var i;
                for (i = units.length - 1; i >= 0; i--) {
                    if (!(duration % units[i].factor)) {
                        break;
                    }
                }

                unit = units[i];

                //  数据错误 时长小于一天
                if (!unit) {
                    unit = units[0];
                }

                num = +(duration / unit.factor).toFixed(0);
                return num === 0 ? '无限期' : num + unit.name;
            }

            /**
             * 活动时间计算
             * @param start
             * @param end
             * @returns {*}
             */
            function activityTimeHandle(start, end) {
                if (!start && !end && start !== 0 && end !== 0) return '--';
                start = new Date(start);
                end = new Date(end);
                var text = '';

                var startI = start.getTime();
                var endI = end.getTime();

                isNaN(startI) && (startI = 0);
                isNaN(endI) && (endI = 0);

                if (startI === 0 && endI === 0) {
                    return '无限期';
                }

                //  var startFormat = 'YYYY-MM-DD[[周' + day2name[start.getDay()] + ']] 至';
                //  var endFormat = ' YYYY-MM-DD[[周' + day2name[end.getDay()] + ']]';

                //  '2016-08-11[周三] 至 2016-12-30[周六]'
                if (startI === 0) {
                    text = '-- 至';
                } else {
                    text = moment(start).format('YYYY-MM-DD[[周' + day2name[start.getDay()] + ']] 至');
                }
                if (endI === 0) {
                    text += ' -- ';
                } else {
                    text += moment(end).format(' YYYY-MM-DD[[周' + day2name[end.getDay()] + ']]');
                }
                return text;
            }

            return {
                duringTimeFn: formatActivityDuration,
                seTimeFn: activityTimeHandle
            };
        })(),
        /**
         * 切换 html overflow hidden 属性
         */
        toggleHtmlOverflowHidden: (function() {
            var init = false;
            var count = 0;

            //  初始化 模态框 overflow css
            function initModalOverflowCss() {
                var rc = getScrollBarRect();
                rc.halfWidth = rc.width / 2;
                rc.halfHeight = rc.height / 2;
                var contentTpl =
                    `html.modal-mask-open {overflow:hidden}
                    html.modal-overflow-fix {margin-right: ${rc.width}px}
                    html.modal-overflow-fix .modal-of-shifting {position:relative; right: ${rc.halfWidth}px}
                    html.modal-overflow-fix .modal-of-translate-shifting {transition-property:none; transform:translate(-${rc.halfWidth}px, -${rc.halfHeight}px)}
                    html.modal-overflow-fix .modal-of-translate-shifting-x {transition-property:none; transform:translateX(-${rc.halfWidth}px)}
                    html.modal-overflow-fix .modal-of-translate-shifting-y {transition-property:none; transform:translateY(-${rc.halfHeight}px)`
                var cssTpl = '<style type="text/css">' + contentTpl + '</style>';
                $('head').prepend(cssTpl);
            }

            function getScrollBarRect() {
                var width;
                var height;
                var parent = window.document.createElement('DIV');
                parent.style.cssText = 'overflow:auto;position:absolute;top:0;width:100px;height:100px';

                var child = window.document.createElement('DIV');
                child.style.cssText = 'width:200px;height:200px';

                parent.appendChild(child);
                window.document.body.appendChild(parent);

                width = parent.offsetWidth - parent.clientWidth;
                height = parent.offsetHeight - parent.clientHeight;

                parent.parentNode.removeChild(parent);
                return { width: width, height: height };
            }

            return function(attr) {
                if (typeof attr !== 'boolean') {
                    return;
                }

                if (!init) {
                    initModalOverflowCss();
                    init = true;
                }

                count += attr ? 1 : -1;

                if (count === 1) {
                    $('html').addClass('modal-mask-open modal-overflow-fix');
                } else if (count === 0) {
                    $('html').removeClass('modal-mask-open modal-overflow-fix');
                }
                count < 0 && (count = 0);
            };
        })(),
        /**
         * 检测当前环境是否支持自定义协议
         * @param argUri 目标uri
         * @param argSuccessCb 成功回调
         * @param argFailCb 失败回调
         * @param argUnknownCb 未知错误/无法确定时回调
         */
        launchUri: (argUri, argSuccessCb, argFailCb, argUnknownCb) => {
            var parent, popup, iframe, timer, timeout, blurHandler, timeoutHandler, browser;

            function callback(cb) {
                if (typeof cb === 'function') {
                    cb();
                }
            }

            function createHiddenIframe(parent) {
                var iframe;
                if (!parent) {
                    parent = document.body;
                }
                iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                parent.appendChild(iframe);
                return iframe;
            }

            function removeHiddenIframe(parent) {
                if (!iframe) {
                    return;
                }
                if (!parent) {
                    parent = document.body;
                }
                parent.removeChild(iframe);
                iframe = null;
            }

            browser = {
                isChrome: false,
                isFirefox: false,
                isIE: false
            };

            if (window.chrome && !navigator.userAgent.match(/Opera|OPR\//)) {
                browser.isChrome = true;
            } else if (typeof InstallTrigger !== 'undefined') {
                browser.isFirefox = true;
            } else if ('ActiveXObject' in window) {
                browser.isIE = true;
            }

            if (navigator.msLaunchUri) {
                //  Win8及以上的IE10+通过navigator.msLaunchUri方法检测

                navigator.msLaunchUri(argUri, argSuccessCb, argFailCb);
            } else if (browser.isChrome) {
                //  Chrome下通过判断500毫秒内是否失去焦点（Not Very Perfect）

                blurHandler = function() {
                    window.clearTimeout(timeout);
                    window.removeEventListener('blur', blurHandler);
                    callback(argSuccessCb);
                };
                timeoutHandler = function() {
                    window.removeEventListener('blur', blurHandler);
                    callback(argFailCb);
                };
                window.addEventListener('blur', blurHandler);
                timeout = window.setTimeout(timeoutHandler, 500);
                window.location.href = argUri;
            } else if (browser.isFirefox) {
                //  Firefox下通过捕捉"NS_ERROR_UNKNOWN_PROTOCOL"错误信息

                iframe = createHiddenIframe();
                try {
                    iframe.contentWindow.location.href = argUri;
                    callback(argSuccessCb);
                } catch (e) {
                    if (e.name === 'NS_ERROR_UNKNOWN_PROTOCOL') {
                        callback(argFailCb);
                    } else {
                        callback(argUnknownCb);
                    }
                } finally {
                    removeHiddenIframe();
                }
            } else if (browser.isIE) {
                //  Win7下的IE通过新窗口判断

                popup = window.open('', 'launcher', 'width=0,height=0');
                popup.location.href = argUri;
                try {
                    popup.location.href = 'about:blank';
                    callback(argSuccessCb);

                    timer = window.setInterval(function() {
                        popup.close();
                        if (popup.closed) window.clearInterval(timer);
                    }, 500);
                } catch (e) {
                    popup = window.open('about:blank', 'launcher');
                    popup.close();
                    callback(argFailCb);
                }
            } else {
                iframe = createHiddenIframe();
                iframe.contentWindow.location.href = argUri;
                window.setTimeout(function() {
                    removeHiddenIframe(parent);
                    callback(argUnknownCb);
                }, 500);
            }
        },
        /**
         * 函数节流
         * @param func 原本执行函数
         * @param wait 间隔毫秒
         * @returns {Function} 包裹函数
         */
        throttle: function(func, wait) {
            var context, args, timeout, result;
            var previous = 0;
            var later = function() {
                previous = new Date();
                timeout = null;
                result = func.apply(context, args);
            };
            return function() {
                var now = new Date();
                var remaining = wait - (now - previous);
                context = this;
                args = arguments;
                if (remaining <= 0) {
                    clearTimeout(timeout);
                    timeout = null;
                    previous = now;
                    result = func.apply(context, args);
                } else if (!timeout) {
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        },
        /**
         * 获取给定时间的零点
         * @param dateTemp
         * @returns {*}
         */
        getZeroTimeStamp: (dateTemp) => {
            console.log('this is getZeroTimeStamp receive arg(dateTemp):', dateTemp);
            if (!dateTemp) {
                return '';
            }
            var dateObj = new Date(dateTemp);
            var y = dateObj.getFullYear();
            var m = dateObj.getMonth();
            var d = dateObj.getDate();
            return new Date(y, m, d).getTime();
        },
    };
})(window);
/**
 * [检测是否低于IE9，监听angular报错]
 * @return {[type]} [description]
 */
(function(win, doc) {
    var oldBrowser = false;
    if (typeof OSINFO.isIE === 'number' && OSINFO.isIE < 9) {
        oldBrowser = true;
    }
    // 备案号
    var caseNum = '';
    if (DYCONFIG.domain[rcpAid.getPlatformType()]) {
        caseNum = DYCONFIG.domain[rcpAid.getPlatformType()].domainNum;
    }
    if (oldBrowser) {
        var str =
            '<html style="background-color:#e2e2e2;">' +
            '<head>' +
            '<meta charset="utf-8">' +
            '</head>' +
            '<body>' +
            '<div id="browser-not-support" style="background: #e2e1e2;height:100%;position: absolute;top:0;left:0;right:0;z-index:999999;">' +
            '<div style="width: 1000px; text-align:center;margin:auto;position:relative">' +
            '<div style="background: url(/imgs/com/browser_03.jpg);width:756px;height:520px;margin:auto;padding: 40px 0 20px;"></div>' +
            '<div style="text-align:center;padding: 0 200px;margin-top: 20px;">' +
            '<a href="http://rj.baidu.com/soft/detail/14744.html" style="display: block; float: left;width: 200px;color:#233344;text-decoration: none;" target="_blank">' +
            '<img src="/imgs/com/browser_07.png" alt="">' +
            '<p>谷歌浏览器<br><span style="color: #fe3a20">（强烈推荐）</span></p>' +
            '</a>' +
            '<a href="http://rj.baidu.com/soft/detail/11843.html" style="display: block; float: left;width: 200px;color:#233344;text-decoration: none;" target="_blank">' +
            '<img src="/imgs/com/browser_09.png" alt="">' +
            '<p>火狐浏览器</p>' +
            '</a>' +
            '<a href="http://rj.baidu.com/soft/detail/23357.html" style="display: block; float: left;width: 200px;color:#233344;text-decoration: none;" target="_blank">' +
            '<img src="/imgs/com/browser_11.png" alt="">' +
            '<p>Internet Explorer 10+</p>' +
            '</a>' +
            '<div style="clear: both;"></div>' +
            '</div>' +
            '<p style="color:#35383b;font-size:16px;padding: 50px 0 20px;">© 2009-2018 广州市大洋信息技术股份有限公司 ' + caseNum + '</p>' +
            '</div>' +
            '</div>' +
            '</body>' +
            '</html>';
        window.onload = function() {
            document.write(str);
        };
    }
    //  [mobileUpgradeStyle angular报错时的提示页]
    var mobileUpgradeStyle = win.mobileUpgradeStyle;
    doc.runErrorCallUpgrade = function() {
        console.log(doc.loadReady);
        if (false && !doc.loadReady && !win.notCheckUpgrade) {
            doc.upgradeLock = true;
            doc.querySelector('html').style.display = 'none';
        }
        return;
    };
    win.addEventListener('load', function() {
        doc.loadReady = true;
        if (doc.upgradeLock) {
            doc.write([
                '<html style="background:white url(\'/rcp-common/imgs/icon/upgrade-bg.png\') no-repeat center 80px;' + (mobileUpgradeStyle ? 'background-size:150% auto;' : '') + '">',
                '<head>',
                '<meta charset="utf-8">',
                '</head>',
                '<body style="' + (mobileUpgradeStyle ? 'padding:125% 0 80px;' : 'padding:560px 0 80px;') + '">',
                '<div style="' + (mobileUpgradeStyle ? 'font:12px \'Microsoft YaHei\';' : 'font:28px \'Microsoft YaHei\';') + 'color:#666;text-align:center;">啊哦，系统升级中,我们正在紧急处理，稍后再来哦！</div>',
                '</body>',
                '</html>'
            ].join(''));
        }
    }, false);
    /**
     * [description]
     * @param  {[type]} win [处理console.*失效问题]
     * @return {[type]}     [description]
     */
    if (!win.console) {
        win.console = {
            log: function() {},
            error: function() {},
            info: function() {},
            warn: function() {}
        };
    }
})(window, document);