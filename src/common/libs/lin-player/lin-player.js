/**
 * @author linj
 * eg:
 *let option = {
 // 挂载id,无则挂在body下 0
  fid: null, fid的class为 lin-a-min时，只有滚动条和时长
 // 实例id 0,不传则使用timestamp
 id: null,
 // 播放地址 1
 src: null, 
 // 音频还是视频 1
 type: 'audio/video'
 // 是否自动播放
 autoPlay: false, 0
 // 播放器主题
 theme: '', 0 ''时使用默认样式lin-def, a-mutl: 多个音乐只用一个实例，右下角播放器样式
 // 播放器style 只要设置父ID的宽高即可
 style: 'width: 10px,height:10px',
 // 播放器背景图
 bgImg: '',
 // 实例obj  -1
 obj: null,
 // id对应element列表 -1
 ids: {}
 // 是否可以播放 0
 canplay: false,
 // 总时长 秒 -1
 duration: 0,
 // 正在播放 秒 -1
 currentTime: 0,
 // 相关函数 -1
 f: f
 // 音频实例 -1
 audio: null
 // 视频实例 -1
 video: null
 }
 * let linVideo = LinPlayer({
    type: 'video',
    fid: 'video1',
    id: 'v1',
    src: '',
    theme: '',
    autoPlay: true,
    title: '',
 });
 */
