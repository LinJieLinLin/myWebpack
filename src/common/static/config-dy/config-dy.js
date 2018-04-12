function configInit() {
    //本地开发域名配置
    var devHost = 'rcp.chk.gdy.io';
    var protocol = 'https:';
    var srvEnd = '.chk.gdy.io/';
    var srvList = {
        //课程相关
        course: protocol + '//course' + srvEnd,
        //单点登陆
        sso: protocol + '//sso' + srvEnd,
        //学习圈子
        studyCircle: protocol + '//dms' + srvEnd,
        //文件服务器
        fs: protocol + '//fs' + srvEnd,
        //首页搜索页数据转发
        pes: protocol + '//pes' + srvEnd,
        //首页搜索页数据转发
        pes2: protocol + '//pes2' + srvEnd,
        //首页地址
        rcp: location.protocol + '//' + location.host + '/',
        //记录地址
        ars: protocol + '//ars' + srvEnd,
        //评论相关地址
        appraise: protocol + '//appraise' + srvEnd,
        //记录信息相关地址
        extra: protocol + '//extra' + srvEnd,
        //聊天相关
        chat: protocol + '//imsd' + srvEnd,
        //订单相关地址
        order: protocol + '//order' + srvEnd,
        //超管地址
        admin: 'http://localhost:1238/',
        //统计相关地址
        count: protocol + '//count' + srvEnd,
        recruit: protocol + '//recruit' + srvEnd,
        tms: protocol + '//tms' + srvEnd
    };
    return {
        protocol: protocol,
        devHost: devHost,
        srvList: srvList,
        domain: {
            'rcp.chk.gdy.io': {
                type: 'kuxiao',
                linkList: [{
                    name: '酷校首页',
                    desc: 'kuxiao.cn',
                    logoBig: 'http://fs.chk.gdy.io/uUwaMx==.png',
                    logoSmall: 'http://fs.chk.gdy.io/8LE91A==.png',
                    url: 'http://rcp.chk.gdy.io',
                }, {
                    name: '酷校·高校版',
                    desc: 'gzmooc.cn',
                    logoBig: 'http://fs.chk.gdy.io/uUwaMx==.png',
                    logoSmall: 'http://fs.chk.gdy.io/8LE91A==.png',
                    url: 'http://gzmooc.chk.gdy.io',
                }, {
                    name: '爱科学首页',
                    desc: 'aikexue.com',
                    logoBig: 'image-sso-logo-akx',
                    logoSmall: 'image-sso-h-akx',
                    url: 'http://aikexue.chk.gdy.io',
                }]
            },
            'gzmooc.chk.gdy.io': {
                type: 'gzmooc',
                linkList: [{
                    name: '酷校首页',
                    desc: 'kuxiao.cn',
                    logoBig: 'http://fs.chk.gdy.io/uUwaMx==.png',
                    logoSmall: 'http://fs.chk.gdy.io/8LE91A==.png',
                    url: 'http://rcp.chk.gdy.io',
                }, {
                    name: '酷校·高校版',
                    desc: 'gzmooc.cn',
                    logoBig: 'http://fs.chk.gdy.io/uUwaMx==.png',
                    logoSmall: 'http://fs.chk.gdy.io/8LE91A==.png',
                    url: 'http://gzmooc.chk.gdy.io',
                }, {
                    name: '爱科学首页',
                    desc: 'aikexue.com',
                    logoBig: 'image-sso-logo-akx',
                    logoSmall: 'image-sso-h-akx',
                    url: 'http://aikexue.chk.gdy.io',
                }]
            },
            'aikexue.chk.gdy.io': {
                name: '爱科学首页',
                linkList: [{
                    name: '酷校首页',
                    desc: 'kuxiao.cn',
                    logoBig: 'http://fs.chk.gdy.io/uUwaMx==.png',
                    logoSmall: 'http://fs.chk.gdy.io/8LE91A==.png',
                    url: 'http://rcp.chk.gdy.io',
                }, {
                    name: '酷校·高校版',
                    desc: 'gzmooc.cn',
                    logoBig: 'http://fs.chk.gdy.io/uUwaMx==.png',
                    logoSmall: 'http://fs.chk.gdy.io/8LE91A==.png',
                    url: 'http://gzmooc.chk.gdy.io',
                }, {
                    name: '爱科学首页',
                    desc: 'aikexue.com',
                    logoBig: 'image-sso-logo-akx',
                    logoSmall: 'image-sso-h-akx',
                    url: 'http://aikexue.chk.gdy.io',
                }]
            },
            'linjie.chk.gdy.io': {
                type: 'aikexue',
                linkList: [{
                    name: '酷校首页',
                    desc: 'kuxiao.cn',
                    logoBig: 'http://fs.chk.gdy.io/uUwaMx==.png',
                    logoSmall: 'http://fs.chk.gdy.io/8LE91A==.png',
                    url: 'http://rcp.chk.gdy.io',
                }, {
                    name: '酷校·高校版',
                    desc: 'gzmooc.cn',
                    logoBig: 'http://fs.chk.gdy.io/uUwaMx==.png',
                    logoSmall: 'http://fs.chk.gdy.io/8LE91A==.png',
                    url: 'http://gzmooc.chk.gdy.io',
                }, {
                    name: '爱科学首页',
                    desc: 'aikexue.com',
                    logoBig: 'image-sso-logo-akx',
                    logoSmall: 'image-sso-h-akx',
                    url: 'http://aikexue.chk.gdy.io',
                }]
            },
        },
        chat: {
            imAddr: 'ws://rcp' + srvEnd.substring(0, srvEnd.length - 1) + ':24002/im',
        },
        sso: {
            wxAppid: 'wx12047de3b2967172',
        },
        course: {
            rUrl: srvList.course,
        },
        studyCircle: {
            rUrl: srvList.studyCircle
        },
        pes: {
            rUrl: srvList.pes,
        },
        pes2: {
            rUrl: srvList.pes2,
        },
        rcp: {
            rUrl: srvList.rcp,
        },
        ars: {
            rUrl: srvList.ars,
        },
        appraise: {
            rUrl: srvList.appraise,
        },
        extra: {
            rUrl: srvList.extra,
        },
        order: {
            rUrl: srvList.order,
        },
        admin: {
            rUrl: srvList.admin,
        },
        count: {
            rUrl: srvList.count,
        },
        recruit: {
            rUrl: srvList.recruit,
        },
        tms: {
            rUrl: srvList.tms,
        },
        live: protocol + '//pb.dev.jxzy.com/kxlive-setup.exe',
        template: [{
            index: 'kuxiao-template-index.html',
            name: '酷校',
        }, {
            index: 'aikexue-template-index.html',
            name: '爱科学',
        }, {
            index: 'gzmooc-template-index.html',
            name: 'MOOC',
        }, {
            index: 'xiuquan-template-index.html',
            name: '秀全',
        }],
    };
}
var DYCONFIG = configInit();
var g_conf = DYCONFIG;
// 全局增加css或JS
(function(doc) {
    function importHead(arr) {
        for (var i = 0; i < arr.length; i += 1) {
            var item = arr[i];
            switch (item.type) {
                case 'script':
                    doc.write('<script type="text/javascript" src="' + item.src + '"><\/script>');
                    break;
                case 'link':
                    doc.write('<link rel="stylesheet" href="' + item.href + '" />');
                    break;
            }
        }
    }
    var arr = [];
    var ssoUrl = DYCONFIG.srvList.sso;
    arr.push({
        type: 'script',
        src: ssoUrl + 'sso/api/uinfo.js?user=1&selector=bandc,role,orgInfo,orgCert&ret_role_org=1'
    });
    importHead(arr);
    //IE9跨域
    arr = [];
    var browser = navigator.appName;
    var b_version = navigator.appVersion;
    var version = b_version.split(";");
    if (version.length < 2) {
        return;
    }
    var trim_Version = version[1].replace(/[ ]/g, "");
    if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE9.0") {
        arr.push({
            type: 'script',
            src: location.protocol + '//' + location.host + '/rcp-common/xdomain/xdomain.min.js'
        });
        arr.push({
            type: 'script',
            src: location.protocol + '//' + location.host + '/rcp-common/xdomain/xdomain-opt.js'
        });
    }
    importHead(arr);
})(document);