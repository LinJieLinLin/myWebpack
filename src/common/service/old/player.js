/**
 * @author linj
 * 使用方法
 * var player=$().linMusic(option);
 * Option={
 *     src:'音乐连接',
 *     name: '名称',
 *     voice: '音量',
 *     autoplay: '是否自动播放',
 *     id: '有id时，创建对应实例,默认不填只有一个实例'
 * }
 * @type {[type]}
 */
(function($) {
    var playerObj = {};

    function linMusic(argOption) {
        var re = {
            //id
            id: 'linPlayer',
            // player obj
            obj: null,
            // 标题
            name: '',
            // 声音
            voice: 100,
            // 总时长
            duration: 0,
            // 播放进度
            currentTime: 0,
            // 是否正在播放
            isPlay: false,
            // 是否可以播放
            canplay: false,
            // 音量0—1
            volume: 1,
            // 是否自动播放
            autoplay: false,
            // 初始化
            init: function() {
                //cssStart
                var cssTpl = '<style type="text/css" id="tpl-lin-player">.mp{width:400px;position:fixed;left:0;bottom:0;z-index:1000;background-color:#12232E;height:50px;color:#fff;padding-left:15px;padding-right:30px}.mp .hide{display:none}.mp-body{height:30px;margin-top:10px;margin-bottom:10px;padding-left:40px;padding-right:80px;position:relative}.mp-face{position:absolute;left:0;top:0;z-index:0;width:30px;height:100%}.mp-face>img{width:100%;height:100%}.mp-content{position:relative;height:100%}.mp-title{padding-right:90px;position:relative;font-size:14px}.mp-time{position:absolute;right:0;top:0;z-index:0;font-size:14px;color:#576168}.mp-progress{position:absolute;bottom:0;left:0;z-index:0;cursor:pointer;border-radius:2px;width:100%;height:4px;background-color:#595959}.mp-progress>div:first-child{position:absolute;left:0;z-index:1;height:100%;width:0;background-color:#00BFB8}.mp-progress>div:first-child:before{position:absolute;right:-5px;top:50%;z-index:1;-webkit-transform:translate(0,-50%);-moz-transform:translate(0,-50%);-ms-transform:translate(0,-50%);-o-transform:translate(0,-50%);transform:translate(0,-50%);height:10px;width:10px;border-radius:100%;background-color:#00BFB8;content:""}.mp-close,.mp-progress .load{position:absolute;height:100%}.mp-progress .load{left:0;z-index:0;width:0;background-color:#9c9c9c}.mp-close,.mp-volume .volume{cursor:pointer;width:20px;background-color:#03080B}.mp-toolbar{position:absolute;right:0;top:0;z-index:0}.mp-toolbar>div{float:left;line-height:30px;width: 30px;}.mp-toolbar i{cursor:pointer;display:inline-block;min-width:30px}.mp-close{color:#fff;right:0;top:50%;z-index:100;-webkit-transform:translate(0,-50%);-moz-transform:translate(0,-50%);-ms-transform:translate(0,-50%);-o-transform:translate(0,-50%);transform:translate(0,-50%);font-size:20px;text-align:center;line-height:50px}.mp-volume{position:relative}.mp-volume .volume{display:none;position:absolute;bottom:30px;left:0;z-index:0;height:110px;padding-top:10px;padding-bottom:10px}.mp-volume .volume:hover,.mp-volume:hover .volume{display:block}.mp-volume .volume-progress{position:absolute;top:50%;left:0;z-index:0;width:100%;height:100px;-webkit-transform:translate(0,-50%);-moz-transform:translate(0,-50%);-ms-transform:translate(0,-50%);-o-transform:translate(0,-50%);transform:translate(0,-50%)}.mp-volume .volume-progress>div,.mp-volume .volume-progress>div:before{position:absolute;left:50%;-webkit-transform:translate(-50%,0);-moz-transform:translate(-50%,0);-ms-transform:translate(-50%,0);-o-transform:translate(-50%,0);transform:translate(-50%,0);background-color:#00BFB8}.mp-volume .volume-progress>div{bottom:0;z-index:0;height:100%;width:4px;margin:auto}.mp-volume .volume-progress>div:before{top:-5px;z-index:1;height:10px;width:10px;border-radius:100%;content:""}.text-of{overflow:hidden;-o-text-overflow:ellipsis;text-overflow:ellipsis;word-wrap:normal;white-space:nowrap}</style>';
                if (!$("#tpl-lin-player").length) { $("head").prepend(cssTpl); }
                //cssEnd
                var htmlTpl = '<div class="mp" id="' + re.id + '"><audio src=""><span>你的浏览器不支持音频播放！</span></audio><div class="mp-body"><div class="mp-face"><img src="data:img/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjU0RjZFNEFFNDlENTExRTc4RjI2RkVCRTA5RjUxQkMwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjU0RjZFNEFGNDlENTExRTc4RjI2RkVCRTA5RjUxQkMwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NTRGNkU0QUM0OUQ1MTFFNzhGMjZGRUJFMDlGNTFCQzAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NTRGNkU0QUQ0OUQ1MTFFNzhGMjZGRUJFMDlGNTFCQzAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7DPxWLAAADQUlEQVR42sxXS0hUURj+7sN5j47vGTUxsAf2EKSyoIUtRJCIFkHRolWLiCjctYmMNu2KFrVpUUtBaCFF4KIIil4WYopQUZo1ma/xMXfe9/adc7VVC0fHawfOzJw5h/N9//9//3/OUSzLAlsde4S9CM60DHuUfULnR8OV1zMnHo8bXRnTCjmBXqQqsc56383rreW9Cj1wqLlnvD9nwQ8Hm6YgPniyvl0Vv00LHjjciOkV2IKAqShIOU2AmEmBrWKT27oJKOyLGRNpikhVHCZAISGWNlHl1QmuSBKKkwSmEib2VbrR1xnB+d3FGFvMOuMBGoslun2B1pd7NIR9Gi7uDaG12oOokcvLC3kTEHGOE7yMwFsCGh6MLuDeyIKcu7q/jGEwkbM2kMB8ykSNX8eTozW41BxCNmvh1lAMSX4fqfXiYNiDuVSu8ASE5QZB0qwgKZpYQQ+c21WCFgIO/07h4de4XNde55PCLCgB2+2s1bpCxWsYnE6j++2MnDvVGARZ4dlPQ44PVHkQ0FVkzQISWCJ40KWgpyOM09uDyHD359GknDsc8aCIIhydy8hxY8iFCpLkwbYqAvpqFmW5mUptN5W6YJCMi56YNOw411KIpQScSdrjSo8KLwtEQrpAWb8HhB0i9m21Pjk2uLH4jxJYOVScKcXBIntp/4SBTCJHb7jl+DuLzxzH5cuMppImEhSppiiFCYHYRhSa+8z3T/NpjDDWOl1+ZkdQzr/4lUSG4dhZal+mPnPNNMNR7tYKpwFhjJ8e6J9IyHBcbilDR71P1v7eL0uAS0VbjR2iN5NJWSWrvVrhQiCujSIVK7mp8PRKOG4PzWOA2dBU5cbxrf6/IQq5Vl/f9HwFE+bJd3c4huHZFAamUpJZ154QvMyMpz8SePUrhbqAvjEEsHyH8pDKozFDhuBCcwnONhXLuWvvZuHS7GPa2qizQKSdAKimMAWZbSW2+G68n6P1SUR8OvLJTH2t+Wtnh447HxfwgaX5JcHrA/rG1YF/3+/tUtX3Lc5PXq2pg3zrkr4eAiIcOkUo6sRaq+J/cStWmedup4Et+zGkCgI51X4kOGs5D0yBLTQQPdbg796Mx6nAVjb7ef5HgAEA9AY8YRWZTYoAAAAASUVORK5CYII=" /></div><div class="mp-content"><div class="mp-title text-of"><span class="title">暂无数据</span><div class="mp-time"><span class="currentTime">00:00</span><span>/</span><span class="duration">00:00</span></div></div><div class="mp-progress"><div></div><div class="load"></div></div></div><div class="mp-toolbar"><div class="mp-play"><i class="fa fa-play" aria-hidden="true"></i><i class="fa fa-pause hide" aria-hidden="true"></i></div><div class="mp-volume"><div class="volume"><div class="volume-progress"><div></div></div></div><i class="fa fa-volume-off hide" aria-hidden="true"></i><i class="fa fa-volume-down hide" aria-hidden="true"></i><i class="fa fa-volume-up" aria-hidden="true"></i></div></div></div><div class="mp-close">×</div></div>';
                if (!$("#" + re.id).length) { $("body").prepend(htmlTpl); }
                re.progress = $('#' + re.id + ' .mp-progress');
                re.title = $('#' + re.id + ' .mp-title .title');
                re.toolbar = $('#' + re.id + ' .mp-toolbar');
                re.title.html(re.name);
                getPlayer(re.id, re.src);
                $('#' + re.id).show();
            },
            /**
             * 暂停全部
             * @return {[type]} [description]
             */
            pauseAll: function() {
                for (var k in playerObj) {
                    $('#' + k).hide();
                    if (playerObj[k]) {
                        if (playerObj[k].readyState <= 2) {
                            console.log('移除加载中的');
                            $('#' + k).remove();
                            playerObj[k] = null;
                        } else {
                            playerObj[k].pause();
                        }
                    }
                }
            },
            /**
             * 移除全部
             * @return {[type]} [description]
             */
            clearAll: function() {
                for (var k in playerObj) {
                    $('#' + k).remove();
                }
                playerObj = {};
            },
        };
        /**
         * 获取播放器实例
         * @param  {[type]} argId [id]
         * @param  {[type]} argSrc [src]
         * @return {[type]}       [description]
         */
        function getPlayer(argId, argSrc) {
            for (var k in playerObj) {
                $('#' + k).hide();
                if (playerObj[k]) {
                    playerObj[k].pause();
                }
            }
            if (!playerObj[argId]) {
                playerObj[argId] = $('#' + argId + ' audio')[0];
                re.obj = playerObj[argId];
                $(playerObj[argId]).attr('src', argSrc);
                // 播放控制
                re.toolbar.find('.mp-play').off('click', on.play).on('click', on.play);
                // 播放进度
                re.progress.off('mousedown', on.playProgress).on('mousedown', on.playProgress);
                // 设置静音
                re.toolbar.find('.mp-volume i').off('click', on.setVolume).on('click', on.setVolume);
                // 设置音量
                re.toolbar.find('.mp-volume .volume-progress').off('mousedown', on.volumeProgress).on('mousedown', on.volumeProgress);
                // 关闭音频
                $('#' + re.id + ' .mp-close').off('click', on.close).on('click', on.close);
                re.isPlay = false;
                onPlayer(playerObj[argId]);
            } else {
                re.obj = playerObj[argId];
                if ($(playerObj[argId]).attr('src') === argSrc) {
                    if (re.obj && re.obj.currentTime) {
                        re.obj.currentTime = 0;
                        re.currentTime = 0;
                    }
                    if (re.autoplay) {
                        re.obj.play();
                    }
                } else {
                    $(playerObj[argId]).attr('src', argSrc);
                }
            }
        }
        /**
         * 计算音乐时长
         * @param  {[type]} argTime [description]
         * @return {[type]}         [description]
         */
        function countTime(argTime) {
            var time = '',
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
        }
        /**
         * 监听事件
         * @param  {[type]} argObj [description]
         * @return {[type]}        [description]
         */
        function onPlayer(argObj) {
            // 播放器监听
            $(argObj).on({
                // 开始加载音频和视频。 
                'loadstart': function(e) {
                    // console.log('开始加载音频和视频。', e);
                },
                // 音频和视频的duration属性（时长）发生变化时触发，即已经知道媒体文件的长度。
                'durationchange': function(e) {
                    re.duration = re.obj.duration;
                    $('#' + re.id + ' .mp-time .duration').html(countTime(re.duration));
                    $(re.toolbar.find('.mp-volume .volume-progress').children()[0]).height('100%');
                    // console.log('获取总时长:秒',re.obj.duration,e);
                },
                // 浏览器正在下载媒体文件，周期性触发。下载信息保存在元素的buffered属性中。  
                'progress': function(e) {
                    var count = 0;
                    if (re.obj.buffered.length) {
                        for (var i = 0; i < re.obj.buffered.length; i++) {
                            count += re.obj.buffered.end(i) - re.obj.buffered.start(i);
                        }
                        console.log(count);
                        var loadWidth = re.progress.width() * count / re.duration;
                        if (loadWidth < 0) {
                            loadWidth = 0;
                        }
                        $(re.progress.children()[1]).width(loadWidth);
                    }
                },
                // 浏览器准备好播放，即使只有几帧，readyState属性变为CAN_PLAY。
                'canplay': function(e) {
                    re.canplay = true;
                    if (re.autoplay) {
                        re.obj.play();
                    }
                    console.log('canplay');
                },
                // 浏览器认为可以不缓冲（buffering）播放时触发，即当前下载速度保持不低于播放速度，readyState属性变为CAN_PLAY_THROUGH。
                'canplaythrough': function(e) {
                    re.canplay = true;
                    console.log('canplaythrough');
                },
                // 网页元素的currentTime属性改变时触发。
                'timeupdate': function(e) {
                    if (re.obj.currentTime > re.duration) {
                        re.obj.currentTime = re.duration;
                    }
                    re.currentTime = re.obj.currentTime;
                    $('#' + re.id + ' .mp-time .currentTime').html(countTime(re.currentTime));
                    var showWidth = Math.round(re.progress.width() * re.currentTime / re.duration);
                    if (showWidth < 0) {
                        showWidth = 0;
                    }
                    $(re.progress.children()[0]).width(showWidth);
                },
                // 播放中断
                'abort': function(e) {
                    console.info('播放中断');
                },
                // 开始播放，包括第一次播放、暂停后播放、结束后重新播放。
                'playing': function() {
                    re.isPlay = true;
                    $(re.toolbar.find('.mp-play').children().hide()[1]).show();
                    console.info('playing');
                },
                // 播放结束
                'ended': function(e) {
                    re.isPlay = false;
                    $(re.toolbar.find('.mp-play').children().hide()[0]).show();
                    console.log('ended');
                },
                // 加载文件停止，有可能是播放结束，也有可能是其他原因的暂停
                'suspend': function(e) {
                    // $(re.toolbar.find('.mp-play').children().hide()[0]).show();
                    console.log('suspend');
                },
                // 播放暂停  
                'pause': function(e) {
                    re.isPlay = false;
                    $(re.toolbar.find('.mp-play').children().hide()[0]).show();
                    console.log('pause');
                },
                // 发生错误。该元素的error属性包含更多信息。
                'error': function(e) {
                    console.error(e, '音频无效');
                    $('#' + re.id + ' .mp-time .currentTime').html('00:00');
                    $('#' + re.id + ' .mp-time .duration').html('00:00');
                },
                // 音量改变时触发（包括静音）。 
                'volumechange': function(e) {
                    re.volume = re.obj.volume;
                    if (re.volume === 0) {
                        $(re.toolbar.find('.mp-volume .volume-progress').children()[0]).height(0);
                        $(re.toolbar.find('.mp-volume i').hide()[0]).show();
                    } else if (re.volume < 1) {
                        $(re.toolbar.find('.mp-volume i').hide()[1]).show();
                    } else if (re.volume === 1) {
                        $(re.toolbar.find('.mp-volume .volume-progress').children()[0]).height('100%');
                        $(re.toolbar.find('.mp-volume i').hide()[2]).show();
                    }

                },
                // 播放速率改变 
                'ratechange': function() {
                    console.log('ratechange');
                },
                // 由于另一个操作（比如搜索）还没有结束，导致当前操作（比如播放）不得不等待。
                'waiting': function(e) {
                    console.info('正在加载中,可显示loading');
                },
                // 媒体文件加载后又被清空，比如加载后又调用load方法重新加载。
                'emptied': function(e) {
                    re.isPlay = false;
                    $(re.toolbar.find('.mp-play').children().hide()[0]).show();
                    console.log('emptied');
                },
                // play    暂停后重新开始播放  
                // seeked    搜索操作结束  
                // seeking    搜索操作开始  
                // stalled    浏览器开始尝试读取媒体文件，但是没有如预期那样获取数据    
            });
        }
        //监听事件
        var on = {
            /**
             * 播放/暂停事件
             * @return {[type]} [description]
             */
            play: function() {
                console.log('status:', re.obj.readyState);
                if (re.obj.readyState <= 2) {
                    // re.obj.load();
                    console.log('暂时播放不了，请等待');
                    if (!re.canplay) {
                        return;
                    }
                }
                re.isPlay = !re.isPlay;
                if (re.isPlay) {
                    re.obj.play();
                    return;
                } else {
                    re.obj.pause();
                    return;
                }

            },
            /**
             * 设置声音
             */
            setVolume: function() {
                if (re.volume) {
                    re.obj.volume = 0;
                } else {
                    re.obj.volume = 1;
                }
            },
            /**
             * [设置播放进度]
             * @param  {[type]} e [event]
             * @return {[type]}   [description]
             */
            playProgress: function(e) {
                var temThis = this;

                function drag(e) {
                    if (re.obj.readyState > 2) {
                        var offsetLeft = $(temThis).offset().left,
                            showWidth = e.pageX - offsetLeft,
                            progressWidth = $(temThis).width() - 5;

                        // console.log($(temThis).width(), offsetLeft, showWidth);
                        if (showWidth < 0) {
                            showWidth = 0;
                        }
                        if (showWidth > progressWidth) {
                            showWidth = progressWidth;
                        }
                        re.currentTime = re.duration * (showWidth / progressWidth);
                        //设置播放时间
                        re.obj.currentTime = re.currentTime;
                        $($(temThis).children()[0]).width(showWidth);
                    }
                }
                $(this).off('mousemove', drag).on('mousemove', drag);
                $(document).off('mouseup', function() {
                    $(temThis).off('mousemove', drag);
                }).on('mouseup', function() {
                    $(temThis).off('mousemove', drag);
                });
                drag(e);
            },
            /**
             * [设置音量大小]
             * @param  {[type]} e [event]
             * @return {[type]}   [description]
             */
            volumeProgress: function(e) {
                var temThis = this;

                function drag(e) {
                    var offsetTop = $(temThis).offset().top,
                        progressHeight = $(temThis).height(),
                        showHeight = progressHeight - e.pageY + offsetTop;

                    // console.log(re.progress.height(), e.pageY, offsetTop, showHeight);
                    if (showHeight < 0) {
                        showHeight = 0;
                    }
                    if (showHeight > progressHeight) {
                        showHeight = progressHeight;
                    }
                    re.volume = (showHeight / progressHeight);
                    if (re.volume > 0.9) {
                        re.volume = 1;
                    }
                    //设置音量
                    re.obj.volume = re.volume;
                    if (re.volume === 1) {
                        $($(temThis).children()[0]).height('100%');
                    } else {
                        $($(temThis).children()[0]).height(showHeight);
                    }
                }
                $(this).off('mousemove', drag).on('mousemove', drag);
                $(document).off('mouseup', function() {
                    $(temThis).off('mousemove', drag);
                }).on('mouseup', function() {
                    $(temThis).off('mousemove', drag);
                });
                drag(e);
            },
            close: function() {
                $('#' + re.id).hide();
                $(re.obj).attr('src', '');
            },
        };
        $.extend(re, argOption);
        re.init();
        return re;
    };
    $.extend({
        /**
         * music player
         * @param  {[type]} argOption [参数]
         * @return {[type]}           [player信息]
         */
        linMusic: function(argOption) {
            return linMusic(argOption);
        }
    });
})($);