require('./lin-player.scss');
// 全局实例
window.LINPLAYER = {};
window.IEFULLSCREEN = {};
window.PAUSEPLAYER = function() {};
// 使用log打印日志，当localStorage.log=1时，显示console.log;
window.log = function(...argMsg) {
    if (window.localStorage.getItem('log')) {
        console.log(...argMsg);
    }
};
let LinPlayer = (argOption) => {
    let onmousedown = 'onmousedown',
        onmousemove = 'onmousemove',
        onmouseup = 'onmouseup',
        isMobile = false,
        ua = navigator.userAgent.toLowerCase(),
        isApple = false;
    if (/mobile/i.test(ua)) {
        log('mobile');
        onmousedown = 'ontouchstart';
        onmousemove = 'ontouchmove';
        onmouseup = 'ontouchcancel';
        isMobile = true;
    }
    // 针对苹果音频处理，默认不显示loading
    if (ua.indexOf('safari') > -1 && ua.indexOf('chrome') < 1) {
        isApple = true;
        // 苹果移动端标识处理
    } else if (isMobile && ua.toLowerCase().indexOf('applewebkit') && ua.indexOf('chrome') < 1) {
        isApple = true;
    }
    let O = {
        // 挂载id,无则挂在body下
        fid: null,
        // 实例id
        id: null,
        // 实例obj
        obj: null,
        // 是否自动播放
        autoPlay: false,
        // 播放器主题
        theme: null,
        // 播放器style
        style: '',
        // 背景图url
        bgImg: '',
        // 标题 audio
        title: '',
        // 是否可以播放
        canplay: false,
        // 总时长 秒
        duration: 0,
        // 正在播放 秒
        currentTime: 0,
        // 播放类型
        type: null,
        // 播放地址
        src: null,
        // 是否全屏
        isFull: false,
        // 相关函数
        f: f
    };
    // 播放器主题
    let playerType = {
        // 默认样式
        default: {
            theme: [],
            html: '',
        },
        // 左下角样式
        bottom: {
            theme: ['a-mutl'],
            html: ''
        }
    }
    let fDoc = {
        audioInit: '音频实例',
        videoInit: '视频实例',
        initHtml: '初始化模板html',
        get: '获取element',
        drag: '拖拽事件',
        countTime: '计算音乐时长',
        getCss: '获取相关CSS属性',
        hasClass: '是否存在class',
        addClass: 'add class',
        removeClass: 'del class',
        toggleClass: 'add or del class',
        getElementPosition: '获取元素绝对位置的坐标',
        hasLoad: '更新已加载进度条长度',
        hasPlay: '更新已播放进度条长度',
        pauseAll: '暂停其它实例',
        fullScreen: '全屏显示',
    };
    let f = {
        // '音频实例'
        audioInit: (argOption) => {
            // 合并配置 Object.assign IE暂未支持
            // O = Object.assign(O, argOption);
            for (let k in O) {
                if (typeof argOption[k] !== 'undefined') {
                    O[k] = argOption[k];
                }
            }
            if (!O.id) {
                O.id = +new Date();
            }
            if (window.LINPLAYER[O.id]) {
                // 已存在实例
                log('已存在实例');
                O.ids = f.get('', O.id);
                O.obj = f.get('Player');
                O.obj.setAttribute('src', O.src);
                f.get().style.display = 'block';
                f.get('Msg').innerHTML = '';
                f.get('Title').innerHTML = O.title;
                if (O.autoPlay) {
                    f.pauseAll(O.id);
                    O.obj.play();
                }
            } else {
                f.initHtml(O.type);
                O.ids = f.get('', O.id);
                O.obj = f.get('Player');
                O.obj.setAttribute('src', O.src);
                // 针对苹果音频处理，默认不显示loading
                if (isApple) {
                    f.addClass(f.get('Loading'), 'hide');
                }
                apiEvent();
                window.LINPLAYER[O.id] = O;
                //  播放/暂停
                f.get('Play').onclick = () => {
                    log('status:', f.get('Player').readyState);
                    // 苹果标识处理
                    if (isApple) {
                        O.canplay = true;
                    } else if (f.get('Player').readyState <= 2) {
                        log('暂时播放不了，请等待');
                        f.get('HasPlay').style.width = '0px';
                        if (!O.canplay) {
                            return;
                        }
                    }
                    O.isPlay = !O.isPlay;
                    if (O.isPlay) {
                        f.pauseAll(O.id);
                        f.get('Player').play();
                        return;
                    } else {
                        f.pauseAll(O.id);
                        f.get('Player').pause();
                        return;
                    }
                };
                //  静音/有音
                f.get('Volume').onclick = () => {
                    if (f.get('Player').volume) {
                        f.get('Player').volume = 0;
                    } else {
                        f.get('Player').volume = 1;
                    }
                };
                // 进度拖拽
                f.get('PlayProgress')[onmousedown] = function(argEvent) {
                    var temThis = this;
                    f.drag(temThis, argEvent, O.id + 'HasPlay');
                    f.get('PlayProgress')[onmousemove] = function(argEvent) {
                        var temThis = this;
                        f.drag(temThis, argEvent, O.id + 'HasPlay');
                    };
                };
                if (playerType.bottom.theme.indexOf(O.theme) > -1) {
                    // 音量进度拖拽 竖音量条
                    f.get('VolumeProgress')[onmousedown] = function(argEvent) {
                        var temThis = this;
                        f.drag(temThis, argEvent, O.id + 'NowVolume', true);
                        f.get('VolumeProgress')[onmousemove] = function(argEvent) {
                            var temThis = this;
                            f.drag(temThis, argEvent, O.id + 'NowVolume', true);
                        };
                    };
                } else {
                    // 音量进度拖拽 横音量条
                    f.get('VolumeProgress')[onmousedown] = function(argEvent) {
                        var temThis = this;
                        f.drag(temThis, argEvent, O.id + 'NowVolume');
                        f.get('VolumeProgress')[onmousemove] = function(argEvent) {
                            var temThis = this;
                            f.drag(temThis, argEvent, O.id + 'NowVolume');
                        };
                    };
                }
                // 停止拖拽
                document[onmouseup] = () => {
                    log('停止拖拽');
                    let len = document.getElementsByClassName('play-progress').length;
                    for (let i = 0; i < len; i++) {
                        document.getElementsByClassName('play-progress')[i][onmousemove] = null;
                    }
                    len = document.getElementsByClassName('volume-progress').length;
                    for (let i = 0; i < len; i++) {
                        document.getElementsByClassName('volume-progress')[i][onmousemove] = null;
                    }
                };
                //  关闭音频
                f.get('Close').onclick = () => {
                    O.obj.setAttribute('src', '');
                    f.get().style.display = 'none';
                };
            }
            return O;
        },
        // '视频实例'
        videoInit: (argOption) => {
            // 合并配置
            // O = Object.assign(O, argOption);
            for (let k in O) {
                if (typeof argOption[k] !== 'undefined') {
                    O[k] = argOption[k];
                }
            }
            if (!O.id) {
                O.id = +new Date();
            }
            if (window.LINPLAYER[O.id]) {
                // 已存在实例
                O.ids = f.get('', O.id);
                O.obj = f.get('Player');
                O.obj.setAttribute('src', O.src);
                if (O.autoPlay) {
                    f.pauseAll(O.id);
                    O.obj.play();
                }
            } else {
                f.initHtml(O.type);
                O.ids = f.get('', O.id);
                O.obj = f.get('Player');
                O.obj.setAttribute('src', O.src);
                if (isApple) {
                    f.addClass(f.get('Loading'), 'hide');
                }
                apiEvent();
                window.LINPLAYER[O.id] = O;
                let playFn = () => {
                    log('status:', f.get('Player').readyState);
                    // 苹果标识处理
                    if (isApple) {
                        O.canplay = true;
                    } else if (f.get('Player').readyState <= 2) {
                        log('暂时播放不了，请等待');
                        f.get('HasPlay').style.width = '0px';
                        if (!O.canplay) {
                            return;
                        }
                    }
                    O.isPlay = !O.isPlay;
                    if (O.isPlay) {
                        f.pauseAll(O.id);
                        f.get('Player').play();
                        return;
                    } else {
                        f.pauseAll(O.id);
                        f.get('Player').pause();
                        return;
                    }
                };
                //  播放/暂停
                f.get('Play').onclick = playFn;
                f.get('Player').onclick = playFn;
                //  静音/有音
                f.get('Volume').onclick = () => {
                    if (f.get('Player').volume) {
                        f.get('Player').volume = 0;
                    } else {
                        f.get('Player').volume = 1;
                    }
                };
                let expandFn = () => {
                    if (ua.indexOf('msie') !== -1) {
                        log('IE版本过低！');
                        f.fullScreenChange();
                        window.IEFULLSCREEN.isFull = O.isFull;
                    } else {
                        f.fullScreen();
                    }
                };
                //  全屏/退出全屏
                f.get('Expand').onclick = expandFn;
                // 双击全屏/退出全屏
                f.get('Player').ondblclick = expandFn;
                // 进度拖拽
                f.get('PlayProgress')[onmousedown] = function(argEvent) {
                    var temThis = this;
                    f.drag(temThis, argEvent, O.id + 'HasPlay');
                    f.get('PlayProgress')[onmousemove] = function(argEvent) {
                        var temThis = this;
                        f.drag(temThis, argEvent, O.id + 'HasPlay');
                    };
                };
                // 音量进度拖拽
                f.get('VolumeProgress')[onmousedown] = function(argEvent) {
                    var temThis = this;
                    f.drag(temThis, argEvent, O.id + 'NowVolume');
                    f.get('VolumeProgress')[onmousemove] = function(argEvent) {
                        var temThis = this;
                        f.drag(temThis, argEvent, O.id + 'NowVolume');
                    };
                };
                // 停止拖拽
                document[onmouseup] = () => {
                    log('停止拖拽');
                    let len = document.getElementsByClassName('play-progress').length;
                    for (let i = 0; i < len; i++) {
                        document.getElementsByClassName('play-progress')[i][onmousemove] = null;
                    }
                    len = document.getElementsByClassName('volume-progress').length;
                    for (let i = 0; i < len; i++) {
                        document.getElementsByClassName('volume-progress')[i][onmousemove] = null;
                    }
                };
                let screenChange = ['fullscreenchange', 'mozfullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange'];
                // 全屏变换监听
                screenChange.forEach((v, k) => {
                    document.addEventListener(v, f.fullScreenChange);
                });
                // IE
                document.onmsfullscreenchange = f.fullScreenChange;
            }
            log(O);
            return O;
        },
        /**
         * 初始化模板html
         * @param  {[type]} argType [模板类型]
         * @return {[type]}         [description]
         */
        initHtml: (argType) => {
            let element,
                temNode,
                theme;
            if (O.fid) {
                element = document.getElementById(O.fid);
            } else {
                element = document.getElementsByTagName('body')[0];
            }
            if (!element) {
                console.error = '父元素不存在！';
                return;
            }
            // 设置主题class
            theme = 'lin-' + (O.theme || 'def');
            // 设置额外样式
            if (!O.style.match('width')) {
                log(element);
                let temW = f.getCss(element, 'width');
                let temH = f.getCss(element, 'height');
                log('-------------', temW, temH);
                if (temW && temH) {
                    O.style = 'width:' + temW + ';' + O.style;
                    O.style = 'height:' + temH + ';' + O.style;
                } else {
                    log('父元素未设置宽高！');
                }
            }
            if (O.type === 'audio' && O.style.match('height')) {
                let temHeight = O.style.match(/height:[^&]+/);
                O.style += ';line-' + temHeight[0];
            }
            let playerData = {
                audioImg: 'data:img/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjU0RjZFNEFFNDlENTExRTc4RjI2RkVCRTA5RjUxQkMwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjU0RjZFNEFGNDlENTExRTc4RjI2RkVCRTA5RjUxQkMwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NTRGNkU0QUM0OUQ1MTFFNzhGMjZGRUJFMDlGNTFCQzAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NTRGNkU0QUQ0OUQ1MTFFNzhGMjZGRUJFMDlGNTFCQzAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7DPxWLAAADQUlEQVR42sxXS0hUURj+7sN5j47vGTUxsAf2EKSyoIUtRJCIFkHRolWLiCjctYmMNu2KFrVpUUtBaCFF4KIIil4WYopQUZo1ma/xMXfe9/adc7VVC0fHawfOzJw5h/N9//9//3/OUSzLAlsde4S9CM60DHuUfULnR8OV1zMnHo8bXRnTCjmBXqQqsc56383rreW9Cj1wqLlnvD9nwQ8Hm6YgPniyvl0Vv00LHjjciOkV2IKAqShIOU2AmEmBrWKT27oJKOyLGRNpikhVHCZAISGWNlHl1QmuSBKKkwSmEib2VbrR1xnB+d3FGFvMOuMBGoslun2B1pd7NIR9Gi7uDaG12oOokcvLC3kTEHGOE7yMwFsCGh6MLuDeyIKcu7q/jGEwkbM2kMB8ykSNX8eTozW41BxCNmvh1lAMSX4fqfXiYNiDuVSu8ASE5QZB0qwgKZpYQQ+c21WCFgIO/07h4de4XNde55PCLCgB2+2s1bpCxWsYnE6j++2MnDvVGARZ4dlPQ44PVHkQ0FVkzQISWCJ40KWgpyOM09uDyHD359GknDsc8aCIIhydy8hxY8iFCpLkwbYqAvpqFmW5mUptN5W6YJCMi56YNOw411KIpQScSdrjSo8KLwtEQrpAWb8HhB0i9m21Pjk2uLH4jxJYOVScKcXBIntp/4SBTCJHb7jl+DuLzxzH5cuMppImEhSppiiFCYHYRhSa+8z3T/NpjDDWOl1+ZkdQzr/4lUSG4dhZal+mPnPNNMNR7tYKpwFhjJ8e6J9IyHBcbilDR71P1v7eL0uAS0VbjR2iN5NJWSWrvVrhQiCujSIVK7mp8PRKOG4PzWOA2dBU5cbxrf6/IQq5Vl/f9HwFE+bJd3c4huHZFAamUpJZ154QvMyMpz8SePUrhbqAvjEEsHyH8pDKozFDhuBCcwnONhXLuWvvZuHS7GPa2qizQKSdAKimMAWZbSW2+G68n6P1SUR8OvLJTH2t+Wtnh447HxfwgaX5JcHrA/rG1YF/3+/tUtX3Lc5PXq2pg3zrkr4eAiIcOkUo6sRaq+J/cStWmedup4Et+zGkCgI51X4kOGs5D0yBLTQQPdbg796Mx6nAVjb7ef5HgAEA9AY8YRWZTYoAAAAASUVORK5CYII=',
            }
            let loadAudio = '',
                loadVideo = '',
                loadHtml = `<div id="${O.id}-loading" class="loading">
            <span></span>
            <span></span>
            <span></span>
        </div>`;
            if (argOption.type === 'audio') {
                loadAudio = loadHtml;
            } else if (argOption.type === 'video') {
                loadVideo = loadHtml;
            }
            let html = {
                audio: `<audio id="${O.id}-player" src="" preload="metadata"><span>你的浏览器不支持音频播放！</span></audio>`,
                video: `
                <video id="${O.id}-player" preload="metadata" style="${O.style}" poster="${O.bgImg}" src="">
                    <p>你的浏览器不支持视频播放.</p>
                </video>
                ${loadVideo}
                `,
                // 全屏
                expand: {
                    audio: '',
                    video: `
                    <div class="l-expand" id="${O.id}-expand">
                        <i class="fa fa-expand" aria-hidden="true"></i>
                    </div>
                    `
                }
            };
            playerType.default.html = `
            <div class="${theme}  lin-${O.type}" id="${O.id}" style="${O.style}">
                ${html[argOption.type]}
                <div id="${O.id}-msg" class="l-msg"></div>                             
                <div class="tool-bar" style="${O.type === 'audio' ? O.style : ''}">
                    <div id="${O.id}-play" class="l-play">
                        <i id="${O.id}-play-btn" class="fa fa-play" aria-hidden="true"></i>
                        <i id="${O.id}-pause-btn" class="fa fa-pause hide" aria-hidden="true"></i>
                    </div>
                    <div class="l-time">
                        <span id="${O.id}-currentTime" class="currentTime">00:00</span>
                        <span>/</span>
                        <span id="${O.id}-duration" class="duration">00:00</span>
                    </div>
                    <div class="l-progress">
                        <div id="${O.id}-play-progress" class="play-progress">
                            <div id="${O.id}-has-play" class="has-play">
                                ${loadAudio}
                            </div>
                            <div id="${O.id}-has-load" class="has-load"></div>                            
                        </div>
                    </div>
                    <div id="${O.id}-right-bar" class="right-bar">
                        <div id="${O.id}-volume" class="l-volume">
                            <div class="l-volume-btn">
                                <i id="${O.id}-volumeoff-btn" class="fa fa-volume-off hide" aria-hidden="true"></i>
                                <i id="${O.id}-volumedown-btn" class="fa fa-volume-down hide" aria-hidden="true"></i>
                                <i id="${O.id}-volumeup-btn" class="fa fa-volume-up" aria-hidden="true"></i>
                            </div>
                        </div>
                        <div class="l-volume-progress">
                            <div id="${O.id}-volume-progress" class="volume-progress">
                                <div id="${O.id}-now-volume" class="now-volume"></div>
                            </div>
                        </div>
                        ${html.expand[O.type]}                            
                    </div>
                </div>
            </div>`;
            playerType.bottom.html = `
            <div class="${theme} lin-${O.type}" id="${O.id}">
            ${html[argOption.type]}
            <div class="a-body">
                <div class="a-face">
                    <img src="${playerData.audioImg}" />
                </div>
                <div class="a-content">
                    <div class="a-title text-of">
                        <span class="title" id="${O.id}-title">${O.title}</span>
                        <span id="${O.id}-msg" class="a-msg"></span>
                        <div class="a-time">
                            <span id="${O.id}-currentTime" class="currentTime">00:00</span>
                            <span>/</span>
                            <span id="${O.id}-duration" class="duration">00:00</span>
                        </div>
                    </div>
                    <div id="${O.id}-play-progress" class="play-progress">
                            <div id="${O.id}-has-play" class="has-play">
                            ${loadAudio}    
                            </div>
                            <div id="${O.id}-has-load" class="has-load"></div>
                    </div>
                </div>
                <div class="a-toolbar">
                    <div id="${O.id}-play" class="a-play">
                        <i id="${O.id}-play-btn" class="fa fa-play" aria-hidden="true"></i>
                        <i id="${O.id}-pause-btn" class="fa fa-pause hide" aria-hidden="true"></i>
                    </div>
                    <div class="a-volume">
                        <div id="${O.id}-volume" class="a-volume-btn">
                            <i id="${O.id}-volumeoff-btn" class="fa fa-volume-off hide" aria-hidden="true"></i>
                            <i id="${O.id}-volumedown-btn" class="fa fa-volume-down hide" aria-hidden="true"></i>
                            <i id="${O.id}-volumeup-btn" class="fa fa-volume-up" aria-hidden="true"></i>
                        </div>
                        <div class="volume">
                            <div id="${O.id}-volume-progress" class="volume-progress">
                                <div id="${O.id}-now-volume" class="now-volume"></div>
                            </div>
                        </div>
                    </div>
                    <div class="a-volume-progress">
                        <div id="${O.id}-volume-progress1" class="volume-progress">
                            <div id="${O.id}-now-volume1" class="now-volume"></div>
                        </div>
                    </div>                       
                </div>
            </div>
                <div id="${O.id}-close" class="a-close">×</div>
            </div>
            `;
            let addHtml = '';
            // 判断主题
            if (playerType.bottom.theme.indexOf(O.theme) > -1) {
                addHtml = playerType.bottom.html;
            } else {
                addHtml = playerType.default.html;
            }
            // 如果没有指定父id，append到body标签下
            if (O.fid) {
                element.innerHTML = addHtml;
            } else {
                // let temNode = document.getElementById('linPlayerBody');
                // if (temNode) {
                temNode = document.createElement('div');
                temNode.setAttribute('id', 'linPlayerBody');
                // }
                temNode.innerHTML = addHtml;
                element.appendChild(temNode);
            }
        },
        /**
         * 获取element
         * @param  {[type]} argName [id名]
         * @param  {[type]} id [初始化id对应element]
         * @return {[type]}         [description]
         */
        get: (argName, id) => {
            if (!id) {
                if (!argName) {
                    return O.ids[O.id];
                } else {
                    return O.ids[O.id + argName] || {};
                }
            } else {
                let ids = {
                    // 实例id
                    [id]: document.getElementById(id),
                    // 播放器element
                    [id + 'Player']: document.getElementById(id + '-player'),
                    // 播放标题（提示语）
                    [id + 'Title']: document.getElementById(id + '-title'),
                    // 视频播放标题（提示语）
                    [id + 'Msg']: document.getElementById(id + '-msg'),
                    // 时间
                    [id + 'CurrentTime']: document.getElementById(id + '-currentTime'),
                    // 总时间
                    [id + 'Duration']: document.getElementById(id + '-duration'),
                    // 播放暂停
                    [id + 'Play']: document.getElementById(id + '-play'),
                    // 进度条
                    [id + 'PlayProgress']: document.getElementById(id + '-play-progress'),
                    // 加载中样式
                    [id + 'Loading']: document.getElementById(id + '-loading'),
                    // 已播放
                    [id + 'HasPlay']: document.getElementById(id + '-has-play'),
                    // 已加载
                    [id + 'HasLoad']: document.getElementById(id + '-has-load'),
                    // 音量
                    [id + 'RightBar']: document.getElementById(id + '-right-bar'),
                    // 音量条
                    [id + 'VolumeProgress']: document.getElementById(id + '-volume-progress'),
                    // 当前音量
                    [id + 'NowVolume']: document.getElementById(id + '-now-volume'),
                    // 音量开关
                    [id + 'Volume']: document.getElementById(id + '-volume'),
                    // 按钮
                    // 播放图标
                    [id + 'PlayBtn']: document.getElementById(id + '-play-btn'),
                    // 暂停图标
                    [id + 'PauseBtn']: document.getElementById(id + '-pause-btn'),
                    // 静音图标
                    [id + 'VolumeoffBtn']: document.getElementById(id + '-volumeoff-btn'),
                    [id + 'VolumedownBtn']: document.getElementById(id + '-volumedown-btn'),
                    [id + 'VolumeupBtn']: document.getElementById(id + '-volumeup-btn'),
                    [id + 'Expand']: document.getElementById(id + '-expand'),
                    [id + 'Close']: document.getElementById(id + '-close'),
                };
                return ids;
            }
        },
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
                O.ids[argMove].style.height = topH / barHeight * 100 + '%';
                switch (argMove) {
                    case O.id + 'NowVolume':
                        f.get('Player').volume = topH / barHeight;
                        break;
                    case O.id + 'HasPlay':
                        f.get('Player').currentTime = O.duration * topH / barHeight;
                        break;
                }
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
                switch (argMove) {
                    case O.id + 'NowVolume':
                        f.get('Player').volume = leftW / barWidth;
                        O.ids[argMove].style.width = leftW / barWidth * 100 + '%';
                        break;
                    case O.id + 'HasPlay':
                        if (O.duration) {
                            O.ids[argMove].style.width = leftW / barWidth * 100 + '%';
                            f.get('Player').currentTime = O.duration * leftW / barWidth;
                        }
                        break;
                }
                log('鼠标位置', event.clientX, 'this offsetLeft', eleLeft, 'move', leftW, 'barWidth', barWidth);
            }
        },
        /**
         * 计算音乐时长
         * @param  {[type]} argTime [description]
         * @return {[type]}         [description]
         */
        countTime: (argTime) => {
            let time = '',
                m = Math.floor(argTime / 60),
                s = Math.round(argTime - m * 60);
            if (m < 10) {
                time = '0';
            }
            time += m + ':';
            if (s < 10) {
                time += '0';
            }
            time += s;
            return time;
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
        /**
         * 是否存在class
         * @param  {[type]} argE [element]
         * @param  {[type]} argC  [class]
         * @return {[type]}      [description]
         */
        hasClass: (argE, argC) => {
            if (argE.className) {
                return argE.className.match(new RegExp('(\\s|^)' + argC + '(\\s|$)'));
            } else {
                return false;
            }
        },
        /**
         * add class
         * @param  {[type]} argE [element]
         * @param  {[type]} argC  [class]
         * @return {[type]}      [description]
         */
        addClass: (argE, argC) => {
            if (!f.hasClass(argE, argC)) {
                argE.className = argE.className || '';
                argE.className += ' ' + argC;
            }
        },
        /**
         * remove class
         * @param  {[type]} argE [element]
         * @param  {[type]} argC  [class]
         * @return {[type]}      [description]
         */
        removeClass: (argE, argC) => {
            if (f.hasClass(argE, argC)) {
                let reg = new RegExp('(\\s|^)' + argC + '(\\s|$)');
                argE.className = argE.className.replace(reg, ' ');
            }
        },
        /**
         * add or del class
         * @param  {[type]} argE [element]
         * @param  {[type]} argC  [class]
         * @return {[type]}      [description]
         */
        toggleClass: (argE, argC) => {
            if (f.hasClass(argE, argC)) {
                f.removeClass(argE, argC);
            } else {
                f.addClass(argE, argC);
            }
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
         * 更新已加载进度条长度
         */
        hasLoad: () => {
            let count = 0;
            for (let i = 0; i < f.get('Player').buffered.length; i++) {
                count += f.get('Player').buffered.end(i) - f.get('Player').buffered.start(i);
            }
            log(f.get('Player').buffered.length);
            let loadWidth = Math.round(count / O.duration * 100);
            log('已加载：', count, loadWidth);
            if (loadWidth < 0) {
                loadWidth = 0;
            }
            if (loadWidth > 100) {
                loadWidth = 100;
            }
            f.get('HasLoad').style.width = loadWidth + '%';
        },
        /**
         * 更新已播放进度条长度
         */
        hasPlay: () => {
            O.currentTime = f.get('Player').currentTime;
            f.get('CurrentTime').innerHTML = f.countTime(O.currentTime);
            var showWidth = Math.round(100 * O.currentTime / O.duration);
            if (showWidth < 0) {
                showWidth = 0;
            }
            if (showWidth > 100) {
                showWidth = 100;
            }
            f.get('HasPlay').style.width = showWidth + '%';
        },
        /**
         * 暂停其它实例
         * @param argId 实例id
         * @param argStop 是否停止
         */
        pauseAll: (argId, argStop) => {
            for (let k in window.LINPLAYER) {
                log('当前id:', argId, '实例：', window.LINPLAYER[k]);
                if (argId !== k) {
                    window.LINPLAYER[k].obj.pause();
                    if (argStop) {
                        window.LINPLAYER[k].obj.currentTime = 0;
                    }
                }
            }
        },
        /**
         * 全屏显示元素
         * @param argEsc 是否按了esc
         */
        fullScreen: () => {
            let full = ['requestFullscreen', 'webkitRequestFullscreen', 'mozRequestFullScreen', 'msRequestFullscreen'];
            let exit = ['exitFullscreen', 'webkitExitFullscreen', 'mozCancelFullScreen', 'msExitFullscreen'];
            if (!O.isFull) {
                full.forEach((v, k) => {
                    if (f.get()[v]) {
                        log('生效：', v);
                        f.get()[v]();
                    }
                })
            } else {
                exit.forEach((v, k) => {
                    if (f.get()[v]) {
                        log('生效：', v);
                        f.get()[v]();
                    }
                    if (document[v]) {
                        log('生效：', v);
                        document[v]();
                    }
                    if (window[v]) {
                        log('生效：', v);
                        window[v]();
                    }
                })
            }
        },
        /**
         * 监听全屏变换
         */
        fullScreenChange: () => {
            O.isFull = !O.isFull;
            log(O.isFull);
            if (O.isFull) {
                log('进入全屏', O.id);
                O.style = f.get('Player').getAttribute('style');
                f.get('Player').setAttribute('style', '');
                f.get().setAttribute('style', '');
                f.addClass(f.get(), 'lin-full-video');
            } else {
                log('退出全屏', O.id);
                f.get('Player').setAttribute('style', O.style);
                f.get().setAttribute('style', O.style);
                f.removeClass(f.get(), 'lin-full-video');
            }
        }
    };
    O.f = f;
    window.PAUSEPLAYER = f.pauseAll;
    /**
     * api 监听事件
     * @return {[type]} [description]
     */
    let apiEvent = () => {
        // 开始加载音频和视频。
        f.get('Player').onloadstart = (e) => {
            log('开始加载音频和视频。', e);
        };
        // 音频和视频的duration属性（时长）发生变化时触发，即已经知道媒体文件的长度。
        f.get('Player').ondurationchange = () => {
            O.duration = f.get('Player').duration;
            f.get('Player').volume = 1;
            f.get('Duration').innerHTML = f.countTime(O.duration);
            log('获取总时长:秒', O.duration, f.countTime(O.duration));
        };
        // 浏览器正在下载媒体文件，周期性触发。下载信息保存在元素的buffered属性中
        f.get('Player').onprogress = () => {
            log(f.get('Player').buffered);
            if (f.get('Player').buffered.length) {
                log(f.get('Player').buffered.length);
                f.hasLoad();
            };
        };
        // 浏览器准备好播放，即使只有几帧，readyState属性变为CAN_PLAY。
        f.get('Player').oncanplay = () => {
            f.addClass(f.get('Loading'), 'hide');
            O.canplay = true;
            if (O.autoPlay) {
                f.pauseAll(O.id);
                f.get('Player').play();
            }
            log('canplay');
        };

        // 浏览器认为可以不缓冲（buffering）播放时触发，即当前下载速度保持不低于播放速度，readyState属性变为CAN_PLAY_THROUGH。
        f.get('Player').oncanplaythrough = () => {
            f.addClass(f.get('Loading'), 'hide');
            O.canplay = true;
            log('canplaythrough');
        };
        // 网页元素的currentTime属性改变时触发。
        f.get('Player').ontimeupdate = f.hasPlay;
        // 播放中断
        f.get('Player').onabort = () => {
            O.isPlay = false;
            f.removeClass(f.get('Loading'), 'hide');
            log('播放中断');
        };
        // 开始播放，包括第一次播放、暂停后播放、结束后重新播放。
        f.get('Player').onplaying = () => {
            O.isPlay = true;
            f.addClass(f.get('PlayBtn'), 'hide');
            f.removeClass(f.get('PauseBtn'), 'hide');
            f.addClass(f.get('Loading'), 'hide');
            log('playing');
        };
        // 播放结束
        f.get('Player').onended = () => {
            O.isPlay = false;
            f.removeClass(f.get('PlayBtn'), 'hide');
            f.addClass(f.get('PauseBtn'), 'hide');
            log('ended');
        };
        // 加载文件停止，有可能是播放结束，也有可能是其他原因的暂停
        f.get('Player').onsuspend = () => {
            log('suspend');
            f.addClass(f.get('Loading'), 'hide');
        };
        // 播放暂停
        f.get('Player').onpause = () => {
            O.isPlay = false;
            f.removeClass(f.get('PlayBtn'), 'hide');
            f.addClass(f.get('PauseBtn'), 'hide');
            f.addClass(f.get('Loading'), 'hide');
            log('pause');
        };
        // 发生错误。该元素的error属性包含更多信息。// 1.用户终止 2.网络错误 3.解码错误 4.URL无效
        f.get('Player').onerror = (e) => {
            log('error', O);
            let errMsg = ['加载失败！', '网络错误！', '解码错误！', 'URL无效！'];
            // e.target为O.obj即为播放对象;
            if (e && e.target && e.target.error) {
                log(e.target.error.code);
                switch (e.target.error.code) {
                    case 1:
                        log('加载失败:用户终止！');
                        break;
                    case 2:
                        log('加载失败:网络错误！');
                        break;
                    case 3:
                        log('加载失败:解码错误！');
                        break;
                    case 4:
                        log('加载失败:URL无效！');
                        break;
                }
                f.get('Msg').innerHTML = errMsg[e.target.error.code - 1];
                f.addClass(f.get('Loading'), 'hide');
            }
        };
        // 音量改变时触发（包括静音）。
        f.get('Player').onvolumechange = () => {
            O.volume = f.get('Player').volume;
            if (O.volume === 0) {
                log('FUCK', f.get('VolumeupBtn'));
                f.removeClass(f.get('VolumeoffBtn'), 'hide');
                f.addClass(f.get('VolumedownBtn'), 'hide');
                f.addClass(f.get('VolumeupBtn'), 'hide');
                if (playerType.bottom.theme.indexOf(O.theme) > -1) {
                    f.get('NowVolume').style.height = 0;
                } else {
                    f.get('NowVolume').style.width = 0;
                }
            } else if (O.volume < 1) {
                f.addClass(f.get('VolumeoffBtn'), 'hide');
                f.removeClass(f.get('VolumedownBtn'), 'hide');
                f.addClass(f.get('VolumeupBtn'), 'hide');
            } else if (O.volume === 1) {
                f.addClass(f.get('VolumeoffBtn'), 'hide');
                f.addClass(f.get('VolumedownBtn'), 'hide');
                f.removeClass(f.get('VolumeupBtn'), 'hide');
                if (playerType.bottom.theme.indexOf(O.theme) > -1) {
                    f.get('NowVolume').style.height = '100%';
                } else {
                    f.get('NowVolume').style.width = '100%';
                }
            }
        };
        // 播放速率改变
        f.get('Player').onratechange = () => {
            log('ratechange');
        };
        // 由于另一个操作（比如搜索）还没有结束，导致当前操作（比如播放）不得不等待。
        f.get('Player').onwaiting = () => {
            log('正在加载中,可显示loading');
            O.isPlay = false;
            f.removeClass(f.get('Loading'), 'hide');
        };
        // 媒体文件加载后又被清空，比如加载后又调用load方法重新加载。
        f.get('Player').onemptied = () => {
            O.isPlay = false;
            f.removeClass(f.get('PlayBtn'), 'hide');
            f.addClass(f.get('PauseBtn'), 'hide');
            log('emptied');
        };
    };
    log('input option:', argOption);
    return f[argOption.type + 'Init'](argOption);
}
export default LinPlayer;