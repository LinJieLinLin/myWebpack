/**
 * @author linj
 * eg:
 *let option = {
 * // 实例id yes
 * id: null,
 * // 播放地址 yes
 * src: null,
 * // 音频还是视频 yes
 * type: 'audio/video'
 * // 是否自动播放
 * autoPlay: false, auto
 * // 实例obj
 * obj: null, no
 * // id对应element no
 * ids: {}
 * // 是否可以播放 no
 * canplay: false,
 * // 总时长 秒 no
 * duration: 0,
 * // 正在播放 秒 no
 * currentTime: 0,
 * // 相关函数 no
 * f: f
 * // 音频实例 no
 * audio: null
 * // 视频实例 no
 * video: null
 * }
 * let linVideo = LinPlayer(option, 'video');
 */
let LinPlayer = (argOption, argType) => {
    let video = {};
    let audio = {};
    let f = {
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
        getElementLeft: '获取元素绝对位置的横坐标'
    };
    let O = {
        // 实例id
        id: null,
        // 实例obj
        obj: null,
        // 是否自动播放
        autoPlay: false,
        // 是否可以播放
        canplay: false,
        // 总时长 秒
        duration: 0,
        // 正在播放 秒
        currentTime: 0,
        // 播放地址
        src: null,
        // 相关函数
        f: f
    };
    f.audioInit = (argOption) => {
        // 合并配置
        O = Object.assign(O, argOption);
        if (audio[O.id]) {

        } else {
            O.ids = f.get();
            audio[O.id] = O;
            O.audio = audio;
        }
        return O;
    };
    f.videoInit = (argOption) => {
        // 合并配置
        O = Object.assign(O, argOption);
        if (video[O.id]) {

        } else {
            f.initHtml(O.type);
            O.ids = f.get('', O.id);
            O.obj = f.get('Player');
            O.obj.setAttribute('src', O.src);
            apiEvent();
            video[O.id] = O;
            O.video = video;
            //  播放/暂停
            f.get('Play').onclick = () => {
                console.log('status:', f.get('Player').readyState);
                if (f.get('Player').readyState <= 2) {
                    console.log('暂时播放不了，请等待');
                    if (!O.canplay) {
                        return;
                    }
                }
                O.isPlay = !O.isPlay;
                if (O.isPlay) {
                    f.get('Player').play();
                    return;
                } else {
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
            f.get('PlayProgress').onmousedown = function(argEvent) {
                var temThis = this;
                f.drag(temThis, argEvent, O.id + 'HasPlay');
                f.get('PlayProgress').onmousemove = function(argEvent) {
                    var temThis = this;
                    f.drag(temThis, argEvent, O.id + 'HasPlay');
                };
            };
            // 音量进度拖拽
            f.get('VolumeProgress').onmousedown = function(argEvent) {
                var temThis = this;
                f.drag(temThis, argEvent, O.id + 'NowVolume');
                f.get('VolumeProgress').onmousemove = function(argEvent) {
                    var temThis = this;
                    f.drag(temThis, argEvent, O.id + 'NowVolume');
                };
            };
            // 停止拖拽
            document.onmouseup = () => {
                f.get('PlayProgress').onmousemove = null;
                f.get('VolumeProgress').onmousemove = null;
            };
        }
        console.info('FUCK');
        console.log(O);
        return O;
    };
    /**
     * 常用函数
     * @return {[type]} [description]
     */
    let funcs = () => {
        /**
         * 初始化模板html
         * @param  {[type]} argType [模板类型]
         * @return {[type]}         [description]
         */
        f.initHtml = (argType) => {
            var html = {
                audio: ``,
                video: `
            <div id="linVideo" class="lin-video">
                <video id="linVideo-player" preload="auto" poster="https://s.cdpn.io/6035/vp_poster.jpg" src="">
                    <p>你的浏览器不支持视频播放.</p>
                </video>
                <div class="video-bar">
                    <div id="linVideo-play" class="v-play">
                        <i id="linVideo-play-btn" class="fa fa-play" aria-hidden="true"></i>
                        <i id="linVideo-pause-btn" class="fa fa-pause hide" aria-hidden="true"></i>
                    </div>
                    <div class="v-time">
                        <span id="linVideo-currentTime" class="currentTime">00:00</span>
                        <span>/</span>
                        <span id="linVideo-duration" class="duration">00:00</span>
                    </div>
                    <div class="v-progress">
                        <div id="linVideo-play-progress" class="play-progress">
                            <div id="linVideo-has-play" class="has-play"></div>
                            <div id="linVideo-has-load" class="has-load"></div>
                        </div>
                    </div>
                    <div id="linVideo-right-bar" class="right-bar">
                        <div id="linVideo-volume" class="v-volume">
                            <div class="v-volume-btn">
                                <i id="linVideo-volumeoff-btn" class="fa fa-volume-off hide" aria-hidden="true"></i>
                                <i id="linVideo-volumedown-btn" class="fa fa-volume-down hide" aria-hidden="true"></i>
                                <i id="linVideo-volumeup-btn" class="fa fa-volume-up" aria-hidden="true"></i>
                            </div>
                        </div>
                        <div class="v-volume-progress">
                            <div id="linVideo-volume-progress" class="volume-progress">
                                <div id="linVideo-now-volume" class="now-volume"></div>
                            </div>
                        </div>
                        <div class="v-expand">
                            <i id="linVideo-expand" class="fa fa-expand" aria-hidden="true"></i>
                        </div>
                    </div>
                </div>
            </div>`
            }
            let e = document.createElement('div');
            let element = document.getElementsByTagName('body')[0];
            e.innerHTML = html[argType];
            f.addClass(e, 'v-player');
            element.appendChild(e);
            // while (e.firstChild) {
            //     element.appendChild(e.firstChild);
            // }
        };
        /**
         * 获取element
         * @param  {[type]} argName [id名]
         * @param  {[type]} id [初始化id对应element]
         * @return {[type]}         [description]
         */
        f.get = (argName, id) => {
            if (!id) {
                if (!argName) {
                    return O.ids[O.id];
                } else {
                    return O.ids[O.id + argName];
                }
            } else {
                let ids = {
                    // 实例id
                    [id]: document.getElementById(id),
                    // 播放器element
                    [id + 'Player']: document.getElementById(id + '-player'),
                    // 时间
                    [id + 'CurrentTime']: document.getElementById(id + '-currentTime'),
                    // 总时间
                    [id + 'Duration']: document.getElementById(id + '-duration'),
                    // 播放暂停
                    [id + 'Play']: document.getElementById(id + '-play'),
                    // 进度条
                    [id + 'PlayProgress']: document.getElementById(id + '-play-progress'),
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
                    'end': null
                };
                return ids;
            }
        };

        /**
         * 拖拽事件
         * @param  {[type]} argThis     [click element this]
         * @param  {[type]} argEvent    [event]
         * @param  {[type]} argMove     [move element]
         * @return {[type]}             [description]
         */
        f.drag = (argThis, argEvent, argMove) => {
            var event = argEvent || window.event,
                barWidth = +f.getCss(argThis, 'width').replace('px', '') - 5,
                eleLeft = f.getElementLeft(argThis),
                leftW = event.clientX - eleLeft;
            if (leftW > barWidth) {
                leftW = barWidth;
            } else if (leftW < 0) {
                leftW = 0;
            }
            O.ids[argMove].style.width = leftW + 'px';
            switch (argMove) {
                case O.id + 'NowVolume':
                    f.get('Player').volume = leftW / barWidth;
                    break;
                case O.id + 'HasPlay':
                    f.get('Player').currentTime = O.duration * leftW / barWidth;
                    break;
            }
            console.log(
                '鼠标位置',
                event.clientX,
                'this offsetLeft',
                eleLeft,
                'move',
                leftW,
                'barWidth',
                barWidth
            );
        };

        /**
         * 计算音乐时长
         * @param  {[type]} argTime [description]
         * @return {[type]}         [description]
         */
        f.countTime = (argTime) => {
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
        };

        /**
         * 获取相关CSS属性
         * @param  {[type]} argE [element]
         * @param  {[type]} key  [style name]
         * @return {[type]}      [description]
         */
        f.getCss = (argE, key) => {
            return argE.currentStyle ? argE.currentStyle[key] : document.defaultView.getComputedStyle(argE, false)[key];
        };

        /**
         * 是否存在class
         * @param  {[type]} argE [element]
         * @param  {[type]} argC  [class]
         * @return {[type]}      [description]
         */
        f.hasClass = (argE, argC) => {
            return argE.className.match(new RegExp('(\\s|^)' + argC + '(\\s|$)'));
        };

        /**
         * add class
         * @param  {[type]} argE [element]
         * @param  {[type]} argC  [class]
         * @return {[type]}      [description]
         */
        f.addClass = (argE, argC) => {
            if (!f.hasClass(argE, argC)) {
                argE.className += ' ' + argC;
            }
        };

        /**
         * remove class
         * @param  {[type]} argE [element]
         * @param  {[type]} argC  [class]
         * @return {[type]}      [description]
         */
        f.removeClass = (argE, argC) => {
            if (f.hasClass(argE, argC)) {
                let reg = new RegExp('(\\s|^)' + argC + '(\\s|$)');
                argE.className = argE.className.replace(reg, ' ');
            }
        };

        /**
         * add or del class
         * @param  {[type]} argE [element]
         * @param  {[type]} argC  [class]
         * @return {[type]}      [description]
         */
        f.toggleClass = (argE, argC) => {
            if (f.hasClass(argE, argC)) {
                f.removeClass(argE, argC);
            } else {
                f.addClass(argE, argC);
            }
        };

        /**
         * 获取元素绝对位置的横坐标
         * @param  {[type]} argE [element]
         * @return {[type]}      [description]
         */
        f.getElementLeft = (argE) => {
            let actualLeft = argE.offsetLeft;
            let current = argE.offsetParent;
            while (current !== null) {
                actualLeft += current.offsetLeft;
                current = current.offsetParent;
            }
            return actualLeft;
        };
    };
    /**
     * api 监听事件
     * @return {[type]} [description]
     */
    let apiEvent = () => {
        // 开始加载音频和视频。
        f.get('Player').onloadstart = (e) => {
            console.log('开始加载音频和视频。', e);
        };
        // 音频和视频的duration属性（时长）发生变化时触发，即已经知道媒体文件的长度。
        f.get('Player').ondurationchange = () => {
            O.duration = f.get('Player').duration;
            f.get('Player').volume = 1;
            f.get('Duration').innerHTML = f.countTime(O.duration);
            console.log('获取总时长:秒', O.duration);
        };
        // 浏览器正在下载媒体文件，周期性触发。下载信息保存在元素的buffered属性中
        f.get('Player').onprogress = () => {
            let count = 0;
            console.log(f.get('Player').buffered);
            if (f.get('Player').buffered.length) {
                console.log('FUCK');
                console.log(f.get('Player').buffered.length);
                for (let i = 0; i < f.get('Player').buffered.length; i++) {
                    count += f.get('Player').buffered.end(i) - f.get('Player').buffered.start(i);
                }
                console.log(count);
                console.log(f.get('Player').buffered.length);
                let loadWidth = (+f.getCss(f.get('PlayProgress'), 'width').replace('px', '')) * count / O.duration;
                if (loadWidth < 0) {
                    loadWidth = 0;
                }
                f.get('HasLoad').style.width = loadWidth + 'px';
            };
        };
        // 浏览器准备好播放，即使只有几帧，readyState属性变为CAN_PLAY。
        f.get('Player').oncanplay = () => {
            O.canplay = true;
            if (O.autoPlay) {
                f.get('Player').play();
            }
            console.log('canplay');
        };

        // 浏览器认为可以不缓冲（buffering）播放时触发，即当前下载速度保持不低于播放速度，readyState属性变为CAN_PLAY_THROUGH。
        f.get('Player').oncanplaythrough = () => {
            O.canplay = true;
            console.log('canplaythrough');
        };
        // 网页元素的currentTime属性改变时触发。
        f.get('Player').ontimeupdate = () => {
            O.currentTime = f.get('Player').currentTime;
            f.get('CurrentTime').innerHTML = f.countTime(O.currentTime);
            var showWidth = Math.round((+f.getCss(f.get('PlayProgress'), 'width').replace('px', '')) * O.currentTime / O.duration);
            if (showWidth < 0) {
                showWidth = 0;
            }
            f.get('HasPlay').style.width = showWidth + 'px';
        };
        // 播放中断
        f.get('Player').onabort = () => {
            console.info('播放中断');
        };
        // 开始播放，包括第一次播放、暂停后播放、结束后重新播放。
        f.get('Player').onplaying = () => {
            O.isPlay = true;
            f.addClass(f.get('PlayBtn'), 'hide');
            f.removeClass(f.get('PauseBtn'), 'hide');
            console.info('playing');
        };
        // 播放结束
        f.get('Player').onended = () => {
            O.isPlay = false;
            f.removeClass(f.get('PlayBtn'), 'hide');
            f.addClass(f.get('PauseBtn'), 'hide');
            console.log('ended');
        };
        // 加载文件停止，有可能是播放结束，也有可能是其他原因的暂停
        f.get('Player').onsuspend = () => {
            // $(O.toolbar.find('.mp-play').children().hide()[0]).show();
            console.log('suspend');
        };
        // 播放暂停
        f.get('Player').onpause = () => {
            O.isPlay = false;
            f.removeClass(f.get('PlayBtn'), 'hide');
            f.addClass(f.get('PauseBtn'), 'hide');
            console.log('pause');
        };
        // 发生错误。该元素的error属性包含更多信息。
        f.get('Player').onerror = (e, error) => {
            console.error(e, error);
        };
        // 音量改变时触发（包括静音）。
        f.get('Player').onvolumechange = () => {
            O.volume = f.get('Player').volume;
            if (O.volume === 0) {
                console.log('FUCK', f.get('VolumeupBtn'));
                f.removeClass(f.get('VolumeoffBtn'), 'hide');
                f.addClass(f.get('VolumedownBtn'), 'hide');
                f.addClass(f.get('VolumeupBtn'), 'hide');
                f.get('NowVolume').style.width = 0;
            } else if (O.volume < 1) {
                f.addClass(f.get('VolumeoffBtn'), 'hide');
                f.removeClass(f.get('VolumedownBtn'), 'hide');
                f.addClass(f.get('VolumeupBtn'), 'hide');
            } else if (O.volume === 1) {
                f.addClass(f.get('VolumeoffBtn'), 'hide');
                f.addClass(f.get('VolumedownBtn'), 'hide');
                f.removeClass(f.get('VolumeupBtn'), 'hide');
                f.get('NowVolume').style.width = '100%';
            }
        };
        // 播放速率改变
        f.get('Player').onratechange = () => {
            console.log('ratechange');
        };
        // 由于另一个操作（比如搜索）还没有结束，导致当前操作（比如播放）不得不等待。
        f.get('Player').onwaiting = () => {
            console.info('正在加载中,可显示loading');
        };
        // 媒体文件加载后又被清空，比如加载后又调用load方法重新加载。
        f.get('Player').onemptied = () => {
            O.isPlay = false;
            f.removeClass(f.get('PlayBtn'), 'hide');
            f.addClass(f.get('PauseBtn'), 'hide');
            console.log('emptied');
        };
    };
    funcs();
    console.log('input option:', argOption);
    return f[argOption.type + 'Init'](argOption);
}
export default LinPlayer;
