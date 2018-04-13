require('ui/iconfont/demo.css');
require('./index.scss');
/* globals Prism,Clipboard */
window.Clipboard = require('clipboard');
// 代码高亮
require('prismjs/themes/prism-coy.css');
require('prismjs/plugins/toolbar/prism-toolbar.css');
require('prismjs/prism.js');
require('prismjs/plugins/toolbar/prism-toolbar.min.js');
require('prismjs/plugins/normalize-whitespace/prism-normalize-whitespace.min.js');
require('prismjs/plugins/show-language/prism-show-language.min.js');
require('prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.js');
// 时间插件
require('libs/laydate/theme/default/laydate.css');
import laydate from 'libs/laydate/laydate.js';
// scss _val说明
require('./val.js');
import _ from 'lodash';
import LinPlayer from '../../common/libs/lin-player/lin-player.js';
window.DY = angular.module('RCP', [
    'COM',
    'DIR',
    require('angular-messages'),
    require('angular-animate'),
]);
window.DY.controller('uiCtrl', function($scope, $rootScope, service, $filter, $timeout) {
    // 内容列表
    let linPlayer;
    let c = $scope.c = {};
    let d = $scope.d = {};
    // f = $scope.f = {
    //     tabClick: 'tab点击切换',
    // };
    let f = $scope.f = {
        alert: () => {
            service.dialog.alert('我是提示语info', 'info');
            service.dialog.alert('我是提示语success', 'success');
            service.dialog.alert('我是提示语warn', 'warn');
            service.dialog.alert('我是提示语error', 'error');
        },
        /**
         * tab点击切换
         * @param name 名字
         * @param type 类型
         */
        tabClick: (name, type) => {
            console.log('this is tabClick receive name，type: ', name, type);
            if (type === 'T1') {
                return;
            }
            $('.ui-right').stop().animate({ scrollTop: 0 }, 'slow');
            d.curTab = name;
        },
        // 播放音频
        playMusic: (argIndex) => {
            if (argIndex) {
                linPlayer[argIndex].obj.play();
            } else {
                let musicPlay = LinPlayer({
                    type: 'audio',
                    // fid: 'mulAudio',
                    id: 'a0',
                    src: 'http://192.168.3.32:1002/%E5%8F%B6%E9%87%8C%E3%80%81%E5%AE%89%E4%B9%9D-%E6%A2%A6%E9%87%8C%E6%B1%9F%E5%B1%B1.mp3',
                    title: '我们都一样',
                    autoPlay: 0,
                    theme: 'a-mutl',
                });
            }
        },
        // 分页改变
        pageChangeFn: (argFn) => {
            let data = {
                not_ext: 0,
                pn: c.pageConfig.pageInfo.pn,
                ps: c.pageConfig.pageInfo.ps,
                ret_ext_count: 1,
                token: rcpAid.getToken()
            }
            let load = service.load.add(c.loadData.data, 'load');
            service.common.test(data).then((rs) => {
                console.log(rs);
                if (rcpAid.safe(rs, 'data.total')) {
                    c.pageConfig.pageInfo.total = rs.data.total;
                    d.pageData = rs.data.files;
                    service.load.rm(c.loadData.data, load);
                    c.loadData.data.empty = !rcpAid.safe(d, 'pageData', []).length;
                }
                if (typeof argFn === 'function') {
                    argFn();
                }
            }, (e) => {
                console.log(e);
                service.load.rm(c.loadData.data, load);
            });
        },
        // 上传base64
        uploadBase: () => {
            $timeout(function() {
                if (c.uploadBase.scope) {
                    c.uploadBase.scope.selectImg();
                }
            });
        },
        // 读取scss 变量 
        readScssVal: () => {
            let data = window.scss.split('//');
            d.scssData = [];
            angular.forEach(data, (v, k) => {
                if (!v || !v.split('\n')[1]) {
                    return;
                }
                let temData = {
                    key: v.split('\n')[1].split(':')[0],
                    val: v.split('\n')[1].split(':')[1].replace(';', ''),
                    desc: v.split('\n')[0],
                }
                d.scssData.push(temData);
            })
        }
    };
    $scope.init = () => {
        // 时间选择器
        laydate.render({
            elem: '#datetime',
            type: 'datetime'
        });
        laydate.render({
            elem: '#datetime1',
        });
        let templateUrl = require('ui/iconfont/demo_fontclass.html');
        $('#iconfontDemo').html(templateUrl);
        d.isIE9 = $rootScope.G.isIE9;
        // 左侧栏列表array
        d.contentList = [
            [{
                    name: '设计风格',
                    type: 'T1'
                },
                {
                    name: '变量、颜色',
                    type: 'T2'
                },
                {
                    name: '操作图标',
                    type: 'T2'
                }
            ],
            [{
                    name: '框架布局',
                    type: 'T1'
                },
                {
                    name: '基本布局',
                    type: 'T2'
                },
                {
                    name: '卡片布局',
                    type: 'T2'
                },
                {
                    name: '左航导航',
                    type: 'T2'
                },
                {
                    name: '右侧浮窗',
                    type: 'T2'
                }
            ],
            [{
                    name: '控件',
                    type: 'T1'
                }, {
                    name: '进度条',
                    type: 'T2'
                }, {
                    name: 'step条',
                    type: 'T2'
                }, {
                    name: '按钮',
                    type: 'T2'
                }, {
                    name: '按钮一',
                    type: 'T2'
                },
                {
                    name: '文字链',
                    type: 'T2'
                },
                {
                    name: '表单',
                    type: 'T2'
                },
                {
                    name: '表单1',
                    type: 'T2'
                },
                {
                    name: '下拉列表',
                    type: 'T2'
                },
                {
                    name: '切换按钮',
                    type: 'T2'
                },
                {
                    name: '选择框',
                    type: 'T2'
                },
                {
                    name: '单选框',
                    type: 'T2'
                },
                {
                    name: '复选框',
                    type: 'T2'
                },
                {
                    name: '搜索框',
                    type: 'T2'
                },
                {
                    name: '分页',
                    type: 'T2'
                },
                {
                    name: '角标',
                    type: 'T2'
                }
            ],
            [{
                    name: '组件',
                    type: 'T1'
                }, {
                    name: '时间插件',
                    type: 'T2'
                }, {
                    name: '默认图',
                    type: 'T2'
                }, {
                    name: '图片懒加载',
                    type: 'T2'
                }, {
                    name: '播放器',
                    type: 'T2'
                }, {
                    name: 'drag拖拽',
                    type: 'T2'
                }, {
                    name: '头部',
                    type: 'T2'
                }, {
                    name: '分页',
                    type: 'T2'
                }, {
                    name: '上传',
                    type: 'T2'
                }, {
                    name: 'tab',
                    type: 'T2'
                }, {
                    name: '下拉选择',
                    type: 'T2'
                }, {
                    name: 'dialog',
                    type: 'T2'
                }, {
                    name: 'footer、fixedbar',
                    type: 'T2'
                },
                {
                    name: '评分',
                    type: 'T2'
                },
                {
                    name: 'progress进度条',
                    type: 'T2'
                },
                {
                    name: 'tips',
                    type: 'T2'
                },
                {
                    name: '轮播图',
                    type: 'T2'
                }
            ]
        ];
        // 左侧栏列表 obj
        d.contentObj = {};
        d.contentList = _.flattenDeep(d.contentList);
        d.contentList.forEach((v) => {
            d.contentObj[d.contentObj.name] = v;
        });
        d.imgs = [
            'https://rcp.dev.gdy.io/imgs/kjds/active-1.png',
            'https://rcp.dev.gdy.io/imgs/kjds/active-2.png',
            'https://rcp.dev.gdy.io/imgs/kjds/active-3.png',
            'https://rcp.dev.gdy.io/imgs/kjds/active-4.png',
            'https://rcp.dev.gdy.io/imgs/kjds/active-5.png',
            'https://rcp.dev.gdy.io/imgs/kjds/active-6.png',
            'https://rcp.dev.gdy.io/imgs/kjds/active-7.png',
            'https://rcp.dev.gdy.io/imgs/kjds/active-8.png',
        ];
        d.curTab = d.contentList[1].name;
        d.curTab = 'dialog';
        linPlayer = [
            LinPlayer({
                type: 'audio',
                fid: 'audio1',
                id: 'a1',
                src: 'http://192.168.3.32:1002/%E5%8F%B6%E9%87%8C%E3%80%81%E5%AE%89%E4%B9%9D-%E6%A2%A6%E9%87%8C%E6%B1%9F%E5%B1%B1.mp3',
                title: '我们都一样',
                style: 'width: 300px;',
                autoPlay: false,
            }), LinPlayer({
                type: 'audio',
                fid: 'audio2',
                id: 'a2',
                src: 'http://192.168.3.32:1002/%E5%8F%B6%E9%87%8C%E3%80%81%E5%AE%89%E4%B9%9D-%E6%A2%A6%E9%87%8C%E6%B1%9F%E5%B1%B1.mp3',
                title: '我们都一样',
                style: 'width: 300px;',
                autoPlay: false,
            }), LinPlayer({
                type: 'video',
                fid: 'video1',
                id: 'v1',
                src: 'http://192.168.3.32:1002/%E7%A5%9E%E5%A5%87%E7%9A%84%E5%8D%87%E5%8A%9B%E2%80%94%E2%80%94h264.mp4',
                autoPlay: false,
            }),
            LinPlayer({
                type: 'video',
                fid: 'video2',
                id: 'v2',
                src: 'http://192.168.3.32:1002/%E7%A5%9E%E5%A5%87%E7%9A%84%E5%8D%87%E5%8A%9B%E2%80%94%E2%80%94h264.mp4',
                autoPlay: false,
            }),
            LinPlayer({
                type: 'video',
                fid: 'video3',
                id: 'v3',
                src: 'http://192.168.3.32:1002/%E7%A5%9E%E5%A5%87%E7%9A%84%E5%8D%87%E5%8A%9B%E2%80%94%E2%80%94h264.mp4',
                autoPlay: false,
            })
        ];
        // 分页配置
        c.pageConfig = {
            hideEnd: true,
            changeFn: f.pageChangeFn,
            pageInfo: {
                pn: 12,
                ps: 5,
                total: 0,
            },
            showNum: 5,
        };
        c.pageConfig1 = {
            // changeFn: f.pageChangeFn,
            pageInfo: {
                pn: 1,
                ps: 5,
                total: 50,
            },
            showNum: 3,
        };
        $timeout(() => {
            c.pageConfig.pageInfo.pn = 1;
            c.pageConfig.init();
        }, 5000);
        c.headerConfig = $scope.$parent.c.headerConfig;
        // 加载数据配置
        c.loadData = {
            tip: '暂无数据',
            imgClass: '',
            posClass: '',
            img: '',
            data: {
                load: true,
                empty: true,
            }
        };
        c.loadData1 = {
            tip: '暂无数据',
            imgClass: '',
            posClass: '',
            img: '',
            data: {
                load: false,
                empty: true,
            }
        };
        // 头像上传 上传配置
        c.uploadBase = {
            showEdit: false,
            uploadNum: 0,
            // 是否取消上传
            upCancel: false,
            // 上传input ID
            id: 'avatar',
            width: 200,
            ratio: [1, 1],
            containerStyle: { width: '480px', height: '310px' },
            // 组件样式： 'fixed': 浮动弹窗   , 'course': 创建课程封面
            mode: 'fixed',
            // 返回$scope
            scope: null,
            cb: function(argData) {
                if (argData) {
                    if (!d.upBaseImgs) {
                        d.upBaseImgs = [];
                    }
                    d.upBaseImgs.push(argData);
                }
            }
        };
        c.uploadFile = {
            type: 'attach',
            data: {},
            private: true,
            recorded: true,
            onSuccess: (argFile, argData) => {
                if (!d.uploadFile) {
                    d.uploadFile = [];
                }
                d.uploadFile.push(argData.data);
                console.log(argFile, argData);
            },
            onProcess: (argFile, argRate, argSpeed, argUpload) => {
                console.log(argFile, argRate, argSpeed, argUpload);
            },
            onSelectFile: (argData, argUpload) => {
                console.log(argData, argUpload);
            },
        };
        // tab配置
        c.tabConfig = {
            type: 'line',
            data: [{
                name: '首页',
                isActive: true,
                icon: 'iconfont i-my-resume',
                msgNum: 119,
            }, {
                name: '我是很长的tab',
                unRead: true,
                disabled: true,
            }, {
                name: '我是很长的tab2',
                // hide: true,
            }]
        };
        c.tabConfig1 = {
            type: 'btn',
            data: [{
                name: '首页',
                isActive: true,
                icon: 'iconfont i-my-resume',
                msgNum: 109,
            }, {
                name: '我是很长的tab',
            }, {
                name: '我是很长的tab2',
                hide: true,
            }],
            clickFn: (argData) => {
                console.log(argData);
            }
        };
        c.tabConfigDis = {
            type: 'btn',
            data: [{
                name: '首页',
                isActive: true,
                icon: 'iconfont i-my-resume',
                msgNum: 99,
            }, {
                name: '我是很长的tab',
                unRead: true,
            }, {
                name: '我是很长的tab2',
                disabled: true,
                // hide: true,
            }]
        };
        c.tabConfig2 = {
            type: 'menu',
            data: [{
                name: '首页',
                isActive: true,
                icon: 'iconfont i-my-resume',
                iconRight: 'iconfont i-arrow-right',
                msgNum: 89,
            }, {
                name: '我是很长的tab',
                icon: 'iconfont i-my-resume',
                iconRight: 'iconfont i-arrow-right',
            }, {
                name: '我是很长的tab2',
                icon: 'iconfont i-my-resume',
                iconRight: 'iconfont i-arrow-right',
            }]
        };
        c.tabConfig3 = {
            type: 'menu',
            data: [{
                name: '首页',
                isActive: true,
                msgNum: 89,
            }, {
                name: '我是很长的tab',
                unRead: true,
            }, {
                name: '我是很长的tab2',
                msgNum: 199,
            }]
        };
        // slider
        c.sliderConfig = {
            imgs: d.imgs,
            time: 0.5,
            stayTime: 5,
            slideRight: '',
        };
        // select
        c.dropdown0 = {
            parent: '.ui-t-content',
            type: 'click',
            hide: true,
            nowData: {
                name: '请选择',
            },
            data: [{
                name: '广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东',
            }, {
                name: '武汉'
            }, {
                name: '广西'
            }, {
                name: '北京'
            }, {
                name: '深圳'
            }],
            clickFn: (argData) => {}
        };
        c.dropdown1 = {
            parent: '.ui-t-content',
            type: 'click',
            hide: false,
            nowData: {
                name: '请选择',
            },
            data: [{
                name: '请选择',
            }, {
                name: '广东'
            }, {
                name: '广西'
            }, {
                name: '北京'
            }, {
                name: '深圳'
            }],
        };
        c.dropdown2 = {
            parent: '.ui-t-content',
            type: 'click',
            hide: true,
            nowData: {
                name: '请选择',
            },
            data: [{
                name: '请选择',
            }, {
                name: '广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东广东'
            }, {
                name: '广西'
            }, {
                name: '北京'
            }, {
                name: '深圳'
            }, {
                name: '广西'
            }, {
                name: '北京'
            }, {
                name: '深圳'
            }, {
                name: '广西'
            }, {
                name: '北京'
            }, {
                name: '深圳'
            }],
        };
        // dialog
        c.dialogConfig = {
            show: false,
            title: '温馨提示',
            content: '',
            okCb: () => {
                alert('点了确定');
            },
            cancelCb: () => {
                alert('点了取消');
            },
            // posClass: 'r-t',
            // hideOk: true,
            // hideCancel: true,
            // hideFooter: true,
            // hideModal: true,
            // modalCancel: true,
            // posClass: 'r-b',
        };
        c.dialogConfig1 = {
            show: false,
            title: '',
            content: '确定退出？',
            okCb: () => {
                alert('点了确定');
            },
            cancelCb: () => {
                alert('点了取消');
            },
            // hideOk: true,
            // hideCancel: true,
            hideFooter: true,
            // hideModal: true,
            // modalCancel: true,
            // posClass: 'r-b',
        };
        c.dialogConfig2 = {
            show: false,
            title: '',
            content: '',
            okCb: () => {
                alert('点了确定');
            },
            cancelCb: () => {
                alert('点了取消');
            },
        };
        c.dialogConfig3 = {
            show: false,
            title: '左上',
            content: '',
            okCb: () => {
                alert('点了确定');
            },
            cancelCb: () => {
                alert('点了取消');
            },
            hideModal: true,
            posClass: 'l-t',
        };
        c.dialogConfig4 = {
            show: false,
            title: '左下',
            content: '',
            okCb: () => {
                alert('点了确定');
            },
            cancelCb: () => {
                alert('点了取消');
            },
            posClass: 'l-b',
            hideModal: true,
        };
        c.dialogConfig5 = {
            show: false,
            title: '右上,无背景',
            content: '',
            okCb: () => {
                alert('点了确定');
            },
            cancelCb: () => {
                alert('点了取消');
            },
            posClass: 'r-t',
            hideModal: true,
            hideBg: true,
        };
        c.dialogConfig6 = {
            show: false,
            title: '右下,无背景',
            content: '',
            okCb: () => {
                alert('点了确定');
            },
            cancelCb: () => {
                alert('点了取消');
            },
            posClass: 'r-b',
            hideModal: true,
            hideBg: true,
        };
        c.dialogConfig7 = {
            show: false,
            title: '温馨提示',
            content: '',
            okCb: () => {
                alert('点了确定');
            },
            cancelCb: () => {
                alert('点了取消');
            },
            // posClass: 'r-t',
            // hideOk: true,
            // hideCancel: true,
            // hideFooter: true,
            hideModal: true,
            hideBg: true,
            // modalCancel: true,
            // posClass: 'r-b',
        };
        c.dialogConfig8 = {
            show: false,
            title: '温馨提示',
            content: '',
            okCb: () => {
                alert('点了确定');
            },
            cancelCb: () => {
                alert('点了取消');
            },
            // posClass: 'r-t',
            // hideOk: true,
            // hideCancel: true,
            // hideFooter: true,
            hideModal: true,
            modalCancel: true,
            // posClass: 'r-b',
        };
        c.dialogConfig9 = {
            show: false,
            title: '温馨提示',
            content: '',
            okCb: () => {
                alert('点了确定');
            },
            cancelCb: () => {
                alert('点了取消');
            },
            // posClass: 'r-t',
            // hideOk: true,
            // hideCancel: true,
            // hideFooter: true,
            // hideModal: true,
            modalCancel: true,
            // posClass: 'r-b',
        };
        c.dialogConfig10 = {
            show: false,
            title: '',
            content: '我是配置里的content',
            okCb: () => {
                alert('点了确定');
            },
            cancelCb: () => {
                alert('点了取消');
            },
        };
        // fixedbar
        c.footerConfig = $scope.$parent.c.footerConfig;
        // 点击复制图标
        f.readScssVal();
        $timeout(initCopyIcon, 0);
        d.regExp = rcpAid.getRegexp();
    };
    let initCopyIcon = () => {
        // 点击图标复制图标的class
        $('.icon_lists li').on('click', function() {
            console.log($(this).find('.fontclass').html());
            $(this).attr({
                'data-clipboard-text': 'iconfont ' + $(this).find('.fontclass').html().replace('.', ''),
            });
        });
        $('.cp').on('click', function() {
            $(this).attr({
                'data-clipboard-text': $(this).html()
            });
        })
        let c = new Clipboard('.icon_lists li');
        let cp = new Clipboard('.cp');
    };
    $scope.init();
})